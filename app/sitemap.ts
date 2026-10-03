import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/content/posts'
import { projects } from '@/lib/content/projects'
import { SITE_URL } from '@/lib/seo'

/**
 * `lastModified` İÇERİKTEN gelir, derleme anından değil: eskiden `new Date()`
 * yazılıydı ve her derleme her adresi "bugün değişti" diye bildiriyordu;
 * tarayıcı motoru bu sinyale güvenmeyi bırakır.
 *
 * Proje detay rotası (`/projeler/[slug]`) yayında: on üç adres, hepsi
 * derleme anında üretiliyor (generateStaticParams, dynamicParams = false).
 * Bayrak rota yokken site haritasına 404 koymamak içindi; kaldırılırsa
 * proje adresleri de buradan çıkarılmalı.
 */
const INCLUDE_PROJECT_PAGES = true

function newest(dates: string[]): Date {
  return dates.reduce<Date>((latest, value) => {
    const d = new Date(value)
    return d > latest ? d : latest
  }, new Date(0))
}

const projectSitemapEntries = (lastModified: Date): MetadataRoute.Sitemap =>
  projects.map((project) => ({
    url: `${SITE_URL}/projeler/${project.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

export default function sitemap(): MetadataRoute.Sitemap {
  const newestPost = newest(blogPosts.map((post) => post.date))

  return [
    { url: SITE_URL, lastModified: newestPost, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/projeler`, lastModified: newestPost, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: newestPost, changeFrequency: 'weekly', priority: 0.9 },
    ...(INCLUDE_PROJECT_PAGES ? projectSitemapEntries(newestPost) : []),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
