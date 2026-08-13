import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-nasil-yapildi',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: Saatlerle Kavga Ederek Geçen Üç Ay',
  excerpt:
    'ABD borsası için bir takip uygulaması yaptım. En zor kısmı fiyat çekmek değildi — saatti. Bu yazı, 15 tablo ve 51 commit boyunca neyi yanlış yaptığımın ve nasıl düzelttiğimin dökümü.',
  date: '2026-08-12',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bir şubat sabahı elimde telefonla oturmuş, "CPI bugün 08:30\'da açıklanacak" yazan bir haberi okuyordum. Sonra düşündüm: kimin 08:30\'u? Benim saatimle mi, New York\'la mı? Bunu bulmak için üç ayrı sekme açtım. O gün Açılış Zili\'ni yazmaya başladım.',
    },
    {
      type: 'p',
      text: 'Fikir basitti aslında: ABD borsasıyla ilgilenen ama Türkiye\'de yaşayan biri için, "bugün ne oluyor" sorusunun cevabını tek ekranda ve KENDİ saatiyle veren bir sayfa. Ekonomik takvim, bilanço tarihleri, haberler, makro göstergeler. Hepsi kendi saatiyle.',
    },
    {
      type: 'p',
      text: 'Üç ay sürdü. Ve o üç ayın belki yarısı, hayatımda hiç bu kadar uğraşacağımı düşünmediğim bir şeye gitti: saat dilimleri.',
    },

    { type: 'h2', text: 'Önce Şunu Anlamam Gerekti: Türkiye Yaz Saati Uygulamıyor' },
    {
      type: 'p',
      text: 'Herkes bilir, ben de biliyordum. Ama kodda ne anlama geldiğini ilk kez orada gördüm. ABD yaz saatine geçiyor, biz geçmiyoruz. Yani New York ile aramızdaki fark sabit değil — yazın 7 saat, kışın 8 saat.',
    },
    {
      type: 'p',
      text: 'Bu şu demek: borsanın açılış zili 09:30 New York saatiyle çalar. Bu her zaman doğrudur. Ama benim duvar saatimde yazın 16:30\'a, kışın 17:30\'a denk gelir. Yani hiçbir yere "açılış 16:30" yazamazsın. Yazarsan kasım ayında sitenin tamamı bir saat yanlış olur.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'İlk sürümde tam olarak bunu yaptım. Bir sabit tanımladım: TR_OFFSET = 7. Mart sonunda ABD yaz saatine geçince site bir saat kaydı ve ben bunu ancak birkaç gün sonra fark ettim. Sayı yanlış olduğunda uygulama çökmüyor — sadece sessizce yalan söylüyor. En sinsi hata türü bu.',
    },
    {
      type: 'p',
      text: 'Doğru çözüm, hiçbir yerde saat aritmetiği yapmamaktı. Bütün dönüşümleri tek dosyaya topladım ve o dosyanın dışında kimse dakika toplayıp çıkarmadı.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/market-hours.ts',
      text: `const ET_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: false,
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  weekday: "short",
})

/** Bir UTC anının New York'taki karşılığını parçalar. */
export function etParts(date: Date): EtParts {
  const parts = ET_FORMATTER.formatToParts(date)
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? ""

  // Intl gece yarısını bazı ortamlarda "24" olarak veriyor.
  const hour = Number(get("hour")) % 24
  // ...
}`,
    },
    {
      type: 'p',
      text: 'Buradaki `% 24` bir gecede bulunmuş bir şey değil. Node\'un bazı ICU sürümleri gece yarısını `00` yerine `24` basıyor. Yerelimde hiç görmedim, Vercel\'de bir kere gördüm: gece yarısına denk gelen bir cron çalıştı ve bütün gün 24 saat ileri kaydı.',
    },

    { type: 'h3', text: 'Ters Yön Daha Beter: Yerel Saatten UTC\'ye' },
    {
      type: 'p',
      text: '"Şu tarihte New York\'ta saat 09:30 iken UTC kaçtı" sorusunu cevaplamak, diğer yönden çok daha zor. Çünkü cevabı bulmak için offset\'i bilmen lazım, offset\'i bilmek için de tarihi bilmen lazım — ve tarih dediğin şey zaten hesaplamaya çalıştığın şey.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/market-hours.ts',
      text: `export function etToUtc(year, month, day, hour = 0, minute = 0): Date {
  const target = Date.UTC(year, month - 1, day, hour, minute)

  // 1. tur: kaba tahmin
  const firstGuess = new Date(target - etOffsetMs(new Date(target)))

  // 2. tur: tahminin düştüğü yerin offset'iyle düzelt.
  // Yaz saati sınırında bu iki tur farklı sonuç verir — düzeltme şart.
  const correctedOffset = etOffsetMs(firstGuess)
  return new Date(target - correctedOffset)
}`,
    },
    {
      type: 'p',
      text: 'İki turlu düzeltme. Yılda sadece iki gün fark yaratıyor — mart ve kasımdaki geçiş günleri. Ama o iki gün de bir takvim uygulamasının en çok bakıldığı günlerden değil mi? Testini yazmak da eğlenceliydi: bilerek 8 Mart ve 1 Kasım tarihlerini verip sonucu elle doğruladım.',
    },

    { type: 'h2', text: 'Seans Diye Tek Bir Şey Yok' },
    {
      type: 'p',
      text: 'Başlarken "borsa açık mı kapalı mı" iki durumlu bir şey sanıyordum. Değilmiş. Dört durum var ve dördü de farklı davranıyor.',
    },
    {
      type: 'table',
      head: ['Seans', 'ET saat', 'Ne oluyor'],
      rows: [
        ['Ön seans', '04:00 – 09:30', 'İşlem var, hacim düşük'],
        ['Ana seans', '09:30 – 16:00', 'Açılış zilinden kapanış ziline'],
        ['Akşam seansı', '16:00 – 20:00', 'Bilançolar burada açıklanıyor'],
        ['Kapalı', '20:00 – 04:00', 'Fiyat hareket etmiyor'],
      ],
    },
    {
      type: 'p',
      text: 'Üstüne bir de yarım günler var. Şükran Günü\'nün ertesi günü borsa 13:00\'te kapanıyor. Noel arifesinde de öyle. Bunları da veritabanına seed olarak yazdım, çünkü hiçbir ücretsiz sağlayıcı "bugün yarım gün mü" sorusunu cevaplamıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/market-hours.ts',
      text: `/** O gün işlem var mı — hafta sonu ve tam tatiller hariç. */
function isTradingDay(dateStr: string, holidays: MarketHoliday[]): boolean {
  const weekday = weekdayOf(dateStr)
  if (weekday === 0 || weekday === 6) return false

  const holiday = holidayOn(dateStr, holidays)
  // Yarım günlerde işlem VARDIR, tam tatillerde yoktur.
  return !holiday || holiday.earlyCloseEt !== null
}`,
    },
    {
      type: 'p',
      text: 'O `earlyCloseEt !== null` kontrolü küçük görünüyor ama bir hata düzeltmesi. İlk yazışta tatil listesindeki her gün "kapalı" sayılıyordu ve site Şükran Günü\'nün ertesi günü borsa açıkken kapalı diyordu.',
    },

    { type: 'h2', text: '"Endeksler Güncellenmiyor" Şikâyeti' },
    {
      type: 'p',
      text: 'Siteyi birkaç arkadaşıma gösterdim. İlk gelen geri bildirim şuydu: "Sayfayı yeniliyorum ama fiyatlar aynı kalıyor, çalışıyor mu bu?"',
    },
    {
      type: 'p',
      text: 'Çalışıyordu. Sadece cache süresini 60 saniye koymuştum ve insan sayfayı 60 saniyede bir yenilemiyor — 5 saniyede bir yeniliyor. Yani kullanıcı açısından site donmuş görünüyordu.',
    },
    {
      type: 'p',
      text: 'Süreyi düşürmekten çekiniyordum, çünkü "her ziyaretçi bir istek demek, kota patlar" diye düşünüyordum. Sonra Next.js\'in data cache\'inin nasıl çalıştığına gerçekten baktım ve düşüncemin yanlış olduğunu gördüm.',
    },
    {
      type: 'quote',
      text: 'Cache ziyaretçi başına değil, sunucuda paylaşımlı. Yani sağlayıcıya giden istek sayısı trafiğe göre değil, sadece TTL\'e göre artıyor.',
    },
    {
      type: 'p',
      text: 'Matematiği yapınca rahatladım: 15 saniyelik TTL, dakikada en fazla 4 istek demek. Alpaca\'nın ücretsiz katmanı dakikada 200 kabul ediyor. Üstelik tek çağrı bütün sembolleri birlikte soruyor. Yani tazelik neredeyse bedava.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/market-hours.ts',
      text: `export function quoteTtlSeconds(status: MarketStatus): number {
  switch (status.session) {
    case "regular":
      return 15               // seans içinde: taze olsun
    case "pre-market":
    case "after-hours":
      return 60               // hareket az, 1 dakika yeter
    default:
      return 900              // kapalı: fiyat zaten durgun, kotayı harcama
  }
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Buradaki asıl fikir sabit bir TTL seçmemek. Piyasa kapalıyken 15 saniyede bir fiyat sormak, hareket etmeyen bir sayıyı 240 kere sormak demek. Tazeliği duruma bağlayınca hem kullanıcı memnun oldu hem kota rahatladı.',
    },

    { type: 'h2', text: '513 İstek: Beni En Çok Şaşırtan Hata' },
    {
      type: 'p',
      text: 'Şirketler dizini sayfası vardı — 513 sembolü listeliyordu. Sayfa açılıyordu ama yavaştı. Çok yavaştı. Ve neden yavaş olduğunu bir türlü bulamıyordum, çünkü Alpaca çağrısı tek bir çağrıydı ve cacheten geliyordu.',
    },
    {
      type: 'p',
      text: 'Sonra fiyatları veritabanına yazan koda baktım.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// ÖNCE — her kotasyon için ayrı bir insert, hepsi paralel
await Promise.all(
  quotes.map((q) => db.insert(quotesCache).values(q).onConflictDoUpdate(...))
)`,
    },
    {
      type: 'p',
      text: 'İlk bakışta gayet masum. `Promise.all` var, paralel çalışıyor, sorun ne? Sorun şu: `@neondatabase/serverless` HTTP üzerinden konuşuyor. Kalıcı bir bağlantı yok. Her `db.insert()` ayrı bir HTTP round-trip.',
    },
    {
      type: 'compare',
      label: 'Şirketler dizini · tek sayfa görüntüleme',
      before: { label: 'Ayrı insert\'ler', value: '513 istek' },
      after: { label: 'Çok satırlı tek upsert', value: '2 istek' },
      note: 'Üstelik Alpaca yanıtı cacheten gelse bile bu yazma çalıştığı için, cache isabeti de aynı bedeli ödüyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/index.ts',
      text: `// SONRA — 500'erlik gruplar hâlinde tek upsert.
// 11 kolon × 500 = 5500 parametre; Postgres'in 65535 sınırının çok altında.
const QUOTE_WRITE_BATCH = 500

for (let i = 0; i < rows.length; i += QUOTE_WRITE_BATCH) {
  await db
    .insert(quotesCache)
    .values(rows.slice(i, i + QUOTE_WRITE_BATCH))
    .onConflictDoUpdate({
      target: quotesCache.symbol,
      // excluded.* ile her satır kendi yeni değerini alır
      set: { price: sql\`excluded.price\`, updatedAt: sql\`excluded.updated_at\` },
    })
}`,
    },
    {
      type: 'p',
      text: 'Bir de şu vardı: bu yazma `void` ile bırakılıyordu, yani beklenmiyordu. Sunucusuz fonksiyon yanıtı döndürdükten sonra donduğu için yazma yarıda kesilebiliyordu. Tek round-tripn maliyeti yaklaşık 20 milisaniye — bu belirsizliğe değmez. `await` ekledim.',
    },

    { type: 'h2', text: 'Dört Farklı API, Tek Arayüz' },
    {
      type: 'p',
      text: 'Veri dört yerden geliyor: Alpaca (fiyat ve grafik), Finnhub (şirket profili, haber, bilanço), FRED (makro göstergeler), TCMB (kur). Dördü de farklı şekil döndürüyor, dördü de farklı biçimde patlıyor.',
    },
    {
      type: 'p',
      text: 'Her sağlayıcıyı aynı sonuç tipine indirgedim. İstisna fırlatmak yerine, başarısızlığı da bir değer olarak döndürüyorlar.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/types.ts',
      text: `type ProviderResult<T> =
  | { ok: true; data: T; source: string; fetchedAt: Date }
  | { ok: false; source: string; reason: FailReason; message: string }

type FailReason =
  | "missing-key" | "rate-limited" | "not-found" | "upstream-error"`,
    },
    {
      type: 'p',
      text: 'Bunun güzel yanı şu: anahtar tanımlı değilse uygulama açılmıyor değil — ilgili kart "veri alınamadı" gösteriyor, sayfanın geri kalanı çalışmaya devam ediyor. Yeni bir makinede projeyi klonlayıp hiçbir anahtar girmeden `npm run dev` diyebiliyorsun.',
    },
    {
      type: 'p',
      text: 'Orkestrasyon sırası da hep aynı:',
    },
    {
      type: 'steps',
      items: [
        { title: 'Canlı kaynak', text: 'Sağlayıcıya sor. Cache TTL\'i seansa göre değişiyor.' },
        { title: 'Yedek kaynak', text: 'Birincil düşerse ikincil sağlayıcıya geç (fiyat için Alpaca → Finnhub).' },
        { title: 'Son bilinen değer', text: 'İkisi de düşerse Neon\'daki son kaydı göster — üstünde "güncel olmayabilir" damgasıyla.' },
        { title: 'Hata', text: 'Üçü de olmazsa kart boş kalır. Hiçbir aşamada tahmini değer üretilmez.' },
      ],
    },

    { type: 'h2', text: 'Bir Metriği Silmek de Bir Özellik' },
    {
      type: 'p',
      text: 'Piyasalar sayfasında bir süre Brent petrol fiyatı gösterdim. Sonra kaldırdım ve bu, projede verdiğim en doğru kararlardan biriydi.',
    },
    {
      type: 'p',
      text: 'Sebep: FRED\'in EIA spot serisi günlerce geriden yayımlanıyor. Ücretsiz sağlayıcılarımın hiçbirinde canlı emtia fiyatı yok. Yani ekranda "Brent: 74,20 $" yazıyordu ama o fiyat bir haftalıktı ve kullanıcı bunu bilmiyordu.',
    },
    {
      type: 'quote',
      text: 'Bir haftalık eski bir fiyatı bugünmüş gibi göstermektense, metriği tamamen kaldırmak doğru.',
    },
    {
      type: 'p',
      text: 'Bu karardan sonra bütün siteye bir kural koydum: her kartın altında `kaynak · saat` damgası var. Sağlayıcı kesin saat vermiyorsa ekranda `~` işaretiyle yaklaşık olduğu söyleniyor. Bilanço saatleri mesela hep yaklaşık — sağlayıcı sadece "açılış öncesi" ya da "kapanış sonrası" diyor, dakika vermiyor.',
    },

    { type: 'h2', text: 'Yazılara Görsel Koymadım — Çizdirdim' },
    {
      type: 'p',
      text: 'Sitede uzun yazılar var: rehber içerikleri ve olay bazlı analizler. Bunların görsele ihtiyacı vardı ama görsel demek telif demek, kaynak aramak demek, her yazı için ayrı iş demek.',
    },
    {
      type: 'p',
      text: 'Onun yerine metinden çizim yapan bir blok ailesi yazdım. Yazının içine şöyle bir şey koyuyorsun:',
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
      text: 'Site bunu yığılmış çubuk ve öncesi-sonrası karşılaştırması olarak çiziyor. `oncesi` bloğu aradaki yüzde değişimi kendisi hesaplıyor — yazan kişi hesaplamıyor, dolayısıyla yanlış hesaplayamıyor.',
    },
    {
      type: 'p',
      text: 'Altı görsel blok var: `sayilar`, `bar`, `pay`, `akis`, `oncesi`, `zaman`. Bir de `grafik` bloğu var, o gerçek fiyat serisini çiziyor. Hepsinde satırlar `|` ile ayrılıyor.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Bunun asıl kazancı estetik değil, bakım. Hiçbir yerde görsel barındırmıyorum, telif kovalamıyorum ve tasarım dili her yazıda aynı kalıyor. Tema değiştiğinde çizimler de değişiyor — bir PNG bunu yapamaz.',
    },
    {
      type: 'p',
      text: 'Markdown çözümleyicisini de kendim yazdım. Sebebi basit: hazır bir kütüphane sayfaya en az 30 KB istemci paketi ekliyor, oysa bu metinler sunucuda render ediliyor ve markdown\'ın yalnızca bir alt kümesine ihtiyaç duyuyorlar. Başlık, liste, alıntı, tablo, satır içi biçimlendirme ve `:::` blokları. Hepsi bu.',
    },

    { type: 'h2', text: 'Sunucuda Model Çağrısı Yok' },
    {
      type: 'p',
      text: 'Sitenin yazılı içeriğini — günlük bülten, haftalık bülten, analiz yazıları — bir dil modeli üretiyor. Ama sunucuda hiçbir model çağrısı yok ve `ANTHROPIC_API_KEY` üretimde tanımlı bile değil.',
    },
    {
      type: 'p',
      text: 'Mimari şöyle: claude.ai\'da kurulmuş zamanlanmış görevler var. Her biri belirli bir saatte uyanıyor, sitenin korumalı bir ucundan bağlamı çekiyor, yazıyı yazıyor ve bir başka korumalı uca POST ediyor. Site sadece veritabanından okuyor.',
    },
    {
      type: 'table',
      head: ['Görev', 'Ne zaman', 'Nereye'],
      rows: [
        ['Günlük bülten', 'her gün 16:00 TR', 'Ana sayfa · Günün Özeti'],
        ['Haftalık bülten', 'pazartesi 09:30 TR', '/bulten'],
        ['Analiz yazısı', 'her gün 23:30 TR', '/mercek'],
        ['Bilanço analizi', 'her gün 09:00 TR', '/bilancolar/analizler'],
      ],
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'app/api/brief/route.ts',
      text: `const BodySchema = z.object({
  headline: z.string().trim().min(1).max(200),
  body_md:  z.string().trim().min(1).max(8000),
  locale:   z.string().optional(),
  date:     z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(),
  period:   z.enum(["daily", "weekly"]).optional(),
})

export async function POST(request: Request) {
  const auth = checkBearer(request, process.env.BRIEF_SECRET)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  // gövde doğrulanır, doğrulanmazsa 400 + beklenen şema geri yazılır
}`,
    },
    {
      type: 'p',
      text: 'Doğrulama başarısız olunca 400 ile birlikte beklenen şemayı da geri yazıyorum. Sebebi şu: karşı taraf bir model ve hata mesajını okuyup kendini düzeltebiliyor. Bunu fark ettikten sonra bütün korumalı uçlara aynı şeyi ekledim.',
    },
    {
      type: 'p',
      text: 'Saatlerin seçimi de bir hikâye. Günlük bülten uzun süre sabah 09:00\'da koşuyordu. Ama veriyi veritabanına yazan Vercel cron\'u 13:30\'da çalışıyor. Yani bülten, senkrondan dört buçuk saat ÖNCE yazılıyordu ve her sabahki yazı bir önceki günün makro değerleriyle çıkıyordu. 16:00\'ya çektim, sıra düzeldi.',
    },

    { type: 'h2', text: 'Okuyucunun Saati vs. Kaynağın Saati' },
    {
      type: 'p',
      text: 'Projenin en ince detayı bence bu. İki ayrı saat kavramı var ve ikisini karıştırmamak gerekiyor.',
    },
    {
      type: 'ul',
      items: [
        '`market-hours.ts` seansın KENDİ saatini tutar. Bütün kaynaklar New York saatiyle yayınlar, orası tek doğruluk kaynağıdır.',
        '`session-clock.ts` bambaşka bir soruyu cevaplar: bu an EKRANDA hangi saatle yazılmalı?',
      ],
    },
    {
      type: 'p',
      text: 'Türkçe okuyan biri için cevap Türkiye saati. "09:30 açılış" doğru bir cümle ama okuyucunun duvar saatinde karşılığı yok — "16:30" var. Bu yüzden TR arayüzde birincil saat İstanbul, künyede duran ikincil saat New York. İngilizceye geçince sıra tersine dönüyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/session-clock.ts',
      text: `/** Birincil saatin yanına yazılan künye — "16:30 TR", "09:30 NY". */
export function zoneTag(locale: Locale) {
  return locale === "tr"
    ? { primary: "TR", secondary: "NY" }
    : { primary: "NY", secondary: "TR" }
}

/** Bir ET saatini iki saate açar. Tarih gerekiyor: fark DST ile kayıyor. */
export function timePair(dateEt: string, timeEt: string, locale: Locale) {
  const utc = etDateTimeToUtc(dateEt, timeEt)
  const tr = formatInZone(utc, TR_ZONE)
  return locale === "tr"
    ? { primary: tr, secondary: timeEt }
    : { primary: timeEt, secondary: tr }
}`,
    },
    {
      type: 'p',
      text: 'Grafik ekseninde de aynı sorun çıktı. TradingView\'ın lightweight-charts kütüphanesi zaman değerlerini UTC sanıyor. Barları gösterilecek dilimin duvar saatine kaydırmak için ayrı bir offset fonksiyonu yazmak gerekti.',
    },

    { type: 'h2', text: 'Dürüst Olmak Gereken Yerler' },
    {
      type: 'p',
      text: 'Projede bilerek yarım bıraktığım şeyler var ve kodda bunları saklamadım.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/rate-limit.ts',
      text: `/**
 * NE OLMADIĞI konusunda dürüst olalım: bu bir dağıtık sınırlayıcı değil.
 * Vercel'de her sunucusuz örneğin kendi belleği var, yani gerçek sınır
 * "örnek sayısı × limit" kadar. Kararlı bir saldırganı durdurmaz.
 *
 * NE OLDUĞU: sağlayıcı kotasını tüketen kazara döngülerin ve basit
 * betiklerin önünde ucuz bir set. Redis eklemeden alınabilecek en iyi sonuç.
 */`,
    },
    {
      type: 'p',
      text: 'Aynı şekilde fiyatlar Alpaca\'nın IEX beslemesinden geliyor. Gerçek zamanlı ama konsolide banttan birkaç sent sapabiliyor. Bunu ekranda damgalıyorum. Endeksleri de ETF üzerinden izliyorum (QQQ, SPY, DIA, IWM) ve arayüzde bunu söylüyorum.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Sınırları kodun içine yorum olarak yazmak bana çok işe yarayan bir alışkanlık oldu. Altı ay sonra "burada niye Redis yok" diye kendime kızmak yerine, cevabı olduğu yerde buluyorum.',
    },

    { type: 'h2', text: 'Rakamlarla' },
    {
      type: 'stats',
      label: 'Açılış Zili · bugün itibarıyla',
      items: [
        { value: '15', note: 'Postgres tablosu' },
        { value: '24', note: 'sayfa' },
        { value: '45', note: 'React bileşeni' },
        { value: '13', note: 'migration' },
        { value: '4', note: 'veri sağlayıcı' },
        { value: '2', note: 'dil (TR/EN)' },
      ],
    },
    {
      type: 'p',
      text: 'Teknoloji tarafı: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 — tokenlar `@theme inline` bloğunda, `tailwind.config.ts` yok. Veritabanı Neon PostgreSQL + Drizzle ORM. Auth için next-auth v5. Grafikler lightweight-charts v5. Tema `next-themes` değil, kendi `data-theme` + çerez çözümü.',
    },
    {
      type: 'p',
      text: 'Tailwind v4\'e geçmek beklediğimden kolay oldu. Config dosyası kalkıyor, her şey CSS\'e taşınıyor. Ve `@theme inline` bloğu yüzünden tokenları tek yerde görmek gerçekten rahat.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'Bu projeden çıkardığım en net şey şu: zorluk sandığın yerde olmuyor. Ben "borsa verisi çekmek zor olur" diye başladım. Veri çekmek en kolay kısmıydı — dört API, birkaç fetch, bitti.',
    },
    {
      type: 'p',
      text: 'Zor olan, o verinin doğru saatle, doğru dilde ve dürüst bir damgayla ekrana çıkmasıydı. Bir sayının yanlış olması uygulamayı çökertmiyor; sadece güvenilmez yapıyor. Ve bunu fark etmen günler sürebiliyor.',
    },
    {
      type: 'p',
      text: 'İkincisi: bir şeyi kaldırmak da bir özellik. Brent\'i sildiğim gün site daha az şey gösteriyordu ama daha çok işe yarıyordu.',
    },
    {
      type: 'p',
      text: 'Proje canlıda ve açık kaynak. Kodun tamamı GitHub\'da — özellikle `lib/market-hours.ts` ve `lib/session-clock.ts` dosyalarındaki yorumlar, bu yazıda anlattığım kararların çoğunu olduğu yerde açıklıyor.',
    },
  ],
}

export default post
