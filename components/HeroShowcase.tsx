'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

type ShowcaseState = {
  id: 'motion' | 'systems' | 'product'
  eyebrow: string
  title: string
  description: string
  tags: string[]
  accent: string
}

const showcaseStates: ShowcaseState[] = [
  {
    id: 'motion',
    eyebrow: 'Seçili çalışma',
    title: 'Motion & Interface Quality',
    description:
      'Mikro etkileşimler, denge ve görsel ritim üzerinden daha rafine ürün deneyimleri tasarlıyorum.',
    tags: ['Motion', 'Interface', 'Interaction', 'Design System'],
    accent: '#7dd3fc',
  },
  {
    id: 'systems',
    eyebrow: 'Seçili çalışma',
    title: 'Structured UI Systems',
    description:
      'Tutarlı spacing, component kararları ve net tipografi ile büyümeye hazır arayüz sistemleri kuruyorum.',
    tags: ['Systems', 'Components', 'Layout', 'Typography'],
    accent: '#93c5fd',
  },
  {
    id: 'product',
    eyebrow: 'Seçili çalışma',
    title: 'Product-Focused Frontend',
    description:
      'Akış, hız ve içerik önceliğini dengede tutan ürün ekranlarıyla daha net kullanım deneyimleri üretiyorum.',
    tags: ['Product', 'Flow', 'Performance', 'Frontend'],
    accent: '#a5b4fc',
  },
]

function usePreviewTilt() {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 })
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  const onMove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    rotateX.set((0.5 - py) * 12)
    rotateY.set((px - 0.5) * 14)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }, [glowX, glowY, rotateX, rotateY])

  const onLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    glowX.set(50)
    glowY.set(50)
  }, [glowX, glowY, rotateX, rotateY])

  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.12), transparent 72%)`

  return { rotateX, rotateY, glow, onMove, onLeave }
}

function SearchPreview() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-[14%] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_22px_60px_rgba(8,15,32,0.34)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-300/60" />
          <span className="h-2 w-2 rounded-full bg-violet-300/40" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-sky-400/12" />
            <div className="h-3 w-28 rounded-full bg-white/14" />
            <div className="ml-auto h-8 w-12 rounded-full bg-white/10" />
          </div>
          <div className="mt-5 h-3 w-full rounded-full bg-white/8" />
          <div className="mt-3 h-3 w-2/3 rounded-full bg-white/8" />
        </div>

        <div className="mt-6 grid grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="h-20 rounded-2xl border border-white/8 bg-white/[0.04]" />
          <div className="h-20 rounded-2xl border border-white/8 bg-white/[0.03]" />
        </div>
      </div>
    </div>
  )
}

function SystemPreview() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[16%] top-[18%] right-[16%] grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
            <div className="h-3 w-14 rounded-full bg-white/18" />
            <div className="mt-4 h-10 rounded-2xl bg-white/8" />
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <div className="h-3 w-10 rounded-full bg-white/16" />
            <div className="mt-4 h-10 rounded-2xl bg-white/8" />
          </div>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-400/12" />
            <div className="h-3 w-20 rounded-full bg-white/18" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="h-20 rounded-2xl bg-white/[0.05]" />
            <div className="h-20 rounded-2xl bg-white/[0.05]" />
            <div className="h-20 rounded-2xl bg-white/[0.05]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductPreview() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-[16%] top-[18%] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
        <div className="h-3 w-20 rounded-full bg-white/16" />
        <div className="mt-4 h-12 rounded-2xl bg-white/[0.06]" />
        <div className="mt-3 h-3 w-3/4 rounded-full bg-white/10" />
      </div>

      <div className="absolute inset-x-[18%] bottom-[18%] grid grid-cols-[0.85fr_1.15fr] gap-3">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
          <div className="h-10 rounded-2xl bg-white/[0.06]" />
          <div className="mt-3 h-10 rounded-2xl bg-white/[0.04]" />
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 rounded-2xl bg-white/[0.06]" />
            <div className="h-14 rounded-2xl bg-white/[0.04]" />
          </div>
          <div className="mt-3 h-3 w-2/3 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}

function PreviewVisual({ id }: { id: ShowcaseState['id'] }) {
  if (id === 'systems') {
    return <SystemPreview />
  }

  if (id === 'product') {
    return <ProductPreview />
  }

  return <SearchPreview />
}

export default function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = showcaseStates[activeIndex]
  const tilt = usePreviewTilt()

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % showcaseStates.length)
  }, [])

  return (
    <aside className="hero-panel relative overflow-hidden rounded-[36px] p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(125,211,252,0.08),transparent_24%),radial-gradient(circle_at_82%_84%,rgba(99,102,241,0.08),transparent_26%)]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow-label text-[10px] text-slate-400 dark:text-slate-500">
            {active.eyebrow}
          </p>
          <div className="flex items-center gap-2">
            {showcaseStates.map((item, index) => (
              <span
                key={item.id}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: index === activeIndex ? item.accent : 'rgba(148, 163, 184, 0.22)' }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mt-4 max-w-sm text-[32px] font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">
              {active.title}
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-[1.82] text-slate-500 dark:text-slate-400">
              {active.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={next}
          onMouseMove={tilt.onMove}
          onMouseLeave={tilt.onLeave}
          whileTap={{ scale: 0.995 }}
          className="group relative mt-7 h-[340px] w-full overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,13,24,0.96),rgba(7,11,20,0.92))] text-left"
        >
          <motion.div className="absolute inset-0" style={{ background: tilt.glow }} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(125,211,252,0.1),transparent_24%),radial-gradient(circle_at_50%_68%,rgba(99,102,241,0.08),transparent_34%)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/16 [transform:translate(-50%,-50%)_rotate(12deg)]" />

          <motion.div
            style={{
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <div className="absolute inset-x-[14%] top-[16%] h-[68%] rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] shadow-[0_30px_80px_rgba(4,10,22,0.34)]" />
                <PreviewVisual id={active.id} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-medium text-slate-300 backdrop-blur-md">
            Tıkla ve farklı preview'leri incele
          </div>
        </motion.button>

        <div className="mt-5 flex flex-wrap gap-2">
          {active.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-300/60 bg-white/48 px-3 py-1.5 text-[12px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
