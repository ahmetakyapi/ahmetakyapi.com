import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'spoiler-vermeyen-wiki',
  tag: 'Ürün',
  tagColor: '#ef4444',
  title: 'Bir Wiki\'nin En Zor İşi: Bilmediğin Şeyi Sana Göstermemek',
  excerpt:
    '1000 bölümlük bir seriyi 300. bölümden takip eden birine site nasıl görünmeli? One Piece Hub\'da asıl problem içerik toplamak değil, o içeriği okuyucunun nerede olduğuna göre saklamaktı.',
  date: '2026-04-15',
  coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
  content: [
    {
      type: 'lead',
      text: 'One Piece Hub\'ı yazarken en çok vaktimi alan şey karakter sayfaları ya da arama değildi. Şu soruydu: siteyi 300. bölümde olan biri açtığında ne görmeli? Çünkü bir wiki, doğası gereği her şeyi bilir — ve okuyucunun bilmediği şeyi ona göstermek, o kişinin yıllarını mahvetmek demek.',
    },
    {
      type: 'p',
      text: 'Türkçe kaynak arayan biri genelde iki seçenekle karşılaşıyor: ya İngilizce ve devasa bir wiki, ya da dağınık forum başlıkları. İkisinde de aynı risk var. Bir karakterin sayfasını açıyorsun, sağ üstteki kutuda "Durum: Ölü" yazıyor.',
    },

    { type: 'h2', text: 'Sitede Ne Var' },
    {
      type: 'p',
      text: 'Önce içerik tarafı, çünkü problemin büyüklüğü buradan anlaşılıyor:',
    },
    {
      type: 'stats',
      label: 'One Piece Hub · içerik',
      items: [
        { value: '67', note: 'karakter' },
        { value: '36', note: 'ark, 10 saga altında' },
        { value: '43', note: 'şeytan meyvesi' },
        { value: '46', note: 'ödül kaydı' },
        { value: '22', note: 'dövüş' },
        { value: '160', note: 'quiz sorusu' },
      ],
    },
    {
      type: 'p',
      text: 'Bunların üstünde ark ve bölüm takibi, tayfa sayfaları, güç sıralaması, haki rehberi ve başarımlar var. Yani sayfaların neredeyse tamamı, doğal hâliyle spoiler taşıyor.',
    },

    { type: 'h2', text: 'Spoiler Nedir, Kod Açısından' },
    {
      type: 'p',
      text: 'Buna somut bir tanım vermeden hiçbir şey yazamazsın. Denediğim ilk tanım "önemli olay" idi ve işe yaramadı — neyin önemli olduğu bir yargı çağrısı ve her içerik parçasında yeniden vermen gerekiyor.',
    },
    {
      type: 'p',
      text: 'Sonra çok daha basit bir tanıma indim: One Piece doğrusal ilerliyor. Her içerik parçası bir arka ait ve arklar sıralı. Okuyucu da bir arkta. Gerisi karşılaştırma.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'hooks/useSpoilerGate.ts',
      text: `/**
 * Bir içerik gizlenmeli mi?
 * Kapı açıksa, kullanıcı nerede olduğunu söylemişse ve hedef ark
 * kullanıcının bulunduğu arktan SONRA geliyorsa — evet.
 */
const isSpoiler = useCallback((arcSlug: string | undefined) => {
  if (!mounted || !state.enabled || !arcSlug) return false

  const targetIndex = ARCS.findIndex((a) => a.slug === arcSlug)
  // Ark bilinmiyorsa gizleme. Yanlış pozitif, sitenin yarısını
  // sebepsiz karartmak demek — belirsizlikte göstermek daha az zararlı.
  if (targetIndex === -1 || currentArcIndex === -1) return false

  return targetIndex > currentArcIndex
}, [mounted, state.enabled, currentArcIndex])`,
    },
    {
      type: 'p',
      text: 'O `targetIndex === -1` kontrolü kasıtlı ve önemli. Bir içeriğin arkı etiketlenmemişse gizlemiyorum. Alternatifi "bilmiyorsan sakla" olurdu ve o kural, etiketi eksik tek bir kayıt yüzünden sayfanın yarısını karartıyordu.',
    },
    {
      type: 'p',
      text: 'Bir de `mounted` kontrolü var. Tercih `localStorage`\'da duruyor, yani sunucu bilmiyor. Bu kontrol olmadan sayfa önce her şeyi gösterip sonra karartıyordu — spoiler koruması için mükemmel bir başarısızlık biçimi.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Gizleme mantığını istemciye koyduğumun farkındayım: teknik olarak isteyen HTML kaynağından her şeyi okuyabilir. Bu kabul edilebilir, çünkü tehdit modeli bir saldırgan değil — kendi gözünü korumaya çalışan bir okuyucu. Kilit değil, perde.',
    },

    { type: 'h2', text: 'Kullanıcıya "Neredesin" Diye Sormanın Yolu' },
    {
      type: 'p',
      text: 'Doğru sorunun ne olduğunu bulmak da ayrı bir işti. İlk denemem "kaçıncı bölümdesin?" diye bir sayı kutusuydu. Kimse doldurmadı. İnsanlar kaçıncı bölümde olduklarını hatırlamıyor — ama hangi olayda olduklarını gayet iyi biliyorlar.',
    },
    {
      type: 'p',
      text: 'Ark seçtirmeye geçtim ve kullanım belirgin şekilde arttı. Arkları saga başlıkları altında gruplayınca da liste gezilebilir hâle geldi; 36 ark düz bir liste olarak korkutucu görünüyor, 10 saga altında toplanınca değil.',
    },
    {
      type: 'p',
      text: 'Ekranın köşesindeki düğme de durumu sürekli gösteriyor: kapı açıkken kaçıncı arkta olduğunu yazıyor. Görünmeyen bir koruma, güvenilmeyen bir koruma.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'components/spoiler/SpoilerGateWidget.tsx',
      text: `{enabled
  ? currentArc
    ? \`Spoiler: \${currentArcIndex + 1}/\${totalArcs}\`   // "Spoiler: 14/36"
    : 'Spoiler Koru'
  : 'Spoiler Ayarı'}`,
    },

    { type: 'h2', text: 'Gizlenen Şey Nasıl Görünmeli' },
    {
      type: 'p',
      text: 'Burada iki seçenek vardı: içeriği tamamen kaldırmak ya da üstünü örtmek.',
    },
    {
      type: 'p',
      text: 'Kaldırmayı denedim ve tuhaf oldu — ark listesi ortadan kesiliyor, kullanıcı sitenin bozuk olduğunu sanıyor. Üstelik bir şeyin var olduğunu bilmek spoiler değil; ne olduğunu bilmek spoiler.',
    },
    {
      type: 'p',
      text: 'Şimdi kart yerinde duruyor, görseli bulanık, adı gizli ve üstünde "Spoiler" yazıyor. Tıklayınca tek o kart açılıyor — kapı kapanmıyor, sadece o kart için taviz veriliyor.',
    },
    {
      type: 'quote',
      text: 'İyi bir spoiler koruması, korumayı kaldırma kararını da kullanıcıya bırakır. "Bunu görmek istiyor musun" sorusu, sorunun kendisi spoiler olmadığı sürece adil bir soru.',
    },
    {
      type: 'p',
      text: 'Erişilebilirlik tarafında da bir detay var: bulanıklaştırılmış kartın `aria-label`\'ı içeriği ele vermiyor. Ekran okuyucu "Spoiler — gizli arc, göstermek için tıkla" diyor, ark adını okumuyor. Görselin `alt` metni de aynı şekilde değişiyor. Bulanıklık CSS\'te, ama ekran okuyucu CSS görmez.',
    },

    { type: 'h2', text: 'Karakter İlişkileri: Fizik Motoru Yazdım, Sonra Sildim' },
    {
      type: 'p',
      text: 'Sitenin ikinci uğraştırıcı parçası karakter ilişkileri ekranıydı ve orada da beklemediğim bir yere vardım.',
    },
    {
      type: 'p',
      text: 'Elimde 25 karakter ve aralarında elle yazılmış 29 bağ vardı — nakama, aile, rakiplik, düşmanlık, hoca-öğrenci, ittifak. Bunu force-directed bir grafla çizdim: düğümler birbirini iter, bağlı olanlar çeker, sistem kendi kendine dengeye oturur.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'ilk deneme — artık kodda yok',
      text: `const REPULSION = 800, SPRING = 0.02, DAMPING = 0.9

function step(nodes, links, dt) {
  // itme → çekme → sönümleme
  // ...
  for (const n of nodes) {
    n.vx *= DAMPING; n.vy *= DAMPING
    // Bu iki satırı ilk yazışta unutmuştum: hızlar hesaplanıyor ama
    // konuma hiç uygulanmıyordu, yani hiçbir düğüm kıpırdamıyordu.
    n.x += n.vx * dt; n.y += n.vy * dt
  }
}`,
    },
    {
      type: 'p',
      text: 'Çalıştı ve güzel görünüyordu. Bir hafta sonra sildim, çünkü kendim bile kullanmıyordum.',
    },
    {
      type: 'ol',
      items: [
        'Her açılışta yerleşim farklı çıkıyordu. Luffy bir seferinde solda, bir seferinde sağda; ikinci ziyaretinde hiçbir şey tanıdık gelmiyor.',
        'Simülasyon otururken düğümler zıplıyordu. Bunu "yükleniyor" hissi sandım; kullanıcı "bozuk" olarak okudu.',
        'Mobilde 25 düğüm 375 piksele sığmıyor. Sürükle-yakınlaştır gerekiyordu ve o hareket sayfanın kendi kaydırmasıyla çakışıyordu.',
        'Bir karaktere tıklayınca ilişkilerini görmek istiyorsun; fizik yerleşiminde ilgili düğümler ekranın dört bir yanına dağılmış oluyor.',
      ],
    },
    {
      type: 'p',
      text: 'Yerine karakterleri bir çembere eşit aralıklarla dizdim. Sekiz satır, fizik yok, rastgelelik yok.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'components/characters/RelationshipGraph.tsx',
      text: `function getCircularLayout(count: number, cx: number, cy: number, r: number) {
  return Array.from({ length: count }).map((_, i) => {
    // -PI/2 kayması ilk karakteri tam tepeye alıyor; onsuz sağdan
    // başlıyor ve kompozisyon eğri duruyor.
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
}`,
    },
    {
      type: 'p',
      text: 'Asıl kazanç şuydu: yerleşim sabit olduğu için ilişki türüne göre filtre anlamlı hâle geldi. "Sadece düşmanlıklar" dediğinde çember aynı kalıyor, sadece çizgiler değişiyor — karşılaştırma yapabiliyorsun. Force-directed\'da her filtre yeni bir düzen demekti.',
    },
    {
      type: 'quote',
      text: 'Force-directed layout bir keşif aracıdır: yapısını bilmediğin bir grafta küme aramak için iyidir. Ben zaten yapıyı biliyordum — 25 karakter, elle yazdığım 29 bağ.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'İkisi de aynı derse çıkıyor aslında. Spoiler kapısında da, grafta da ilk çözümüm teknik olarak daha etkileyici olandı: "önemli olayı" tespit etmeye çalışmak, fiziği simüle etmek. İkisinde de işe yarayan çözüm daha aptal olanıydı — sıralı bir dizide indeks karşılaştırmak, düğümleri çembere dizmek.',
    },
    {
      type: 'p',
      text: 'İkinci ders spoiler tarafından: bir koruma özelliğinin en önemli parçası, koruduğunu göstermesi. Sessizce çalışan bir spoiler kapısına kimse güvenmez ve güvenilmeyen bir koruma kapatılır.',
    },
    {
      type: 'p',
      text: 'Sildiğim fizik kodunu hâlâ bir yerde saklıyorum. Karakter sayısı üç haneye çıkarsa geri getireceğim — o zaman gerçekten keşif aracına ihtiyacım olacak.',
    },
  ],
}

export default post
