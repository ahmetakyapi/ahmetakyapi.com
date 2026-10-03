import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { shotSources } from '@/lib/content/project-shots'
import type { BlogPost, Project } from '@/lib/content/types'
import { formatPostDate, readingTime } from '@/lib/reading-time'
import { Inline } from './Inline'

/**
 * Yazının bitişi: anlattığı projenin kartı (varsa) ve diğer yazılar.
 * Kart değil liste: diğer yazılar dizindeki satırla aynı dili konuşur
 * (mono tarih, başlık). Proje kartı tek, gerçek ekran görüntüsüyle.
 * Kapak morfu (`post-*`) burada YOK: bir sayfada bir ad tek öğede.
 */
export function RelatedProject({ project }: { project: Project }) {
  const shot = shotSources(project.slug, 'desktop')
  return (
    <section aria-labelledby="yazinin-projesi" className="post-related">
      <h2 id="yazinin-projesi" className="post-end-title">
        Yazının Projesi
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
          <p className="font-mono text-small text-muted">{project.category}</p>
          <p className="mt-2 text-title font-semibold tracking-[-0.02em] text-strong">{project.title}</p>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">{project.description}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
            Vaka Çalışması
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
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
        <Link href="/blog" className="tap-y font-mono text-small text-muted transition-colors hover:text-strong">
          Tümü
        </Link>
      </div>
      <ol className="post-more-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group">
              <span className="font-mono text-small text-muted">
                {formatPostDate(post.date)} · {readingTime(post)}
              </span>
              <span className="mt-1.5 block text-base font-semibold leading-snug tracking-[-0.01em] text-strong transition-colors group-hover:text-primary-ink">
                <Inline text={post.title} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
