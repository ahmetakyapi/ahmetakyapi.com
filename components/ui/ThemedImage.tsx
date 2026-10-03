import type { Theme } from '@/lib/theme'
import { cx } from '@/lib/utils'

/**
 * Temaya göre değişen görsel: açık ve koyu iki `<img>`, biri CSS ile gizli
 * (`[data-theme-only]`, app/globals.css). JavaScript yok, ilk karede doğru.
 *
 *   const shot = shotSources('mimio', 'desktop')   // lib/content/project-shots.ts
 *   {shot && <ThemedImage {...shot} alt="Mimio danışan paneli" className="rounded-card" />}
 *
 *   <ThemedImage light="/a-light.webp" dark="/a-dark.webp" alt="…" width={2160} height={1350} />
 *   <ThemedImage light="/tek.webp" alt="…" width={1280} height={800} />   // `dark` yok → tek <img>
 *
 * `width`/`height` ZORUNLU: oran rezervi, CLS 0. `dark` verilmezse görsel
 * temayla değişmez (tek temalı projeler) ve tek `<img>` basılır.
 *
 * `priority`: LCP adayı görseller için `loading="eager"` + `fetchPriority="high"`.
 * LCP görselinde `theme={DEFAULT_THEME}` ver (sayfalar statik, sunucu yalnız varsayılanı bilir): yalnızca o
 * temanın görseli öncelik alır, öteki tembel kalır ve hiç inmez. `theme`
 * verilmezse ikisi de öncelikli iner (iki kat bayt; bilerek seç).
 * Öncelikli olmayan görseller `loading="lazy"`: gizli olan hiç indirilmez.
 *
 * `loading` / `fetchPriority`: varsayılanı ezer, `priority`den bağımsız.
 * Tembel yüklemenin geç tetiklendiği yatay kaydırıcılar için
 * (`loading="eager" fetchPriority="low"`, ana sayfa proje şeridi). İki temalı
 * görselde `eager` gizli olanı da indirir; tek temalı görsellerde kullan.
 *
 * `next/image` kullanılmıyor: optimizer bilerek kapalı (Vercel kotası) ve
 * kaynaklar zaten gösterim ölçüsünde WebP.
 */
type ThemedImageProps = {
  light: string
  dark?: string
  alt: string
  width: number
  height: number
  priority?: boolean
  theme?: Theme
  className?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function ThemedImage({
  light,
  dark,
  alt,
  width,
  height,
  priority = false,
  theme,
  className,
  sizes,
  loading,
  fetchPriority,
}: ThemedImageProps) {
  const variants: { src: string; only?: Theme }[] = dark
    ? [
        { src: light, only: 'light' },
        { src: dark, only: 'dark' },
      ]
    : [{ src: light }]

  return (
    <>
      {variants.map(({ src, only }) => {
        const urgent = priority && (only === undefined || theme === undefined || theme === only)
        return (
          <img
            key={only ?? 'single'}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            data-theme-only={only}
            loading={loading ?? (urgent ? 'eager' : 'lazy')}
            fetchPriority={fetchPriority ?? (urgent ? 'high' : 'auto')}
            decoding="async"
            className={cx('block h-auto w-full', className)}
          />
        )
      })}
    </>
  )
}
