'use client'

import { useCallback, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Code2, Github, Layers, Zap } from 'lucide-react'
import HeroShowcase from '@/components/HeroShowcase'
import { techStack } from '@/lib/data'

const valueProps = [
  {
    icon: Zap,
    title: 'Performans ve akış',
    description:
      'Ritmi ve geçişi iyi düşünülmüş, akıcı ve performanslı deneyimler oluşturuyorum.',
  },
  {
    icon: Layers,
    title: 'Sistemli frontend',
    description:
      'Düzenli component yapısı ve güçlü tipografiyle temiz, ölçeklenebilir arayüzler geliştiriyorum.',
  },
  {
    icon: Code2,
    title: 'Motion odaklı',
    description:
      'Detay, hareket ve mikro etkileşimler üzerinde titizlikle çalışmayı tercih ediyorum.',
  },
]

const featuredStack = techStack.filter((tech) =>
  ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'].includes(tech.name),
)

function useSpotlight() {
  const mx = useMotionValue(-600)
  const my = useMotionValue(-600)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      mx.set(event.clientX)
      my.set(event.clientY)
    }

    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mx, my])

  return useMotionTemplate`radial-gradient(620px circle at ${mx}px ${my}px, rgba(96, 165, 250, 0.07), transparent 78%)`
}

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

export default function Hero({ onNavigate }: { onNavigate: (target: string) => void }) {
  const spotlight = useSpotlight()
  const magnetic = useMagnetic()

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-[1]">
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(79,70,229,0.14),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.04),transparent_28%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 xl:grid-cols-[minmax(0,0.92fr)_minmax(480px,560px)] xl:gap-20">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[34rem] pt-10"
          >
            <p className="eyebrow-label mb-5 text-[11px] text-sky-400/75 dark:text-sky-300/70">
              Frontend Developer
            </p>

            <h1 className="display-heading max-w-[620px] overflow-visible pb-6 text-[64px] leading-[1.02] text-slate-950 dark:text-white sm:text-[82px] lg:text-[104px]">
              <span className="block">Ahmet</span>
              <span className="hero-name-gradient block pb-[0.08em]">Akyapı</span>
            </h1>

            <div className="mt-8 max-w-[31rem] space-y-5 text-[19px] leading-[1.88] text-slate-600 dark:text-slate-400">
              <p>
                React, Next.js ve TypeScript ile sade, hızlı ve detay kalitesi yüksek arayüzler
                geliştiriyorum.
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

            <div className="mt-8 flex flex-wrap gap-2.5">
              {['React', 'Next.js', 'TypeScript'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-300/70 bg-white/48 px-3 py-1.5 text-[12px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              UI Systems / Motion / Performance
            </p>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="xl:justify-self-end"
          >
            <HeroShowcase />
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="hero-surface mb-10 mt-20 rounded-[34px] px-5 py-6 sm:px-6 sm:py-7"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {valueProps.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.article
                  key={item.title}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + index * 0.08, duration: 0.45 }}
                  className="rounded-[26px] border border-slate-300/60 bg-white/46 p-6 dark:border-white/8 dark:bg-white/[0.025]"
                >
                  <div className="inline-flex rounded-[22px] border border-sky-400/16 bg-sky-400/8 p-3">
                    <Icon className="h-5 w-5 text-sky-300" />
                  </div>
                  <h3 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-[15px] leading-[1.85] text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </motion.article>
              )
            })}
          </div>

          <div className="my-7 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/8" />

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="eyebrow-label text-[10px] text-slate-400">Kullandığım temel stack</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              React, Next.js, TypeScript ve motion odaklı ürün geliştirme
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {featuredStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{ background: tech.bg, border: `1px solid ${tech.border}` }}
              >
                <div className="h-2 w-2 rounded-full" style={{ background: tech.color }} />
                <span className="text-[12px] font-medium" style={{ color: tech.color }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
