'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, Github, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
/* DOĞRUDAN kaynağından — '@/lib/data' üzerinden alınırsa o barrel
   blogPosts'u da dışa verdiği için dokuz makalenin tam metni (124 KB)
   istemci paketine giriyor. Tip importları erildiği için zararsız. */
import { techStack } from '@/lib/content/tech-stack'
import type { BlogPost, Project } from '@/lib/data'
import { getOrderedProjects } from '@/lib/project-order'
import type { HomeContent } from '@/lib/site-content'
import ProjectPreview from '@/components/ProjectPreview'
import { formatPostDate, readingTime } from '@/lib/reading-time'

const InteractiveGlobe = dynamic(() => import('@/components/InteractiveGlobe'), {
  ssr: false,
  /* Yer tutucu küre ile aynı oranda: yükleme bitince satır kaymasın. */
  loading: () => <div className="aspect-square w-full" aria-hidden="true" />,
})

const FEATURED_STACK = ['Angular', 'React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'PostgreSQL']
const featuredStack = techStack.filter((tech) => FEATURED_STACK.includes(tech.name))

/**
 * İmleci takip eden hafif çekim — düğme fareye doğru kayar.
 * Spring yerine doğrudan transform + CSS geçişi; React render'ı yok.
 */
function useMagnetic(strength = 0.24) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useRef(false)

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => { reduced.current = q.matches }
    apply()
    q.addEventListener('change', apply)
    return () => q.removeEventListener('change', apply)
  }, [])

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const el = ref.current
      if (!el || reduced.current) return
      const rect = event.currentTarget.getBoundingClientRect()
      const x = (event.clientX - rect.left - rect.width / 2) * strength
      const y = (event.clientY - rect.top - rect.height / 2) * strength
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    },
    [strength],
  )

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])

  return { ref, onMove, onLeave }
}

