import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Inline } from '@/components/blog/Inline'
import { MaskTitle } from '@/components/home/MaskTitle'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { BlogPost } from '@/lib/content/types'
import { formatPostDate, readingTime } from '@/lib/reading-time'

/**
 * Son Yazılar: editoryal liste, kart değil. Satır başına degrade başlık,
 * altında tek satırlık özet, künye (tarih + okuma süresi), sağda hap
 * etiket ve yuvarlak ok. 3 Ekim 2026: önceden yalnız başlık vardı ve
 * başlıklar uzunluk olarak birbirini tutmuyordu (biri bir satır, öteki
 * iki); başlıklar kısaltıldı, özet satırı eklendi.
 *
 * İmleci izleyen proje önizlemesi vardı; 4 Ekim 2026'da kaldırıldı
 * (sahibi: "son yazılarda hover ile projeyi göstermeye gerek yok").
 *
 * Yazı kapağının `post-<slug>` adını burası TAŞIMAZ (o /blog kartında).
 */
const COUNT = 3

export function RecentPosts({ posts }: { posts: BlogPost[] }) {
  const recent = posts.slice(0, COUNT)

  return (
    <Container as="section" size="wide" aria-labelledby="son-yazilar" className="pt-24 sm:pt-32">
      <SectionHeading
        id="son-yazilar"
        title={<MaskTitle accentLast>Son Yazılar</MaskTitle>}
        size="home"
        action={
          <ButtonLink href="/blog" variant="ghost">
            Tüm Yazılar
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
        className="mb-8 sm:mb-12"
      />

      <ol className="border-t border-line">
          {recent.map((post) => (
            <li key={post.slug} className="reveal border-b border-line">
              <Link
                href={`/blog/${post.slug}`}
                className="home-post group"
              >
                <span className="home-post-meta">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{readingTime(post)}</span>
                </span>
                <span className="home-post-main">
                  <span className="home-post-title ink ink-hover">{post.title}</span>
                  <span className="home-post-excerpt">
                    <Inline text={post.excerpt} />
                  </span>
                </span>
                <span className="home-post-side">
                  <span className="home-post-tag">{post.tag}</span>
                  <span className="home-post-arrow" aria-hidden="true">
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
    </Container>
  )
}
