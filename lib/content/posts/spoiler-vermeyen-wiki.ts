import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'spoiler-vermeyen-wiki',
  tag: 'Ürün',
  tagColor: '#ef4444',
  title: "One Piece Hub: Spoiler'a Girmeden Gez",
  excerpt:
    'Bin bölümlük bir seriyi 300. bölümden izleyen biri siteyi açınca ne görmeli? İçerik toplamak kolaydı; zor olan, onu okuyucunun kaldığı yere göre saklamaktı.',
  date: '2026-04-15',
  coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
  content: [
    {
      type: 'lead',
      text: 'One Piece Hub\'da en çok vaktimi alan şey karakter sayfaları ya da arama olmadı. Şu soru oldu: siteyi 300. bölümde olan biri açınca ne görmeli? Bir wiki doğası gereği her şeyi bilir. Okuyucunun henüz bilmediğini ona göstermek, yıllardır izlediği bir hikâyeyi elinden almak demek.',
    },
    {
      type: 'p',
      text: 'Türkçe kaynak arayan biri genelde iki seçenekle karşılaşıyor: ya İngilizce ve devasa bir wiki, ya da dağınık forum başlıkları. İkisinde de aynı risk var. Bir karakterin sayfasını açıyorsun, sağ üstteki kutuda "Durum: Ölü" yazıyor.',
    },

    { type: 'h2', text: 'Sitede Ne Var' },
    {
      type: 'p',
      text: 'Problemin büyüklüğü içerikten anlaşılıyor:',
    },
    {
      type: 'stats',
      label: 'One Piece Hub · İçerik',
      items: [
        { value: '67', note: 'Karakter' },
        { value: '36', note: 'Ark, 10 Saga Altında' },
        { value: '43', note: 'Şeytan Meyvesi' },
        { value: '38', note: 'Ödül Kaydı' },
        { value: '22', note: 'Dövüş' },
        { value: '160', note: 'Quiz Sorusu' },
      ],
    },
    {
      type: 'p',
      text: 'Bunların üstünde ark ve bölüm takibi, tayfa sayfaları, güç sıralaması, haki rehberi ve başarımlar var. Sayfaların neredeyse tamamı, doğal hâliyle spoiler taşıyor.',
    },

    { type: 'h2', text: 'Spoiler Nedir, Kod Açısından' },
    {
      type: 'p',
      text: 'Somut bir tanım olmadan tek satır kod yazılmıyor. İlk aklıma gelen tanım "önemli olay"dı ve işe yaramazdı: neyin önemli olduğu bir yargı ve her içerik parçasında yeniden verilmesi gerekiyor.',
    },
    {
      type: 'p',
      text: 'Çok daha basit bir tanıma indim. One Piece doğrusal ilerliyor; her içerik parçası bir arka ait ve arklar sıralı. Okuyucu da bir arkta. Gerisi karşılaştırma.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'hooks/useSpoilerGate.tsx',
      text: `const active = mounted && state.enabled && currentArcIndex !== -1

const isSpoiler = useCallback((arcSlug: string | undefined) => {
  if (!active || !arcSlug) return false
  const targetIndex = ARCS.findIndex(a => a.slug === arcSlug)
  if (targetIndex === -1) return false
  return targetIndex > currentArcIndex
}, [active, currentArcIndex])`,
    },
    {
      type: 'p',
      text: '`targetIndex === -1` kontrolü kasıtlı. Bir içeriğin arkı etiketlenmemişse gizlemiyorum. Öteki seçenek "bilmiyorsan sakla" olurdu ve o kural, etiketi eksik tek bir kayıt yüzünden sayfaları sebepsiz karartırdı. Belirsizlikte göstermek daha az zararlı.',
    },
    {
      type: 'p',
      text: '`active` içindeki `mounted` da önemli. Tercih `localStorage`\'da duruyor, yani sunucu bilmiyor. Bu kontrol olmasa sayfa önce her şeyi gösterip sonra karartırdı; spoiler koruması için bundan kötü bir hata düşünemiyorum.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Gizleme mantığı istemcide. Teknik olarak isteyen HTML kaynağından her şeyi okuyabilir. Bunu kabul ettim, çünkü korunmak istenen kişi bir saldırgan değil, kendi gözünü korumaya çalışan bir okuyucu. Kilit değil, perde.',
    },

    { type: 'h2', text: 'Kullanıcıya "Neredesin" Diye Sormak' },
    {
      type: 'p',
      text: 'Doğru soruyu bulmak ayrı bir işti. İlk denemem "kaçıncı bölümdesin?" diye bir sayı kutusuydu ve kendim bile dolduramadım. İnsanlar kaçıncı bölümde olduklarını hatırlamıyor ama hangi olayda olduklarını gayet iyi biliyor.',
    },
    {
      type: 'p',
      text: 'Ark seçtirmeye geçince iş kendiliğinden çözüldü. Arkları saga başlıkları altında gruplamak da gerekliydi: 36 ark düz bir liste olarak korkutucu görünüyor, 10 saga altında toplanınca değil.',
    },
    {
      type: 'p',
      text: 'Ekranın köşesindeki düğme durumu sürekli gösteriyor. Koruma açıkken kaçıncı arkta olduğunu yazıyor; açık ama ark seçilmemişse koruma iddia etmiyor, ark seçmeni istiyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'components/spoiler/SpoilerGateWidget.tsx',
      text: `{active
  ? \`Spoiler: \${currentArcIndex + 1}/\${totalArcs}\`   // "Spoiler: 14/36"
  : enabled ? 'Arc Seç' : 'Spoiler Ayarı'}`,
    },

    { type: 'h2', text: 'Kapı Aylarca Hiçbir Şeyi Kapatmamış' },
    {
      type: 'p',
      text: 'Bu bölümü sonradan ekledim, çünkü yukarıdaki düğme dört aydan uzun bir süre yalan söyledi.',
    },
    {
      type: 'p',
      text: '`useSpoilerGate` başta düz bir hook\'tu ve çağıran her bileşen kendi `useState`\'ini kuruyordu. Köşedeki düğmenin bir kopyası vardı, listedeki her ark kartının ayrı bir kopyası. 36 ark, 36 bağımsız durum. Düğmeden ark seçince yalnızca düğmenin kopyası değişiyordu: düğme "Spoiler: 14/36" yazıyor, kartlar sayfa yenilenene kadar hiçbir şeyi gizlemiyordu.',
    },
    {
      type: 'compare',
      label: 'Koruma Aç, Ark Seç, Sayfayı Yenileme',
      before: { label: 'Düz Hook', value: '0 Kart Gizli' },
      after: { label: 'Context Sağlayıcı', value: '35 Kart Gizli' },
      note: 'Mantık baştan doğruydu: tercihi elle yazıp sayfayı yenileyince aynı 35 kart gizleniyordu. Eksik olan paylaşımdı.',
    },
    {
      type: 'p',
      text: 'Düzeltme, hook\'u tema ve oturum sağlayıcılarıyla aynı desende bir Context sağlayıcıya çevirmek oldu. Yanına iki küçük karar ekledim. Ark seçmek korumayı kendiliğinden açıyor, çünkü niyeti belli eden eylem o; eskiden iki ayrı adım gerekiyordu ve birini atlayınca hiçbir şey olmuyor, sebebi de söylenmiyordu. Ayrıca durum artık her zaman yazıyla bildiriliyor: kaç arkın gizlendiği, ark seçmen gerektiği ya da korumanın duraklatıldığı.',
    },
    {
      type: 'quote',
      text: 'Görünmeyen bir koruma güvenilmez. Görünüp çalışmayan bir koruma ondan da kötü, çünkü güveni boşuna kazanır.',
    },

    { type: 'h2', text: 'Gizlenen Şey Nasıl Görünmeli' },
    {
      type: 'p',
      text: 'İki seçenek vardı: içeriği tamamen kaldırmak ya da üstünü örtmek. Kaldırmak ark listesini ortadan keserdi ve okuyucu sitenin bozuk olduğunu sanırdı. Üstelik bir şeyin var olduğunu bilmek spoiler değil; ne olduğunu bilmek spoiler.',
    },
    {
      type: 'p',
      text: 'Kart yerinde duruyor; görseli bulanık, adı gizli ve üstünde "Spoiler" yazıyor. Tıklayınca yalnızca o kart açılıyor. Koruma kapanmıyor, sadece o kart için taviz veriliyor.',
    },
    {
      type: 'quote',
      text: 'İyi bir spoiler koruması, korumayı kaldırma kararını da okuyucuya bırakır. "Bunu görmek istiyor musun" sorusu, sorunun kendisi spoiler olmadığı sürece adil bir soru.',
    },
    {
      type: 'p',
      text: 'Erişilebilirlik tarafında da bir ayrıntı var. Bulanıklık CSS\'te, ama ekran okuyucu CSS görmez. Gizli kartın `aria-label`\'ı ark adını okumuyor; "Spoiler: … gizli arc. Göstermek için tıkla." diyor ve görselin `alt` metni "Spoiler gizli" oluyor. Boşluğa saganın adı giriyor. Saga adının kendisinin ipucu olup olmadığından hâlâ emin değilim.',
    },

    { type: 'h2', text: 'Karakter İlişkileri: Neden Çember' },
    {
      type: 'p',
      text: 'Sitenin ikinci uğraştırıcı parçası karakter ilişkileri ekranıydı. Elimde 25 karakter ve aralarında elle yazılmış 29 bağ var: nakama, aile, rakiplik, düşmanlık, hoca-öğrenci, ittifak.',
    },
    {
      type: 'p',
      text: 'Veri dosyasının başındaki yorum hâlâ "force-directed graph için kullanılır" diyor. Planım buydu: düğümler birbirini iter, bağlı olanlar çeker, sistem kendi dengesini bulur. Depoya giren ekranda ise ilk günden beri düğümler bir çemberin üzerinde eşit aralıklarla duruyor. Sekiz satır, fizik yok, rastgelelik yok.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'components/characters/RelationshipGraph.tsx',
      text: `function getCircularLayout(count: number, centerX: number, centerY: number, radius: number) {
  return Array.from({ length: count }).map((_, i) => {
    // -PI/2 kayması ilk karakteri tam tepeye alıyor
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
}`,
    },
    {
      type: 'p',
      text: 'Çemberin asıl kazancı sabit olması. Luffy her ziyarette aynı yerde duruyor ve ilişki türüne göre filtre anlamlı hâle geliyor: "sadece düşmanlıklar" dediğinde çember aynı kalıyor, yalnızca çizgiler değişiyor, yani iki görünümü yan yana karşılaştırabiliyorsun. Fizik yerleşiminde her filtre yeni bir düzen demek olurdu.',
    },
    {
      type: 'quote',
      text: 'Force-directed yerleşim bir keşif aracı: yapısını bilmediğin bir grafta küme aramak için iyidir. Ben yapıyı zaten biliyordum; 25 karakter ve elle yazdığım 29 bağ.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'İki parçada da işe yarayan çözüm, teknik olarak daha sade olanıydı. Spoiler kapısı "önemli olayı" tespit etmeye çalışmıyor, sıralı bir dizide indeks karşılaştırıyor. Graf fiziği simüle etmiyor, düğümleri çembere diziyor.',
    },
    {
      type: 'p',
      text: 'Spoiler kapısının asıl dersi ise sonradan geldi. Mantığı doğru yazmıştım ve düğme durumu doğru gösteriyordu; ikisi birbirine bağlı değildi ve kapı Nisan\'dan Ağustos sonuna kadar öyle kaldı. Bir korumayı test etmenin yolu ekranda yazana bakmak değil, gizlenmesi gereken kartı saymakmış.',
    },
  ],
}

export default post
