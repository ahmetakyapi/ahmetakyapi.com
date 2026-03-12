'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow duration-300">
              <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-br from-indigo-500/90 via-blue-500/90 to-cyan-500/90" />
              <div className="relative flex items-center justify-center h-full">
                <span className="text-white font-extrabold text-sm tracking-tight">
                  AA
                </span>
              </div>
            </div>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                Ahmet Akyapı
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Fullstack Developer
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
                    ? 'text-white dark:text-white text-gray-900'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-lg border border-sky-400/25 bg-sky-400/12"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 md:hidden"
          >
            <div className="mx-4 mt-2 glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="p-3 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
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
