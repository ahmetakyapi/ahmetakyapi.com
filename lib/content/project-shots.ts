import { projectShot, type ShotView } from '@/lib/project-shot'

/**
 * Ekran görüntüsü envanteri: hangi projenin hangi görünümü var, iki temalı
 * mı ve kaç piksel. `public/projects/<slug>/` ile BİREBİR; dosya eklenir ya
 * da silinirse burası da değişir.
 *
 * - Tam set (desktop + desktop-2 + mobile, 2160×1350 / 780×1688): yeni
 *   çekimler. digynotes, derinay ("Atölye Sahnesi") ve elevenforge
 *   ("Floodlight") 9 Ekim 2026'da yeniden tasarımla tam sete geçti.
 *   karalama ve dungeon-mates yalnız KOYU temalı: iki dosya da
 *   koyu, o yüzden `themed: false` (tek görsel, ikisini indirmeye gerek yok).
 * - Yalnız desktop, 1280×800: eski görselin kopyası; iki dosya aynı.
 * - dev-starter: ekran görüntüsü yok, README afişi (1280×360, iki temalı SVG).
 *   Afişteki başlık gradyanla DOLDURULMAZ: WebKit `<img>` içindeki SVG'de
 *   gradyanlı metni düşük çözünürlükte basıp büyütüyor ve iPhone'da yalnız
 *   başlık bulanık görünüyordu (4 Ekim 2026). İki düz renkli `tspan`.
 * - ahmetakyapi-com: henüz yok (yeni site bitince çekilecek); tipografik kapak.
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
   * açık dosyaların ortalama parlaklığı bu yedisinde 24-36 / 255.
   */
  darkInk?: boolean
  /** İki temada da koyu görsel gösterilir (açık görsel okunmuyorsa). */
  alwaysDark?: boolean
}

const FULL = { desktop: { width: 2160, height: 1350 }, 'desktop-2': { width: 2160, height: 1350 }, mobile: { width: 780, height: 1688 } } as const
const LEGACY = { desktop: { width: 1280, height: 800 } } as const
const ALL_VIEWS = ['desktop', 'desktop-2', 'mobile'] as const
const DESKTOP_ONLY = ['desktop'] as const

export const PROJECT_SHOTS = {
  'acilis-zili': { views: ALL_VIEWS, themed: true, size: FULL },
  mimio: { views: ALL_VIEWS, themed: true, size: FULL },
  /* Açık temanın görselinde başlık altın rengi ve parlak bir resmin üstünde
     okunmuyordu (3 Ekim 2026); iki temada da koyu görsel. */
  'onepiece-hub': { views: ALL_VIEWS, themed: true, size: FULL, alwaysDark: true, darkInk: true },
  karalama: { views: ALL_VIEWS, themed: false, size: FULL, darkInk: true },
  'dungeon-mates': { views: ALL_VIEWS, themed: false, size: FULL, darkInk: true },
  harfiyen: { views: DESKTOP_ONLY, themed: false, size: LEGACY, darkInk: true },
  /* "Atölye Sahnesi" görsel revizyonu sonrası tam set (9 Ekim 2026): landing
     kahramanı, vitrindeki panel kesiti ve telefon kahramanı; iki temalı.
     desktop-2 iki temada da koyu: vitrin landing'in "gece adası", tema
     değişse de koyu kalır. */
  derinay: { views: ALL_VIEWS, themed: true, size: FULL },
  keskealsaydim: { views: DESKTOP_ONLY, themed: false, size: LEGACY, darkInk: true },
  'ramazan-vakitleri': { views: DESKTOP_ONLY, themed: false, size: LEGACY, darkInk: true },
  /* Yeniden tasarım sonrası tam set (9 Ekim 2026): landing hero, notlar
     sayfası ve telefon hero'su; iki temalı. */
  digynotes: { views: ALL_VIEWS, themed: true, size: FULL },
  /* "Floodlight" görsel revizyonu sonrası tam set (9 Ekim 2026): landing
     hero, uygulama ana ekranı ve telefon hero'su; iki temalı. */
  elevenforge: { views: ALL_VIEWS, themed: true, size: FULL },
} as const satisfies Record<string, ShotSet>

export type ShotSlug = keyof typeof PROJECT_SHOTS

/** dev-starter'ın README afişi: görseli olmayan proje için kapak. */
export const DEV_STARTER_BANNER = {
  light: '/projects/dev-starter/banner-light.svg',
  dark: '/projects/dev-starter/banner-dark.svg',
  width: 1280,
  height: 360,
} as const

export type ShotSources = { light: string; dark?: string; width: number; height: number }

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
  return {
    light: projectShot(slug, view, set.alwaysDark ? 'dark' : 'light'),
    dark: set.themed && !set.alwaysDark ? projectShot(slug, view, 'dark') : undefined,
    width: size.width,
    height: size.height,
  }
}

/** Görsel her temada koyu mu (bkz. `ShotSet.darkInk`). */
export function isDarkInk(slug: string): boolean {
  if (!(slug in PROJECT_SHOTS)) return false
  const set: ShotSet = PROJECT_SHOTS[slug as ShotSlug]
  return set.darkInk === true
}
