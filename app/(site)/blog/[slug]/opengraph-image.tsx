import { findPost, postsByDate } from '@/components/blog/posts'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'
import { formatPostDate, readingTime } from '@/lib/reading-time'

export const alt = 'Ahmet Akyapı blogundan bir yazının paylaşım kartı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * Her yazı için kendi kartı. Adres `(site)` grubu yüzünden soneki:
 * `/blog/<slug>/opengraph-image-<özet>`; JSON-LD bunu lib/seo.ts →
 * `postOgImagePath` ile hesaplıyor.
 *
 * DERLEMEDE ÜRETİLİR. `generateStaticParams` buraya, görsel rotasının
 * kendisine konunca Next her yazının kartını derlemede basıyor; eskiden
 * rota dinamikti (ƒ) ve her paylaşım önizlemesi bir fonksiyon çağrısıydı.
 * `dynamicParams = false`: listede olmayan slug 404.
 *
 * `generateImageMetadata` BİLEREK yok. Yazıya özel `alt` için denendi ama
 * Next 16.3'te görsel rotası üst segmentin parametresini o fonksiyona
 * vermiyor (`{}` geliyor) ve derleme "id property is required" ile kırılıyor.
 */
export function generateStaticParams() {
  return postsByDate.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = findPost(slug)

  if (!post) {
    return renderOgCard({ eyebrow: 'Blog', title: 'Ahmet Akyapı · Teknik Yazılar' })
  }

  return renderOgCard({
    eyebrow: post.tag,
    title: post.title,
    subtitle: post.excerpt,
    badges: [formatPostDate(post.date), readingTime(post)],
  })
}
