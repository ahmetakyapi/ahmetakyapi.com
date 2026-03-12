'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowLeft, Calendar, Clock, Sun, Moon, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { BlogPost, Block } from '@/lib/data'
import { blogPosts } from '@/lib/data'
import GiscusComments from '@/components/GiscusComments'

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => setMounted(true), [])

  const others = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#060811] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{ scaleX, background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)', transformOrigin: '0%' }}
      />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 glass border-b border-white/5 dark:border-white/5 border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Blog'a Dön</span>
            <span className="sm:hidden">Geri</span>
          </Link>

          <Link href="/" className="font-mono text-sm">
            <span className="text-gray-400">ahmetakyapi</span>
            <span className="text-indigo-400">.com</span>
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 glass rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-white/10"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark'
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Cover */}
      <div
        className="relative h-52 sm:h-64 overflow-hidden"
        style={{ background: post.coverGradient }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative h-full flex flex-col justify-end max-w-3xl mx-auto px-6 pb-7">
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm"
              style={{ background: `${post.tagColor}33`, borderColor: `${post.tagColor}66` }}
            >
              {post.tag}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">{post.title}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pt-8 pb-24">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 mb-10 pb-7 border-b border-gray-100 dark:border-white/5">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} okuma
          </span>
          <span className="ml-auto font-medium text-indigo-500 dark:text-indigo-400 text-sm">
            Ahmet Akyapı
          </span>
        </div>

        {/* Article blocks */}
        <article>
          {post.content.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </article>

        {/* Comments */}
        <GiscusComments />

        {/* Other posts */}
        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5">
            <p className="font-mono text-[11px] text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-5">
              diğer yazılar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map((other, i) => (
                <motion.div
                  key={other.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/blog/${other.slug}`} className="block group">
                    <div className="rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.03] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md dark:hover:shadow-indigo-500/5 transition-all duration-300 p-4">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span
                          className="px-2 py-0.5 text-[10px] rounded-full border font-medium"
                          style={{ color: other.tagColor, borderColor: `${other.tagColor}40`, background: `${other.tagColor}10` }}
                        >
                          {other.tag}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-2">
                        {other.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">{other.readTime} okuma</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ─── Block renderer ─────────────────────────────────────────────────────── */
function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <motion.h2
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4"
        >
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-violet-400 flex-shrink-0" />
          {block.text}
        </motion.h2>
      )

    case 'h3':
      return (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-7 mb-3">
          {block.text}
        </h3>
      )

    case 'p':
      return (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-gray-600 dark:text-gray-400 leading-[1.85] mb-5 text-[15px]"
        >
          {block.text}
        </motion.p>
      )

    case 'code':
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="my-6 rounded-xl overflow-hidden border border-white/8 dark:border-white/8 border-gray-200"
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5 bg-[#161b27]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="font-mono text-[10px] text-gray-500">{block.lang}</span>
          </div>
          <pre className="p-5 overflow-x-auto bg-[#0d1117]">
            <code className="font-mono text-[13px] text-gray-300 leading-[1.8]">{block.text}</code>
          </pre>
        </motion.div>
      )

    case 'ul':
      return (
        <ul className="my-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
              <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )

    case 'callout': {
      const s = {
        tip:     { border: 'border-emerald-500/25', bg: 'bg-emerald-500/5',  text: 'text-emerald-400', label: '💡 İpucu' },
        info:    { border: 'border-sky-500/25',     bg: 'bg-sky-500/5',      text: 'text-sky-400',     label: 'ℹ️ Bilgi' },
        warning: { border: 'border-amber-500/25',   bg: 'bg-amber-500/5',    text: 'text-amber-400',   label: '⚠️ Dikkat' },
      }[block.variant]
      return (
        <div className={`my-6 rounded-xl border ${s.border} ${s.bg} p-4`}>
          <p className={`text-xs font-semibold font-mono mb-1.5 ${s.text}`}>{s.label}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{block.text}</p>
        </div>
      )
    }

    default:
      return null
  }
}
