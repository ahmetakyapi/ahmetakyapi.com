import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'typescript-ile-daha-iyi-react-bilesenleri',
  tag: 'TypeScript',
  tagColor: '#3178c6',
  title: "ahmetakyapi.com: İçeriği Tek Bir Union Tipi Ayakta Tutuyor",
  excerpt:
    'Bu blogun markdown\'ı yok; her yazı bir blok dizisi. Renderer bir blok tipini unutursa derleme duruyor. Bu düzeni nasıl kurduğumu ve nerede yetmediğini yazdım.',
  date: '2026-02-20',
  coverGradient: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bu blogun markdown\'ı yok. Her yazı bir TypeScript dosyası ve içerik bir `Block[]` dizisi. Kulağa fazladan iş gibi geliyor. Pratikte tersi oldu: bir gün blok tiplerinin sayısını tek seferde altıdan on üçe çıkardım ve hiçbirini çizmeyi unutmam mümkün değildi, çünkü unutsam derleme kırılırdı.',
    },

    { type: 'h2', text: 'Discriminated Union: Ortak Alan Ayrıştırıcıdır' },
    {
      type: 'p',
      text: 'Bir yazının içeriğini temsil etmenin ilk akla gelen yolu tek bir esnek nesne:',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// Her alan isteğe bağlı, hiçbiri garanti değil
interface Block {
  type: string
  text?: string
  items?: string[]
  head?: string[]
  rows?: string[][]
  lang?: string
}`,
    },
    {
      type: 'p',
      text: 'Bu tip hiçbir şey söylemiyor. `type: "table"` olan bir bloğun `rows` alanı olduğunu bilmiyorsun, renderer\'ın her yerinde `block.rows ?? []` yazmak gerekiyor ve `type: "p"` olan bir bloğa yanlışlıkla `rows` verdiğinde kimse itiraz etmiyor.',
    },
    {
      type: 'p',
      text: 'Discriminated union bunu tersine çeviriyor. Her varyantın kendi şekli var ve `type` alanı hangisi olduğunu söylüyor:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/content/types.ts',
      text: `export type Block =
  | { type: 'lead';    text: string }
  | { type: 'p';       text: string }
  | { type: 'h2';      text: string }
  | { type: 'h3';      text: string }
  | { type: 'code';    lang: string; text: string; file?: string }
  | { type: 'ul';      items: string[] }
  | { type: 'ol';      items: string[] }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }
  | { type: 'quote';   text: string }
  | { type: 'table';   head: string[]; rows: string[][] }
  | { type: 'stats';   label?: string; items: { value: string; note: string }[] }
  | {
      type: 'compare'
      label?: string
      before: { label: string; value: string }
      after: { label: string; value: string }
      note?: string
    }
  | { type: 'steps';   items: { title: string; text: string }[] }`,
    },
    {
      type: 'p',
      text: '`switch (block.type)` içinde TypeScript her dalda tipi daraltıyor. `case "table"` dalında `block.rows` doğrudan `string[][]`: isteğe bağlı değil, kontrol gerekmiyor.',
    },

    { type: 'h3', text: 'Kapsama Kontrolü: Unuttuğunu Derleyici Söylesin' },
    {
      type: 'p',
      text: 'Union\'ın asıl faydası burada çıkıyor. Bu sitede blok tipi uzun süre altı taneydi: `p`, `h2`, `h3`, `code`, `ul`, `callout`. Renderer\'daki `switch` de `default: return null` ile bitiyordu. Sonra tek bir değişiklikte yedi tip ekledim: `lead`, `ol`, `quote`, `table`, `stats`, `compare`, `steps`. O `default` dalı kalsaydı, yedisinden birini çizmeyi unuttuğum an blok sayfadan sessizce kaybolurdu. Ne derleyici konuşurdu ne tarayıcı.',
    },
    {
      type: 'p',
      text: 'Aynı değişiklikte `default` dalını `never` ile bir kapsama kontrolüne çevirdim:',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'BlogPostClient.tsx',
      text: `function assertNever(value: never): never {
  throw new Error(\`Bilinmeyen blok: \${JSON.stringify(value)}\`)
}

switch (block.type) {
  case 'p':      /* ... */
  case 'table':  /* ... */
  // ... diğer on bir durum
  default:
    /* Yeni bir Block tipi eklenip burada ele alınmazsa TypeScript bu
       satırda hata verir; blok sessizce çizilmeden kaybolmasın. */
    return assertNever(block)
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bu desenin değeri hatayı zamanda öne çekmesi. `default: return null` ile eksik durum çalışma zamanında sessizce kaybolur; `assertNever` ile aynı eksiklik derleme anında, dosyayı kaydettiğin saniye ortaya çıkar.',
    },

    { type: 'h2', text: 'as const: Veriyi Tipe Çevirmek' },
    {
      type: 'p',
      text: '`as const` küçük bir ek ama iki iş birden yapıyor: değerleri salt okunur kılıyor ve literal tipleri koruyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/nav.ts',
      text: `export const NAV_ITEMS = [
  { href: '/', label: 'Ana Sayfa', icon: '⌂', shortcut: 'G H' },
  { href: '/projeler', label: 'Projeler', icon: '◈', shortcut: 'G P' },
  { href: '/blog', label: 'Blog', icon: '✦', shortcut: 'G B' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]`,
    },
    {
      type: 'p',
      text: '`as const` olmadan `href` alanının tipi `string` olurdu. Onunla birlikte `"/" | "/projeler" | "/blog"`. İkinci satır da önemli: tipi elle yazmıyorum, veriden türetiyorum. Başlık, komut paleti, 404 önerileri ve site haritası aynı listeyi okuyor; listeye bir öğe eklediğimde tip de dört yer de kendiliğinden genişliyor.',
    },

    { type: 'h2', text: 'Union\'ın Yakalayamadığı Şey' },
    {
      type: 'p',
      text: 'Proje kartlarındaki küçük önizleme çizimleri bir dönem sıraya bağlıydı: `i === 0` ise not listesi, `i === 1` ise çubuk grafik. Proje sırasını değiştirdiğim gün DigyNotes\'un maketi Mimio\'nun kartında çizildi.',
    },
    {
      type: 'p',
      text: 'Düzeltme görseli veriye bağlamaktı. Her proje kendi önizlemesini bir union üyesiyle söylüyordu ve önizleme bileşeni o alana göre `switch` yapıyordu:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/content/types.ts',
      text: `export type ProjectPreview =
  | 'ticker' | 'notes' | 'chart' | 'grid' | 'board' | 'browser'

export interface Project {
  title: string
  preview?: ProjectPreview
  /** Bu projeyi anlatan blog yazısının slug'ı. */
  postSlug?: string
}`,
    },
    {
      type: 'p',
      text: 'Aynı gün maketleri tümden kaldırıp yerlerine projelerin gerçek ekran görüntülerini koydum. Soyut çubuklar ve boş kutular projeyi anlatmıyordu. Ama `preview` alanı tipte kaldı, her proje onu doldurmaya devam etti ve hiçbir bileşen okumadı. Derleyici bunu hiç söylemedi.',
    },
    {
      type: 'quote',
      text: 'Kapsama kontrolü yalnızca bir switch\'in olduğu yerde çalışır. Kimsenin okumadığı bir alan, tip sistemine göre kusursuz bir alandır.',
    },
    {
      type: 'p',
      text: 'Benzer bir şeyi `readTime` alanında da yaşadım. Okuma süresi elle yazılıyordu ve tutmuyordu: 287 kelimelik bir yazıda "11 dk" yazıyordu. Tip `string` istiyordu ve "11 dk" geçerli bir `string`. Alanı içerikten hesaplanan bir değere çevirdim. Tip bir alanın şeklini doğrular, doğru olup olmadığını değil.',
    },

    { type: 'h2', text: 'type mı, interface mi' },
    {
      type: 'p',
      text: 'Bu sitede kural basit: union olan her şey `type` (`Block` gibi), düz nesne olanlar `interface` (`Project`, `BlogPost`). Union\'ı `interface` ile yazamıyorsun; bir değerden tip türetmek de (`typeof NAV_ITEMS[number]`) ancak `type` ile oluyor. Geri kalanı alışkanlık, ama proje içinde tutarlı.',
    },

    { type: 'h2', text: 'Nerede Duruyorum' },
    {
      type: 'p',
      text: '`Block` union\'ı uzun bir tip ama tek dosyada duruyor ve okunduğunda ne olduğu anlaşılıyor. Değerini buradan alıyor: yeni bir blok tipi eklemek, derleyicinin bana gösterdiği yerleri doldurmaktan ibaret.',
    },
    {
      type: 'p',
      text: 'Yetmediği yer de belli. Union bir şeyi unuttuğumu söylüyor, kullanmayı bıraktığım bir şeyi söylemiyor. Ölü alanları yakalamanın tip sistemi içinde temiz bir yolunu henüz bulmadım; şimdilik `grep` ve dikkat.',
    },
  ],
}

export default post
