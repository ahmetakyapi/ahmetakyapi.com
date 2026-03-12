'use client'

import { useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Github, ExternalLink, Calendar, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { projects, blogPosts, techStack } from '@/lib/data'

const InteractiveGlobe = dynamic(() => import('@/components/InteractiveGlobe'), { ssr: false })

/* ─── Static data ─────────────────────────────────────────────────────────── */
const valueProps = [
  {
    icon: '⚡',
    title: 'Hız ve Akış',
    description:
      'Arayüz deneyiminin akıcı, tutarlı ve gecikmesiz hissedilmesi; yalnızca görünen katmanın değil, veri akışının ve sistem kurgusunun da doğru tasarlanmasına bağlıdır. API yapısından UI render sürecine kadar her katmanda performans, sadelik ve kullanıcı ritmi ön planda tutulur.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
  },
  {
    icon: '◈',
    title: 'Sistem Düşüncesi',
    description:
      'Ölçeklenebilir arayüzler; bileşen sınırlarının, veri yapılarının ve tip güvenliğinin en baştan net kurulmasıyla güç kazanır. Framework bağımsız bir bakışla, kod tabanının büyüdükçe karmaşıklaşmayan; aksine daha okunabilir, sürdürülebilir ve yönetilebilir bir yapıda kalması hedeflenir.',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.18)',
  },
  {
    icon: '✦',
    title: 'Detay ve Hareket',
    description:
      'Mikro etkileşimler, geçişler, yüklenme durumları ve boş ekranlar; ürün kalitesini görünür kılan ince katmandır. Hareket dili ve görsel ritim, yalnızca estetik bir tercih değil; algıyı güçlendiren ve deneyimi rafine eden bir tasarım unsuru olarak ele alınır.',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.18)',
  },
]

