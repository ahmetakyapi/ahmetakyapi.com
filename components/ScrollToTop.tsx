'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Yukarı çık"
          className="fixed bottom-6 right-6 z-[9980] w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/90 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
