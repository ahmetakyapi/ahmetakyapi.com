import type { BlogPost } from '../types'

/*
 * 4 Ekim 2026'da baştan yazıldı. Önceki hâli ("Ölçülen Hız, Hissedilen
 * Hız") neredeyse tamamen bir hata avını anlatıyordu; sahibinin isteği:
 * hatalara değil, sitenin ne için var olduğuna, hangi tekniği neden
 * seçtiğimize ve nasıl kurduğumuza odaklansın, günlük dilde olsun. Eski
 * adres next.config.ts'te buraya yönleniyor.
 */
export const post: BlogPost = {
  slug: 'ahmetakyapi-com-nasil-yapildi',
  tag: 'Ürün',
  tagColor: '#8b5cf6',
  title: 'ahmetakyapi.com: Portfolyo ve Blog Bir Arada',
  excerpt:
    'Projelerimi ve yazdıklarımı tek yerde toplamak için kurduğum site. Neden kendim yazdım, hangi teknolojileri seçtim ve hızlı kalması için neler yaptım.',
  date: '2026-10-04',
  coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bir süre sonra projelerim GitHub\'a, yazdıklarım not defterlerine, ekran görüntüleri de telefonun galerisine dağılmıştı. Birine "neler yapıyorsun" diye sorulduğunda gösterecek tek bir adres yoktu. ahmetakyapi.com o adres: projelerim, her birinin nasıl yapıldığını anlatan yazılar ve kim olduğum, hepsi aynı yerde.',
    },

    { type: 'h2', text: 'Neden Kendim Yazdım' },
    {
      type: 'p',
      text: 'Hazır bir portfolyo şablonu ya da bir blog platformu işimi görürdü. Ama bu site aynı zamanda bir vitrin: frontend işi yapan birinin sitesi, nasıl iş çıkardığını da göstermeli. Hazır şablonda yazı tipinden geçiş animasyonuna kadar her şey başkasının kararı oluyor.',
    },
    {
      type: 'p',
      text: 'Bir de deneme alanı lazımdı. Tarayıcıya yeni gelen özellikleri (sayfalar arası geçişler, kaydırmaya bağlı CSS animasyonları) iş projesinde hemen kullanamıyorsun. Kendi sitende kullanıp nerede iyi, nerede sorunlu olduğunu görebiliyorsun.',
    },

    { type: 'h2', text: 'Sitede Ne Var' },
    {
      type: 'steps',
      items: [
        {
          title: 'Ana Sayfa',
          text: 'Kısa bir tanıtım, sürükleyip döndürebildiğin bir dünya küresi, öne çıkan üç proje, iş deneyimi ve son yazılar.',
        },
        {
          title: 'Projeler',
          text: 'On üç proje. Her birinin masaüstü ve telefon ekran görüntüleri, kullandığı teknolojiler, canlı adresi ve kaynak kodu. Platform, oyun ve araç diye filtrelenebiliyor.',
        },
        {
          title: 'Blog',
          text: 'Projelerin arkasındaki kararları anlatan yazılar. İçindekiler, kod blokları, tablolar, karşılaştırma kutuları ve yorumlar var.',
        },
        {
          title: 'Komut Paleti',
          text: '⌘K (ya da Ctrl+K) ile açılıyor; sayfalara, projelere, yazılara ve temaya klavyeden ulaşıyorsun.',
        },
      ],
    },

    { type: 'h2', text: 'Kullandığım Teknolojiler' },
    {
      type: 'table',
      head: ['Parça', 'Ne Kullandım', 'Neden'],
      rows: [
        ['Çatı', 'Next.js 16, React 19, TypeScript', 'Sayfalar derleme anında hazırlanıyor, sunucu bileşenleri tarayıcıya gereksiz JavaScript göndermiyor.'],
        ['Stil', 'Tailwind CSS v4', 'Renkler ve boşluklar tek bir token dosyasında; açık ve koyu tema aynı değişkenlerden besleniyor.'],
        ['Geçişler', 'View Transitions (React `ViewTransition`)', 'Sayfa değişirken içerik kayarak geliyor, proje kartı detay sayfasının kapağına dönüşüyor.'],
        ['Animasyon', 'CSS kaydırma zaman çizelgesi', 'Kaydırınca beliren her şeyi tarayıcı yürütüyor; JavaScript yok.'],
        ['İçerik', 'TypeScript dosyaları', 'Yazılar ve projeler kodun yanında, tipli; yanlış bir alan derlemeyi durduruyor.'],
        ['Paylaşım Görseli', 'Satori (`next/og`)', 'Her proje ve yazı için kendi bağlantı önizlemesi otomatik çiziliyor.'],
        ['Yorumlar', 'Giscus', 'Yorumlar GitHub Discussions\'ta duruyor; veritabanı tutmam gerekmiyor.'],
        ['Yayın', 'Vercel', '`main` dalına gönderdiğim an birkaç dakikada canlıda.'],
      ],
    },

    { type: 'h2', text: 'Sayfalar Neden Statik' },
    {
      type: 'p',
      text: 'Bir portfolyonun içeriği her ziyarette değişmiyor. O yüzden bütün sayfalar derleme sırasında bir kez üretiliyor ve ziyaretçiye hazır HTML olarak gidiyor. Sunucuda her istekte çalışan bir kod yok; sayfa CDN\'den anında geliyor.',
    },
    {
      type: 'p',
      text: 'Tema seçimi bunu zorlaştıran tek şeydi. Tema bir çerezde duruyor ve sunucu çerezi okursa her sayfa "dinamik" oluyor, yani her ziyaret bir fonksiyon çağrısına dönüyor. Bunun yerine sayfanın başına üç yüz baytlık küçük bir betik koydum: ilk boyamadan önce çerezi okuyup doğru temayı yazıyor. Sayfa statik kalıyor, yanlış tema bir an bile görünmüyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/theme.ts',
      text: `// <head> içinde, her şeyden önce çalışır (sadeleştirilmiş hâli).
const m = document.cookie.match(/(?:^|; )theme=(dark|light)/)
document.documentElement.dataset.theme = m ? m[1] : 'light'`,
    },

    { type: 'h2', text: 'Geçişler: Sayfa Değişirken Kopukluk Olmasın' },
    {
      type: 'p',
      text: 'Bir projeye tıkladığında listedeki kapak görseli büyüyüp detay sayfasının kapağı oluyor. Bunu tarayıcının View Transitions özelliği yapıyor; React 19\'daki `ViewTransition` bileşeni de onu Next.js\'in gezinmesine bağlıyor. Benim yaptığım tek şey iki uçtaki görsele aynı adı vermek.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'ProjectCover.tsx',
      text: `<ViewTransition name={\`project-\${slug}\`} share="morph" default="none">
  <div className="aspect-[16/10] overflow-hidden rounded-card">
    <ThemedImage {...shot} alt={title} />
  </div>
</ViewTransition>`,
    },
    {
      type: 'p',
      text: 'Tarayıcı iki görselin konumunu ve boyutunu kendisi ölçüp aradaki hareketi çiziyor. Desteklemeyen tarayıcıda sayfa normal şekilde açılıyor; kaybedilen tek şey animasyon.',
    },

    { type: 'h2', text: 'Animasyonlar Neden CSS' },
    {
      type: 'p',
      text: 'Sitenin ilk hâlinde animasyonlar için framer-motion kullanıyordum. Ana sayfanın indirdiği JavaScript\'in yarısına yakını o kütüphaneydi. Yaptığı işlere tek tek bakınca hepsinin CSS ile yapılabildiğini gördüm ve kaldırdım.',
    },
    {
      type: 'p',
      text: 'Kaydırınca beliren kartlar artık `animation-timeline: view()` ile çalışıyor. Eleman ekrana girdikçe animasyon ilerliyor; zamanlayıcı da gözlemci de yok. Hepsi bir `@supports` bloğunun içinde, yani desteklemeyen tarayıcıda içerik zaten görünür hâlde duruyor.',
    },
    {
      type: 'code',
      lang: 'css',
      file: 'globals.css',
      text: `@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal-up 1s var(--ease-brand) both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}`,
    },
    {
      type: 'stats',
      label: 'İlk Yüklemede İnen JavaScript (KB)',
      items: [
        { value: '181 → 104', note: 'Ana Sayfa' },
        { value: '179 → 99', note: 'Projeler' },
        { value: '146 → 104', note: 'Yazı Sayfası' },
      ],
    },
    {
      type: 'p',
      text: 'Hareketi azaltmayı seçmiş biri için animasyonların hepsi kapalı. Sayfa aynı, sadece kıpırdamıyor.',
    },

    { type: 'h2', text: 'Küçük Ama Benim İçin Önemli Parçalar' },
    {
      type: 'h3',
      text: 'Dünya Küresi',
    },
    {
      type: 'p',
      text: 'Ana sayfadaki küre bir harita kütüphanesi değil, düz bir `<canvas>`. Şehirleri enlem ve boylamdan ekrana çeviren birkaç satır trigonometri, aralarındaki yaylar ve üzerlerinde akan küçük noktalar. İstanbul\'a dönük açılıyor; parmağınla ya da fareyle çevirebiliyorsun. Ekrandan çıkınca ya da sekme arkadayken çizim duruyor, pil yemiyor.',
    },
    {
      type: 'h3',
      text: 'İmza',
    },
    {
      type: 'p',
      text: 'Başlıktaki el yazısı "Ahmet Akyapı" bir yazı tipi değil, SVG yolu. Yazı tipi indirilmediği için sayfa yüklenirken harfler kaymıyor; sayfa açılırken de kalem kâğıtta ilerliyormuş gibi soldan sağa yazılıyor.',
    },
    {
      type: 'h3',
      text: 'Kod Boyayıcı',
    },
    {
      type: 'p',
      text: 'Yazılardaki kod blokları için Shiki ya da Prism kullanmadım. Yazılarda geçen dil sayısı beş; bunun için yazdığım küçük boyayıcı 2 KB tutuyor ve renkleri temadan alıyor.',
    },
    {
      type: 'h3',
      text: 'Ekran Görüntüleri',
    },
    {
      type: 'p',
      text: 'Her projenin görseli açık ve koyu temada ayrı çekildi. İkisi de sayfada duruyor, hangisinin görüneceğine CSS karar veriyor; JavaScript beklenmiyor. Görseller zaten gösterileceği boyutta WebP, o yüzden bir optimizasyon servisine de ihtiyaç kalmadı.',
    },

    { type: 'h2', text: 'İçerik Nasıl Yazılıyor' },
    {
      type: 'p',
      text: 'Yazılar bir veritabanında ya da Markdown dosyalarında değil, TypeScript dosyalarında duruyor. Her yazı bir blok listesi: paragraf, başlık, kod, tablo, karşılaştırma, adım adım akış. Bu sayede yazının içine tasarımı bozacak bir şey giremiyor; tanımadığı bir blok türü yazarsam derleme hemen hata veriyor.',
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
      text: 'Başlık ve özet de aynı dosyadan sitede, RSS\'te ve paylaşım görselinde kullanılıyor. Bir yazının başlığını değiştirdiğimde bağlantı önizlemesindeki görsel de kendiliğinden güncelleniyor.',
    },

    { type: 'h2', text: 'Telefonda da Rahat Olsun' },
    {
      type: 'p',
      text: 'Ziyaretlerin çoğu telefondan geliyor, o yüzden her sayfayı önce dar ekranda kontrol ediyorum. Tablolar telefonda yana kaymıyor, her satır kendi kartına dönüşüyor. Küre dikey kaydırmayı engellemiyor: hızlı kaydırırsan sayfa iner, basılı tutarsan küre döner. Başlık çentiğin altında kalmıyor, alt menü güvenli alana göre yerleşiyor.',
    },

    { type: 'h2', text: 'Sırada Ne Var' },
    {
      type: 'p',
      text: 'Bu sitenin kendi ekran görüntüleri henüz yok; projeler sayfasında adından çizilen bir kapakla duruyor. Bir de yazıların İngilizce çevirilerini eklemek istiyorum. Site bitmiş bir şey değil; yeni bir şey öğrendikçe önce burada deniyorum.',
    },
  ],
}

export default post
