import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'socket-io-ile-oda-tabanli-multiplayer',
  tag: 'Realtime',
  tagColor: '#22d3ee',
  title: "Karalama: “İSTANBUL” Yazan Doğru Bildi mi?",
  excerpt:
    'Çok oyunculu bir çizim oyunu yazdım. En zor kısmı çizimi senkronlamak olmadı; "İSTANBUL" yazan birinin doğru bildiğini JavaScript\'e kabul ettirmek oldu.',
  date: '2026-05-15',
  coverGradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #6366f1 100%)',
  content: [
    {
      type: 'lead',
      text: 'Karalama\'nın test dosyasında iki satır var ve oyunun en önemli kuralını onlar taşıyor: "İSTANBUL" yazan "istanbul"u, "KIŞ" yazan "kış"ı bilmiş sayılmalı. JavaScript\'in `toLowerCase()` fonksiyonu ikisini de yanlış yapıyor. Bu oyunun asıl zorluğu WebSocket değil, Türkçe çıktı.',
    },
    {
      type: 'p',
      text: 'Karalama, kayıt olmadan arkadaşlarla oynanan bir çizim-tahmin oyunu. Bir kişi çiziyor, diğerleri tahmin ediyor, süre doluyor, sıra değişiyor. Basit görünüyor; arkasında bir monorepo, üç paket ve birkaç ders var.',
    },

    { type: 'h2', text: 'Önce Mimari: Neden Monorepo' },
    {
      type: 'p',
      text: 'Oyun iki ayrı yerde çalışıyor: Next.js istemcisi Vercel\'de, Socket.io sunucusu Railway\'de. İkisi de aynı tiplere ihtiyaç duyuyor: oda durumu, oyuncu, çizim verisi, olay adları. Bunları iki yere kopyalamak, bir tarafta alan adı değişip ötekinde değişmediği gün sessizce bozulan bir oyun demek. Bu yüzden tipler en baştan ortak bir pakette.',
    },
    {
      type: 'steps',
      items: [
        { title: 'apps/web', text: 'Next.js istemcisi: çizim tuvali, sohbet, oda ekranları. Vercel.' },
        { title: 'apps/server', text: 'Socket.io sunucusu: oda yönetimi, tur akışı, puanlama. Railway.' },
        { title: 'packages/shared', text: 'Tipler, sabitler, puanlama fonksiyonları. İki tarafın da import ettiği tek kaynak.' },
      ],
    },

    { type: 'h2', text: 'Türkçe Küçük Harf Tuzağı' },
    {
      type: 'p',
      text: 'Tahmin karşılaştırması normalde tek satırlık iş: `a.toLowerCase() === b.toLowerCase()`. Türkçede değil.',
    },
    {
      type: 'p',
      text: '`toLowerCase()` dilden bağımsız Unicode kurallarını uyguluyor. Büyük "İ"yi "i" yapıyor ama arkasına birleştirici bir nokta (U+0307) bırakıyor. Büyük "I"yı da "i" yapıyor, oysa Türkçede "ı" olmalı.',
    },
    {
      type: 'compare',
      label: 'Kullanıcı "İSTANBUL" Yazdı, Cevap "istanbul"',
      before: { label: 'toLowerCase()', value: 'Eşleşmiyor' },
      after: { label: 'Önce Harf Değişimi', value: 'Eşleşiyor' },
      note: '"İ".toLowerCase() sonucu tek harf değil, iki karakter: "i" ve U+0307. Ekranda aynı görünüyor, karşılaştırmada eşit değil.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/scoring.ts',
      text: `export function normalizeGuess(text: string): string {
  // Türkçe harfleri toLowerCase'den ÖNCE değiştirmek zorunlu:
  // "İ".toLowerCase() → "i" + U+0307, "I".toLowerCase() → "i" (ı değil)
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
      text: 'Sondaki `replace` noktalama ve rakamları atıyor; testte `"  ,Kedi!"` girdisi `"kedi"` oluyor. Şapkalı harfleri listede tuttum, çünkü kelime havuzunda "rüzgâr", "hâkim" ve "yapay zekâ" var.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bugün yazsam elle değiştirme yapmazdım: `"İSTANBUL".toLocaleLowerCase("tr-TR")` doğrudan "istanbul", `"KIŞ".toLocaleLowerCase("tr-TR")` doğrudan "kış" veriyor. İki `replace` satırı, dile duyarlı tek bir çağrının elle yazılmış hâli.',
    },

    { type: 'h3', text: 'Yakın Tahmin' },
    {
      type: 'p',
      text: 'Hızlı yazan biri harf atlıyor: "bisiklet" yerine "bisklet". Doğru sayılmamalı, ama "çok yaklaştın" demek oyuna bir şey katıyor. Sunucu tahmini cevapla Levenshtein uzaklığıyla karşılaştırıyor ve fark en fazla iki harfse yalnızca yazan kişiye haber veriyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'apps/server/src/game/Room.ts',
      text: `// Close guess — only notify the guesser, don't broadcast text to others
if (answer.length > 3 && levenshtein(normalized, answer) <= 2) {
  const socket = this.io.sockets.sockets.get(playerId);
  if (socket) {
    socket.emit('game:closeGuess');
  }
  return null;
}`,
    },
    {
      type: 'p',
      text: 'Burada iki karar var. Birincisi `answer.length > 3`: kısa kelimelerde iki harflik eşik anlamsızlaşıyor. Cevap "at" iken "el" yazan biri de iki harf uzakta; o kontrol olmasa oyun ona "çok yakınsın" derdi. İkincisi `return null`: yakın tahmin sohbete düşmüyor. Düşseydi, "bisklet" yazan birinin mesajı herkese cevabı fısıldamış olurdu.',
    },

    { type: 'h2', text: 'Çizimi Nasıl Gönderiyorum' },
    {
      type: 'p',
      text: 'Fare her kıpırdadığında bir paket göndermek, ekranın yenileme hızı kadar mesaj demek. Çizim olayları bu yüzden 33 milisaniyede bir sınırlı, yani saniyede yaklaşık 30. Sohbetin de kendi sınırı var.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/constants/game.ts',
      text: `export const MAX_CHAT_LENGTH = 100;
export const CHAT_RATE_LIMIT_MS = 500;
export const DRAW_RATE_LIMIT_MS = 33; // ~30fps`,
    },
    {
      type: 'p',
      text: 'Koordinatlar 0 ile 1 arasında normalize ediliyor. Telefonda çizilen bir ev, masaüstündeki geniş tuvalde de aynı yere düşüyor; telefonu yatay çevirince de çizim orantılı büyüyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/types/drawing.ts',
      text: `export interface DrawPoint {
  x: number; // normalized 0-1
  y: number;
  pressure?: number;
}`,
    },
    {
      type: 'p',
      text: 'Aynı karar botlara da yaradı. Sırası gelen bot, 0-1 aralığında tanımlı hazır şekillerden birini çiziyor: daire, kare, ev, ağaç, yıldız, kalp, güneş, balık. Şekli rastgele seçiyor, kelimeye bakmıyor. Yani cevap "merdiven" iken ekrana bir balık gelebiliyor.',
    },

    { type: 'h2', text: 'Puanı Kim Hesaplıyor' },
    {
      type: 'p',
      text: 'Gerçek zamanlı bir oyunda ilk sorulması gereken soru bu ve Karalama\'da cevabı sunucu. Tahmin sohbet kanalından düz metin olarak geliyor; kimin yazdığını istemci söylemiyor, sunucu bağlantının kendi kimliğinden (`socket.id`) biliyor. Kelime de tur bitene kadar yalnızca çizen kişide. Tahmin edenlere giden tek şey ipucu ve harf sayısı.',
    },
    {
      type: 'p',
      text: 'Puan formülü `packages/shared` içinde, ama onu yalnızca sunucu çağırıyor. İstemci aynı fonksiyonu import edebilir; sonucu önceden göstermek için, karar vermek için değil.',
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
      text: '`speedBonus` kaçıncı bildiğini ödüllendiriyor: ilk bilen 50, ikinci 35, üçüncü 20, dördüncü 5, sonrası sıfır. Zorluk çarpanı 1; 1,2 ve 1,5. Çizen kişinin puanı ayrı: kaç kişinin bildiğine oranlı, tavanı 200. Kimse bilemezse sıfır alıyor, yani herkesi elemek için kasten kötü çizmek ödüllendirilmiyor.',
    },

    { type: 'h2', text: 'Odalar Bellekte' },
    {
      type: 'p',
      text: 'Veritabanı yok. Oda kodu altı karakter, oda nesnesi sunucunun belleğinde bir `Map` içinde. Beş dakikada bir temizlik koşuyor ve 30 dakika boyunca hareketsiz kalan oda siliniyor.',
    },
    {
      type: 'table',
      head: ['Ayar', 'Değer'],
      rows: [
        ['Oyuncu Sayısı', '2-12'],
        ['Bot', 'En fazla 5'],
        ['Çizim Süresi', '30-120 sn'],
        ['Kelime Seçme', '15 sn, seçilmezse rastgele atanıyor'],
        ['İlk Harf İpucu', 'Sürenin %66\'sı kalınca'],
        ['İkinci Harf', 'Sürenin %33\'ü kalınca'],
        ['Oda Ömrü', '30 dk hareketsizlik'],
      ],
    },
    {
      type: 'p',
      text: 'Bu kararın bedeli var ve bir kısmını ödedim. Sunucu yeniden başlarsa bütün odalar gidiyor; bunu baştan kabul ettim. Kabul etmediğim ama yaşadığım şey bağlantı kopmalarıydı. Oyun ortasında bağlantısı kopup geri gelen oyuncu "oyun devam ediyor" hatasına çarpıp dışarıda kalıyordu. Çizen kişi tur bitmeden ayrılınca da tur, kelime açıklanmadan ve skor gösterilmeden atlanıyordu. İkisini de sonradan düzelttim: geri gelen oyuncu oyuna dönebiliyor, çizen ayrılırsa tur normal biçimde kapanıyor.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'İki kişi oynamak isterse boş yerleri bot doldurabiliyor. İsimleri Türkçe: Fırça, Kalem, Palet, Tuval, Piksel. Tahmin ederken her bot önce iki-dört yanlış deniyor, sonra sürenin %30 ile %80\'i arasında bir anda doğruyu buluyor. Her zaman ilk bilen olsaydı insanlar için oyun biterdi.',
    },

    { type: 'h2', text: 'Kelime Havuzu' },
    {
      type: 'p',
      text: 'Havuzda 1071 kelime var ve üç zorluk seviyesine ayrılmış: 390 kolay, 527 orta, 154 zor. Zorluk hem puan çarpanını hem seçenekleri belirliyor; çizecek kişiye her turda üç kelime sunuluyor, mümkünse her zorluktan bir tane.',
    },
    {
      type: 'p',
      text: 'Kelimeleri seçerken en çok çizilebilirliği düşündüm. "Merdiven" iyi bir kelime. "Özgürlük" ise havuzda zor seviyede duruyor ve onu nasıl çizeceğimi ben de bilmiyorum. Zor seviyenin anlamı biraz da bu: çizmesi zor, bilmesi daha zor, puanı 1,5 kat.',
    },

    { type: 'h2', text: 'Bugün Olsa Neyi Değiştirirdim' },
    {
      type: 'p',
      text: 'Düz WebSocket\'i ciddi biçimde denerdim. Socket.io\'nun yeniden bağlanması ve oda yönetimi işimi çok kolaylaştırdı, ama bunun karşılığında istemciye ayrı bir paket indiriyorum (belgelerine göre küçültülmüş hâli sıkıştırılmış olarak 14,7 KB) ve özelliklerinin yalnızca bir kısmını kullanıyorum.',
    },
    {
      type: 'p',
      text: 'Tur akışını da en baştan bir durum makinesi olarak yazardım. Şu an `Room.ts` içinde 17 ayrı `this.phase` kontrolü var. Çalışıyor, ama yeni bir faz eklemek o 17 yeri tek tek dolaşmak demek.',
    },
    {
      type: 'p',
      text: 'Emin olamadığım tek karar odaların bellekte olması. Bir gün biri "on dakika önce oynadığımız oda nerede" diye sorarsa cevabım olmayacak. O gün gelene kadar bu sadeliği bir veritabanına tercih ediyorum.',
    },
  ],
}

export default post
