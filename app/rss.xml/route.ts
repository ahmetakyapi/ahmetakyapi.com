import { getSiteContent } from '@/lib/server/content-store'

const BASE_URL = 'https://ahmetakyapi.com'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const content = await getSiteContent()
  const posts = [...content.blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${BASE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escapeXml(p.tag)}</category>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ahmet Akyapı — Blog</title>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>React, TypeScript, Next.js ve detaylı arayüz geliştirme üstüne notlar.</description>
    <language>tr-TR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
