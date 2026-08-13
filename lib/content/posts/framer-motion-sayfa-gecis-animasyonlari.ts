import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'framer-motion-sayfa-gecis-animasyonlari',
  tag: 'Arayüz',
  tagColor: '#8b5cf6',
  title: 'App Router\'da Çıkış Animasyonu Neden Çalışmıyor (ve Ne Yapmalı)',
  excerpt:
    'AnimatePresence\'ı layout.tsx\'e koydum, exit hiç oynamadı. template.tsx\'e taşıdım, giriş çalıştı, çıkış yine yok. Sebebini anlayınca çıkışı tamamen kaldırdım.',
  date: '2026-03-15',
  coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bu siteyi uzun süre sekmeli bir tek sayfa olarak yazdım. Sebebi tamamen animasyondu: sekmeler arası geçişte içerik sağa sola kayıyordu ve bunu gerçek sayfalarla yapamıyordum. Sonunda pes edip gerçek rotalara geçtim ve bir şey fark ettim — kimse o geçişi özlemedi.',
    },

    { type: 'h2', text: 'AnimatePresence Ne Yapar, Ne Yapamaz' },
    {
      type: 'p',
      text: 'React bir elemanı ağaçtan çıkardığında DOM\'dan da anında siler. Çıkış animasyonu diye bir şey normalde imkânsızdır: animasyonu oynatacak düğüm zaten yok.',
    },
    {
      type: 'p',
      text: '`AnimatePresence` bu boşluğu şöyle kapatıyor: çocuklarını izliyor, biri kaldırıldığında DOM\'dan hemen silmiyor, `exit` animasyonu bitene kadar tutuyor. Yani çalışması için iki şart var — kaldırılan eleman onun DOĞRUDAN çocuğu olmalı ve `motion` bileşeni olmalı.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `// ÇALIŞMAZ: düz div, exit prop'u yok
<AnimatePresence>
  <div key={pathname}>{children}</div>
</AnimatePresence>

// ÇALIŞIR (Pages Router'da)
<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>`,
    },
    {
      type: 'p',
      text: '`mode="wait"` da önemli: eski eleman çıkışını bitirmeden yenisi girmiyor. Onsuz iki içerik üst üste biniyor ve sayfa bir an iki katına çıkıyor.',
    },

    { type: 'h2', text: 'App Router\'da Neden Kırılıyor' },
    {
      type: 'p',
      text: 'Yukarıdaki ikinci kodu `app/layout.tsx` içine koydum. Giriş animasyonu bile çalışmadı.',
    },
    {
      type: 'p',
      text: 'Sebep şu: `layout.tsx` rotalar arası geçişte yeniden monte edilmiyor. Next.js layout\'u yerinde tutup sadece `children` içeriğini değiştiriyor. Yani `key={pathname}` değişiyor ama `AnimatePresence` aynı örnek kalıyor ve React ona yeni bir çocuk veriyor — eski çocuğun DOM düğümü zaten gitmiş oluyor.',
    },
    {
      type: 'p',
      text: 'Çözümün yarısı `template.tsx`. Layout\'un aksine template her gezinmede yeniden monte ediliyor. Giriş animasyonu böyle çalışıyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'app/(site)/template.tsx',
      text: `'use client'

import { motion } from 'framer-motion'

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
}`,
    },
    {
      type: 'p',
      text: 'Çıkış tarafı ise çözülmüyor. Template yeniden monte edilirken eskisi zaten sökülmüş oluyor; ortada `exit` oynatacak bir düğüm kalmıyor. İnternette bunun için çeşitli numaralar dolaşıyor — `useSelectedLayoutSegment` ile kendi geçmişini tutmak, `startTransition` ile gezinmeyi geciktirmek gibi. Hepsini denedim.',
    },
    {
      type: 'quote',
      text: 'Hepsi çalışıyor ama hiçbiri bedava değil: gezinmeyi kasten geciktiriyorsun. 280 milisaniyelik bir çıkış animasyonu için her tıklamaya 280 ms ekliyorsun.',
    },
    {
      type: 'p',
      text: 'Sonunda çıkışı tamamen kaldırdım. Tek yönlü, kısa bir giriş kaldı. Ve dürüst olmak gerekirse kimse eksikliğini fark etmedi — hatta site daha hızlı hissettiriyor.',
    },

    { type: 'h2', text: 'Bunun Yerine Nereye Yatırım Yaptım' },
    {
      type: 'p',
      text: 'Sayfa geçişinden vazgeçince enerji, gerçekten fark edilen yerlere kaydı.',
    },

    { type: 'h3', text: 'Paylaşılan Düzen — layoutId' },
    {
      type: 'p',
      text: 'Framer Motion\'ın en değerli özelliği bence bu. İki farklı elemana aynı `layoutId` verdiğinde, biri kaybolup diğeri belirdiğinde arasındaki geçişi kendisi hesaplıyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'components/Header.tsx',
      text: `{active && (
  <motion.span
    layoutId="activeNavPill"
    className="absolute inset-0 rounded-lg border border-indigo-400/30 bg-indigo-500/[0.1]"
    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
  />
)}`,
    },
    {
      type: 'p',
      text: 'Aktif sekmenin arkasındaki hap, sekme değişince yeni yere kayarak gidiyor. Bunu elle yazmak koordinat hesabı, ölçüm ve `ResizeObserver` demek. Burada tek satır.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: '`layoutId` sayfada benzersiz olmalı. Aynı kimliği hem masaüstü hem mobil menüde kullanınca hap ekranın dışına uçuyordu — ikisi de aynı anda DOM\'daydı, Framer Motion hangisine gideceğine karar veremiyordu. Mobil menüde `layoutId` kullanmayı bıraktım.',
    },

    { type: 'h3', text: 'Kartlarda Eğim ve İmleç Işığı' },
    {
      type: 'p',
      text: 'Proje kartları imlece göre hafifçe eğiliyor ve üzerinde imleci takip eden bir ışık var. Burada kritik nokta React state kullanmamak: her `mousemove` olayında `setState` çağırırsan sayfa saniyede 60 kez yeniden render olur.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'components/Projects.tsx',
      text: `function useCardTilt(intensity = 8) {
  const reduced = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const ry = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || reduced) return
    const r = ref.current.getBoundingClientRect()
    // .set() React render'ı tetiklemiyor — değeri doğrudan DOM'a yazıyor.
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * intensity)
    ry.set(((e.clientX - r.left) / r.width - 0.5) * intensity)
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }, [rx, ry, mouseX, mouseY, intensity, reduced])

  // useMotionTemplate ile motion değerlerinden CSS string'i kuruluyor
  const shine = useMotionTemplate\`radial-gradient(400px circle at
    \${useTransform(mouseX, [0, 1], ['0%', '100%'])}
    \${useTransform(mouseY, [0, 1], ['0%', '100%'])},
    rgba(99,102,241,0.12), transparent 70%)\`

  return { rx, ry, shine, onMove }
}`,
    },
    {
      type: 'p',
      text: '`useMotionValue` React state\'i değil. Değiştiğinde bileşen yeniden render olmuyor, Framer Motion değeri doğrudan ilgili DOM özelliğine yazıyor. `useSpring` ile sarınca da hareket sert değil, yaylı oluyor.',
    },
    {
      type: 'p',
      text: 'Bir de sayfada 13 kart var ve her biri bu hook\'u çağırıyor. State kullansaydım tek bir kartın üzerinde gezinmek 13 kartı birden render ederdi.',
    },

    { type: 'h2', text: 'Hareket Azaltma Ayarı' },
    {
      type: 'p',
      text: 'Bu bölümü sona koydum ama aslında en başta yapılması gereken şey. İşletim sisteminde "hareketi azalt" ayarı açık olan kullanıcılar var ve bu tercih genellikle bir sağlık gerekçesiyle açılıyor — vestibüler rahatsızlık, migren, hareket duyarlılığı.',
    },
    {
      type: 'p',
      text: 'İki katmanda hallettim. CSS tarafı sonsuz animasyonları ve geçişleri kesiyor:',
    },
    {
      type: 'code',
      lang: 'css',
      file: 'app/globals.css',
      text: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
    },
    {
      type: 'p',
      text: 'JavaScript tarafında ise `useReducedMotion` hook\'u. Kart eğimi, mıknatıs etkisi ve arka plandaki parçacık alanı bu tercihte hiç çalışmıyor. Dikkat: CSS kuralı Framer Motion\'ın inline `transform` yazımını durdurmuyor, o yüzden ikisi de gerekli.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: '`animation-duration: 0` yerine `0.01ms` yazmanın sebebi şu: bazı animasyonların `animationend` olayına bağlı mantığı oluyor. Süreyi tam sıfır yaparsan olay hiç tetiklenmiyor ve o mantık asılı kalıyor.',
    },

    { type: 'h2', text: 'Süre ve Easing' },
    {
      type: 'p',
      text: 'Sitedeki bütün geçişler tek bir easing eğrisi kullanıyor: `[0.22, 1, 0.36, 1]`. Hızlı başlayıp yumuşak biten bir eğri.',
    },
    {
      type: 'table',
      head: ['Hareket', 'Süre', 'Neden'],
      rows: [
        ['Rota girişi', '320 ms', 'Sayfanın oturduğunu hissettirecek kadar'],
        ['Kart görünüme girmesi', '500 ms', 'Kaydırmayla birlikte akıyor'],
        ['Hover geri bildirimi', '200-300 ms', 'Daha uzunu tembel hissettiriyor'],
        ['Tema değişimi', '250 ms', 'Renk geçişi, konum değil'],
        ['Komut paleti', '180 ms', 'Klavyeyle açılıyor, beklemek istemiyorsun'],
      ],
    },
    {
      type: 'p',
      text: 'En sık yaptığım hata animasyonu uzun tutmaktı. 600 ms yerelde "yumuşak" görünüyor; gerçek kullanımda, aynı hareketi günde yirmi kere gören biri için yavaş. Tasarımcı olarak bir kere izliyorsun, kullanıcı olarak defalarca.',
    },

    { type: 'h2', text: 'Özetle Ne Değişti' },
    {
      type: 'p',
      text: 'Sekmeli yapıdan gerçek rotalara geçmek animasyon açısından kayıp gibi görünüyordu. Kazandıklarım şunlar oldu: paylaşılabilir adresler, çalışan geri tuşu, rota bazlı kod bölme ve arama motorlarının görebildiği sayfalar.',
    },
    {
      type: 'p',
      text: 'Kaybettiğim tek şey yatay kayma geçişiydi. Bugün geriye bakınca, o geçişin var olma sebebinin "yapabiliyor olmam" olduğunu görüyorum. İyi bir gerekçe değilmiş.',
    },
  ],
}

export default post
