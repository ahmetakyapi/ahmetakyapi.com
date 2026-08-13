'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/nav'
import { ArrowLeft, Home } from 'lucide-react'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________'

function useGlitch(text: string, running: boolean) {
  const [display, setDisplay] = useState(text)
  useEffect(() => {
    if (!running) { setDisplay(text); return }
    let frame = 0
    const interval = setInterval(() => {
      setDisplay(
        text.split('').map((char, i) =>
          frame < i
            ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            : char
        ).join('')
      )
      frame++
      if (frame > text.length) { clearInterval(interval); setDisplay(text) }
    }, 45)
    return () => clearInterval(interval)
  }, [text, running])
  return display
}

export default function NotFound() {
  const [glitching, setGlitch] = useState(true)
  const heading = useGlitch('404', glitching)

  useEffect(() => {
    const t = setTimeout(() => setGlitch(false), 1600)
    return () => clearTimeout(t)
  }, [])

  /* Öneriler düz metindi — tıklanamıyordu. Artık gerçek bağlantı ve
     liste tek kaynaktan (lib/nav.ts) geliyor. */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page transition-colors duration-300">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(99,102,241,0.10),transparent_65%)]" />

      {/* Ambient orbs */}
      <div data-reveal
        className="absolute top-1/4 left-1/4 w-96 h-96 dark:bg-indigo-600/20 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none"
      />
      <div data-reveal
        className="absolute bottom-1/4 right-1/4 w-80 h-80 dark:bg-violet-600/20 bg-violet-400/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* 404 glitch */}
        <div data-reveal
          className="relative mb-2 select-none"
        >
          {/* Shadow layer */}
          <div
            className="absolute inset-0 flex items-center justify-center text-[160px] sm:text-[200px] font-black leading-none pointer-events-none blur-sm"
            style={{
              background: 'linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.25,
            }}
          >
            {heading}
          </div>
          {/* Main */}
          <h1
            className="text-[160px] sm:text-[200px] font-black leading-none"
            style={{
              background: 'linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {heading}
          </h1>
        </div>

        {/* Subtitle */}
        <div data-reveal
        >
          <p className="font-mono dark:text-indigo-400/70 text-indigo-500/80 text-xs tracking-widest uppercase mb-3">
            sayfa bulunamadı
          </p>
          <p className="dark:text-gray-400 text-slate-600 text-[15px] leading-relaxed mb-8">
            Aradığın sayfa silinmiş, taşınmış ya da hiç var olmamış olabilir.
          </p>
        </div>

        {/* Suggestions */}
        <div data-reveal
          className="glass rounded-2xl p-4 mb-7 text-left"
        >
          <p className="font-mono text-[11px] dark:text-gray-500 text-slate-400 mb-3 tracking-wide">
            <span className="dark:text-gray-600 text-slate-500">// </span>belki bunlara bakmak ister misin?
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item, i) => (
              <li data-reveal
                key={item.href}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <span className="font-mono text-xs text-indigo-500" aria-hidden="true">→</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div data-reveal
          className="flex items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <button
            onClick={() => history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium dark:text-gray-400 text-slate-600 glass dark:hover:text-white hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>
        </div>
      </div>
    </div>
  )
}
