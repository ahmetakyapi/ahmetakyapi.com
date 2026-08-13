import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'
import { blogPosts } from '@/lib/data'
import { formatPostDate, readingTime } from '@/lib/reading-time'

export const runtime = 'edge'
export const alt = 'Ahmet Akyapı — Blog Yazısı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/** Her yazı için kendi kartı — alt metni de yazının kendi künyesinden. */
export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  return [
    {
      id: params.slug,
      alt: post ? `${post.title} — Ahmet Akyapı` : alt,
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
    },
  ]
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return renderOgCard({
      eyebrow: 'Blog',
      title: 'Ahmet Akyapı — Teknik Yazılar',
      accent: '#6366f1',
    })
  }

  return renderOgCard({
    /* Kartın rengi yazının etiket rengi — dokuz yazı, dokuz farklı kart. */
    eyebrow: post.tag,
    title: post.title,
    subtitle: post.excerpt,
    accent: post.tagColor,
    badges: [formatPostDate(post.date), readingTime(post)],
  })
}
