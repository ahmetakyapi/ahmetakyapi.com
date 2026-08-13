/**
 * Kart içindeki mini önizleme çizimi.
 * Sıralamaya göre değil, projenin kendisine göre seçilir — liste değişince
 * yanlış maket gösterilmesin.
 */
export type ProjectPreview =
  | 'ticker'
  | 'notes'
  | 'chart'
  | 'grid'
  | 'board'
  | 'browser'

export interface Project {
  id: number
  category: string
  title: string
  description: string
  /** Kartın altına düşen tek satırlık teknik detay. */
  detail?: string
  tags: string[]
  link: string
  github?: string
  accent: string
  gradient: string
  badge: 'Canlı' | 'GitHub'
  featured: boolean
  preview?: ProjectPreview
  /** Bu projeyi anlatan blog yazısının slug'ı. */
  postSlug?: string
  /** Kart üzerinde gösterilen kısa öne çıkan rakamlar. */
  stats?: { value: string; label: string }[]
}

export type Block =
  /** Giriş paragrafı — yazının ilk cümlesi, gövdeden bir punto büyük. */
  | { type: 'lead'; text: string }
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; text: string; file?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }
  /** Vurgulu tek cümle — bölümü kapatan ya da açan cümle. */
  | { type: 'quote'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  /** Rakam ızgarası — büyük değer, altında etiketi. */
  | { type: 'stats'; label?: string; items: { value: string; note: string }[] }
  /** İki hâlin karşılaştırması — öncesi / sonrası. */
  | {
      type: 'compare'
      label?: string
      before: { label: string; value: string }
      after: { label: string; value: string }
      note?: string
    }
  /** Numaralı akış — her adımın kendi başlığı ve açıklaması var. */
  | { type: 'steps'; items: { title: string; text: string }[] }

export interface BlogPost {
  slug: string
  tag: string
  tagColor: string
  title: string
  excerpt: string
  date: string
  /** Artık elle yazılmıyor — lib/reading-time.ts içerikten hesaplıyor. */
  readTime?: string
  coverGradient: string
  content: Block[]
}

export interface TechStackItem {
  name: string
  tagline: string
  color: string
  bg: string
  border: string
}
