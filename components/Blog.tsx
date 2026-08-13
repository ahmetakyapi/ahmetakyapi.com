'use client'

import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/data'
import { formatPostDate, readingTime } from '@/lib/reading-time'

export default function Blog({ blogPosts }: { blogPosts: BlogPost[] }) {
  const [featured, ...rest] = blogPosts

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-[1]" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_60%)] opacity-50 dark:opacity-100" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_60%)] opacity-50 dark:opacity-100" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <header data-reveal
          className="mb-8 sm:mb-12"
        >
          <p className="eyebrow-label mb-2 text-[11px] text-cyan-700 sm:mb-3 dark:text-cyan-400/90">Yazılar</p>
          <h1 className="text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">
            <span className="text-slate-900 dark:text-white">Düşünceler</span>{' '}
            <span className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-800 bg-clip-text text-transparent dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400">
              ve Notlar
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-slate-600 sm:text-[16px] dark:text-slate-400">
            Yazdığım projelerden çıkan notlar. Çoğu bir şeyin neden çalışmadığıyla başlıyor.
          </p>
        </header>

        {featured && (
          <article data-reveal
            className="group relative mb-8 overflow-hidden rounded-[28px] border border-slate-300/80 bg-card dark:border-white/[0.06]"
          >
            <div className="absolute inset-0 opacity-20 dark:opacity-30" style={{ background: featured.coverGradient }} aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" aria-hidden="true" />

            <Link href={`/blog/${featured.slug}`} className="relative z-10 block p-5 sm:p-7 lg:p-8">
              <div className="mb-auto flex items-center justify-between pb-5 sm:pb-6">
                <span className="rounded-full border border-slate-400/60 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.08] dark:text-white/80">
                  Öne Çıkan
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm"
                  style={{
                    color: featured.tagColor,
                    borderColor: `${featured.tagColor}40`,
                    background: `${featured.tagColor}15`,
                  }}
                >
                  {featured.tag}
                </span>
              </div>

              <div className="mt-10 sm:mt-16 lg:mt-24">
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[28px] lg:text-[32px] dark:text-white">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-lg text-[14px] leading-[1.75] text-slate-600 sm:mt-4 sm:text-[15px] sm:leading-[1.8] dark:text-slate-400">
                  {featured.excerpt}
                </p>

                <div className="mt-5 flex items-center gap-4 border-t border-slate-300/70 pt-4 text-[11px] text-slate-600 sm:mt-8 sm:gap-6 sm:pt-6 sm:text-[12px] dark:border-white/[0.06] dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {formatPostDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {readingTime(featured)}
                  </span>
                  <span className="ml-auto flex items-center gap-2 font-medium transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                    Oku
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* Üç sütunda kartlar sıkışıyordu; iki sütunda özet üç satır rahat sığıyor. */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {rest.map((post, i) => (
            <article data-reveal
              key={post.slug}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-300/80 bg-card p-5 transition-all hover:border-slate-400/80 hover:shadow-sm active:scale-[0.99] sm:rounded-[22px] sm:p-6 dark:border-white/[0.06] dark:hover:border-white/[0.12]">
                  <span
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, ${post.tagColor}, ${post.tagColor}88)` }}
                    aria-hidden="true"
                  />

                  <span
                    className="mb-4 w-fit rounded-full px-3 py-1 text-[11px] font-semibold sm:mb-5"
                    style={{
                      color: post.tagColor,
                      background: `${post.tagColor}14`,
                      border: `1px solid ${post.tagColor}30`,
                    }}
                  >
                    {post.tag}
                  </span>

                  <h2 className="text-[17px] font-bold leading-snug tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-slate-700 sm:text-[19px] dark:text-white dark:group-hover:text-slate-200">
                    {post.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-[1.8] text-slate-600 sm:mt-3 dark:text-slate-400">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-3 text-[11px] text-slate-500 sm:mt-6 sm:gap-4 sm:pt-4 sm:text-[12px] dark:border-white/[0.05] dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {formatPostDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {readingTime(post)}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
