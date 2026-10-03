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
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
