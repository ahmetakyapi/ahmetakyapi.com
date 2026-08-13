import type { BlogPost } from '@/lib/data'

export const SITE_URL = 'https://ahmetakyapi.com'
export const AUTHOR = 'Ahmet Akyapı'
export const TWITTER = '@ahmetakyapi'

function abs(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR,
    url: SITE_URL,
    jobTitle: 'Fullstack Developer',
    email: 'mailto:ahmet@ahmetakyapi.com',
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Angular', 'PostgreSQL', 'TailwindCSS'],
    sameAs: [
      'https://github.com/ahmetakyapi',
      'https://x.com/ahmetakyapi',
      'https://www.linkedin.com/in/ahmetakyapi',
    ],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: AUTHOR,
    url: SITE_URL,
    inLanguage: 'tr-TR',
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
  }
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  }
}

export function collectionJsonLd({
  name,
  path,
  items,
}: {
  name: string
  path: string
  items: { name: string; url: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: abs(path),
    inLanguage: 'tr-TR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  }
}

export function blogListJsonLd(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${AUTHOR} — Blog`,
    url: abs('/blog'),
    inLanguage: 'tr-TR',
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: abs(`/blog/${post.slug}`),
      datePublished: new Date(post.date).toISOString(),
      keywords: post.tag,
    })),
  }
}

export function blogPostingJsonLd(post: BlogPost) {
  const published = new Date(post.date).toISOString()
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: abs(`/blog/${post.slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/blog/${post.slug}`) },
    image: abs(`/blog/${post.slug}/opengraph-image`),
    datePublished: published,
    dateModified: published,
    inLanguage: 'tr-TR',
    keywords: post.tag,
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
    publisher: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
  }
}
