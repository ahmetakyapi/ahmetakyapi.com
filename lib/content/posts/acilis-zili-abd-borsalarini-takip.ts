import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-abd-borsalarini-takip',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: ABD Borsası Takibi',
  excerpt:
    'Açılış Zili\'nde hiçbir yer hata vermeden dünün sayıları bugünmüş gibi göründü. Fiyatın, grafiğin ve yazıların aynı seansı anlatması için yaptıklarım.',
  date: '2026-10-03',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  project: 'acilis-zili',
  content: [
    {
      type: 'lead',
      text: 'Açılış Zili\'nde ABD borsalarını dört şeyden izliyorsun: hisse ve endeks fiyatları, teknik analiz, bilanço özetleri ve günün haberleri. Açılış ve kapanış zili Türkiye saatine göre sayılıyor. Verinin bir kısmı ücretsiz kaynaktan geldiği için 15 dakika gecikmeli; ekran bunu açıkça yazıyor, okur da biliyor. Benim derdim gecikme değildi. Derdim, bu dört parçanın aynı günü anlatmasıydı. Fiyat bugünü, grafik dünü gösterirse okur yan yana birbirini tutmayan iki sayı görür.',
    },
    {
      type: 'p',
      text: '17 Eylül\'de tam da bu oldu. New York\'ta saat 11:51, Türkiye\'de 18:51, seans açık. Ana sayfadaki "Günün Hareketleri" paneli en çok yükselenleri sıralıyor: GNRC +%20,66, SMCI +%10,35, INTC +%9,73. Altında da "514 endeks üyesi tarandı · seans içi" yazıyor. Üç sayı da bir önceki günün kapanışına aitti.',
    },
    {
      type: 'p',
      text: 'Hiçbir yerde hata çıkmadı. Sağlayıcı katmanı `ok: true` döndü, panel listeyi çizdi, saat de doğruydu. Yanlış olan, ekranın bu sayılar hakkında söylediği şeydi: bunlar bugünün hareketi değildi. İlk yazıda Brent kartını neden kaldırdığımı anlatmıştım. Bu seferki hata daha sinsiydi, çünkü sayı doğruydu, yalnızca tarihi yanlıştı.',
    },

    { type: 'h2', text: 'Bu Yüzde Hangi Güne Ait?' },
    {
      type: 'p',
      text: 'Bir hissenin günlük değişimi (`changePct`) kendi başına "bugün" demiyor. Hangi kapanışa göre hesaplanacağına sağlayıcı karar veriyor. Panelin kodunda buna bakan bir kontrol vardı ama yalnızca ön seansta ve akşam seansında çalışıyordu. Normal seansı dışarıda bırakmanın gerekçesi de koda yazılmıştı: "changePct zaten o günün kapanışına göre."',
    },
    {
      type: 'p',
      text: 'Sağlayıcı taze veri verdiği sürece bu cümle doğru. Fiyatlar Alpaca\'dan geliyor. Alpaca cevap vermeyince kod yedek sağlayıcıyı hiç denemiyordu, çünkü yedek olan Finnhub en fazla sekiz sembolde devreye giriyor; panelde ise 514 sembol var. Kod doğrudan Neon\'daki fiyat önbelleğine düşüyordu ve o tabloda bir önceki seansın yüzdeleri duruyordu. Ekranda gördüğüm dünkü sıralama oradan geliyordu.',
    },

    { type: 'h2', text: 'Cumartesi Hâlâ Cuma' },
    {
      type: 'p',
      text: 'Düzeltme tek bir alana indi: `MarketStatus.sessionDate`. Bu alan, ekranın o an hangi seansı anlattığını tutuyor. Çoğu zaman da bugünün tarihi olmuyor.',
    },
    {
      type: 'table',
      head: ['An (New York Saati)', 'Takvim Günü', 'Anlatılan Seans'],
      rows: [
        ['Cumartesi, Herhangi Bir Saat', 'Cumartesi', 'Cuma'],
        ['Çarşamba 02:00', 'Çarşamba', 'Salı'],
        ['Tatil Olan Pazartesi', 'Pazartesi', 'Önceki Cuma'],
        ['İşlem Günü, 04:00 Sonrası', 'O Gün', 'O Gün'],
      ],
    },
    {
      type: 'p',
      text: 'Günün değiştiği an olarak açılış zilini değil, 04:00\'te başlayan ön seansı seçtim. O saatten sonra ekrandaki yüzdeler o sabahın hareketini gösteriyor. Kural da tek satır: bir fiyatın son işlemi bu güne aitse o fiyat bu seansı anlatıyor, değilse anlatmıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/market-hours.ts',
      text: `export function isSessionTrade(
  tradedAt: Date | null | undefined,
  status: MarketStatus,
): boolean {
  if (!tradedAt) return false;
  return etParts(tradedAt).dateStr === status.sessionDate;
}`,
    },
    {
      type: 'p',
      text: 'Aynı commit\'te takvimin köşeleri için ayrı bir test dosyası da yazdım: gece yarısı, hafta sonu, tam gün tatil, yarım gün ve ön seansın ilk çeyreği. Bu kural bozulacaksa bu anlardan birinde bozulur.',
    },

    { type: 'h2', text: 'Tarih Doğru, Fiyat Bayat' },
    {
      type: 'p',
      text: 'Ertesi gün bu kuralın yetmediği ortaya çıktı. SNDK sayfasının başında 1.689,93 $ yazıyordu, yanında da "17:02 Güncellendi". Aynı ekrandaki günlük grafikte ise barlar 18:15\'e kadar uzanıyordu ve son bar 1.711,24 $ ile kapanmıştı.',
    },
    {
      type: 'compare',
      label: 'SNDK · Aynı Ekran, İki Fiyat',
      before: { label: 'Başlıktaki Fiyat (17:02)', value: '1.689,93 $' },
      after: { label: 'Grafiğin Son Barı (18:15)', value: '1.711,24 $' },
      note: 'Aradaki fark %1,3. İki sayı da kendi içinde doğruydu ama yan yana durunca okura hata gibi görünüyordu.',
    },
    {
      type: 'p',
      text: 'Fiyat paketi bugüne aitti, yani yeni kontrolden geçiyordu. Ama yetmiş üç dakika önce çekilmişti. Sebep Next.js\'in veri önbelleği: süresi dolan kaydı hemen atmıyor, gelen isteğe eskisini verip yenisini arka planda çekiyor (stale-while-revalidate). Günde birkaç kez açılan bir sayfada okurun gördüğü fiyat, kendisinden önceki ziyaretçinin çektiği fiyat oluyor.',
    },
    {
      type: 'p',
      text: 'Böylece kural iki soruya çıktı: gün doğru mu, paket ne kadar eski? Yaşı ölçerken son işlemin saatine bakmıyorum, sağlayıcının cevabındaki `Date` başlığına bakıyorum. Az işlem gören bir hisse canlı seansta bir saat boyunca hiç el değiştirmeyebilir; onu eski saymak haksızlık olurdu. Başlık ise önbellekten dönen cevapta bile ilk çekimin saatini taşıyor. Tanıdığım pay, önbellek süresinin 60 saniye fazlası. Seans içinde süre 15 saniye olduğu için sınır 75 saniye.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/index.ts',
      text: `if (!expectsSessionData(status, now)) return closedResponseCurrent(pack.fetchedAt, status, now);
if (!isSessionTrade(newestTrade(pack.data), status)) return false;
const age = now.getTime() - pack.fetchedAt.getTime();
return age <= (ttl + RESPONSE_AGE_SLACK_SECONDS) * 1000;`,
    },
    {
      type: 'p',
      text: 'Paket bu kontrolden geçmezse kod aynı isteği bir kez, önbelleği atlayarak tekrarlıyor. O da eski gelirse sonuca `stale: true` ekliyor ve paketi Neon\'daki önbelleğe yazmıyor. Yazsaydı satırın güncellenme saatini sıfırlardı; eski sayı "az önce öğrenildi" diye saklanırdı.',
    },

    { type: 'h2', text: 'Kapalı Piyasada da Eskiyor' },
    {
      type: 'p',
      text: 'Bu yazıyı yazdığım gün, 3 Ekim cumartesi, bir açık daha kapattım. Kural "piyasa kapalıysa yaşı sorma" diyordu, çünkü piyasa kapalıyken fiyat değişmiyor. Ama hangi fiyatın son fiyat olduğu değişiyor. Cumartesi açılan MU sayfası cuma sabahının ön seans fiyatını gösteriyordu: 1.107,50 $. Bu fiyat New York saatiyle 06:45\'te önbelleğe yazılmıştı. Cuma kapanışı ise 1.069,18 $; arada %3,6 fark var.',
    },
    {
      type: 'p',
      text: 'Artık kapalı piyasada da bir alt sınır var: paket, anlatılan seans bittikten sonra çekilmiş olmalı. Seansın bitişi de sabit bir saat değil, `MarketStatus` içinde hesaplanıyor. O günün kapanışına akşam seansı, onun üstüne de sağlayıcının 15 dakikalık gecikmesi ekleniyor. Normal bir günde bu, New York saatiyle 20:15 ediyor.',
    },
    {
      type: 'p',
      text: 'İlk sürümde 20:15\'i sabit yazmıştım. Yarım günlerde borsa 13:00\'te kapanıyor ve kod ertesi gün o akşamın doğru paketini bile eski sayıp her istekte önbelleği atlıyordu.',
    },

    { type: 'h2', text: 'Sıra Grafiğe Geldi' },
    {
      type: 'p',
      text: 'Fiyat tarafını düzeltince aynı hatanın grafikteki kopyası göründü. Önbellekten gelen bar serileri için beş günlük bir yaş sınırı vardı. Uzun aralıklarda bu yetiyor. Ama günlük grafik tek bir seansın şeklini çiziyor ve dünkü seri beş günlük sınırdan rahatça geçiyordu. Ana sayfanın endeks kartlarında bugünün yüzdesinin altında dünün seans çizgisi duruyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/index.ts',
      text: `if (!INTRADAY_RANGES.has(range)) return true;
const last = bars[bars.length - 1];
return etParts(new Date(last.time * 1000)).dateStr === status.sessionDate;`,
    },
    {
      type: 'p',
      text: 'Gün içi aralıklarda (1G ve 1H) önbellekteki serinin son barı artık seans gününe ait olmak zorunda. Aynı commit\'te bir sorun daha çıktı: sağlayıcının "günlük bar" alanı, açılıştan önce bugünü değil dünkü seansı taşıyor. Sabah 05:41\'de şirketler tablosunda bu sabahın fiyatının yanında dünün işlem hacmi "Hacim" başlığıyla duruyordu.',
    },
    {
      type: 'p',
      text: 'O saatlerde bu alanlar artık boş geliyor. Sıfır yazmadım, çünkü "bu sabah hiç işlem olmadı" ile "bu sabahın verisi henüz yok" ayrı şeyler.',
    },

    { type: 'h2', text: 'Ekran Gösterebilir, Yazı Gösteremez' },
    {
      type: 'p',
      text: 'Eski bir fiyatı göstermenin dürüst bir yolu var: yanına eski olduğunu yazmak. Sağlayıcı düştüğünde ekran önbellekteki fiyatı gösteriyor, altındaki satırda da "Önbellek · 19:56 Güncellendi · Güncel Olmayabilir" yazıyor. Okur sayıyı görüyor, ne kadar güveneceğine kendisi karar veriyor.',
    },
    {
      type: 'p',
      text: 'Yazılarda bu yol yok. Günlük bülteni ve olay yazılarını zamanlanmış görevler yazıyor, veriyi de sitenin bir API ucundan alıyor. Oradan çıkan sayı metne giriyor ve orada kalıyor. "S&P 500 bugün %1,2 yükseldi" cümlesini yayımlandıktan sonra kimse dönüp düzeltmiyor. Bu yüzden o uçlar eski fiyatı hiç vermiyor; değer boş geliyor, yanında da nedeni yazıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'app/api/brief/context/route.ts',
      text: `const quotes = await getQuotes([...INDEX_STRIP], status);
const usable = quotes.ok && !quotes.stale;
indicesStale = quotes.ok ? Boolean(quotes.stale) : true;`,
    },
    {
      type: 'p',
      text: '`indices_stale` alanı yalnızca veri eskiyken değil, her cevapta var. Çünkü eksik bir alan okuyana "veri yok" demiyor, "bunu kimse sormamış" diyor. Sayı gelmezse görev o cümleyi hiç kurmuyor.',
    },

    { type: 'h2', text: 'Kontrolün Bedeli' },
    {
      type: 'p',
      text: 'Her kontrolün bir bedeli var: önbelleği atlayan her tekrar, sağlayıcıya giden bir istek daha demek. 3 Ekim\'deki ilk sürümde gün içi grafik için bir kural daha vardı: son bar en fazla 15 dakika artı bir bar süresi kadar eski olabilirdi. Az işlem gören SHAZ\'da beş dakikalık 79 aralığın yalnızca 73\'ünde işlem vardı. Yani son dakikalarda bar olmaması gerçek bir durumdu, ama kural onu her istekte önbelleği atlamaya zorluyordu.',
    },
    {
      type: 'p',
      text: 'Aynı gün o kuralı kaldırdım; seans içinde tek ölçü cevabın yaşı kaldı. Cumartesi canlı sunucuda MU, SNDK ve SHAZ\'ın günlük grafiğinde son bar cuma 19:55\'teydi ve kapanışı başlıktaki fiyatla birebir aynıydı.',
    },
    {
      type: 'p',
      text: '16 Eylül\'den 3 Ekim\'e kadar bu kural commit commit şekillendi ve her düzeltme bir sonrakinin açığını gösterdi. Gün kontrolü yaşı unuttu, yaş kontrolü kapalı piyasayı, kapalı piyasa kuralı da yarım günleri. Bu köşeleri artık testler tutuyor. Henüz test edilmemiş köşe hangisi, bilmiyorum. Tahminim şu: onu da bir okurun ekranında, hiçbir hata mesajı görmeden bulacağım.',
    },
  ],
}

export default post
