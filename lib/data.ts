export interface Project {
  id: number
  category: string
  title: string
  description: string
  tags: string[]
  link: string
  github?: string
  accent: string
  gradient: string
  badge: 'Canlı' | 'GitHub'
  featured: boolean
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }

export interface BlogPost {
  slug: string
  tag: string
  tagColor: string
  title: string
  excerpt: string
  date: string
  readTime: string
  coverGradient: string
  content: Block[]
}

export const projects: Project[] = [
  {
    id: 1,
    category: 'Portfolio & Showcase',
    title: 'ahmetakyapi.com',
    description: 'Bu sitenin kendisi. Next.js App Router, TailwindCSS ve Framer Motion ile sıfırdan tasarlayıp geliştirdiğim kişisel portfolio ve blog sitesi. Dark/light tema, Giscus yorum sistemi ve teknik blog yazıları içeriyor.',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    link: 'https://ahmetakyapi.com',
    github: 'https://github.com/ahmetakyapi/ahmetakyapi.me',
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    badge: 'Canlı',
    featured: true,
  },
  {
    id: 2,
    category: 'Productivity',
    title: 'DigyNotes',
    description: 'Minimalist dijital not alma uygulaması. Notları başlık ve içerikle hızlıca oluşturup kategorilere göre düzenleyebilir, anlık arama yapabilirsin. TypeScript ile tip güvenli geliştirildi.',
    tags: ['TypeScript', 'React', 'TailwindCSS'],
    link: 'https://digy-notes.vercel.app',
    github: 'https://github.com/ahmetakyapi/DigyNotes',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    badge: 'Canlı',
    featured: false,
  },
  {
    id: 3,
    category: 'Finance',
    title: 'Keskealsaydım',
    description: '"Keşke o zaman Bitcoin almıştım" hissini sayıya döken araç. Geçmişe dönüp seçtiğin varlığa yatırım yapsaydın bugün ne kadar olurdu sorusunu yanıtlıyor.',
    tags: ['TypeScript', 'React', 'TailwindCSS'],
    link: 'https://keskealsaydim.vercel.app',
    github: 'https://github.com/ahmetakyapi/keskealsaydim',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    badge: 'Canlı',
    featured: false,
  },
  {
    id: 4,
    category: 'Utility',
    title: 'Ramazan Vakitleri',
    description: "Türkiye'nin 81 ili için güncel iftar ve sahur vakitlerini listeleyen sade web uygulaması. İl seçimine göre otomatik filtreleme.",
    tags: ['JavaScript', 'HTML', 'CSS'],
    link: 'https://ramazan-vakitleri.vercel.app',
    github: 'https://github.com/ahmetakyapi/ramazan-vakitleri',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    badge: 'Canlı',
    featured: false,
  },
]
export const blogPosts: BlogPost[] = [
  {
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
  },
  {
    slug: 'typescript-ile-daha-iyi-react-bilesenleri',
    tag: 'TypeScript',
    tagColor: '#3178c6',
    title: 'TypeScript ile Daha İyi React Bileşenleri',
    excerpt:
      'TypeScript kullanarak React bileşenlerinizi tip güvenli, bakımı kolay ve daha güçlü hale getirmenin pratik yolları.',
    date: '2024-02-20',
    readTime: '8 dk',
    coverGradient: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
    content: [
      { type: 'p', text: 'JavaScript\'te bir bileşene yanlış prop geçtiğinizde hatayı çalışma zamanında öğrenirsiniz — muhtemelen production\'da. TypeScript ile bu hata derleme anında, kodunuzu yazdığınız anda yakalanır.' },
      { type: 'h2', text: 'Props Tanımlamak: interface mi type mı?' },
      { type: 'p', text: 'İkisi de çalışır, ancak bileşen props\'ları için interface tercih edilir — daha okunabilir hata mesajları üretir ve declaration merging destekler.' },
      { type: 'code', lang: 'tsx', text: `// ✅ Tercih edilen
interface ButtonProps {
  label: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

export function Button({ label, variant = 'primary', size = 'md', ...rest }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size])} {...rest}>{label}</button>
}` },
      { type: 'h2', text: 'children\'ı Doğru Tipler' },
      { type: 'p', text: 'React.PropsWithChildren kullanmak yerine children\'ı açıkça tanımlamak daha esnektir — ne tür children\'a izin verdiğinizi net gösterir.' },
      { type: 'code', lang: 'tsx', text: `import { ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode        // herhangi bir render edilebilir içerik
  footer?: ReactNode         // opsiyonel slot
  className?: string
}

// Sadece string kabul eden bileşen için:
interface LabelProps {
  children: string
}` },
      { type: 'h2', text: 'Generic Bileşenler' },
      { type: 'p', text: 'Bir liste bileşeni düşünün: her veri tipiyle çalışması gerekiyor ama tip güvenliğini kaybetmek istemiyorsunuz. Generics tam bu durumda devreye girer.' },
      { type: 'code', lang: 'tsx', text: `interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T) => string
  emptyText?: string
}

export function List<T>({ items, renderItem, keyExtractor, emptyText = 'Sonuç yok' }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyText}</p>
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  )
}

// Kullanım — tip otomatik çıkarılır:
<List
  items={users}
  keyExtractor={(u) => u.id}
  renderItem={(u) => <UserCard user={u} />}
/>` },
      { type: 'callout', variant: 'tip', text: 'as const kullanarak sabit değerleri tuple/literal olarak daraltın. Bu sayede "primary" | "outline" gibi union tipler otomatik oluşur, ayrı tanımlamaya gerek kalmaz.' },
      { type: 'h2', text: 'Custom Hook Tipleri' },
      { type: 'code', lang: 'tsx', text: `function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initial
    } catch {
      return initial
    }
  })

  const set = (v: T | ((prev: T) => T)) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(typeof v === 'function' ? (v as (p: T) => T)(value) : v))
  }

  return [value, set] as const
  //                    ^ tuple döndürür, [T, Dispatch<...>] çıkarımı doğru olur
}` },
      { type: 'h2', text: 'Discriminated Union ile Conditional Props' },
      { type: 'p', text: 'Bir bileşenin farklı modlarda farklı prop seti alması gerektiğinde discriminated union\'lar hayat kurtarır.' },
      { type: 'code', lang: 'tsx', text: `type AlertProps =
  | { variant: 'info';    message: string }
  | { variant: 'confirm'; message: string; onConfirm: () => void; onCancel: () => void }
  | { variant: 'error';   message: string; error: Error }

// variant='confirm' seçilince TypeScript onConfirm ve onCancel'ı zorunlu kılar.
// variant='info' seçilince bu prop'lar mevcut bile değildir.` },
    ],
  },
  {
    slug: 'tailwindcss-dark-tema-tasarimi',
    tag: 'Design',
    tagColor: '#06b6d4',
    title: 'TailwindCSS ile Modern Dark Tema Tasarımı',
    excerpt:
      'next-themes ve TailwindCSS kullanarak kullanıcı tercihine saygı duyan, tutarlı dark/light tema sistemi kurmanın detaylı rehberi.',
    date: '2024-01-10',
    readTime: '6 dk',
    coverGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    content: [
      { type: 'p', text: 'Dark tema artık bir "ekstra özellik" değil, kullanıcıların beklediği temel bir UX standardı. Doğru yapmak; sistemin tercihine saygı duymak, her iki temada da tutarlı görünmek ve hydration sorunlarına düşmemekten geçiyor.' },
      { type: 'h2', text: 'Kurulum: tailwind.config + next-themes' },
      { type: 'code', lang: 'ts', text: `// tailwind.config.ts
export default {
  darkMode: 'class', // 'media' değil — kullanıcı kontrolü için
  // ...
}` },
      { type: 'code', lang: 'tsx', text: `// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>   {/* Flash önlemek için şart */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}        // sistem tercihini ignore etmek için
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}` },
      { type: 'callout', variant: 'warning', text: 'suppressHydrationWarning olmadan "Text content did not match" hydration hatası alırsınız çünkü sunucu hangi temayı seçeceğini bilmez.' },
      { type: 'h2', text: 'CSS Değişkenleri ile Tutarlı Renk Sistemi' },
      { type: 'p', text: 'Her rengi dark: prefixi ile ikiye katlamak yerine CSS değişkenleri kurmak çok daha ölçeklenebilir.' },
      { type: 'code', lang: 'css', text: `/* globals.css */
:root {
  --bg:       255 255 255;
  --surface:  248 250 252;
  --text:      15  23  42;
  --muted:    100 116 139;
  --border:   226 232 240;
  --accent:    99 102 241;
}

.dark {
  --bg:         5   8  16;
  --surface:   15  18  28;
  --text:      241 245 249;
  --muted:     100 116 139;
  --border:    30  41  59;
  --accent:    129 140 248;
}

/* tailwind.config'de: */
/* colors: { bg: 'rgb(var(--bg) / <alpha-value>)' } */` },
      { type: 'h2', text: 'Hydration Flash Sorununu Çözmek' },
      { type: 'p', text: 'next-themes kullanan bileşenler ilk render\'da temayı bilmez. mounted state ile çözülür.' },
      { type: 'code', lang: 'tsx', text: `'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" /> // placeholder, layout shift önler

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}` },
      { type: 'h2', text: 'Glassmorphism: Her İki Temada Çalışan Kart' },
      { type: 'code', lang: 'css', text: `/* Dark varsayılan, light override */
.glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

html:not(.dark) .glass {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}` },
      { type: 'callout', variant: 'tip', text: 'Glassmorphism backdrop-filter\'ı desteklemez tarayıcılarda için @supports ile fallback verin: @supports not (backdrop-filter: blur(1px)) { .glass { background: rgb(var(--surface)); } }' },
    ],
  },
  {
    slug: 'firebase-realtime-chat-uygulamasi',
    tag: 'Architecture',
    tagColor: '#f59e0b',
    title: 'Firebase ile Realtime Chat Uygulaması',
    excerpt:
      'React ve Firebase Realtime Database kullanarak anlık mesajlaşma uygulaması geliştirme — auth, listeners ve optimize render.',
    date: '2023-12-05',
    readTime: '10 dk',
    coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    content: [
      { type: 'p', text: 'Firebase Realtime Database, WebSocket\'i yönetmeye gerek kalmadan anlık veri senkronizasyonu sağlar. Bu yazıda React ile sıfırdan çalışan bir chat uygulaması kuruyoruz — auth, mesaj akışı ve performans optimizasyonuyla.' },
      { type: 'h2', text: 'Proje Yapısı ve Firebase Kurulumu' },
      { type: 'code', lang: 'bash', text: `npm create vite@latest chat-app -- --template react-ts
cd chat-app
npm install firebase` },
      { type: 'code', lang: 'ts', text: `// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const app = initializeApp({
  apiKey:            process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  databaseURL:       process.env.NEXT_PUBLIC_FB_DB_URL,
  projectId:         process.env.NEXT_PUBLIC_FB_PROJECT_ID,
})

export const auth = getAuth(app)
export const db   = getDatabase(app)` },
      { type: 'h2', text: 'Anonim Auth ile Hızlı Başlangıç' },
      { type: 'code', lang: 'tsx', text: `import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

function useAuth() {
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid)
      else signInAnonymously(auth)
    })
    return unsub
  }, [])

  return uid
}` },
      { type: 'h2', text: 'Mesajları Dinlemek ve Göndermek' },
      { type: 'code', lang: 'tsx', text: `import { ref, push, onValue, query, limitToLast } from 'firebase/database'
import { db } from '@/lib/firebase'

interface Message {
  uid: string; text: string; timestamp: number
}

function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const q = query(ref(db, \`rooms/\${roomId}/messages\`), limitToLast(50))
    const unsub = onValue(q, (snap) => {
      const data = snap.val() ?? {}
      setMessages(Object.values(data))
    })
    return unsub
  }, [roomId])

  return messages
}

async function sendMessage(roomId: string, uid: string, text: string) {
  await push(ref(db, \`rooms/\${roomId}/messages\`), {
    uid, text, timestamp: Date.now(),
  })
}` },
      { type: 'callout', variant: 'warning', text: 'limitToLast(50) olmadan oda büyüdükçe tüm mesaj geçmişini her bağlantıda indirirsiniz. Büyük uygulamalar için cursor tabanlı pagination kurun.' },
      { type: 'h2', text: 'Re-render Optimizasyonu' },
      { type: 'p', text: 'Her mesaj geldiğinde tüm listeyi yeniden render etmemek için React.memo ve sabit referanslar kullanın.' },
      { type: 'code', lang: 'tsx', text: `const MessageItem = React.memo(({ msg }: { msg: Message }) => (
  <div className="flex gap-2 p-2">
    <span className="font-mono text-xs text-indigo-400">{msg.uid.slice(0,6)}</span>
    <p>{msg.text}</p>
  </div>
))
MessageItem.displayName = 'MessageItem'

// Liste:
<div ref={bottomRef}>
  {messages.map((m) => (
    <MessageItem key={m.timestamp} msg={m} />
  ))}
</div>` },
      { type: 'h2', text: 'Otomatik Scroll' },
      { type: 'code', lang: 'tsx', text: `const bottomRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])` },
      { type: 'callout', variant: 'tip', text: 'Kullanıcı yukarı scroll etmişse otomatik aşağı kaydırma can sıkıcı olur. Intersection Observer ile "en altta mı?" kontrolü yapın ve sadece öyleyse scroll edin.' },
    ],
  },
]

