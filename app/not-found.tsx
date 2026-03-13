'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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

  const items = [
    'Ana Sayfa',
    'Projeler',
    'Blog yazıları',
  ]

  return (
    <div className="min-h-screen dark:bg-[#060811] bg-[#f4f6fb] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(99,102,241,0.10),transparent_65%)]" />

      {/* Ambient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 dark:bg-indigo-600/20 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 dark:bg-violet-600/20 bg-violet-400/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* 404 glitch */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
          <div
            className="text-[160px] sm:text-[200px] font-black leading-none"
            style={{
              background: 'linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {heading}
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="font-mono dark:text-indigo-400/70 text-indigo-500/80 text-xs tracking-widest uppercase mb-3">
            sayfa bulunamadı
          </p>
          <p className="dark:text-gray-400 text-slate-600 text-[15px] leading-relaxed mb-8">
            Aradığın sayfa silinmiş, taşınmış ya da hiç var olmamış olabilir.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="glass rounded-2xl p-4 mb-7 text-left"
        >
          <p className="font-mono text-[11px] dark:text-gray-500 text-slate-400 mb-3 tracking-wide">
            <span className="dark:text-gray-600 text-slate-500">// </span>belki bunlara bakmak ister misin?
          </p>
          <div className="space-y-1">
            {items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-2 text-sm dark:text-gray-400 text-slate-600"
              >
                <span className="text-indigo-500 font-mono text-xs">→</span>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
        </motion.div>
      </div>
    </div>
  )
}
