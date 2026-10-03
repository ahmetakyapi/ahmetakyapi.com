import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'olculen-hiz-hissedilen-hiz',
  tag: 'Performans',
  tagColor: '#8b5cf6',
  title: "ahmetakyapi.com: Hızlı Ölçüldü, Yavaş Hissedildi",
  excerpt:
    '"Windows\'ta takılıyor" dediler. Profiler sıfır uzun görev gösterdi; gecikme JavaScript ile çizilen imleçteydi. Bu arada 76 KB\'lık animasyon kütüphanesi de gitti.',
  date: '2026-08-15',
  coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  content: [
    {
      type: 'lead',
      text: 'Sitenin Windows\'ta gecikmeli hissettirdiği söylendi. Profiler\'ı açtım: işlemci altı kat yavaşlatılmışken bile 50 milisaniyeyi aşan tek bir görev yok. Ölçüm "sorun yok" diyordu. Sorun vardı, ama ölçtüğüm yerde değildi.',
    },

    { type: 'h2', text: 'Önce Yanlış Yerlere Baktım' },
    {
      type: 'p',
      text: 'İlk şüphelendiğim şeyler pahalı görünen katmanlardı: tam ekran parçacık tuvali, dönen küre, iç içe beş `backdrop-filter` katmanı, büyük bulanıklık filtreleri.',
    },
    {
      type: 'p',
      text: 'Ölçerken bir tuzağa da düştüm. Aynı ölçümü beş kez çalıştırdım: ilki 493 ms okudu, sonraki dördü 218 ms. Tek ölçüme bakıp bir varyantı onunla kıyaslasaydım, aradaki farkı yaptığım değişikliğe yazacaktım.',
    },
    {
      type: 'compare',
      label: 'Aynı Sayfa, Aynı Ölçüm',
      before: { label: 'İlk Çalıştırma', value: '493 ms' },
      after: { label: 'Sonraki Dört Çalıştırma', value: '218 ms' },
      note: 'İlk ölçüm soğuk tarayıcının bedelini ödüyordu: JIT derlemesi, ilk çizim, boş önbellek. O sayıyı taban alsaydım, ondan sonraki her varyant iyileşme gibi görünürdü.',
    },
    {
      type: 'p',
      text: 'Bu katmanların bir kısmını yine de sadeleştirdim: arka plandaki 90 parçacıklı tuval (ekranda görünür bir karşılığı yoktu) kalktı, beş `backdrop-filter` katmanı bire indi. Ama gecikme hissinin kaynağı bunlar değildi.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Buradan çıkan kural: ilk çalıştırmayı at, her varyantı birkaç kez çalıştır ve sayıların ne kadar oynadığına bak. Tek ölçümle karar verirsen gürültüyü bulgu sanırsın.',
    },

    { type: 'h2', text: 'Sorun İmleçti' },
    {
      type: 'p',
      text: 'Sitede özel bir imleç vardı. CSS her elemana `cursor: none` diyor, JavaScript de ekrana bir nokta ve onu izleyen bir halka çiziyordu.',
    },
    {
      type: 'p',
      text: 'İşletim sisteminin imleci donanım katmanında çizilir. Her şeyin üstüne ayrı bir katman olarak biner ve sayfanın kare hızıyla ilgisi yoktur. Fareyi oynattığın an oradadır.',
    },
    {
      type: 'p',
      text: 'JavaScript ile çizilen imleç ise sayfanın bir parçası. En iyi ihtimalle bir kare geriden gelir, 60 Hz\'de 16,7 ms. Windows\'ta tarayıcının katmanları birleştirme (compositing) gecikmesi eklenince bu 30-50 ms\'yi buluyor.',
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
      text: 'Bir arayüzde en sık tekrarlanan döngü el ile imleç arasındadır. Onu bozarsan, sayfanın geri kalanı ne kadar hızlı olursa olsun her şey gecikmeli hissedilir.',
    },
    {
      type: 'p',
      text: 'Bu gecikme kare süresi ölçümlerinde hiç görünmüyor; uzun görev sayısı yine sıfır. Ben sayfanın ne kadar hızlı çizildiğini ölçüyordum. Kullanıcının hissettiği ise kendi hareketinin ekrana ne kadar geç yansıdığıydı.',
    },
    {
      type: 'p',
      text: 'Özel imleci silmedim, varsayılan olarak kapattım. İsteyen komut paletinden açabiliyor ve tercih hatırlanıyor. `cursor: none` kuralını da CSS\'ten çıkarıp bileşene taşıdım. Eskiden kural CSS\'te, imleç JavaScript\'teydi; yani JavaScript yüklenene kadar sayfada hiç imleç olmuyordu.',
    },

    { type: 'h2', text: 'Madem Bakıyordum: Animasyon Kütüphanesi' },
    {
      type: 'p',
      text: 'Aynı turda paket boyutuna da baktım. Ana sayfanın ilk yüklemede indirdiği JavaScript 181 KB\'tı ve bunun yaklaşık 76 KB\'ı (gzip) animasyon kütüphanesi framer-motion\'dı. Yüzde kırk üç.',
    },
    {
      type: 'p',
      text: 'Bir portfolyo sitesi için bu oranı savunamazdım. Kütüphanenin sitede ne iş yaptığını tek tek listeledim:',
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
      text: 'Hiçbiri kütüphane gerektirmiyordu. En zor görüneni gezinme göstergesiydi: kütüphanenin `layoutId` özelliği iki ayrı elemanı birbirine bağlayıp aradaki geçişi kendisi hesaplıyor. Yerine yazdığım kod on beş satır.',
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
      text: 'Konum ve genişlik CSS değişkeni olarak yazılıyor, kaymayı `transition` yapıyor ve JavaScript her kareye karışmıyor. Kart eğiminde de aynı yol: `mousemove` doğrudan iki CSS değişkeni yazıyor, React yeniden render etmiyor. Sayfada on üç kart var; fareyle üstlerinde gezinmek artık yalnızca iki değişken yazıyor.',
    },

    { type: 'h2', text: 'JavaScript\'siz Görünme Animasyonu' },
    {
      type: 'p',
      text: 'Kartların ekrana girerken belirmesi, kütüphaneyi en çok kullandığım yerdi. Her kartın kendi bileşeni ve kendi `IntersectionObserver`\'ı vardı.',
    },
    {
      type: 'p',
      text: 'Bunları tek bir observer\'a indirmek de mümkündü, ama aynı risk kalırdı: animasyonun başlangıç durumu `opacity: 0`. JavaScript herhangi bir sebeple çalışmazsa (paket inmedi, bir hata hydration\'ı durdurdu) sayfa bomboş kalır.',
    },
    {
      type: 'p',
      text: 'CSS\'in kaydırmaya bağlı animasyonları işi tamamen tarayıcıya bırakıyor: observer yok, dinleyici yok, ana thread\'de iş yok.',
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
      text: '`@supports` bloğu orada bir güvenlik önlemi olarak duruyor. Kuralın tamamı içeride olduğu için, bu özelliği desteklemeyen tarayıcı `opacity: 0` başlangıcını hiç görmüyor. En kötü ihtimalle okuyucu animasyonu görmüyor; içerik her durumda yerinde. JavaScript tamamen kapalı olsa da öyle, çünkü animasyonu tarayıcı çalıştırıyor.',
    },

    { type: 'h2', text: 'Yazı Sayfası En Çok Rahatlayan Yer Oldu' },
    {
      type: 'p',
      text: 'Blog gövdesinde her blok (her paragraf, her başlık, her kod bloğu) kendi animasyon bileşenine sarılıydı. Uzun bir yazıda bu, altmış bileşen ve altmış ayrı observer demek.',
    },
    {
      type: 'p',
      text: 'Görüntü olarak da iyi değildi. Bir kartın kaydırınca belirmesi hoş; okuduğun paragrafın gözünün önünde belirmesi rahatsız edici. Yazı gövdesindeki animasyonların hepsini kaldırdım.',
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
      text: 'Paketin içine bakarken beklemediğim bir şey çıktı: ana sayfanın JavaScript\'inde blog yazılarının tam metni duruyordu. Dokuz yazı, gzip ile 38 KB.',
    },
    {
      type: 'p',
      text: 'Sebep tek bir import\'tu. İstemci bileşenleri proje sıralaması için küçük bir yardımcı fonksiyon alıyordu; o fonksiyonun bulunduğu dosya ise blog yazılarını değer olarak import ediyordu.',
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
      text: 'Fonksiyonu veri import etmeyen kendi dosyasına (`lib/project-order.ts`) taşıyınca 38 KB gitti. Fonksiyonun kendisi zararsızdı; sorun bulunduğu dosyanın neleri import ettiğiydi. İstemci bileşeninin import ettiği her dosyanın kendi import\'larına da bakmak gerekiyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bu tür sızıntıyı en hızlı bulmanın yolu, build çıktısındaki paket dosyalarında yazılardan bir cümle aramak. Paket analiz araçları modül adı verir; "bu metin burada ne arıyor" sorusuna düz bir `grep` daha hızlı cevap veriyor.',
    },

    { type: 'h2', text: 'Ne Kaybettim' },
    {
      type: 'p',
      text: 'Bir şeyden vazgeçtim: sayfalar arası çıkış animasyonu.',
    },
    {
      type: 'p',
      text: 'Onu kütüphane varken de yapamıyordum. App Router yeni sayfayı çizerken eski ağacı beklemiyor, yani çıkış animasyonunu oynatacak bir eleman ortada kalmıyor. Bunu aşmanın yolları var ama hepsi gezinmeyi kasten geciktiriyor: kısa bir çıkış animasyonu için her tıklamaya o kadar bekleme eklemek.',
    },
    {
      type: 'p',
      text: 'Kütüphane gidince geriye kısa bir giriş animasyonu kaldı ve o da yalnızca CSS. Rota geçişini yapan dosya artık istemci bileşeni bile değil.',
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
      text: 'Ölçülen hız ile hissedilen hız aynı şey değil. Bütün ölçümler temizken birinin "takılıyor" demesi mümkün. Ölçümler sayfanın ne kadar hızlı çizildiğine bakıyor; insan ise kendi hareketine ne kadar geç cevap geldiğini hissediyor.',
    },
    {
      type: 'p',
      text: 'Bu sitede kütüphanenin yaptığı işlerin neredeyse hepsi CSS ile zaten yapılabiliyordu; kütüphane yalnızca daha az kafa yormama yarıyordu. Bunun için 76 KB ödemek fazlaydı.',
    },
    {
      type: 'p',
      text: 'Emin olmadığım tek şey kart eğimi. Kütüphanesiz hâli çalışıyor ama artık yay (spring) hareketi yok, düz bir CSS geçişi var. Belki bir gün onu da kaldırırım, belki de `linear()` geçiş eğrisiyle yaya benzetmeye çalışırım.',
    },
  ],
}

export default post
