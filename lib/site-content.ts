import { blogPosts as defaultBlogPosts, projects as defaultProjects } from '@/lib/data'
import type { BlogPost, Project } from '@/lib/data'
import { JOB_TITLE } from '@/lib/nav'

/**
 * Ana sayfanın metni. Tek kaynak burası; bileşenler metin yazmaz.
 *
 * Eski giriş ("Fullstack Developer", "Angular, React ve TypeScript ile…")
 * hem eskimişti hem de site metadata'sıyla çelişiyordu: başlıkta
 * başka bir unvan yazarken ana sayfa başka bir
 * kimlik anlatıyordu. Son işlerin tamamı Next.js + TypeScript + Postgres;
 * metin ona göre. Uydurma rakam, müşteri ya da ödül yok: buradaki her
 * cümle depodaki bir projeyle doğrulanabilir.
 */
export type HomeContent = {
  firstName: string
  lastName: string
  /** Hero cümlesi: en fazla 20 kelime. */
  intro: string
  role: string
  /** "Şu An" künyesi: gerçek, canlı bir iş. */
  now: { label: string; href: string; host: string }
  stack: readonly string[]
  /** Seçili İşler: sırası ekranda da geçerli, proje başına tek cümle. */
  selectedWork: readonly { slug: string; summary: string }[]
  /** Nasıl Çalışırım: tek paragraf, kaydırdıkça kelime kelime aydınlanır. */
  approach: string
  closing: { title: string; text: string }
}

export type SiteContent = {
  home: HomeContent
  projects: Project[]
  blogPosts: BlogPost[]
}

export const defaultHomeContent: HomeContent = {
  firstName: 'Ahmet',
  lastName: 'Akyapı',
  intro:
    'Arayüzden veritabanına, yapay zekâ katmanına kadar uçtan uca web ürünleri kuruyorum. Hız, okunabilirlik ve doğru veri benim için tasarımın parçası.',
  /* Unvan her yerde birebir bu yazımla (lib/nav.ts → JOB_TITLE): tireli
     "Full-Stack", iki parçası da büyük; tiresiz "Fullstack" yok. Yapay zekâ
     kısmı gerçek işe dayanıyor: Açılış Zili'nde Claude API ile haber
     çevirisi ve analiz, dev-starter'da agentic arayüz (AG-UI) şablonu. */
  role: JOB_TITLE,
  now: { label: 'Açılış Zili', href: 'https://aciliszili.com', host: 'aciliszili.com' },
  stack: ['Next.js', 'TypeScript', 'Postgres', 'Claude API'],
  selectedWork: [
    {
      slug: 'acilis-zili',
      summary:
        'ABD piyasasını Türkçe takip etmek için kurduğum site: bilanço takvimi, analizler, makro göstergeler ve günlük bülten aynı yerde.',
    },
    {
      slug: 'mimio',
      summary:
        'Ergoterapistlerin danışan takibini, seans planını ve terapi oyunlarını tek panelde yönettiği klinik platform.',
    },
    {
      slug: 'onepiece-hub',
      summary:
        'One Piece evrenini Türkçe içerikle düzenleyen fan wikisi. Hangi arkta olduğunu söylüyorsun, sonrası bulanık kalıyor.',
    },
  ],
  approach:
    'Bir boşluk fazla duruyorsa önce ölçerim, sonra değiştiririm ve ölçümü koda not düşerim. Kaynak dakikayı vermiyorsa saati uydurmam, bayat veriyi büyük puntoyla göstermem. Klavyeyle gezen okuyucu odağın nerede olduğunu her an görür; hareketi kapatan okuyucu hiçbir içeriği kaçırmaz.',
  closing: {
    title: 'Birlikte Çalışalım',
    text: 'Bir ürün fikri, yarım kalmış bir arayüz ya da yalnızca bir soru. En kısa yol e-posta.',
  },
}

export const defaultSiteContent: SiteContent = {
  home: defaultHomeContent,
  projects: defaultProjects,
  blogPosts: defaultBlogPosts,
}

/**
 * Sitenin bütün içeriği, saf TypeScript'ten.
 *
 * Eskiden `data/site-content.json` okunuyor ve yönetim paneli oraya
 * yazıyordu; Vercel'in dosya sistemi salt okunur olduğu için üretimde o
 * yol hiç çalışmadı (EROFS) ve içerik zaten bu dosyadan geliyordu. Panel
 * kaldırıldı, tek kaynak kaldı; fonksiyon artık eşzamanlı.
 */
export function getSiteContent(): SiteContent {
  return defaultSiteContent
}

export { getOrderedProjects } from './project-order'
