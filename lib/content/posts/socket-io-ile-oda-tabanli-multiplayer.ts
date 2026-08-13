import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'socket-io-ile-oda-tabanli-multiplayer',
  tag: 'Realtime',
  tagColor: '#22d3ee',
  title: 'Karalama: Türkçe Bir Çizim Oyununda Tahmini Kim Doğruluyor?',
  excerpt:
    'Çok oyunculu bir çizim oyunu yazdım. En zor kısmı çizimi senkronlamak değildi — "İSTANBUL" yazan birinin doğru tahmin ettiğini anlamaktı.',
  date: '2026-05-15',
  coverGradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #6366f1 100%)',
  content: [
    {
      type: 'lead',
      text: 'İlk gerçek testte dört kişiydik. Arkadaşım bir ev çizdi, ben sohbete "ev" yazdım, oyun beni doğru saydı. Sonra başka biri "EV" yazdı ve oyun onu saymadı. O an anladım ki bu oyunun asıl zorluğu WebSocket değil, Türkçe.',
    },
    {
      type: 'p',
      text: 'Karalama, kayıt olmadan arkadaşlarla oynanan bir çizim-tahmin oyunu. Bir kişi çiziyor, diğerleri tahmin ediyor, süre doluyor, sıra değişiyor. Basit görünüyor. Bir monorepo, üç paket ve epey bir hata sonra yayında.',
    },

    { type: 'h2', text: 'Önce Mimari: Neden Monorepo' },
    {
      type: 'p',
      text: 'Oyun iki ayrı yerde çalışıyor: Next.js istemcisi Vercel\'de, Socket.io sunucusu Railway\'de. İkisinin de aynı tiplere ihtiyacı var — oda durumu, oyuncu, çizim verisi, olay adları.',
    },
    {
      type: 'p',
      text: 'İlk sürümde tipleri iki yere kopyalamıştım. Bir hafta sonra sunucuda `roundEndsAt` alanını `endsAt` yapıp istemcide unuttum. Oyun sessizce çalıştı, sadece geri sayım hep sıfır gösterdi. Ondan sonra `packages/shared` açtım.',
    },
    {
      type: 'steps',
      items: [
        { title: 'apps/web', text: 'Next.js istemcisi — çizim tuvali, sohbet, oda ekranları. Vercel.' },
        { title: 'apps/server', text: 'Socket.io sunucusu — oda yönetimi, tur akışı, puanlama. Railway.' },
        { title: 'packages/shared', text: 'Tipler, sabitler, puanlama fonksiyonları. İki tarafın da import ettiği tek doğruluk kaynağı.' },
      ],
    },

    { type: 'h2', text: 'Türkçe Küçük Harf Tuzağı' },
    {
      type: 'p',
      text: 'Tahmin karşılaştırması normalde tek satırlıktır: `a.toLowerCase() === b.toLowerCase()`. Türkçe\'de değil.',
    },
    {
      type: 'p',
      text: 'JavaScript\'in `toLowerCase()` fonksiyonu varsayılan olarak İngilizce kurallarını uygular. Yani büyük "İ" harfini "i̇" yapıyor — arkasında birleştirici bir nokta bırakarak. Ve büyük "I" harfini "i" yapıyor, oysa Türkçe\'de "ı" olmalı.',
    },
    {
      type: 'compare',
      label: 'Kullanıcı "İSTANBUL" yazdı, cevap "istanbul"',
      before: { label: 'toLowerCase()', value: 'eşleşmiyor' },
      after: { label: 'önce harf değişimi', value: 'eşleşiyor' },
      note: '"İ".toLowerCase() sonucu "i" değil, "i" + U+0307 birleştirici noktası. Gözle aynı görünüyor, karşılaştırmada eşit değil.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/scoring.ts',
      text: `export function normalizeGuess(text: string): string {
  // Türkçe harfleri toLowerCase'DEN ÖNCE değiştirmek zorunlu:
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
      text: 'Sondaki `replace` de bir hata düzeltmesi. Biri "ev!!!" yazdığında oyun saymıyordu. Noktalama ve rakamları düşürünce bitti. Şapkalı harfleri (â, î, û) listede tuttum çünkü kelime havuzunda "kâğıt" gibi kelimeler var.',
    },

    { type: 'h3', text: 'Yakın Tahmin' },
    {
      type: 'p',
      text: 'Bir de şu vardı: insanlar hızlı yazarken harf atlıyor. "bisiklet" yerine "bisklet". Doğru cevabı vermiş sayılmalı mı? Hayır — ama "çok yaklaştın" demek oyunu belirgin şekilde eğlenceli yapıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'apps/server/src/game/Room.ts',
      text: `// Kısa kelimelerde bu kontrol yapılmıyor: "el" ile "at" arasındaki
// Levenshtein uzaklığı da 2 ve ikisi de kelime havuzunda.
if (answer.length > 3 && levenshtein(normalized, answer) <= 2) {
  // "Çok yakınsın!" — sadece yazan kişiye
}`,
    },
    {
      type: 'p',
      text: 'O `answer.length > 3` kontrolü olmadan oyun "el" yazan birine "çok yakınsın" diyordu, oysa cevap "at" idi. Kısa kelimelerde uzaklık eşiği anlamsızlaşıyor.',
    },

    { type: 'h2', text: 'Çizimi Nasıl Gönderiyorum' },
    {
      type: 'p',
      text: 'İlk denemem her `mousemove` olayında bir paket göndermekti. Saniyede 120 mesaj. Sunucu dayandı ama mobilde tuval takılmaya başladı.',
    },
    {
      type: 'p',
      text: 'İki şey düzeltti. Birincisi hız sınırı: çizim olayları 33 milisaniyede bir, yani yaklaşık 30 kare. Gözle fark edilmiyor, trafik dörtte bire iniyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/constants/game.ts',
      text: `export const DRAW_RATE_LIMIT_MS = 33  // ~30fps
export const CHAT_RATE_LIMIT_MS = 500
export const MAX_CHAT_LENGTH = 100`,
    },
    {
      type: 'p',
      text: 'İkincisi koordinatları 0-1 aralığında normalize etmek. Bunu baştan yapmadım ve pişman oldum: telefonda çizilen bir şey masaüstünde bambaşka yere düşüyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/types/drawing.ts',
      text: `export interface DrawPoint {
  x: number // 0-1 arası normalize — tuval boyutundan bağımsız
  y: number
  pressure?: number
}

export interface DrawStroke {
  id: string
  tool: DrawTool
  color: string
  size: number
  points: DrawPoint[]
}`,
    },
    {
      type: 'p',
      text: 'Normalize etmenin ikinci faydası sonradan çıktı: tuvali yeniden boyutlandırınca çizim bozulmuyor. Telefonu yatay çevirdiğinde her şey orantılı büyüyor.',
    },

    { type: 'h2', text: 'Puanı Kim Hesaplıyor' },
    {
      type: 'p',
      text: 'Bu soruya ilk sürümde yanlış cevap verdim: istemci. Tahmin doğruysa istemci puanı hesaplayıp sunucuya gönderiyordu.',
    },
    {
      type: 'quote',
      text: 'Test ederken bir arkadaşım konsolu açtı, elle bir puan olayı gönderdi ve tek turda oyunu bitirdi. O akşam bütün puan mantığını sunucuya taşıdım.',
    },
    {
      type: 'p',
      text: 'Şimdi puan formülü `packages/shared` içinde ama YALNIZCA sunucu çağırıyor. İstemci aynı fonksiyonu import edebiliyor — sadece sonucu önceden göstermek için, otorite değil.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'packages/shared/src/scoring.ts',
      text: `export function calculateGuesserScore(p: GuesserScoreParams): number {
  const base = 100
  const timeBonus = Math.round(150 * (p.timeLeft / p.totalTime))
  // Kaçıncı bildiğin de önemli: ilk bilen 50, ikinci 35, dördüncüden
  // sonrası 0. Herkesin aynı puanı alması yarışı öldürüyordu.
  const speedBonus = Math.max(0, 50 - p.guessOrder * 15)
  const multiplier = DIFFICULTY_MULTIPLIER[p.wordDifficulty] ?? 1
  return Math.round((base + timeBonus + speedBonus) * multiplier)
}`,
    },
    {
      type: 'p',
      text: 'Çizen kişinin puanı ayrı: kaç kişinin bildiğine oranlı, tavanı 200. Kimse bilemezse sıfır alıyor. Bu da bilerek — çok zor bir şey çizip herkesi elemek strateji olmasın diye.',
    },

    { type: 'h2', text: 'Odalar Bellekte' },
    {
      type: 'p',
      text: 'Veritabanı yok. Oda kodu altı karakter, oda nesnesi sunucunun belleğinde bir `Map` içinde, 30 dakika hareketsiz kalırsa siliniyor.',
    },
    {
      type: 'table',
      head: ['Ayar', 'Değer', 'Neden'],
      rows: [
        ['Oyuncu sayısı', '2 – 12', '12\'den sonra sohbet okunamaz hâle geliyor'],
        ['Çizim süresi', '30 – 120 sn', 'Alt sınır 15\'ti, kimse yetişemedi'],
        ['Kelime seçme', '15 sn', 'Seçmezsen rastgele atanıyor'],
        ['İlk harf ipucu', 'sürenin %66\'sı', 'Tur ölmesin diye'],
        ['İkinci harf', 'sürenin %33\'ü', ''],
        ['Oda ömrü', '30 dk', 'Bellek şişmesin'],
      ],
    },
    {
      type: 'p',
      text: 'Bu kararın bedeli var: sunucu yeniden başlarsa bütün odalar gidiyor. Kabul ettim. Oyun ortalama 10 dakika sürüyor ve kimse yarım kalan bir Karalama oturumuna geri dönmek istemiyor.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Bot desteğini de bu yüzden ekledim. İki kişi başlamak isterse boş yerleri bot dolduruyor — isimleri Türkçe: Fırça, Kalem, Palet, Tuval. Bot çizmiyor, sadece tahmin ediyor ve arada yanlış bilerek insanı rahatlatıyor.',
    },

    { type: 'h2', text: 'Kelime Havuzu' },
    {
      type: 'p',
      text: 'Havuzda 1071 kelime var ve üç zorluk seviyesine ayrılmış. Zorluk hem puan çarpanını hem seçenekleri etkiliyor: her turda çizecek kişiye üç kelime sunuluyor, üçü de farklı zorlukta.',
    },
    {
      type: 'p',
      text: 'Kelimeleri seçerken en çok uğraştığım şey çizilebilirlikti. "Özgürlük" güzel bir kelime ama kimse çizemiyor. "Merdiven" iyi. Havuzu üç kere baştan geçtim ve her seferinde soyut kelimeleri attım.',
    },

    { type: 'h2', text: 'Bugün Olsa Neyi Değiştirirdim' },
    {
      type: 'p',
      text: 'Socket.io yerine düz WebSocket denerdim. Socket.io\'nun otomatik yeniden bağlanması ve oda yönetimi işimi çok kolaylaştırdı, ama istemci paketi 45 KB ve ben özelliklerinin belki üçte birini kullanıyorum.',
    },
    {
      type: 'p',
      text: 'Bir de tur akışını en baştan bir durum makinesi olarak yazardım. Şu an `Room.ts` içinde `if (this.phase === ...)` kontrolleri var ve yeni bir faz eklerken hep bir yeri unutuyorum. Çalışıyor ama zarif değil.',
    },
    {
      type: 'p',
      text: 'Emin olamadığım tek karar odaların bellekte olması. Bir gün biri "10 dakika önce oynadığımız oda nerede" diye sorarsa cevabım olmayacak. O gün gelene kadar bu sadelik bana daha değerli.',
    },
  ],
}

export default post
