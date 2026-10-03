import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'olculen-hiz-hissedilen-hiz',
  tag: 'Performans',
  tagColor: '#8b5cf6',
  title: "ahmetakyapi.com: Hızlı Ölçüldü, Yavaş Hissedildi",
  excerpt:
    '"Windows\'ta kasıyor" dediler. Profilleyici 60 kare ve sıfır uzun görev gösterdi. Sorun ölçtüğüm yerde değildi; bulunca animasyon kütüphanesini de sildim.',
  date: '2026-03-15',
  coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  content: [
    {
      type: 'lead',
      text: 'Sitenin özellikle Windows\'ta akıcı hissettirmediğini söylediler. Profilleyiciyi açtım: işlemci altı kat kısıtlıyken bile 50 milisaniyeyi aşan tek bir görev yok, kaydırma pürüzsüz. Ölçüm "sorun yok" diyordu. Sorun vardı, ama ölçtüğüm yerde değildi.',
    },

    { type: 'h2', text: 'Önce Yanlış Yerlere Baktım' },
    {
      type: 'p',
      text: 'Şüphelendiğim şeyler sırayla: tam ekran parçacık tuvali, dönen küre, iç içe beş `backdrop-filter` katmanı, büyük bulanıklık filtreleri. Hepsini teker teker devre dışı bırakıp ölçtüm.',
    },
    {
      type: 'p',
      text: 'İlk turda sonuçlar harika göründü: tuvalleri kaldırınca ana iş parçacığının yükü yarıdan fazla düşüyordu. Neredeyse bulgu diye yazacaktım. Sonra aynı ölçümü dört kez daha koşturdum.',
    },
    {
      type: 'compare',
      label: 'Aynı Sayfa, Aynı Ölçüm',
      before: { label: 'İlk Çalıştırma', value: '493 ms' },
      after: { label: 'Sonraki Dört Çalıştırma', value: '218 ms' },
      note: 'İlk ölçüm soğuk tarayıcının bedelini ödüyordu: JIT derlemesi, ilk boyama, önbelleksiz her şey. Karşılaştırma tabanım oydu, bu yüzden sonraki her varyant sihirli biçimde iyi görünüyordu.',
    },
    {
      type: 'p',
      text: 'Isınmış tarayıcıda tuvalleri kaldırmanın etkisi neredeyse yok oldu. Olmayan bir sorunun peşinden epey koşmuşum.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu ölçümden çıkan kural: ilk çalıştırmayı at, her varyantı birkaç kez koştur ve aradaki oynamayı gör. Tek ölçüme bakıp karar vermek, gürültüyü bulgu sanmanın en kolay yolu.',
    },

    { type: 'h2', text: 'Sorun İmleçti' },
    {
      type: 'p',
      text: 'Sonunda fark ettim: sitede özel bir imleç vardı. CSS her elemana `cursor: none` diyor, JavaScript de ekrana bir nokta ve onu izleyen bir halka çiziyordu.',
    },
    {
      type: 'p',
      text: 'İşletim sisteminin imleci donanım katmanında çizilir. Pencere yöneticisi onu her şeyin üstüne ayrı bir katman olarak bindirir; sayfanın kare hızıyla ilgisi yoktur. Fareyi oynattığın an oradadır.',
    },
    {
      type: 'p',
      text: 'JavaScript ile çizilen imleç ise sayfanın bir parçası. En iyi ihtimalle bir kare geride kalıyor, 60 Hz\'de 16,7 ms. Windows\'ta tarayıcının katman birleştirme gecikmesi eklenince bu 30-50 ms\'yi buluyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'CustomCursor.tsx',
      text: `ring.current.x += (mouse.current.x - ring.current.x) * 0.14
ring.current.y += (mouse.current.y - ring.current.y) * 0.14`,
    },
    {
      type: 'p',
      text: 'Üstüne halka kasten geriden geliyordu, "yumuşak" görünsün diye. 0.14 katsayısı her karede aradaki farkın %14\'ünü kapatıyor; imlece yetişmesi kabaca 15 kare, yani 60 Hz\'de 250 ms sürüyor.',
    },
    {
      type: 'quote',
      text: 'Bir arayüzle kurulan en sık geri bildirim döngüsü el ile imleç arasındaki döngüdür. Onu bozarsan, sayfanın geri kalanı ne kadar hızlı olursa olsun her şey gecikmeli hissedilir.',
    },
    {
      type: 'p',
      text: 'Bu hiçbir metriğe yansımıyor. Kare süresi 16,7 ms, uzun görev sıfır, Lighthouse mutlu. Ölçtüğüm şey sayfanın ne kadar hızlı çizildiğiydi; kullanıcının hissettiği şey ise kendi hareketinin ekrana ne kadar geç yansıdığı.',
    },
    {
      type: 'p',
      text: 'Özel imleci silmedim, varsayılan olarak kapattım. İsteyen komut paletinden açabiliyor ve tercih kalıcı. `cursor: none` kuralını da CSS\'ten çıkarıp bileşene taşıdım. Eskiden kural CSS\'te, imleç JavaScript\'teydi; yani JavaScript yüklenene kadar sayfada hiç imleç olmuyordu.',
    },

    { type: 'h2', text: 'Madem Bakıyordum: Kütüphane Ne Kadar Yer Kaplıyor' },
    {
      type: 'p',
      text: 'Asıl sorunu bulmuştum, ama paket boyutuna da bakmıştım ve gördüğüm şey rahatsız ediciydi. Ana sayfanın ilk yükleme JavaScript\'i 181 KB\'tı ve bunun yaklaşık 76 KB\'ı (gzip) animasyon kütüphanesiydi. Yüzde kırk üç.',
    },
    {
      type: 'p',
      text: 'Bir portfolyo sitesi için bu oranı savunamazdım. Kütüphanenin sitede ne iş yaptığını tek tek çıkardım:',
    },
    {
      type: 'table',
      head: ['Nerede', 'Ne İçin', 'Yerine Ne Koydum'],
      rows: [
        ['Gezinme', 'Etkin sekme göstergesinin kayması', 'Ölçülen konum ve CSS geçişi'],
        ['Proje Kartları', 'İmlece göre eğim ve parlaklık', 'Doğrudan style yazımı'],
        ['Ana Sayfa', 'Düğmenin fareye çekilmesi', 'Doğrudan transform'],
        ['Yazı Sayfası', 'Okuma ilerleme çubuğu', 'Tek bir passive kaydırma dinleyicisi'],
        ['Her Yerde', 'Görünüme girme animasyonu', 'CSS kaydırma zaman çizelgesi'],
      ],
    },
    {
      type: 'p',
      text: 'Hiçbiri kütüphane gerektirmiyordu. En çok çekindiğim gezinme göstergesiydi: kütüphanenin `layoutId` özelliği iki ayrı elemanı birbirine bağlayıp aradaki geçişi kendisi hesaplıyor. Yerine yazdığım şey on beş satır.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'Header.tsx',
      text: `const positionPill = useCallback(() => {
  const nav = navRef.current
  const pill = pillRef.current
  if (!nav || !pill) return

  const active = nav.querySelector<HTMLElement>('[aria-current="page"]')
  if (!active) {
    pill.style.opacity = '0'
    return
  }

  pill.style.opacity = '1'
  pill.style.setProperty('--pill-x', \`\${active.offsetLeft}px\`)
  pill.style.setProperty('--pill-w', \`\${active.offsetWidth}px\`)
}, [])`,
    },
    {
      type: 'p',
      text: 'Konum ve genişlik CSS değişkeni olarak yazılıyor, kaymayı `transition` hallediyor ve JavaScript her kareye karışmıyor. Kart eğiminde de aynı mantık: `mousemove` doğrudan iki CSS değişkeni yazıyor, React hiç yeniden çizim yapmıyor. Sayfada on üç kart var; her birinin üzerinde gezinmek artık yalnızca iki değişken yazıyor.',
    },

    { type: 'h2', text: 'En Sevdiğim Kısım: Sıfır JavaScript\'li Görünme Animasyonu' },
    {
      type: 'p',
      text: 'Kartların görünüme girerken belirmesi, kütüphanenin en çok kullandığım özelliğiydi. Her kartın kendi bileşeni ve kendi `IntersectionObserver`\'ı vardı.',
    },
    {
      type: 'p',
      text: 'Bunları tek bir gözlemciye indirmek de bir seçenekti, ama aynı riski taşırdı: animasyonun başlangıç durumu `opacity: 0`. JavaScript herhangi bir sebeple çalışmazsa (paket inmedi, bir hata hidrasyonu durdurdu) sayfa bomboş kalır.',
    },
    {
      type: 'p',
      text: 'CSS\'in kaydırmaya bağlı animasyonları işi tamamen tarayıcıya devrediyor: gözlemci yok, dinleyici yok, ana iş parçacığında iş yok.',
    },
    {
      type: 'code',
      lang: 'css',
      file: 'globals.css',
      text: `@keyframes reveal-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal-up 1s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-timeline: view();
      /* Eleman ekrana girerken oynasın, %30'unda tamamlansın. */
      animation-range: entry 0% cover 30%;
    }
  }
}`,
    },
    {
      type: 'p',
      text: '`@supports` bloğu yalnızca uyumluluk için değil, güvenlik için orada. Kuralın tamamı içeride olduğundan, desteklemeyen tarayıcı `opacity: 0` başlangıcını hiç görmüyor. Bir özelliği kullanamayan tarayıcının cezası "animasyonu görmemek" oluyor, "içeriği görmemek" değil. JavaScript tamamen kapalı olsa da içerik yerinde; animasyonu tarayıcı yürütüyor.',
    },

    { type: 'h2', text: 'Yazı Sayfası En Çok Rahatlayan Yer Oldu' },
    {
      type: 'p',
      text: 'Blog gövdesinde her blok (her paragraf, her başlık, her kod bloğu) kendi animasyon bileşenine sarılıydı. Uzun bir yazıda bu, altmış bileşen ve altmış ayrı gözlemci demek.',
    },
    {
      type: 'p',
      text: 'Görsel olarak da iyi değildi. Bir kartın kaydırmayla belirmesi hoş; okumakta olduğun paragrafın gözünün önünde belirmesi rahatsız edici. Yazı gövdesindeki animasyonların hepsini kaldırdım.',
    },
    {
      type: 'stats',
      label: 'İlk Yükleme JavaScript’i (KB)',
      items: [
        { value: '181 → 104', note: 'Ana Sayfa' },
        { value: '179 → 99', note: 'Projeler' },
        { value: '135 → 97', note: 'Blog Listesi' },
        { value: '146 → 104', note: 'Yazı Sayfası' },
      ],
    },

    { type: 'h2', text: 'Bir de Gizli Sızıntı Vardı' },
    {
      type: 'p',
      text: 'Paketin içine bakarken beklemediğim bir şey gördüm: ana sayfanın JavaScript\'inde blog yazılarının tam metni duruyordu. Dokuz makale, gzip ile 38 KB.',
    },
    {
      type: 'p',
      text: 'Sebep tek bir import\'tu. İstemci bileşenleri proje sıralaması için küçük bir yardımcı fonksiyon alıyordu; o fonksiyonun bulunduğu dosya ise varsayılan içerik için blog yazılarını değer olarak import ediyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// lib/site-content.ts: sunucu tarafı için yazılmış
import { blogPosts as defaultBlogPosts, projects as defaultProjects } from '@/lib/data'

export function getOrderedProjects(...) { /* saf fonksiyon */ }

// istemci bileşeni
import { getOrderedProjects } from '@/lib/site-content'
// Tek bir yardımcı için dokuz makalenin tam metni pakete giriyor.`,
    },
    {
      type: 'p',
      text: 'Saf fonksiyonu veri import etmeyen kendi dosyasına (`lib/project-order.ts`) taşıyınca 38 KB gitti. Bir yardımcı fonksiyon masum görünür; bulunduğu dosya olmayabilir. İstemci bileşeninin import ettiği her dosyanın import ağacına bakmak gerekiyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bu tür sızıntıyı en hızlı bulduran şey, derlenmiş paket dosyalarında içerikten bir cümle aramak. Paket analiz araçları modül adı verir; "bu metin burada ne arıyor" sorusunu düz bir `grep` daha hızlı cevaplıyor.',
    },

    { type: 'h2', text: 'Ne Kaybettim' },
    {
      type: 'p',
      text: 'Bir şey kaybettim: sayfalar arası çıkış animasyonu.',
    },
    {
      type: 'p',
      text: 'Aslında onu kütüphane varken de yapamıyordum. App Router yeni sayfayı çizerken eski ağacı beklemiyor, yani çıkışı oynatacak bir düğüm ortada kalmıyor. Bunu aşmanın yolları var ama hepsi gezinmeyi kasten geciktiriyor: kısa bir çıkış animasyonu için her tıklamaya aynı süreyi eklemek.',
    },
    {
      type: 'p',
      text: 'Kütüphane gidince tek yönlü, kısa bir giriş kaldı ve o da saf CSS. Rota geçişini yapan dosya artık istemci bileşeni bile değil.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'template.tsx',
      text: `// 'use client' yok: animasyonun JavaScript'e ihtiyacı kalmadı.
// template.tsx her gezinmede yeniden monte edilir (layout.tsx edilmez),
// yani sınıf her seferinde yeniden uygulanıyor ve animasyon oynuyor.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>
}`,
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Ölçülen hız ile hissedilen hız aynı şey değil. Bütün metrikler yeşilken birinin "kasıyor" demesi gayet mümkün. Metrikler sayfanın ne kadar hızlı çizildiğini ölçüyor; insan kendi hareketinin ne kadar geç karşılık bulduğunu hissediyor.',
    },
    {
      type: 'p',
      text: 'Bir animasyon kütüphanesi bir şeyi kolaylaştırdığı için değil, mümkün kıldığı için değerli. Burada yaptığım şeylerin neredeyse hepsi CSS ile zaten mümkündü; kütüphane yalnızca daha az düşünmemi sağlıyordu. 76 KB, daha az düşünmek için yüksek bir fiyat.',
    },
    {
      type: 'p',
      text: 'Hâlâ emin olmadığım tek şey kart eğimi. Kütüphanesiz hâli çalışıyor ama yay hissi kayboldu, artık düz bir geçiş. Belki bir gün onu da kaldırırım, belki de yaya `linear()` geçiş eğrisiyle yaklaşırım.',
    },
  ],
}

export default post
