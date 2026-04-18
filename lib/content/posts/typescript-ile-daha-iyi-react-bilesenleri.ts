import type { BlogPost } from '../types'

export const post: BlogPost = {
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
  }

export default post
