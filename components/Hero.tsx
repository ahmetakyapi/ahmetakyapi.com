'use client'

import { useCallback, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Github, ExternalLink, Calendar, Clock } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { techStack } from '@/lib/data'
import type { BlogPost, Project } from '@/lib/data'
import { getOrderedProjects } from '@/lib/site-content'
import type { HomeContent } from '@/lib/site-content'

const InteractiveGlobe = dynamic(() => import('@/components/InteractiveGlobe'), { ssr: false })

const featuredStack = techStack.filter((tech) =>
  ['Angular', 'React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'Framer Motion'].includes(tech.name),
)

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ─── Magnetic hook ───────────────────────────────────────────────────────── */
function useMagnetic(strength = 0.26) {
  const mx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 })
  const my = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 })

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      mx.set((event.clientX - rect.left - rect.width / 2) * strength)
      my.set((event.clientY - rect.top - rect.height / 2) * strength)
    },
    [mx, my, strength],
  )

  const onLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  return { mx, my, onMove, onLeave }
}

/* ═════════════════════════════════════════════════════════════════════════════
   Hero Component
   ═════════════════════════════════════════════════════════════════════════════ */
export default function Hero({
  onNavigate,
  home,
  projects,
  blogPosts,
}: {
  onNavigate: (target: string) => void
  home: HomeContent
  projects: Project[]
  blogPosts: BlogPost[]
}) {
  const magnetic = useMagnetic()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isLight = mounted && resolvedTheme !== 'dark'
  const orderedProjects = getOrderedProjects(projects)
  const featuredProject = orderedProjects[0]
  const sideProjects = orderedProjects.slice(1, 3)
  const previewPosts = blogPosts.slice(0, 3)

  return (
    <section className="relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-[1]">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_60%)] dark:opacity-100 opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1),transparent_60%)] dark:opacity-100 opacity-50" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         HERO SECTION
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20 xl:py-24 min-h-[calc(100svh-64px)] sm:min-h-[calc(100vh-64px)]">
        <div className="grid items-center gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)] xl:gap-14 2xl:gap-12">
          {/* Left: Text content */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[34rem] pt-2 sm:pt-8 xl:pt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border dark:border-emerald-400/20 border-emerald-500/30 dark:bg-emerald-400/[0.06] bg-emerald-50 px-4 py-2 mb-5 sm:mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] dark:text-emerald-300/80 text-emerald-700">
                {home.roleLabel}
              </span>
            </motion.div>

            <h1 className="display-heading max-w-[620px] overflow-visible pb-4 sm:pb-6 text-[52px] leading-[1.02] dark:text-white text-slate-900 sm:text-[76px] lg:text-[88px] xl:text-[96px] 2xl:text-[110px]">
              <span className="block">{home.firstName}</span>
              <span className="hero-name-gradient block pb-[0.08em]">{home.lastName}</span>
            </h1>

            <div className="mt-4 sm:mt-5 max-w-[30rem] space-y-3 sm:space-y-4 text-[15px] sm:text-[16px] lg:text-[17px] xl:text-[16px] 2xl:text-[18px] leading-[1.75] sm:leading-[1.8] dark:text-slate-400 text-slate-500">
              <p className="[text-wrap:balance]">{home.introPrimary}</p>
              <p className="[text-wrap:balance]">{home.introSecondary}</p>
            </div>

            <div className="mt-6 sm:mt-8 xl:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.button
                style={{ x: magnetic.mx, y: magnetic.my }}
                onMouseMove={magnetic.onMove}
                onMouseLeave={magnetic.onLeave}
                onClick={() => onNavigate('projects')}
                className="btn-primary group relative overflow-hidden"
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 -translate-x-[100%] skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-[100%]" />
                <span className="relative z-10 flex items-center gap-2">
                  Projeleri İncele
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>

              <a
                href="https://github.com/ahmetakyapi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>

            <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[11px] font-mono dark:text-slate-500 text-slate-400 uppercase tracking-[0.14em]">
                Uzmanlık:
              </span>
              <div className="flex flex-wrap gap-2">
                {home.expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full dark:border-white/10 border border-slate-200 dark:bg-white/[0.04] bg-white/80 px-3 py-1.5 text-[12px] font-medium dark:text-slate-400 text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Globe */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="xl:justify-self-end w-full max-w-[310px] sm:max-w-[320px] mx-auto md:max-w-[400px] lg:max-w-[460px] xl:max-w-none relative"
          >
            {/* Glow behind globe */}
            <div className="absolute inset-0 -z-10 blur-3xl opacity-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-violet-500/30 via-cyan-500/20 to-transparent" />
            </div>
            <InteractiveGlobe />
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         FEATURE CARDS + TECH STACK
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pb-6 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="hero-surface mb-6 sm:mb-10 rounded-[28px] sm:rounded-[34px] px-4 py-5 sm:px-6 sm:py-7"
        >
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {home.valueProps.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + index * 0.08, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[22px] sm:rounded-[26px] border dark:border-white/[0.07] border-slate-200/80 dark:bg-white/[0.025] bg-white/70 p-5 sm:p-6 transition-all duration-300 dark:hover:border-white/[0.14] hover:border-slate-300 hover:bg-white/90 hover:shadow-sm"
              >
                {/* Top accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}90, transparent)` }}
                />
                {/* Background glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at 20% 0%, ${item.glow}, transparent 65%)` }}
                />
                {/* Index number */}
                <span className="absolute right-5 top-5 font-mono text-[11px] dark:text-white/15 text-slate-300">
                  0{index + 1}
                </span>

                <div
                  className="relative inline-flex rounded-[18px] p-3"
                  style={{ background: `${item.color}14`, border: `1px solid ${item.color}30` }}
                >
                  {/* Icon glow */}
                  <div
                    className="absolute inset-0 rounded-[18px] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-50"
                    style={{ background: item.color }}
                  />
                  <span className="relative z-10 text-lg" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                </div>

                <h3 className="relative mt-4 sm:mt-5 text-[1.3rem] sm:text-[1.45rem] font-semibold tracking-[-0.04em] dark:text-white text-slate-900 lg:text-[1.55rem]">
                  {item.title}
                </h3>
                <p className="relative mt-2 sm:mt-3 max-w-xs text-[14px] sm:text-[15px] leading-[1.75] sm:leading-[1.85] dark:text-slate-400 text-slate-600">
                  {item.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}50, transparent)` }}
                />
              </motion.article>
            ))}
          </div>

          <div className="my-5 sm:my-7 h-px bg-gradient-to-r from-transparent dark:via-white/8 via-slate-200 to-transparent" />

          <div className="mb-3 sm:mb-4 flex items-center justify-between gap-3">
            <p className="eyebrow-label text-[10px] dark:text-slate-400 text-slate-500">Kullandığım Teknolojiler</p>
            <p className="hidden sm:block text-xs dark:text-slate-400 text-slate-500">Güncel teknolojilerle, güçlü ve ölçeklenebilir ürün deneyimleri</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {featuredStack.map((tech) => {
              const chipColor = isLight && tech.name === 'Next.js' ? '#171717' : tech.color
              const chipBg = isLight && tech.name === 'Next.js' ? 'rgba(23,23,23,0.06)' : tech.bg
              const chipBorder = isLight && tech.name === 'Next.js' ? 'rgba(23,23,23,0.18)' : tech.border
              return (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex cursor-default items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
                >
                  <div className="h-2 w-2 rounded-full" style={{ background: chipColor }} />
                  <span className="text-[12px] font-medium" style={{ color: chipColor }}>
                    {tech.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         FEATURED PROJECTS SECTION
         ══════════════════════════════════════════════════════════════════════ */}
      {featuredProject && (
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-label mb-2 sm:mb-3 text-[11px] dark:text-violet-400/80 text-violet-600">
              Seçili Çalışmalar
            </p>
            <h2 className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
              <span className="dark:text-white text-slate-900">Öne Çıkan </span>
              <span className="bg-gradient-to-r dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Projeler
              </span>
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            onClick={() => onNavigate('projects')}
            className="hidden sm:flex items-center gap-2 text-sm dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-colors group"
          >
            Tümünü gör
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>

        {/* Bento grid */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* ── Featured project (large card) ── */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="group relative overflow-hidden rounded-[28px] border dark:border-white/[0.06] border-slate-200 dark:bg-[#0c0b18] bg-white shadow-sm"
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: featuredProject.gradient }}
            />
            <div className="absolute inset-0 bg-gradient-to-t dark:from-[#0c0b18] dark:via-[#0c0b18]/60 from-white via-white/70 to-transparent" />

            <div className="relative z-10 flex flex-col h-full p-5 sm:p-7 lg:p-8">
              {/* Top row: category + live badge */}
              <div className="flex items-center justify-between mb-auto">
                <span className="rounded-full border dark:border-white/15 border-slate-300/80 dark:bg-white/[0.08] bg-slate-100 px-3 py-1 text-[11px] font-semibold dark:text-white/80 text-slate-600 backdrop-blur-sm">
                  {featuredProject.category}
                </span>
                {featuredProject.badge === 'Canlı' && (
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border dark:border-violet-400/30 border-violet-400/40 dark:bg-violet-500/15 bg-violet-100 px-3 py-1 text-[11px] font-semibold dark:text-violet-300 text-violet-700 backdrop-blur-sm dark:hover:bg-violet-500/25 hover:bg-violet-200 transition-colors"
                  >
                    Canlı
                  </a>
                )}
              </div>

              {/* Browser mockup visual */}
              <div className="relative mt-5 overflow-hidden rounded-[14px] flex items-center justify-center p-6"
                style={{ background: 'linear-gradient(145deg,#0e0c1a 0%,#13102b 100%)' }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: `radial-gradient(ellipse at 50% 60%, ${featuredProject.accent}40 0%, transparent 70%)` }}
                />
                {/* Browser window */}
                <div className="relative w-full max-w-[340px] overflow-hidden rounded-xl border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Chrome */}
                  <div className="flex items-center gap-1.5 border-b border-white/[0.08] bg-white/[0.06] px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <div className="ml-2 flex-1 rounded-md border border-white/[0.07] bg-white/[0.06] px-2.5 py-1">
                      <span className="font-mono text-[9px] tracking-wide text-white/40">ahmetakyapi.com</span>
                    </div>
                  </div>
                  {/* Page content */}
                  <div className="bg-[#0a0814] px-4 pt-4 pb-5">
                    <div className="mb-3 border-b border-white/[0.05] pb-3">
                      <div className="mb-1.5 h-1.5 w-12 rounded-full opacity-70" style={{ background: featuredProject.accent }} />
                      <div className="mb-1 h-3 w-24 rounded-md bg-white/20" />
                      <div className="mb-3 h-3 w-16 rounded-md" style={{ background: `${featuredProject.accent}60` }} />
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded bg-white/10" />
                        <div className="h-1.5 w-4/5 rounded bg-white/10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([0.9, 0.7, 0.8] as const).map((op) => (
                        <div key={op} className="rounded-lg border border-white/[0.06] bg-white/[0.05] p-2">
                          <div className="mb-1.5 h-3 w-3 rounded-md opacity-70" style={{ background: featuredProject.accent }} />
                          <div className="mb-1 h-1 w-full rounded bg-white/20" />
                          <div className="h-1 w-3/4 rounded bg-white/10" style={{ opacity: op }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-6">
                <h3 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.03em] dark:text-white text-slate-900 leading-tight">
                  {featuredProject.title}
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-[1.8] dark:text-slate-400 text-slate-600">
                  {featuredProject.description}
                </p>

                {/* Tech tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredProject.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border dark:border-white/10 border-slate-200 dark:bg-white/[0.05] bg-slate-50 px-3 py-1 text-[11px] font-medium dark:text-slate-300 text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom link */}
              <div className="mt-8 pt-6 border-t dark:border-white/[0.06] border-slate-200">
                <a
                  href={featuredProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[15px] font-semibold dark:text-white text-slate-900 group/link"
                >
                  Projeyi İncele
                  <span className="flex items-center justify-center w-7 h-7 rounded-full dark:bg-violet-500/20 bg-violet-100 border dark:border-violet-400/30 border-violet-200 transition-all dark:group-hover/link:bg-violet-500/30 group-hover/link:bg-violet-200 group-hover/link:scale-110">
                    <ArrowUpRight className="h-3.5 w-3.5 dark:text-violet-300 text-violet-600" />
                  </span>
                </a>
              </div>
            </div>
          </motion.article>

          {/* ── Side projects (2 stacked cards) ── */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {sideProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.55 }}
                className="group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border dark:border-white/[0.06] border-slate-200 dark:bg-[#0c0e17] bg-white flex-1 shadow-sm"
              >
                {/* Subtle accent border top */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] opacity-60"
                  style={{ background: project.gradient }}
                />

                <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col h-full">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full border dark:border-emerald-400/20 border-emerald-500/25 dark:bg-emerald-400/[0.08] bg-emerald-50 px-3 py-1 text-[11px] font-semibold dark:text-emerald-300/80 text-emerald-700">
                      {project.category}
                    </span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-xl border dark:border-white/10 border-slate-200 dark:bg-white/[0.04] bg-slate-50 dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:border-white/20 hover:border-slate-300 transition-all"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Content */}
                  <h3 className="text-[20px] font-bold tracking-[-0.02em] dark:text-white text-slate-900">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.75] dark:text-slate-400 text-slate-600">
                    {project.description}
                  </p>

                  {/* Project visual */}
                  {i === 0 ? (
                    /* DigyNotes — note list mockup */
                    <div className="my-4 overflow-hidden rounded-xl border dark:border-white/[0.06] border-slate-200 dark:bg-[#07060f] bg-slate-50 px-3 py-2.5 space-y-2">
                      {(['Framer Motion notları', 'TypeScript utility types', 'CSS Grid rehberi'] as const).map((label) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-sm border dark:border-white/10 border-slate-300" />
                          <div className="h-1.5 flex-1 rounded-full dark:bg-white/[0.06] bg-slate-200" />
                          <div className="h-1.5 w-4 rounded-full dark:bg-violet-400/20 bg-violet-200" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Keşke Alsaydım — bar chart mockup */
                    <div className="my-4 overflow-hidden rounded-xl border dark:border-white/[0.06] border-slate-200 dark:bg-[#07060f] bg-slate-50 px-3 pt-2.5 pb-2">
                      <div className="flex items-end gap-0.5 h-10">
                        {(['28y', '40y', '33y', '52y', '38y', '65y', '55y', '78y', '62y', '90y'] as const).map((val, bi) => (
                          <div
                            key={val}
                            className="flex-1 rounded-sm"
                            style={{ height: `${Number.parseInt(val)}%`, background: `rgba(16,185,129,${0.18 + (bi / 10) * 0.35})` }}
                          />
                        ))}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="font-mono text-[9px] dark:text-slate-600 text-slate-400">2020</span>
                        <span className="font-mono text-[9px] font-semibold dark:text-emerald-400 text-emerald-600">+2.840%</span>
                        <span className="font-mono text-[9px] dark:text-slate-600 text-slate-400">Bugün</span>
                      </div>
                    </div>
                  )}

                  {/* Tech tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium dark:text-slate-400 text-slate-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Mobile: "Tümünü gör" button for projects */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-5 sm:hidden flex justify-center"
        >
          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2 text-sm font-medium dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-colors py-2 px-4 rounded-full border dark:border-white/10 border-slate-200 dark:bg-white/[0.03] bg-white/80"
          >
            Tüm projeleri gör
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         BLOG PREVIEW SECTION
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pt-6 sm:pt-10 pb-14 sm:pb-24">
        {/* Divider */}
        <div className="mb-10 sm:mb-20 h-px bg-gradient-to-r from-transparent dark:via-white/[0.06] via-slate-200/80 to-transparent" />

        {/* Section header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-label mb-2 sm:mb-3 text-[11px] dark:text-cyan-400/80 text-cyan-600">
              Yazılar
            </p>
            <h2 className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
              <span className="dark:text-white text-slate-900">Düşünceler &</span>{' '}
              <span className="bg-gradient-to-r dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400 from-cyan-600 via-sky-600 to-blue-700 bg-clip-text text-transparent">
                Notlar
              </span>
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            onClick={() => onNavigate('blog')}
            className="hidden sm:flex items-center gap-2 text-sm dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-colors group"
          >
            Tüm yazılar
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>

        {/* Blog cards grid */}
        <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewPosts.map((post, i) => {
            const color = post.tagColor

            return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                onClick={() => onNavigate('blog')}
                className="group relative overflow-hidden rounded-[18px] sm:rounded-[22px] border dark:border-white/[0.06] border-slate-200 dark:bg-[#0c0e17] bg-white cursor-pointer dark:hover:border-white/[0.12] hover:border-slate-300 hover:shadow-sm transition-all active:scale-[0.99]"
              >
                {/* Colored top border */}
                <div
                  className="h-[2px] w-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                />

                <div className="p-5 sm:p-6">
                  {/* Tag */}
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold mb-4 sm:mb-5"
                    style={{
                      color,
                      background: `${color}14`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {post.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-[16px] sm:text-[18px] font-bold tracking-[-0.02em] dark:text-white text-slate-900 leading-snug dark:group-hover:text-slate-200 group-hover:text-slate-700 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2 sm:mt-3 text-[13px] leading-[1.75] dark:text-slate-400 text-slate-600 line-clamp-2 sm:line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t dark:border-white/[0.04] border-slate-100 flex items-center gap-3 sm:gap-4 text-[11px] sm:text-[12px] dark:text-slate-500 text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Mobile: "Tüm yazılar" button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 sm:hidden flex justify-center"
        >
          <button
            onClick={() => onNavigate('blog')}
            className="flex items-center gap-2 text-sm font-medium dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-colors py-2 px-4 rounded-full border dark:border-white/10 border-slate-200 dark:bg-white/[0.03] bg-white/80"
          >
            Tüm yazıları gör
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
