import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Ahmet Akyapı — Fullstack Developer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'Portfolyo',
    title: 'Sade, hızlı ve detay kalitesi yüksek arayüzler.',
    subtitle:
      'React, Angular ve TypeScript ile ürün geliştiriyorum. Projeler, teknik yazılar ve kararların gerekçeleri burada.',
    accent: '#6366f1',
    badges: ['Next.js', 'TypeScript', 'PostgreSQL'],
  })
}
