import { postsByDate } from '@/components/blog/posts'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** İçerik derleme anında belli: istek başına üretmeye gerek yok. */
export const dynamic = 'force-static'

export function GET() {
  /* Yeniden eskiye; sıra dizinle aynı kaynaktan (components/blog/posts.ts). */
  const posts = postsByDate
  /* `lastBuildDate` en yeni yazının tarihi: derleme anı her derlemede
     değişip okuyuculara "yeni bir şey var" dedirtiyordu. */
  const lastBuild = posts[0] ? new Date(posts[0].date) : new Date(0)

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escapeXml(p.tag)}</category>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Blog · ${SITE_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Projelerimi anlatan yazılar: ne yaptım, nasıl kurdum ve hangi kararı neden verdim.</description>
    <language>tr-TR</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
