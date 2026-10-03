import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArmedMorph } from '@/components/projects/ArmedMorph'
import { ProjectCover } from '@/components/projects/ProjectCover'
import { ShotViewer, type ViewerShot } from '@/components/projects/ShotViewer'
import { splitLead, titleCaseTr } from '@/components/projects/project-text'
import { BrandIcon } from '@/components/site/BrandIcon'
import { PageTransition } from '@/components/site/PageTransition'
import { Container } from '@/components/ui/Container'
import { KunyeGrid, KunyeLine } from '@/components/ui/Kunye'
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
 *   kahraman görsel (morf hedefi, LCP) → ad + tek cümle → bilgi satırı
 *   (kategori, tech stack, bağlantılar) → proje hakkında (sayılar varsa
 *   metnin altında) → ekran görüntüleri (desktop-2, telefon; yoksa bölüm
 *   yok) → ilgili yazı (varsa) → sıradaki proje.
 *
 * Başlıklar düz Türkçe: "Vaka Çalışması", "Teknik Not", "Rakamlarla",
 * "Ekranlar" gibi çeviri kokan etiketler kalktı (3 Ekim 2026, sahibinin
 * isteği). Teknik not ayrı bir kutu değil, "Proje Hakkında"nın ikinci
 * paragrafı: kutu içinde kutu, okunacak tek bir metni ikiye bölüyordu.
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
        <Container size="default" className="pt-6 sm:pt-10">
          <Link
            href="/projeler"
            transitionTypes={['nav-back']}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-body transition-colors hover:text-strong pointer-fine:min-h-9"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Tüm Projeler
          </Link>
        </Container>

        {/* Kahraman: dizinden morf eden görsel, LCP. Genişliği ekran
            yüksekliğine bağlı (projects.css → .phero-frame): ad ilk ekranda. */}
        <Container size="default" className="phero mt-4 sm:mt-6">
          <div className="phero-frame">
            {hasHeroShot ? (
              <button type="button" data-shot={0} className="shot-zoom group relative" aria-label={`${VIEW_ALT.desktop(project.title)}, büyüt`}>
                <ProjectCover project={project} morph priority layout="hero" />
                <ZoomHint />
              </button>
            ) : (
              <ProjectCover project={project} morph priority layout="hero" />
            )}
          </div>
        </Container>

      <article aria-labelledby="proje-adi">
        <Container size="default">
          <header className={bannerHero ? 'mt-6 max-w-4xl sm:mt-8' : 'mt-8 max-w-4xl sm:mt-12'}>
            <h1
              id="proje-adi"
              className={
                bannerHero
                  ? 'text-heading font-semibold tracking-[-0.03em] text-strong'
                  : 'display-ink text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.045em]'
              }
            >
              {project.title}
            </h1>
            <p className="mt-5 max-w-[48ch] text-lead text-body sm:text-[1.375rem] sm:leading-[1.55]">{lead}</p>
          </header>

          <KunyeGrid
            columns={3}
            className="mt-10 max-w-5xl sm:mt-12"
            items={[
              { label: 'Kategori', value: project.category },
              { label: 'Tech Stack', value: project.tags.join(', ') },
              { label: 'Bağlantılar', value: <ProjectLinks project={project} /> },
            ]}
          />
        </Container>

        {rest || project.detail || project.stats?.length ? (
          <Container as="section" size="default" aria-labelledby="hakkinda" className="mt-16 sm:mt-24">
            <div className="max-w-[68ch]">
              <h2 id="hakkinda" className="text-heading font-semibold tracking-[-0.03em] text-strong">
                Proje Hakkında
              </h2>
              <div className="mt-5 space-y-5 text-read text-body">
                {rest ? <p>{rest}</p> : null}
                {project.detail ? <p>{project.detail}</p> : null}
                {project.onlyDark ? (
                  <p className="text-base text-muted">
                    Uygulamanın yalnızca koyu teması var; ekran görüntüleri bu yüzden açık temada da koyu.
                  </p>
                ) : null}
              </div>
              {project.stats?.length ? (
                <dl className="mt-10 grid grid-cols-3 gap-x-6 border-t border-line pt-6">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="flex min-w-0 flex-col">
                      <dt className="order-2 mt-2 text-sm text-body">{titleCaseTr(stat.label)}</dt>
                      <dd className="order-1 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] text-strong">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </Container>
        ) : null}

        {second || phone ? (
          <Container as="section" size="default" aria-labelledby="ekran-goruntuleri" className="mt-16 sm:mt-24">
            <h2 id="ekran-goruntuleri" className="text-heading font-semibold tracking-[-0.03em] text-strong">
              Ekran Görüntüleri
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

        {post ? (
          <Container as="section" size="default" aria-labelledby="ilgili-yazi" className="mt-16 sm:mt-24">
            <h2 id="ilgili-yazi" className="text-heading font-semibold tracking-[-0.03em] text-strong">
              Bu Projeyle İlgili Yazı
            </h2>
            <div className="group relative mt-6 grid max-w-5xl gap-4 rounded-card border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-8">
              <div className="min-w-0">
                <h3 className="text-title font-semibold tracking-[-0.02em] text-strong sm:text-[1.625rem] sm:leading-[1.2]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-line-focus focus-visible:after:outline-solid"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-[60ch] text-base text-body">{post.excerpt}</p>
                <KunyeLine className="mt-4" items={[formatPostDate(post.date), `${readingTime(post)} Okuma`]} />
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

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const
const LINK_CLASS =
  'inline-flex min-h-11 items-center gap-1.5 font-medium text-primary-ink underline decoration-primary-soft/40 underline-offset-4 transition-colors hover:decoration-primary-ink pointer-fine:min-h-7'

function ProjectLinks({ project }: { project: Project }) {
  const hasSite = project.badge === 'Canlı' && project.link !== project.github
  return (
    <span className="flex flex-col items-start">
      {hasSite ? (
        <a href={project.link} {...EXTERNAL} className={LINK_CLASS}>
          Siteyi Aç
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
 * Sıradaki proje: yönlü geçiş (`nav-forward`, içerik sola kayar) ve küçük
 * resim sonraki sayfanın kahramanına morf eder. Bu sayfada iki ad var:
 * kahraman (`project-<bu>`) ve bu küçük resim (`project-<sonraki>`); ikisi
 * farklı, kural (bir ad bir öğe) korunuyor. Küçük resmin adı yalnız
 * tıklanınca takılır (ArmedMorph'taki gerekçe).
 */
function NextProject({ project }: { project: Project }) {
  const { lead } = splitLead(project.description)
  return (
    <Container as="section" size="default" aria-labelledby="sonraki-proje" className="mt-20 pb-20 sm:mt-28 sm:pb-28">
      <ArmedMorph
        name={`project-${project.slug}`}
        className="pcard group relative grid gap-6 border-t border-line pt-8 sm:pt-10 lg:grid-cols-12 lg:items-center lg:gap-10"
        coverClassName="lg:col-span-5"
        content={
          <div className="min-w-0 lg:col-span-7">
            <p className="text-sm font-medium text-body">Sıradaki Proje</p>
            <h2 id="sonraki-proje" className="mt-2 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-strong">
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
