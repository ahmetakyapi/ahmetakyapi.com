import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'typescript-ile-daha-iyi-react-bilesenleri',
  tag: 'TypeScript',
  tagColor: '#3178c6',
  title: 'Bu Blogun İçerik Motoru: Bir Union Tipi Nasıl Tasarım Kararına Dönüşür',
  excerpt:
    'Şu an okuduğunuz yazı bir dizi. Her blok bir union üyesi ve renderer eksik bir durumu unutursa TypeScript derlemeyi durduruyor. Bu yapının nasıl kurulduğu ve nerede yanlış yaptığım.',
  date: '2026-02-20',
  coverGradient: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bu blogun markdown\'ı yok. Yazılar TypeScript dosyası ve içerik bir `Block[]` dizisi. Kulağa fazladan iş gibi geliyor; pratikte tam tersi oldu — yeni bir blok tipi eklediğimde onu render etmeyi unutmam mümkün değil, çünkü derleme kırılıyor.',
    },
    {
      type: 'p',
      text: 'Bu yazıda TypeScript\'in React tarafında gerçekten fark yaratan üç aracını, bu sitenin kendi kodundan örneklerle anlatacağım: discriminated union, `as const` ve tam kapsama kontrolü.',
    },

    { type: 'h2', text: 'Discriminated Union: Ortak Alan Ayrıştırıcıdır' },
    {
      type: 'p',
      text: 'Bir yazının içeriğini nasıl temsil edersiniz? İlk düşünülen şey tek bir esnek nesne:',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// KÖTÜ: her alan opsiyonel, hiçbiri garanti değil
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
      text: 'Bu tip hiçbir şey söylemiyor. `type: "table"` olan bir bloğun `rows` alanı olduğunu bilmiyorsunuz, renderer içinde her yerde `block.rows ?? []` yazmanız gerekiyor ve `type: "p"` olan bir bloğa yanlışlıkla `rows` verdiğinizde kimse itiraz etmiyor.',
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
  | { type: 'code';    lang: string; text: string; file?: string }
  | { type: 'ul';      items: string[] }
  | { type: 'quote';   text: string }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }
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
      text: 'Şimdi `switch (block.type)` içinde TypeScript her dalda tipi daraltıyor. `case "table"` bloğunda `block.rows` doğrudan `string[][]`; opsiyonel değil, kontrol gerekmiyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'app/blog/[slug]/BlogPostClient.tsx',
      text: `function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'table':
      // block.head ve block.rows burada garantili
      return (
        <table>
          <thead>
            <tr>{block.head.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )

    case 'compare':
      // block.before / block.after garantili, block.note opsiyonel
      return <CompareCard {...block} />
  }
}`,
    },

    { type: 'h3', text: 'Kapsama Kontrolü: Unuttuğunuzu Derleyici Söylesin' },
    {
      type: 'p',
      text: 'Union\'ın asıl faydası burada ortaya çıkıyor. Yeni bir blok tipi eklediğimde renderer\'ı güncellemeyi unutursam, blok sessizce hiç çizilmiyor. Bunu bir kere yaşadım: `steps` tipini ekledim, yazıya koydum, sayfada hiçbir şey görünmedi ve on dakika neden diye baktım.',
    },
    {
      type: 'p',
      text: 'Çözüm `never` ile bir kapsama kontrolü:',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `function assertNever(value: never): never {
  throw new Error(\`Bilinmeyen blok: \${JSON.stringify(value)}\`)
}

switch (block.type) {
  case 'p':      return <P {...block} />
  case 'table':  return <Table {...block} />
  // ... diğer durumlar
  default:
    // Bütün durumlar ele alındıysa block burada 'never' tipindedir.
    // Bir tip eklenip case yazılmazsa bu satır DERLEME HATASI verir.
    return assertNever(block)
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bu desenin değeri, hatayı zamanda öne çekmesi. `default: return null` yazarsanız eksik durum çalışma zamanında sessizce kaybolur; `assertNever` ile aynı eksiklik derleme anında, dosyayı kaydettiğiniz saniye ortaya çıkar.',
    },

    { type: 'h2', text: 'as const: Veriyi Tipe Çevirmek' },
    {
      type: 'p',
      text: '`as const` küçük bir ek ama iki iş birden yapıyor: değerleri okunur kılıyor ve literal tipleri koruyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/nav.ts',
      text: `export const NAV_ITEMS = [
  { href: '/',         label: 'Ana Sayfa', icon: '⌂', shortcut: 'G H' },
  { href: '/projeler', label: 'Projeler',  icon: '◈', shortcut: 'G P' },
  { href: '/blog',     label: 'Blog',      icon: '✦', shortcut: 'G B' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]`,
    },
    {
      type: 'p',
      text: '`as const` olmadan `href` alanının tipi `string` olurdu. Onunla birlikte `"/" | "/projeler" | "/blog"`. Yani bir yere `/projelerr` yazdığımda TypeScript itiraz ediyor.',
    },
    {
      type: 'p',
      text: 'İkinci satır da önemli: tipi elle yazmıyorum, veriden türetiyorum. Listeye yeni bir öğe eklediğimde tip kendiliğinden genişliyor. Bu "tek doğruluk kaynağı" fikrinin tip seviyesindeki karşılığı.',
    },

    { type: 'h3', text: 'Aynı Fikrin Bir Adım Ötesi' },
    {
      type: 'p',
      text: 'Proje kartlarındaki mini önizlemeler bir zamanlar sıraya bağlıydı: `i === 0` ise not listesi, `i === 1` ise grafik. Proje sırasını değiştirince yanlış maket yanlış kartta çizildi.',
    },
    {
      type: 'p',
      text: 'Düzeltme, görseli veriye bağlamak oldu:',
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
  /** Bu projeyi anlatan yazının slug'ı — kart ile blog birbirine bağlanıyor. */
  postSlug?: string
  stats?: { value: string; label: string }[]
}`,
    },
    {
      type: 'p',
      text: 'Artık `ProjectPreview` union\'ına yeni bir değer eklediğimde, önizleme bileşenindeki `switch` onu ele almazsa yine derleme kırılıyor. Aynı desen, farklı yer.',
    },

    { type: 'h2', text: 'Bir Hook\'ta Yaptığım Gerçek Hata' },
    {
      type: 'p',
      text: 'Şimdi tipin kurtaramadığı bir hataya geleyim, çünkü TypeScript her şeyi çözmüyor.',
    },
    {
      type: 'p',
      text: 'Üç projede kullandığım bir `useLocalStorage` hook\'um vardı. Üçüne de aynı bug\'ı taşıdım:',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// HATALI SÜRÜM
const set = (v: T | ((prev: T) => T)) => {
  setValue(v)
  localStorage.setItem(
    key,
    // 'value' closure'dan geliyor — bu render'daki eski değer.
    JSON.stringify(typeof v === 'function' ? (v as (p: T) => T)(value) : v),
  )
}`,
    },
    {
      type: 'p',
      text: 'Belirti şuydu: sepet sayacında `set(n => n + 1)` iki kere üst üste çağrılınca ekranda 2 görünüyor, sayfayı yenileyince 1 görünüyordu. React state\'i doğru güncelliyor çünkü fonksiyonel güncellemeyi kuyruğa alıyor; ama `localStorage`\'a yazarken `value` hâlâ o render\'daki eski değer.',
    },
    {
      type: 'p',
      text: 'Tip sistemi bunu yakalayamaz — tipler doğru, mantık yanlış. Doğrusu, yazmayı state güncelleyicinin içine taşımak:',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `const set = useCallback((v: T | ((prev: T) => T)) => {
  setValue((prev) => {
    const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
    // 'prev' React'in kuyruğundaki güncel değer; closure'dan gelmiyor.
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(next))
    }
    return next
  })
}, [key])`,
    },
    {
      type: 'p',
      text: '`typeof window !== "undefined"` kontrolü de eksikti — sadece okuma tarafında vardı. Sunucuda çağrıldığında patlıyordu.',
    },
    {
      type: 'quote',
      text: 'TypeScript şekli doğrular, davranışı değil. Bir hook\'un tipleri kusursuzken içindeki closure\'ın yanlış anı yakalaması gayet mümkün.',
    },

    { type: 'h2', text: 'type mı interface mi' },
    {
      type: 'p',
      text: 'Bu tartışmada kesin bir kural yok ama benim kullandığım ayrım şu:',
    },
    {
      type: 'table',
      head: ['Durum', 'Seçim', 'Neden'],
      rows: [
        ['Union / kesişim', 'type', 'interface union yazamaz'],
        ['Bir değerden türetme', 'type', '`typeof X[number]` sadece type ile'],
        ['Genişletilecek nesne', 'interface', 'declaration merging gerekiyorsa'],
        ['Bileşen props', 'ikisi de olur', 'Tutarlı olun, karıştırmayın'],
      ],
    },
    {
      type: 'p',
      text: 'Bu sitede `Block` ve `ProjectPreview` union oldukları için `type`, `Project` ve `BlogPost` düz nesne oldukları için `interface`. Kural değil, alışkanlık — ama proje içinde tutarlı.',
    },

    { type: 'h2', text: 'Ne Zaman Aşırıya Kaçtım' },
    {
      type: 'p',
      text: 'Bir dönem her şeyi generic yazmaya çalıştım. Bir liste bileşenini üç tip parametresiyle yazdım ve altı ay sonra kendi yazdığım hata mesajını okuyamadım.',
    },
    {
      type: 'p',
      text: 'Öğrendiğim eşik şu: generic, aynı yapıyı **üç farklı tiple** kullanacaksan değer. İki kullanım varsa iki ayrı bileşen yazmak daha okunur oluyor.',
    },
    {
      type: 'p',
      text: 'İkinci eşik: bir tipi anlamak için üç dosya açmak gerekiyorsa, o tip fazla soyutlanmış demektir. `Block` union\'ı uzun bir tip ama tek dosyada ve okunduğunda ne olduğu anlaşılıyor. Değeri buradan geliyor.',
    },
  ],
}

export default post