const featuredStack = techStack.filter((tech) =>
  ['Angular', 'React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'Framer Motion'].includes(tech.name),
)

const featuredProject = projects[0]
const sideProjects = projects.slice(1, 3)
const previewPosts = blogPosts.slice(0, 3)


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
export default function Hero({ onNavigate }: { onNavigate: (target: string) => void }) {
  const magnetic = useMagnetic()

  return (
    <section className="relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-[1]">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         HERO SECTION
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 py-24 min-h-[calc(100vh-64px)]">
        <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)] xl:gap-12">
          {/* Left: Text content */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[34rem] pt-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                Fullstack Developer
              </span>
            </motion.div>

            <h1 className="display-heading max-w-[620px] overflow-visible pb-6 text-[64px] leading-[1.02] text-white sm:text-[82px] lg:text-[104px]">
              <span className="block">Ahmet</span>
              <span className="hero-name-gradient block pb-[0.08em]">Akyapı</span>
            </h1>

            <div className="mt-6 max-w-[31rem] space-y-4 text-[17px] leading-[1.85] text-slate-400">
              <p>
                React, Next.js ve TypeScript ile{' '}
                <span className="font-semibold text-white">sade, hızlı ve detay kalitesi yüksek</span>{' '}
                arayüzler geliştiriyorum.
              </p>
              <p>
                Benim için iyi bir ürün deneyimi; yalnızca çalışması değil, akıcı hissettirmesi ve
                görsel olarak dengeli olmasıdır.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
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

            <div className="mt-8 flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.14em]">
                Uzmanlık:
              </span>
              <div className="flex flex-wrap gap-2">
                {['UI Systems', 'Design', 'Performance', 'Web'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-slate-400"
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
            className="xl:justify-self-end w-full max-w-[320px] mx-auto md:max-w-none relative"
          >
            {/* Subtle glow behind globe */}
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
      <div className="mx-auto max-w-6xl px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="hero-surface mb-10 rounded-[34px] px-5 py-6 sm:px-6 sm:py-7"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {valueProps.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + index * 0.08, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-6 transition-colors duration-300 hover:border-white/[0.14]"
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
                <span className="absolute right-5 top-5 font-mono text-[11px] text-white/15">
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

                <h3 className="relative mt-5 text-[1.45rem] font-semibold tracking-[-0.04em] text-white sm:text-[1.55rem]">
                  {item.title}
                </h3>
                <p className="relative mt-3 max-w-xs text-[15px] leading-[1.85] text-slate-400">
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

          <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="eyebrow-label text-[10px] text-slate-400">Kullandığım Teknolojiler</p>
            <p className="text-xs text-slate-400">Güncel teknolojilerle, güçlü ve ölçeklenebilir ürün deneyimleri</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {featuredStack.map((tech) => (
              <motion.div
                key={tech.name}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex cursor-default items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{ background: tech.bg, border: `1px solid ${tech.border}` }}
              >
                <div className="h-2 w-2 rounded-full" style={{ background: tech.color }} />
                <span className="text-[12px] font-medium" style={{ color: tech.color }}>
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         FEATURED PROJECTS SECTION
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-label mb-3 text-[11px] text-violet-400/80">
              Seçili Çalışmalar
            </p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
              <span className="text-white">Öne Çıkan </span>
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
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
            className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            Tümünü gör
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>

        {/* Bento grid */}
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* ── Featured project (large card) ── */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0c0b18]"
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: featuredProject.gradient }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b18] via-[#0c0b18]/60 to-transparent" />

            <div className="relative z-10 flex flex-col h-full p-7 sm:p-8">
              {/* Top row: category + live badge */}
              <div className="flex items-center justify-between mb-auto">
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                  {featuredProject.category}
                </span>
                {featuredProject.badge === 'Canlı' && (
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[11px] font-semibold text-violet-300 backdrop-blur-sm hover:bg-violet-500/25 transition-colors"
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
                <h3 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-white leading-tight">
                  {featuredProject.title}
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-slate-400">
                  {featuredProject.description}
                </p>

                {/* Tech tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredProject.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom link */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <a
                  href={featuredProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-white group/link"
                >
                  Projeyi İncele
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 border border-violet-400/30 transition-all group-hover/link:bg-violet-500/30 group-hover/link:scale-110">
                    <ArrowUpRight className="h-3.5 w-3.5 text-violet-300" />
                  </span>
                </a>
              </div>
            </div>
          </motion.article>

          {/* ── Side projects (2 stacked cards) ── */}
          <div className="flex flex-col gap-5">
            {sideProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.55 }}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0c0e17] flex-1"
              >
                {/* Subtle accent border top */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] opacity-50"
                  style={{ background: project.gradient }}
                />

                <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1 text-[11px] font-semibold text-emerald-300/80">
                      {project.category}
                    </span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:border-white/20 transition-all"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Content */}
                  <h3 className="text-[20px] font-bold tracking-[-0.02em] text-white">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.75] text-slate-400">
                    {project.description}
                  </p>

                  {/* Project visual */}
                  {i === 0 ? (
                    /* DigyNotes — note list mockup */
                    <div className="my-4 overflow-hidden rounded-xl border border-white/[0.06] bg-[#07060f] px-3 py-2.5 space-y-2">
                      {(['Framer Motion notları', 'TypeScript utility types', 'CSS Grid rehberi'] as const).map((label) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-sm border border-white/10" />
                          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06]" />
                          <div className="h-1.5 w-4 rounded-full bg-violet-400/20" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Keşke Alsaydım — bar chart mockup */
                    <div className="my-4 overflow-hidden rounded-xl border border-white/[0.06] bg-[#07060f] px-3 pt-2.5 pb-2">
                      <div className="flex items-end gap-0.5 h-10">
                        {(['28y', '40y', '33y', '52y', '38y', '65y', '55y', '78y', '62y', '90y'] as const).map((val, bi) => (
                          <div
                            key={val}
                            className="flex-1 rounded-sm"
                            style={{ height: `${Number.parseInt(val)}%`, background: `rgba(16,185,129,${0.12 + (bi / 10) * 0.3})` }}
                          />
                        ))}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="font-mono text-[9px] text-slate-600">2020</span>
                        <span className="font-mono text-[9px] font-semibold text-emerald-400">+2.840%</span>
                        <span className="font-mono text-[9px] text-slate-600">Bugün</span>
                      </div>
                    </div>
                  )}

                  {/* Tech tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium text-slate-400"
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
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         BLOG PREVIEW SECTION
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-24">
        {/* Divider */}
        <div className="mb-20 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-label mb-3 text-[11px] text-cyan-400/80">
              Yazılar
            </p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
              <span className="text-white">Düşünceler &</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
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
            className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            Tüm yazılar
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>

        {/* Blog cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group relative overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#0c0e17] cursor-pointer hover:border-white/[0.12] transition-colors"
              >
                {/* Colored top border */}
                <div
                  className="h-[2px] w-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                />

                <div className="p-6">
                  {/* Tag */}
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold mb-5"
                    style={{
                      color,
                      background: `${color}14`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {post.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-[18px] font-bold tracking-[-0.02em] text-white leading-snug group-hover:text-slate-200 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-3 text-[13px] leading-[1.75] text-slate-400 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-4 text-[12px] text-slate-500">
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
      </div>
    </section>
  )
}
