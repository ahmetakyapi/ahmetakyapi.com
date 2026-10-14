import type { BlogPost } from '../types'

/*
 * 9 Ekim 2026'da baştan yazıldı. Önceki hâli doğrudan şemaya ve hata avına
 * giriyordu; sahibinin isteği: yazı önce sitenin ne olduğunu, kimin için
 * yapıldığını ve nasıl kurulduğunu anlatsın, teknik kararlar ondan sonra
 * gelsin. Dil günlük konuşma dili.
 */
export const post: BlogPost = {
  slug: 'acilis-zili-nasil-yapildi',
  tag: 'Ürün',
  tagColor: '#0d74c4',
  title: 'Açılış Zili: ABD Borsasını Türkçe Takip Eden Site',
  excerpt:
    "Açılış Zili'ni ABD borsasını Türkiye saatiyle, tek ekrandan ve Türkçe takip etmek için yazdım. Sitede ne var, nasıl kurdum ve ekrandaki her sayının doğru olması için hangi kuralları koydum.",
  date: '2026-08-12',
  coverGradient: 'linear-gradient(135deg, #0d74c4 0%, #0a5a9a 45%, #101c2b 100%)',
  content: [
    {
      type: 'lead',
      text: "Açılış Zili, ABD borsasını Türkiye'den takip eden biri için yazdığım bir site. Endeksler, hisse fiyatları, bilanço takvimi, makro veriler, haberler ve her gün yazılan bir bülten aynı ekranda duruyor; saatlerin hepsi Türkiye saatine çevrilmiş. Adı da oradan geliyor: zil çalmadan önce bugün ne olacağını görmek.",
    },
    {
      type: 'p',
      text: "Yatırım tavsiyesi veren bir yer değil, arkasında bir aracı kurum ya da sponsor da yok. Benim her sabah açtığım üç dört sekmenin yerine geçsin diye başladı; şimdi başkalarının da sabah rutini. Ücretsiz, reklamsız ve kodu açık.",
    },

    { type: 'h2', text: 'Neden Böyle Bir Şey Yaptım' },
    {
      type: 'p',
      text: "ABD borsasını Türkiye'den izlemek küçük ama her gün tekrar eden bir çeviri işi. Bütün kaynaklar New York saatiyle yazıyor. Bir şirketin bilançosunu \"kapanıştan sonra\" açıklayacağını okuyorsun, bunun bizde kaç olduğunu kafandan hesaplıyorsun, ABD yaz saatine geçince de hesap bir saat kayıyor. Veriler bir sitede, takvim başka bir sitede, haberler bir üçüncüsünde. Türkçe kaynak da zaten az.",
    },
    {
      type: 'p',
      text: "Açılış Zili bu çeviriyi bir kez yapıp bir daha düşündürmemek için var. Siteyi açıyorsun, açılışa ne kadar kaldığını, bugün kimlerin bilanço açıklayacağını, hangi makro verinin saat kaçta geleceğini ve endekslerin nerede olduğunu kendi saatinle görüyorsun.",
    },

    { type: 'h2', text: 'Sitede Neler Var' },
    {
      type: 'p',
      text: 'Site birkaç ana bölümden oluşuyor ve her bölüm aslında tek bir soruya cevap veriyor.',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Bugün',
          text: 'Açılışa geri sayım, endeks kartları, günün en çok yükselen ve düşenleri, bugünün bilançoları ve makro takvimi. Günün özeti de burada; siteyi açınca ilk gördüğün ekran.',
        },
        {
          title: 'Şirketler',
          text: "Bini aşkın şirketin sayfası: gün içinden beş yıla grafik, profil, değerleme oranları, analist beklentileri, temettü, haberler ve geçmiş bilanço sürprizleri. İki ile dört hisseyi aynı ölçekte yan yana karşılaştırabiliyorsun.",
        },
        {
          title: 'Bilançolar',
          text: 'Kim ne zaman bilanço açıklıyor, açılıştan önce mi kapanıştan sonra mı, beklenti ne, gerçekleşen ne. Açıklanan her bilanço için skorlu bir analiz yazılıyor. Takvimi kendi telefonuna da ekleyebiliyorsun.',
        },
        {
          title: 'Piyasa ve Makro',
          text: 'Sektörler, tahvil faizleri, VIX, dünya piyasaları, FED kararları, enflasyon ve istihdam verileri. Takvimde hepsi saatleriyle ve bizim saatimizle.',
        },
        {
          title: 'Yazılar',
          text: 'Her gün yazılan bülten, olayların arkasındaki mekanizmayı anlatan uzun "Mercek" yazıları, borsayı sıfırdan öğreten sıralı bir rehber ve bir terimler sözlüğü.',
        },
        {
          title: 'Senin Tarafın',
          text: "Takip listeleri, yalnızca kendi şirketlerinin bilanço takvimi, alış günü kuruyla TL kâr-zarar tutan bir portföy ve yurt dışı hisse vergisini hesaplayan bir araç.",
        },
      ],
    },
    {
      type: 'p',
      text: "Sitenin bir de günlük ritmi var. Sabah dokuzda önceki günün bilanço analizleri çıkıyor, öğleden sonra bülten yazılıyor, 16:30'da zil çalıyor ve ekran canlıya geçiyor, akşam kapanışla birlikte bilançolar açıklanıyor. Pazartesi sabahları da haftalık bülten var. Siteyi ilk açan biri bu ritmi fark etmese bile ekran onu takip ediyor.",
    },

    { type: 'h2', text: 'Nasıl Kurdum' },
    {
      type: 'p',
      text: 'Teknik tarafta büyük sürpriz yok; son projelerimde kullandığım yığının aynısı. Asıl iş veri katmanında.',
    },
    {
      type: 'table',
      head: ['Parça', 'Ne Kullandım', 'Neden'],
      rows: [
        ['Çatı', 'Next.js 16, React 19, TypeScript', 'Sunucu bileşenleri sayfayı istek anında çiziyor; tarayıcıya gereksiz JavaScript gitmiyor.'],
        ['Stil', 'Tailwind CSS v4', 'Renkler ve boşluklar tek bir token dosyasında, açık ve koyu tema aynı değişkenlerden.'],
        ['Veritabanı', 'Neon PostgreSQL ve Drizzle', 'Tipler şemadan türüyor; bir kolon eklediğimde onu unutan her ekran derlemede hata veriyor.'],
        ['Grafikler', 'lightweight-charts', 'Hisse grafikleri için hafif ve hızlı; küçük grafikler elle çizilmiş SVG.'],
        ['Giriş', 'next-auth v5', 'Takip listesi ve portföy için hesap.'],
        ['Veri', 'Alpaca, Finnhub, FRED, TCMB', 'Fiyat ve grafikler, şirket profili ve haberler, makro seriler, dolar kuru.'],
      ],
    },
    {
      type: 'p',
      text: 'Sayfaların çoğu her istekte sunucuda çiziliyor, çünkü fiyat değişiyor. Ama sağlayıcıya giden her istek bir kota harcıyor; o yüzden önbellek sunucuda ve bütün ziyaretçiler için ortak. Seans içinde fiyat en fazla 15 saniye, piyasa kapalıyken 15 dakika önbellekte kalıyor. Kaç kişi bakarsa baksın sağlayıcıya giden istek sayısı değişmiyor.',
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

    { type: 'h2', text: 'Ekranda Uydurma Sayı Yok' },
    {
      type: 'p',
      text: 'Projenin en başında koyduğum ve her kararı belirleyen tek bir kural var: ekranda bir sayı görünüyorsa, nereden geldiği ve ne zaman alındığı da görünür. Ücretsiz sağlayıcılar dünyayı yarım gösteriyor; ben eksiği gizlemek yerine söylemeyi seçtim.',
    },
    {
      type: 'ul',
      items: [
        'Her kartın altında kaynak ve saat yazıyor. Sağlayıcı dakika vermiyorsa saat yaklaşık olduğunu belli ediyor.',
        'Fiyatlar 15 dakika gecikmeli bir beslemeden geliyor ve ekran bunu açıkça yazıyor.',
        'Endeksler ETF üzerinden izleniyor; arayüz bunu da söylüyor.',
        'Veri yoksa kart boş kalıyor. Hiçbir aşamada tahmini değer üretilmiyor.',
      ],
    },
    {
      type: 'p',
      text: 'Bu kural sağlayıcılarla konuşan katmanı da şekillendirdi. Dört farklı API dört farklı biçimde cevap veriyor ve dört farklı biçimde hata veriyor. Hepsini tek bir sonuç tipine indirdim; hata bir istisna değil, bir değer olarak dönüyor. Kart "veri alınamadı" diyor, sayfanın geri kalanı çalışmaya devam ediyor.',
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
      text: 'Sıra hep aynı: önce canlı kaynak, olmazsa yedek kaynak, o da olmazsa veritabanındaki son bilinen değer ve yanında "güncel değil" notu. Bunun güzel bir yan etkisi de var: projeyi klonlayıp hiçbir API anahtarı girmeden çalıştırabiliyorsun. İlgili kartlar boş kalıyor, site ayakta duruyor.',
    },

    { type: 'h3', text: 'Bir Kartı Kaldırmak da Bir Karar' },
    {
      type: 'p',
      text: "Brent petrol kartı bu kuralın kurbanı oldu. İlk denediğim kaynak günlerce geriden yayınlıyordu; ekranda varilin fiyatı on dört yüzde yanlış duruyordu. Daha güncel olsun diye bir Brent fonunun fiyatına geçtim, bu kez kartta 50 dolar yazdı, oysa gerçek Brent 89 dolardı. Fonun fiyatını büyük puntoyla, \"bu fonun fiyatıdır\" notunu küçük puntoyla göstermek bana dürüst gelmedi. Ücretsiz bir canlı emtia kaynağı bulamadım ve kartı kaldırdım.",
    },
    {
      type: 'quote',
      text: 'Bir sayıyı büyük puntoyla yanlış, küçük puntoyla doğru göstermek, yanlış göstermektir.',
    },

    { type: 'h2', text: 'Oranı Değil, Girdisini Saklamak' },
    {
      type: 'p',
      text: "Bilanço analizlerinde en çok işime yarayan karar buydu. Bir analize F/K oranını yazmak çok doğal geliyor; sağlayıcı hazır veriyor, kaydedip geçiyorsun. Sorun haftalar sonra çıkıyor. Analiz o günün fiyatıyla hesaplanmış oranı taşıyor, sayfanın üstünde ise bugünün canlı fiyatı duruyor. Aynı sayfada iki farklı fiyat var ve hangisinin hangisi olduğunu kimse söylemiyor.",
    },
    {
      type: 'p',
      text: 'Çözüm oranı hiç saklamamak oldu. Veritabanında oranın böleni duruyor, mesela son dört çeyreğin hisse başına kârı; oranı sayfa, o anki fiyatla kendisi hesaplıyor. Okuyan kişi isterse çarpıp doğrulayabiliyor. Aynı mantıkla büyüme oranının yanına "hangi büyüme" sorusunun cevabını da ayrı bir alan olarak koydum, çünkü aynı şirket için iki kaynağa baktığımda biri ileriye dönük tahmini, öteki son on iki ayı kullanıyordu ve PEG değerleri üç kat farklıydı.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Kural şu oldu: hesaplanmış sayıyı değil girdisini sakla. Girdi zamanla eskimiyor; hesaplanmış sayı bir anın fotoğrafı ve o an geçince kimseye haber vermeden yanlışa dönüyor.',
    },

    { type: 'h2', text: 'Yazıları Kim Yazıyor' },
    {
      type: 'p',
      text: "Bültenleri, Mercek yazılarını ve bilanço analizlerini bir dil modeli yazıyor; ama sitenin sunucusunda yazı üreten bir model çağrısı yok. claude.ai'da kurduğum zamanlanmış görevler belli saatlerde çalışıyor, sitenin korumalı bir ucundan o günün verisini çekiyor, yazıyı yazıyor ve başka bir korumalı uca gönderiyor. Site yalnızca veritabanından okuyor. Yayın gecikirse ekran en son yazılanı gösteriyor ve yenisinin ne zaman geleceğini söylüyor.",
    },
    {
      type: 'table',
      head: ['Görev', 'Ne Zaman', 'Nereye'],
      rows: [
        ['Bilanço Analizi', 'Her gün 09:00', 'Bilançolar'],
        ['Günlük Bülten', 'Her gün 16:00', 'Ana Sayfa'],
        ['Mercek Yazısı', 'Her gün 11:30 ve 23:30', 'Mercek'],
        ['Haftalık Bülten', 'Pazartesi 09:30', 'Bülten'],
      ],
    },
    {
      type: 'p',
      text: 'Model sayı üretmiyor, yorum yazıyor. Göstergeleri site kendi fiyat verisinden hesaplayıp modele veriyor; model onların üstüne metin kuruyor. Gönderilen yazı doğrulamadan geçemezse uç hata koduyla birlikte beklenen şemayı da geri yazıyor; karşı taraf bir model olduğu için hata mesajını okuyup kendini düzeltebiliyor.',
    },
    {
      type: 'p',
      text: "Yazıların görseli de yok, çizimi var. Metnin içine yazılan küçük bloklar siteyi çubuk grafik, pay dağılımı ya da öncesi-sonrası karşılaştırmasına dönüştürüyor. Yazan kişi yalnızca satırları yazıyor, hesabı ve çizimi site yapıyor. Telif derdi yok, görsel barındırmıyorum ve tema değişince çizimler de ona uyuyor.",
    },

    { type: 'h2', text: 'Bir de Saatler Vardı' },
    {
      type: 'p',
      text: "Saat dönüşümü projenin çıkış sebebi ama kodun küçük bir kısmı. Tek tuzak şu: Türkiye yaz saati uygulamıyor, ABD uyguluyor. New York ile aramızdaki fark yazın yedi, kışın sekiz saat. Borsa her zaman 09:30'da açılıyor ama bizde bu yazın 16:30, kışın 17:30.",
    },
    {
      type: 'callout',
      variant: 'warning',
      text: "Bir yere 7 yazıp geçmek çok kolay. Yazsaydım Kasım'da ABD kış saatine döndüğü gün sitedeki bütün saatler bir saat kayacaktı. Site çökmeyecek, sadece yanlış saat gösterecekti; en kötü hata türü.",
    },
    {
      type: 'p',
      text: 'Bu yüzden hiçbir yerde elle saat hesabı yok. Bütün dönüşümler tek dosyada ve o günün tarihine göre yapılıyor. Yarım günler de orada; Şükran Günü ertesi borsa 13:00\'te kapanıyor ve site bunu biliyor. Türkçe arayüzde öne çıkan saat İstanbul, yanında küçük yazılan New York; İngilizceye geçince sıra tersine dönüyor.',
    },

    { type: 'h2', text: 'Sayılarla' },
    {
      type: 'stats',
      label: 'Açılış Zili · Ağustos 2026',
      items: [
        { value: '24', note: 'Sayfa' },
        { value: '14', note: 'Postgres Tablosu' },
        { value: '4', note: 'Veri Sağlayıcı' },
        { value: '513', note: 'Takip Edilen Şirket' },
        { value: '2', note: 'Dil' },
      ],
    },
    {
      type: 'p',
      text: 'Bu sayılar yazının yazıldığı güne ait; site o günden beri büyümeye devam etti. Güncel hâli için projeler sayfasındaki karta bakabilirsin.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: "Veri çekmek işin en kolay kısmıydı; dört API, birkaç fetch. Zor olan o verinin doğru hâliyle ekrana çıkması. Yanlış bir sayı siteyi çökertmiyor, sadece güvenilmez yapıyor ve bunu fark etmek günler sürebiliyor. Kaydedilen oranın ertesi gün eskimesi, Brent kartının bir haftalık fiyatı bugünmüş gibi göstermesi, hiçbir hata vermeden oldu.",
    },
    {
      type: 'p',
      text: "Bu yüzden Açılış Zili'nde en çok zaman harcadığım şey yeni özellik değil, takibin doğru olması oldu: doğru saat, doğru gün, doğru sıra ve eksiksiz bağlam. Bunun ne demek olduğunu ayrı bir yazıda anlattım.",
    },
  ],
}

export default post
