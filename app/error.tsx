'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <span className="text-2xl">⚠</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Bir şeyler ters gitti
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Sayfa yüklenirken beklenmeyen bir hata oluştu.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-gray-400 hover:text-gray-200 border border-white/10 hover:border-white/20 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </a>
        </div>
      </motion.div>
    </div>
  )
}
