import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FilterTabs, ProjectFilter } from '@/components/projects/ProjectFilter'
import { PreviewFollow } from '@/components/projects/PreviewFollow'
import { FeaturedRow, ProjectRow } from '@/components/projects/ProjectRow'
import { LIST_ID } from '@/components/projects/project-text'
import { PageTransition } from '@/components/site/PageTransition'
import { Container } from '@/components/ui/Container'
import { SketchUnderline } from '@/components/ui/Sketch'
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

/*
 * Proje dizini: EDİTORYAL LİSTE, kart ızgarası değil.
 *
 * On üç eş ağırlıklı kart (görsel + ad + kategori + açıklama + üç etiket)
 * göz için on üç ayrı karar demekti ve hangisinin önemli olduğu
 * okunmuyordu. Şimdi iki kademe var:
 *   - öne çıkan üç proje: dev ad, tek cümle, yanında görünür ekran görüntüsü;
 *   - geri kalanlar: tek satırlık ad + kategori. Masaüstünde görsel, satırın
 *     üstünde durulunca imleci izleyen bir önizleme olarak belirir;
 *     telefonda satırın başında küçük görsel olarak hep görünür.
 *
 * Süzgeç her iki kademeyi de süzer. Seçili kümede öne çıkan proje yoksa
 * (Oyunlar, Araçlar) üstteki bölüm ve "Diğer Projeler" başlığı kalkar;
 * kurallar burada, veriden üretiliyor (kümeler değişince elle güncellenmez).
 */
export default function ProjectsPage() {
  const ordered = getOrderedProjects(projects)
  const featured = ordered.filter((p) => p.featured)
  const rest = ordered.filter((p) => !p.featured)
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
      <style>{sectionRules(featured.map((p) => p.group), rest.map((p) => p.group))}</style>

      <Container as="section" size="wide" className="page-top pb-4 pt-10 sm:pb-8 sm:pt-16" aria-labelledby="projeler-baslik">
        <header className="max-w-3xl">
          <h1 id="projeler-baslik" className="page-title">
            <span className="sketch-host">
              <span className="display-ink">Projeler</span>
              <SketchUnderline />
            </span>
          </h1>
          <p className="page-lead">
            {projects.length} proje, {liveCount} tanesi yayında. Hepsinin kodu açık; {withPost} tanesinin nasıl
            yapıldığını blogda anlattım.
          </p>
        </header>

        <div className="mt-8 sm:mt-10">
          <Suspense fallback={<FilterTabs active={null} counts={counts} />}>
            <ProjectFilter counts={counts} />
          </Suspense>
        </div>

        <div id={LIST_ID} className="pscope mt-8 sm:mt-12">
          <section aria-labelledby="one-cikanlar" className="pfeat-section">
            <h2 id="one-cikanlar" className="sr-only">
              Öne Çıkan Projeler
            </h2>
            <ol className="pfeat-list">
              {featured.map((project, i) => (
                <FeaturedRow key={project.slug} project={project} priority={i === 0} />
              ))}
            </ol>
          </section>

          <section aria-labelledby="diger-projeler" className="prest-section">
            <h2 id="diger-projeler" className="prest-title">
              Diğer Projeler
            </h2>
            <ol className="prow-list">
              {rest.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </ol>
          </section>
          <PreviewFollow targetId={LIST_ID} />
        </div>
      </Container>
    </PageTransition>
  )
}

/**
 * Seçili kümede hiç öğesi kalmayan bölümü gizleyen kurallar. Öne çıkanlar
 * bölümü boşsa "Diğer Projeler" başlığı da kalkar: üstünde bir şey yokken
 * "diğer" demek anlamsız.
 */
function sectionRules(featuredGroups: readonly ProjectGroup[], restGroups: readonly ProjectGroup[]) {
  return PROJECT_GROUPS.map((group) => {
    const on = `.pscope[data-filter="${group}"]`
    const rules: string[] = []
    if (!featuredGroups.includes(group)) rules.push(`${on} .pfeat-section{display:none}`, `${on} .prest-title{display:none}`)
    if (!restGroups.includes(group)) rules.push(`${on} .prest-section{display:none}`)
    return rules.join('')
  }).join('')
}
