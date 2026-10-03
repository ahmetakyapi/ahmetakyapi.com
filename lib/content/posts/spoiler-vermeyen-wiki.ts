import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'spoiler-vermeyen-wiki',
  tag: 'Ürün',
  tagColor: '#ef4444',
  title: "One Piece Hub: Spoiler'a Girmeden Gez",
  excerpt:
    'Bin bölümlük seriyi 300. bölümden izleyen biri siteyi açınca ne görmeli? İçeriği toplamak kolaydı; onu okuyucunun kaldığı yere göre saklamak daha uzun sürdü.',
  date: '2026-09-01',
  coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
  content: [
    {
      type: 'lead',
      text: 'One Piece Hub\'da en çok uğraştığım soru şuydu: siteyi 300. bölümde olan biri açınca ne görmeli? Bir wiki her şeyi bilir. Okuyucunun henüz izlemediği bir olayı ona göstermek, yıllardır takip ettiği bir hikâyeyi elinden almak demek.',
    },
    {
      type: 'p',
      text: 'Wikilerde bunun tipik örneği karakter sayfası: sayfayı açıyorsun, sağ üstteki kutuda "Durum: Ölü" yazıyor.',
    },

    { type: 'h2', text: 'Sitede Ne Var' },
    {
      type: 'p',
      text: 'Saklanacak şeyin ne kadar olduğu içerikten belli:',
    },
    {
      type: 'stats',
      label: 'One Piece Hub · İçerik',
      items: [
        { value: '66', note: 'Karakter' },
        { value: '36', note: 'Ark, 10 Saga Altında' },
        { value: '43', note: 'Şeytan Meyvesi' },
        { value: '38', note: 'Ödül Kaydı' },
        { value: '22', note: 'Dövüş' },
        { value: '160', note: 'Quiz Sorusu' },
      ],
    },
    {
      type: 'p',
      text: 'Bunların yanında ark ve bölüm takibi, tayfa sayfaları, güç sıralaması, haki rehberi ve başarımlar var. Sayfaların neredeyse hepsi spoiler taşıyabiliyor.',
    },

    { type: 'h2', text: 'Spoiler Nedir, Kod Açısından' },
    {
      type: 'p',
      text: 'Kod yazmak için somut bir tanım lazım. "Önemli olay" gibi bir tanım işe yaramazdı: neyin önemli olduğu bir yargı ve her içerik parçası için ayrı ayrı verilmesi gerekir.',
    },
    {
      type: 'p',
      text: 'Kodda çok daha basit bir tanım var. One Piece sırayla ilerliyor; her içerik bir arka ait ve arklar sıralı. Okuyucu da bir arkta. Gerisi iki sayıyı karşılaştırmak.',
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
      text: '`targetIndex === -1` kontrolü bilinçli. Bir içeriğin arkı etiketlenmemişse gizlemiyorum. Öteki seçenek "bilmiyorsan sakla" olurdu ve o kural, etiketi eksik tek bir kayıt yüzünden sayfaları sebepsiz yere karartırdı. Emin değilken göstermek daha az zarar veriyor.',
    },
    {
      type: 'p',
      text: '`active` içindeki `mounted` da bir iş görüyor. Tercih `localStorage`\'da duruyor, yani sunucu onu bilmiyor. Bu kontrol olmasa sayfa önce her şeyi gösterip sonra karartabilirdi; spoiler koruması için bundan kötüsü yok.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Gizleme mantığı tarayıcıda çalışıyor. İsteyen HTML kaynağından her şeyi okuyabilir. Bunu kabul ettim, çünkü burada korunan kişi kendi gözünü korumaya çalışan bir okuyucu. Bu bir kilit olarak tasarlanmadı, bir perde olarak tasarlandı.',
    },

    { type: 'h2', text: 'Okuyucuya "Neredesin" Diye Sormak' },
    {
      type: 'p',
      text: 'Okuyucuya kaçıncı bölümde olduğu sorulmuyor; sitede bölüm numarası girilen bir kutu yok, deponun geçmişinde de hiç olmamış. Okuyucu bir ark seçiyor. Bölüm numarası akılda kalmayabilir, ama Alabasta\'yı bitirip bitirmediğini herkes bilir.',
    },
    {
      type: 'p',
      text: 'Seçici 36 arkı 10 saga başlığı altında gruplayarak gösteriyor. Düz bir liste uzun bir kaydırma demek; saga başlıkları okuyucunun kendi yerini bulmasını kolaylaştırıyor.',
    },
    {
      type: 'p',
      text: 'Ekranın köşesindeki düğme durumu sürekli gösteriyor. Koruma açıkken kaçıncı arkta olduğunu yazıyor; açık ama ark seçilmemişse korumanın çalıştığını iddia etmiyor, ark seçmeni istiyor. Telefonda bu düğme yalnızca bir göz ikonu, yazı sm kırılımından itibaren görünüyor.',
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
      text: 'Yukarıdaki düğme dört aydan uzun bir süre yanlış bilgi verdi. Kapı 18 Nisan\'da eklendi, 31 Ağustos\'ta düzeldi.',
    },
    {
      type: 'p',
      text: '`useSpoilerGate` başta düz bir hook\'tu ve onu çağıran her bileşen kendi `useState`\'ini kuruyordu. Köşedeki düğmenin bir kopyası vardı, listedeki her ark kartının da ayrı bir kopyası. 36 ark, 36 ayrı state. Düğmeden ark seçince yalnızca düğmenin kopyası değişiyordu: düğme "Spoiler: 14/36" yazıyor, kartlar ise sayfa yenilenene kadar hiçbir şeyi gizlemiyordu.',
    },
    {
      type: 'compare',
      label: 'Koruma Aç, Ark Seç, Sayfayı Yenileme',
      before: { label: 'Düz Hook', value: '0 Kart Gizli' },
      after: { label: 'Context Sağlayıcı', value: '35 Kart Gizli' },
      note: 'Mantık baştan doğruydu: tercihi localStorage\'a elle yazıp sayfayı yenileyince aynı 35 kart gizleniyordu. Eksik olan, state\'in bileşenler arasında paylaşılmasıydı.',
    },
    {
      type: 'p',
      text: 'Düzeltme, hook\'u tema ve oturum sağlayıcılarıyla aynı yapıda bir Context sağlayıcıya çevirmek oldu. Yanına iki küçük karar ekledim. Ark seçmek korumayı kendiliğinden açıyor, çünkü niyeti belli eden adım o; eskiden iki ayrı adım gerekiyordu ve birini atlayınca hiçbir şey olmuyor, sebebi de söylenmiyordu. Ayrıca durum artık her zaman yazıyla bildiriliyor: kaç arkın gizlendiği, ark seçmen gerektiği ya da korumanın duraklatıldığı.',
    },
    {
      type: 'quote',
      text: 'Görünmeyen bir korumaya kimse güvenmez. Görünüp çalışmayan bir koruma daha kötü, çünkü güveni hak etmeden kazanır.',
    },

    { type: 'h2', text: 'Gizlenen Şey Nasıl Görünmeli' },
    {
      type: 'p',
      text: 'İki seçenek vardı: içeriği tamamen kaldırmak ya da üstünü örtmek. Kaldırmak ark listesini ortasından keserdi ve okuyucu sitenin bozuk olduğunu sanırdı. Üstelik bir arkın var olduğunu bilmek spoiler sayılmaz; içinde ne olduğunu bilmek sayılır.',
    },
    {
      type: 'p',
      text: 'Kodda gizli bir kart şöyle duruyor: görsel bulanık, ark adı ve özet metni de bulanık ve seçilemiyor, saga rozeti ile bölüm sayısı hiç çizilmiyor, üstünde "Spoiler" ve "Göstermek için tıkla" yazıyor. Tıklayınca yalnızca o kart açılıyor; koruma kapanmıyor. Gizlenmeyen şeyler de var. Kartın alt satırındaki ilk iki tema etiketi bulanıklaşmıyor; Egghead arkında bu etiketlerden biri "Void Century". Kartın listedeki yeri de görünüyor, yani kaç ark kaldığı belli.',
    },
    {
      type: 'quote',
      text: 'İyi bir spoiler koruması, korumayı kaldırma kararını da okuyucuya bırakır. "Bunu görmek istiyor musun" sorusu, sorunun kendisi bir şey ele vermediği sürece adil.',
    },
    {
      type: 'p',
      text: 'Erişilebilirlik tarafında bir tutarsızlık var. Bulanıklık CSS\'te, ekran okuyucu ise CSS görmez. Gizli kartın `aria-label`\'ı ark adını okumuyor; "Spoiler: … gizli arc. Göstermek için tıkla." diyor ve görselin `alt` metni "Spoiler gizli" oluyor. Üç noktanın yerine saganın adı giriyor. Yani gören okuyucudan saklanan saga rozeti, ekran okuyucu kullanan okuyucuya yüksek sesle söyleniyor. İki taraf aynı kuralı izlemiyor.',
    },

    { type: 'h2', text: 'Karakter İlişkileri: Neden Çember' },
    {
      type: 'p',
      text: 'Sitenin uğraştıran ikinci parçası karakter ilişkileri ekranıydı. Elimde 25 karakter ve aralarında elle yazılmış 29 bağ var: nakama, aile, rakiplik, düşmanlık, hoca-öğrenci, ittifak.',
    },
    {
      type: 'p',
      text: 'Veri dosyasının başındaki yorum hâlâ "force-directed graph için kullanılır" diyor: düğümler birbirini iter, bağlı olanlar birbirini çeker, sistem kendi dengesini bulur. Depoya giren ekranda ise ilk günden beri düğümler bir çemberin üzerinde eşit aralıklarla duruyor. Sekiz satır; fizik yok, rastgelelik yok.',
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
      text: 'Çemberin kazancı yerinden oynamaması. Luffy her ziyarette aynı yerde duruyor ve ilişki türüne göre filtre bir anlam kazanıyor: "sadece düşmanlıklar" dediğinde çember aynı kalıyor, yalnızca çizgiler değişiyor. İki görünümü bu sayede karşılaştırabiliyorsun. Fizik tabanlı yerleşimde her filtre yeni bir düzen demek olurdu.',
    },
    {
      type: 'quote',
      text: 'Force-directed yerleşim, yapısını bilmediğin bir grafta küme aramak için iyidir. Ben yapıyı zaten biliyordum: 25 karakter ve elle yazdığım 29 bağ.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'İki parçada da işe yarayan çözüm daha sade olanıydı. Spoiler kapısı sıralı bir dizide iki indeksi karşılaştırıyor. Graf, fizik hesaplamak yerine düğümleri çembere diziyor.',
    },
    {
      type: 'p',
      text: 'Kapının kapsamı da hâlâ dar. `isSpoiler` bugün yalnızca ark listesindeki kartlarda çağrılıyor. Karakterlerin ilk göründüğü ark (`firstArc`) veride var, ama karakter sayfaları kapıya bağlı değil. Girişteki "Durum: Ölü" örneğine karşı site henüz bir şey yapmıyor.',
    },
  ],
}

export default post
