import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'framer-motion-sayfa-gecis-animasyonlari',
  tag: 'Motion',
  tagColor: '#bb4ade',
  title: 'Framer Motion ile Sayfa Geçiş Animasyonları',
  excerpt:
    'Next.js projelerinde sayfa geçişlerini daha akıcı ve daha özenli hissettirmek için Framer Motion tarafında kullandığım basit ama etkili yöntemler.',
  date: '2024-03-15',
  readTime: '5 dk',
  coverGradient: 'linear-gradient(135deg, #bb4ade 0%, #6366f1 50%, #3b82f6 100%)',
  content: [
    {
      type: 'p',
      text: 'Sayfa geçişleri çoğu zaman tek tek fark edilmez ama hissedilir. İyi ayarlanmış bir geçiş, uygulamaya özenli bir hava verir. Kötü ayarlanmış bir geçiş ise tam tersine her şeyi ağırlaştırıyormuş gibi hissettirebilir.',
    },
    {
      type: 'p',
      text: 'O yüzden mesele daha çok animasyon eklemek değil. Asıl mesele, ekranlar arasında daha yumuşak bir akış kurmak. Framer Motion burada çok işe yarıyor çünkü giriş ve çıkış anlarını ayrı ayrı yönetmek kolaylaşıyor.',
    },
    { type: 'h2', text: 'AnimatePresence Ne İşe Yarıyor?' },
    {
      type: 'p',
      text: 'React bir bileşeni kaldırırken doğal olarak önce çıkış animasyonunu tamamla demez. AnimatePresence tam bu boşluğu kapatıyor. Eski ekranın düzgünce çıkmasına, yenisinin de acele etmeden gelmesine izin veriyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>{children}</div>
    </AnimatePresence>
  )
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: '`mode="wait"` geçişleri sakinleştirir. Eski ve yeni ekran üst üste binmediği için görüntü daha temiz olur.',
    },
    { type: 'h2', text: 'Sayfaya Hareket Eklemek' },
    {
      type: 'p',
      text: 'Bir sayfanın nasıl göründüğü kadar, ekrana nasıl girdiği de önemlidir. Küçük bir kayma ve hafif bir saydamlık geçişi çoğu durumda yeterli oluyor. Fazla efekt yerine kısa ve net animasyonlar daha kaliteli duruyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `const pageVariants = {
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
    />
  )
}`,
    },
    { type: 'h2', text: 'İçeriği Sıralı Getirmek' },
    {
      type: 'p',
      text: 'Bazen bütün sayfanın tek seferde görünmesi yerine öğelerin peş peşe gelmesi daha hoş duruyor. Özellikle başlık, açıklama ve liste gibi parçalar sırayla gelince ekran daha dengeli hissediliyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}`,
    },
    { type: 'h2', text: 'Performans İçin Küçük Notlar' },
    {
      type: 'ul',
      items: [
        'Transform ve opacity tabanlı animasyonlar genelde daha akıcıdır; top, left ya da width ile geçiş kurmak daha maliyetli olabilir.',
        'will-change özelliğini sürekli açık bırakmak yerine gerçekten ihtiyaç olan yerde kullanmak daha doğru.',
        'Mobilde ve erişilebilirlik tarafında reduce-motion tercihini hesaba katmak önemli.',
        'Aynı ekranda çok fazla öğe hareket ediyorsa sadece giriş çıkış değil, yerleşim animasyonlarını da düşünmek gerekir.',
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Framer Motion’ın `layout` özelliği, yer değiştiren öğelerde ekstra CSS geçişi yazmadan daha doğal bir hareket elde etmeyi kolaylaştırıyor.',
    },
  ],
}

export default post
