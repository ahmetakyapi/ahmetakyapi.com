import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'spoiler-vermeyen-wiki',
  tag: 'Ürün',
  tagColor: '#ef4444',
  title: 'One Piece Hub: Spoiler Vermeyen Türkçe Wiki',
  excerpt:
    "One Piece Hub, bin bölümlük seriyi Türkçe ve düzenli gezmek için yaptığım bir fan sitesi. Kaldığın arkı söylüyorsun, sonrasına ait her şey perdeleniyor. Sitede ne var ve o perdeyi nasıl kurdum.",
  date: '2026-09-01',
  coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
  content: [
    {
      type: 'lead',
      text: "One Piece Hub, One Piece evrenini Türkçe gezmek için yaptığım bir fan sitesi. Binden fazla bölümü arklara göre düzenliyor, filler bölümleri ayıklıyor, karakterleri, şeytan meyvelerini ve büyük savaşları tek bir yerde topluyor ve en önemlisi, kaldığın yerden sonrasını sana göstermiyor. Çünkü bir wiki her şeyi bilir ve seriyi 300. bölümde izleyen birine 900. bölümdeki olayı göstermek, yıllardır takip ettiği hikâyeyi elinden almak demek.",
    },
    {
      type: 'p',
      text: 'Seriyi Türkçe takip eden biri için mevcut kaynaklar ya İngilizce, ya filler dolu, ya da dağınık. Ben hem düzenli bir rehber istedim hem de bir anime wikisinin koyu temalı, hareketli bir arayüzle nasıl hissettirebileceğini görmek istedim. Sonuç bir rehber kadar bir deneme alanı da oldu.',
    },

    { type: 'h2', text: 'Sitede Neler Var' },
    {
      type: 'stats',
      label: 'One Piece Hub · İçerik',
      items: [
        { value: '36', note: 'Ark, 10 Saga Altında' },
        { value: '460+', note: 'Bölüm, Fillersız Düzende' },
        { value: '66', note: 'Karakter' },
        { value: '43', note: 'Şeytan Meyvesi' },
        { value: '22', note: 'Büyük Savaş' },
        { value: '160', note: 'Quiz Sorusu' },
      ],
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Arklar ve Bölümler',
          text: 'Seri on saga ve otuz altı ark olarak düzenli. Her arkın bölümleri filler ayıklanmış sırayla listeleniyor; hangi bölümü izlediğini işaretleyip kaldığın yeri hatırlayabiliyorsun. Hesap açarsan ilerleme veritabanına, açmazsan tarayıcına yazılıyor.',
        },
        {
          title: 'Karakterler ve Tayfalar',
          text: 'Her karakterin sayfası, ödül geçmişi, tayfası ve ilk göründüğü ark. Karakter ilişkileri ekranında kimin kiminle nakama, aile, rakip ya da düşman olduğunu tek bakışta görüyorsun.',
        },
        {
          title: 'Dünya',
          text: 'Şeytan meyveleri, haki rehberi, lokasyonlar, güç sıralaması ve serinin büyük dövüşleri. Her biri kendi sayfasında, kendi görseliyle.',
        },
        {
          title: 'Quiz ve Başarımlar',
          text: 'Her ark için beş ile on soruluk bir quiz, seri takibi ve küçük ses efektleri. Skorlar hesabına yazılıyor, yüksek skor eskisinin üstüne geçiyor.',
        },
        {
          title: 'Komut Paleti',
          text: "⌘K ile açılan bir arama: karakter, ark, meyve ya da sayfa adı yazıp doğrudan gidiyorsun. Telefonda alt menü ve tam ekran arama var.",
        },
      ],
    },

    { type: 'h2', text: 'Nasıl Kurdum' },
    {
      type: 'p',
      text: "Site Next.js 14 ve TypeScript ile yazıldı; stil Tailwind, hareket Framer Motion. İçeriğin tamamı, yani arklar, karakterler, meyveler ve quiz soruları veritabanında değil, tipli TypeScript dosyalarında duruyor. Bu sayede içerik sayfaları derleme anında üretiliyor ve git'te sürümleniyor; bir karakterin adını yanlış yazarsam derleme hata veriyor.",
    },
    {
      type: 'p',
      text: 'Veritabanı yalnızca kullanıcıya ait şeyleri tutuyor: izleme ilerlemesi ve quiz skorları. Neon üzerinde Postgres, Drizzle ile. Giriş kendi yazdığım küçük bir JWT akışı; çerezde duruyor, otuz gün geçerli. Sayfalar arası geçişlerde karakter kartı kendi sayfasının kapağına dönüşüyor; bunu tarayıcının View Transitions özelliği yapıyor.',
    },
    {
      type: 'p',
      text: "Sitenin asıl zor kısmı bunların hiçbiri değildi. Zor kısım, bütün bu içeriği okuyan kişinin kaldığı yere göre saklamaktı.",
    },

    { type: 'h2', text: 'Spoiler Nedir, Kod Açısından' },
    {
      type: 'p',
      text: "Kod yazmak için somut bir tanım gerekiyordu. \"Önemli olay\" gibi bir tanım işe yaramazdı; neyin önemli olduğu bir yargı ve her içerik parçası için ayrı ayrı verilmesi gerekir. Oysa One Piece sırayla ilerliyor: her içerik bir arka ait, arklar sıralı, okuyan kişi de bir arkta. Gerisi iki sayıyı karşılaştırmak.",
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'hooks/useSpoilerGate.tsx',
      text: `const isSpoiler = useCallback((arcSlug: string | undefined) => {
  if (!active || !arcSlug) return false
  const targetIndex = ARCS.findIndex(a => a.slug === arcSlug)
  if (targetIndex === -1) return false
  return targetIndex > currentArcIndex
}, [active, currentArcIndex])`,
    },
    {
      type: 'p',
      text: 'Bilinmeyen ark için "gizleme" kararı bilinçli. Bir içeriğin arkı etiketlenmemişse onu saklamıyorum. Öteki seçenek "emin değilsen sakla" olurdu ve o kural, etiketi eksik tek bir kayıt yüzünden sayfaları sebepsiz yere karartırdı. Emin değilken göstermek daha az zarar veriyor.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Gizleme tarayıcıda çalışıyor; isteyen sayfa kaynağından her şeyi okuyabilir. Bunu baştan kabul ettim. Burada korunan kişi kendi gözünü korumaya çalışan bir okuyucu. Bu bir kilit değil, bir perde.',
    },

    { type: 'h2', text: 'Okuyucuya "Neredesin" Diye Sormak' },
    {
      type: 'p',
      text: "Okuyucuya kaçıncı bölümde olduğunu sormuyorum; bölüm numarası kimsenin aklında kalmaz. Ama Alabasta'yı bitirip bitirmediğini herkes bilir. O yüzden bir ark seçiyorsun. Seçici otuz altı arkı on saga başlığı altında gruplayarak gösteriyor; düz bir liste uzun bir kaydırma olurdu.",
    },
    {
      type: 'p',
      text: 'Ekranın köşesindeki küçük düğme durumu sürekli söylüyor: koruma açıksa kaçıncı arkta olduğunu, açık ama ark seçilmemişse ark seçmen gerektiğini. Çalıştığını iddia etmeden önce gerçekten çalışıyor olması gerekiyor; bunu zor yoldan öğrendim.',
    },

    { type: 'h2', text: 'Perde Aylarca Hiçbir Şeyi Örtmemiş' },
    {
      type: 'p',
      text: "Spoiler korumasını siteye eklediğim günden dört ay sonrasına kadar o köşedeki düğme yanlış bilgi verdi. Koruma düz bir React hook'uydu ve onu çağıran her bileşen kendi state'ini kuruyordu. Düğmenin bir kopyası vardı, listedeki her ark kartının da ayrı bir kopyası. Düğmeden ark seçince yalnızca düğmenin kopyası değişiyordu. Düğme \"Spoiler: 14/36\" yazıyor, kartlar ise sayfa yenilenene kadar hiçbir şeyi gizlemiyordu.",
    },
    {
      type: 'compare',
      label: 'Koruma Aç, Ark Seç, Sayfayı Yenileme',
      before: { label: 'Düz Hook', value: '0 Kart Gizli' },
      after: { label: 'Ortak Sağlayıcı', value: '35 Kart Gizli' },
      note: "Mantık baştan doğruydu: tercihi elle yazıp sayfayı yenileyince aynı 35 kart gizleniyordu. Eksik olan, durumun bileşenler arasında paylaşılmasıydı.",
    },
    {
      type: 'p',
      text: 'Düzeltme, hook\'u tema ve oturum sağlayıcılarıyla aynı yapıda tek bir Context sağlayıcıya çevirmek oldu. Yanına iki küçük karar ekledim. Ark seçmek korumayı kendiliğinden açıyor, çünkü niyeti belli eden adım o. Ve durum artık her zaman yazıyla bildiriliyor: kaç ark gizlendi, ark seçmen gerekiyor mu, koruma duraklatıldı mı.',
    },
    {
      type: 'quote',
      text: 'Görünmeyen bir korumaya kimse güvenmez. Görünüp çalışmayan bir koruma daha kötü, çünkü güveni hak etmeden kazanır.',
    },

    { type: 'h2', text: 'Gizlenen Şey Nasıl Görünmeli' },
    {
      type: 'p',
      text: 'İki seçenek vardı: içeriği tamamen kaldırmak ya da üstünü örtmek. Kaldırmak ark listesini ortasından keserdi ve okuyan kişi sitenin bozuk olduğunu sanırdı. Üstelik bir arkın var olduğunu bilmek spoiler sayılmaz; içinde ne olduğunu bilmek sayılır.',
    },
    {
      type: 'p',
      text: 'Gizli bir kart şöyle duruyor: görsel bulanık, ark adı ve özet bulanık ve seçilemiyor, bölüm sayısı hiç çizilmiyor, üstünde "Spoiler" ve "göstermek için tıkla" yazıyor. Tıklayınca yalnızca o kart açılıyor, koruma kapanmıyor. Kararı okuyan kişiye bırakıyorum; "bunu görmek istiyor musun" sorusu, sorunun kendisi bir şey ele vermediği sürece adil.',
    },
    {
      type: 'p',
      text: "Burada dürüst olmam gereken bir eksik var. Bulanıklık CSS'te ve ekran okuyucu CSS görmez. Gizli kartın erişilebilir adı ark adını okumuyor ama saga adını söylüyor; yani gören okuyucudan saklanan bir bilgi, ekran okuyucu kullanan okuyucuya yüksek sesle söyleniyor. İki taraf aynı kuralı izlemiyor ve bunu henüz düzeltmedim.",
    },

    { type: 'h2', text: 'Karakter İlişkileri: Neden Çember' },
    {
      type: 'p',
      text: 'Sitenin uğraştıran ikinci parçası karakter ilişkileri ekranıydı. Elimde yirmi beş karakter ve aralarında elle yazdığım yirmi dokuz bağ var: nakama, aile, rakiplik, düşmanlık, hoca-öğrenci, ittifak. Böyle ekranlar genelde fizik tabanlı çizilir; düğümler birbirini iter, bağlı olanlar birbirini çeker, sistem kendi dengesini bulur.',
    },
    {
      type: 'p',
      text: 'Ben düğümleri bir çemberin üzerine eşit aralıklarla dizdim. Sekiz satır, fizik yok, rastgelelik yok. Kazancı yerinden oynamaması: Luffy her ziyarette aynı yerde duruyor ve ilişki türüne göre filtre bir anlam kazanıyor. "Sadece düşmanlıklar" dediğinde çember aynı kalıyor, yalnızca çizgiler değişiyor; iki görünümü bu sayede karşılaştırabiliyorsun. Fizik tabanlı yerleşimde her filtre yeni bir düzen demek olurdu.',
    },
    {
      type: 'quote',
      text: 'Fizik tabanlı yerleşim, yapısını bilmediğin bir grafta küme aramak için iyidir. Ben yapıyı zaten biliyordum.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'İki parçada da işe yarayan çözüm daha sade olanıydı. Spoiler perdesi sıralı bir dizide iki indeksi karşılaştırıyor; graf, fizik hesaplamak yerine düğümleri çembere diziyor.',
    },
    {
      type: 'p',
      text: 'Perdenin kapsamı da hâlâ dar. Bugün yalnızca ark listesindeki kartlarda çalışıyor. Karakterlerin ilk göründüğü ark veride var ama karakter sayfaları perdeye bağlı değil. Yani bir karakter sayfasını açıp sağ üstte "Durum: Ölü" görmek hâlâ mümkün. Sıradaki iş o.',
    },
  ],
}

export default post
