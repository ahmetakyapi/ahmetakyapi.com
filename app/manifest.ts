import type { MetadataRoute } from 'next'
import { JOB_TITLE, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import { DEFAULT_THEME, THEME_COLOR } from '@/lib/theme'

/** Renkler `signature` paletinden: zemin varsayılan temanın `--page-bg`si. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} · ${JOB_TITLE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: 'tr',
    start_url: '/',
    display: 'standalone',
    background_color: THEME_COLOR[DEFAULT_THEME],
    theme_color: THEME_COLOR[DEFAULT_THEME],
    /* PNG'ler `app/icon.svg`'den üretildi (192/512, yuvarlak köşeli).
       Maskelenebilir ikon AYRI: kenara kadar degrade, üçgen güvenli alanda.
       Önceden yuvarlak köşeli apple-icon `maskable` diye veriliyordu ve
       Android onu bir kez daha maskeleyip köşelerde beyaz boşluk
       bırakıyordu. */
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
