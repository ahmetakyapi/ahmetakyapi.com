import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { splitLead } from '@/components/projects/project-text'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { shotSources } from '@/lib/content/project-shots'
import type { BlogPost, Project } from '@/lib/content/types'
import { formatPostDate, readingTime } from '@/lib/reading-time'
import { Inline } from './Inline'

/**
 * Yazının bitişi: anlattığı projenin kartı (varsa) ve diğer yazılar.
 * Kart değil liste: diğer yazılar dizindeki satırla aynı dili konuşur
 * (tarih, başlık). Proje kartı tek, gerçek ekran görüntüsüyle.
 * Kapak morfu (`post-*`) burada YOK: bir sayfada bir ad tek öğede.
 */
export function RelatedProject({ project }: { project: Project }) {
  const shot = shotSources(project.slug, 'desktop')
  return (
    <section aria-labelledby="ilgili-proje" className="post-related">
      <h2 id="ilgili-proje" className="post-end-title">
        İlgili Proje
      </h2>
      <Link href={`/projeler/${project.slug}`} className="group post-project">
        <div className="post-project-shot">
          {shot ? (
            <ThemedImage {...shot} alt="" className="size-full object-cover object-top" />
          ) : (
            <div className="post-cover-type bg-cta" aria-hidden="true">
              <span className="post-cover-word">{project.category}</span>
            </div>
          )}
        </div>
        <div className="post-project-text">
          <p className="text-small font-medium text-muted">{project.category}</p>
          <p className="mt-1.5 font-display text-title font-semibold tracking-[-0.02em] text-strong">{project.title}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">{splitLead(project.description).lead}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
            Projeyi İncele
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </section>
  )
}

export function MorePosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null
  return (
    <section aria-labelledby="diger-yazilar" className="post-more">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="diger-yazilar" className="post-end-title">
          Diğer Yazılar
        </h2>
        <Link href="/blog" className="tap-y text-sm font-medium text-body transition-colors hover:text-strong">
          Tüm Yazılar
        </Link>
      </div>
      <ol className="post-more-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group">
              <span className="block text-base font-semibold leading-snug tracking-[-0.01em] text-strong transition-colors group-hover:text-primary-ink sm:text-[1.0625rem]">
                <Inline text={post.title} />
              </span>
              <span className="mt-1 block text-small font-medium tabular-nums text-muted">
                {formatPostDate(post.date)} · {readingTime(post)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
