import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'acilis-zili-abd-borsalarini-takip',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: Canlı Fiyatı Doğru Göstermek',
  excerpt:
    "Açılış Zili'nde bir sabah önceki günün rakamları bugünün rakamları gibi göründü ve hiçbir yerde hata çıkmadı. Fiyatın, grafiğin ve yazıların hep aynı günü anlatması için kurduğum kontrolleri anlatıyorum.",
  date: '2026-10-03',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  project: 'acilis-zili',
  content: [
    {
      type: 'lead',
      text: "Açılış Zili'nde ABD borsasını dört şeyden izliyorsun: hisse ve endeks fiyatları, grafikler, bilanço özetleri ve günün haberleri. Verinin bir kısmı ücretsiz kaynaklardan geldiği için 15 dakika gecikmeli ve ekran bunu açıkça yazıyor. Benim derdim hiçbir zaman gecikme olmadı. Derdim, ekrandaki her sayının hangi güne ait olduğunu doğru söylemesiydi. Fiyat bugünü, grafik dünü gösterirse okuyan kişi yan yana birbirini tutmayan iki sayı görür ve siteye güvenmeyi bırakır.",
    },
    {
      type: 'p',
      text: "Bu yazı, o güveni korumak için bir ayda kurduğum kontrollerin hikâyesi. Hiçbiri büyük bir özellik değil; hepsi \"bu sayı gerçekten bugünün mü\" sorusunun bir başka hâli.",
    },

    { type: 'h2', text: 'Bir Sabah Fark Ettiğim Şey' },
    {
      type: 'p',
      text: 'Eylül ortasında bir gün seans açıkken siteyi açtım. Ana sayfadaki "Günün Hareketleri" paneli en çok yükselenleri sıralıyordu ve altında "seans içi" yazıyordu. Sayılar makul görünüyordu. Sorun şuydu: üçü de bir önceki günün kapanışına aitti.',
    },
    {
      type: 'p',
      text: 'Hiçbir yerde hata çıkmamıştı. Sağlayıcı katmanı başarılı döndü, panel listeyi çizdi, saat de doğruydu. Yanlış olan, sayıların altındaki "seans içi" ifadesiydi. Fiyatları veren ana sağlayıcı o an cevap vermiyordu; yedek sağlayıcı yalnızca birkaç sembol için devreye girebiliyordu ve panelde beş yüzü aşkın sembol vardı. Kod da sessizce veritabanındaki fiyat önbelleğine düşmüştü. O tabloda bir önceki seansın yüzdeleri duruyordu.',
    },
    {
      type: 'p',
      text: 'Bu hatayı fark etmek, yanlış bir sayıyı fark etmekten daha zordu. Çünkü sayılar doğruydu; sadece ait oldukları gün yanlıştı.',
    },

    { type: 'h2', text: 'Takvim Günü ile Seans Günü Aynı Şey Değil' },
    {
      type: 'p',
      text: 'Düzeltme tek bir kavrama indi: ekranın o an hangi işlem gününü anlattığı. Bu gün, takvimdeki günle her zaman aynı değil.',
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
      text: "Yeni güne geçiş anı olarak açılış zilini değil, New York saatiyle sabah dörtte başlayan ön seansı seçtim. O saatten sonra ekrandaki yüzdeler o sabahın hareketini gösteriyor. Kontrol de tek satır: bir fiyatın son işlemi ekranın anlattığı güne aitse o fiyat bu seansı anlatıyor, değilse anlatmıyor.",
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
      text: 'Aynı gün takvimin uç durumları için bir test dosyası da yazdım: gece yarısı, hafta sonu, tam gün tatil, yarım gün, ön seansın ilk dakikaları. Bu kontrol bir gün bozulacaksa bu anlardan birinde bozulur.',
    },

    { type: 'h2', text: 'Fiyatın Ne Zaman Alındığı da Önemli' },
    {
      type: 'p',
      text: 'Ertesi gün bu kontrolün yetmediğini gördüm. Bir hisse sayfasının başında fiyat ve yanında "17:02 güncellendi" yazıyordu. Aynı sayfadaki günlük grafikte ise barlar 18:15\'e kadar uzanıyordu ve son barın kapanışı başlıktaki fiyattan farklıydı.',
    },
    {
      type: 'compare',
      label: 'Aynı Ekran, İki Fiyat',
      before: { label: 'Başlıktaki Fiyat (17:02)', value: '1.689,93 $' },
      after: { label: 'Grafiğin Son Barı (18:15)', value: '1.711,24 $' },
      note: 'Aradaki fark yüzde 1,3. İki sayı da kendi içinde doğruydu; yan yana durunca hata gibi görünüyordu.',
    },
    {
      type: 'p',
      text: "Başlıktaki fiyat bugünün seansına aitti, yani yeni kontrolden geçiyordu. Ama sağlayıcıdan yetmiş dakika önce alınmıştı. Sebep Next.js'in veri önbelleği: süresi dolan kaydı hemen silmiyor, gelen isteğe önce eski cevabı veriyor, yenisini arka planda çekiyor. Günde birkaç kez açılan bir sayfada senin gördüğün fiyat, senden önceki ziyaretçi için çekilmiş fiyat oluyor.",
    },
    {
      type: 'p',
      text: "Bu yüzden kontrole ikinci bir soru ekledim: fiyat sağlayıcıdan ne zaman alındı? Bunu hissenin son işlem saatine bakarak ölçmüyorum, çünkü az işlem gören bir hisse canlı seansta bir saat boyunca hiç el değiştirmeyebilir ve fiyatı yine de günceldir. Onun yerine sağlayıcının cevabındaki tarih başlığına bakıyorum; o başlık cevap önbellekten gelse bile ilk alındığı saati taşıyor. Sınır, önbellek süresinin bir dakika fazlası. Seans içinde bu, fiyatın en fazla 75 saniye önce alınmış olması demek.",
    },
    {
      type: 'p',
      text: 'Fiyat bu kontrolden geçemezse kod aynı isteği bir kez, önbelleği atlayarak tekrarlıyor. Gelen cevap yine güncel değilse sonuca "güncel değil" işareti koyuyor ve bu fiyatı veritabanına yazmıyor. Yazsaydı tablodaki güncellenme saati yenilenir ve eski fiyat az önce alınmış gibi görünürdü.',
    },

    { type: 'h2', text: 'Piyasa Kapalıyken de Kontrol Gerekiyor' },
    {
      type: 'p',
      text: 'Bu yazıyı yazdığım gün, bir cumartesi, bir boşluğu daha kapattım. Bir hisse sayfası cuma kapanışı yerine cuma sabahının ön seans fiyatını gösteriyordu; arada yüzde 3,6 fark vardı. Kod piyasa kapalıyken fiyatın ne zaman alındığına hiç bakmıyordu. Gerekçe mantıklı görünüyordu: piyasa kapalıyken fiyat değişmez. Doğru, fiyat değişmiyor; ama önbellekte duran kayıt son fiyat olmayabiliyor.',
    },
    {
      type: 'p',
      text: 'Çözüm şu: piyasa kapalıyken de fiyatın, ekranın anlattığı seans bittikten sonra alınmış olması gerekiyor. Seansın bitişi de sabit bir saat değil; o günün kapanışına akşam seansı ve sağlayıcının gecikmesi ekleniyor. İlk sürümde bunu sabit yazmıştım ve yarım günlerde borsa erken kapandığı için kod ertesi gün doğru fiyatı bile güncel saymıyor, her istekte önbelleği atlıyordu.',
    },

    { type: 'h2', text: 'Grafik de Önceki Günü Gösteriyordu' },
    {
      type: 'p',
      text: 'Aynı sorunun grafikteki karşılığını da buldum. Önbellekten gelen grafik verisi için tek bir sınır vardı: en fazla beş gün eski olabilirdi. Haftalık ve aylık grafiklerde bu yeterli. Ama günlük grafik tek bir seansı çiziyor ve önceki günün seansı o beş günlük sınırdan rahatça geçiyordu. Endeks kartlarında bugünün yüzdesinin altında dünün çizgisi duruyordu.',
    },
    {
      type: 'p',
      text: 'Gün içi grafiklerde artık serinin son barı ekranın anlattığı güne ait olmak zorunda. Bir şey daha çıktı: sağlayıcının "günlük bar" dediği açılış, en yüksek, en düşük ve hacim değerleri, açılıştan önce bugünü değil önceki seansı anlatıyor. Sabah erken saatte şirketler tablosunda bu sabahın fiyatının yanında dünün hacmi duruyordu. O saatlerde bu alanlar artık boş geliyor. Sıfır yazmadım, çünkü "bu sabah hiç işlem olmadı" ile "bu sabahın verisi henüz yok" aynı şey değil.',
    },

    { type: 'h2', text: 'Güncel Olmayan Fiyat Yazıya Girmez' },
    {
      type: 'p',
      text: 'Ekranda eski bir fiyatı göstermenin dürüst bir yolu var: yanına bunu yazmak. Sağlayıcı cevap vermediğinde ekran önbellekteki fiyatı gösteriyor ve altına "önbellek, güncel olmayabilir" diye not düşüyor. Okuyan kişi sayıyı görüyor, ne kadar güveneceğine kendisi karar veriyor.',
    },
    {
      type: 'p',
      text: 'Yazılarda bu yol yok. Günlük bülteni ve olay yazılarını zamanlanmış görevler yazıyor, veriyi sitenin bir API ucundan alıyor. Oradan çıkan sayı metne giriyor ve orada kalıyor; "S&P 500 bugün yüzde 1,2 yükseldi" cümlesini yayınlandıktan sonra kimse dönüp düzeltmiyor. Bu yüzden o uçlar eski fiyatı hiç vermiyor. Değer boş geliyor, yanında da bunun nedenini söyleyen bir alan geliyor. Görev o cümleyi hiç yazmıyor.',
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
      text: 'Bu alan her cevapta var, yalnızca sorun olduğunda değil. Sadece sorun olduğunda eklenseydi, alanın olmadığı bir cevapta görev "her şey yolunda" ile "bu kontrol hiç yapılmadı" arasındaki farkı anlayamazdı.',
    },

    { type: 'h2', text: 'Her Kontrolün Bir Bedeli Var' },
    {
      type: 'p',
      text: "Önbelleği atlayan her tekrar, sağlayıcıya giden bir istek daha demek. Bir ara günlük grafik için fazladan bir kontrol daha vardı: son bar şu andan en fazla on beş dakika artı bir bar süresi geride olabilirdi. Ama az işlem gören bir hissede beş dakikalık aralıkların bir kısmında hiç işlem olmuyor. Son dakikalarda bar olmaması normaldi; kontrol bunu hata sayıp her istekte önbelleği atlatıyordu. O kontrolü kaldırdım.",
    },
    {
      type: 'p',
      text: 'Bir ay boyunca bu kontrol parça parça şekillendi ve her düzeltme bir sonraki boşluğu ortaya çıkardı. Gün kontrolü fiyatın ne zaman alındığına bakmıyordu. Onu ekleyince piyasanın kapalı olduğu saatler açıkta kaldı, onu düzeltince de yarım günler. Bu durumları artık testler yakalıyor. Henüz test edilmemiş durum hangisi, bilmiyorum. Tahminim şu: onu da bir okurun ekranında, hiçbir hata mesajı görmeden bulacağım.',
    },
  ],
}

export default post
