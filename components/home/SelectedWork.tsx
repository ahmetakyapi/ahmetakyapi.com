import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { trTitle } from '@/components/home/tr-title'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { shotSources } from '@/lib/content/project-shots'
import type { Project } from '@/lib/content/types'
import type { HomeContent } from '@/lib/site-content'

/**
 * Seçili İşler: üç proje, üst üste binen paneller (sticky-stack).
 *
 * Hareket tamamen CSS (home.css → "Seçili İşler"): her panel yapışır, bir
 * sonraki panel alttan gelirken öncekini hafifçe küçültür. Zamanlayıcı bir
 * sonraki panelin kendi görünüm zaman çizelgesi; JavaScript yok. Destek
 * yoksa, hareket azaltılmışsa ya da ekran panel boyuna yetmiyorsa düz liste.
 *
 * Görseller `project-<slug>` adını TAŞIMAZ: o ad ana sayfada proje
 * şeridinde; aynı ad iki öğede olursa morf bozulur.
 */
const LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary-ink underline decoration-primary-soft/40 underline-offset-4 transition-colors hover:decoration-primary-ink pointer-fine:min-h-9'

export function SelectedWork({ home, projects }: { home: HomeContent; projects: Project[] }) {
  const panels = home.selectedWork.flatMap(({ slug, summary }) => {
    const project = projects.find((p) => p.slug === slug)
    const desktop = shotSources(slug, 'desktop')
    return project && desktop ? [{ project, summary, desktop, mobile: shotSources(slug, 'mobile') }] : []
  })

  return (
    <Container as="section" size="wide" aria-labelledby="secili-isler" className="pt-20 sm:pt-28">
      <SectionHeading
        id="secili-isler"
        title="Seçili İşler"
        className="mb-8 sm:mb-10"
      />

      <ol className="home-stack">
        {panels.map(({ project, summary, desktop, mobile }) => (
          <li key={project.slug} className="home-stack-item">
            <article className="home-stack-card grid gap-6 rounded-card border border-line p-4 sm:p-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10 lg:p-8">
              <div className="home-stack-media">
                <div className="overflow-hidden rounded-button border border-line">
                  <ThemedImage {...desktop} alt={`${project.title} masaüstü ekranı`} />
                </div>
                {mobile ? (
                  <div className="home-stack-phone overflow-hidden border border-line-strong">
                    <ThemedImage {...mobile} alt={`${project.title} telefon ekranı`} />
                  </div>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-col lg:py-2">
                <p className="font-mono text-small text-muted">{project.category}</p>
                <h3 className="mt-3 text-display font-semibold tracking-[-0.04em] text-strong">{project.title}</h3>
                <p className="mt-4 max-w-[34rem] text-read text-body">{summary}</p>

                {project.stats ? (
                  <dl className="mt-6 grid max-w-sm grid-cols-3 gap-4 border-t border-line pt-5">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="flex min-w-0 flex-col-reverse">
                        <dt className="mt-1.5 text-small text-muted">{trTitle(stat.label)}</dt>
                        <dd className="font-mono text-[1.5rem] font-semibold leading-none text-strong">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-1 pt-6">
                  <Link href={`/projeler/${project.slug}`} className={LINK}>
                    Vaka Çalışması
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className={LINK}>
                    Canlı Site
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Container>
  )
}
