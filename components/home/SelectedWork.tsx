import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { MaskTitle } from '@/components/home/MaskTitle'
import { trTitle } from '@/components/home/tr-title'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { shotSources } from '@/lib/content/project-shots'
import type { Project } from '@/lib/content/types'
import type { HomeContent } from '@/lib/site-content'

/**
 * Öne Çıkan Projeler: üç proje, üst üste binen paneller (sticky-stack).
 *
 * Hareket tamamen CSS (home.css → "Seçili İşler"): her panel yapışır, bir
 * sonraki panel alttan gelirken öncekini hafifçe küçültür. Zamanlayıcı bir
 * sonraki panelin kendi görünüm zaman çizelgesi; JavaScript yok. Destek
 * yoksa, hareket azaltılmışsa ya da ekran panel boyuna yetmiyorsa düz liste.
 *
 * Kart projenin kendi tonunda (`tint-card`, globals.css; 3 Ekim 2026,
 * sahibinin seçtiği "B": beyaz üstü beyaz kartlar birbirinden ayrılmıyordu).
 *
 * Görseller `project-<slug>` adını TAŞIMAZ: paneller kaydırmayla küçülüyor
 * (transform) ve morfun başlangıç kutusu o an ölçülen küçülmüş hâl olurdu.
 * Ana sayfadan proje sayfasına morf yok; bilinçli takas.
 */
export function SelectedWork({ home, projects }: { home: HomeContent; projects: Project[] }) {
  const panels = home.selectedWork.flatMap(({ slug, summary }) => {
    const project = projects.find((p) => p.slug === slug)
    const desktop = shotSources(slug, 'desktop')
    return project && desktop ? [{ project, summary, desktop, mobile: shotSources(slug, 'mobile') }] : []
  })

  return (
    <Container as="section" size="wide" aria-labelledby="secili-isler" className="pt-16 sm:pt-20">
      <SectionHeading
        id="secili-isler"
        title={<MaskTitle accentLast>Öne Çıkan Projeler</MaskTitle>}
        size="home"
        className="home-work-head mb-8 sm:mb-10"
      />

      <ol className="home-stack">
        {panels.map(({ project, summary, desktop, mobile }) => (
          <li key={project.slug} className="home-stack-item">
            <article
              className="home-stack-card tint-card grid items-center gap-6 rounded-card p-3 sm:p-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:gap-10 lg:p-6"
              style={{ '--tint': project.tint ?? project.accent } as CSSProperties}
            >
              <span aria-hidden="true" className="tint-card-glow" />
              <div className="home-stack-media tint-card-media">
                <div className="overflow-hidden rounded-button">
                  <ThemedImage {...desktop} alt={`${project.title} masaüstü ekranı`} />
                </div>
                {mobile ? (
                  <div className="home-stack-phone overflow-hidden">
                    <ThemedImage {...mobile} alt={`${project.title} telefon ekranı`} />
                  </div>
                ) : null}
              </div>

              <div className="home-card-text flex min-w-0 flex-col px-2 pb-3 sm:px-1 lg:py-2 lg:pr-4">
                <p className="tint-card-kicker">{project.category}</p>
                <h3 className="tint-card-title home-card-title mt-3">{project.title}</h3>
                <p className="mt-3 max-w-[30rem] text-[1.0625rem] leading-relaxed text-body">{summary}</p>

                {project.stats ? (
                  <dl className="tint-card-stats mt-5 grid max-w-sm grid-cols-3 gap-4 pt-4">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="flex min-w-0 flex-col-reverse">
                        <dt className="mt-1.5 text-small font-medium text-muted">{trTitle(stat.label)}</dt>
                        <dd className="font-mono text-[1.375rem] font-semibold leading-none">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="flex flex-wrap items-center gap-3 pt-6">
                  <Link href={`/projeler/${project.slug}`} className="tint-card-btn">
                    Projeyi İncele
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="tint-card-link">
                    Siteyi Aç
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
