import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'typescript-ile-daha-iyi-react-bilesenleri',
  tag: 'TypeScript',
  tagColor: '#3178c6',
  title: 'ahmetakyapi.com: Yazılar Neden Markdown Değil',
  excerpt:
    'Bu blogdaki her yazı bir TypeScript dosyası ve içerik bir blok dizisi. Bunun nasıl çalıştığını, bana neler kazandırdığını ve tip sisteminin nerede yetmediğini anlatıyorum.',
  date: '2026-08-14',
  coverGradient: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bu blogda Markdown yok. Şu an okuduğun yazı bir TypeScript dosyası ve içeriği bir dizi: paragraf, başlık, kod, tablo, karşılaştırma kutusu, adım adım akış. Kulağa fazladan iş gibi geliyor ve ilk bakışta öyle. Ama bir blok türünü çizmeyi unutmam mümkün değil, çünkü unutsam site derlenmiyor.',
    },
    {
      type: 'p',
      text: 'Bu yazıda sitenin içerik düzeninin nasıl çalıştığını, bunu neden seçtiğimi ve tip sisteminin hangi hatayı yakalayıp hangisini yakalamadığını anlatacağım.',
    },

    { type: 'h2', text: 'Bir Yazı Nasıl Duruyor' },
    {
      type: 'p',
      text: 'Her yazının dosyasında önce künye var: adres, etiket, başlık, özet, tarih ve yazının anlattığı proje. Sonra içerik geliyor; her öğe türünü söyleyen bir nesne. Sayfa bu diziyi sırayla gezip her bloğu kendi bileşeniyle çiziyor. İçindekiler tablosu başlıklardan, okuma süresi kelime sayısından, paylaşım kartı da başlık ve özetten aynı dosya okunarak üretiliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `{
  type: 'compare',
  label: 'İlk Yükleme',
  before: { label: 'framer-motion ile', value: '181 KB' },
  after: { label: 'CSS ile', value: '104 KB' },
}`,
    },
    {
      type: 'p',
      text: 'Markdown yerine bunu seçmemin sebebi, yazıların içinde düz metinden fazlası olması. Karşılaştırma kutusu, rakam ızgarası, adım listesi gibi parçaları Markdown ile yazmak için ya özel bir sözdizimi uydurmam ya da HTML gömmem gerekiyordu. İkisi de tasarımı yazının içine sızdırıyor. Blok dizisinde yazı ne olduğunu söylüyor, nasıl görüneceğine site karar veriyor.',
    },

    { type: 'h2', text: 'Tipi Ortak Alan Söylüyor' },
    {
      type: 'p',
      text: 'Bir yazının içeriğini tutmanın ilk akla gelen yolu tek, esnek bir nesne: her alan isteğe bağlı, hiçbiri garanti değil.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `interface Block {
  type: string
  text?: string
  items?: string[]
  head?: string[]
  rows?: string[][]
}`,
    },
    {
      type: 'p',
      text: 'Bu tip hiçbir şey söylemiyor. Tablo bloğunun satırları olduğunu bilmiyorsun, çizen kodun her yerinde "yoksa boş dizi" yazman gerekiyor ve bir paragrafa yanlışlıkla satır verirsen kimse itiraz etmiyor. Ayrımlı birleşim (discriminated union) bunu tersine çeviriyor: her türün kendi şekli var ve hangisi olduğunu tek bir alan söylüyor.',
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
  | { type: 'table';   head: string[]; rows: string[][] }
  | { type: 'stats';   label?: string; items: { value: string; note: string }[] }
  | { type: 'compare'; before: { label: string; value: string }; after: { label: string; value: string } }
  | { type: 'steps';   items: { title: string; text: string }[] }
  // ... callout, quote, ol, h3`,
    },
    {
      type: 'p',
      text: 'Çizen koddaki `switch` içinde TypeScript her dalda tipi daraltıyor. Tablo dalında satırlar doğrudan oradadır; isteğe bağlı değil, kontrol etmene gerek yok.',
    },

    { type: 'h3', text: 'Unuttuğunu Derleyici Söylesin' },
    {
      type: 'p',
      text: 'Birleşimin asıl işe yaradığı yer burası. Bu sitede blok türü uzun süre altı taneydi ve çizen koddaki `switch` "bilinmeyen tür gelirse hiçbir şey çizme" diye bitiyordu. Sonra tek değişiklikte yedi tür ekledim. O satır kalsaydı, yedisinden birini çizmeyi unuttuğum an blok sayfadan sessizce kaybolurdu. Ne derleyici bir şey derdi ne tarayıcı.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'components/blog/PostBody.tsx',
      text: `function assertNever(value: never): never {
  throw new Error(\`Bilinmeyen blok: \${JSON.stringify(value)}\`)
}

switch (block.type) {
  case 'p':      /* ... */
  case 'table':  /* ... */
  // ... diğer durumlar
  default:
    /* Yeni bir Block türü eklenip burada ele alınmazsa TypeScript
       bu satırda hata verir; blok sessizce kaybolmasın. */
    return assertNever(block)
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bu desen hatayı öne çekiyor. Eksik dal önceden çalışırken sessizce kaybolurdu; şimdi aynı eksik, dosyayı kaydettiğim anda editörde kırmızı çizgi olarak çıkıyor.',
    },

    { type: 'h2', text: 'Veriyi Tipe Çevirmek' },
    {
      type: 'p',
      text: 'Aynı yaklaşımı sitenin gezinme listesinde de kullanıyorum. Küçük bir ek olan `as const`, değerleri salt okunur yapıyor ve harfi harfine tiplerini koruyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/nav.ts',
      text: `export const NAV_ITEMS = [
  { href: '/', label: 'Ana Sayfa', shortcut: 'G H' },
  { href: '/projeler', label: 'Projeler', shortcut: 'G P' },
  { href: '/blog', label: 'Blog', shortcut: 'G B' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]`,
    },
    {
      type: 'p',
      text: 'Bu olmadan adres alanının tipi düz bir metin olurdu; onunla birlikte yalnızca bu üç adresten biri. Tipi elle yazmıyorum, veriden türetiyorum. Üst menü, komut paleti, 404 sayfasındaki öneriler ve site haritası aynı listeyi okuyor; listeye bir öğe eklediğimde hem tip hem bu dört yer kendiliğinden güncelleniyor.',
    },

    { type: 'h2', text: 'Tip Sisteminin Yakalayamadığı Şey' },
    {
      type: 'p',
      text: "Proje kartlarındaki küçük önizleme çizimleri bir dönem sıraya bağlıydı: ilk kart not listesi, ikinci kart çubuk grafik. Sıra değişince bir projenin maketi başka bir projenin kartında görünüyordu. Düzeltme, görseli veriye bağlamaktı; her proje kendi önizlemesini bir alanla söylüyordu.",
    },
    {
      type: 'p',
      text: 'Sonra maketleri tamamen kaldırıp yerlerine gerçek ekran görüntülerini koydum. Ama o alan tipte kaldı, her proje onu doldurmaya devam etti ve hiçbir bileşen okumadı. Derleyici bunu hiç söylemedi.',
    },
    {
      type: 'quote',
      text: "Kapsama kontrolü yalnızca bir switch'in olduğu yerde çalışır. Kimsenin okumadığı bir alan, tip sistemine göre hatasız bir alandır.",
    },
    {
      type: 'p',
      text: 'Okuma süresinde de aynısı oldu. Süre elle yazılıyordu ve tutmuyordu; 287 kelimelik bir yazının üstünde "11 dakika" yazıyordu. Tip bir metin istiyordu ve "11 dakika" geçerli bir metin. Alanı kaldırıp süreyi içerikten hesaplattım. Tip, alanın şeklini kontrol eder; içindeki değerin doğru olup olmadığını bilmez.',
    },

    { type: 'h2', text: 'Nerede Duruyorum' },
    {
      type: 'p',
      text: 'Blok birleşimi uzun bir tip ama tek dosyada duruyor ve okuyunca ne olduğu anlaşılıyor. Yeni bir blok türü eklemek, derleyicinin gösterdiği yerleri doldurmaktan ibaret. Yazı yazarken Markdown\'ın rahatlığını özlediğim anlar oluyor, ama bir yazının içine bozuk bir tablo girmeyeceğini bilmek o rahatlığa değiyor.',
    },
    {
      type: 'p',
      text: 'Yetmediği yer de belli. Birleşim bir şeyi unuttuğumu söylüyor, kullanmayı bıraktığım bir şeyi söylemiyor. Kimsenin okumadığı alanları tip sistemiyle yakalamanın temiz bir yolunu henüz bulmadım; şimdilik arama ve dikkat.',
    },
  ],
}

export default post
