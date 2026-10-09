import type { BlogPost } from '../types'

/*
 * 9 Ekim 2026: yazının odağı "canlı fiyatı doğru göstermek"ten ürünün
 * asıl derdine çekildi (sahibi: "Açılış Zili'nin odaklandığı şey doğru
 * canlı fiyat değil, ABD borsalarını doğru takip edebilmek"). Fiyatın
 * tazeliği artık dört bölümden birinin içinde bir ayrıntı.
 */
export const post: BlogPost = {
  slug: 'acilis-zili-abd-borsalarini-takip',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: ABD Borsasını Doğru Takip Etmek',
  excerpt:
    "Açılış Zili'nin tek derdi ABD borsasını Türkiye'den doğru takip edebilmek. Doğru takip dört şey demek: doğru saat, doğru gün, doğru sıra ve eksiksiz bağlam. Her birini sitede nasıl kurduğumu anlatıyorum.",
  date: '2026-10-03',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  project: 'acilis-zili',
  content: [
    {
      type: 'lead',
      text: "Açılış Zili'ni ABD borsasını Türkiye'den takip etmek için yazdım ve siteye koyduğum her şey tek bir soruya cevap veriyor: bu takip doğru mu? Fiyatı görmek takip etmek değil. Fiyat kolay; herhangi bir uygulama gösteriyor. Zor olan, piyasayı doğru saatte, doğru günde, doğru sırayla ve eksiksiz bağlamla izleyebilmek. Bu yazı o dört parçanın her birini sitede nasıl kurduğumu anlatıyor.",
    },
    {
      type: 'p',
      text: "Siteyi ilk kez duyuyorsan önce sitede ne olduğunu anlatan yazıya bakabilirsin. Burada ürünün parçalarını değil, parçaları bir arada tutan fikri anlatacağım.",
    },

    { type: 'h2', text: 'Türkiye\'den Takip Etmek Neden Zor' },
    {
      type: 'p',
      text: "ABD borsasını Türkiye'den izleyen biri her gün aynı çeviriyi yapıyor. Kaynaklar New York saatiyle yazıyor, haberler İngilizce, bilanço \"kapanıştan sonra\" açıklanıyor ve bunun bizde kaç olduğunu herkes kendisi hesaplıyor. ABD yaz saatine geçince hesap bir saat kayıyor. Fiyat bir uygulamada, takvim başka bir sitede, haber bir üçüncüsünde. Hangi şirketin bu hafta bilanço açıklayacağını öğrenmek bile üç sekme demek.",
    },
    {
      type: 'p',
      text: 'Bu dağınıklık yalnızca zahmet değil, yanlış takip demek. Dünkü kapanışı bugünün hareketi sanmak, bilançoyu bir gün geç fark etmek, makro veriyi saatinde kaçırmak hep aynı sebepten oluyor: parçalar ayrı yerlerde ve her biri kendi saatini konuşuyor. Açılış Zili bunları tek ekranda ve tek saatte toplamak için var.',
    },

    { type: 'h2', text: 'Doğru Saat' },
    {
      type: 'p',
      text: "İlk ve en görünür karar: sitede birincil saat İstanbul. Borsa New York'ta 09:30'da açılıyor ama ekranda 16:30 yazıyor, çünkü senin saatin o. New York saati künyede, küçük puntoyla duruyor; İngilizceye geçince sıra tersine dönüyor. Ana sayfadaki geri sayım sıradaki zile kadar kalan süreyi senin saatinle sayıyor ve sıfırda zil çalıyor.",
    },
    {
      type: 'p',
      text: 'Bu kararın küçük görünen ama her yere sızan bir tuzağı var: Türkiye yaz saati uygulamıyor, ABD uyguluyor. Aradaki fark yazın yedi, kışın sekiz saat. Bir yere "7" yazıp geçsem Kasım\'da sitedeki bütün saatler bir saat kayacak, site çökmeyecek, sadece yanlış saat gösterecekti. Bu yüzden hiçbir yerde elle saat hesabı yok; bütün dönüşümler tek dosyada ve o günün tarihine göre yapılıyor. Yarım günler de orada: Şükran Günü ertesi borsa 13:00\'te kapanıyor ve site bunu biliyor.',
    },

    { type: 'h2', text: 'Doğru Gün' },
    {
      type: 'p',
      text: 'İkinci karar daha az görünür ama daha pahalıya mal oldu. Takvim günü ile seans günü aynı şey değil. Cumartesi siteyi açan biri cumayı görmeli. New York\'ta çarşamba gecesi saat ikide hâlâ salı seansı konuşuluyor. Tatil olan bir pazartesi önceki cumayı taşıyor.',
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
      text: 'Bunu neden önemsediğimi bir sabah öğrendim. Seans açıkken ana sayfadaki "Günün Hareketleri" paneli en çok yükselenleri sıralıyor ve altında "seans içi" yazıyordu. Üç sayı da bir önceki günün kapanışına aitti. Hiçbir yerde hata çıkmamıştı: ana sağlayıcı o an cevap vermiyordu, kod sessizce veritabanındaki son bilinen fiyatlara düşmüştü ve orada dünün yüzdeleri duruyordu. Sayılar doğruydu, sadece ait oldukları gün yanlıştı. Takip açısından bundan kötüsü yok; yanlış bir sayı gözüne çarpar, dünün doğru sayısı çarpmaz.',
    },
    {
      type: 'p',
      text: 'Çözüm, ekranın hangi işlem gününü anlattığını tek bir alanda tutmak ve her sayıya "sen bu güne ait misin" diye sormak oldu. Bir fiyatın son işlemi o güne aitse ekrana "bugün" diye çıkıyor; değilse "güncel olmayabilir" notuyla çıkıyor ya da kart boş kalıyor. Aynı soru grafiklere de soruluyor: günlük grafiğin son barı o güne ait olmak zorunda, yoksa dünün çizgisi bugünün yüzdesinin altında durmasın diye çizilmiyor.',
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
      text: "Gün tek başına da yetmedi; fiyatın ne zaman alındığına da bakmak gerekti, çünkü önbellek bugüne ait ama bir saat önce çekilmiş bir fiyatı tekrar verebiliyor. Seans içinde bir fiyat en fazla 75 saniye önce alınmış olabiliyor, değilse bir kez önbelleksiz yeniden deneniyor. Bu kontrol bir ay boyunca parça parça oturdu ve her düzeltme bir sonraki boşluğu gösterdi: önce piyasa kapalıyken, sonra yarım günlerde. Hepsi artık testte. Ama bunların hiçbiri amaç değil; amaç cumartesi siteyi açan birinin cumayı, salı sabahı açanın salıyı görmesi.",
    },

    { type: 'h2', text: 'Doğru Sıra' },
    {
      type: 'p',
      text: 'Takip bir anlık görüntü değil, gün boyu süren bir akış. Bir işlem gününün kendi ritmi var ve site o ritme göre kuruldu. Saatler Türkiye saati; yaz saatiyle birlikte kayıyorlar.',
    },
    {
      type: 'table',
      head: ['Saat', 'Ne Oluyor', 'Nereye Bakarsın'],
      rows: [
        ['09:00', 'Dün açıklanan bilançoların analizleri yayında', 'Bilançolar'],
        ['11:30', 'Günün ilk Mercek yazısı: bir olayın arkasındaki mekanizma', 'Mercek'],
        ['15:45', 'Açılış öncesi teknik görünüm güncellendi', 'Teknik Analiz'],
        ['16:10', 'Günün bülteni: bugün neye bakmalı, takvimde ne var', 'Ana Sayfa'],
        ['16:30', 'Açılış zili; endeks kartları ve gün akışı canlıya geçer', 'Ana Sayfa'],
        ['23:00', 'Kapanış zili; kapanış sonrası bilançolar bu pencerede', 'Bilançolar'],
        ['23:30', 'Günün ikinci Mercek yazısı', 'Mercek'],
      ],
    },
    {
      type: 'p',
      text: 'Ana sayfadaki "Bugünün Akışı" paneli bu ritmi tek listede gösteriyor: açılışa ne kadar kaldı, hangi makro veri saat kaçta geliyor, hangi şirket açılıştan önce, hangisi kapanıştan sonra açıklıyor. Pazartesi sabahları bir de haftalık bülten var. Siteyi ilk kez açan biri bu ritmi bilmese de ekran onu takip ediyor.',
    },
    {
      type: 'p',
      text: 'Takip etmek için sitede oturmak da gerekmiyor. Bilanço takvimini tek tıkla telefonunun takvimine ekleyebiliyorsun. Bir hisseye hedef fiyat koyduğunda seans boyunca beş dakikada bir sunucuda kontrol ediliyor ve hedefe ulaşınca bildirim geliyor. Haftanın öne çıkan bilançolarını paylaşılabilir bir görsel olarak indirebiliyorsun.',
    },

    { type: 'h2', text: 'Eksiksiz Bağlam' },
    {
      type: 'p',
      text: "Dördüncü karar şu: fiyat tek başına durmaz. Bir hissenin sayfasını açtığında fiyatın yanında bilanço tarihi ve beklentisi, geçmiş bilanço sürprizleri, analist dağılımı ve aydan aya nasıl değiştiği, haberler, içeriden işlemler ve o hisseyi hangi ünlü yatırımcının tuttuğu var. Bir hisseyi takip etmek bu bütünü görmek demek; fiyat o bütünün yalnızca ilk satırı.",
    },
    {
      type: 'p',
      text: "Takip listesi kurduğunda bu bağlam sana göre daralıyor. Ana sayfada listenin özeti, bilançolar ekranında yalnızca senin şirketlerinin takvimi çıkıyor. Türkiye'den yatırım yapan biri için bağlamın bir parçası daha var: lira. Portföy her pozisyonu alış günü kuruyla TL maliyet olarak tutuyor, bugünün kuruyla TL değerini gösteriyor; vergi hesaplayıcısı da satış kazancını, endekslemeyi ve ABD stopajının mahsubunu bu verilerle hesaplıyor. Dolar bazında kazanıp lira bazında ne olduğunu bilmemek de yanlış takip.",
    },
    {
      type: 'p',
      text: 'Bağlamın son katmanı yazılar. Günlük bülten o gün neye bakılacağını söylüyor, Mercek bir olayın arkasındaki mekanizmayı anlatıyor, rehber borsayı sıfırdan öğretiyor ve sözlük yüz elli terimi açıklıyor. Yazılarda geçen her terim ve her sembol ilk geçişinde kendi sayfasına bağlanıyor. Takip ettiğin şeyi anlamadan takip etmek de bir çeşit yanlış takip.',
    },

    { type: 'h2', text: 'Dürüst Ekran' },
    {
      type: 'p',
      text: 'Bu dördünün altında tek bir kural yatıyor: ekranda bir sayı görünüyorsa nereden geldiği ve ne zaman alındığı da görünür. Ücretsiz sağlayıcılar dünyayı yarım gösteriyor; site eksiği gizlemek yerine söylüyor. Her kartın altında kaynak ve saat var, gecikmeli besleme gecikmeli olduğunu yazıyor, sağlayıcı dakika vermiyorsa saat yaklaşık olduğunu belli ediyor. Veri yoksa kart boş kalıyor; hiçbir aşamada tahmini bir değer üretilmiyor.',
    },
    {
      type: 'p',
      text: 'Bunun bir sonucu da şu: eski bir fiyat ekranda "güncel olmayabilir" notuyla durabilir ama yazıya giremez. Bülteni ve Mercek yazılarını yazan görevler eski fiyatı hiç almıyor; değer boş geliyor, görev o cümleyi hiç kurmuyor. Çünkü ekrandaki sayı bir sonraki yenilemede düzelir, yazıya giren sayı orada kalır.',
    },
    {
      type: 'quote',
      text: 'Doğru takip, dürüst bir ekran ister. Yanlış bir sayı siteyi çökertmez; sadece güvenilmez yapar ve o güven bir kez gidince geri gelmez.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: "Açılış Zili'nde en çok zaman harcadığım şey yeni bir ekran eklemek olmadı; var olan ekranın doğru saati, doğru günü ve doğru sırayı anlattığından emin olmak oldu. Bunların çoğu kullanıcıya görünmüyor. Cumartesi siteyi açıp cumanın kapanışını gören biri bunun için kaç kontrol çalıştığını bilmiyor ve bilmemesi gerekiyor. Takip doğruysa site sessizdir.",
    },
    {
      type: 'p',
      text: 'Sıradaki soru, henüz yakalamadığım bir yanlış takip hâlinin nerede durduğu. Tahminim şu: onu da bir okurun ekranında, hiçbir hata mesajı görmeden bulacağım.',
    },
  ],
}

export default post
