import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-nasil-yapildi',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: Kendim Takip Edebileyim Diye Yazdığım Borsa Sitesi',
  excerpt:
    'Bilanço takvimi bir sitede, makro veriler başka sitede, kendi notlarım bir metin dosyasındaydı. Hepsini tek ekrana topladım. En çok uğraştığım şey veri çekmek değil, bir sayının ne zaman yalan söylemeye başladığını anlamak oldu.',
  date: '2026-08-12',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  content: [
    {
      type: 'lead',
      text: 'Sabahları aynı beş sekmeyi açıyordum. Birinde o gün bilanço açıklayacak şirketler, birinde makro takvim, birinde haberler, birinde takip listem, bir de kendi notlarımın durduğu bir metin dosyası. Hepsi ayrı yerdeydi ve hiçbiri diğerinin ne dediğini bilmiyordu. Açılış Zili bu beş sekmeyi tek sayfaya indirme denemesi.',
    },
    {
      type: 'p',
      text: 'Yatırım tavsiyesi veren bir site değil; kendi takibim için bir araç. Ama "kendim için" olması işi kolaylaştırmadı — tam tersine, her gün kendim bakacağım için her sayının doğru olmasını istedim. Bu yazı da çoğunlukla o meselenin etrafında dönüyor.',
    },

    { type: 'h2', text: 'Sitede Ne Var' },
    {
      type: 'p',
      text: 'Yirmi dört sayfa var ama omurga dört parça.',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Bugün',
          text: 'Açılışa ne kaldı, bugün hangi şirketler bilanço açıklıyor, hangi makro veri saat kaçta geliyor, endeksler nerede. Günün özeti de burada duruyor.',
        },
        {
          title: 'Bilançolar',
          text: 'Takvim, geçmiş dönemler ve asıl mesele: her bilanço için yazılan analizler. Sitenin en çok uğraştığım kısmı burası.',
        },
        {
          title: 'Piyasa',
          text: 'Endeksler, sektörler, 500\'ü aşkın şirketlik dizin, karşılaştırma ekranı, makro göstergeler ve haberler.',
        },
        {
          title: 'Yazılar',
          text: 'Günlük ve haftalık bülten, olay bazlı uzun yazılar, bir de terimleri açıklayan rehber bölümü.',
        },
      ],
    },
    {
      type: 'p',
      text: 'Takip listesi, favoriler ve hesap tarafı da var ama onlar standart iş. Anlatmaya değer olan bilanço analizleri.',
    },

    { type: 'h2', text: 'Bir Bilanço Analizi Neyden Oluşuyor' },
    {
      type: 'p',
      text: 'Her analiz veritabanında tek bir satır ve o satırın şekli epeyce düşünülmüş bir şey. "Şu şirket şunu açıkladı" değil; bir görüş, o görüşün gerekçesi ve gerekçenin dayandığı sayılar bir arada duruyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/schema.ts',
      text: `export const earningsAnalyses = pgTable("earnings_analyses", {
  symbol:      text("symbol").notNull(),
  periodLabel: text("period_label").notNull(),   // "4Ç FY2026"
  reportDate:  date("report_date").notNull(),

  /** 0–100. Görüşün kendisi değil, GEREKÇESİNİN YOĞUNLUĞU. */
  score:   integer("score").notNull(),
  verdict: text("verdict").notNull(),            // buy | hold | sell
  /** Kartlarda görünen tek cümlelik hikâye. */
  headline: text("headline").notNull(),

  summary:   jsonb("summary").$type<string[]>().notNull(),
  analysis:  jsonb("analysis").$type<{ title: string; body: string }[]>().notNull(),
  strengths: jsonb("strengths").$type<string[]>(),
  risks:     jsonb("risks").$type<string[]>(),
  /** "Katalizörler" değil: Beklenen Gelişmeler. Tarih taşır. */
  upcoming:  jsonb("upcoming").$type<string[]>(),
})`,
    },
    {
      type: 'p',
      text: 'İki alan üzerinde uzun düşündüm. Birincisi `score`. İlk hâlinde "ne kadar iyi bir yatırım" anlamındaydı ve bu saçmaydı — 100 üzerinden 73 vermek neye dayanıyor? Şimdi ölçtüğü şey farklı: gerekçe ne kadar sağlam, kaç veriye dayanıyor. Görüşün kendisini değil, arkasındaki dolgunun yoğunluğunu.',
    },
    {
      type: 'p',
      text: 'İkincisi `upcoming`. Başta adı "katalizörler"di. Finans dilinde o kelime "fiyatı yukarı itecek şey" anlamında kullanılıyor, yani tarafsız değil. "Beklenen Gelişmeler" yaptım ve her maddeye tarih koyma kuralı ekledim. Tarihi olmayan bir beklenti, beklenti değil temenni.',
    },

    { type: 'h2', text: 'Asıl Karar: Oran Değil, Oranın Böleni' },
    {
      type: 'p',
      text: 'Şimdi bu projede verdiğim en iyi karara geliyorum. Fark etmem epey sürdü.',
    },
    {
      type: 'p',
      text: 'İlk sürümde analizin içinde F/K oranı yazılı duruyordu; sağlayıcıdan hazır geliyordu, ben de kaydediyordum. Sonra şunu gördüm: analiz üç hafta önce yazılmış, içinde "F/K 24,1" diyor. Sayfanın en üstünde ise canlı fiyat var ve o fiyatla F/K artık 27,8. Aynı sayfada birbiriyle çelişen iki sayı, hangisinin neden farklı olduğu hiçbir yerde yazmıyor.',
    },
    {
      type: 'quote',
      text: 'Bir oranın payı fiyattır ve fiyat her gün değişir. Yani kaydettiğin an doğru olan oran, ertesi gün sessizce yanlış olmaya başlar.',
    },
    {
      type: 'p',
      text: 'Çözüm oranı hiç saklamamak oldu. Bölenini saklıyorum; oranı sunum katmanı, sayfadaki o anki fiyatla kuruyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/schema.ts',
      text: `/* ORAN DEĞİL GİRDİ yazılır. Bölenler burada; oranı sunum katmanı
   sayfadaki canlı fiyatla kuruyor. Böylece okuyucu çarpıp
   doğrulayabiliyor ve sayfada iki farklı fiyat dolaşmıyor. */

/** Son dört çeyreğin toplam hisse başı kârı — F/K'nin böleni. */
epsTtm: doublePrecision("eps_ttm"),

/** PEG'in böleni — beklenen yıllık kâr büyümesi, yüzde. */
growthPct: doublePrecision("growth_pct"),
/** Büyümenin TANIMI — "ileriye dönük 3 yıl", "son 12 ay". Ekranda yazılı. */
growthBasis: text("growth_basis"),`,
    },
    {
      type: 'p',
      text: 'Bunu yaparken sağlayıcının hazır F/K değerini kendi hesabımla karşılaştırdım. SNDK\'da %5,6 sapıyordu — büyük ihtimalle farklı bir dönem penceresi kullanıyor ama hangisi olduğunu hiçbir yerde söylemiyor.',
    },
    {
      type: 'p',
      text: '`growthBasis` alanı da aynı dertten doğdu. PEG oranının asıl sorunu, hangi büyümenin bölündüğünün söylenmemesi. Aynı gün, aynı şirket için iki kaynağa baktım: biri ileriye dönük tahmini kullanıyordu, öteki son on iki ayı.',
    },
    {
      type: 'compare',
      label: 'MU · aynı gün, aynı şirket, iki kaynak',
      before: { label: 'Son 12 ay üzerinden', value: 'PEG 0,04' },
      after: { label: 'İleriye dönük', value: 'PEG 0,12' },
      note: 'Üç kat fark. Sayı tek başına yazılırsa okuyucunun bunu fark etme şansı yok. Bu yüzden büyümenin tanımı ayrı bir alan ve ekranda oranın hemen yanında duruyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Kural şu hâle geldi: türetilmiş bir sayıyı saklama, girdilerini sakla. Girdi zamanla eskimeyen bir gerçek; türetilmiş sayı bir anın fotoğrafı ve o an geçtiğinde kimseye haber vermeden yanlış oluyor.',
    },

    { type: 'h3', text: 'Bir Metriği Kaldırmak da Bir Karar' },
    {
      type: 'p',
      text: 'PD/DD oranının böleni bir süre şemada durdu, sonra migration 0012 ile geri aldım. Sebep teknik değildi: sektöre bağlı bir ölçü. Bankada ve gayrimenkul yatırım ortaklığında fiyatın kurulduğu yer; yarı iletkende neredeyse gürültü.',
    },
    {
      type: 'p',
      text: 'Yani "bu şirkette anlamlı mı" sorusu her analizde yeniden verilmesi gereken bir yargı çağrısıydı. Bir alanın doldurulup doldurulmayacağı her seferinde tartışma açıyorsa, o alan şemada olmamalı.',
    },
    {
      type: 'p',
      text: 'Aynı mantıkla Brent petrol fiyatını da kaldırdım. Ekranda "74,20 $" yazıyordu ama FRED\'in kullandığı seri günlerce geriden geliyor. Bir haftalık fiyatı bugünmüş gibi göstermektense metriği silmek doğru.',
    },

    { type: 'h2', text: 'Uydurma Veri Yok' },
    {
      type: 'p',
      text: 'Yukarıdaki iki karar da tek bir ilkeden çıkıyor ve o ilke sitenin her yerinde geçerli: bir sayı gösteriliyorsa, nereden geldiği ve ne zaman alındığı da gösterilir.',
    },
    {
      type: 'ul',
      items: [
        'Her kartın altında `kaynak · saat` damgası var.',
        'Sağlayıcı kesin saat vermiyorsa ekranda `~` ile yaklaşık olduğu söyleniyor. Bilanço saatleri hep böyle — sağlayıcı yalnızca "açılış öncesi" ya da "kapanış sonrası" diyor, dakika vermiyor.',
        'Fiyatlar Alpaca\'nın IEX beslemesinden geliyor; konsolide banttan birkaç sent sapabilir ve bu ekranda yazıyor.',
        'Endeksler ETF üzerinden izleniyor (QQQ, SPY, DIA, IWM) ve arayüzde belirtiliyor.',
        'Veri yoksa kart boş kalıyor. Hiçbir aşamada tahmini değer üretilmiyor.',
      ],
    },
    {
      type: 'p',
      text: 'Bu ilke sağlayıcı katmanını da şekillendirdi. Dört API var — Alpaca, Finnhub, FRED, TCMB — dördü de farklı şekil döndürüyor ve farklı biçimde patlıyor. Hepsini tek sonuç tipine indirdim; başarısızlık da bir değer olarak dönüyor, istisna fırlatılmıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/types.ts',
      text: `type ProviderResult<T> =
  | { ok: true;  data: T; source: string; fetchedAt: Date }
  | { ok: false; source: string; reason: FailReason; message: string }

type FailReason = "missing-key" | "rate-limited" | "not-found" | "upstream-error"`,
    },
    {
      type: 'p',
      text: 'Sıra hep aynı: canlı kaynak → yedek kaynak → veritabanındaki son bilinen değer (üstünde "güncel olmayabilir" damgasıyla) → hata. Pratik faydası şu: projeyi klonlayıp hiçbir anahtar girmeden `npm run dev` diyebiliyorsun. İlgili kartlar "veri alınamadı" gösteriyor, sayfanın geri kalanı çalışıyor.',
    },

    { type: 'h2', text: '513 İstek: Beni En Çok Şaşırtan Hata' },
    {
      type: 'p',
      text: 'Şirketler dizini 513 sembol listeliyor ve sayfa çok yavaştı. Nedenini bulamıyordum, çünkü fiyat çağrısı tek bir çağrıydı ve cache\'ten geliyordu.',
    },
    {
      type: 'p',
      text: 'Sonra fiyatları veritabanına yazan koda baktım. Her kotasyon için ayrı bir `insert` vardı, hepsi `Promise.all` ile paralel. Masum görünüyor — ama `@neondatabase/serverless` HTTP üzerinden konuşuyor, kalıcı bağlantı yok. Her `insert` ayrı bir round-trip.',
    },
    {
      type: 'compare',
      label: 'Şirketler dizini · tek sayfa görüntüleme',
      before: { label: 'Satır başına insert', value: '513 istek' },
      after: { label: 'Gruplu tek upsert', value: '2 istek' },
      note: 'Üstelik Alpaca yanıtı cache\'ten gelse bile bu yazma çalıştığı için, cache isabeti de aynı bedeli ödüyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/index.ts',
      text: `// 500'erlik gruplar hâlinde tek upsert.
// 11 kolon × 500 = 5500 parametre — Postgres'in 65535 sınırının altında.
await db
  .insert(quotesCache)
  .values(batch)
  .onConflictDoUpdate({
    target: quotesCache.symbol,
    set: { price: sql\`excluded.price\`, updatedAt: sql\`excluded.updated_at\` },
  })`,
    },

    { type: 'h2', text: 'Tazelik Sabit Değil, Duruma Bağlı' },
    {
      type: 'p',
      text: 'Siteyi birkaç arkadaşıma gösterdiğimde ilk gelen geri bildirim "fiyatlar güncellenmiyor, çalışıyor mu bu?" oldu. Çalışıyordu; cache süresini 60 saniye koymuştum ve insan sayfayı 60 saniyede bir yenilemiyor.',
    },
    {
      type: 'p',
      text: 'Süreyi düşürmekten çekiniyordum, "her ziyaretçi bir istek demek" sanıyordum. Yanlışmış: Next.js\'in data cache\'i sunucuda paylaşımlı, yani sağlayıcıya giden istek trafikle değil yalnızca TTL ile artıyor. 15 saniyelik TTL dakikada en fazla 4 istek demek; Alpaca\'nın ücretsiz katmanı 200 kabul ediyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/market-hours.ts',
      text: `export function quoteTtlSeconds(status: MarketStatus): number {
  switch (status.session) {
    case "regular":     return 15   // seans içinde taze olsun
    case "pre-market":
    case "after-hours": return 60   // hareket az
    default:            return 900  // kapalı: fiyat durgun, kotayı harcama
  }
}`,
    },

    { type: 'h2', text: 'Bir de Saatler Vardı' },
    {
      type: 'p',
      text: 'Bunu sona bıraktım çünkü projenin özü değil — ama beklediğimden çok vaktimi aldı.',
    },
    {
      type: 'p',
      text: 'Türkiye yaz saati uygulamıyor, ABD uyguluyor. Yani New York ile aramızdaki fark sabit değil: yazın 7 saat, kışın 8. Borsanın açılışı her zaman 09:30 New York saatidir ama benim duvar saatimde yazın 16:30\'a, kışın 17:30\'a denk gelir.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'İlk sürümde `TR_OFFSET = 7` diye bir sabit tanımlamıştım. Mart sonunda ABD yaz saatine geçince sitedeki bütün saatler bir saat kaydı ve bunu günler sonra fark ettim. Sayı yanlış olduğunda uygulama çökmüyor, sessizce yalan söylüyor.',
    },
    {
      type: 'p',
      text: 'Doğru çözüm hiçbir yerde saat aritmetiği yapmamaktı: bütün dönüşümler tek dosyada ve `Intl` üzerinden, o günün tarihiyle hesaplanıyor. Seans durumu da göründüğünden karmaşık — ön seans, ana seans, akşam seansı, kapalı; üstüne yarım günler (Şükran Günü ertesi borsa 13:00\'te kapanıyor).',
    },
    {
      type: 'p',
      text: 'Bir de şu var: Türkçe okuyan biri için "09:30 açılış" doğru ama işe yaramaz bir cümle. Bu yüzden TR arayüzde birincil saat İstanbul, künyede duran ikincil saat New York; İngilizceye geçince sıra tersine dönüyor.',
    },

    { type: 'h2', text: 'Yazıları Kim Yazıyor' },
    {
      type: 'p',
      text: 'Bültenler ve analizler bir dil modeli tarafından yazılıyor, ama sunucuda hiçbir model çağrısı yok — üretimde API anahtarı tanımlı bile değil.',
    },
    {
      type: 'p',
      text: 'Mimari şöyle: claude.ai tarafında kurulmuş zamanlanmış görevler belirli saatlerde uyanıyor, sitenin korumalı bir ucundan o günün verisini çekiyor, yazıyı yazıyor ve başka bir korumalı uca gönderiyor. Site yalnızca veritabanından okuyor.',
    },
    {
      type: 'table',
      head: ['Görev', 'Ne zaman', 'Nereye'],
      rows: [
        ['Bilanço analizi', 'her gün 09:00 TR', '/bilancolar/analizler'],
        ['Günlük bülten', 'her gün 16:00 TR', 'Ana sayfa · Günün Özeti'],
        ['Olay yazısı', 'her gün 23:30 TR', '/mercek'],
        ['Haftalık bülten', 'pazartesi 09:30 TR', '/bulten'],
      ],
    },
    {
      type: 'p',
      text: 'Saatlerin seçimi de bir hatadan çıktı. Günlük bülten uzun süre sabah 09:00\'da koşuyordu, oysa veriyi veritabanına yazan cron 13:30\'da çalışıyor. Yani bülten senkrondan dört buçuk saat önce yazılıyor ve her sabah bir önceki günün makro değerleriyle çıkıyordu.',
    },
    {
      type: 'p',
      text: 'Gövde doğrulaması başarısız olunca 400 ile birlikte beklenen şemayı da geri yazıyorum. Sebebi basit: karşı taraf bir model ve hata mesajını okuyup kendini düzeltebiliyor.',
    },

    { type: 'h2', text: 'Yazılara Görsel Koymadım, Çizdirdim' },
    {
      type: 'p',
      text: 'Uzun yazıların görsele ihtiyacı vardı ama görsel demek telif, kaynak arama ve her yazı için ayrı iş demek. Onun yerine metinden çizim yapan bir blok ailesi yazdım.',
    },
    {
      type: 'code',
      lang: 'md',
      text: `::: pay Optik Modül Pazar Payı
Zhongji Innolight | 27
Coherent | 18
Diğerleri | 55
:::

::: oncesi Piyasa Değeri
52,5 Mr $ | 12 Haziran
19 Mr $ | 29 Temmuz
:::`,
    },
    {
      type: 'p',
      text: 'Site bunu yığılmış çubuk ve öncesi-sonrası karşılaştırması olarak çiziyor. `oncesi` bloğu aradaki yüzde değişimi kendisi hesaplıyor — yazan hesaplamıyor, dolayısıyla yanlış hesaplayamıyor. Altı görsel blok var, hepsinde satırlar `|` ile ayrılıyor.',
    },
    {
      type: 'p',
      text: 'Asıl kazancı estetik değil bakım: hiçbir yerde görsel barındırmıyorum ve tema değiştiğinde çizimler de değişiyor. Bir PNG bunu yapamaz.',
    },

    { type: 'h2', text: 'Rakamlarla' },
    {
      type: 'stats',
      label: 'Açılış Zili',
      items: [
        { value: '24', note: 'sayfa' },
        { value: '15', note: 'Postgres tablosu' },
        { value: '13', note: 'migration' },
        { value: '4', note: 'veri sağlayıcı' },
        { value: '500+', note: 'takip edilen şirket' },
        { value: '2', note: 'dil' },
      ],
    },
    {
      type: 'p',
      text: 'Teknoloji: Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 — tokenlar `@theme inline` içinde, config dosyası yok. Neon PostgreSQL + Drizzle, next-auth v5, grafikler lightweight-charts.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'Bu projeye "borsa verisi çekmek zor olacak" diye başladım. Veri çekmek en kolay kısımmış: dört API, birkaç fetch, bitti.',
    },
    {
      type: 'p',
      text: 'Zor olan, o verinin dürüst biçimde ekrana çıkması. Bir sayının yanlış olması uygulamayı çökertmiyor, sadece güvenilmez yapıyor — ve fark etmen günler sürebiliyor. Kaydettiğim F/K\'nin ertesi gün yanlış olmaya başlaması gibi.',
    },
    {
      type: 'p',
      text: 'Öğrendiğim şey tek cümle: türetilmiş sayıyı saklama, girdisini sakla. Bunu daha önce de duymuştum ama neden önemli olduğunu ancak kendi sayfamda birbiriyle çelişen iki fiyat görünce anladım.',
    },
    {
      type: 'p',
      text: 'Site canlıda, kodun tamamı açık. Şu an her sabah beş sekme yerine bir sekme açıyorum; projeyi başarılı sayma ölçütüm bu.',
    },
  ],
}

export default post
