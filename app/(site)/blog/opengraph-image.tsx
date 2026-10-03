import { blogPosts } from '@/lib/content/posts'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'

export const alt = 'Blog · Ahmet Akyapı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'Blog',
    title: 'Projelerden çıkan notlar, hatalar ve gerekçeler.',
    subtitle:
      'Saat dilimleri, gerçek zamanlı oyunlar, prosedürel üretim ve arayüz kararları; çalışmayan hâlleriyle birlikte.',
    badges: [`${blogPosts.length} Yazı`, 'Türkçe', 'RSS'],
  })
}
