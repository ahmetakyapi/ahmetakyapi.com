import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/data'
import BlogPostClient from './BlogPostClient'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Ahmet Akyapı`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()
  return <BlogPostClient post={post} />
}
