'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { blogPosts } from '@/lib/data'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Blog() {
  const [featured, ...rest] = blogPosts

  return (
    <section className="relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-[1]">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_60%)]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Divider */}
        <div className="mb-20 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-label mb-3 text-[11px] text-cyan-600 dark:text-cyan-400/80">
              Yazılar
            </p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
              <span className="text-slate-900 dark:text-white">Düşünceler &</span>{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                Notlar
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="group relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0c0b18] mb-8"
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0 opacity-20 dark:opacity-30"
            style={{ background: featured.coverGradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0c0b18] via-white/60 dark:via-[#0c0b18]/60 to-transparent" />

          <Link href={`/blog/${featured.slug}`} className="relative z-10 block p-7 sm:p-8">
            {/* Top row: featured badge + tag */}
            <div className="flex items-center justify-between mb-auto pb-6">
              <span className="rounded-full border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-white/80 backdrop-blur-sm">
                Öne Çıkan
              </span>
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm"
                style={{ color: featured.tagColor, borderColor: `${featured.tagColor}40`, background: `${featured.tagColor}15` }}
              >
                {featured.tag}
              </span>
            </div>

            {/* Content */}
            <div className="mt-16 sm:mt-24">
              <h3 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-slate-900 dark:text-white leading-tight transition-colors">
                {featured.title}
              </h3>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-slate-500 dark:text-slate-400">
                {featured.excerpt}
              </p>

              {/* Meta */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/[0.06] flex items-center gap-6 text-[12px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(featured.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {featured.readTime}
                </span>
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium ml-auto group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Oku
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Blog cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full relative overflow-hidden rounded-[22px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0c0e17] hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors p-6 flex flex-col">
                  {/* Colored top border */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, ${post.tagColor}, ${post.tagColor}88)` }}
                  />

                  {/* Tag */}
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold mb-5 w-fit"
                    style={{
                      color: post.tagColor,
                      background: `${post.tagColor}14`,
                      border: `1px solid ${post.tagColor}30`,
                    }}
                  >
                    {post.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-[18px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-3 text-[13px] leading-[1.75] text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.04] flex items-center gap-4 text-[12px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
