import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-nasil-yapildi',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: "Açılış Zili: Piyasayı Tek Yerden Takip Et",
  excerpt:
    'ABD piyasasını beş sekme yerine tek sayfadan takip etmek için yazdım. Asıl iş veri çekmek değil, bir sayının ne zaman sessizce yanlışa döndüğünü yakalamak oldu.',
  date: '2026-08-12',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  content: [
    {
      type: 'lead',
      text: 'Sabahları aynı beş sekmeyi açıyordum. Birinde o gün bilanço açıklayacak şirketler, birinde makro takvim, birinde haberler, birinde takip listem, bir de kendi notlarımın durduğu bir metin dosyası. Hiçbiri ötekinin ne dediğini bilmiyordu. Açılış Zili bu beş sekmeyi tek sayfaya indirme denemesi.',
    },
    {
      type: 'p',
      text: 'Yatırım tavsiyesi veren bir site değil, kendi takibim için yazdığım bir araç. "Kendim için" olması işi kolaylaştırmadı. Tersine, her gün kendim bakacağım için her sayının doğru olmasını istedim ve bu yazının çoğu o istekten çıkan kararları anlatıyor.',
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
          text: 'Açılışa ne kaldı, bugün hangi şirketler bilanço açıklıyor, hangi makro veri saat kaçta geliyor, endeksler nerede. Günün özeti de burada.',
        },
        {
          title: 'Bilançolar',
          text: 'Takvim, geçmiş dönemler ve her bilanço için yazılan analizler. En çok uğraştığım kısım burası.',
        },
        {
          title: 'Piyasa',
          text: 'Endeksler, sektörler, 513 şirketlik dizin, karşılaştırma ekranı, makro göstergeler ve haberler.',
        },
        {
          title: 'Yazılar',
          text: 'Günlük ve haftalık bülten, olay bazlı uzun yazılar ve terimleri açıklayan bir rehber.',
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
      text: 'Her analiz veritabanında tek bir satır. O satır "şu şirket şunu açıkladı" demiyor; bir görüşü, görüşün gerekçesini ve gerekçenin dayandığı sayıları bir arada tutuyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/schema.ts',
      text: `export const earningsAnalyses = pgTable("earnings_analyses", {
  symbol:      text("symbol").notNull(),
  periodLabel: text("period_label").notNull(),   // "4Ç FY2026"
  reportDate:  date("report_date").notNull(),

  /** 0–100. Görüşün kendisi değil, gerekçesinin yoğunluğu. */
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
      text: 'İki alan üzerinde uzun düşündüm. Birincisi `score`. "Bu ne kadar iyi bir yatırım" anlamına gelseydi, 100 üzerinden 73 vermenin neye dayandığını açıklayamazdım. Bu yüzden skor görüşü değil, gerekçenin ne kadar sağlam olduğunu ölçüyor: kaç veriye dayandığını, ne kadar dolu olduğunu.',
    },
    {
      type: 'p',
      text: 'İkincisi `upcoming`. Finans yazılarında bu bölümün yerleşik adı "katalizörler" ve kelime "fiyatı yukarı itecek şey" diye okunuyor, yani tarafsız değil. Bölümün adını "Beklenen Gelişmeler" koydum ve her maddenin bir tarih taşımasını şart koştum. Tarihi olmayan bir beklenti, beklenti değil temenni.',
    },

    { type: 'h2', text: 'Asıl Karar: Oran Değil, Oranın Böleni' },
    {
      type: 'p',
      text: 'Bu projede verdiğim en iyi karar buydu ve fark etmem epey sürdü.',
    },
    {
      type: 'p',
      text: 'Bir analizin içine F/K oranını yazmak çok doğal görünüyor: sağlayıcı hazır veriyor, kaydedip geçiyorsun. Sorun üç hafta sonra çıkıyor. Analiz o günün fiyatıyla hesaplanmış F/K\'yi taşıyor, sayfanın en üstünde ise bugünün canlı fiyatı duruyor. Aynı sayfada iki fiyat dolaşıyor ve hangisinin hangisi olduğunu hiçbir yer söylemiyor.',
    },
    {
      type: 'quote',
      text: 'Bir oranın payı fiyattır ve fiyat her gün değişir. Kaydettiğin an doğru olan oran, ertesi gün sessizce yanlış olmaya başlar.',
    },
    {
      type: 'p',
      text: 'Çözüm oranı hiç saklamamak oldu. Bölenini saklıyorum; oranı sunum katmanı, sayfadaki o anki fiyatla kuruyor. Okuyucu da isterse çarpıp doğrulayabiliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/schema.ts',
      text: `/* ORAN DEĞİL GİRDİ yazılır. Bölenler burada; oranı sunum katmanı
   sayfadaki canlı fiyatla kuruyor. */

/** Son dört çeyreğin toplam hisse başı kârı — F/K'nin böleni. */
epsTtm: doublePrecision("eps_ttm"),

/** PEG'in böleni — beklenen yıllık kâr büyümesi, yüzde. */
growthPct: doublePrecision("growth_pct"),
/** Büyümenin tanımı — "ileriye dönük 3 yıl", "son 12 ay". Ekranda yazılı. */
growthBasis: text("growth_basis"),`,
    },
    {
      type: 'p',
      text: 'Sağlayıcının hazır F/K değerini kendi hesabımla karşılaştırınca aynı derdi orada da gördüm: SNDK\'da %5,6 sapıyordu. Hazır oran, sayfadakinden farklı bir fiyatla kurulmuştu ve bunu hiçbir yerde söylemiyordu.',
    },
    {
      type: 'p',
      text: '`growthBasis` alanı da aynı yerden doğdu. PEG\'in asıl sorunu, hangi büyümenin bölündüğünün söylenmemesi. Aynı gün aynı şirket için iki kaynağa baktım: biri ileriye dönük tahmini kullanıyordu, öteki son on iki ayı.',
    },
    {
      type: 'compare',
      label: 'MU · Aynı Gün, Aynı Şirket, İki Kaynak',
      before: { label: 'Son 12 Ay Üzerinden', value: 'PEG 0,04' },
      after: { label: 'İleriye Dönük', value: 'PEG 0,12' },
      note: 'Üç kat fark. Sayı tek başına yazılırsa okuyucunun bunu fark etme şansı yok. Büyümenin tanımı bu yüzden ayrı bir alan ve ekranda oranın hemen yanında duruyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Kural şu hâle geldi: türetilmiş sayıyı saklama, girdisini sakla. Girdi zamanla eskimeyen bir gerçek. Türetilmiş sayı bir anın fotoğrafı ve o an geçince kimseye haber vermeden yanlışa dönüyor.',
    },

    { type: 'h3', text: 'Bir Metriği Kaldırmak da Bir Karar' },
    {
      type: 'p',
      text: 'PD/DD oranının böleni bir süre şemada durdu, sonra migration 0012 ile geri aldım. Sebep teknik değildi. PD/DD sektöre bağlı bir ölçü: bankada ve gayrimenkul yatırım ortaklığında fiyatın kurulduğu yer, yarı iletkende neredeyse gürültü. "Bu şirkette anlamlı mı" sorusunu her analizde yeniden cevaplamak gerekiyordu. Doldurulup doldurulmayacağı her seferinde tartışma açan bir alan şemada durmamalı.',
    },
    {
      type: 'p',
      text: 'Brent petrol için iki kez denedim, iki kez de kaldırdım. İlk kaynak FRED\'in spot serisiydi ve o seri günlerce geriden yayımlanıyor: 4 Ağustos\'ta son gözlem 27 Temmuz\'du, 91,82 $. Arada varil 80 dolar civarına inmişti, yani ekrandaki sayı %14 yanlıştı. Tazelik için ABD\'de işlem gören bir Brent fonuna (BNO) geçtim; bu kez kartta 50,37 $ yazdı. O sırada gerçek Brent 89 dolar civarındaydı. "Brent Petrol" başlığının altındaki dolar rakamı varil fiyatı diye okunur ve karttaki "seviye fonun fiyatıdır" notu bunu kurtarmıyordu.',
    },
    {
      type: 'quote',
      text: 'Bir sayıyı büyük puntoyla yanlış, küçük puntoyla doğru göstermek, yanlış göstermektir.',
    },
    {
      type: 'p',
      text: 'Ücretsiz sağlayıcıların hiçbirinde canlı emtia fiyatı yoktu. Metrik düştü.',
    },

    { type: 'h2', text: 'Uydurma Veri Yok' },
    {
      type: 'p',
      text: 'Yukarıdaki kararların hepsi tek bir ilkeden çıkıyor ve ilke sitenin her yerinde geçerli: bir sayı gösteriliyorsa, nereden geldiği ve ne zaman alındığı da gösterilir.',
    },
    {
      type: 'ul',
      items: [
        'Her kartın altında `kaynak · saat` damgası var.',
        'Sağlayıcı kesin saat vermiyorsa ekranda `~` ile yaklaşık olduğu yazıyor. Bilanço saatleri hep böyle: sağlayıcı yalnızca "açılış öncesi" ya da "kapanış sonrası" diyor, dakika vermiyor.',
        'Fiyatlar Alpaca\'nın IEX beslemesinden geliyor. Konsolide fiyattan sapabileceği ekranda yazıyor.',
        'Endeksler ETF üzerinden izleniyor (QQQ, SPY, DIA, IWM) ve arayüz bunu söylüyor.',
        'Veri yoksa kart boş kalıyor. Hiçbir aşamada tahmini değer üretilmiyor.',
      ],
    },
    {
      type: 'p',
      text: 'İlke sağlayıcı katmanını da şekillendirdi. Dört API var (Alpaca, Finnhub, FRED, TCMB) ve dördü de farklı şekil döndürüyor, farklı biçimde hata veriyor. Hepsini tek bir sonuç tipine indirdim. Başarısızlık da bir değer olarak dönüyor, istisna fırlatılmıyor.',
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
      text: 'Sıra hep aynı: canlı kaynak, yedek kaynak, veritabanındaki son bilinen değer ("güncel değil" damgasıyla), en son hata. Bunun pratik bir faydası da var. Projeyi klonlayıp hiçbir anahtar girmeden `npm run dev` diyebiliyorsun; ilgili kartlar "veri alınamadı" gösteriyor, sayfanın geri kalanı çalışıyor.',
    },

    { type: 'h2', text: 'Tek Sayfa, 513 İstek' },
    {
      type: 'p',
      text: 'Şirketler dizini 513 sembol listeliyor ve tek bir görüntüleme veritabanına 513 istek atıyordu. Fiyat çağrısı tekti ve önbellekten geliyordu; sorun fiyatları veritabanına geri yazan koddaydı.',
    },
    {
      type: 'p',
      text: 'Her kotasyon ayrı bir `insert` ile yazılıyordu, hepsi `Promise.all` ile paralel. Masum görünüyor, ama `@neondatabase/serverless` HTTP üzerinden konuşuyor ve kalıcı bağlantı yok. Her `insert` ayrı bir gidiş-dönüş. Üstelik bu yazma, fiyat önbellekten gelse bile çalışıyordu, yani önbellek isabeti de aynı bedeli ödüyordu.',
    },
    {
      type: 'compare',
      label: 'Şirketler Dizini · Tek Sayfa Görüntüleme',
      before: { label: 'Satır Başına Insert', value: '513 İstek' },
      after: { label: 'Gruplu Tek Upsert', value: '2 İstek' },
      note: 'Aynı düzeltmede bir şey daha çıktı: yazma `void` ile bırakılmıştı. Sunucusuz fonksiyon yanıt döndükten sonra donunca yazma yarıda kalabiliyordu. Artık bekleniyor; tek gidiş-dönüşün maliyeti o belirsizliğe değmez.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/index.ts',
      text: `// 500'erlik gruplar hâlinde tek upsert.
// 11 kolon × 500 = 5500 parametre, Postgres'in 65535 sınırının altında.
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
      text: 'Bir süre endeksler yenilenmiyor gibi duruyordu. Kotasyon önbelleği seans içinde 60 saniyeydi ve sayfayı yenileyen biri çoğu zaman aynı fiyatı görüyordu.',
    },
    {
      type: 'p',
      text: 'Süreyi düşürmekten çekiniyordum, çünkü "her ziyaretçi bir istek demek" sanıyordum. Yanlışmış. Next.js\'in veri önbelleği sunucuda paylaşımlı; sağlayıcıya giden istek trafikle değil yalnızca süreyle artıyor. 15 saniyelik ömür, bir sembol kümesi için dakikada en fazla 4 istek demek. Alpaca\'nın ücretsiz katmanı dakikada 200 kabul ediyor.',
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
    {
      type: 'p',
      text: 'Bu tablo da eksik çıktı. Süreleri "bu veri ne sıklıkla değişir" diye seçmiştim, günün neresinde olduğumuza hiç bakmıyordum. Gece yarısından önce yazılan 900 saniyelik bir kotasyon ertesi sabahın ön seansına sarkabiliyordu: sayfayı açan dünkü fotoğrafı görüyor, bir yenilemeden sonra bugünküne geçiyordu. Şimdi her kayıt en geç bir sonraki seans sınırında ölüyor. Bedeli sınır anlarında sağlayıcıya giden birkaç fazla istek.',
    },

    { type: 'h2', text: 'Bir de Saatler Vardı' },
    {
      type: 'p',
      text: 'Bunu sona bıraktım, çünkü projenin özü değil. Ama beklediğimden çok vaktimi aldı.',
    },
    {
      type: 'p',
      text: 'Türkiye yaz saati uygulamıyor, ABD uyguluyor. New York ile aramızdaki fark bu yüzden sabit değil: yazın 7 saat, kışın 8. Borsa her zaman 09:30\'da açılıyor ama benim saatimde bu yazın 16:30, kışın 17:30.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bir yere `7` yazıp geçmek çok cazip. Yazsaydım, Kasım\'da ABD kış saatine döndüğü gün sitedeki bütün saatler bir saat kayacaktı. Uygulama çökmeyecekti; sessizce yanlış söyleyecekti.',
    },
    {
      type: 'p',
      text: 'Bu yüzden hiçbir yerde elle saat aritmetiği yok. Bütün dönüşümler tek dosyada, `Intl` üzerinden ve o günün tarihiyle hesaplanıyor. Seans durumu da göründüğünden karışık: ön seans, ana seans, akşam seansı, kapalı. Üstüne yarım günler var; Şükran Günü ertesi borsa 13:00\'te kapanıyor.',
    },
    {
      type: 'p',
      text: 'Bir ayrıntı daha: Türkçe okuyan biri için "09:30 açılış" doğru ama işe yaramaz bir cümle. TR arayüzde birincil saat İstanbul, künyedeki ikincil saat New York. İngilizceye geçince sıra tersine dönüyor.',
    },

    { type: 'h2', text: 'Yazıları Kim Yazıyor' },
    {
      type: 'p',
      text: 'Bültenleri ve analizleri bir dil modeli yazıyor ama sunucuda yazı üreten bir model çağrısı yok. Bir dönem vardı: günlük cron 13:30\'da kural tabanlı bir özet çıkarıyordu. Onu bilerek kaldırdım. Mekanik özet günün yerini dolduruyor, kart onu "bugün" diye gösteriyordu ve elle yazılmış dünkü bültenin eskidiğini kimse görmüyordu.',
    },
    {
      type: 'p',
      text: 'Şimdi düzen şöyle: claude.ai tarafında kurulmuş zamanlanmış görevler belli saatlerde uyanıyor, sitenin korumalı bir ucundan o günün verisini çekiyor, yazıyı yazıyor ve başka bir korumalı uca gönderiyor. Site yalnızca veritabanından okuyor.',
    },
    {
      type: 'table',
      head: ['Görev', 'Ne Zaman', 'Nereye'],
      rows: [
        ['Bilanço Analizi', 'Her gün 09:00 TR', '/bilancolar/analizler'],
        ['Günlük Bülten', 'Her gün 16:00 TR', 'Ana Sayfa · Günün Özeti'],
        ['Olay Yazısı', 'Her gün 23:30 TR', '/mercek'],
        ['Haftalık Bülten', 'Pazartesi 09:30 TR', '/bulten'],
      ],
    },
    {
      type: 'p',
      text: 'Saatler de bir hatadan çıktı. Günlük bülten uzun süre sabah 09:00\'da koşuyordu, oysa veriyi veritabanına yazan senkron 13:30\'da çalışıyor. Bülten senkrondan dört buçuk saat önce yazılıyor ve her sabah bir önceki günün makro değerleriyle çıkıyordu.',
    },
    {
      type: 'p',
      text: 'Gövde doğrulaması başarısız olunca 400 ile birlikte beklenen şemayı da geri yazıyorum. Karşı taraf bir model ve hata mesajını okuyup kendini düzeltebiliyor.',
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
      text: 'Site bunu yığılmış çubuk ve öncesi-sonrası karşılaştırması olarak çiziyor. `oncesi` bloğu aradaki yüzde değişimi kendisi hesaplıyor; yazan hesaplamadığı için yanlış da hesaplayamıyor. Yedi görsel blok var ve hepsinde satırlar `|` ile ayrılıyor.',
    },
    {
      type: 'p',
      text: 'Asıl kazancı estetik değil bakım. Hiçbir yerde görsel barındırmıyorum ve tema değişince çizimler de değişiyor. Bir PNG bunu yapamaz.',
    },

    { type: 'h2', text: 'Rakamlarla' },
    {
      type: 'stats',
      label: 'Açılış Zili · 12 Ağustos 2026',
      items: [
        { value: '24', note: 'Sayfa' },
        { value: '14', note: 'Postgres Tablosu' },
        { value: '13', note: 'Migration' },
        { value: '4', note: 'Veri Sağlayıcı' },
        { value: '513', note: 'Takip Edilen Şirket' },
        { value: '2', note: 'Dil' },
      ],
    },
    {
      type: 'p',
      text: 'Teknoloji: Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 (tokenlar `@theme inline` içinde, config dosyası yok), Neon PostgreSQL ve Drizzle, next-auth v5, grafikler için lightweight-charts.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'Bu projeye "borsa verisi çekmek zor olacak" diye başladım. Veri çekmek en kolay kısmıymış: dört API, birkaç `fetch`, bitti.',
    },
    {
      type: 'p',
      text: 'Zor olan, o verinin dürüst biçimde ekrana çıkması. Yanlış bir sayı uygulamayı çökertmiyor, yalnızca güvenilmez yapıyor ve fark etmen günler sürebiliyor. Kaydedilen F/K\'nin ertesi gün yanlışa dönmesi, Brent kartının bir haftalık fiyatı bugünmüş gibi göstermesi, dünkü kotasyonun sabaha sarkması: üçü de hata vermeden oldu.',
    },
    {
      type: 'p',
      text: '"Türetilmiş sayıyı saklama, girdisini sakla" cümlesini daha önce de duymuştum. Neden önemli olduğunu ancak kendi sayfamda birbiriyle çelişen iki fiyat görünce anladım. Şimdi merak ettiğim şey, henüz fark etmediğim üçüncü bir sayının nerede durduğu.',
    },
  ],
}

export default post
