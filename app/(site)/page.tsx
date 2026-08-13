import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import PageView from '@/components/PageView'
import { getSiteContent } from '@/lib/server/content-store'
import { personJsonLd, websiteJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const content = await getSiteContent()

  return (
    <>
      <PageView pathname="/" />
      <script
        type="application/ld+json"
        // Yapısal veri; Google'ın kişi ve site bilgisini doğru okuması için.
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd(), websiteJsonLd()]) }}
      />
      <Hero home={content.home} projects={content.projects} blogPosts={content.blogPosts} />
    </>
  )
}
