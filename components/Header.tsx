'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sun, Moon, Menu, X, Command } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  /* Aktif bağlantının konumunu ölçüp göstergeyi oraya taşıyor.
     Framer Motion'ın layoutId'si aynı işi yapıyordu ama kütüphanenin
     tamamını ilk yüklemeye sokuyordu. */
  const positionPill = useCallback(() => {
    const nav = navRef.current
    const pill = pillRef.current
    if (!nav || !pill) return

    const active = nav.querySelector<HTMLElement>('[aria-current="page"]')
    if (!active) {
      pill.style.opacity = '0'
      return
    }

    pill.style.opacity = '1'
    pill.style.setProperty('--pill-x', `${active.offsetLeft}px`)
    pill.style.setProperty('--pill-w', `${active.offsetWidth}px`)
  }, [])

  /** /blog/bir-yazi da "Blog" sekmesini işaretlesin. */
  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 10)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* Rota değişince mobil menü kendiliğinden kapansın. */
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    positionPill()
    // İlk yerleşimden sonra geçişi aç: sayfa açılırken gösterge kaymasın.
    const t = setTimeout(() => pillRef.current?.removeAttribute('data-first'), 60)
    return () => clearTimeout(t)
  }, [pathname, positionPill])

  useEffect(() => {
    window.addEventListener('resize', positionPill)
    return () => window.removeEventListener('resize', positionPill)
  }, [positionPill])

  useEffect(() => {
    if (!menuOpen) return

    function onPointer(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    // Menüyü açan tıklamanın aynı anda kapatmaması için bir tur bekle.
    const t = setTimeout(() => document.addEventListener('mousedown', onPointer), 0)
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
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
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Ana sayfa">
            <span className="w-[42px] h-[42px] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <svg
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_2px_12px_rgba(99,102,241,0.5)] group-hover:drop-shadow-[0_4px_18px_rgba(99,102,241,0.65)] transition-all duration-300"
                aria-hidden="true"
              >
                <rect width="42" height="42" rx="13" fill="url(#lg)" />
                <path
                  d="M21 12L30 29H12L21 12Z"
                  stroke="white"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c6fe0" />
                    <stop offset="0.55" stopColor="#4f7ef5" />
                    <stop offset="1" stopColor="#3b8ef0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="text-[13.5px] font-semibold tracking-[-0.01em] dark:text-white text-slate-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Ahmet Akyapı
              </span>
              <span className="text-[10px] font-mono tracking-[0.08em] uppercase text-slate-500 dark:text-slate-500 mt-0.5">
                Fullstack Dev
              </span>
            </span>
          </Link>

          <nav
            ref={navRef}
            aria-label="Ana gezinme"
            className="relative hidden md:flex items-center p-1 glass-flat rounded-xl gap-0.5"
          >
            <span ref={pillRef} className="nav-pill" data-first aria-hidden="true" />
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors z-10 ${
                    active
                      ? 'dark:text-white text-slate-900 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span className="relative flex items-center gap-1.5">
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('command-palette:open'))}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 glass-flat rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-xs font-mono"
              aria-label="Komut paletini aç"
            >
              <Command className="w-3 h-3" aria-hidden="true" />
              <span>K</span>
            </button>

            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 glass-flat rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 glass-flat rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobil gezinme"
          ref={menuRef}
          className="panel-in fixed top-16 inset-x-0 z-40 md:hidden"
        >
          <div className="mx-4 mt-2 overflow-hidden rounded-2xl border border-slate-300/70 bg-[rgba(255,252,245,0.98)] shadow-lg shadow-black/5 dark:border-white/[0.08] dark:bg-[rgba(7,9,18,0.98)] dark:shadow-black/10">
              <div className="p-3 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'border border-indigo-500/25 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-500/5 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base" aria-hidden="true">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
        </nav>
      )}
    </>
  )
}
