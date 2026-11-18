import { ArrowLeft, ArrowRight, ArrowUpRight, Lock, Maximize2 } from 'lucide-react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArmedMorph } from '@/components/projects/ArmedMorph'
import { ProjectCover } from '@/components/projects/ProjectCover'
import { ShotViewer, type ViewerShot } from '@/components/projects/ShotViewer'
import { liveUrl, splitLead, titleCaseTr } from '@/components/projects/project-text'
import { BrandIcon } from '@/components/site/BrandIcon'
import { PageTransition } from '@/components/site/PageTransition'
import { buttonClass } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { KunyeLine } from '@/components/ui/Kunye'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { blogPosts } from '@/lib/content/posts'
import { shotSources, type ShotSources } from '@/lib/content/project-shots'
import { getProjectBySlug, projects } from '@/lib/content/projects'
import type { Project } from '@/lib/content/types'
import { getOrderedProjects } from '@/lib/project-order'
import type { ShotView } from '@/lib/project-shot'
import { formatPostDate, readingTime } from '@/lib/reading-time'
import {
  ALTERNATES_BASE,
  OPEN_GRAPH_BASE,
  TWITTER_BASE,
  breadcrumbJsonLd,
  jsonLdHtml,
  projectDetailJsonLd,
} from '@/lib/seo'
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
    alternates: { ...ALTERNATES_BASE, canonical: url },
    keywords: [project.category, ...project.tags, 'Ahmet Akyapı'],
    openGraph: {
      ...OPEN_GRAPH_BASE,
      title: `${project.title} · Ahmet Akyapı`,
      description: lead,
      url,
    },
    twitter: {
      ...TWITTER_BASE,
      title: `${project.title} · Ahmet Akyapı`,
      description: lead,
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
  /* Büyütülen görüntü asıl dosya: küçük kopyalar (srcSet) pencereye gitmez. */
  const viewerShots: ViewerShot[] = shots.map(({ src: { light, dark, width, height }, alt, caption }) => ({ light, dark, width, height, alt, caption }))
  const hasHeroShot = shots[0]?.view === 'desktop'
  const second = shots.find((s) => s.view === 'desktop-2')
  const phone = shots.find((s) => s.view === 'mobile')
  const indexOf = (view: ShotView) => shots.findIndex((s) => s.view === view)
  const site = liveUrl(project)

  return (
    <PageTransition>
      <div className="scroll-progress" aria-hidden="true" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml([
          projectDetailJsonLd(project),
          breadcrumbJsonLd([
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Projeler', path: '/projeler' },
            { name: project.title, path: `/projeler/${project.slug}` },
          ]),
        ])}
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
              <BrowserFrame host={hostOf(site ?? project.link ?? project.github)}>
                <button type="button" data-shot={0} className="shot-zoom group relative block w-full" aria-label={`${VIEW_ALT.desktop(project.title)}, büyüt`}>
                  <ProjectCover project={project} morph priority className="rounded-none! border-0!" />
                  <ZoomHint />
                </button>
              </BrowserFrame>
            ) : (
              <ProjectCover project={project} morph priority />
            )}
          </div>
        </Container>

      <article aria-labelledby="proje-adi">
        <Container size="default">
          {/* İki sütun: solda ad, tek cümle ve eylemler; sağda künye. Eskiden künye
              başlığın ALTINDA iki geniş sütundu, başlığın yanı boş kalıyordu
              (18 Kasım 2026, sahibinin itirazı). Dar ekranda alt alta. */}
          {/* Genişlik kahraman görselle aynı (.phero-frame: ekran yüksekliğine bağlı); künyenin sağ kenarı görselin kenarında biter. */}
          <header className="phero-frame mt-8 grid gap-10 sm:mt-12 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="min-w-0 lg:col-span-7">
              <h1
                id="proje-adi"
                // Boşluksuz uzun ad ("ahmetakyapi.com") yedi sütunluk alana sığmıyor, satıra da kırılamıyor: bir kademe küçük.
                className={`display-ink leading-[0.98] font-semibold tracking-[-0.045em] text-balance ${
                  project.title.length > 13 && !project.title.includes(' ')
                    ? 'text-[clamp(2.5rem,4.6vw,4rem)]'
                    : 'text-[clamp(2.75rem,6.4vw,5.25rem)]'
                }`}
              >
                {project.title}
              </h1>
              <p className="mt-5 max-w-[46ch] text-lead text-body sm:text-[1.375rem] sm:leading-[1.55]">{lead}</p>
              <ProjectLinks project={project} />
            </div>
            <ProjectFacts project={project} live={Boolean(site)} />
          </header>
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

/** "https://www.ornek.com/yol" → "ornek.com". Pencere çubuğunun adres hapı. */
function hostOf(url?: string | null) {
  if (!url) return null
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return null
  }
}

