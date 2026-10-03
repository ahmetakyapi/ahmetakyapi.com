import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-nasil-yapildi',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: "Açılış Zili: Borsa ve Bilanço Tek Ekranda",
  excerpt:
    'ABD borsasını Türkiye saatiyle tek ekrandan izlemek için yazdım. Veriyi çekmek kolaydı; zor olan, bir sayının hata vermeden yanlışa döndüğü anı yakalamaktı.',
  date: '2026-08-12',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  content: [
    {
      type: 'lead',
      text: 'ABD borsasını Türkiye\'den izleyen biri her gün aynı çeviriyi yapıyor. Kaynaklar New York saatiyle yayın yapıyor; bir bilanço "kapanış sonrası" açıklanıyor ve bunun Türkiye saatiyle kaç olduğunu herkes kendisi hesaplıyor. ABD yaz saatine geçince de hesap bir saat kayıyor. Açılış Zili bu çeviriyi bir kez ve doğru yapmak için var: bilanço takvimi, makro veriler, fiyatlar, haberler ve takip listesi, hepsi Türkiye saatiyle tek ekranda.',
    },
    {
      type: 'p',
      text: 'Yatırım tavsiyesi veren bir site değil; arkasında bir şirket, aracı kurum ya da sponsor yok. Bu yazının çoğu, ekrandaki her sayının doğru olması için verdiğim kararları anlatıyor.',
    },

    { type: 'h2', text: 'Sitede Ne Var' },
    {
      type: 'p',
      text: 'Yirmi dört sayfa var, ama sitenin omurgası dört bölüm.',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Bugün',
          text: 'Açılışa ne kadar kaldı, bugün hangi şirketler bilanço açıklıyor, hangi makro veri saat kaçta geliyor, endeksler nerede. Günün özeti de burada.',
        },
        {
          title: 'Bilançolar',
          text: 'Takvim, geçmiş dönemler ve her bilanço için yazılan analizler.',
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
      text: 'Takip listesi, favoriler ve hesap tarafı da var ama onlar her sitede olan işler. Burada anlatacağım kısım bilanço analizleri.',
    },

    { type: 'h2', text: 'Bir Bilanço Analizi Neyden Oluşuyor' },
    {
      type: 'p',
      text: 'Her analiz veritabanında tek bir satır. Bu satır yalnızca "şu şirket şunu açıkladı" demiyor; bir görüşü, o görüşün gerekçesini ve gerekçenin dayandığı sayıları bir arada tutuyor.',
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
      text: 'İki alanın tanımı ayrıca karar istedi. Birincisi `score`. "Bu ne kadar iyi bir yatırım" anlamına gelseydi, 100 üzerinden 73 vermenin neye dayandığını açıklayamazdım. Bu yüzden skor görüşü ölçmüyor; gerekçenin ne kadar sağlam olduğunu, yani kaç veriye dayandığını ve ne kadar dolu olduğunu ölçüyor.',
    },
    {
      type: 'p',
      text: 'İkincisi `upcoming`. Finans yazılarında bu bölümün yerleşik adı "katalizörler" ve kelime "fiyatı yukarı itecek şey" diye okunuyor; yani tarafsız değil. Bölümün adını "Beklenen Gelişmeler" koydum ve her maddenin bir tarih taşımasını şart koştum. Tarihi olmayan bir beklenti, bir dilekten farksız.',
    },

    { type: 'h2', text: 'Oranı Değil, Bölenini Saklamak' },
    {
      type: 'p',
      text: 'Projede en çok işe yarayan karar buydu.',
    },
    {
      type: 'p',
      text: 'Bir analizin içine F/K oranını yazmak çok doğal görünüyor: sağlayıcı hazır veriyor, kaydedip geçiyorsun. Sorun haftalar sonra çıkıyor. Analiz o günün fiyatıyla hesaplanmış F/K\'yi taşıyor, sayfanın en üstünde ise bugünün canlı fiyatı duruyor. Aynı sayfada iki fiyat var ve hangisinin hangisi olduğunu hiçbir yer söylemiyor.',
    },
    {
      type: 'quote',
      text: 'Bir oranın payı fiyattır ve fiyat her gün değişir. Kaydettiğin an doğru olan oran, ertesi gün sessizce eskimeye başlar.',
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
      text: 'Sağlayıcının hazır F/K değerini kendi hesabımla karşılaştırınca aynı sorun orada da çıktı: SNDK\'da fark %5,6\'ydı. Hazır oran, sayfadakinden farklı bir fiyatla hesaplanmıştı ve bunu hiçbir yerde söylemiyordu.',
    },
    {
      type: 'p',
      text: '`growthBasis` alanı da aynı yerden çıktı. PEG\'in sorunu, hangi büyümeye bölündüğünün çoğu zaman yazılmaması. Aynı gün aynı şirket için iki kaynağa baktım: biri ileriye dönük tahmini kullanıyordu, öteki son on iki ayı.',
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
      text: 'Kural şu oldu: hesaplanmış sayıyı saklama, girdisini sakla. Girdi zamanla eskimiyor. Hesaplanmış sayı ise bir anın fotoğrafı; o an geçince kimseye haber vermeden yanlışa dönüyor.',
    },

    { type: 'h3', text: 'Bir Metriği Kaldırmak da Bir Karar' },
    {
      type: 'p',
      text: 'PD/DD oranının böleni bir süre şemada durdu, sonra migration 0012 ile geri aldım. Sebep teknik değildi. PD/DD sektöre göre anlamı değişen bir ölçü: bankada ve gayrimenkul yatırım ortaklığında fiyatı belirleyen şeylerden biri, yarı iletken şirketinde neredeyse bir şey söylemiyor. "Bu şirkette anlamlı mı" sorusunu her analizde yeniden cevaplamak gerekiyordu. Doldurulup doldurulmayacağı her seferinde tartışma çıkaran bir alan şemada durmamalı.',
    },
    {
      type: 'p',
      text: 'Brent petrolü iki kez denedim, iki kez de kaldırdım. İlk kaynak FRED\'in spot serisiydi ve o seri günlerce geriden yayımlanıyor: 4 Ağustos\'ta son gözlem 27 Temmuz\'du, 91,82 $. Arada varil 80 dolar civarına inmişti, yani ekrandaki sayı %14 yanlıştı. Daha güncel veri için ABD\'de işlem gören bir Brent fonuna (BNO) geçtim; bu kez kartta 50,37 $ yazdı. O sırada gerçek Brent 89 dolar civarındaydı. "Brent Petrol" başlığının altındaki dolar rakamı varil fiyatı diye okunur ve karttaki "seviye fonun fiyatıdır" notu bunu düzeltmiyordu.',
    },
    {
      type: 'quote',
      text: 'Bir sayıyı büyük puntoyla yanlış, küçük puntoyla doğru göstermek, yanlış göstermektir.',
    },
    {
      type: 'p',
      text: 'Ücretsiz sağlayıcıların hiçbirinde canlı emtia fiyatı yoktu. Kart kaldırıldı.',
    },

    { type: 'h2', text: 'Uydurma Veri Yok' },
    {
      type: 'p',
      text: 'Yukarıdaki kararların hepsi tek bir kuraldan çıkıyor ve kural sitenin her yerinde geçerli: bir sayı gösteriliyorsa, nereden geldiği ve ne zaman alındığı da gösterilir.',
    },
    {
      type: 'ul',
      items: [
        'Her kartın altında `kaynak · saat` satırı var.',
        'Sağlayıcı kesin saat vermiyorsa ekranda `~` ile yaklaşık olduğu yazıyor. Bilanço saatleri hep böyle: sağlayıcı yalnızca "açılış öncesi" ya da "kapanış sonrası" diyor, dakika vermiyor.',
        'Fiyatlar Alpaca\'nın IEX beslemesinden geliyor. Konsolide fiyattan sapabileceği ekranda yazıyor.',
        'Endeksler ETF üzerinden izleniyor (QQQ, SPY, DIA, IWM) ve arayüz bunu söylüyor.',
        'Veri yoksa kart boş kalıyor. Hiçbir aşamada tahmini değer üretilmiyor.',
      ],
    },
    {
      type: 'p',
      text: 'Bu kural veri sağlayıcılarla konuşan katmanı da belirledi. Dört API var (Alpaca, Finnhub, FRED, TCMB) ve dördü de farklı biçimde veri döndürüyor, farklı biçimde hata veriyor. Hepsini tek bir sonuç tipine indirdim. Hata da bir değer olarak dönüyor; exception fırlatılmıyor.',
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
      text: 'Sıra hep aynı: canlı kaynak, yedek kaynak, veritabanındaki son bilinen değer ("güncel değil" notuyla), en son hata. Bunun pratik bir faydası da var. Projeyi klonlayıp hiçbir API anahtarı girmeden `npm run dev` çalıştırabiliyorsun; ilgili kartlar "veri alınamadı" gösteriyor, sayfanın geri kalanı çalışıyor.',
    },

    { type: 'h2', text: 'Tek Sayfa, 513 İstek' },
    {
      type: 'p',
      text: 'Şirketler dizini 513 sembol listeliyor ve sayfanın tek bir açılışı veritabanına 513 istek atıyordu. Fiyat çağrısı tekti ve önbellekten geliyordu; sorun, fiyatları veritabanına geri yazan koddaydı.',
    },
    {
      type: 'p',
      text: 'Her kotasyon ayrı bir `insert` ile yazılıyordu, hepsi `Promise.all` ile paralel. Zararsız görünüyor, ama `@neondatabase/serverless` HTTP üzerinden konuşuyor ve kalıcı bağlantı yok. Her `insert` ayrı bir gidiş-dönüş. Üstelik bu yazma, fiyat önbellekten gelse bile çalışıyordu; yani cache\'ten dönen istek de aynı bedeli ödüyordu.',
    },
    {
      type: 'compare',
      label: 'Şirketler Dizini · Tek Sayfa Görüntüleme',
      before: { label: 'Satır Başına Insert', value: '513 İstek' },
      after: { label: 'Gruplu Tek Upsert', value: '2 İstek' },
      note: 'Aynı düzeltmede bir şey daha çıktı: yazma işlemi `void` ile beklenmeden bırakılmıştı. Serverless fonksiyon yanıt döndükten sonra donunca yazma yarıda kalabiliyordu. Artık bekleniyor; tek bir gidiş-dönüşün maliyeti o belirsizliğe değmez.',
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

    { type: 'h2', text: 'Önbellek Süresi Seansa Göre Değişiyor' },
    {
      type: 'p',
      text: 'Bir süre endeksler yenilenmiyor gibi duruyordu. Fiyat önbelleği seans içinde 60 saniyeydi ve sayfayı yenileyen biri çoğu zaman aynı fiyatı görüyordu.',
    },
    {
      type: 'p',
      text: 'Süreyi düşürmeden önce sağlayıcı kotasına bakmak gerekiyordu. Next.js\'in veri önbelleği sunucuda ve bütün ziyaretçiler için ortak; sağlayıcıya giden istek sayısı trafikle değil, yalnızca bu süreyle artıyor. 15 saniyelik süre, bir sembol grubu için dakikada en fazla 4 istek demek. Alpaca\'nın ücretsiz katmanı dakikada 200 isteğe izin veriyor. 4 Ağustos\'ta süre 15 saniyeye indi.',
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
      text: 'Piyasa kapalıyken fiyat hareket etmediği için süre 15 dakikaya çıkıyor; kotayı boşa harcamaya gerek yok.',
    },

    { type: 'h2', text: 'Bir de Saatler Vardı' },
    {
      type: 'p',
      text: 'Saat dönüşümü projenin çıkış sebebi ama kodun küçük bir kısmı.',
    },
    {
      type: 'p',
      text: 'Türkiye yaz saati uygulamıyor, ABD uyguluyor. Bu yüzden New York ile aramızdaki fark sabit değil: yazın 7 saat, kışın 8. Borsa her zaman 09:30\'da açılıyor, ama Türkiye saatiyle bu yazın 16:30, kışın 17:30.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bir yere `7` yazıp geçmek çok kolay. Yazsaydım, Kasım\'da ABD kış saatine döndüğü gün sitedeki bütün saatler bir saat kayacaktı. Uygulama çökmeyecek, sadece yanlış saat gösterecekti.',
    },
    {
      type: 'p',
      text: 'Bu yüzden hiçbir yerde elle saat hesabı yok. Bütün dönüşümler tek dosyada, `Intl` ile ve o günün tarihine göre yapılıyor. Seans durumu da göründüğünden karışık: ön seans, ana seans, akşam seansı, kapalı. Üstüne yarım günler var; Şükran Günü\'nün ertesi günü borsa 13:00\'te kapanıyor.',
    },
    {
      type: 'p',
      text: 'Bir ayrıntı daha: Türkiye\'den okuyan biri için "09:30 açılış" doğru ama işe yaramaz bir bilgi. Türkçe arayüzde öne çıkan saat İstanbul, yanında küçük yazılan saat New York. İngilizceye geçince sıra tersine dönüyor.',
    },

    { type: 'h2', text: 'Yazıları Kim Yazıyor' },
    {
      type: 'p',
      text: 'Bültenleri ve analizleri bir dil modeli yazıyor, ama sunucuda yazı üreten bir model çağrısı yok. Bir dönem vardı: günlük cron 13:30\'da kurallara göre bir özet çıkarıyordu. 6 Ağustos\'ta onu kaldırdım. Makinenin çıkardığı özet günün yerini dolduruyor, kart onu "bugün" diye gösteriyordu ve dünkü bültenin eskidiği görünmüyordu.',
    },
    {
      type: 'p',
      text: 'Şimdi düzen şöyle: claude.ai\'da kurulu zamanlanmış görevler belli saatlerde çalışıyor, sitenin korumalı bir API ucundan o günün verisini çekiyor, yazıyı yazıyor ve başka bir korumalı uca gönderiyor. Site yalnızca veritabanından okuyor.',
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
      text: 'Saatler de bir hatadan çıktı. Günlük bülten bir süre sabah 09:00\'da çalışıyordu, oysa veriyi veritabanına yazan senkronizasyon 13:30\'da çalışıyor. Bülten verinin gelmesinden dört buçuk saat önce yazılıyor ve her sabah bir önceki günün makro değerleriyle çıkıyordu.',
    },
    {
      type: 'p',
      text: 'Gönderilen yazı doğrulamadan geçemezse uç 400 ile birlikte beklenen şemayı da geri yazıyor. Karşı taraf bir model; hata mesajını okuyup kendini düzeltebiliyor.',
    },

    { type: 'h2', text: 'Yazılara Görsel Koymadım, Çizdirdim' },
    {
      type: 'p',
      text: 'Uzun yazıların görsele ihtiyacı vardı, ama görsel demek telif, kaynak arama ve her yazı için ayrı iş demek. Onun yerine metinden çizim yapan bir blok ailesi yazdım.',
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
      text: 'Site bunu yığılmış çubuk ve öncesi-sonrası karşılaştırması olarak çiziyor. `oncesi` bloğu aradaki yüzde değişimi kendisi hesaplıyor; yazan kişi hesaplamadığı için yanlış da hesaplayamıyor. Yedi görsel blok var ve hepsinde satırlar `|` ile ayrılıyor.',
    },
    {
      type: 'p',
      text: 'Kazancı görüntüden çok bakımda. Hiçbir yerde görsel dosyası barındırmıyorum ve tema değişince çizimler de ona uyuyor. Bir PNG bunu yapamaz.',
    },

    { type: 'h2', text: 'Sayılarla' },
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
      text: 'Veri çekmek işin en kolay kısmıydı: dört API, birkaç `fetch`.',
    },
    {
      type: 'p',
      text: 'Zor olan, o verinin doğru hâliyle ekrana çıkması. Yanlış bir sayı uygulamayı çökertmiyor, yalnızca güvenilmez yapıyor ve fark etmek günler sürebiliyor. Kaydedilen F/K\'nin ertesi gün eskimesi, Brent kartının bir haftalık fiyatı bugünmüş gibi göstermesi, 513 isteğin sessizce atılması: üçü de hiçbir hata vermeden oldu.',
    },
    {
      type: 'p',
      text: '"Hesaplanmış sayıyı saklama, girdisini sakla" kuralı, kendi sayfamda birbiriyle çelişen iki fiyat çıkınca şemaya girdi. Şimdi aradığım şey, henüz fark etmediğim bir sonraki yanlış sayının nerede durduğu.',
    },
  ],
}

export default post
