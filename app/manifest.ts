import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ahmet Akyapı | Fullstack Developer',
    short_name: 'Ahmet Akyapı',
    description: 'React, TypeScript ve Next.js odaklı Fullstack Developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#04070d',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
