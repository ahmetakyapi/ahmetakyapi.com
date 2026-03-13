'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowLeft, Calendar, Clock, Sun, Moon, ArrowRight, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import type { BlogPost, Block } from '@/lib/data'
import GiscusComments from '@/components/GiscusComments'
import { trackView } from '@/lib/track-view'

export default function BlogPostClient({ post, allPosts }: { post: BlogPost; allPosts: BlogPost[] }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    void trackView(`/blog/${post.slug}`)
  }, [post.slug])

  const others = allPosts.filter(p => p.slug !== post.slug).slice(0, 2)
  const sections = post.content.flatMap((block, index) =>
    block.type === 'h2' ? [{ id: getSectionId(index), text: block.text }] : [],
  )
  const publishedDate = new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f8f9fc] text-gray-900 transition-colors duration-300 dark:bg-[#060811] dark:text-gray-100">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{ scaleX, background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)', transformOrigin: '0%' }}
      />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 glass border-b dark:border-white/5 border-gray-200/80">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
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

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#f8f9fc_72%,transparent_100%)] dark:bg-[linear-gradient(180deg,#09121f_0%,#060811_76%,#060811_100%)]">
        <div
          className="absolute inset-0 opacity-95 dark:opacity-100"
          style={{
            background: `radial-gradient(circle at 16% 18%, ${post.tagColor}22, transparent 28%), radial-gradient(circle at 86% 12%, ${post.tagColor}18, transparent 20%), radial-gradient(circle at 62% 76%, ${post.tagColor}10, transparent 28%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.1]"
          style={{
            backgroundImage: 'linear-gradient(rgba(15,23,42,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,0.08) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.18))',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_36%)] opacity-55 dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(180deg,rgba(5,8,16,0.08),rgba(5,8,16,0.58))]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-4 pt-24 sm:pb-6 sm:pt-28">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 backdrop-blur-md dark:border-white/12 dark:bg-white/[0.04] dark:text-white/65">
                  Teknik Yazı
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
                  style={{ color: post.tagColor, background: `${post.tagColor}14`, borderColor: `${post.tagColor}30` }}
                >
                  {post.tag}
                </span>
              </div>

              <h1 className="mt-6 max-w-[11ch] text-[clamp(2.15rem,5vw,4.35rem)] font-black tracking-[-0.042em] leading-[1.01] text-slate-950 [text-wrap:balance] dark:text-white">
                {post.title}
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-slate-600 sm:text-[17px] dark:text-slate-300/88">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 pb-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {publishedDate}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime} okuma
                </span>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[28px] border border-slate-200/80 bg-white/74 p-5 shadow-[0_24px_72px_-52px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-white/[0.07] dark:bg-white/[0.04] dark:shadow-[0_24px_72px_-48px_rgba(2,6,23,0.76)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 dark:text-white/42">
                Bu Yazıda
              </p>

              <div className="mt-4 space-y-2.5">
                {sections.slice(0, 4).map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start gap-3 rounded-2xl px-1 py-1.5 transition-colors hover:bg-slate-100/85 dark:hover:bg-white/[0.04]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 transition-colors group-hover:border-slate-300 group-hover:text-slate-800 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/55 dark:group-hover:border-white/[0.16] dark:group-hover:text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-slate-600 transition-colors group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white">
                      {section.text}
                    </span>
                  </a>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="relative mx-auto max-w-5xl px-6 pb-24 pt-1 sm:pt-2">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div className="lg:max-w-3xl">
            {/* Article blocks */}
            <article className="border-t border-slate-300/90 pt-5 dark:border-white/[0.14] sm:pt-6">
              {post.content.map((block, i) => (
                <BlockRenderer key={i} block={block} index={i} />
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
          </div>
        </div>
      </main>
    </div>
  )
}

function getSectionId(index: number) {
  return `section-${index}`
}

/* ─── Block renderer ─────────────────────────────────────────────────────── */
function BlockRenderer({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case 'h2':
      return (
        <motion.h2
          id={getSectionId(index)}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 mb-4 flex scroll-mt-24 items-center gap-3 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl"
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
      return <CodeBlock lang={block.lang} text={block.text} />

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
        tip:     { border: 'border-emerald-500/30', bg: 'dark:bg-emerald-500/5 bg-emerald-50',  text: 'dark:text-emerald-400 text-emerald-600', label: '💡 İpucu' },
        info:    { border: 'border-sky-500/30',     bg: 'dark:bg-sky-500/5 bg-sky-50',         text: 'dark:text-sky-400 text-sky-600',         label: 'ℹ️ Bilgi' },
        warning: { border: 'border-amber-500/30',   bg: 'dark:bg-amber-500/5 bg-amber-50',     text: 'dark:text-amber-400 text-amber-600',     label: '⚠️ Dikkat' },
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

function CodeBlock({ lang, text }: { lang: string; text: string }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function handleCopy() {
    const copied = await copyText(text)
    setCopyState(copied ? 'copied' : 'error')
    window.setTimeout(() => setCopyState('idle'), 1800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-7 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_80px_-50px_rgba(15,23,42,0.45)] dark:border-white/[0.08] dark:bg-[#09101a]"
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-[linear-gradient(90deg,rgba(255,255,255,0.96),rgba(241,245,249,0.9))] px-4 py-3 dark:border-white/[0.05] dark:bg-[linear-gradient(90deg,rgba(22,27,39,0.96),rgba(12,18,30,0.92))]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {lang}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/[0.16] dark:hover:text-white"
          aria-label={copyState === 'copied' ? 'Kod kopyalandı' : 'Kodu kopyala'}
        >
          {copyState === 'copied' ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{copyState === 'copied' ? 'Kopyalandı' : copyState === 'error' ? 'Tekrar dene' : 'Kopyala'}</span>
        </button>
      </div>

      <pre className="overflow-x-auto bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#f3f7fb_100%)] p-5 dark:bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_28%),linear-gradient(180deg,#0d1117_0%,#081019_100%)]">
        <code className="font-mono text-[13px] leading-[1.85] text-slate-800 dark:text-slate-300">
          {text}
        </code>
      </pre>
    </motion.div>
  )
}

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall back to the textarea strategy below.
    }
  }

  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)
  return copied
}
