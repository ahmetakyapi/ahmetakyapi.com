import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const newestPost = blogPosts.reduce<Date>((latest, post) => {
    const d = new Date(post.date)
    return d > latest ? d : latest
  }, new Date(0))

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/projeler`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: newestPost, changeFrequency: 'weekly', priority: 0.9 },
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
