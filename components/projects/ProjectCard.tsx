import Link from 'next/link'
import { ProjectCover } from '@/components/projects/ProjectCover'
import { badgeLabel, splitLead } from '@/components/projects/project-text'
import { Tag } from '@/components/ui/Tag'
import type { Project } from '@/lib/content/types'
import { cx } from '@/lib/utils'

/**
 * Dizin kartı. Boy (`size`) ızgaradaki yerini söyler; yerleşimin kendisi
 * app/(site)/projeler/projects.css'te, çünkü süzgeç açıkken aynı kart
 * başka bir sütun kaplıyor ve o geçiş sınıfla değil öznitelikle yapılıyor.
 *
 *   wide     ilk öne çıkan: tam genişlik, görsel solda, metin sağda
 *   feature  öteki öne çıkanlar: yarım genişlik, büyük başlık
 *   major / minor  geri kalanlar: 7/5 ve 5/7 dönüşümlü satırlar
 *
 * Kartın tamamı tıklanır ama bağlantı YALNIZ başlıkta: erişilebilir adı
 * proje adı olsun, açıklamanın tamamı değil. Başlık bağlantısının `::after`
 * katmanı kartı örter; odak halkası da o katmanda, kartın çevresinde.
 */
export type CardSize = 'wide' | 'feature' | 'major' | 'minor'

const MAX_TAGS = 3

export function ProjectCard({ project, size, priority = false }: { project: Project; size: CardSize; priority?: boolean }) {
  const { lead } = splitLead(project.description)
  const big = size === 'wide' || size === 'feature'

  return (
    <article data-group={project.group} data-size={size} className="pcard group relative">
      <ProjectCover project={project} morph priority={priority} />

      <div className="pcard-body mt-5 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className={cx('font-semibold tracking-[-0.03em] text-strong', size === 'wide'
                ? 'text-heading sm:text-[clamp(2.25rem,4vw,3.25rem)] sm:leading-[1.02]'
                : big
                  ? 'text-heading sm:text-[2.25rem] sm:leading-[1.08]'
                  : 'text-title')}>
            <Link
              href={`/projeler/${project.slug}`}
              className="rounded-[2px] after:absolute after:inset-0 after:z-10 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-line-focus focus-visible:after:outline-solid"
            >
              {project.title}
            </Link>
          </h2>
          <Tag tone={project.badge === 'Canlı' ? 'primary' : 'neutral'} className="mt-1 shrink-0">
            {badgeLabel(project.badge)}
          </Tag>
        </div>
        <p className="mt-1 font-mono text-small text-muted">{project.category}</p>
        <p className={cx('mt-3 max-w-[60ch] text-body', big ? 'text-base sm:text-lead' : 'text-sm leading-relaxed')}>{lead}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Kullanılan teknolojiler">
          {project.tags.slice(0, MAX_TAGS).map((tag) => (
            <Tag as="li" key={tag}>
              {tag}
            </Tag>
          ))}
        </ul>
      </div>
    </article>
  )
}
