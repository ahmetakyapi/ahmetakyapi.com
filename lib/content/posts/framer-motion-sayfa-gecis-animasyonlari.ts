import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'framer-motion-sayfa-gecis-animasyonlari',
    tag: 'Motion',
    tagColor: '#bb4ade',
    title: 'Framer Motion ile Sayfa Geçiş Animasyonları',
    excerpt:
      'Next.js projelerinde AnimatePresence ve motion bileşenlerini kullanarak etkileyici sayfa geçiş animasyonları nasıl yapılır?',
    date: '2024-03-15',
    readTime: '5 dk',
    coverGradient: 'linear-gradient(135deg, #bb4ade 0%, #6366f1 50%, #3b82f6 100%)',
    content: [
      { type: 'p', text: 'Bir web uygulamasında sayfa geçişleri, kullanıcının deneyimini sessizce şekillendiren detaylardır. Kaba bir anlık geçiş yerine akıcı bir animasyon, uygulamanın kalitesi hakkında güçlü bir sinyal verir. React ekosisteminde bu iş için en olgun araç Framer Motion.' },
      { type: 'h2', text: 'AnimatePresence Neden Var?' },
      { type: 'p', text: 'React, bir bileşeni DOM\'dan kaldırmadan önce ona "çıkış animasyonu çal" deme imkânı vermez. AnimatePresence bu boşluğu kapatır — children unmount olmadan önce exit animasyonu bekler.' },
      { type: 'code', lang: 'tsx', text: `// app/layout.tsx
'use client'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>{children}</div>
    </AnimatePresence>
  )
}` },
      { type: 'callout', variant: 'tip', text: 'mode="wait" kullanmak önemli — bu olmadan eski ve yeni sayfa aynı anda görünür, animasyonlar çakışır.' },
      { type: 'h2', text: 'Sayfa Bileşenine Animasyon Eklemek' },
      { type: 'p', text: 'Her sayfa bileşenini motion.div ile sarmalayın. initial, animate ve exit prop\'ları geçişin üç aşamasını tanımlar.' },
      { type: 'code', lang: 'tsx', text: `// app/about/page.tsx
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -20, filter: 'blur(4px)' },
}

export default function AboutPage() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* içerik */}
    </motion.main>
  )
}` },
      { type: 'h2', text: 'Stagger ile İçerik Sıralı Giriş' },
      { type: 'p', text: 'Sayfa tek seferde değil, öğeler sırasıyla gelirse çok daha etkileyici görünür. variants + staggerChildren kombinasyonu bunu sağlar.' },
      { type: 'code', lang: 'tsx', text: `const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

// Kullanım:
<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.title}</motion.li>
  ))}
</motion.ul>` },
      { type: 'h2', text: 'Performans İpuçları' },
      { type: 'ul', items: [
        'transform ve opacity animasyonları GPU\'ya offload edilir — y, scale, rotate kullanın, top/left/width kullanmayın.',
        'will-change: transform\'ı sadece animasyon sırasında uygulayın, her zaman değil.',
        'Mobilde reduce-motion tercihini her zaman kontrol edin: useReducedMotion() hook\'u ile.',
        'Çok sayıda eleman için AnimatePresence yerine layout animasyonlarını (layoutId) tercih edin.',
      ]},
      { type: 'callout', variant: 'info', text: 'Framer Motion\'ın layout prop\'u, element boyut/konum değişikliklerini otomatik animate eder. CSS geçişi yazmaya gerek kalmaz.' },
    ],
  }

export default post
