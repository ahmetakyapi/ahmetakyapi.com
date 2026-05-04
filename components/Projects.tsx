'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/data'
import { getOrderedProjects } from '@/lib/site-content'

function useCardTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const ry = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const brightness = useMotionValue(1)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const nx = (e.clientY - r.top) / r.height - 0.5
    const ny = (e.clientX - r.left) / r.width - 0.5
    rx.set(-nx * intensity)
    ry.set(ny * intensity)
    brightness.set(1.05)
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }, [rx, ry, brightness, mouseX, mouseY, intensity])

  const onLeave = useCallback(() => {
    rx.set(0)
    ry.set(0)
    brightness.set(1)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [rx, ry, brightness, mouseX, mouseY])

  const shineX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const shineY = useTransform(mouseY, [0, 1], ['0%', '100%'])
  const shine = useMotionTemplate`radial-gradient(400px circle at ${shineX} ${shineY}, rgba(99,102,241,0.12), rgba(139,92,246,0.06), transparent 70%)`
  const borderShine = useMotionTemplate`radial-gradient(300px circle at ${shineX} ${shineY}, rgba(99,102,241,0.5), rgba(139,92,246,0.2), transparent 70%)`

  return { ref, rotateX: rx, rotateY: ry, brightness, shine, borderShine, onMove, onLeave }
}

export default function Projects({ projects }: { projects: Project[] }) {
  const orderedProjects = getOrderedProjects(projects)
  const [featured, ...rest] = orderedProjects

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-[1]">
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_60%)] dark:opacity-100 opacity-60" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.07),transparent_60%)] dark:opacity-100 opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12"
      >
        <p className="eyebrow-label mb-2 sm:mb-3 text-[11px] text-violet-600 dark:text-violet-400/80">
          Seçilmiş Çalışmalar
        </p>
        <h2 className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
          <span className="text-slate-900 dark:text-white">Projeler</span>
        </h2>
      </motion.div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {rest.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
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
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="group relative rounded-2xl overflow-hidden cursor-default"
      >
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: tilt.borderShine }}
        />
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 opacity-40 group-hover:opacity-60 transition-opacity" />

        <div className="relative bg-white dark:bg-[#0a0a12] rounded-2xl overflow-hidden border border-gray-200/30 dark:border-white/[0.04]">
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: tilt.shine }}
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr]">
            <div className="relative h-52 md:h-auto md:min-h-[300px] overflow-hidden flex items-center justify-center p-6 md:p-8 bg-[#f0eeff] dark:bg-[#0e0c1a] dark:[background:linear-gradient(145deg,#0e0c1a_0%,#13102b_100%)] [background:linear-gradient(145deg,#eef2ff_0%,#ede9fe_100%)]">
              <div
                className="absolute inset-0 opacity-40"
                style={{ background: `radial-gradient(ellipse at 50% 60%, ${project.accent}40 0%, transparent 70%)` }}
              />

              <div className="relative w-full max-w-[260px] rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.03] transition-transform duration-500">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-white/[0.06] border-b border-slate-200 dark:border-white/[0.08]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-2 flex-1 rounded-md bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.07] px-2.5 py-1">
                    <span className="text-[9px] text-slate-400 dark:text-white/40 font-mono tracking-wide">ahmetakyapi.com</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0a0814] px-4 pt-4 pb-5">
                  <div className="mb-3 pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                    <div className="w-12 h-1.5 rounded-full mb-1.5 opacity-70" style={{ background: project.accent }} />
                    <div className="w-24 h-3 rounded-md bg-slate-200 dark:bg-white/20 mb-1" />
                    <div className="w-16 h-3 rounded-md mb-3" style={{ background: `${project.accent}60` }} />
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded bg-slate-100 dark:bg-white/10" />
                      <div className="w-4/5 h-1.5 rounded bg-slate-100 dark:bg-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[0.9, 0.7, 0.8].map((op) => (
                      <div key={op} className="rounded-lg bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] p-2">
                        <div className="w-3 h-3 rounded-md mb-1.5 opacity-70" style={{ background: project.accent }} />
                        <div className="w-full h-1 rounded bg-slate-200 dark:bg-white/20 mb-1" />
                        <div className="w-3/4 h-1 rounded bg-slate-100 dark:bg-white/10" style={{ opacity: op }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-center relative z-20" style={{ transform: 'translateZ(10px)' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-[1.75] mb-6">
                {project.description}
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: project.accent }} />
                  <span className="text-xs text-gray-400 font-medium">{project.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/[0.14] dark:hover:text-white"
                    >
                      <Github className="w-3.5 h-3.5" />
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
                      <ExternalLink className="w-3.5 h-3.5" />
                      Canlıyı Aç
                    </a>
                  )}
                </div>
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
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="group relative rounded-2xl overflow-visible cursor-default h-full"
      >
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: tilt.borderShine }}
        />
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative bg-white dark:bg-[#0a0a12] rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200/60 dark:border-white/[0.05] group-hover:border-transparent transition-colors duration-300">
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: tilt.shine }}
          />

          <div className="h-1 w-full relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: project.gradient }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>

          <div className="flex flex-col flex-1 p-5 pt-5 relative z-20" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 border border-gray-200/80 dark:border-white/[0.06]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-start justify-between gap-2 mb-2.5">
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors text-base leading-snug">
                {project.title}
              </h3>
              <span
                className="text-[10px] font-medium flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full border"
                style={{ color: project.accent, borderColor: `${project.accent}40` }}
              >
                {project.badge}
              </span>
            </div>

            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-5">
              {project.description}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/[0.04] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: project.accent }} />
                <span className="text-[11px] text-gray-400">{project.category}</span>
              </div>

              <div className="flex items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 text-[12px] font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.05] dark:hover:text-white"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
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
                    title="Canlı Proje"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Canlı Proje
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
