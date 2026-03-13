import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/server/content-store'
import BlogPostClient from './BlogPostClient'

interface Props {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getSiteContent()
  const post = content.blogPosts.find((p) => p.slug === params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Ahmet Akyapı`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const content = await getSiteContent()
  const post = content.blogPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()
  return <BlogPostClient post={post} allPosts={content.blogPosts} />
}
