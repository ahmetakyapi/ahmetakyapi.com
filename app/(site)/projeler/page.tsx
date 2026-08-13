import type { Metadata } from 'next'
import Projects from '@/components/Projects'
import PageView from '@/components/PageView'
import { getSiteContent } from '@/lib/server/content-store'
import { breadcrumbJsonLd, collectionJsonLd } from '@/lib/seo'
import { getOrderedProjects } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Projeler',
  description:
    'Açılış Zili, Mimio, One Piece Hub, Harfiyen ve diğerleri — Next.js, TypeScript ve Postgres ile geliştirdiğim canlı projeler.',
  alternates: { canonical: '/projeler' },
  openGraph: {
    title: 'Projeler — Ahmet Akyapı',
    description: 'Next.js, TypeScript ve Postgres ile geliştirdiğim canlı projeler.',
    url: '/projeler',
    type: 'website',
  },
}

export default async function ProjectsPage() {
  const content = await getSiteContent()
  const ordered = getOrderedProjects(content.projects)

  return (
    <>
      <PageView pathname="/projeler" />
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
              items: ordered.map((p) => ({ name: p.title, url: p.link })),
            }),
          ]),
        }}
      />
      <Projects projects={content.projects} />
    </>
  )
}