export const techStack = [
  {
    name: 'React',
    tagline: 'Bileşen bazlı UI mimarim',
    color: '#61dafb',
    bg: 'rgba(97,218,251,0.06)',
    border: 'rgba(97,218,251,0.18)',
  },
  {
    name: 'Next.js',
    tagline: 'SSR · SSG · App Router',
    color: '#e2e8f0',
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.12)',
  },
  {
    name: 'TypeScript',
    tagline: 'Tip güvenli, ölçeklenebilir kod',
    color: '#3178c6',
    bg: 'rgba(49,120,198,0.06)',
    border: 'rgba(49,120,198,0.2)',
  },
  {
    name: 'Angular',
    tagline: 'Enterprise ölçekli SPA\'lar',
    color: '#dd0031',
    bg: 'rgba(221,0,49,0.06)',
    border: 'rgba(221,0,49,0.2)',
  },
  {
    name: 'TailwindCSS',
    tagline: 'Hızlı, tutarlı, utility-first styling',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.06)',
    border: 'rgba(6,182,212,0.18)',
  },
  {
    name: 'Framer Motion',
    tagline: 'Akıcı animasyon & geçişler',
    color: '#bb4ade',
    bg: 'rgba(187,74,222,0.06)',
    border: 'rgba(187,74,222,0.18)',
  },
  {
    name: 'Flutter',
    tagline: 'Cross-platform mobil geliştirme',
    color: '#54c5f8',
    bg: 'rgba(84,197,248,0.06)',
    border: 'rgba(84,197,248,0.18)',
  },
  {
    name: 'Node.js',
    tagline: 'API & sunucu tarafı işlemler',
    color: '#339933',
    bg: 'rgba(51,153,51,0.06)',
    border: 'rgba(51,153,51,0.18)',
  },
]
