'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Blog from '@/components/Blog'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import CommandPalette from '@/components/CommandPalette'
import ScrollToTop from '@/components/ScrollToTop'
import NoiseTexture from '@/components/NoiseTexture'
import dynamic from 'next/dynamic'
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false })

type TabId = 'home' | 'projects' | 'blog'
const TAB_ORDER: TabId[] = ['home', 'projects', 'blog']

const tabs = [
  { id: 'home',     label: 'Ana Sayfa', icon: '⌂' },
  { id: 'projects', label: 'Projeler',  icon: '◈' },
  { id: 'blog',     label: 'Blog',      icon: '✦' },
] as const

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [hasHydrated, setHasHydrated] = useState(false)
  const prevTabRef = useRef<TabId>('home')

  function navigate(tab: string) {
    prevTabRef.current = activeTab
    setActiveTab(tab as TabId)
  }

  /* G+H / G+P / G+B keyboard shortcuts */
  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    let lastKey = ''
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'g') { lastKey = 'g'; return }
      if (lastKey === 'g') {
        if (e.key === 'h') navigate('home')
        if (e.key === 'p') navigate('projects')
        if (e.key === 'b') navigate('blog')
      }
      lastKey = ''
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  /* Direction: +1 forward, -1 backward */
  const dir = TAB_ORDER.indexOf(activeTab) >= TAB_ORDER.indexOf(prevTabRef.current) ? 1 : -1

  const variants = {
    initial: (d: number) => ({
      opacity: 0,
      x: d * 48,
      filter: 'blur(6px)',
    }),
    animate: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d * -48,
      filter: 'blur(6px)',
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  return (
    <>
      <ThreeBackground />
      <CustomCursor />
      <NoiseTexture />
      <CommandPalette onNavigate={navigate} />
      <ScrollToTop />

      <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Fixed ambient background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_18%_10%,rgba(79,70,229,0.12),transparent_26%),radial-gradient(circle_at_82%_8%,rgba(34,211,238,0.1),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_28%)] bg-[radial-gradient(circle_at_14%_10%,rgba(120,110,80,0.05),transparent_26%),radial-gradient(circle_at_84%_8%,rgba(99,102,241,0.04),transparent_24%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_18%,transparent_78%,rgba(8,145,178,0.03)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_18%,transparent_78%,rgba(8,145,178,0.03)_100%)]" />
        </div>

        <Header
          activeTab={activeTab}
          setActiveTab={navigate}
          tabs={tabs.map(t => ({ ...t }))}
        />

        <main className="flex-1 pt-16 overflow-x-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={activeTab}
              custom={dir}
              variants={variants}
              initial={hasHydrated ? 'initial' : false}
              animate="animate"
              exit="exit"
            >
              {activeTab === 'home'     && <Hero onNavigate={navigate} />}
              {activeTab === 'projects' && <Projects />}
              {activeTab === 'blog'     && <Blog />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  )
}
