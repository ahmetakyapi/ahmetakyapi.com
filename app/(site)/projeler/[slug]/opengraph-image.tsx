import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { splitLead } from '@/components/projects/project-text'
import { DEV_STARTER_BANNER, shotSources } from '@/lib/content/project-shots'
import { getProjectBySlug, projects } from '@/lib/content/projects'
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'

export const alt = 'Ahmet Akyapı projelerinden birinin paylaşım kartı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/* Kartlar derleme anında üretilsin: her paylaşım önizlemesi bir fonksiyon
   çağrısı olmasın. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

/**
 * Proje detayının paylaşım kartı: solda ad ve tek cümle, sağda projenin
 * GERÇEK ekran görüntüsü (koyu tema), kartın kenarından taşarak.
 *
 * Adres rota grubu yüzünden sonekli (`/projeler/<slug>/opengraph-image-<özet>`);
 * JSON-LD lib/seo.ts → `projectOgImagePath` ile hesaplıyor.
 *
 * Satori CSS değişkeni çözmez: renkler `signature` koyu paletinden sabit
 * (lib/og.tsx ile aynı değerler; orada değişirse burada da). Görsel
 * diskten okunup veri adresi olarak gömülüyor: ağ turu yok.
 */
const C = {
  ground: '#070d16',
  ink: '#eaf1f8',
  body: '#94a7ba',
  muted: '#8497a9',
  primary: '#35b8ff',
  line: 'rgba(255,255,255,0.14)',
  surface: 'rgba(255,255,255,0.05)',
  brandFrom: '#5cc4ff',
  brandMid: '#1f86e0',
  brandTo: '#0b3f86',
  onBrand: '#ffffff',
} as const

/** Ekran görüntüsünün kartta kapladığı genişlik; sağdan ve alttan taşar. */
const SHOT_WIDTH = 700
const SHOT_LEFT = 560
const SHOT_TOP = 150
/** Tek cümle bu uzunluğu geçerse kısaltılır (en çok üç satır, 24 punto). */
const LEAD_MAX = 120
const TITLE_MAX = 96
const GLYPH_EM = 0.54
/** Bundan geniş görsel ekran görüntüsü değil afiştir (dev-starter 3,5:1). */
const BANNER_RATIO = 2

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }

/* lib/og.tsx'teki yükleyicinin kopyası: orası dışa aktarmıyor ve ortak
   dosya bu fazda değişmiyor (öneri olarak raporlandı). */
let fontCache: Promise<OgFont[]> | null = null
function loadFonts(): Promise<OgFont[]> {
  fontCache ??= (async () => {
    const dir = join(process.cwd(), 'assets', 'fonts')
    const [regular, bold] = await Promise.all([
      readFile(join(dir, 'SchibstedGrotesk-Regular.ttf')),
      readFile(join(dir, 'SchibstedGrotesk-Bold.ttf')),
    ])
    const ab = (buf: Buffer) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
    return [
      { name: 'Schibsted', data: ab(regular), weight: 400, style: 'normal' },
      { name: 'Schibsted', data: ab(bold), weight: 700, style: 'normal' },
    ]
  })()
  return fontCache
}

function toDataUrl(buf: Buffer, mime: string) {
  return `data:${mime};base64,${buf.toString('base64')}`
}

/**
 * Kartın görseli: koyu masaüstü görüntüsü, yoksa dev-starter afişi, yoksa hiç.
 *
 * Görüntü `public/`teki WebP DEĞİL, `assets/project-og/<slug>.jpg`: Satori
 * WebP'yi tanıyor ama çizemiyor (derleme "u2 is not iterable" ile
 * kırıldı, 3 Ekim 2026, Next 16.3.8). JPEG'ler koyu masaüstü
 * görüntüsünden 1050 piksel genişlikte üretildi (sharp, kalite 78);
 * ekran görüntüsü değişirse yeniden üretilmeli.
 */
