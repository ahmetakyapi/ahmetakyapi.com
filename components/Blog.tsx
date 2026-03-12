'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { blogPosts } from '@/lib/data'

const tagColors = [
  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'bg-amber-500/10 text-amber-400 border-amber-500/20',
]

export default function Blog() {
  const [featured, ...rest] = blogPosts

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="font-mono text-indigo-400 text-xs tracking-widest uppercase mb-3">yazılar</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
          Blog<span className="text-gradient">.</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
          Frontend geliştirme, modern araçlar ve yazılım mühendisliği üzerine kişisel yazılar.
        </p>
      </motion.div>

      {/* Featured */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <Link href={`/blog/${featured.slug}`} className="block group">
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.03] hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl dark:hover:shadow-indigo-500/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(99,102,241,0.06)_0%,transparent_60%)]" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-medium border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Öne Çıkan
                </span>
                {featured.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-full border border-gray-200 dark:border-white/8 text-gray-500 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mb-3 leading-snug">
                {featured.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-2xl text-[15px]">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featured.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime} okuma
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Oku <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {rest.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/blog/${post.slug}`} className="block group h-full">
              <div className="h-full rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.03] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg dark:hover:shadow-indigo-500/5 transition-all duration-300 p-5 flex flex-col">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag, ti) => (
                    <span key={tag} className={`px-2 py-0.5 text-[11px] rounded-full border ${tagColors[(i + ti) % tagColors.length]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-snug flex-1 text-[15px]">
                  {post.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-gray-200 dark:border-white/6 p-8 text-center"
      >
        <BookOpen className="w-7 h-7 text-indigo-400 mx-auto mb-3 opacity-50" />
        <p className="text-gray-400 text-sm">
          Yeni yazılar yakında{' '}
          <span className="text-indigo-400 font-medium">ahmetakyapi.com</span>'da yayınlanacak.
        </p>
      </motion.div>
    </section>
  )
}
