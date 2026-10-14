import type { BlogPost } from '../types'

/*
 * 9 Ekim 2026: yazı yalnız eski bir Tailwind v3 hatasını anlatıyordu ve
 * sitenin bugünkü tema düzeniyle (çerez + data-theme, v4 tokenları)
 * çelişiyordu. Şimdi önce temanın bugün nasıl çalıştığını anlatıyor, hata
 * ise "neden böyle kurdum"un hikâyesi olarak kalıyor.
 */
export const post: BlogPost = {
  slug: 'tailwindcss-dark-tema-tasarimi',
  tag: 'Tasarım',
  tagColor: '#06b6d4',
  title: 'ahmetakyapi.com: Açık ve Koyu Tema Nasıl Çalışıyor',
  excerpt:
    'Bu sitede tema bir çerezde duruyor, ilk boyamadan önce okunuyor ve bütün renkler tek bir token listesinden geliyor. Bu düzene nasıl geldiğimi ve beni oraya iten görünmez CSS hatasını anlatıyorum.',
  date: '2026-08-17',
  coverGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0f172a 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bu sitenin sağ üstünde bir tema düğmesi var. Tıkladığın noktadan yeni tema bir daire gibi büyüyor, sayfa yenilenince de aynı tema geliyor, ilk karede bile yanlış renk görünmüyor. Bu yazı o küçük düğmenin arkasındaki düzeni anlatıyor: tema nerede duruyor, renkler nereden geliyor ve bu düzeni kurmadan önce koyu temanın yer yer açık temanın renkleriyle çizilmesine yol açan hata neydi.',
    },

    { type: 'h2', text: 'Tema Bugün Nasıl Çalışıyor' },
    {
      type: 'steps',
      items: [
        {
          title: 'Tercih Çerezde',
          text: 'Tema düğmesine basınca sayfa anında değişiyor; çerez arkada, küçük bir sunucu eylemiyle yazılıyor. Sunucuyu beklemek düğmeyi dondururdu.',
        },
        {
          title: 'İlk Boyamadan Önce Okunuyor',
          text: 'Sayfanın başındaki birkaç yüz baytlık betik çerezi okuyup `<html>` etiketine temayı yazıyor. Sayfalar statik kalıyor, yine de yanlış tema bir an bile görünmüyor.',
        },
        {
          title: 'Renkler Tek Listeden',
          text: 'Zemin, kart, çizgi ve metin renkleri CSS değişkeni. Koyu tema aynı değişkenlerin başka değerleri; bileşenlerde "koyu temada şu renk" diye ikinci bir sınıf yok.',
        },
        {
          title: 'Görseller İki Kez Çekildi',
          text: 'Her proje görselinin açık ve koyu hâli sayfada duruyor; hangisinin görüneceğine CSS karar veriyor. JavaScript beklenmiyor.',
        },
      ],
    },
    {
      type: 'code',
      lang: 'css',
      file: 'app/globals.css',
      text: `:root {
  --page-bg: #e3e9f0;      /* zemin */
  --surface: #edf1f6;      /* kart: zeminden açık, masadaki kâğıt */
  --surface-sunken: #dce5ef;
  --line: rgb(16 32 52 / 0.11);
  --text-strong: #0e1a28;
  --text-body: #3a4a5c;
}

:root[data-theme="dark"] {
  --page-bg: #050a14;
  --surface: rgb(255 255 255 / 0.045);
  --surface-sunken: rgb(0 0 0 / 0.3);
  --line: rgb(255 255 255 / 0.11);
  --text-strong: #eaf1f8;
  --text-body: #94a7ba;
}`,
    },
    {
      type: 'p',
      text: 'Bileşende `bg-surface` ya da `text-body` yazıyorum, gerisini değişken hallediyor. Bir kartın rengini değiştirmek istediğimde on üç dosyayı değil tek bir satırı düzenliyorum. Sayfadaki her kontrast oranı da bu listenin yanında yorum olarak duruyor; gövde metni her iki temada da sekizin üstünde.',
    },
    {
      type: 'p',
      text: 'Bu düzen baştan böyle değildi. Oraya beni bir hata götürdü.',
    },

    { type: 'h2', text: 'Hata: Hiç CSS Üretmeyen Sınıflar' },
    {
      type: 'p',
      text: "Sitenin ilk hâli Tailwind v3 ile yazılmıştı. Ana sayfanın üst bölümünde ince bir ayırıcı çizgi vardı ve koyu temada neredeyse beyaz, tam opak bir çizgi olarak çiziliyordu. Sebebi, koyu tema için yazdığım sınıfın CSS'te hiç karşılığı olmamasıydı.",
    },
    {
      type: 'p',
      text: "Tailwind v3'ün opaklık ölçeği beşin katlarından oluşuyor: 5, 10, 15 diye yüze kadar. Yani `bg-white/10` üretiliyor, `bg-white/8` üretilmiyor. Üretilmeyen sınıf için ne hata çıkıyor ne uyarı. Sınıf HTML'de duruyor, CSS'te karşılığı yok, tarayıcı onu görmezden geliyor.",
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `// Koyu tema sınıfı hiç CSS üretmiyordu
<div className="bg-gradient-to-r from-transparent dark:via-white/8 via-slate-200 to-transparent" />

// Sonuç: koyu temada via rengi açık temanın via-slate-200'üne düşüyor,
// yani neredeyse beyaz, tam opak bir çizgi.`,
    },
    {
      type: 'p',
      text: 'İşin kötü yanı şu: koyu tema öneki açık temadaki değerin üzerine yazar. Üzerine yazılacak bir şey üretilmeyince alttaki açık tema rengi geçerli oluyor. Yani koyu tema, açık temanın rengiyle çiziliyor. Bütün projeyi taradığımda liste uzadı; bileşenlere dağılmış on küsur farklı ara değer vardı ve hiçbiri CSS üretmiyordu.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: "Tailwind v4'te bu hata türü yok. Opaklık artık sabit bir ölçekten gelmiyor; yazdığın sayı doğrudan `color-mix()` içine giriyor. Bu site v4'e geçtiğinden beri hangi değeri yazarsam yazayım üretiliyor.",
    },

    { type: 'h2', text: 'Asıl Sorun Daha Derindeydi' },
    {
      type: 'p',
      text: 'Opaklık hatası işin görünen kısmıydı. Asıl sorun, sitede zemin ve kart renkleri için tanımlı bir sıra olmamasıydı. Kart renklerini tek tek saydım: bileşenlerin içine elle yazılmış on üç farklı koyu renk kodu vardı. Çoğu aynı seviyedeki kartlardı. Yan yana bakınca birinin farklı durduğu seziliyor ama hangisi olduğu söylenemiyordu. Sayfa zeminleri de birbirini tutmuyordu; ana sayfadan bir yazıya geçince zemin değişiyordu.',
    },
    {
      type: 'p',
      text: 'Çözüm kademeli tek bir renk sırası oldu: sayfa zemini, kart, kartın üstündeki katman ve içe gömülü alan. Dört kademe, iki tema, tek liste. Yukarıdaki değişkenler o günün kararı; değerleri o günden beri birkaç kez değişti ama yapı aynı kaldı.',
    },
    {
      type: 'compare',
      label: 'Bir Kartın Zemin Tanımı',
      before: { label: 'Önce', value: 'bg-white dark:bg-[#0c0e17]' },
      after: { label: 'Sonra', value: 'bg-surface' },
      note: 'İki sınıf yerine bir sınıf. Rengi değiştirmek tek bir değişkeni düzenlemek.',
    },

    { type: 'h2', text: 'Açık Temada Kenarlar Kaybolmuştu' },
    {
      type: 'p',
      text: 'Aynı temizlikte açık temanın kontrastını da ölçtüm. Kart kenarlıkları pratikte görünmüyordu; zeminle arasındaki kontrast bire bir buçuk bile değildi. Altbilgideki ikonlar da erişilebilirlik eşiğinin altındaydı. Koyu temada yumuşak duran bir gri, açık temada görünmez oluyor. Aynı opaklığı iki temada kullanmak, iki temayı da yarım yapmak demek.',
    },
    {
      type: 'quote',
      text: 'Koyu temanın tersini alıp açık tema yapamazsın. Açık tema kendi başına çizilmek zorunda.',
    },
    {
      type: 'p',
      text: 'Bugün sitenin açık teması gerçekten kendi başına çizili: zemin soğuk kırık beyaz, kart ondan daha açık, görsel çerçeveleri bir ton mavimsi koyu. Hepsi aynı soğuk aileden, marka mavisiyle çatışmasın diye. Varsayılan tema da artık açık olan.',
    },

    { type: 'h2', text: 'Titremeyi Önlemek' },
    {
      type: 'p',
      text: 'Sunucu, okuyan kişinin hangi temayı seçtiğini bilmiyor, çünkü sayfalar derleme anında üretiliyor. Sunucu çerezi okusaydı her sayfa dinamik olurdu. O yüzden sunucu her zaman varsayılan temayı basıyor ve sayfanın başındaki betik, tarayıcı ilk kareyi çizmeden hemen önce çerezi okuyup doğru temayı yazıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/theme.ts',
      text: `// <head> içinde, her şeyden önce çalışır (sadeleştirilmiş hâli).
const m = document.cookie.match(/(?:^|; )theme=(dark|light)/)
document.documentElement.dataset.theme = m ? m[1] : 'light'`,
    },
    {
      type: 'p',
      text: 'Tema düğmesi de kendi durumunu tutmuyor; `<html>` üstündeki özniteliği dinliyor. Böylece başlıktaki düğme ile komut paletindeki düğme hep aynı şeyi gösteriyor ve sayfa açılırken bir an yanlış ikon görünüp sonra değişmiyor.',
    },

    { type: 'h2', text: 'Baştan Yapsam' },
    {
      type: 'p',
      text: 'Bir CSS aracının hiçbir şey üretmemesini fark etmek zor. Derleme uyarmıyor, tarayıcı uyarmıyor ve ekranda yine bir renk görünüyor; sadece yanlış renk. Bugün başlasam iki şeyi ilk gün yapardım: zemin ve kart renklerini değişken olarak tanımlar, iki temanın kontrastını tasarım sırasında ölçerdim. Bu sitede ikisi de ancak bir temizlik turunda yapıldı; ama o günden beri her renk kararı o listeden geçiyor.',
    },
  ],
}

export default post
