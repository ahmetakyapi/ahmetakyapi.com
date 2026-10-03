import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArmedMorph } from '@/components/projects/ArmedMorph'
import { ProjectCover } from '@/components/projects/ProjectCover'
import { ShotViewer, type ViewerShot } from '@/components/projects/ShotViewer'
import { badgeLabel, splitLead, titleCaseTr } from '@/components/projects/project-text'
import { BrandIcon } from '@/components/site/BrandIcon'
import { PageTransition } from '@/components/site/PageTransition'
import { Container } from '@/components/ui/Container'
import { KunyeGrid, KunyeLine } from '@/components/ui/Kunye'
import { Tag } from '@/components/ui/Tag'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { blogPosts } from '@/lib/content/posts'
import { shotSources } from '@/lib/content/project-shots'
import { getProjectBySlug, projects } from '@/lib/content/projects'
import type { Project } from '@/lib/content/types'
import { getOrderedProjects } from '@/lib/project-order'
import type { ShotView } from '@/lib/project-shot'
import { formatPostDate, readingTime } from '@/lib/reading-time'
import { TWITTER, breadcrumbJsonLd, projectDetailJsonLd } from '@/lib/seo'
import '../projects.css'

/*
 * Proje detayı. Sıra her projede aynı; envanteri eksik projede bölüm
 * DÜŞER, boş kutu kalmaz:
 *   kahraman görsel (morf hedefi, LCP) → ad + tek cümle → künye →
 *   proje hakkında → ekranlar (desktop-2, telefon; yoksa bölüm yok) →
 *   rakamlar (varsa) → ilgili yazı (varsa) → sonraki proje.
 *
 * Bu segmentte `loading.tsx` YOK: varsa sayfa akışla gider ve `notFound()`
 * gerçek 404 üretemez (blog/[slug] ile aynı gerekçe).
 */

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<'/projeler/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Proje Bulunamadı' }

  const { lead } = splitLead(project.description)
  const url = `/projeler/${project.slug}`

  return {
    title: project.title,
    description: lead,
    alternates: { canonical: url },
    keywords: [project.category, ...project.tags, 'Ahmet Akyapı'],
    openGraph: {
      type: 'website',
      title: `${project.title} · Ahmet Akyapı`,
      description: lead,
      url,
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} · Ahmet Akyapı`,
      description: lead,
      creator: TWITTER,
    },
  }
}

/** Galeri ve pencere sırası: kahraman (0), ikinci ekran, telefon. */
const VIEWS = ['desktop', 'desktop-2', 'mobile'] as const satisfies readonly ShotView[]

const VIEW_ALT: Record<ShotView, (title: string) => string> = {
  desktop: (title) => `${title} ana ekranı`,
  'desktop-2': (title) => `${title} arayüzünden ikinci görünüm`,
  mobile: (title) => `${title} telefonda`,
}

/* Pencerenin altyazısı bir künye, cümle değil: Title Case ve alt metinden
   ayrı (alt metin ekran okuyucuya cümle olarak gider). */
const VIEW_CAPTION: Record<ShotView, (title: string) => string> = {
  desktop: (title) => `${title} · Ana Ekran`,
  'desktop-2': (title) => `${title} · İkinci Ekran`,
  mobile: (title) => `${title} · Telefon`,
}

/**
 * Galeri ızgarasında masaüstü ve telefon görüntüsü AYNI YÜKSEKLİKTE bitsin:
 * sütun oranı iki görüntünün en-boy oranlarının oranı.
 * 2160×1350 (0,625) ve 780×1688 (2,164) → 3,46 : 1.
 */
function galleryColumns(desktop: { width: number; height: number }, mobile: { width: number; height: number }) {
  const ratio = mobile.height / mobile.width / (desktop.height / desktop.width)
  return `minmax(0, ${ratio.toFixed(3)}fr) minmax(0, 1fr)`
}

export default async function ProjectPage({ params }: PageProps<'/projeler/[slug]'>) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const ordered = getOrderedProjects(projects)
  const next = ordered[(ordered.findIndex((p) => p.slug === project.slug) + 1) % ordered.length]
  const { lead, rest } = splitLead(project.description)
  const post = project.postSlug ? blogPosts.find((p) => p.slug === project.postSlug) : undefined

  const shots = VIEWS.flatMap((view) => {
    const src = shotSources(project.slug, view)
    return src ? [{ view, src, alt: VIEW_ALT[view](project.title), caption: VIEW_CAPTION[view](project.title) }] : []
  })
  const viewerShots: ViewerShot[] = shots.map(({ src, alt, caption }) => ({ ...src, alt, caption }))
  const hasHeroShot = shots[0]?.view === 'desktop'
  const second = shots.find((s) => s.view === 'desktop-2')
  const phone = shots.find((s) => s.view === 'mobile')
  const indexOf = (view: ShotView) => shots.findIndex((s) => s.view === view)
  /* Afişli kahraman (dev-starter): afiş adı zaten büyük puntoyla yazıyor.
     Altında aynı ad bir kez daha dev puntoyla duruyordu; burada h1 künye
     ölçeğine iner, yeri ve anlamı aynı kalır. */
  const bannerHero = !hasHeroShot && project.slug === 'dev-starter'

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            projectDetailJsonLd(project),
            breadcrumbJsonLd([
              { name: 'Ana Sayfa', path: '/' },
              { name: 'Projeler', path: '/projeler' },
              { name: project.title, path: `/projeler/${project.slug}` },
            ]),
          ]),
        }}
      />
      {viewerShots.length > 0 ? <ShotViewer shots={viewerShots} /> : null}

      {/* `.phero-scope` kahramanın DOĞRUDAN ebeveyni ve sayfanın tamamını
          kaplıyor: geçiş sürerken kahraman burada yapışkan (projects.css). */}
      <div className="phero-scope">
        <Container size="wide" className="pt-6 sm:pt-10">
          <Link
            href="/projeler"
            transitionTypes={['nav-back']}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-body transition-colors hover:text-strong pointer-fine:min-h-9"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Tüm Projeler
          </Link>
        </Container>

        {/* Kahraman: dizin kartından morf eden görsel, LCP. */}
        <Container size="wide" className="phero mt-4 sm:mt-6">
          {hasHeroShot ? (
            <button type="button" data-shot={0} className="shot-zoom group relative" aria-label={`${VIEW_ALT.desktop(project.title)}, büyüt`}>
              <ProjectCover project={project} morph priority layout="hero" />
              <ZoomHint />
            </button>
          ) : (
            <ProjectCover project={project} morph priority layout="hero" />
          )}
        </Container>

      <article aria-labelledby="proje-adi">
        <Container size="wide">
          {/* Kategori künyede (Kategori satırı); başlığın üstünde ikinci kez
              mono bir etiket olarak durmaz. */}
          <header className={bannerHero ? 'mt-6 max-w-4xl sm:mt-8' : 'mt-10 max-w-4xl sm:mt-14'}>
            <h1
              id="proje-adi"
              className={
                bannerHero
                  ? 'font-mono text-small font-medium text-muted'
                  : 'display-ink text-[clamp(2.75rem,8vw,6rem)] leading-[0.98] font-semibold tracking-[-0.045em]'
              }
            >
              {project.title}
            </h1>
            <p
              className={
                bannerHero
                  ? 'mt-3 max-w-[48ch] text-lead text-body sm:text-[1.375rem] sm:leading-[1.55]'
                  : 'mt-6 max-w-[48ch] text-lead text-body sm:text-[1.375rem] sm:leading-[1.55]'
              }
            >
              {lead}
            </p>
          </header>

          <KunyeGrid
            className="mt-10 sm:mt-12"
            items={[
              { label: 'Kategori', value: project.category },
              { label: 'Durum', value: <Status project={project} /> },
              { label: 'Yığın', value: project.tags.join(', ') },
              { label: 'Bağlantılar', value: <ProjectLinks project={project} /> },
            ]}
          />
        </Container>

        {rest || project.detail ? (
          <Container as="section" size="wide" aria-labelledby="hakkinda" className="mt-20 sm:mt-28">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <h2 id="hakkinda" className="text-title font-semibold text-strong lg:col-span-4">
                Proje Hakkında
              </h2>
              <div className="max-w-[68ch] space-y-6 lg:col-span-8">
                {rest ? <p className="text-read text-body">{rest}</p> : null}
                {project.detail ? (
                  <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
                    <h3 className="text-base font-semibold text-strong">Teknik Not</h3>
                    <p className="mt-2 text-read text-body">{project.detail}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        ) : null}

        {second || phone ? (
          <Container as="section" size="wide" aria-labelledby="ekranlar" className="mt-20 sm:mt-28">
            <h2 id="ekranlar" className="text-title font-semibold text-strong">
              Ekranlar
            </h2>
            <div
              className="pgallery mt-6 grid items-start gap-4 sm:gap-6"
              style={second && phone ? { ['--gallery-cols' as string]: galleryColumns(second.src, phone.src) } : undefined}
            >
              {second ? <GalleryShot index={indexOf('desktop-2')} shot={second} /> : null}
              {phone ? <GalleryShot index={indexOf('mobile')} shot={phone} phone /> : null}
            </div>
          </Container>
        ) : null}

        {project.stats?.length ? (
          <Container as="section" size="wide" aria-labelledby="rakamlar" className="mt-20 sm:mt-28">
            <h2 id="rakamlar" className="text-title font-semibold text-strong">
              Rakamlarla
            </h2>
            <dl className="mt-6 grid grid-cols-3 gap-x-6 border-t border-line pt-6">
              {project.stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col">
                  <dt className="order-2 mt-2 font-mono text-small text-muted">{titleCaseTr(stat.label)}</dt>
                  <dd className="order-1 text-[clamp(2.5rem,7vw,4.5rem)] leading-none font-semibold tracking-[-0.04em] text-strong">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        ) : null}

        {post ? (
          <Container as="section" size="wide" aria-labelledby="ilgili-yazi" className="mt-20 sm:mt-28">
            <h2 id="ilgili-yazi" className="text-title font-semibold text-strong">
              Nasıl Yapıldı
            </h2>
            <div className="group relative mt-6 grid gap-4 rounded-card border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-8">
              <div className="min-w-0">
                <h3 className="text-heading font-semibold tracking-[-0.03em] text-strong">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-line-focus focus-visible:after:outline-solid"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-[60ch] text-base text-body">{post.excerpt}</p>
                <KunyeLine className="mt-4" items={[formatPostDate(post.date), readingTime(post)]} />
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-ink" aria-hidden="true">
                Yazıyı Oku
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Container>
        ) : null}
      </article>

      {next && next.slug !== project.slug ? <NextProject project={next} /> : null}
      </div>
    </PageTransition>
  )
}

function ZoomHint() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface-solid text-strong opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-4 sm:bottom-4"
    >
      <Maximize2 className="size-4" />
    </span>
  )
}

function GalleryShot({
  index,
  shot,
  phone = false,
}: {
  index: number
  shot: { src: { light: string; dark?: string; width: number; height: number }; alt: string }
  phone?: boolean
}) {
  return (
    <button
      type="button"
      data-shot={index}
      aria-label={`${shot.alt}, büyüt`}
      className={phone ? 'shot-zoom group relative mx-auto max-w-[15rem] sm:max-w-none' : 'shot-zoom group relative'}
    >
      <span className="block overflow-hidden rounded-card border border-line bg-surface-sunken">
        <ThemedImage {...shot.src} alt={shot.alt} />
      </span>
      <ZoomHint />
    </button>
  )
}

function Status({ project }: { project: Project }) {
  return (
    <span className="flex flex-col items-start gap-1.5">
      <Tag tone={project.badge === 'Canlı' ? 'primary' : 'neutral'}>{badgeLabel(project.badge)}</Tag>
      {project.onlyDark ? <span className="font-mono text-small text-muted">Yalnız Koyu Tema</span> : null}
    </span>
  )
}

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const
const LINK_CLASS =
  'inline-flex min-h-11 items-center gap-1.5 font-medium text-primary-ink underline decoration-primary-soft/40 underline-offset-4 transition-colors hover:decoration-primary-ink pointer-fine:min-h-7'

function ProjectLinks({ project }: { project: Project }) {
  const hasSite = project.badge === 'Canlı' && project.link !== project.github
  return (
    <span className="flex flex-col items-start">
      {hasSite ? (
        <a href={project.link} {...EXTERNAL} className={LINK_CLASS}>
          Canlı Site
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only"> (yeni sekmede açılır)</span>
        </a>
      ) : null}
      {project.github ? (
        <a href={project.github} {...EXTERNAL} className={LINK_CLASS}>
          <BrandIcon name="github" size={14} />
          Kaynak Kod
          <span className="sr-only"> (yeni sekmede açılır)</span>
        </a>
      ) : null}
    </span>
  )
}

/**
 * Sonraki proje: yönlü geçiş (`nav-forward`, içerik sola kayar) ve küçük
 * resim sonraki sayfanın kahramanına morf eder. Bu sayfada iki ad var:
 * kahraman (`project-<bu>`) ve bu küçük resim (`project-<sonraki>`); ikisi
 * farklı, kural (bir ad bir öğe) korunuyor. Küçük resmin adı yalnız
 * tıklanınca takılır (ArmedMorph'taki gerekçe).
 */
function NextProject({ project }: { project: Project }) {
  const { lead } = splitLead(project.description)
  return (
    <Container as="section" size="wide" aria-labelledby="sonraki-proje" className="mt-24 pb-20 sm:mt-32 sm:pb-28">
      <ArmedMorph
        name={`project-${project.slug}`}
        className="pcard group relative grid gap-6 border-t border-line pt-8 sm:pt-10 lg:grid-cols-12 lg:items-center lg:gap-10"
        coverClassName="lg:col-span-5"
        content={
          <div className="min-w-0 lg:col-span-7">
            <p className="font-mono text-small text-muted">Sonraki Proje</p>
            <h2 id="sonraki-proje" className="mt-3 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-strong">
              <Link
                href={`/projeler/${project.slug}`}
                transitionTypes={['nav-forward']}
                className="after:absolute after:inset-0 after:z-10 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-line-focus focus-visible:after:outline-solid"
              >
                {project.title}
              </Link>
            </h2>
            <p className="mt-4 max-w-[52ch] text-base text-body">{lead}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-ink" aria-hidden="true">
              Projeyi İncele
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        }
        cover={<ProjectCover project={project} />}
      />
    </Container>
  )
}
