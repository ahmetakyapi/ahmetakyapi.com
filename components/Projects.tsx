'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform, useReducedMotion } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/lib/data'
import { getOrderedProjects } from '@/lib/site-content'
import ProjectPreview from '@/components/ProjectPreview'

/** Karta 3B eğim ve imleci takip eden parlaklık. Hareket azaltmada kapalı. */
function useCardTilt(intensity = 8) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const ry = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || reduced) return
      const r = ref.current.getBoundingClientRect()
      const nx = (e.clientY - r.top) / r.height - 0.5
      const ny = (e.clientX - r.left) / r.width - 0.5
      rx.set(-nx * intensity)
      ry.set(ny * intensity)
      mouseX.set((e.clientX - r.left) / r.width)
      mouseY.set((e.clientY - r.top) / r.height)
    },
    [rx, ry, mouseX, mouseY, intensity, reduced],
  )

  const onLeave = useCallback(() => {
    rx.set(0)
    ry.set(0)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [rx, ry, mouseX, mouseY])

  const shineX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const shineY = useTransform(mouseY, [0, 1], ['0%', '100%'])
  const shine = useMotionTemplate`radial-gradient(400px circle at ${shineX} ${shineY}, rgba(99,102,241,0.12), rgba(139,92,246,0.06), transparent 70%)`
  const borderShine = useMotionTemplate`radial-gradient(300px circle at ${shineX} ${shineY}, rgba(99,102,241,0.5), rgba(139,92,246,0.2), transparent 70%)`

  return { ref, rotateX: rx, rotateY: ry, shine, borderShine, onMove, onLeave }
}

export default function Projects({ projects }: { projects: Project[] }) {
  const ordered = getOrderedProjects(projects)
  const [featured, ...rest] = ordered
  const liveCount = projects.filter((p) => p.badge === 'Canlı').length

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-[1]" aria-hidden="true">
        <div className="absolute right-[-5%] top-[20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_60%)] opacity-60 dark:opacity-100" />
        <div className="absolute bottom-[10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.07),transparent_60%)] opacity-50 dark:opacity-100" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12"
      >
        <p className="eyebrow-label mb-2 text-[11px] text-violet-700 sm:mb-3 dark:text-violet-400/90">
          Seçilmiş Çalışmalar
        </p>
        <h1 className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">
          <span className="text-slate-900 dark:text-white">Projeler</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-slate-600 sm:text-[16px] dark:text-slate-400">
          {projects.length} proje, {liveCount} tanesi canlı. Hepsinin kodu açık; çoğunun arkasında bir yazı var.
        </p>
      </motion.header>

      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="mb-5"
        >
          <FeaturedCard project={featured} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {rest.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: Math.min(i, 3) * 0.08, duration: 0.5 }}
            className="h-full"
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  const tilt = useCardTilt(6)

  return (
    <div style={{ perspective: 1200 }}>
      <motion.article
        ref={tilt.ref}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="group relative overflow-hidden rounded-2xl"
      >
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: tilt.borderShine }}
          aria-hidden="true"
        />
        <div
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 opacity-40 transition-opacity group-hover:opacity-60"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden rounded-2xl border border-slate-300/70 bg-card dark:border-white/[0.06]">
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: tilt.shine }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr]">
            <div
              className="relative flex items-center justify-center overflow-hidden p-6 md:p-8"
              style={{ background: `linear-gradient(145deg, ${project.accent}14, ${project.accent}06)` }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{ background: `radial-gradient(ellipse at 50% 60%, ${project.accent}33 0%, transparent 70%)` }}
                aria-hidden="true"
              />
              <div className="relative w-full max-w-[280px] transition-transform duration-500 group-hover:scale-[1.03]">
                <ProjectPreview project={project} size="lg" />
              </div>
            </div>

            <div className="relative z-20 flex flex-col justify-center p-5 sm:p-7 md:p-8" style={{ transform: 'translateZ(10px)' }}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{project.category}</span>
              </div>

              <h2 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {project.title}
              </h2>
              <p className="mb-4 text-sm leading-[1.75] text-slate-600 dark:text-slate-400">{project.description}</p>

              {project.detail && (
                <p className="mb-6 border-l-2 border-slate-300 pl-3 text-[13px] leading-[1.7] text-slate-500 dark:border-white/10 dark:text-slate-500">
                  {project.detail}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/[0.14] dark:hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    GitHub
                  </a>
                )}
                {project.badge === 'Canlı' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: project.gradient, boxShadow: `0 16px 28px -18px ${project.accent}` }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Canlıyı Aç
                  </a>
                )}
                {project.postSlug && (
                  <Link
                    href={`/blog/${project.postSlug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-white/[0.14]"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Yazısı
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const tilt = useCardTilt(10)

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.article
        ref={tilt.ref}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="group relative h-full overflow-visible rounded-2xl"
      >
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: tilt.borderShine }}
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-300/70 bg-card transition-colors duration-300 group-hover:border-transparent dark:border-white/[0.06]">
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: tilt.shine }}
            aria-hidden="true"
          />

          <div className="relative h-1 w-full overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0" style={{ background: project.gradient }} />
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
          </div>

          <div className="relative z-20 flex flex-1 flex-col p-5" style={{ transform: 'translateZ(8px)' }}>
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {project.title}
              </h2>
              <span
                className="mt-0.5 flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                style={{ color: project.accent, borderColor: `${project.accent}55` }}
              >
                {project.badge}
              </span>
            </div>

            <ProjectPreview project={project} size="sm" className="mb-4" />

            <p className="mb-4 flex-1 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
              {project.description}
            </p>

            <ul className="mb-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.05] dark:text-slate-400"
                >
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 border-t border-slate-200 pt-4 dark:border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{project.category}</span>
                {project.postSlug && (
                  <Link
                    href={`/blog/${project.postSlug}`}
                    className="ml-auto text-[11px] font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 dark:text-indigo-400 dark:decoration-indigo-400/40"
                  >
                    Yazısı
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.05] dark:hover:text-white"
                    aria-label={`${project.title} kaynak kodu`}
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    GitHub
                  </a>
                )}
                {project.badge === 'Canlı' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: project.gradient, boxShadow: `0 18px 30px -22px ${project.accent}` }}
                    aria-label={`${project.title} canlı sürümü`}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    Canlı
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