export default function Hero({
  home,
  projects,
  blogPosts,
}: {
  home: HomeContent
  projects: Project[]
  blogPosts: BlogPost[]
}) {
  const magnetic = useMagnetic()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const orderedProjects = getOrderedProjects(projects)
  const featuredProject = orderedProjects[0]
  const sideProjects = orderedProjects.slice(1, 3)
  const previewPosts = blogPosts.slice(0, 3)

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-[1]" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_60%)] opacity-60 dark:opacity-100" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1),transparent_60%)] opacity-50 dark:opacity-100" />
      </div>

      {/* ── Giriş ───────────────────────────────────────────────────────── */}
      {/* Bölüm dikeyde ortalanıyor: 1440px'te dolu görünen düzen, 2560px'te
          içeriği yukarı yapıştırıp altta yarım ekran boşluk bırakıyordu.
          Yükseklik min() ile tavanlı: max-height min-height'ı ezemediği
          için sınır doğrudan min-height'ın içinde. */}
      <section className="mx-auto flex min-h-[min(calc(100svh-4rem),54rem)] w-full max-w-6xl items-center px-6 py-12 sm:py-16 lg:py-20 2xl:max-w-[86rem] 2xl:px-10">
        <div className="grid w-full items-center gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] xl:gap-14 2xl:grid-cols-[minmax(0,1fr)_minmax(560px,660px)] 2xl:gap-20">
          <div
            className="max-w-[34rem] pt-2 sm:pt-8 xl:pt-0 2xl:max-w-[40rem]"
          >
            <p
              className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-2 sm:mb-6 dark:border-emerald-400/25 dark:bg-emerald-400/[0.07]"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300/90">
                {home.roleLabel}
              </span>
            </p>

            <h1 className="display-heading max-w-[620px] overflow-visible pb-4 text-[52px] leading-[1.02] text-slate-900 sm:pb-6 sm:text-[76px] lg:text-[88px] xl:text-[96px] 2xl:text-[110px] dark:text-white">
              <span className="block">{home.firstName}</span>
              <span className="hero-name-gradient block pb-[0.08em]">{home.lastName}</span>
            </h1>

            <div className="mt-4 max-w-[30rem] space-y-3 2xl:max-w-[34rem] text-[15px] leading-[1.75] text-slate-600 sm:mt-5 sm:space-y-4 sm:text-[16px] sm:leading-[1.8] lg:text-[17px] xl:text-[16px] 2xl:text-[18px] dark:text-slate-400">
              <p className="[text-wrap:balance]">{home.introPrimary}</p>
              <p className="[text-wrap:balance]">{home.introSecondary}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4 xl:mt-7">
              <div
                ref={magnetic.ref}
                onMouseMove={magnetic.onMove}
                onMouseLeave={magnetic.onLeave}
                className="magnetic inline-flex"
              >
                <Link href="/projeler" className="btn-primary group relative overflow-hidden">
                  <span
                    className="absolute inset-0 -translate-x-[100%] skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-[100%]"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Projeleri İncele
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </div>

              <a href="https://github.com/ahmetakyapi" target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-7 sm:gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                Uzmanlık:
              </span>
              <ul className="flex flex-wrap gap-2">
                {home.expertise.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-1.5 text-[12px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-[310px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[460px] xl:max-w-[520px] 2xl:max-w-[620px] xl:justify-self-end"
          >
            {/* Gradyanın kendisi zaten yumuşak; üstüne 64px blur filtresi
                koymak ayrı bir raster katmanı demekti. Kaldırıldı. */}
            <div
              className="absolute inset-0 -z-10 rounded-full opacity-60"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(139,92,246,0.28), rgba(34,211,238,0.14) 45%, transparent 70%)',
              }}
            />
            <InteractiveGlobe />
          </div>
        </div>
      </section>

      {/* ── Değer önermeleri + teknoloji ────────────────────────────────── */}
      <section aria-labelledby="calisma-bicimi" className="mx-auto max-w-6xl px-6 pb-6 sm:pb-10 2xl:max-w-[86rem] 2xl:px-10">
        <h2 id="calisma-bicimi" className="sr-only">
          Çalışma Biçimim
        </h2>
        <div
          className="hero-surface mb-6 rounded-[28px] px-4 py-5 sm:mb-10 sm:rounded-[34px] sm:px-6 sm:py-7"
        >
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {home.valueProps.map((item, index) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[22px] border border-slate-300/70 bg-white/70 p-5 transition-all duration-300 hover:border-slate-400/70 hover:bg-white/90 hover:shadow-sm sm:rounded-[26px] sm:p-6 dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-white/[0.14]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}90, transparent)` }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at 20% 0%, ${item.glow}, transparent 65%)` }}
                  aria-hidden="true"
                />
                <span
                  className="absolute right-5 top-5 font-mono text-[11px] text-slate-400 dark:text-white/[0.18]"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>

                <span
                  className="relative inline-flex rounded-[18px] p-3"
                  style={{ background: `${item.color}14`, border: `1px solid ${item.color}30` }}
                  aria-hidden="true"
                >
                  <span className="relative z-10 text-lg" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                </span>

                <h3 className="relative mt-4 text-[1.3rem] font-semibold tracking-[-0.04em] text-slate-900 sm:mt-5 sm:text-[1.45rem] lg:text-[1.55rem] dark:text-white">
                  {item.title}
                </h3>
                <p className="relative mt-2 max-w-xs text-[14px] leading-[1.75] text-slate-600 sm:mt-3 sm:text-[15px] sm:leading-[1.85] dark:text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div
            className="my-5 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent sm:my-7 dark:via-white/[0.08]"
            aria-hidden="true"
          />

          <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
            <p className="eyebrow-label text-[10px] text-slate-500 dark:text-slate-400">Kullandığım Teknolojiler</p>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Güncel teknolojilerle, güçlü ve ölçeklenebilir ürün deneyimleri
            </p>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {featuredStack.map((tech) => {
              /* Next.js beyaz logosu açık zeminde kayboluyor — tek istisna. */
              const light = mounted && !document.documentElement.classList.contains('dark')
              const isNext = tech.name === 'Next.js'
              const color = light && isNext ? '#171717' : tech.color
              const bg = light && isNext ? 'rgba(23,23,23,0.06)' : tech.bg
              const border = light && isNext ? 'rgba(23,23,23,0.18)' : tech.border
              return (
                <li
                  key={tech.name}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
                  <span className="text-[12px] font-medium" style={{ color }}>
                    {tech.name}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── Öne çıkan projeler ──────────────────────────────────────────── */}
      {featuredProject && (
        <section aria-labelledby="one-cikan-projeler" className="mx-auto max-w-6xl px-6 py-10 sm:py-20 2xl:max-w-[86rem] 2xl:px-10">
          <div className="mb-8 flex items-end justify-between sm:mb-12">
            <div
            >
              <p className="eyebrow-label mb-2 text-[11px] text-violet-700 sm:mb-3 dark:text-violet-400/90">
                Seçili Çalışmalar
              </p>
              <h2
                id="one-cikan-projeler"
                className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em]"
              >
                <span className="text-slate-900 dark:text-white">Öne Çıkan </span>
                <span className="bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400">
                  Projeler
                </span>
              </h2>
            </div>

            <Link
              href="/projeler"
              className="group hidden items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 sm:flex dark:text-slate-400 dark:hover:text-white"
            >
              Tümünü gör
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.3fr_1fr]">
            <article
              className="group relative overflow-hidden rounded-[28px] border border-slate-300/80 bg-card shadow-sm dark:border-white/[0.06]"
            >
              <div className="absolute inset-0 opacity-20 dark:opacity-30" style={{ background: featuredProject.gradient }} aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/75 to-transparent" aria-hidden="true" />

              <div className="relative z-10 flex h-full flex-col p-5 sm:p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-slate-400/50 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.08] dark:text-white/80">
                    {featuredProject.category}
                  </span>
                  <span className="rounded-full border border-violet-500/40 bg-violet-100 px-3 py-1 text-[11px] font-semibold text-violet-800 backdrop-blur-sm dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-300">
                    {featuredProject.badge}
                  </span>
                </div>

                <ProjectPreview project={featuredProject} size="lg" className="mt-5" priority />

                <div className="mt-6">
                  <h3 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[28px] lg:text-[32px] dark:text-white">
                    {featuredProject.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-slate-600 dark:text-slate-400">
                    {featuredProject.description}
                  </p>

                  {featuredProject.stats && (
                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                      {featuredProject.stats.map((stat) => (
                        <div key={stat.label}>
                          <dt className="font-mono text-[22px] font-semibold leading-none text-slate-900 dark:text-white">
                            {stat.value}
                          </dt>
                          <dd className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {featuredProject.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-300/70 pt-6 dark:border-white/[0.06]">
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2.5 text-[15px] font-semibold text-slate-900 dark:text-white"
                  >
                    Projeyi Aç
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-300 bg-violet-100 transition-all group-hover/link:scale-110 group-hover/link:bg-violet-200 dark:border-violet-400/30 dark:bg-violet-500/20 dark:group-hover/link:bg-violet-500/30">
                      <ArrowUpRight className="h-3.5 w-3.5 text-violet-700 dark:text-violet-300" aria-hidden="true" />
                    </span>
                  </a>

                  {featuredProject.postSlug && (
                    <Link
                      href={`/blog/${featuredProject.postSlug}`}
                      /* Dokunma hedefi yalnızca satır kutusu kadardı (21px)
                         ve WCAG 2.5.8'in 24 piksellik AA eşiğinin altındaydı;
                         bu bağımsız bir bağlantı, cümle içi olmadığı için
                         istisna kapsamına girmiyor. Dikey dolgu hedefi
                         büyütüyor, negatif kenar boşluğu düzeni aynı
                         bırakıyor. */
                      className="-my-1.5 inline-block py-1.5 text-[14px] font-medium text-violet-700 underline decoration-violet-300 underline-offset-4 transition-colors hover:text-violet-900 dark:text-violet-300 dark:decoration-violet-400/40 dark:hover:text-violet-200"
                    >
                      Nasıl yapıldığını oku →
                    </Link>
                  )}
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-4 sm:gap-5">
              {sideProjects.map((project, i) => (
                <article
                  key={project.id}
                  className="group relative flex-1 overflow-hidden rounded-[20px] border border-slate-300/80 bg-card shadow-sm sm:rounded-[24px] dark:border-white/[0.06]"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[2px] opacity-70"
                    style={{ background: project.gradient }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex h-full flex-col p-5 sm:p-6 lg:p-7">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                        {project.category}
                      </span>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} projesini aç`}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-600 transition-all hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>

                    <h3 className="text-[20px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.75] text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>

                    <ProjectPreview project={project} size="sm" className="my-4" />

                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                      {project.tags.slice(0, 5).map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-center sm:hidden">
            <Link
              href="/projeler"
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:text-white"
            >
              Tüm projeleri gör
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Blog önizlemesi ─────────────────────────────────────────────── */}
      <section aria-labelledby="son-yazilar" className="mx-auto max-w-6xl px-6 pb-14 pt-6 sm:pb-24 sm:pt-10 2xl:max-w-[86rem] 2xl:px-10">
        <div
          className="mb-10 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent sm:mb-20 dark:via-white/[0.06]"
          aria-hidden="true"
        />

        <div className="mb-8 flex items-end justify-between sm:mb-12">
          <div
          >
            <p className="eyebrow-label mb-2 text-[11px] text-cyan-700 sm:mb-3 dark:text-cyan-400/90">Yazılar</p>
            <h2 id="son-yazilar" className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">
              <span className="text-slate-900 dark:text-white">Düşünceler &</span>{' '}
              <span className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-800 bg-clip-text text-transparent dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400">
                Notlar
              </span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="group hidden items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 sm:flex dark:text-slate-400 dark:hover:text-white"
          >
            Tüm yazılar
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {previewPosts.map((post, i) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden rounded-[18px] border border-slate-300/80 bg-card transition-all hover:border-slate-400/80 hover:shadow-sm active:scale-[0.99] sm:rounded-[22px] dark:border-white/[0.06] dark:hover:border-white/[0.12]"
            >
              {/* Gerçek bağlantı: hem klavye hem tarama motoru için. */}
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <span
                  className="block h-[2px] w-full"
                  style={{ background: `linear-gradient(90deg, ${post.tagColor}, ${post.tagColor}88)` }}
                  aria-hidden="true"
                />

                <span className="block p-5 sm:p-6">
                  <span
                    className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold sm:mb-5"
                    style={{
                      color: post.tagColor,
                      background: `${post.tagColor}14`,
                      border: `1px solid ${post.tagColor}30`,
                    }}
                  >
                    {post.tag}
                  </span>

                  <h3 className="text-[16px] font-bold leading-snug tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-slate-700 sm:text-[18px] dark:text-white dark:group-hover:text-slate-200">
                    {post.title}
                  </h3>

                  <span className="mt-2 line-clamp-2 block text-[13px] leading-[1.75] text-slate-600 sm:mt-3 sm:line-clamp-3 dark:text-slate-400">
                    {post.excerpt}
                  </span>

                  <span className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-3 text-[11px] text-slate-500 sm:mt-6 sm:gap-4 sm:pt-4 sm:text-[12px] dark:border-white/[0.05] dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {formatPostDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {readingTime(post)}
                    </span>
                  </span>
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/blog"
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:text-white"
          >
            Tüm yazıları gör
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
