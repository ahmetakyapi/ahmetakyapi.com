import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'socket-io-ile-oda-tabanli-multiplayer',
  tag: 'Gerçek Zamanlı',
  tagColor: '#22d3ee',
  title: 'Karalama: Arkadaşlarla Oynanan Çizim Oyunu',
  excerpt:
    "Karalama, kayıt olmadan bir bağlantıyla oynanan Türkçe çizim ve tahmin oyunu. Oyunun nasıl işlediğini, sunucunun neden her kararı kendisinin verdiğini ve Türkçe harflerin başıma açtığı işi anlatıyorum.",
  date: '2026-05-15',
  coverGradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #6366f1 100%)',
  content: [
    {
      type: 'lead',
      text: "Karalama, arkadaşlarınla oynadığın bir çizim ve tahmin oyunu. Biri oda açıyor, bağlantıyı gruba atıyor, kayıt filan yok. Sırası gelen üç kelimeden birini seçip çiziyor, ötekiler sohbete tahmin yazıyor; süre azaldıkça kelimenin harfleri ipucu olarak açılıyor ve erken bilen daha çok puan alıyor. Kelimelerin hepsi Türkçe, on sekiz kategoride binin üstünde kelime var.",
    },
    {
      type: 'p',
      text: 'Benzerlerini herkes bilir; benim istediğim Türkçe kelimelerle, Türkçe harflerle ve telefonda rahat oynanan bir sürümdü. Bir de oyunun kurallarını sunucunun tuttuğu bir yapı kurmak istiyordum; önceki gerçek zamanlı denemelerimde bunu hiç yapmamıştım.',
    },

    { type: 'h2', text: 'Oyun Nasıl İşliyor' },
    {
      type: 'table',
      head: ['Ayar', 'Değer'],
      rows: [
        ['Oyuncu Sayısı', '2 ile 12 arası'],
        ['Bot', 'En fazla 5; kişi azsa lobiden çağırılıyor'],
        ['Çizim Süresi', '30 ile 120 saniye arası, oda kurucusu seçiyor'],
        ['Kelime Seçme', '15 saniye; seçilmezse rastgele atanıyor'],
        ['İlk Harf İpucu', 'Sürenin üçte ikisi kalınca'],
        ['İkinci Harf', 'Sürenin üçte biri kalınca'],
        ['Kelime Havuzu', '1.071 kelime: 390 kolay, 527 orta, 154 zor'],
      ],
    },
    {
      type: 'p',
      text: 'Çizecek kişiye her turda üç kelime sunuluyor, mümkünse her zorluktan bir tane. "Merdiven" birkaç çizgiyle anlatılabiliyor; "özgürlük" zor seviyede ve karşılığında puanı bir buçuk kat. Oda kurucusu isterse havuza kendi kelimelerini de ekleyebiliyor. İki kişi oynamak isterse boş yerleri botlar dolduruyor; adları Fırça, Kalem, Palet, Tuval ve Piksel.',
    },

    { type: 'h2', text: 'Nasıl Kurdum' },
    {
      type: 'p',
      text: "Oyun iki ayrı yerde çalışıyor: Next.js ile yazılmış arayüz Vercel'de, Socket.io sunucusu Railway'de. İkisi de aynı tipleri kullanıyor; oda durumu, oyuncu, çizim verisi, olay adları. Bunları iki yere kopyalarsan bir tarafta alan adı değişip ötekinde değişmediği gün oyun hata vermeden bozulur. O yüzden tipler en baştan ortak bir pakette ve proje bir monorepo.",
    },
    {
      type: 'steps',
      items: [
        { title: 'apps/web', text: 'Next.js arayüzü: çizim tuvali, sohbet, lobi ve skor ekranları. Durum yönetimi Zustand ile.' },
        { title: 'apps/server', text: 'Socket.io sunucusu: oda yönetimi, tur akışı, puanlama, botlar.' },
        { title: 'packages/shared', text: 'Tipler, sabitler ve puan formülü. İki tarafın da içe aktardığı tek kaynak.' },
      ],
    },
    {
      type: 'p',
      text: 'Veritabanı yok. Oda kodu altı karakter, oda nesnesi sunucunun belleğinde bir Map içinde duruyor. Beş dakikada bir temizlik çalışıyor ve otuz dakika hareketsiz kalan oda siliniyor. Sunucu yeniden başlarsa bütün odalar gidiyor; bunu baştan kabul ettim. On dakika süren bir oyun için kalıcı kayıt tutmaya değmedi.',
    },

    { type: 'h2', text: 'Kararları Sunucu Veriyor' },
    {
      type: 'p',
      text: 'Oyunun özünde üç karar var: tahmin doğru mu, cevabı kim biliyor, puanı kim veriyor. Üçünün de cevabı sunucu. Tahmin sohbetten düz metin olarak geliyor; kimin yazdığını mesajın içinden değil, bağlantının kendi kimliğinden okuyorum. Kelime de tur bitene kadar yalnızca çizen kişide. Tahmin edenlerin tarayıcısına kelimenin kendisi hiç gitmiyor, sadece harf sayısı ve açılan ipuçları gidiyor. İsteyen ağ sekmesini açsın; orada bulacağı bir şey yok.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/scoring.ts',
      text: `export function calculateGuesserScore(p: GuesserScoreParams): number {
  const base = 100;
  const timeRatio = p.timeLeft / p.totalTime;
  const timeBonus = Math.round(150 * timeRatio);
  const speedBonus = Math.max(0, 50 - p.guessOrder * 15);
  const multiplier = DIFFICULTY_MULTIPLIER[p.wordDifficulty] ?? 1;
  return Math.round((base + timeBonus + speedBonus) * multiplier);
}`,
    },
    {
      type: 'p',
      text: 'Puan formülü ortak pakette ama onu yalnızca sunucu çağırıyor. İlk bilen 50, ikinci 35, üçüncü 20 puan bonus alıyor; sonrası sıfır. Çizen kişinin puanı da ayrı: kaç kişinin bildiğiyle orantılı, kimse bilemezse sıfır. Yani herkesi elemek için kasten kötü çizmek işe yaramıyor.',
    },

    { type: 'h2', text: 'Türkçe Harf Tuzağı' },
    {
      type: 'p',
      text: 'Tahmini cevapla karşılaştırmak normalde tek satır: ikisini küçük harfe çevir, eşit mi bak. Türkçede bu yetmiyor. JavaScript\'in `toLowerCase()` fonksiyonu dile bakmadan genel kuralları uyguluyor. Büyük "İ"yi "i" yapıyor ama arkasına görünmez bir birleştirici nokta ekliyor; büyük "I"yı da "i" yapıyor, oysa Türkçede "ı" olmalı. Yani "İSTANBUL" yazan biri "istanbul"u bilememiş sayılıyor.',
    },
    {
      type: 'compare',
      label: 'Oyuncu "İSTANBUL" Yazdı, Cevap "istanbul"',
      before: { label: 'toLowerCase()', value: 'Eşleşmiyor' },
      after: { label: 'Önce Harf Değişimi', value: 'Eşleşiyor' },
      note: 'Küçültülmüş "İ" tek harf değil, iki karakter. Ekranda aynı görünüyor, karşılaştırmada eşit değil.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/scoring.ts',
      text: `export function normalizeGuess(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/[^a-zçğıöşüâîû\\s]/g, '')
    .trim()
}`,
    },
    {
      type: 'p',
      text: 'Sondaki temizlik noktalamayı ve rakamları siliyor; şapkalı harfler listede, çünkü havuzda "rüzgâr" ve "yapay zekâ" gibi kelimeler var. Bugün yazsam harfleri elle değiştirmezdim: `toLocaleLowerCase("tr-TR")` aynı işi tek çağrıda yapıyor. O iki satır, dile göre çalışan bir fonksiyonun elle yazılmış hâli.',
    },

    { type: 'h3', text: 'Yakın Tahmin' },
    {
      type: 'p',
      text: 'Hızlı yazan biri harf atlıyor: "bisiklet" yerine "bisklet". Bu doğru sayılmamalı ama oyuncuya "çok yaklaştın" demek oyunu güzelleştiriyor. Sunucu tahmini cevapla harf uzaklığına göre karşılaştırıyor; fark en fazla iki harfse yalnızca yazan kişiye haber veriyor ve mesajı sohbete düşürmüyor. Düşürseydi "bisklet" mesajı herkese cevabı ele verirdi. Kısa kelimelerde bu kontrol kapalı, çünkü cevap "at" iken "el" yazan biri de iki harf uzakta.',
    },

    { type: 'h2', text: 'Çizimi Nasıl Gönderiyorum' },
    {
      type: 'p',
      text: 'Fare her kıpırdadığında paket göndermek, ekranın yenileme hızı kadar mesaj demek. Çizim olayları saniyede yaklaşık otuzla sınırlı, sohbetin de kendi sınırı var. Koordinatlar piksel yerine 0 ile 1 arasında bir oran olarak gidiyor; telefonda çizilen bir ev masaüstündeki geniş tuvalde de aynı yere düşüyor, telefonu yan çevirince çizim orantılı büyüyor.',
    },
    {
      type: 'p',
      text: 'Aynı biçim botların da işine yaradı. Sırası gelen bot hazır şekillerden birini çiziyor: daire, ev, ağaç, yıldız, kalp, balık. Şekli rastgele seçtiği için cevap "merdiven" iken ekrana bir balık gelebiliyor. Bunu bilerek bıraktım; botun çizimi oyunu doldurmak için var, kazanmak için değil. Tahmin ederken de bot önce bir iki yanlış kelime yazıyor, sonra sürenin bir yerinde doğruyu buluyor. Her seferinde ilk bilen olsaydı insanlar puan alamazdı.',
    },

    { type: 'h2', text: 'Bugün Olsa Neyi Değiştirirdim' },
    {
      type: 'p',
      text: 'Düz WebSocket\'i ciddi olarak denerdim. Yeniden bağlanmayı ve odaları Socket.io hazır veriyor ama karşılığında tarayıcıya ayrı bir paket iniyor ve özelliklerinin yalnızca bir kısmını kullanıyorum.',
    },
    {
      type: 'p',
      text: 'Tur akışını da en baştan bir durum makinesi olarak yazardım. Şu an oda sınıfının içinde on yedi ayrı "hangi aşamadayız" kontrolü var. Çalışıyor, ama yeni bir aşama eklemek o on yedi yeri tek tek gezmek demek. Bağlantısı kopup geri gelen oyuncunun oyuna dönebilmesi ve çizen kişi çıkınca turun kelimeyi gösterip kapanması gibi düzeltmeler de bu dağınıklık yüzünden geç geldi.',
    },
    {
      type: 'p',
      text: 'Emin olamadığım tek karar odaların bellekte durması. Bir gün biri "on dakika önce oynadığımız oda nerede" diye sorarsa verecek cevabım yok. O gün gelene kadar veritabanı eklemeyeceğim.',
    },
  ],
}

export default post
