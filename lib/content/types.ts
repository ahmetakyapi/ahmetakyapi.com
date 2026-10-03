/**
 * /projeler süzgecinin kümeleri. `category` on bir farklı değer taşıyor
 * ("Klinik SaaS", "Günlük Oyun"…); süzgeçte on bir çip okunmaz, üç küme
 * okunur. Adres parametresi (`?kategori=oyun`) bu değerlerle aynı.
 */
export const PROJECT_GROUPS = ['platform', 'oyun', 'arac'] as const
export type ProjectGroup = (typeof PROJECT_GROUPS)[number]

export interface Project {
  id: number
  category: string
  group: ProjectGroup
  /**
   * Ürünün kendisi yalnız koyu temada çalışıyor (karalama, dungeon-mates):
   * ekran görüntüsü tema ile değişmez, detayda künye notu çıkar.
   */
  onlyDark?: boolean
  title: string
  /**
   * Adres kimliği: `/projeler/[slug]` ve ekran görüntüsü klasörü
   * (`public/projects/<slug>/`). Hangi görünümlerin olduğu
   * lib/content/project-shots.ts envanterinde; eski `shot` alanı kalktı. Değişirse eski
   * adres kırılır; next.config.ts'e kalıcı yönlendirme eklenmeli.
   */
  slug: string
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
  /** Bu projeyi anlatan blog yazısının slug'ı. */
  postSlug?: string
  /** Kart üzerinde gösterilen kısa öne çıkan rakamlar. */
  stats?: { value: string; label: string }[]
}

export type Block =
  /** Giriş paragrafı: yazının ilk cümlesi, gövdeden bir punto büyük. */
  | { type: 'lead'; text: string }
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; text: string; file?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }
  /** Vurgulu tek cümle: bölümü kapatan ya da açan cümle. */
  | { type: 'quote'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  /** Rakam ızgarası: büyük değer, altında etiketi. */
  | { type: 'stats'; label?: string; items: { value: string; note: string }[] }
  /** İki hâlin karşılaştırması: öncesi / sonrası. */
  | {
      type: 'compare'
      label?: string
      before: { label: string; value: string }
      after: { label: string; value: string }
      note?: string
    }
  /** Numaralı akış: her adımın kendi başlığı ve açıklaması var. */
  | { type: 'steps'; items: { title: string; text: string }[] }

export interface BlogPost {
  slug: string
  tag: string
  tagColor: string
  title: string
  excerpt: string
  date: string
  coverGradient: string
  /**
   * Yazının anlattığı proje (projects.ts `slug`). Kapak görseli ve "ilgili
   * proje" bağlantısı buradan çözülür. Boşsa eski eşleşme geçerli: projenin
   * `postSlug` alanı. Bir projenin birden çok yazısı olabildiği için gerekli;
   * `postSlug` tek yazı taşıyor ve vaka sayfasının ilgili yazısı o kalıyor.
   */
  project?: string
  content: Block[]
}

export interface TechStackItem {
  name: string
  tagline: string
}
