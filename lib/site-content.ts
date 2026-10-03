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
  /** Hero cümlesi: tek cümle, en fazla 16 kelime (ilk ekrana sığmalı). */
  intro: string
  /** İsmin altındaki unvan satırı. */
  role: string
  /** Seçili İşler: sırası ekranda da geçerli, proje başına tek cümle. */
  selectedWork: readonly { slug: string; summary: string }[]
  /** Hakkımda: sahibinin kendi metni. Son paragraf ekran dışı hayat. */
  about: { title: string; paragraphs: readonly string[] }
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
  /* Hero bir dönem dört kutulu bir künye ızgarası taşıyordu (Ne Yapıyorum,
     Şu An, Tech Stack, Bağlantı). Telefonda ilk ekranın tamamını o
     kaplıyordu ve isim ancak altında başlıyordu; "Şu an X'i geliştiriyorum"
     gibi zamanla eskiyen bir satır da kimliğin önüne geçiyordu. Künye
     kalktı, alanları da (`now`, `stack`): bağlantılar kapanışta ve alt
     bilgide, tech stack kendi marquee'sinde. Hero yalnız isim, unvan, bu
     cümle ve iki düğme. */
  intro: 'Web ürünlerini fikirden yayına kendim götürüyorum. İşimin büyük kısmını yapay zekâ ajanlarıyla yapıyorum.',
  /* Unvan her yerde birebir bu yazımla (lib/nav.ts → JOB_TITLE): tireli
     "Full-Stack", iki parçası da büyük; tiresiz "Fullstack" yok. Yapay zekâ
     kısmı gerçek işe dayanıyor: Açılış Zili'nde Claude API ile haber
     çevirisi ve analiz, dev-starter'da agentic arayüz (AG-UI) şablonu. */
  role: JOB_TITLE,
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
        'One Piece evrenini Türkçe içerikle düzenleyen fan wikisi. Hangi arkta olduğunu seçiyorsun, sonrasındaki bilgiler gizli kalıyor.',
    },
  ],
  /* Sahibinin kendi metni, kelimesine dokunulmaz (Ekim 2026). Yalnız ürün
     adı yazımı ürünle tutarlı: "Dungeon Mates". Önce yerinde "Nasıl
     Çalışırım" vardı ve çalışma ilkelerini anlatıyordu (ölçmek, bayat
     veri, klavye odağı); okuyan kişi kim olduğumu öğrenmeden ilkeleri
     okuyordu. İkinci kısım (iş deneyimi ve kendi ürünlerim) okunabilirlik
     için iki paragraf; metin aynı. */
  about: {
    title: 'Merhaba, ben Ahmet.',
    paragraphs: [
      'Web ürünleri geliştiriyorum. Bir fikri alıp tasarımından veritabanına, oradan da yayına kadar kendim götürmeyi seviyorum. Bana göre iyi bir ürün sessizdir. Hızlı açılır, rahat okunur, kullanana ne yapacağını söyler ve doğru bilgi verir. Benim peşinde olduğum şey de bu sessizlik.',
      "Nar Sistem Teknoloji'de enerji sektörüne yönelik iki projede görev aldım. Thor, iş emirlerinin, faturaların ve tahakkukların oluşturulup takip edildiği bir sistem. Lena ise akıllı sayaçlardan gelen veriyi toplayıp yöneten bir platform.",
      "Kendi tarafımda da birkaç ürün geliştirdim. Açılış Zili, ABD borsalarını Türkçe takip eden bir site. Derinay, bir psikoloğun danışanlarını takip ettiği bir panel. Bir de Ramazan Vakitleri ve arkadaşlarımla oynamak için yaptığım çok oyunculu oyun Dungeon Mates var. Bunları çoğunlukla Next.js, TypeScript ve PostgreSQL ile yapıyorum.",
      "İşin büyük kısmını artık yapay zekâ ajanlarıyla birlikte yürütüyorum. Araştırma, tasarım kontrolü, test ve metin düzeltme gibi işleri kendi kurduğum ajanlara bırakıyorum. Neyin yapılacağına ve neyin yayına çıkacağına ise ben karar veriyorum. Açılış Zili'ndeki bültenleri ve bilanço analizlerini de her gün bu ajanlar yazıyor.",
      'Ekran dışında saatlere meraklıyım. Bir kadranın neden kolay okunduğunu düşünmek, bir ekranın neden kolay okunduğunu düşünmekten pek farklı değil. Oyun oynamayı severim, Fenerbahçeliyim. Gezmeyi, yeni yerler görmeyi ve o gezileri önceden en ince ayrıntısına kadar planlamayı severim. İyi bir yemek için yol yapmaya da her zaman varım.',
    ],
  },
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
