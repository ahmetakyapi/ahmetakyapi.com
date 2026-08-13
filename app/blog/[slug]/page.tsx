import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/data'
import { getSiteContent } from '@/lib/server/content-store'
import { AUTHOR, SITE_URL, TWITTER, blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import BlogPostClient from './BlogPostClient'

interface Props {
  params: { slug: string }
}

/** Yazılar derleme anında üretilsin — force-dynamic her istekte render ediyordu. */
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = true
export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getSiteContent()
  const post = content.blogPosts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Yazı bulunamadı' }

  const published = new Date(post.date).toISOString()
  const url = `/blog/${post.slug}`

  return {
    /* Şablon zaten " — Ahmet Akyapı" ekliyor; başlıkta tekrar yazmıyoruz. */
    title: post.title,
    description: post.excerpt,
    /* Kök layout'taki canonical:'/' miras alınıyordu — her yazı Google'a
       "asıl sürümüm ana sayfa" diyordu. Burada yazıya özel veriliyor. */
    alternates: { canonical: url },
    authors: [{ name: AUTHOR, url: SITE_URL }],
    keywords: [post.tag, 'Ahmet Akyapı', 'Türkçe teknik blog'],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      siteName: AUTHOR,
      locale: 'tr_TR',
      publishedTime: published,
      modifiedTime: published,
      authors: [AUTHOR],
      tags: [post.tag],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: TWITTER,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const content = await getSiteContent()
  const post = content.blogPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            blogPostingJsonLd(post),
            breadcrumbJsonLd([
              { name: 'Ana Sayfa', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]),
        }}
      />
      <BlogPostClient post={post} allPosts={content.blogPosts} />
    </>
  )
}
