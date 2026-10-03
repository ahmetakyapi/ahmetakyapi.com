import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-abd-borsalarini-takip',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: ABD Borsası Takibi',
  excerpt:
    'Açılış Zili\'nde tek bir hata mesajı çıkmadan önceki günün sayıları bugünün sayıları gibi göründü. Fiyatın, grafiğin ve yazıların aynı seansı göstermesi için yaptıklarım.',
  date: '2026-10-03',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  project: 'acilis-zili',
  content: [
    {
      type: 'lead',
      text: 'Açılış Zili\'nde ABD borsalarını dört şeyden izliyorsun: hisse ve endeks fiyatları, teknik analiz, bilanço özetleri ve günün haberleri. Açılış ve kapanış zili Türkiye saatine göre sayılıyor. Verinin bir kısmı ücretsiz kaynaktan geldiği için 15 dakika gecikmeli; ekran bunu açıkça yazıyor, okur da biliyor. Benim derdim gecikme değildi. Derdim, ekrandaki her sayının hangi güne ait olduğunu doğru söylemesiydi. Fiyat bugünü, grafik dünü gösterirse okur yan yana birbirini tutmayan iki sayı görür.',
    },
    {
      type: 'p',
      text: '17 Eylül\'de tam da bu oldu. New York\'ta saat 11:51, Türkiye\'de 18:51, seans açık. Ana sayfadaki "Günün Hareketleri" paneli en çok yükselenleri sıralıyor: GNRC +%20,66, SMCI +%10,35, INTC +%9,73. Altında da "514 endeks üyesi tarandı · seans içi" yazıyor. Üç sayı da bir önceki günün kapanışına aitti.',
    },
    {
      type: 'p',
      text: 'Hiçbir yerde hata çıkmadı. Sağlayıcı katmanı `ok: true` döndü, panel listeyi çizdi, saat de doğruydu. Yanlış olan, alttaki "seans içi" ifadesiydi: bu sayılar bugünün hareketi değildi. İlk yazıda Brent kartını neden kaldırdığımı anlatmıştım. Bu seferki hatayı fark etmek daha zordu, çünkü sayılar doğruydu, yalnızca ait oldukları gün yanlıştı.',
    },

    { type: 'h2', text: 'Değişim Yüzdesi Hangi Güne Ait?' },
    {
      type: 'p',
      text: 'Bir hissenin günlük değişim yüzdesi (`changePct`) hangi güne ait olduğunu kendi başına söylemiyor. Hangi kapanışa göre hesaplanacağına sağlayıcı karar veriyor. Panelin kodunda bunu denetleyen bir kontrol vardı ama yalnızca ön seansta ve akşam seansında çalışıyordu. Normal seansı dışarıda bırakmanın gerekçesi de koda yazılmıştı: "changePct zaten o günün kapanışına göre."',
    },
    {
      type: 'p',
      text: 'Sağlayıcı o anki veriyi verdiği sürece bu cümle doğru. Fiyatlar Alpaca\'dan geliyor. Alpaca cevap vermeyince kod yedek sağlayıcıyı hiç denemiyordu, çünkü yedek olan Finnhub en fazla sekiz sembolde devreye giriyor; panelde ise 514 sembol var. Kod doğrudan Neon\'daki fiyat önbelleğine düşüyordu ve o tabloda bir önceki seansın yüzdeleri duruyordu. Ekranda gördüğüm sıralama oradan geliyordu.',
    },

    { type: 'h2', text: 'Takvim Günü ile Seans Günü' },
    {
      type: 'p',
      text: 'Düzeltme tek bir alana indi: `MarketStatus.sessionDate`. Bu alan, ekranın o an hangi işlem gününü anlattığını tutuyor. Bu gün, takvimdeki günle her zaman aynı değil.',
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
      text: 'Yeni güne geçiş anı olarak açılış zilini değil, New York saatiyle 04:00\'te başlayan ön seansı seçtim. O saatten sonra ekrandaki yüzdeler o sabahın hareketini gösteriyor. Kontrol de tek satır: bir fiyatın son işlemi bu alandaki güne aitse o fiyat bu seansı anlatıyor, değilse anlatmıyor.',
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
      text: 'Aynı commit\'te takvimin uç durumları için ayrı bir test dosyası da yazdım: gece yarısı, hafta sonu, tam gün tatil, yarım gün ve ön seansın ilk çeyreği. Bu kontrol bozulacaksa bu anlardan birinde bozulur.',
    },

    { type: 'h2', text: 'Fiyatın Alındığı Saat de Önemli' },
    {
      type: 'p',
      text: 'Ertesi gün bu kontrolün yetmediği ortaya çıktı. SNDK sayfasının başında 1.689,93 $ yazıyordu, yanında da "17:02 Güncellendi". Aynı sayfadaki 1G grafiğinde, yani o günün seansını gösteren grafikte, barlar 18:15\'e kadar uzanıyordu ve son bar 1.711,24 $ ile kapanmıştı.',
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
      text: 'Başlıktaki fiyat bugünün seansına aitti, yani yeni kontrolden geçiyordu. Ama sağlayıcıdan yetmiş üç dakika önce alınmıştı. Sebep Next.js\'in veri önbelleği: süresi dolan kaydı hemen silmiyor, gelen isteğe önce süresi dolmuş cevabı verip yenisini arka planda çekiyor (stale-while-revalidate). Günde birkaç kez açılan bir sayfada okurun gördüğü fiyat, ondan önceki ziyaretçi için çekilmiş fiyat oluyor.',
    },
    {
      type: 'p',
      text: 'Bu yüzden kontrole ikinci bir soru ekledim: fiyat sağlayıcıdan ne zaman alındı? Bunu hissenin son işlem saatine bakarak ölçmüyorum. Az işlem gören bir hisse canlı seansta bir saat boyunca hiç el değiştirmeyebilir ve fiyatı yine de günceldir. Onun yerine sağlayıcının cevabındaki `Date` başlığına bakıyorum; bu başlık, cevap önbellekten gelse bile sağlayıcıdan ilk alındığı saati gösteriyor. Sınır, önbellek süresinin 60 saniye fazlası. Seans içinde önbellek süresi 15 saniye, yani fiyat en fazla 75 saniye önce alınmış olabilir.',
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
      text: 'Fiyatlar bu kontrolden geçemezse kod aynı isteği bir kez, önbelleği atlayarak tekrarlıyor. Gelen cevap yine güncel değilse sonuca `stale: true` ekliyor ve bu fiyatları Neon\'daki önbelleğe yazmıyor. Yazsaydı tablodaki güncellenme saati yenilenir, önceden alınmış fiyat az önce alınmış gibi görünürdü.',
    },

    { type: 'h2', text: 'Piyasa Kapalıyken de Kontrol Gerekiyor' },
    {
      type: 'p',
      text: 'Bu yazıyı yazdığım gün, 3 Ekim cumartesi, bir boşluğu daha kapattım. Sorun şuydu: cumartesi açılan MU sayfası, cuma kapanışı olan 1.069,18 $ yerine 1.107,50 $ gösteriyordu. Bu, cuma sabahı New York saatiyle 06:45\'teki ön seans fiyatıydı. Arada %3,6 fark var.',
    },
    {
      type: 'p',
      text: 'Nedeni, kodun piyasa kapalıyken fiyatın ne zaman alındığına hiç bakmamasıydı. Gerekçe, piyasa kapalıyken fiyatın değişmemesiydi. Fiyat değişmiyor, doğru; ama önbellekte duran kayıt son fiyat olmayabiliyor. Next.js\'in önbelleği cuma sabahı alınmış kaydı bir kez daha verdi, kod da ne zaman alındığını sormadan onu kabul etti.',
    },
    {
      type: 'p',
      text: 'Çözüm: piyasa kapalıyken de fiyatın, ekranın anlattığı seans bittikten sonra alınmış olması gerekiyor. Değilse kod isteği bir kez önbelleği atlayarak tekrarlıyor. Seansın bitişi sabit bir saat değil, `MarketStatus` içinde hesaplanıyor: o günün kapanışına akşam seansı, onun üstüne de sağlayıcının 15 dakikalık gecikmesi ekleniyor. Normal bir günde bu, New York saatiyle 20:15 ediyor.',
    },
    {
      type: 'p',
      text: 'İlk sürümde 20:15\'i sabit yazmıştım. Yarım günlerde borsa 13:00\'te kapandığı için seans da erken bitiyor. Kod bunu bilmediğinden, ertesi gün o akşamın doğru fiyatını bile güncel saymıyor ve her istekte önbelleği atlıyordu.',
    },

    { type: 'h2', text: 'Grafik de Önceki Günü Gösteriyordu' },
    {
      type: 'p',
      text: 'Aynı sorunun grafikteki karşılığını 17 Eylül\'deki ilk düzeltmenin hemen ardından buldum. Önbellekten gelen grafik verisi için tek bir sınır vardı: en fazla beş gün önceye ait olabilirdi. Uzun aralıklı grafiklerde bu yeterli. Ama 1G grafiği tek bir seansı çiziyor ve önceki günün seansı bu beş günlük sınırdan rahatça geçiyordu. Ana sayfanın endeks kartlarında bugünün yüzdesinin altında önceki günün seans çizgisi duruyordu.',
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
      text: 'Gün içi verisiyle çizilen aralıklarda (1G ve 1H) önbellekteki serinin son barı artık `sessionDate` gününe ait olmak zorunda. Aynı commit\'te bir sorun daha çıktı. Sağlayıcının "günlük bar" alanı, yani günün açılış, en yüksek, en düşük ve hacim değerleri, açılıştan önce bugünü değil önceki seansı gösteriyor. Sabah 05:41\'de şirketler tablosunda bu sabahın fiyatının yanında önceki günün işlem hacmi "Hacim" başlığıyla duruyordu.',
    },
    {
      type: 'p',
      text: 'O saatlerde bu alanlar artık boş geliyor. Sıfır yazmadım, çünkü "bu sabah hiç işlem olmadı" ile "bu sabahın verisi henüz yok" ayrı şeyler.',
    },

    { type: 'h2', text: 'Güncel Olmayan Fiyat Yazıya Girmez' },
    {
      type: 'p',
      text: 'Ekranda güncel olmayan bir fiyatı göstermenin dürüst bir yolu var: yanına bunu yazmak. Sağlayıcı cevap vermediğinde ekran önbellekteki fiyatı gösteriyor, altındaki satırda da "Önbellek · 19:56 Güncellendi · Güncel Olmayabilir" yazıyor. Okur sayıyı görüyor, ne kadar güveneceğine kendisi karar veriyor.',
    },
    {
      type: 'p',
      text: 'Yazılarda bu yol yok. Günlük bülteni ve olay yazılarını zamanlanmış görevler yazıyor, veriyi de sitenin bir API ucundan alıyor. Oradan çıkan sayı metne giriyor ve orada kalıyor. "S&P 500 bugün %1,2 yükseldi" cümlesini yayımlandıktan sonra kimse dönüp düzeltmiyor. Bu yüzden o uçlar güncel olmayan fiyatı hiç vermiyor: değer boş geliyor, yanında da bunun nedenini belirten bir alan geliyor.',
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
      text: 'Bu alan, `indices_stale`, yalnızca fiyatlar güncel değilken değil, her cevapta var. Sadece sorun olduğunda eklenseydi, alanın olmadığı bir cevapta görev "her şey yolunda" ile "bu kontrol hiç yapılmadı" arasındaki farkı anlayamazdı. Değer boş gelirse görev o cümleyi hiç yazmıyor.',
    },

    { type: 'h2', text: 'Her Kontrolün Bir Bedeli Var' },
    {
      type: 'p',
      text: 'Önbelleği atlayan her tekrar, sağlayıcıya giden bir istek daha demek. 3 Ekim\'deki ilk sürümde 1G grafiği için bir kontrol daha vardı: grafiğin son barı, şu andan en fazla 15 dakika artı bir bar süresi kadar geride olabilirdi. Ama az işlem gören SHAZ\'da beş dakikalık 79 aralığın yalnızca 73\'ünde işlem vardı. Yani son dakikalarda bar olmaması normaldi, kontrol ise bunu hata sayıp her istekte önbelleği atlatıyordu.',
    },
    {
      type: 'p',
      text: 'Aynı gün o kontrolü kaldırdım. Seans içinde artık yalnızca fiyatın ve grafiğin sağlayıcıdan ne zaman alındığına bakılıyor. Cumartesi canlı sunucuda MU, SNDK ve SHAZ\'ın 1G grafiğinde son bar cuma 19:55\'teydi ve kapanışı başlıktaki fiyatla birebir aynıydı.',
    },
    {
      type: 'p',
      text: '16 Eylül\'den 3 Ekim\'e kadar bu kontrol commit commit şekillendi ve her düzeltme bir sonraki boşluğu ortaya çıkardı. Gün kontrolü fiyatın ne zaman alındığına bakmıyordu. Bunu ekleyince piyasanın kapalı olduğu saatler açıkta kaldı, onu düzeltince de yarım günler. Bu durumları artık testler yakalıyor. Henüz test edilmemiş durum hangisi, bilmiyorum. Tahminim şu: onu da bir okurun ekranında, hiçbir hata mesajı görmeden bulacağım.',
    },
  ],
}

export default post
