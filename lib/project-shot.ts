import type { Theme } from '@/lib/theme'

/**
 * Proje ekran görüntüsünün adresi.
 *
 * Görseller `public/projects/<slug>/<görünüm>-<tema>.webp` düzeninde. Hangi
 * projede hangi görünüm var, ölçüsü ne ve iki temalı mı: envanter
 * lib/content/project-shots.ts (`shotSources`). Doğrudan bu fonksiyonu
 * çağırmak yerine çoğu zaman o yardımcı daha doğru: tek temalı projede
 * ikinci dosyayı istemez.
 *
 * Bu modül saf: sunucu ve istemci bileşenlerinden okunabilir, veri
 * import etmez.
 */
export const SHOT_VIEWS = ['desktop', 'desktop-2', 'mobile'] as const
export type ShotView = (typeof SHOT_VIEWS)[number]

export function projectShot(slug: string, view: ShotView, theme: Theme): string {
  return `/projects/${slug}/${view}-${theme}.webp`
}
