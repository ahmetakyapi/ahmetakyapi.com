'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowLeft, Calendar, Clock, Sun, Moon, ArrowRight, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import type { BlogPost, Block } from '@/lib/data'
import GiscusComments from '@/components/GiscusComments'
import { trackView } from '@/lib/track-view'
import CodeHighlight from '@/components/CodeHighlight'
import { formatPostDate, readingTime } from '@/lib/reading-time'

export default function BlogPostClient({ post, allPosts }: { post: BlogPost; allPosts: BlogPost[] }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    void trackView(`/blog/${post.slug}`)
  }, [post.slug])

  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)
  const sections = post.content.flatMap((block, index) =>
    block.type === 'h2' ? [{ id: getSectionId(index), text: block.text }] : [],
  )
  const publishedDate = formatPostDate(post.date)

  return (
    <div className="relative min-h-screen overflow-x-clip bg-page text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{ scaleX, background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)', transformOrigin: '0%' }}
      />

      <header className="fixed top-0 inset-x-0 z-40 h-14 glass border-b dark:border-white/5 border-gray-200/80">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Bloga Dön</span>
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
              aria-label="Temayı değiştir"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,transparent_72%)] dark:bg-[linear-gradient(180deg,rgba(18,23,38,0.55)_0%,transparent_76%)]">
        <div
          className="absolute inset-0 opacity-95 dark:opacity-100"
          style={{
            background: `radial-gradient(circle at 16% 18%, ${post.tagColor}22, transparent 28%), radial-gradient(circle at 86% 12%, ${post.tagColor}18, transparent 20%), radial-gradient(circle at 62% 76%, ${post.tagColor}10, transparent 28%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15,23,42,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,0.08) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.18))',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_36%)] opacity-55 dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(180deg,rgba(5,8,16,0.08),rgba(5,8,16,0.58))]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-4 pt-24 sm:pb-6 sm:pt-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 backdrop-blur-md dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-white/65">
                  Teknik Yazı
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
                  style={{ color: post.tagColor, background: `${post.tagColor}14`, borderColor: `${post.tagColor}30` }}
                >
                  {post.tag}
                </span>
              </div>

              <h1 className="mt-6 max-w-[16ch] text-[clamp(2.1rem,5vw,4rem)] font-black tracking-[-0.042em] leading-[1.01] text-slate-950 [text-wrap:balance] dark:text-white">
                {post.title}
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-slate-600 sm:text-[17px] dark:text-slate-300">
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
                  {readingTime(post)} okuma
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-5xl px-6 pb-24 pt-1 sm:pt-2">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div className="mx-auto w-full max-w-[62ch] lg:mx-0 lg:max-w-none">
            <article className="border-t border-slate-300/90 pt-5 dark:border-white/[0.14] sm:pt-6">
              {post.content.map((block, i) => (
                <BlockRenderer key={i} block={block} index={i} />
              ))}
            </article>

            <GiscusComments />

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
                        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md dark:hover:shadow-indigo-500/5 transition-all duration-300 p-4">
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
                            <span className="text-[11px] text-gray-400">{readingTime(other)} okuma</span>
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

          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[24px] border border-slate-300/70 bg-white/[0.74] p-5 backdrop-blur-xl dark:border-white/[0.07] dark:bg-white/[0.04]">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/[0.42]">
                Bu Yazıda
              </p>

              <nav aria-label="Yazı içindekiler" className="mt-4 space-y-1">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-slate-500/5 dark:hover:bg-white/[0.04]"
                  >
                    <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 font-mono text-[10px] font-semibold text-slate-500 transition-colors group-hover:border-slate-400 group-hover:text-slate-800 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/55 dark:group-hover:text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] leading-snug text-slate-600 transition-colors group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-white">
                      {section.text}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

function getSectionId(index: number) {
  return `section-${index}`
}

/* Gövde metni tek yerden — punto ya da satır aralığı değişirse hepsi birlikte
   değişsin. 16px/1.8, uzun teknik yazılarda 15px gözü yoruyordu. */
const BODY = 'text-[16px] leading-[1.8] text-slate-600 dark:text-slate-400'

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
          className="mt-14 mb-5 flex scroll-mt-24 items-start gap-3 text-[22px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white sm:text-[26px]"
        >
          <span className="mt-[0.42em] h-[0.62em] w-1 flex-shrink-0 rounded-full bg-gradient-to-b from-indigo-400 to-violet-400" />
          <span className="[text-wrap:balance]">{block.text}</span>
        </motion.h2>
      )

    case 'h3':
      return (
        <h3 className="mt-9 mb-3 text-[18px] font-semibold tracking-[-0.015em] text-slate-800 dark:text-slate-200">
          {block.text}
        </h3>
      )

    case 'lead':
      return (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8 border-l-2 border-indigo-400/50 pl-5 text-[18px] leading-[1.72] text-slate-700 dark:border-indigo-400/40 dark:text-slate-300 sm:text-[19px]"
        >
          {block.text}
        </motion.p>
      )

    case 'p':
      return (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`mb-5 ${BODY}`}
        >
          {block.text}
        </motion.p>
      )

    case 'code':
      return <CodeBlock lang={block.lang} text={block.text} file={block.file} />

    case 'ul':
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 ${BODY}`}>
              <span className="mt-[0.7em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'ol':
      return (
        <ol className="my-6 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3.5 ${BODY}`}>
              <span className="mt-[0.15em] flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/10 font-mono text-[11px] font-semibold text-indigo-500 dark:text-indigo-300">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )

    case 'quote':
      return (
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="my-9 rounded-r-2xl border-l-[3px] border-indigo-400 bg-gradient-to-r from-indigo-500/[0.07] to-transparent py-5 pl-6 pr-5 dark:border-indigo-400/70 dark:from-indigo-400/[0.09]"
        >
          <p className="text-[17px] font-medium leading-[1.65] text-slate-800 [text-wrap:balance] dark:text-slate-200 sm:text-[18px]">
            {block.text}
          </p>
        </motion.blockquote>
      )

    case 'table':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="my-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/[0.08]"
        >
          <table className="w-full min-w-[420px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/[0.04]">
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="border-b border-slate-200 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:border-white/[0.08] dark:text-slate-400"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-slate-100 last:border-0 dark:border-white/[0.04]">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 text-[14px] leading-relaxed ${
                        ci === 0
                          ? 'font-medium text-slate-800 dark:text-slate-200'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )

    case 'stats':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="my-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-white/[0.08] dark:bg-white/[0.02] sm:p-6"
        >
          {block.label && (
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              {block.label}
            </p>
          )}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
            {block.items.map((item) => (
              <div key={item.note}>
                <dt className="font-mono text-[26px] font-semibold leading-none tracking-[-0.02em] text-slate-900 dark:text-white sm:text-[30px]">
                  {item.value}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-snug text-slate-500 dark:text-slate-400">{item.note}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      )

    case 'compare':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="my-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-white/[0.08] dark:bg-white/[0.02] sm:p-6"
        >
          {block.label && (
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              {block.label}
            </p>
          )}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 dark:border-white/[0.07] dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
                {block.before.label}
              </p>
              <p className="mt-1 font-mono text-[20px] font-semibold text-slate-500 line-through decoration-rose-400/60 decoration-2 dark:text-slate-400">
                {block.before.value}
              </p>
            </div>

            <ArrowRight className="mx-auto h-4 w-4 flex-shrink-0 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />

            <div className="flex-1 rounded-xl border border-emerald-400/30 bg-emerald-50 px-4 py-3.5 dark:border-emerald-400/25 dark:bg-emerald-400/[0.07]">
              <p className="text-[11px] uppercase tracking-[0.1em] text-emerald-600/80 dark:text-emerald-300/80">
                {block.after.label}
              </p>
              <p className="mt-1 font-mono text-[20px] font-semibold text-emerald-700 dark:text-emerald-300">
                {block.after.value}
              </p>
            </div>
          </div>
          {block.note && (
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{block.note}</p>
          )}
        </motion.div>
      )

    case 'steps':
      return (
        <ol className="my-8 space-y-0">
          {block.items.map((item, i) => (
            <li key={item.title} className="relative flex gap-4 pb-6 last:pb-0">
              {i < block.items.length - 1 && (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200 dark:bg-white/[0.08]"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/10 font-mono text-[12px] font-semibold text-indigo-500 dark:bg-indigo-400/[0.12] dark:text-indigo-300">
                {i + 1}
              </span>
              <div className="pt-1">
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1.5 text-[15px] leading-[1.75] text-slate-600 dark:text-slate-400">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )

    case 'callout': {
      const s = {
        tip: {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-50 dark:bg-emerald-500/[0.06]',
          text: 'text-emerald-600 dark:text-emerald-400',
          label: 'İpucu',
        },
        info: {
          border: 'border-sky-500/30',
          bg: 'bg-sky-50 dark:bg-sky-500/[0.06]',
          text: 'text-sky-600 dark:text-sky-400',
          label: 'Bilgi',
        },
        warning: {
          border: 'border-amber-500/30',
          bg: 'bg-amber-50 dark:bg-amber-500/[0.06]',
          text: 'text-amber-600 dark:text-amber-400',
          label: 'Dikkat',
        },
      }[block.variant]

      return (
        <div className={`my-7 rounded-2xl border ${s.border} ${s.bg} px-5 py-4`}>
          <p className={`mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${s.text}`}>{s.label}</p>
          <p className="text-[15px] leading-[1.75] text-slate-700 dark:text-slate-300">{block.text}</p>
        </div>
      )
    }

    default:
      /* Yeni bir Block tipi eklenip burada ele alınmazsa TypeScript bu
         satırda hata verir — blok sessizce çizilmeden kaybolmasın. */
      return assertNever(block)
  }
}

function assertNever(value: never): never {
  throw new Error(`Bilinmeyen blok tipi: ${JSON.stringify(value)}`)
}

function CodeBlock({ lang, text, file }: { lang: string; text: string; file?: string }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function handleCopy() {
    const copied = await copyText(text)
    setCopyState(copied ? 'copied' : 'error')
    window.setTimeout(() => setCopyState('idle'), 1800)
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 overflow-hidden rounded-[20px] border border-slate-300/80 bg-white shadow-[0_28px_80px_-56px_rgba(15,23,42,0.4)] dark:border-white/[0.08] dark:bg-[#0b0f1a]"
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex min-w-0 items-center gap-3">
          {/* Dosya yolu varsa dil yerine o yazılır — kodun nerede yaşadığı
              hangi dilde yazıldığından daha çok bilgi taşıyor. */}
          {file ? (
            <span className="truncate font-mono text-[11px] text-slate-600 dark:text-slate-400">{file}</span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
              {lang}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/[0.16] dark:hover:text-white"
        >
          {copyState === 'copied' ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{copyState === 'copied' ? 'Kopyalandı' : copyState === 'error' ? 'Tekrar dene' : 'Kopyala'}</span>
        </button>
      </figcaption>

      <pre className="overflow-x-auto bg-white p-5 dark:bg-transparent">
        <code className="font-mono text-[13px] leading-[1.8] text-slate-800 dark:text-slate-300">
          <CodeHighlight code={text} lang={lang} />
        </code>
      </pre>
    </motion.figure>
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
