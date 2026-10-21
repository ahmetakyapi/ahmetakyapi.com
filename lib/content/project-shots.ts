import { projectShot, shotRendition, type ShotView } from '@/lib/project-shot'
import RENDITIONS from './shot-renditions.json'

/**
 * Ekran görüntüsü envanteri: hangi projenin hangi görünümü var, iki temalı
 * mı ve kaç piksel. `public/projects/<slug>/` ile BİREBİR; dosya eklenir ya
 * da silinirse burası da değişir.
 *
 * - Tam set (desktop + desktop-2 + mobile, 2160×1350 / 780×1688): 10 Ekim
 *   2026'da HER proje canlı sitesinden yeniden çekildi (başlık üstü
 *   künyeler kaldırıldıktan, açılışlar yenilendikten sonra). Masaüstü
 *   1080×675 ve telefon 390×844, ikisi de 2x; WebP q80. OG kartının
 *   kaynağı `assets/project-og/<slug>.jpg` masaüstü koyu görselden.
 * - karalama, dungeon-mates ve ramazan-vakitleri yalnız KOYU temalı
 *   uygulamalar: iki dosya da koyu, o yüzden `themed: false` (tek görsel,
 *   ikisini indirmeye gerek yok).
 * - dev-starter: ekran görüntüsü yok, README afişi (1280×360, iki temalı SVG).
 *   Afişteki başlık gradyanla DOLDURULMAZ: WebKit `<img>` içindeki SVG'de
 *   gradyanlı metni düşük çözünürlükte basıp büyütüyor ve iPhone'da yalnız
 *   başlık bulanık görünüyordu (4 Ekim 2026). İki düz renkli `tspan`.
 * - ahmetakyapi-com: henüz yok (yeni site bitince çekilecek); tipografik kapak.
 * - Küçük kopyalar (srcset adayları): her asıl dosyanın yanında
 *   `<görünüm>-<tema>.w<genişlik>.webp`, genişlikler shot-renditions.json'da.
 *   `npm run shots` üretir; prebuild'deki `--check` eksik ya da eski kopyada
 *   derlemeyi kırar (scripts/shot-renditions.mjs). Çekim yenilenince
 *   `npm run shots` yeniden çalıştırılır.
 *
 * Eski düz dosyalar (`public/projects/<slug>.webp`) faz 2 bitince silinecek;
 * yeni kod onları KULLANMAZ.
 */
type Size = { width: number; height: number }

export type ShotSet = {
  views: readonly ShotView[]
  /** false: tek görsel (açık dosyası okunur), tema ile değişmez. */
  themed: boolean
  size: Readonly<Partial<Record<ShotView, Size>>>
  /**
   * Görsel her temada koyu (tek temalı koyu uygulama ya da eski koyu
   * çekim). Açık temada kapak çerçevesi bir ton güçlenir: koyu görselin
   * kenarı açık zeminde çerçevesiz bir delik gibi duruyordu. Ölçüldü:
   * açık dosyaların ortalama parlaklığı koyu temalı çekimlerde 24-36 / 255.
   */
  darkInk?: boolean
  /** İki temada da koyu görsel gösterilir (açık görsel okunmuyorsa). */
  alwaysDark?: boolean
}

const FULL = { desktop: { width: 2160, height: 1350 }, 'desktop-2': { width: 2160, height: 1350 }, mobile: { width: 780, height: 1688 } } as const
const ALL_VIEWS = ['desktop', 'desktop-2', 'mobile'] as const

export const PROJECT_SHOTS = {
  'acilis-zili': { views: ALL_VIEWS, themed: true, size: FULL },
  digynotes: { views: ALL_VIEWS, themed: true, size: FULL },
  derinay: { views: ALL_VIEWS, themed: true, size: FULL },
  mimio: { views: ALL_VIEWS, themed: true, size: FULL },
  /* Açık temanın görselinde başlık altın rengi ve parlak bir resmin üstünde
     okunmuyordu (3 Ekim 2026); iki temada da koyu görsel. */
  'onepiece-hub': { views: ALL_VIEWS, themed: true, size: FULL, alwaysDark: true, darkInk: true },
  elevenforge: { views: ALL_VIEWS, themed: true, size: FULL },
  keskealsaydim: { views: ALL_VIEWS, themed: true, size: FULL },
  harfiyen: { views: ALL_VIEWS, themed: true, size: FULL },
  karalama: { views: ALL_VIEWS, themed: false, size: FULL, darkInk: true },
  'dungeon-mates': { views: ALL_VIEWS, themed: false, size: FULL, darkInk: true },
  'ramazan-vakitleri': { views: ALL_VIEWS, themed: false, size: FULL, darkInk: true },
} as const satisfies Record<string, ShotSet>

export type ShotSlug = keyof typeof PROJECT_SHOTS

/** dev-starter'ın README afişi: görseli olmayan proje için kapak. */
export const DEV_STARTER_BANNER = {
  light: '/projects/dev-starter/banner-light.svg',
  dark: '/projects/dev-starter/banner-dark.svg',
  width: 1280,
  height: 360,
} as const

export type ShotSources = {
  light: string
  dark?: string
  width: number
  height: number
  /** Temaya göre srcset (küçük kopyalar + asıl dosya); ThemedImage'a `sizes` ile. */
  srcSet?: { light: string; dark?: string }
}

const WIDTHS: Readonly<Partial<Record<ShotView, readonly number[]>>> = RENDITIONS

/** Asıl dosya ve küçük kopyaları: `… 640w, … 1280w, <asıl> 2160w`. Yalnız küçültülür. */
function srcSetOf(src: string, view: ShotView, width: number): string | undefined {
  const smaller = (WIDTHS[view] ?? []).filter((w) => w < width)
  if (smaller.length === 0) return undefined
  return [...smaller.map((w) => `${shotRendition(src, w)} ${w}w`), `${src} ${width}w`].join(', ')
}

/**
 * ThemedImage'a doğrudan verilecek kaynaklar; görünüm yoksa `null`.
 *
 *   const shot = shotSources('mimio', 'desktop')
 *   shot && <ThemedImage {...shot} alt="…" />
 */
export function shotSources(slug: string, view: ShotView): ShotSources | null {
  if (!(slug in PROJECT_SHOTS)) return null
  const set: ShotSet = PROJECT_SHOTS[slug as ShotSlug]
  const size = set.size[view]
  if (!set.views.includes(view) || !size) return null
  const light = projectShot(slug, view, set.alwaysDark ? 'dark' : 'light')
  const dark = set.themed && !set.alwaysDark ? projectShot(slug, view, 'dark') : undefined
  const lightSet = srcSetOf(light, view, size.width)
  return {
    light,
    dark,
    width: size.width,
    height: size.height,
    srcSet: lightSet ? { light: lightSet, dark: dark && srcSetOf(dark, view, size.width) } : undefined,
  }
}

/** Görsel her temada koyu mu (bkz. `ShotSet.darkInk`). */
export function isDarkInk(slug: string): boolean {
  if (!(slug in PROJECT_SHOTS)) return false
  const set: ShotSet = PROJECT_SHOTS[slug as ShotSlug]
  return set.darkInk === true
}
