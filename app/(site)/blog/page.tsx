import type { Metadata } from 'next'
import Blog from '@/components/Blog'
import PageView from '@/components/PageView'
import { getSiteContent } from '@/lib/server/content-store'
import { breadcrumbJsonLd, blogListJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Yazdığım projelerden çıkan teknik notlar: saat dilimleri, gerçek zamanlı oyunlar, prosedürel üretim, veri katmanı ve arayüz kararları.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Ahmet Akyapı',
    description: 'Yazdığım projelerden çıkan teknik notlar.',
    url: '/blog',
    type: 'website',
  },
}

export default async function BlogIndexPage() {
  const content = await getSiteContent()

  return (
    <>
      <PageView pathname="/blog" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: 'Ana Sayfa', path: '/' },
              { name: 'Blog', path: '/blog' },
            ]),
            blogListJsonLd(content.blogPosts),
          ]),
        }}
      />
      <Blog blogPosts={content.blogPosts} />
    </>
  )
}
