import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'socket-io-ile-oda-tabanli-multiplayer',
  tag: 'Realtime',
  tagColor: '#22d3ee',
  title: "Karalama: “İSTANBUL” Yazan Doğru Bildi mi?",
  excerpt:
    'Bir çizim oyunu yazdım. Kodun en çok dikkat isteyen yeri, "İSTANBUL" yazanın doğru bildiğine karar veren fonksiyon oldu, çünkü toLowerCase() Türkçe bilmiyor.',
  date: '2026-05-15',
  coverGradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #6366f1 100%)',
  content: [
    {
      type: 'lead',
      text: 'Karalama\'nın test dosyasında iki satır var ve oyunun temel kuralını onlar tutuyor: "İSTANBUL" yazan "istanbul"u, "KIŞ" yazan "kış"ı bilmiş sayılmalı. JavaScript\'in `toLowerCase()` fonksiyonu ikisini de yanlış yapıyor. WebSocket tarafı hazır bir kütüphaneyle çözüldü; Türkçe harfler için kendi kodumu yazmam gerekti.',
    },
    {
      type: 'p',
      text: 'Karalama, kayıt olmadan arkadaşlarla oynanan bir çizim-tahmin oyunu. Biri çiziyor, ötekiler tahmin ediyor, süre dolunca sıra değişiyor. Arkasında bir monorepo ve üç paket var.',
    },

    { type: 'h2', text: 'Önce Mimari: Neden Monorepo' },
    {
      type: 'p',
      text: 'Oyun iki ayrı yerde çalışıyor: Next.js istemcisi Vercel\'de, Socket.io sunucusu Railway\'de. İkisi de aynı tipleri kullanıyor: oda durumu, oyuncu, çizim verisi, olay adları. Bunları iki yere kopyalarsan, bir tarafta alan adı değişip ötekinde değişmediği gün oyun hata vermeden bozulur. Bu yüzden tipler en baştan ortak bir pakette.',
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
      text: 'Tahmini cevapla karşılaştırmak normalde tek satır: `a.toLowerCase() === b.toLowerCase()`. Türkçede bu yetmiyor.',
    },
    {
      type: 'p',
      text: '`toLowerCase()` dile bakmadan genel Unicode kurallarını uyguluyor. Büyük "İ"yi "i" yapıyor ama arkasına birleştirici bir nokta (U+0307) ekliyor. Büyük "I"yı da "i" yapıyor, oysa Türkçede "ı" olmalı.',
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
      text: 'Sondaki `replace` noktalamayı ve rakamları siliyor; testte `"  ,Kedi!"` girdisi `"kedi"` oluyor. Şapkalı harfler listede, çünkü kelime havuzunda "rüzgâr", "hâkim" ve "yapay zekâ" var.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bugün yazsam harfleri elle değiştirmezdim: `"İSTANBUL".toLocaleLowerCase("tr-TR")` doğrudan "istanbul", `"KIŞ".toLocaleLowerCase("tr-TR")` doğrudan "kış" veriyor. O iki `replace` satırı, dile göre çalışan tek bir çağrının elle yazılmış hâli.',
    },

    { type: 'h3', text: 'Yakın Tahmin' },
    {
      type: 'p',
      text: 'Hızlı yazan biri harf atlıyor: "bisiklet" yerine "bisklet". Bu doğru sayılmamalı, ama oyuncuya "çok yaklaştın" demek işe yarıyor. Sunucu tahmini cevapla Levenshtein uzaklığına göre karşılaştırıyor; fark en fazla iki harfse yalnızca yazan kişiye haber veriyor.',
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
      text: 'Burada iki karar var. Birincisi `answer.length > 3`: kısa kelimelerde iki harflik eşik bir şey ifade etmiyor. Cevap "at" iken "el" yazan biri de iki harf uzakta; o kontrol olmasa oyun ona "çok yakınsın" derdi. İkincisi `return null`: yakın tahmin sohbete düşmüyor. Düşseydi "bisklet" mesajı herkese cevabı ele verirdi.',
    },

    { type: 'h2', text: 'Çizimi Nasıl Gönderiyorum' },
    {
      type: 'p',
      text: 'Fare her kıpırdadığında paket göndermek, ekranın yenileme hızı kadar mesaj demek. Bu yüzden çizim olayları 33 milisaniyede bire, yani saniyede yaklaşık 30\'a sınırlı. Sohbetin de kendi sınırı var.',
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
      text: 'Koordinatlar piksel yerine 0 ile 1 arasında bir oran olarak gidiyor. Telefonda çizilen bir ev masaüstündeki geniş tuvalde de aynı yere düşüyor; telefonu yan çevirince çizim orantılı büyüyor.',
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
      text: 'Aynı biçim botların işine de yaradı. Sırası gelen bot, 0-1 aralığında tanımlı hazır şekillerden birini çiziyor: daire, kare, ev, ağaç, yıldız, kalp, güneş, balık. Şekli rastgele seçiyor. `startBotDrawing` fonksiyonu kelimeyi parametre olarak alıyor ama gövdesinde hiç kullanmıyor; yani cevap "merdiven" iken ekrana bir balık gelebiliyor. Kodun başındaki yorum "basit, tanınabilir şekiller" diyor ve bu davranışı ekleyen commit\'in mesajı neden böyle olduğunu söylemiyor. Şu hâliyle bot çizdiğinde çizim cevaba ancak tesadüfen benziyor.',
    },

    { type: 'h2', text: 'Puanı Kim Hesaplıyor' },
    {
      type: 'p',
      text: 'Karalama\'da puanı sunucu hesaplıyor. Tahmin sohbetten düz metin olarak geliyor; kimin yazdığını istemci söylemiyor, sunucu bunu bağlantının kendi kimliğinden (`socket.id`) biliyor. Kelime de tur bitene kadar yalnızca çizen kişide. Tahmin edenlere yalnızca ipucu ve harf sayısı gidiyor.',
    },
    {
      type: 'p',
      text: 'Puan formülü `packages/shared` içinde ama onu yalnızca sunucu çağırıyor. İstemci de aynı fonksiyonu import edebilir; sonucu önceden göstermek için kullanabilir, karar vermek için kullanamaz.',
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
      text: '`speedBonus` kaçıncı bildiğine bakıyor: ilk bilen 50, ikinci 35, üçüncü 20, dördüncü 5, sonrası sıfır. Zorluk çarpanı kolayda 1, ortada 1,2, zorda 1,5. Çizen kişinin puanı ayrı hesaplanıyor: kaç kişinin bildiğiyle orantılı, en fazla 200. Kimse bilemezse sıfır alıyor; yani herkesi elemek için kasten kötü çizmek işe yaramıyor.',
    },

    { type: 'h2', text: 'Odalar Bellekte' },
    {
      type: 'p',
      text: 'Veritabanı yok. Oda kodu altı karakter, oda nesnesi sunucunun belleğinde bir `Map` içinde duruyor. Beş dakikada bir temizlik çalışıyor ve 30 dakika hareketsiz kalan oda siliniyor.',
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
      text: 'Bu kararın bir bedeli var. Sunucu yeniden başlarsa bütün odalar gidiyor; bunu baştan kabul ettim. Bağlantı kopmaları ise iki hata çıkardı. Oyun ortasında bağlantısı kopup geri gelen oyuncu "oyun devam ediyor" hatasına takılıp dışarıda kalıyordu. Çizen kişi tur bitmeden çıkınca da tur, kelime açıklanmadan ve skor gösterilmeden geçiliyordu. İkisini de 15 Mayıs\'taki bir commit\'le düzelttim: geri gelen oyuncu oyuna dönebiliyor, çizen çıkarsa tur kelimeyi ve skorları gösterip kapanıyor.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'İki kişi oynamak isterse boş yerleri bot doldurabiliyor. İsimleri Türkçe: Fırça, Kalem, Palet, Tuval, Piksel. Tahmin ederken her bot önce bir ile üç arası yanlış kelime yazıyor, sonra sürenin %30 ile %80\'i arasında bir anda doğruyu buluyor. Koddaki yorum iki ile dört yanlış tahmin yazıyor, ama hesap `1 + Math.floor(Math.random() * 3)` ve bu 1, 2 ya da 3 veriyor. Botlar her seferinde ilk bilen olsaydı insanlar puan alamazdı.',
    },

    { type: 'h2', text: 'Kelime Havuzu' },
    {
      type: 'p',
      text: 'Havuzda 1071 kelime var ve üç zorluğa ayrılmış: 390 kolay, 527 orta, 154 zor. Zorluk hem puan çarpanını hem seçenekleri belirliyor; çizecek kişiye her turda üç kelime sunuluyor, mümkünse her zorluktan bir tane.',
    },
    {
      type: 'p',
      text: '"Merdiven" gibi bir kelime birkaç çizgiyle anlatılabiliyor. "Özgürlük" ise havuzda zor seviyede duruyor; çizmesi de bilmesi de zor, karşılığında puanı 1,5 kat.',
    },

    { type: 'h2', text: 'Bugün Olsa Neyi Değiştirirdim' },
    {
      type: 'p',
      text: 'Düz WebSocket\'i ciddi olarak denerdim. Yeniden bağlanmayı ve odaları Socket.io hazır veriyor, ama karşılığında istemciye ayrı bir paket iniyor (belgelerine göre küçültülmüş ve sıkıştırılmış hâli 14,7 KB) ve özelliklerinin yalnızca bir kısmını kullanıyorum.',
    },
    {
      type: 'p',
      text: 'Tur akışını da en baştan bir durum makinesi (state machine) olarak yazardım. Şu an `Room.ts` içinde 17 ayrı `this.phase` kontrolü var. Çalışıyor, ama yeni bir aşama eklemek o 17 yeri tek tek gezmek demek.',
    },
    {
      type: 'p',
      text: 'Emin olamadığım karar odaların bellekte durması. Bir gün biri "on dakika önce oynadığımız oda nerede" diye sorarsa verecek cevabım yok. O gün gelene kadar veritabanı eklemeyeceğim.',
    },
  ],
}

export default post
