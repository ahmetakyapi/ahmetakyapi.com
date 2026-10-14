import type { Metadata } from 'next'
import { BlogIndex } from '@/components/blog/BlogIndex'
import { postsByDate } from '@/components/blog/posts'
import { PageTransition } from '@/components/site/PageTransition'
import { blogListJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import './blog.css'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Projelerimi anlatan yazılar: ne yaptım, nasıl kurdum ve hangi kararı neden verdim. Borsa takibi, klinik paneller, çok oyunculu oyunlar ve bu sitenin kendisi.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog · Ahmet Akyapı',
    description: 'Projelerimi anlatan yazılar: ne yaptım, nasıl kurdum, neyi neden seçtim.',
    url: '/blog',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const posts = [...postsByDate]

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: 'Ana Sayfa', path: '/' },
              { name: 'Blog', path: '/blog' },
            ]),
            blogListJsonLd(posts),
          ]),
        }}
      />
      <BlogIndex posts={posts} />
    </PageTransition>
  )
}
