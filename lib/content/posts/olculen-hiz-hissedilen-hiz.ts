import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'olculen-hiz-hissedilen-hiz',
  tag: 'Performans',
  tagColor: '#8b5cf6',
  title: "ahmetakyapi.com: Hızlı Ölçüldü, Yavaş Hissedildi",
  excerpt:
    '"Windows\'ta kasıyor" dediler. Profilleyiciyi açtım: 60 kare, sıfır uzun görev, tertemiz. Sorun ölçtüğüm yerde değildi. Bulunca animasyon kütüphanesini de sildim.',
  date: '2026-03-15',
  coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  content: [
    {
      type: 'lead',
      text: 'Sitede bir gecikme olduğunu, özellikle Windows\'ta akıcı hissettirmediğini söylediler. Elimde macOS var, açtım profilleyiciyi: 60 kare, 50 ms üstü tek bir görev yok, kaydırma tereyağı gibi. Ölçümün söylediği şey "sorun yok"tu. Ama sorun vardı ve ölçtüğüm yerde değildi.',
    },

    { type: 'h2', text: 'Önce Yanlış Yerlere Baktım' },
    {
      type: 'p',
      text: 'Şüphelendiğim şeyler sırayla: tam ekran parçacık tuvali, dönen küre, iç içe `backdrop-filter` katmanları, büyük blur filtreleri. Hepsini teker teker çalışma anında devre dışı bırakıp ölçtüm.',
    },
    {
      type: 'p',
      text: 'İlk turda müthiş sonuçlar aldım: tuvalleri kaldırınca ana iş parçacığı yükü 493 ms\'den 208 ms\'ye düşüyordu. Neredeyse yazacaktım. Sonra aynı ölçümü dört kere tekrarladım.',
    },
    {
      type: 'compare',
      label: 'Aynı sayfa, aynı ölçüm',
      before: { label: 'İlk çalıştırma', value: '493 ms' },
      after: { label: '2., 3., 4. çalıştırma', value: '218 ms' },
      note: 'İlk ölçüm soğuk tarayıcının bedelini ödüyordu: JIT derlemesi, ilk boyama, önbelleksiz her şey. Karşılaştırdığım "baseline" buydu, dolayısıyla sonraki her varyant sihirli biçimde iyi görünüyordu.',
    },
    {
      type: 'p',
      text: 'Gerçek fark tuvalleri kaldırınca 218 ms → 207 ms\'ydi. Yani neredeyse hiç. Bir buçuk saat, olmayan bir sorunun peşinde koşmuşum.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Performans ölçerken ilk çalıştırmayı at. Varyantları karşılaştırıyorsan her birini en az üç kez koştur ve varyansı gör. Tek ölçüme bakıp karar vermek, gürültüyü bulgu sanmanın en kolay yolu.',
    },

    { type: 'h2', text: 'Sorun İmleçti' },
    {
      type: 'p',
      text: 'Sonunda şunu fark ettim: sitede özel bir imleç vardı. CSS her elemana `cursor: none` diyor, JavaScript de ekrana bir nokta ve onu takip eden bir halka çiziyordu.',
    },
    {
      type: 'p',
      text: 'İşletim sisteminin imleci donanım katmanında çizilir. Pencere yöneticisi onu diğer her şeyin üstüne, ayrı bir katman olarak bindirir; sayfanın kare hızıyla ilgisi yoktur. Fareyi oynattığın an oradadır.',
    },
    {
      type: 'p',
      text: 'JavaScript ile çizdiğin imleç ise sayfanın bir parçası. En iyi ihtimalle bir kare geride — 60 Hz\'de 16,7 ms. Windows\'ta Chrome\'un compositing zinciri bunun üstüne ekleyince 30-50 ms\'yi buluyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'components/CustomCursor.tsx',
      text: `// Halka kasten geriden geliyordu — "yumuşak" görünsün diye.
// 0.14 katsayısı: her karede aradaki farkın %14'ü kapanıyor,
// yani imlece yetişmesi ~15 kare, kabaca 250 ms sürüyor.
ring.current.x += (mouse.current.x - ring.current.x) * 0.14
ring.current.y += (mouse.current.y - ring.current.y) * 0.14`,
    },
    {
      type: 'quote',
      text: 'Kullanıcının bir arayüzle kurduğu en sık geri bildirim döngüsü el–imleç döngüsüdür. Onu bozarsan, sayfanın geri kalanı ne kadar hızlı olursa olsun her şey gecikmeli hissedilir.',
    },
    {
      type: 'p',
      text: 'Ve bu hiçbir metriğe yansımıyor. Kare süresi 16,7 ms, uzun görev sıfır, Lighthouse mutlu. Ölçtüğün şey sayfanın ne kadar hızlı çizildiği; kullanıcının hissettiği şey ise kendi hareketinin ekrana ne kadar geç yansıdığı. İkisi aynı şey değil.',
    },
    {
      type: 'p',
      text: 'Özel imleci tamamen silmedim ama varsayılan kapalı yaptım. İsteyen komut paletinden açabiliyor. Ayrıca `cursor: none` kuralını CSS\'ten çıkarıp bileşenin kendisine taşıdım — eskiden kural CSS\'te, imleç JS\'teydi, yani JavaScript yüklenene kadar sayfada hiç imleç olmuyordu.',
    },

    { type: 'h2', text: 'Madem Bakıyordum: Kütüphane Ne Kadar Yer Kaplıyor' },
    {
      type: 'p',
      text: 'Asıl sorunu bulmuştum ama paket boyutuna da bakmıştım ve gördüğüm şey rahatsız ediciydi. Ana sayfanın ilk yükleme JavaScript\'i 181 KB\'ti ve bunun 76 KB\'ı animasyon kütüphanesiydi. Yüzde kırk üç.',
    },
    {
      type: 'p',
      text: 'Bir portfolyo sitesi için bu oran savunulabilir değil. Kütüphanenin ne yaptığını tek tek çıkardım:',
    },
    {
      type: 'table',
      head: ['Nerede', 'Ne için', 'Yerine ne koydum'],
      rows: [
        ['Gezinme', 'Aktif sekme göstergesinin kayması', 'Ölçülen konum + CSS geçişi'],
        ['Proje kartları', 'İmlece göre eğim ve parlaklık', 'Doğrudan style yazımı'],
        ['Ana sayfa', 'Düğmenin fareye çekilmesi', 'Doğrudan transform'],
        ['Yazı sayfası', 'Okuma ilerleme çubuğu', 'Passive scroll dinleyicisi'],
        ['Her yerde', 'Görünüme girme animasyonu', 'CSS scroll-driven animation'],
        ['Paletler', 'Açılış/kapanış', 'CSS keyframes'],
      ],
    },
    {
      type: 'p',
      text: 'Hiçbiri kütüphane gerektirmiyordu. En çok korktuğum gezinme göstergesiydi — kütüphanenin `layoutId` özelliği iki farklı elemanı birbirine bağlayıp aradaki geçişi kendisi hesaplıyor. Yerine yazdığım şey on beş satır.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'components/Header.tsx',
      text: `const positionPill = useCallback(() => {
  const nav = navRef.current
  const pill = pillRef.current
  if (!nav || !pill) return

  const active = nav.querySelector<HTMLElement>('[aria-current="page"]')
  if (!active) { pill.style.opacity = '0'; return }

  pill.style.opacity = '1'
  // Genişlik ve konum CSS değişkeni olarak yazılıyor; kaymayı
  // transition hallediyor, JavaScript her kareye karışmıyor.
  pill.style.setProperty('--pill-x', \`\${active.offsetLeft}px\`)
  pill.style.setProperty('--pill-w', \`\${active.offsetWidth}px\`)
}, [])`,
    },
    {
      type: 'p',
      text: 'Kart eğiminde de aynı mantık. Eskiden kart başına dört "motion value" ve dört yay vardı; sayfada on üç kart olduğu için tek bir kartın üzerinde gezinmek epey iş çıkarıyordu. Şimdi `mousemove` doğrudan iki CSS değişkeni yazıyor, yumuşatmayı `transition` yapıyor.',
    },

    { type: 'h2', text: 'En Sevdiğim Kısım: Sıfır JavaScript\'li Reveal' },
    {
      type: 'p',
      text: 'Kartların görünüme girerken belirmesi kütüphanenin en çok kullandığım özelliğiydi. Her kart kendi bileşeni ve kendi `IntersectionObserver`\'ıydı — uzun bir yazıda altmışa yakın gözlemci demek.',
    },
    {
      type: 'p',
      text: 'İlk çözümüm hepsini tek bir gözlemciye indirmekti. Çalıştı, ama bir riski vardı ve o risk beni rahatsız etti: animasyonun başlangıç durumu `opacity: 0`. JavaScript herhangi bir sebeple çalışmazsa — paket indirilemedi, bir hata hidrasyonu durdurdu — sayfa bomboş kalıyor.',
    },
    {
      type: 'p',
      text: 'Sonra CSS\'in kaydırmaya bağlı animasyonlarını denedim. İşi tamamen tarayıcıya devrediyor: gözlemci yok, dinleyici yok, ana iş parçacığında hiç iş yok.',
    },
    {
      type: 'code',
      lang: 'css',
      file: 'app/globals.css',
      text: `@keyframes reveal-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* Desteklemeyen tarayıcıda bu blok HİÇ uygulanmıyor; içerik olduğu
   gibi görünüyor. Yani en kötü senaryo "animasyon yok" —
   "içerik yok" değil. Bu yüzden @supports şart. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal-up 1s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}`,
    },
    {
      type: 'p',
      text: 'O `@supports` bloğu sadece uyumluluk için değil, güvenlik için. Kuralın tamamı içeride olduğu için desteklemeyen tarayıcı `opacity: 0` başlangıcını hiç görmüyor. Bir özelliği kullanamayan tarayıcının cezası "animasyon göremeyip içeriği görmek" oluyor, tam tersi değil.',
    },
    {
      type: 'p',
      text: 'Bunu JavaScript ile test ettim: tarayıcıda JS\'i tamamen kapatıp sayfayı açtım, içerik yerinde. Kaydırma animasyonu da çalışıyor, çünkü onu tarayıcı yürütüyor.',
    },

    { type: 'h2', text: 'Yazı Sayfası En Çok Rahatlayan Yer Oldu' },
    {
      type: 'p',
      text: 'Blog gövdesinde her blok — her paragraf, her başlık, her kod bloğu — kendi animasyon bileşeniydi. Bu yazının uzunluğunda bir metinde altmışa yakın bileşen ve altmış ayrı gözlemci demek.',
    },
    {
      type: 'p',
      text: 'Üstelik görsel olarak da iyi değildi: okurken metin gözünün önünde beliriyordu. Bir kartın kaydırmayla belirmesi hoş; okumakta olduğun paragrafın belirmesi rahatsız edici.',
    },
    {
      type: 'stats',
      label: 'İlk yükleme JavaScript\'i',
      items: [
        { value: '181 → 104', note: 'ana sayfa (KB)' },
        { value: '179 → 99', note: 'projeler' },
        { value: '146 → 104', note: 'yazı sayfası' },
        { value: '76', note: 'kütüphaneden kurtarılan KB' },
      ],
    },

    { type: 'h2', text: 'Bir de Gizli Sızıntı Vardı' },
    {
      type: 'p',
      text: 'Paketin içine bakarken beklemediğim bir şey gördüm: ana sayfanın JavaScript\'inde blog yazılarının tam metni duruyordu. Dokuz makale, 38 KB.',
    },
    {
      type: 'p',
      text: 'Sebep tek bir satırdı. Ana sayfa bileşeni proje sıralaması için küçük bir yardımcı fonksiyon alıyordu; o fonksiyonun bulunduğu dosya ise varsayılan içerik için blog yazılarını değer olarak import ediyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// lib/site-content.ts — sunucu tarafı için yazılmış
import { blogPosts, projects } from '@/lib/data'   // ← DEĞER importu

export function getOrderedProjects(...) { /* saf fonksiyon */ }

// components/Hero.tsx — istemci bileşeni
import { getOrderedProjects } from '@/lib/site-content'
// Tek bir yardımcı için dokuz makalenin tam metni pakete giriyor.`,
    },
    {
      type: 'p',
      text: 'Saf fonksiyonu veri import etmeyen kendi dosyasına taşıyınca 38 KB gitti. Ders: bir istemci bileşeninin import ettiği her dosyanın import ağacına bakmak lazım — bir yardımcı fonksiyon masum görünür, bulunduğu dosya olmayabilir.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bunu bulmanın kolay yolu: paketin içinde içeriğinden bir cümle aramak. `grep` ile makalenin bir başlığını chunk dosyalarında aradım ve doğrudan çıktı. Paket analiz araçları modül adı verir, ama "bu metin burada ne arıyor" sorusunu en hızlı düz arama cevaplıyor.',
    },

    { type: 'h2', text: 'Ne Kaybettim' },
    {
      type: 'p',
      text: 'Dürüst olayım: bir şey kaybettim. Sayfalar arası çıkış animasyonu.',
    },
    {
      type: 'p',
      text: 'Aslında onu kütüphane varken de yapamıyordum. App Router yeni sayfayı render ederken eski ağacı beklemiyor, yani çıkışı oynatacak bir düğüm ortada kalmıyor. Çeşitli numaralar var ama hepsi gezinmeyi kasten geciktiriyor — 280 ms\'lik bir çıkış animasyonu için her tıklamaya 280 ms eklemek.',
    },
    {
      type: 'p',
      text: 'Şimdi tek yönlü, kısa bir giriş var ve o da saf CSS. Rota geçişini yapan dosya artık istemci bileşeni bile değil.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'app/(site)/template.tsx',
      text: `// 'use client' YOK — animasyonun JavaScript'e ihtiyacı kalmadı.
// template.tsx her gezinmede yeniden monte edilir (layout.tsx edilmez),
// yani sınıf her seferinde yeniden uygulanıp animasyon oynuyor.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>
}`,
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Birincisi ve en önemlisi: ölçülen hız ile hissedilen hız aynı şey değil. Bütün metriklerin yeşilken kullanıcının "kasıyor" demesi gayet mümkün. Metrikler sayfanın ne kadar hızlı çizildiğini ölçüyor; kullanıcı kendi hareketinin ne kadar geç karşılık bulduğunu hissediyor.',
    },
    {
      type: 'p',
      text: 'İkincisi: bir animasyon kütüphanesi bir şeyi kolaylaştırdığı için değil, mümkün kıldığı için değerlidir. Yaptığım şeylerin neredeyse tamamı CSS ile zaten mümkündü — kütüphane sadece daha az düşünmemi sağlıyordu. 76 KB, "daha az düşünmek" için yüksek bir fiyat.',
    },
    {
      type: 'p',
      text: 'Hâlâ emin olmadığım tek şey kart eğimi. Kütüphanesiz hâli çalışıyor ama yay hissi kayboldu, artık düz bir geçiş. Belki bir gün onu da kaldırırım — ya da doğru yaya `linear()` easing ile yaklaşırım.',
    },
  ],
}

export default post
