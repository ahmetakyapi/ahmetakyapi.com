import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'typescript-ile-daha-iyi-react-bilesenleri',
  tag: 'TypeScript',
  tagColor: '#3178c6',
  title: 'TypeScript ile Daha İyi React Bileşenleri',
  excerpt:
    'React bileşenlerini sadece tip güvenli hale getirmek değil, daha anlaşılır ve daha derli toplu yazmak için işime en çok yarayan TypeScript alışkanlıkları.',
  date: '2024-02-20',
  readTime: '8 dk',
  coverGradient: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
  content: [
    {
      type: 'p',
      text: 'TypeScript’in React tarafındaki asıl güzelliği sadece hata yakalaması değil. Bileşenin ne istediğini açık açık göstermesi. İyi yazılmış tipler, bileşenin yanına konmuş kısa bir açıklama gibi çalışıyor. Özellikle birkaç ay sonra koda geri döndüğünde bunun rahatlığını net hissediyorsun.',
    },
    { type: 'h2', text: 'Props Tanımlarken interface mi, type mı?' },
    {
      type: 'p',
      text: 'Bu konuda tek doğru yok. Ama bileşen propslarında çoğu zaman `interface` bana daha okunur geliyor. Özellikle ekip içinde çalışırken hata mesajlarının daha düzgün görünmesi ve genişletmenin kolay olması günlük kullanımda fark yaratıyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `interface ButtonProps {
  label: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

export function Button({ label, variant = 'primary', size = 'md', ...rest }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size])} {...rest}>{label}</button>
}`,
    },
    { type: 'h2', text: 'children Alanını Bilinçli Yazmak' },
    {
      type: 'p',
      text: 'Birçok projede `PropsWithChildren` otomatik alışkanlık olmuş durumda. Ama children alanını açıkça yazmak, bileşenin gerçekten ne kadar esnek olması gerektiğini düşünmeye zorluyor. Bu da bileşen arayüzünü daha temiz kurmana yardım ediyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `import { ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

interface LabelProps {
  children: string
}`,
    },
    { type: 'h2', text: 'Generic Bileşenler' },
    {
      type: 'p',
      text: 'Aynı yapıyı farklı veri tipleriyle tekrar tekrar kullanacaksan generics ciddi rahatlık sağlıyor. Liste, tablo ya da seçim bileşeni gibi tekrar eden yerlerde hem kod tekrarını azaltıyor hem de tip güvenliğini kaybetmiyorsun.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `interface ListProps<T> {
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
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: '`as const` küçük bir ayrıntı gibi görünür ama özellikle varyant ve boyut gibi sınırlı seçeneklerde işi çok toparlar.',
    },
    { type: 'h2', text: 'Custom Hook Tipleri' },
    {
      type: 'code',
      lang: 'tsx',
      text: `function useLocalStorage<T>(key: string, initial: T) {
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
}`,
    },
    {
      type: 'p',
      text: 'Hook döndürürken tuple yapısını korumak küçük bir ayrıntı gibi görünür ama kullanım tarafını doğrudan etkiler. Yanlış çıkarım olduğunda, hook’u kullanan yerde gereksiz kontrol yazmak zorunda kalıyorsun.',
    },
    { type: 'h2', text: 'Koşullu Props İçin Discriminated Union' },
    {
      type: 'p',
      text: 'Bazı bileşenler tek bir modda yaşamıyor. Bilgi, onay ve hata gibi farklı halleri oluyor. Böyle durumlarda discriminated union yaklaşımı çok temiz çalışıyor. Yanlış prop kombinasyonları daha kodu yazarken önüne düşüyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `type AlertProps =
  | { variant: 'info';    message: string }
  | { variant: 'confirm'; message: string; onConfirm: () => void; onCancel: () => void }
  | { variant: 'error';   message: string; error: Error }`,
    },
  ],
}

export default post
