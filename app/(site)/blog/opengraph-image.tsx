import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'
import { blogPosts } from '@/lib/data'

export const runtime = 'edge'
export const alt = 'Blog — Ahmet Akyapı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'Blog',
    title: 'Projelerden çıkan notlar, hatalar ve gerekçeler.',
    subtitle:
      'Saat dilimleriyle boğuşmak, gerçek zamanlı oyunlar, prosedürel üretim ve arayüz kararları — çalışmayan hâlleriyle birlikte.',
    accent: '#22d3ee',
    badges: [`${blogPosts.length} yazı`, 'Türkçe', 'RSS'],
  })
}
