import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-abd-borsalarini-takip',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: ABD Borsalarını Takip Etmek',
  excerpt:
    'Fiyat, teknik analiz, bilanço ve haber: Açılış Zili\'nde ABD borsalarını bu dördüyle takip ediyorsun. Dördünün de aynı günü göstermesi için yaptıklarım.',
  date: '2026-10-03',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  project: 'acilis-zili',
  content: [
    {
      type: 'lead',
      text: 'Açılış Zili\'nde ABD borsalarını dört şeyle takip ediyorsun: hisse ve endeks fiyatları, teknik analiz, bilanço özetleri ve günün haberleri. Açılış ve kapanış zili Türkiye saatiyle sayılıyor, verinin bir kısmı ücretsiz kaynaktan geldiği için 15 dakika gecikmeli ve ekran bunu yazıyor. Gecikmeyi okur biliyor. Önemli olan, bu dört parçanın aynı günü göstermesi: fiyat bugünü, grafik dünü anlatıyorsa okur yan yana iki uyumsuz sayı görür.',
    },
    {
      type: 'p',
      text: '17 Eylül\'de tam olarak bu oldu. New York saatiyle 11:51, Türkiye saatiyle 18:51. Seans açık. Açılış Zili\'nin ana sayfasındaki "Günün Hareketleri" paneli en çok yükselenleri sıralıyor: GNRC +%20,66, SMCI +%10,35, INTC +%9,73. Panelin altında "514 endeks üyesi tarandı · seans içi" yazıyor. Üç sayı da bir gün önceki kapanışa aitti.',
    },
    {
      type: 'p',
      text: 'Hiçbir şey hata vermedi. Sağlayıcı katmanı `ok: true` döndü, panel listeyi çizdi, saat satırı doğruydu. Yanlış olan tek şey, ekranın o sayılar hakkında söylediği şeydi: bunlar bugünün hareketi değildi. İlk yazıda Brent kartını neden kaldırdığımı anlatmıştım. Bu yazı ondan daha sinsi bir hatayla ilgili: sayı doğru, tarihi yanlış.',
    },

    { type: 'h2', text: 'Yüzde Hangi Günü Anlattığını Söylemiyor' },
    {
      type: 'p',
      text: 'Bir hissenin günlük değişimi (`changePct`) tek başına "bugün" demiyor. Hangi kapanışa göre hesaplandığına sağlayıcı karar veriyor. Panelin kodunda bunun için bir kontrol vardı, ama yalnızca ön seans ve akşam seansında çalışıyordu. Normal seans için yazılmış gerekçe şuydu: "changePct zaten o günün kapanışına göre."',
    },
    {
      type: 'p',
      text: 'Bu cümle, sağlayıcı taze veri verdiği sürece doğru. Fiyatlar Alpaca\'dan geliyor. Alpaca cevap vermediğinde kod 514 sembol için yedek sağlayıcıyı hiç denemiyordu, çünkü yedek olan Finnhub en fazla sekiz sembolde kullanılıyor. Kod doğrudan Neon\'daki fiyat önbelleğine düşüyordu ve o tabloda bir önceki seansın yüzdeleri duruyordu. Panelde gördüğüm dünkü sıralama bu yoldan geldi.',
    },

    { type: 'h2', text: 'Takvim Günü Değil, Seans Günü' },
    {
      type: 'p',
      text: 'Düzeltme tek bir alan oldu: `MarketStatus.sessionDate`. Bu alan, ekranın o an hangi seansı anlattığını tutuyor ve çoğu zaman bugünün tarihi değil.',
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
      text: 'Sınır olarak açılış zilini değil, 04:00\'te başlayan ön seansı seçtim. O saatten sonra ekrandaki yüzdeler artık o sabahın hareketini gösteriyor. Kural da tek satır: bir fiyatın son işlemi bu güne aitse, o fiyat bu seansı anlatıyor. Değilse anlatmıyor.',
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
      text: 'Aynı commit\'te takvimin köşeleri için ayrı bir test dosyası yazdım: gece yarısı, hafta sonu, tam tatil, yarım gün ve ön seansın ilk çeyreği. Bu kuralın bozulacağı yerler tam olarak bu anlar.',
    },

    { type: 'h2', text: 'Gün Doğruydu, Paket Eskiydi' },
    {
      type: 'p',
      text: 'Ertesi gün aynı kuralın yetmediği çıktı. SNDK sayfasının başında 1.689,93 $ yazıyordu, yanında "17:02 Güncellendi". Aynı ekrandaki günlük grafik ise 18:15\'e kadar bar taşıyordu ve son barın kapanışı 1.711,24 $\'dı.',
    },
    {
      type: 'compare',
      label: 'SNDK · Aynı Ekran, İki Fiyat',
      before: { label: 'Başlıktaki Fiyat (17:02)', value: '1.689,93 $' },
      after: { label: 'Grafiğin Son Barı (18:15)', value: '1.711,24 $' },
      note: 'Aradaki fark %1,3. İki sayı da kendi içinde doğruydu; okuyucu için yine de hata gibi görünüyordu.',
    },
    {
      type: 'p',
      text: 'Fiyat paketi bugüne aitti, yani yeni kontrolden geçiyordu. Ama yetmiş üç dakika önce çekilmişti. Sebep Next.js\'in veri önbelleği: süresi dolan kaydı hemen atmıyor, isteğe eski cevabı verip yenisini arka planda çekiyor (stale-while-revalidate). Günde birkaç kez açılan bir sayfada okuyucunun gördüğü paket, bir önceki ziyaretçinin çektiği paket oluyor.',
    },
    {
      type: 'p',
      text: 'Kural iki soruya çıktı: gün doğru mu, ve paket ne kadar eski? Yaşı ölçerken son işlemin saatine bakmıyorum, sağlayıcının cevabındaki `Date` başlığına bakıyorum. Az işlem gören bir hisse canlı seansta bir saat boyunca hiç el değiştirmeyebilir; onu eski saymak yanlış olurdu. Başlık ise önbellekten dönen cevapta bile ilk çekimin saatini taşıyor. Tolerans, önbellek süresinin 60 saniye fazlası: seans içinde 15 saniyelik süreyle 75 saniye.',
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
      text: 'Paket bu kontrolden geçmezse kod aynı isteği bir kez önbelleği atlayarak tekrarlıyor. O da eski gelirse sonuca `stale: true` ekliyor ve paketi Neon\'daki önbelleğe yazmıyor. Yazsaydı satırın güncellenme saatini sıfırlar, eski sayıyı "az önce öğrenildi" diye saklardı.',
    },

    { type: 'h2', text: 'Piyasa Kapalıyken de Eski Veri Var' },
    {
      type: 'p',
      text: 'Bu yazının yazıldığı gün, 3 Ekim cumartesi, bir delik daha kapandı. Kural "piyasa kapalıysa yaşı sorma" diyordu, çünkü kapalı piyasada fiyat değişmiyor. Ama hangi fiyatın son fiyat olduğu değişiyor. Cumartesi açılan MU sayfası, cuma sabahı New York saatiyle 06:45\'te önbelleğe yazılmış ön seans fiyatını gösteriyordu: 1.107,50 $. Cuma kapanışı 1.069,18 $ idi; fark %3,6.',
    },
    {
      type: 'p',
      text: 'Şimdi kapalı piyasada da bir alt sınır var: paket, anlatılan seansın bitişinden sonra çekilmiş olmalı. Seansın bitişi de sabit bir saat değil, `MarketStatus` içinde hesaplanan bir alan: o günün kapanışı, artı akşam seansı, artı sağlayıcının 15 dakikalık gecikmesi. Normal bir günde bu New York saatiyle 20:15. İlk sürümde 20:15 sabit yazılıydı ve yarım günlerde, borsa 13:00\'te kapandığında, ertesi gün o akşamın doğru paketini bile eski sayıp her istekte önbelleği atlıyordu.',
    },

    { type: 'h2', text: 'Grafik de Aynı Soruyu Cevaplamalı' },
    {
      type: 'p',
      text: 'Fiyattaki kural düzelince aynı hatanın grafikteki kopyası göründü. Önbellekten gelen bar serileri için beş günlük bir yaş sınırı vardı. Uzun aralıklarda bu yeterli, ama bir günlük grafik tek bir seansın şeklini çiziyor ve dünkü seri beş günlük sınırdan rahatça geçiyordu. Ana sayfanın endeks kartlarında sonuç şuydu: bugünün yüzdesinin altında dünün seans çizgisi duruyordu.',
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
      text: 'Gün içi aralıklarda (1G ve 1H) önbellekteki serinin son barı artık seans gününe ait olmak zorunda. Aynı commit\'te bir şey daha çıktı. Sağlayıcının "günlük bar" alanı açılıştan önce bugünü değil dünkü seansı taşıyor. Sabah 05:41\'de şirketler tablosunda bu sabahın fiyatının yanında dünün işlem hacmi "Hacim" başlığıyla duruyordu. O saatlerde bu alanlar artık boş geliyor. Sıfır değil boş, çünkü "bu sabah hiç işlem olmadı" ile "bu sabahın verisi henüz yok" farklı iki şey.',
    },

    { type: 'h2', text: 'Ekran Gösterebilir, Yazı Gösteremez' },
    {
      type: 'p',
      text: 'Eski bir fiyatı göstermenin bir yolu var: yanına bunu açıkça yazmak. Sağlayıcı düştüğünde ekran önbellekteki fiyatı gösteriyor ve altındaki satırda "Önbellek · 19:56 Güncellendi · Güncel Olmayabilir" yazıyor. Okuyucu sayıyı görüyor ve ne kadar güveneceğine kendisi karar veriyor.',
    },
    {
      type: 'p',
      text: 'Yazılar için bu yol yok. Günlük bülteni ve olay yazılarını zamanlanmış görevler yazıyor ve veriyi sitenin bir API ucundan alıyor. Oradan çıkan sayı yazının metnine giriyor ve kalıcı oluyor. "S&P 500 bugün %1,2 yükseldi" cümlesi yayımlandıktan sonra kimse onu düzeltmiyor. Bu yüzden o uçlar eski fiyatı hiç vermiyor; değer boş geliyor ve yanında nedeni yazıyor.',
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
      text: '`indices_stale` alanı her cevapta var, yalnızca veri eskiyken değil. Eksik bir alan okuyana "yok" demiyor, "sormamışlar" diyor. Sayı gelmezse görev o cümleyi hiç kurmuyor.',
    },

    { type: 'h2', text: 'Bedeli ve Açık Kalan Soru' },
    {
      type: 'p',
      text: 'Her kontrolün bir bedeli var: önbelleği atlayan her tekrar, sağlayıcıya giden bir istek daha. 3 Ekim\'deki ilk sürümde gün içi grafik için "son bar en fazla 15 dakika artı bir bar süresi kadar eski olabilir" diye bir kural daha vardı. Az işlem gören SHAZ\'da beş dakikalık 79 aralığın yalnızca 73\'ünde işlem vardı; son dakikalarda bar olmaması gerçek bir durumdu, ama kural onu her istekte önbelleği atlamaya zorluyordu. Aynı gün o kuralı kaldırdım ve seans içinde tek ölçü olarak cevabın yaşı kaldı. Cumartesi canlı sunucuda MU, SNDK ve SHAZ\'ın günlük grafiğinin son barı cuma 19:55\'teydi ve kapanışı başlıktaki fiyatla birebir aynıydı.',
    },
    {
      type: 'p',
      text: '16 Eylül\'den 3 Ekim\'e kadar bu kural altı commit\'te şekillendi ve her düzeltme bir sonrakinin deliğini ortaya çıkardı. Gün kontrolü yaşı unuttu, yaş kontrolü kapalı piyasayı unuttu, kapalı piyasa kuralı yarım günleri unuttu. Testler artık bu köşeleri tutuyor. Henüz test edilmeyen köşenin hangisi olduğunu bilmiyorum; bildiğim tek şey, onu da büyük ihtimalle bir okuyucunun ekranında, hiçbir hata mesajı görmeden bulacağım.',
    },
  ],
}

export default post
