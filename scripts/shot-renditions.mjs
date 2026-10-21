/**
 * Proje ekran görüntülerinin küçük kopyaları (srcset adayları).
 *
 *   npm run shots               eksik ya da eskimiş kopyaları üretir (sharp)
 *   node scripts/shot-renditions.mjs --check   yalnız denetler; sharp gerekmez
 *
 * Asıl dosya `public/projects/<slug>/<görünüm>-<tema>.webp` (2x çekim);
 * kopyası yanında `<görünüm>-<tema>.w<genişlik>.webp`. `.w` ara eki mevcut
 * adlarla çakışmaz (`desktop-2-dark.webp` zaten var). Genişlikler
 * lib/content/shot-renditions.json'da; site srcset'i aynı dosyadan kurar
 * (lib/content/project-shots.ts). Ad düzeni lib/project-shot.ts →
 * `shotRendition` ile aynı olmalı.
 *
 * Yalnız küçültür: asıl dosyadan geniş ya da ona eşit genişlik atlanır
 * (sitedeki srcset de atlar). WebP q80, asıl çekimlerle aynı.
 *
 * Eskime tarihle değil özetle ölçülür: Vercel depoyu her derlemede baştan
 * klonlar ve dosya tarihleri o anın sırasıyla yazılır. Her asıl dosyanın
 * SHA-1'i scripts/shot-renditions.lock.json'da; çekim yenilenince özet
 * tutmaz ve `--check` (prebuild) derlemeyi kırar. Canlı site eski
 * yayında kalır, kırık srcset yayına çıkmaz.
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SHOTS = join(ROOT, 'public/projects')
const LOCK = join(ROOT, 'scripts/shot-renditions.lock.json')
const WIDTHS = JSON.parse(readFileSync(join(ROOT, 'lib/content/shot-renditions.json'), 'utf8'))
const MASTER = /^(desktop|desktop-2|mobile)-(light|dark)\.webp$/
const RENDITION = /\.w\d+\.webp$/
const QUALITY = 80
const CHECK = process.argv.includes('--check')

const rel = (file) => relative(ROOT, file)
const sha1 = (file) => createHash('sha1').update(readFileSync(file)).digest('hex')
const renditionPath = (master, width) => master.replace(/\.webp$/, `.w${width}.webp`)

/** WebP başlığından genişlik (VP8X / VP8 / VP8L); sharp'sız denetim için. */
function webpWidth(file) {
  const b = readFileSync(file)
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`${rel(file)}: WebP değil`)
  const chunk = b.toString('ascii', 12, 16)
  if (chunk === 'VP8X') return 1 + b.readUIntLE(24, 3)
  if (chunk === 'VP8 ') return b.readUInt16LE(26) & 0x3fff
  if (chunk === 'VP8L') return 1 + (b.readUInt16LE(21) & 0x3fff)
  throw new Error(`${rel(file)}: tanınmayan WebP bölümü ${chunk}`)
}

function masters() {
  return readdirSync(SHOTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      readdirSync(join(SHOTS, d.name))
        .filter((name) => MASTER.test(name))
        .map((name) => ({ file: join(SHOTS, d.name, name), view: name.match(MASTER)[1] })),
    )
    .sort((a, b) => a.file.localeCompare(b.file))
}

/** Her asıl dosya için üretilmesi gereken kopyalar ve durumu. */
function plan(lock) {
  return masters().map(({ file, view }) => {
    const width = webpWidth(file)
    const hash = sha1(file)
    const outputs = (WIDTHS[view] ?? []).filter((w) => w < width).map((w) => ({ width: w, file: renditionPath(file, w) }))
    const stale = lock[rel(file)] !== hash
    return { file, hash, outputs, todo: outputs.filter((o) => stale || !existsSync(o.file)) }
  })
}

const lock = existsSync(LOCK) ? JSON.parse(readFileSync(LOCK, 'utf8')) : {}
const items = plan(lock)
const todo = items.flatMap((item) => item.todo.map((o) => ({ ...o, master: item.file })))

if (CHECK) {
  if (todo.length > 0) {
    for (const o of todo) {
      const why = existsSync(o.file) ? 'asıl görsel değişmiş, kopya eski' : 'kopya yok'
      console.error(`✗ ${rel(o.file)}: ${why} (asıl: ${rel(o.master)})`)
    }
    console.error(`\n${todo.length} ekran görüntüsü kopyası eksik ya da eski. Düzeltmek için: npm run shots`)
    process.exit(1)
  }
  process.stdout.write(`✓ ${items.reduce((n, item) => n + item.outputs.length, 0)} ekran görüntüsü kopyası güncel\n`)
} else {
  const { default: sharp } = await import('sharp')
  for (const o of todo) {
    await sharp(o.master).resize({ width: o.width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(o.file)
    process.stdout.write(`+ ${rel(o.file)}\n`)
  }
  /* Genişlik listeden çıkarıldıysa ya da asıl dosya silindiyse kopyası da gider. */
  const expected = new Set(items.flatMap((item) => item.outputs.map((o) => o.file)))
  for (const dir of readdirSync(SHOTS, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const name of readdirSync(join(SHOTS, dir.name)).filter((n) => RENDITION.test(n))) {
      const file = join(SHOTS, dir.name, name)
      if (!expected.has(file)) {
        rmSync(file)
        process.stdout.write(`- ${rel(file)}\n`)
      }
    }
  }
  const next = Object.fromEntries(items.map((item) => [rel(item.file), item.hash]))
  writeFileSync(LOCK, `${JSON.stringify(next, null, 2)}\n`)
  process.stdout.write(`${todo.length} kopya üretildi; ${rel(LOCK)} güncel\n`)
}
