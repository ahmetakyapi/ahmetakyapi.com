import type { BlogPost, Project } from '@/lib/content/types'
import { EMAIL, JOB_TITLE, SOCIAL_LINKS } from '@/lib/nav'

export { JOB_TITLE }

export const SITE_URL = 'https://ahmetakyapi.com'
export const AUTHOR = 'Ahmet Akyapı'
export const TWITTER = '@ahmetakyapi'
/** Site adı ve başlık şablonunun soneki (`%s · Ahmet Akyapı`). */
export const SITE_NAME = AUTHOR
export const SITE_DESCRIPTION =
  'Full-Stack & AI Developer. Next.js, TypeScript, Postgres ve Claude API ile uçtan uca web ürünleri geliştiriyorum; yaptıklarımın nasıl yapıldığını da yazıyorum.'

export function abs(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

/**
 * Rota GRUBU içindeki metadata görselinin sonekini Next'in yaptığı gibi
 * hesaplar.
 *
 * Next, `(site)` gibi bir grubun içindeki `opengraph-image` rotasına üst
 * yolun djb2 özetinden altı karakterlik bir sonek ekliyor:
 * `/blog/<slug>/opengraph-image-fx5gi7`. Yazılar gruba taşınınca JSON-LD'deki
 * `/blog/<slug>/opengraph-image` adresi 404'e düştü. Hesap
 * next/dist/lib/metadata/get-metadata-route.js → getMetadataRouteSuffix ile
 * birebir; iç modülü içe aktarmak yerine burada, çünkü iç yol sürümler
 * arasında taşınabiliyor. Derleme sonrası curl ile 200 doğrulandı
 * (Next 16.3.8). Next yükseltilince yeniden doğrula.
 */
function groupSuffix(routeDir: string): string {
  let hash = 5381
  for (let i = 0; i < routeDir.length; i++) {
    hash = ((hash << 5) + hash + routeDir.charCodeAt(i)) & 0xffffffff
  }
  return (hash >>> 0).toString(36).slice(0, 6)
}

/** Yazının paylaşım görselinin GERÇEK adresi (app/(site)/blog/[slug]/opengraph-image.tsx). */
export function postOgImagePath(slug: string) {
  return `/blog/${slug}/opengraph-image-${groupSuffix('/(site)/blog/[slug]')}`
}

/** Proje detayının paylaşım görseli (faz 2: app/(site)/projeler/[slug]/opengraph-image.tsx). */
export function projectOgImagePath(slug: string) {
  return `/projeler/${slug}/opengraph-image-${groupSuffix('/(site)/projeler/[slug]')}`
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR,
    url: SITE_URL,
    jobTitle: JOB_TITLE,
    description: SITE_DESCRIPTION,
    email: `mailto:${EMAIL}`,
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Angular', 'PostgreSQL', 'Tailwind CSS', 'Claude API', 'Yapay Zekâ'],
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
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
        url: abs(item.url),
      })),
    },
  }
}

export function blogListJsonLd(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog · ${AUTHOR}`,
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
    image: abs(postOgImagePath(post.slug)),
    datePublished: published,
    /* Yazıların ayrı bir güncellenme tarihi tutulmuyor; uydurmak yerine
       yayın tarihi. Alan eklenirse burası onu okumalı. */
    dateModified: published,
    inLanguage: 'tr-TR',
    keywords: post.tag,
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
    publisher: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
  }
}

/** Proje detayı (`/projeler/[slug]`, faz 2) için. */
export function projectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: abs(`/projeler/${project.slug}`),
    sameAs: [project.link, ...(project.github ? [project.github] : [])],
    keywords: project.tags.join(', '),
    inLanguage: 'tr-TR',
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
  }
}

/**
 * Proje detayının yapılandırılmış verisi. Kodu açık her proje
 * `SoftwareSourceCode` (depo adresiyle); deposu olmayan olursa düz
 * `CreativeWork`. `image` paylaşım görselinin GERÇEK adresi: rota grubu
 * soneki dahil (`projectOgImagePath`), derleme sonrası curl ile 200.
 */
export function projectDetailJsonLd(project: Project) {
  const url = abs(`/projeler/${project.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': project.github ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.title,
    description: project.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: abs(projectOgImagePath(project.slug)),
    genre: project.category,
    keywords: project.tags.join(', '),
    inLanguage: 'tr-TR',
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(project.link !== project.github ? { sameAs: [project.link] } : {}),
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
  }
}
