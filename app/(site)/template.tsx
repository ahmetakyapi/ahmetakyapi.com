'use client'

import { motion } from 'framer-motion'

/**
 * Rota giriş animasyonu.
 *
 * `template.tsx` her gezinmede yeniden monte edilir — `layout.tsx` edilmez.
 * Çıkış animasyonu bilerek yok: App Router yeni sayfayı render ederken eski
 * ağacı beklemiyor, AnimatePresence çıkış için ortada bir düğüm bulamıyor.
 * Yarım çalışan bir exit yerine tek yönlü ve tutarlı bir giriş.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
