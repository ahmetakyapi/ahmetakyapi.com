import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { MaskTitle } from '@/components/home/MaskTitle'
import { PostPreview } from '@/components/home/PostPreview'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { shotSources } from '@/lib/content/project-shots'
import type { BlogPost, Project } from '@/lib/content/types'
import { formatPostDate, readingTime } from '@/lib/reading-time'

/**
 * Son Yazılar: editoryal liste, kart değil. Satır başına büyük başlık,
 * mono künye (tarih + okuma süresi) ve etiket.
 *
 * Fare ile gezen okuyucuya imleci izleyen küçük bir önizleme (yazının
 * anlattığı projenin ekran görüntüsü; bkz. PostPreview). Projesi ya da
 * görseli olmayan yazıda önizleme yok, satır yine aynı.
 *
 * Yazı kapağının `post-<slug>` adını burası TAŞIMAZ (o /blog kartında).
 */
const COUNT = 3

export function RecentPosts({ posts, projects }: { posts: BlogPost[]; projects: Project[] }) {
  const recent = posts.slice(0, COUNT).map((post) => {
    const project = projects.find((p) => p.postSlug === post.slug)
    const shot = project ? shotSources(project.slug, 'desktop') : null
    return { post, project, shot }
  })

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

      <PostPreview
        previews={recent.map(({ post, project, shot }) =>
          project && shot ? (
            <div key={post.slug} data-slug={post.slug} className="home-follow-item">
              <ThemedImage {...shot} alt="" />
            </div>
          ) : null,
        )}
      >
        <ol className="border-t border-line">
          {recent.map(({ post, shot }) => (
            <li key={post.slug} className="border-b border-line" data-reveal>
              <Link
                href={`/blog/${post.slug}`}
                data-preview={shot ? post.slug : undefined}
                className="group grid gap-3 py-7 sm:py-9 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-baseline md:gap-8"
              >
                <span className="font-mono text-small text-muted">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span className="block">{readingTime(post)}</span>
                </span>
                <span className="font-display text-[clamp(1.5rem,3vw,2.375rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-balance text-strong transition-colors group-hover:text-primary-ink">
                  {post.title}
                </span>
                <span className="flex items-center gap-3 text-small text-body">
                  {post.tag}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-ink"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </PostPreview>
    </Container>
  )
}
