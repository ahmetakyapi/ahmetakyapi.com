import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Inline } from '@/components/blog/Inline'
import { MaskTitle } from '@/components/home/MaskTitle'
import { splitLead } from '@/components/projects/project-text'
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
 *
 * Özet satırı özetin İLK CÜMLESİ (14 Ekim 2026): özetin tamamı tek satıra
 * kırpılıyordu ve satır ya cümlenin ortasında ya da noktanın hemen
 * ardından üç noktayla bitiyordu ("kurduğum site.…").
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
          /* Eksi yatay pay düğmenin iç boşluğu kadar: yazı listenin
             kenarıyla aynı hatta biter (masaüstünde sağ, telefonda sol
             kenar; önce 16 piksel içerideydi). */
          <ButtonLink href="/blog" variant="ghost" className="-mx-4">
            Tüm Yazılar
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
        className="mb-8 sm:mb-12"
      />

      <ol className="border-t border-line">
          {recent.map((post) => {
            /* Satırın tamamı bağlantı; adı yalnız başlık. Önceden ad satırın
               bütün metniydi (~150 harf) ve tarihle başlıyordu: üç bağlantı
               "4 Ekim 2026 5 Dakika…" diye okunuyor, birbirinden
               ayrılmıyordu. Künye, özet ve etiket açıklama olarak gelir. */
            const id = `yazi-${post.slug}`
            return (
              <li key={post.slug} className="reveal border-b border-line">
                <Link
                  href={`/blog/${post.slug}`}
                  className="home-post group"
                  aria-labelledby={id}
                  aria-describedby={`${id}-kunye ${id}-ozet ${id}-etiket`}
                >
                  <span id={`${id}-kunye`} className="home-post-meta">
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{readingTime(post)}</span>
                  </span>
                  <span className="home-post-main">
                    <span id={id} className="home-post-title ink ink-hover">{post.title}</span>
                    <span id={`${id}-ozet`} className="home-post-excerpt">
                      <Inline text={splitLead(post.excerpt).lead} />
                    </span>
                  </span>
                  <span className="home-post-side">
                    <span id={`${id}-etiket`} className="home-post-tag">{post.tag}</span>
                    <span className="home-post-arrow" aria-hidden="true">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
    </Container>
  )
}
