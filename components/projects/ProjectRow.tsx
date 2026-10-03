import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArmedMorph } from '@/components/projects/ArmedMorph'
import { ProjectCover } from '@/components/projects/ProjectCover'
import { badgeLabel, splitLead } from '@/components/projects/project-text'
import type { Project } from '@/lib/content/types'

/**
 * /projeler dizininin iki satır biçimi. Görünüm projects.css'te
 * (`.pfeat*`, `.prow*`); burada yalnızca yapı.
 *
 * Satırın tamamı tıklanır ama bağlantı YALNIZ adda: erişilebilir adı proje
 * adı olsun, açıklamanın tamamı değil. Bağlantının `::after` katmanı satırı
 * örter, odak halkası da o katmanda.
 *
 * Morf (`project-${slug}`) satırın görselinden detayın kahramanına; ad
 * yalnız TIKLANINCA takılır (ArmedMorph'taki gerekçe: dizinde aynı anda
 * görünen başka bir satır yanlış çift kurmasın).
 */
const LINK =
  'after:absolute after:inset-0 after:z-10 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-line-focus focus-visible:after:outline-solid'

/** Satırda gösterilen teknoloji sayısı; tamamı proje sayfasında. */
const STACK_PREVIEW = 2

/** Öne çıkan proje: büyük ad, tek cümle, yanında görünür ekran görüntüsü. */
export function FeaturedRow({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { lead } = splitLead(project.description)
  return (
    <li className="pfeat" data-group={project.group} style={{ '--tint': project.tint ?? project.accent } as CSSProperties}>
      <ArmedMorph
        name={`project-${project.slug}`}
        className="pfeat-in tint-card reveal group relative"
        coverClassName="pfeat-cover"
        coverHidden
        content={
          <div className="pfeat-text">
            <span aria-hidden="true" className="tint-card-glow" />
            <p className="tint-card-kicker">
              {project.category}
              {project.badge !== 'Canlı' ? <span> · {badgeLabel(project.badge)}</span> : null}
            </p>
            <h3 className="pfeat-title tint-card-title mt-4">
              <Link href={`/projeler/${project.slug}`} transitionTypes={['nav-forward']} className={LINK}>
                {project.title}
              </Link>
            </h3>
            <p className="pfeat-lead">{lead}</p>
            <span className="pfeat-more tint-card-btn" aria-hidden="true">
              Projeyi İncele
              <ArrowRight className="size-4" />
            </span>
          </div>
        }
        cover={<ProjectCover project={project} priority={priority} alt="" />}
      />
    </li>
  )
}

/**
 * Listenin geri kalanı: tek satır ad + kategori. Masaüstünde (ince imleç)
 * görsel gizli ve satırın üstünde durulunca imleci izleyen önizleme olarak
 * belirir (PreviewFollow); dokunmatikte satırın başında küçük görsel.
 */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="prow" data-group={project.group}>
      <ArmedMorph
        name={`project-${project.slug}`}
        className="prow-in group relative"
        coverClassName="pprev"
        coverHidden
        content={
          <>
            <h3 className="prow-title">
              <Link href={`/projeler/${project.slug}`} transitionTypes={['nav-forward']} className={LINK}>
                {project.title}
              </Link>
            </h3>
            <p className="prow-meta">
              <span className="prow-cat">
                {project.category}
                {project.badge !== 'Canlı' ? <span className="prow-badge">{badgeLabel(project.badge)}</span> : null}
              </span>
              <span className="prow-stack">{project.tags.slice(0, STACK_PREVIEW).join(', ')}</span>
            </p>
            <ArrowRight className="prow-arrow" aria-hidden="true" />
          </>
        }
        cover={<ProjectCover project={project} alt="" />}
      />
    </li>
  )
}
