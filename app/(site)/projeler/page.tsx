import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProjectCard, type CardSize } from '@/components/projects/ProjectCard'
import { FilterChips, ProjectFilter } from '@/components/projects/ProjectFilter'
import { GRID_ID } from '@/components/projects/project-text'
import { PageTransition } from '@/components/site/PageTransition'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects } from '@/lib/content/projects'
import { PROJECT_GROUPS, type ProjectGroup } from '@/lib/content/types'
import { getOrderedProjects } from '@/lib/project-order'
import { breadcrumbJsonLd, collectionJsonLd } from '@/lib/seo'
import './projects.css'

export const metadata: Metadata = {
  title: 'Projeler',
  description:
    'Açılış Zili, Mimio, One Piece Hub, Harfiyen ve diğerleri: Next.js, TypeScript ve Postgres ile geliştirdiğim canlı projeler.',
  alternates: { canonical: '/projeler' },
  openGraph: {
    title: 'Projeler · Ahmet Akyapı',
    description: 'Next.js, TypeScript ve Postgres ile geliştirdiğim canlı projeler.',
    url: '/projeler',
    type: 'website',
  },
}

/**
 * Izgaradaki yer: ilk öne çıkan tam genişlik, öteki öne çıkanlar yarım,
 * geri kalanlar 7/5 ve 5/7 dönüşümlü satırlar. Üç eşit kart yan yana hiç
 * gelmiyor; her satır bir öncekinin aynası.
 */
function cardSize(index: number, featuredCount: number): CardSize {
  if (index === 0) return 'wide'
  if (index < featuredCount) return 'feature'
  const i = index - featuredCount
  const row = Math.floor(i / 2)
  const first = i % 2 === 0
  return (row % 2 === 0) === first ? 'major' : 'minor'
}

export default function ProjectsPage() {
  const ordered = getOrderedProjects(projects)
  const featuredCount = ordered.filter((p) => p.featured).length
  const liveCount = projects.filter((p) => p.badge === 'Canlı').length
  const withPost = projects.filter((p) => p.postSlug).length

  const counts = Object.fromEntries([
    ['all', projects.length],
    ...PROJECT_GROUPS.map((g) => [g, projects.filter((p) => p.group === g).length]),
  ]) as Record<ProjectGroup | 'all', number>

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: 'Ana Sayfa', path: '/' },
              { name: 'Projeler', path: '/projeler' },
            ]),
            collectionJsonLd({
              name: 'Projeler',
              path: '/projeler',
              items: ordered.map((p) => ({ name: p.title, url: `/projeler/${p.slug}` })),
            }),
          ]),
        }}
      />

      <Container as="section" size="wide" className="py-12 sm:py-20" aria-labelledby="projeler-baslik">
        <SectionHeading
          as="h1"
          id="projeler-baslik"
          size="page"
          kunye={`${projects.length} Proje, ${liveCount} Canlı`}
          title="Projeler"
          description={`Hepsinin kodu açık. ${withPost} tanesinin nasıl yapıldığını blogda ayrıca anlattım.`}
        />

        <div className="mt-8 sm:mt-10">
          <Suspense fallback={<FilterChips active={null} counts={counts} />}>
            <ProjectFilter counts={counts} />
          </Suspense>
        </div>

        <div id={GRID_ID} className="pgrid mt-10 sm:mt-14">
          {ordered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} size={cardSize(i, featuredCount)} priority={i === 0} />
          ))}
        </div>
      </Container>
    </PageTransition>
  )
}