async function coverFor(slug: string): Promise<{ src: string; width: number; height: number } | null> {
  const shot = shotSources(slug, 'desktop')
  if (shot) {
    /* Yol sabit bir alt klasöre bağlı: Turbopack yalnız onu izler. Değişken
       bir yol bütün projeyi (public/ dahil) sunucu paketine çekiyordu. */
    const buf = await readFile(join(process.cwd(), 'assets', 'project-og', `${slug}.jpg`))
    return { src: toDataUrl(buf, 'image/jpeg'), width: shot.width, height: shot.height }
  }
  if (slug === 'dev-starter') {
    const buf = await readFile(join(process.cwd(), 'public', 'projects', 'dev-starter', 'banner-dark.svg'))
    return {
      src: toDataUrl(buf, 'image/svg+xml'),
      width: DEV_STARTER_BANNER.width,
      height: DEV_STARTER_BANNER.height,
    }
  }
  return null
}

function clip(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  const [fonts, cover] = await Promise.all([loadFonts(), project ? coverFor(project.slug) : null])

  const title = project?.title ?? 'Projeler'
  const lead = project ? clip(splitLead(project.description).lead, LEAD_MAX) : ''
  const textWidth = cover ? SHOT_LEFT - 64 - 40 : 1000
  /* En uzun kelime satıra sığsın: "dev-starter" 96 puntoda tirede
     bölünüyordu. Kalın Schibsted'de harf başına ~0,54 em. */
  const longestWord = Math.max(...title.split(' ').map((w) => w.length))
  const titleSize = Math.min(TITLE_MAX, Math.floor(textWidth / (longestWord * GLYPH_EM)))
  const shotHeight = cover ? Math.round((SHOT_WIDTH * cover.height) / cover.width) : 0
  /* Geniş afiş (dev-starter) kartın dikey ortasında; ekran görüntüsü üstten
     başlar ve alttan taşar. */
  const isBanner = cover ? cover.width / cover.height > BANNER_RATIO : false
  const shotTop = isBanner ? Math.round((OG_SIZE.height - shotHeight) / 2) : SHOT_TOP

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: C.ground,
          color: C.ink,
          fontFamily: 'Schibsted, sans-serif',
        }}
      >
        {cover ? (
          <div
            style={{
              position: 'absolute',
              left: SHOT_LEFT,
              top: shotTop,
              width: SHOT_WIDTH,
              display: 'flex',
              borderRadius: 20,
              border: `2px solid ${C.line}`,
              overflow: 'hidden',
              backgroundColor: C.surface,
            }}
          >
            {/* `<img>` yerine zemin görseli: Satori ikisini de okuyor, lint
                kuralı (`no-img-element`) yalnız ilkine takılıyor. */}
            <div
              style={{
                display: 'flex',
                width: SHOT_WIDTH,
                height: shotHeight,
                backgroundImage: `url(${cover.src})`,
                backgroundSize: '100% 100%',
              }}
            />
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '60px 64px 56px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: C.brandMid,
                backgroundImage: `linear-gradient(150deg, ${C.brandFrom} 0%, ${C.brandMid} 48%, ${C.brandTo} 100%)`,
              }}
            >
              <svg width={30} height={30} viewBox="0 0 42 42" fill="none">
                <path d="M21 12L30 29H12L21 12Z" stroke={C.onBrand} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ display: 'flex', marginLeft: 16, fontSize: 24, fontWeight: 700 }}>Ahmet Akyapı</div>
            <div style={{ display: 'flex', marginLeft: 14, fontSize: 22, color: C.muted }}>Projeler</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: textWidth }}>
            {project ? (
              <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: C.primary }}>{project.category}</div>
            ) : null}
            <div
              style={{
                display: 'flex',
                marginTop: 14,
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}
            >
              {title}
            </div>
            {lead ? (
              <div style={{ display: 'flex', marginTop: 22, fontSize: 24, lineHeight: 1.4, color: C.body }}>{lead}</div>
            ) : null}
          </div>

          <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: C.muted }}>ahmetakyapi.com/projeler</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  )
}
