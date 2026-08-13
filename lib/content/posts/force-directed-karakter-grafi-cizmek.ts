import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'force-directed-karakter-grafi-cizmek',
  tag: 'Arayüz',
  tagColor: '#ef4444',
  title: 'Force-Directed Graf Yazdım, Sonra Silip Yerine Çember Koydum',
  excerpt:
    '25 karakter ve 29 ilişkiyi görselleştirmek için fizik motoru yazdım. Çalıştı, güzel görünüyordu ve kullanışsızdı. Neden vazgeçtiğime dair dürüst bir yazı.',
  date: '2026-04-15',
  coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
  content: [
    {
      type: 'lead',
      text: 'One Piece Hub için karakter ilişkilerini çizmek istedim. Force-directed layout kurdum, iki gün uğraştım, sonunda düğümler yerine oturdu ve gerçekten hoş görünüyordu. Bir hafta sonra hepsini sildim. Bu yazı o kararın hikâyesi.',
    },
    {
      type: 'p',
      text: 'Elimde 25 karakter ve 29 ilişki vardı. Nakama bağları, aile, rakiplik, düşmanlık, hoca-öğrenci, ittifak. Bunları düz bir tabloda göstermek mümkündü ama bir evreni tablo ile anlatamıyorsun.',
    },

    { type: 'h2', text: 'Force-Directed Neden Cazip Geliyor' },
    {
      type: 'p',
      text: 'Fikir güzel: düğümler birbirini iter, bağlı olanlar birbirini çeker, sistem kendi kendine dengeye oturur. Yerleşimi sen tasarlamıyorsun, fizik hallediyor. Bağlantısı çok olan karakterler merkeze, ilgisiz gruplar kenara gidiyor.',
    },
    {
      type: 'p',
      text: 'Kütüphane kullanmadan önce mekaniği anlamak için küçük bir simülasyon yazdım. Üç kuvvet var: itme, çekme ve sönümleme.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'ilk deneme — artık kodda yok',
      text: `const REPULSION = 800
const SPRING = 0.02
const DAMPING = 0.9

function step(nodes: Node[], links: Link[], dt: number) {
  // 1) Her düğüm her düğümü iter — O(n²), 25 düğümde sorun değil
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.01
      const f = REPULSION / (dist * dist)
      a.vx -= (dx / dist) * f; a.vy -= (dy / dist) * f
      b.vx += (dx / dist) * f; b.vy += (dy / dist) * f
    }
  }

  // 2) Bağlı olanlar birbirini çeker
  for (const { source, target } of links) {
    const a = nodes[source], b = nodes[target]
    a.vx += (b.x - a.x) * SPRING; a.vy += (b.y - a.y) * SPRING
    b.vx -= (b.x - a.x) * SPRING; b.vy -= (b.y - a.y) * SPRING
  }

  // 3) Sönümleme ve konumu güncelleme — bu adım olmadan sistem hiç durmaz
  for (const n of nodes) {
    n.vx *= DAMPING; n.vy *= DAMPING
    n.x += n.vx * dt; n.y += n.vy * dt
  }
}`,
    },
    {
      type: 'p',
      text: 'Üçüncü döngü en önemlisi ve ilk yazdığımda unuttuğum kısımdı. Hızları hesaplayıp konuma uygulamayınca hiçbir düğüm kıpırdamıyor. Yarım saat "kuvvetler yanlış" diye bakındım, oysa sistem hiç adım atmıyordu.',
    },
    {
      type: 'p',
      text: '`DAMPING` değerini 0.99 bıraktığım sürümde graf dakikalarca titredi. 0.9\'a çekince yaklaşık 120 adımda duruyor. Bu sayı tamamen deneme yanılma.',
    },

    { type: 'h2', text: 'Çalıştı. Sonra Kullanıcı Gibi Baktım.' },
    {
      type: 'p',
      text: 'Simülasyon oturdu, düğümler dağıldı, çizgiler kesişmiyordu. Ekran görüntüsü alıp arkadaşıma gönderdim, "vay" dedi. Sonra siteye koydum ve iki gün sonra fark ettim ki ben bile kullanmıyorum.',
    },
    {
      type: 'p',
      text: 'Sorunlar sırayla:',
    },
    {
      type: 'ol',
      items: [
        'Her sayfa açılışında yerleşim farklı çıkıyordu. Luffy bir seferinde solda, bir seferinde sağda. Kullanıcı ikinci ziyaretinde hiçbir şeyi hatırlayamıyor.',
        'Simülasyon otururken ekranda düğümler zıplıyordu. Bunu "yükleniyor" hissi sandım; kullanıcı "bozuk" hissi olarak okudu.',
        'Mobilde 25 düğüm 375 piksele sığmıyor. Sürükleyip yakınlaştırmak gerekiyordu ve o hareket sayfanın kendi kaydırmasıyla çakışıyordu.',
        'Bir karaktere tıklayınca ilişkilerini görmek istiyorsun. Fizik yerleşiminde ilgili düğümler ekranın dört bir yanına dağılmış oluyor.',
      ],
    },
    {
      type: 'quote',
      text: 'Force-directed layout bir keşif aracıdır: yapısını bilmediğin bir grafta küme aramak için iyidir. Ben zaten yapıyı biliyordum — 25 karakter, elle yazdığım 29 bağ.',
    },
    {
      type: 'p',
      text: 'Yani problem yanlış araçtaydı. Bilmediğim bir şeyi keşfetmek için değil, bildiğim bir şeyi göstermek için çiziyordum.',
    },

    { type: 'h2', text: 'Yerine Ne Koydum' },
    {
      type: 'p',
      text: 'Karakterleri bir çembere eşit aralıklarla dizdim. Fizik yok, animasyon yok, rastgelelik yok. Sekiz satır.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'components/characters/RelationshipGraph.tsx',
      text: `function getCircularLayout(count: number, centerX: number, centerY: number, radius: number) {
  return Array.from({ length: count }).map((_, i) => {
    // -PI/2 kayması ilk karakteri tam tepeye alıyor; onsuz sağdan
    // başlıyor ve kompozisyon eğri duruyor.
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
}`,
    },
    {
      type: 'p',
      text: 'Kazandıklarım tek tek şunlar:',
    },
    {
      type: 'table',
      head: ['', 'Force-directed', 'Çember'],
      rows: [
        ['Yerleşim', 'Her açılışta farklı', 'Her zaman aynı'],
        ['İlk kare', 'Simülasyon oturana kadar bekliyor', 'Anında hazır'],
        ['Kod', '~180 satır + döngü', '8 satır, saf fonksiyon'],
        ['Mobil', 'Sürükle-yakınlaştır gerekiyor', 'SVG viewBox ile ölçekleniyor'],
        ['Render', 'Her adımda DOM güncelleniyor', 'useMemo, tek hesap'],
      ],
    },
    {
      type: 'p',
      text: 'Konumlar artık `useMemo` içinde ve bağımlılığı sadece merkez koordinatı. Yani hiç yeniden hesaplanmıyor. React tarafında da tek bir animasyon döngüsü kalmadı.',
    },

    { type: 'h2', text: 'Asıl Etkileşim Çemberde Değil' },
    {
      type: 'p',
      text: 'Görselleştirmenin işe yaraması çemberden değil, üstüne koyduğum iki şeyden geldi.',
    },
    {
      type: 'p',
      text: 'Birincisi ilişki türüne göre filtre. Altı tür var ve her birinin kendi rengi. "Sadece düşmanlıklar" dediğinde çember aynı kalıyor, sadece çizgiler değişiyor. Yerleşim sabit olduğu için karşılaştırma yapabiliyorsun — force-directed\'da her filtre yeni bir düzen demekti.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/constants/relationships.ts',
      text: `export type RelationType =
  | 'nakama' | 'family' | 'rival' | 'enemy' | 'mentor' | 'ally'

export const RELATION_CONFIG: Record<
  RelationType,
  { color: string; label: string; dash?: boolean }
> = {
  nakama: { color: '#ef4444', label: 'Nakama' },
  family: { color: '#f59e0b', label: 'Aile' },
  rival:  { color: '#8b5cf6', label: 'Rakip', dash: true },
  // ...
}`,
    },
    {
      type: 'p',
      text: 'İkincisi seçim paneli. Bir karaktere tıklayınca yan tarafta o karakterin bütün bağları liste hâlinde açılıyor — kimle nasıl bir ilişkisi var, etiketiyle birlikte. Grafik hissi veriyor, liste bilgi veriyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Mobilde sayfa açılır açılmaz Luffy seçili geliyor. Boş bir çemberle karşılaşan kullanıcı ne yapacağını bilmiyordu; hazır bir örnekle karşılaşınca dokunmayı deniyor. Tek satırlık bir varsayılan, kullanım oranını gözle görülür değiştirdi.',
    },

    { type: 'h2', text: 'Peki Ne Zaman Force-Directed Kullanırdım' },
    {
      type: 'p',
      text: 'Vazgeçmem "force-directed kötü" demek değil. Şu üç koşulun ikisi varsa hâlâ ilk tercihim olurdu:',
    },
    {
      type: 'ul',
      items: [
        'Düğüm sayısı üç haneli ve elle yerleştirmek mümkün değil.',
        'Grafın yapısını bilmiyorsun — küme aramak, merkez bulmak istiyorsun.',
        'Veri dinamik: her gün yeni düğümler ekleniyor, sabit bir kompozisyon tasarlayamıyorsun.',
      ],
    },
    {
      type: 'p',
      text: 'Benim durumumda üçü de yoktu. 25 düğüm, elle yazılmış ilişkiler, yılda birkaç kez değişen veri.',
    },

    { type: 'h2', text: 'Rakamlarla' },
    {
      type: 'stats',
      label: 'One Piece Hub · ilişki grafiği',
      items: [
        { value: '25', note: 'grafta gösterilen karakter' },
        { value: '67', note: 'sitedeki toplam karakter' },
        { value: '29', note: 'tanımlı ilişki' },
        { value: '6', note: 'ilişki türü' },
        { value: '396', note: 'satırlık bileşen' },
      ],
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Bir şeyi yazabiliyor olmak, yazmak gerektiği anlamına gelmiyor. Fizik simülasyonu yazmak eğlenceliydi ve ben o eğlenceyi ürünün ihtiyacıyla karıştırdım.',
    },
    {
      type: 'p',
      text: 'İkinci ders daha somut: görselleştirmede tutarlılık, zarafetten önce gelir. Aynı veriyi ikinci kez açtığında aynı şeyi görmek, hoş bir yerleşimden çok daha değerli.',
    },
    {
      type: 'p',
      text: 'Sildiğim koda hâlâ üzülüyorum ve dosyayı bir yerde saklıyorum. Bir gün karakter sayısı üç haneye çıkarsa geri getireceğim.',
    },
  ],
}

export default post