/**
 * Kahraman ekran görüntüsünün tarayıcı penceresi. Görüntünün içinde o
 * sitenin kendi butonları var; çerçevesiz durunca hemen altındaki bu
 * sayfanın butonlarıyla karışıyor, tıklanacak gibi okunuyordu (18 Kasım
 * 2026). Pencere çubuğu (üç nokta, adres) "bu bir sitenin resmi" demenin
 * yerleşik yolu. Çubuk süs: bağlantı değil, üstüne gelince değişmez.
 */
function BrowserFrame({ host, children }: { host: string | null; children: ReactNode }) {
  return (
    <div className="pwindow overflow-hidden rounded-card border border-line bg-surface-solid">
      <div aria-hidden="true" className="grid h-9 grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] items-center border-b border-line px-3.5 select-none sm:h-10">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        {host ? (
          <span className="mx-auto flex max-w-full min-w-0 items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1 text-small text-muted">
            <Lock className="size-3 shrink-0" />
            <span className="truncate">{host}</span>
          </span>
        ) : (
          <span />
        )}
      </div>
      {children}
    </div>
  )
}

/**
 * Künye, başlığın yanında: kategori, durum, teknolojiler. Teknolojiler
 * virgüllü tek satır değil, tek tek etiket (göz tarar). Etiketler düz
 * yüzey: buton değil, kenarlıksız ve üstüne gelince değişmez.
 */
function ProjectFacts({ project, live }: { project: Project; live: boolean }) {
  return (
    <dl className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-1 lg:pl-10">
      <div className="min-w-0">
        <dt className="text-small font-medium text-muted">Kategori</dt>
        <dd className="mt-1.5 text-base text-strong">{project.category}</dd>
      </div>
      {project.badge ? (
        <div className="min-w-0">
          <dt className="text-small font-medium text-muted">Durum</dt>
          <dd className="mt-1.5 inline-flex items-center gap-2 text-base text-strong">
            {live ? <span aria-hidden="true" className="size-2 rounded-full bg-success" /> : null}
            {project.badge}
          </dd>
        </div>
      ) : null}
      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
        <dt className="text-small font-medium text-muted">Tech Stack</dt>
        <dd className="mt-2.5">
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-md bg-surface-sunken px-2.5 py-1 text-small font-medium text-body">
                {tag}
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
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

/* Galeri yuvaları (srcset seçimi): `sm` üstünde iki sütun 3,46 : 1 (bkz.
   galleryColumns), kap en çok 72rem; altında tek sütun, telefon görseli en
   çok 15rem. */
const GALLERY_DESKTOP_SIZES = '(min-width: 72rem) 52rem, (min-width: 640px) 75vw, 100vw'
const GALLERY_PHONE_SIZES = '(min-width: 72rem) 15rem, (min-width: 640px) 21vw, 15rem'

function GalleryShot({
  index,
  shot,
  phone = false,
}: {
  index: number
  shot: { src: ShotSources; alt: string }
  phone?: boolean
}) {
  return (
    <button
      type="button"
      data-shot={index}
      aria-label={`${shot.alt}, büyüt`}
      className={phone ? 'shot-zoom group relative mx-auto max-w-[15rem] sm:max-w-none' : 'shot-zoom group relative'}
    >
      <span className="shot-reveal block overflow-hidden rounded-card border border-line bg-surface-sunken">
        <ThemedImage {...shot.src} alt={shot.alt} sizes={phone ? GALLERY_PHONE_SIZES : GALLERY_DESKTOP_SIZES} />
      </span>
      <ZoomHint />
    </button>
  )
}

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const

/**
 * Başlığın hemen altında, ilk bakışta görünen eylemler: canlı site birincil
 * buton, kaynak kod ikincil. Eskiden künyenin üçüncü sütununda altı çizili
 * küçük bağlantılardı ve gözden kaçıyordu.
 */
function ProjectLinks({ project }: { project: Project }) {
  const site = liveUrl(project)
  if (!site && !project.github) return null
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {site ? (
        <a href={site} {...EXTERNAL} className={buttonClass({ variant: 'primary', size: 'lg' })}>
          Siteyi Aç
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (yeni sekmede açılır)</span>
        </a>
      ) : null}
      {project.github ? (
        <a href={project.github} {...EXTERNAL} className={buttonClass({ variant: site ? 'secondary' : 'primary', size: 'lg' })}>
          <BrandIcon name="github" size={16} />
          Kaynak Kod
          <span className="sr-only"> (yeni sekmede açılır)</span>
        </a>
      ) : null}
    </div>
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
            {/* Etiket başlığın içinde de var (gizli): bölge ve başlık listesinde
                yalnız öteki projenin adı okunuyordu. */}
            <p className="text-sm font-medium text-body" aria-hidden="true">
              Sıradaki Proje
            </p>
            <h2 id="sonraki-proje" className="mt-2 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-strong">
              <span className="sr-only">Sıradaki Proje: </span>
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
        coverHidden
        cover={<ProjectCover project={project} morph="armed" alt="" />}
      />
    </Container>
  )
}
