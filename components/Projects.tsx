'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/data'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── 3D Tilt hook for cards ─────────────────────────────────────────────── */
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
    rx.set(0); ry.set(0); brightness.set(1)
    mouseX.set(0.5); mouseY.set(0.5)
  }, [rx, ry, brightness, mouseX, mouseY])

  // Holographic shine position
  const shineX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const shineY = useTransform(mouseY, [0, 1], ['0%', '100%'])
  const shine = useMotionTemplate`radial-gradient(400px circle at ${shineX} ${shineY}, rgba(99,102,241,0.12), rgba(139,92,246,0.06), transparent 70%)`
  const borderShine = useMotionTemplate`radial-gradient(300px circle at ${shineX} ${shineY}, rgba(99,102,241,0.5), rgba(139,92,246,0.2), transparent 70%)`

  return { ref, rotateX: rx, rotateY: ry, brightness, shine, borderShine, onMove, onLeave }
}

export default function Projects() {
  const [featured, ...rest] = projects

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <p className="font-mono text-indigo-400 text-xs tracking-widest uppercase mb-3">
          Seçilmiş Çalışmalar
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Projeler<span className="text-gradient">.</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
          Üzerinde zaman harcadığım, canlıda çalışan ürünler.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        {/* Featured project */}
        <motion.div variants={cardAnim}>
          <FeaturedCard project={featured} />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((project) => (
            <motion.div key={project.id} variants={cardAnim}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Featured Card — holographic 3D tilt, horizontal layout
   ═══════════════════════════════════════════════════════════════════════════ */
function FeaturedCard({ project }: { project: (typeof projects)[number] }) {
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
        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: tilt.borderShine }}
        />
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 opacity-40 group-hover:opacity-60 transition-opacity" />

        {/* Card body */}
        <div className="relative bg-white dark:bg-[#0a0a12] rounded-2xl overflow-hidden border border-gray-200/30 dark:border-white/[0.04]">
          {/* Holographic overlay */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: tilt.shine }}
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
            {/* Left — gradient preview */}
            <div className="relative h-52 md:h-auto min-h-[220px] overflow-hidden">
              <div className="absolute inset-0" style={{ background: project.gradient }} />
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 dark:to-black/20" />

              {/* Floating particles on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/60"
                    animate={{
                      y: [0, -80 - Math.random() * 60],
                      x: [0, (Math.random() - 0.5) * 40],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 1.5,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: 'easeOut',
                    }}
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      bottom: '10%',
                    }}
                  />
                ))}
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full bg-black/25 text-xs backdrop-blur-md border border-white/10 font-medium"
                  style={{ color: project.accent }}>
                  {project.badge}
                </span>
              </div>

              {/* Tech badges */}
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-black/25 text-white backdrop-blur-md border border-white/15"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — content */}
            <div className="p-7 md:p-8 flex flex-col justify-center relative z-20" style={{ transform: 'translateZ(10px)' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-[1.75] mb-6">
                {project.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: project.accent }}
                  />
                  <span className="text-xs text-gray-400 font-medium">{project.category}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Kod
                    </a>
                  )}
                  {project.badge === 'Canlı' && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Canlı
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

/* ═══════════════════════════════════════════════════════════════════════════
   Regular Card — 3D tilt with holographic hover
   ═══════════════════════════════════════════════════════════════════════════ */
function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const tilt = useCardTilt(10)

  return (
    <div style={{ perspective: 1000 }}>
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
        {/* Hover glow behind card */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: tilt.borderShine }}
        />
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Card body */}
        <div className="relative bg-white dark:bg-[#0a0a12] rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200/60 dark:border-white/[0.05] group-hover:border-transparent transition-colors duration-300">

          {/* Holographic overlay */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: tilt.shine }}
          />

          {/* Gradient accent line */}
          <div className="h-1 w-full relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: project.gradient }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-5 pt-5 relative z-20" style={{ transform: 'translateZ(8px)' }}>
            {/* Tech tags */}
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

            {/* Title + badge */}
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

            {/* Description */}
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-5">
              {project.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: project.accent }}
                />
                <span className="text-[11px] text-gray-400">{project.category}</span>
              </div>

              <div className="flex items-center gap-0.5">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.badge === 'Canlı' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    title="Canlı"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
