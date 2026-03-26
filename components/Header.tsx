'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, Command } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: string
}

interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  tabs: Tab[]
}

export default function Header({ activeTab, setActiveTab, tabs }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on outside click — no DOM overlay needed
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    // Delay to avoid the same click that opened the menu from closing it
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler) }
  }, [menuOpen])

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 ${
          scrolled ? 'glass shadow-xl shadow-black/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-[42px] h-[42px] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_12px_rgba(99,102,241,0.5)] group-hover:drop-shadow-[0_4px_18px_rgba(99,102,241,0.65)] transition-all duration-300">
                <rect width="42" height="42" rx="13" fill="url(#lg)"/>
                <path d="M21 12L30 29H12L21 12Z" stroke="white" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c6fe0"/>
                    <stop offset="0.55" stopColor="#4f7ef5"/>
                    <stop offset="1" stopColor="#3b8ef0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="text-[13.5px] font-semibold tracking-[-0.01em] dark:text-white text-slate-900 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                Ahmet Akyapı
              </span>
              <span className="text-[10px] font-mono tracking-[0.08em] uppercase text-gray-400 dark:text-gray-500 mt-0.5">
                Fullstack Dev
              </span>
            </span>
          </motion.button>

          {/* Desktop nav */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center p-1 glass rounded-xl gap-0.5"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors z-10 ${
                  activeTab === tab.id
                    ? 'dark:text-white text-slate-900 font-semibold'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-lg dark:border-sky-400/25 dark:bg-sky-400/12 border border-indigo-400/30 bg-indigo-500/[0.1] shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </motion.nav>

          {/* Right actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {/* ⌘K hint */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 glass rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs font-mono"
              aria-label="Command palette"
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 glass rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 glass rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={menuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-16 inset-x-0 z-40 md:hidden"
          >
            <div
              className="mx-4 mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-[rgba(255,252,245,0.98)] shadow-lg shadow-black/5 dark:border-white/[0.08] dark:bg-[rgba(7,9,18,0.98)] dark:shadow-black/10"
            >
              <div className="p-3 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
