import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'bsp-ile-prosedurel-zindan-uretmek',
    tag: 'Gamedev',
    tagColor: '#a855f7',
    title: 'Dungeon Mates — BSP ile Her Oyunda Farklı Bir Zindan Üretmek',
    excerpt:
      'Binary Space Partitioning ile yürünebilir, tutarlı ve her seferinde farklı bir zindan haritası nasıl üretilir? Kullandığım algoritma, adım adım.',
    date: '2026-02-14',
    readTime: '11 dk',
    coverGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%)',
    content: [
      { type: 'p', text: 'Dungeon Mates\'e başlarken en büyük belirsizlik şuydu: her oyunda farklı ama yürünebilir bir zindan nasıl üretilir? El yordamıyla yazdığım rastgele algoritmalar koridorları havada bırakıyor, odalar üst üste biniyordu. Binary Space Partitioning üstüne bir kaynak okuduktan sonra uyguladım ve oyunun temeli buradan çıktı.' },
      { type: 'h2', text: 'BSP Nasıl Çalışır' },
      { type: 'p', text: 'Fikir oldukça basit. Büyük bir dikdörtgenle başla. Onu ortadan ikiye böl — yatay ya da dikey. Elde ettiğin her parçayı da ikiye böl. Bir minimum boyut eşiğine inene kadar devam et. Sonra en derindeki her parçanın içine sığacak bir oda yerleştir. Son adımda odaları koridorlarla birleştir.' },
      { type: 'p', text: 'Sonuç: her parça bir odayı ağırlıyor, parçalar komşu olduğu için koridorlar doğal akıyor, hiçbir oda boşlukta kalmıyor.' },
      { type: 'h2', text: 'Veri Yapısı: Leaf Tree' },
      { type: 'code', lang: 'ts', text: `// shared/dungeon/bsp.ts
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export class Leaf {
  rect:  Rect
  left:  Leaf | null = null
  right: Leaf | null = null
  room:  Rect | null = null

  constructor(rect: Rect) {
    this.rect = rect
  }

  get isLeaf() {
    return this.left === null && this.right === null
  }
}` },
      { type: 'h2', text: 'Bölme Kararı: Yatay mı, Dikey mi' },
      { type: 'p', text: 'En çok düşündüğüm kısım burasıydı. Her adımda rastgele seçince dikdörtgenler garip oranlarda kalıyor — çok uzun ve ince parçalar çıkıyor. Pratik kural: parçanın şekline bak. Geniş ise dikey böl, uzun ise yatay böl, kareye yakınsa rastgele bırak.' },
      { type: 'code', lang: 'ts', text: `const MIN_LEAF_SIZE = 9     // 9x9 altına inmeyelim
const MAX_LEAF_SIZE = 22    // 22x22 üstüne çıkmayalım, yoksa oda çok büyür

function split(leaf: Leaf, rng: () => number): boolean {
  if (!leaf.isLeaf) return false
  if (leaf.rect.w < MIN_LEAF_SIZE * 2 && leaf.rect.h < MIN_LEAF_SIZE * 2) {
    return false              // daha bölünemeyecek kadar küçük
  }

  const ratio = leaf.rect.w / leaf.rect.h
  let horizontal: boolean
  if (ratio > 1.25)      horizontal = false   // geniş → dikey böl
  else if (ratio < 0.75) horizontal = true    // uzun → yatay böl
  else                   horizontal = rng() < 0.5

  const max = (horizontal ? leaf.rect.h : leaf.rect.w) - MIN_LEAF_SIZE
  if (max <= MIN_LEAF_SIZE) return false

  const split = Math.floor(MIN_LEAF_SIZE + rng() * (max - MIN_LEAF_SIZE))

  if (horizontal) {
    leaf.left  = new Leaf({ ...leaf.rect, h: split })
    leaf.right = new Leaf({ ...leaf.rect, y: leaf.rect.y + split, h: leaf.rect.h - split })
  } else {
    leaf.left  = new Leaf({ ...leaf.rect, w: split })
    leaf.right = new Leaf({ ...leaf.rect, x: leaf.rect.x + split, w: leaf.rect.w - split })
  }
  return true
}` },
      { type: 'callout', variant: 'tip', text: 'rng\'yi dışarıdan parametre olarak almak seed\'lenebilir üretimi ücretsiz veriyor. Aynı seed → aynı harita; bug ayıklarken çok işe yarıyor.' },
      { type: 'h2', text: 'Oda Yerleştirme: Yaprakların İçine' },
      { type: 'p', text: 'Ağacı kurduktan sonra yalnızca leaf düğümlerinin içine oda çiziyoruz. Oda leaf\'in kenarından biraz içeride, rastgele boyutta.' },
      { type: 'code', lang: 'ts', text: `function createRooms(leaf: Leaf, rng: () => number) {
  if (leaf.left || leaf.right) {
    if (leaf.left)  createRooms(leaf.left,  rng)
    if (leaf.right) createRooms(leaf.right, rng)
    return
  }

  const minW = 4, minH = 4
  const w = Math.floor(minW + rng() * (leaf.rect.w - minW - 2))
  const h = Math.floor(minH + rng() * (leaf.rect.h - minH - 2))
  const x = leaf.rect.x + 1 + Math.floor(rng() * (leaf.rect.w - w - 1))
  const y = leaf.rect.y + 1 + Math.floor(rng() * (leaf.rect.h - h - 1))

  leaf.room = { x, y, w, h }
}` },
      { type: 'h2', text: 'Koridorları Birleştirmek' },
      { type: 'p', text: 'Algoritmanın hissini bu adım belirliyor. Her iç düğümde, sol alt-ağacın bir odasıyla sağ alt-ağacın bir odasını birleştiriyorum. L-şekilli koridorlar: ya önce yatay sonra dikey, ya tam tersi.' },
      { type: 'code', lang: 'ts', text: `function connectRooms(leaf: Leaf, rng: () => number) {
  if (leaf.left)  connectRooms(leaf.left,  rng)
  if (leaf.right) connectRooms(leaf.right, rng)
  if (!leaf.left || !leaf.right) return

  const a = pickRoom(leaf.left,  rng)
  const b = pickRoom(leaf.right, rng)
  if (!a || !b) return

  const ax = a.x + Math.floor(a.w / 2)
  const ay = a.y + Math.floor(a.h / 2)
  const bx = b.x + Math.floor(b.w / 2)
  const by = b.y + Math.floor(b.h / 2)

  if (rng() < 0.5) {
    drawHLine(ax, bx, ay)
    drawVLine(ay, by, bx)
  } else {
    drawVLine(ay, by, ax)
    drawHLine(ax, bx, by)
  }
}

function pickRoom(leaf: Leaf, rng: () => number): Rect | null {
  if (leaf.room) return leaf.room
  const children = [leaf.left, leaf.right].filter(Boolean) as Leaf[]
  const pick = children[Math.floor(rng() * children.length)]
  return pickRoom(pick, rng)
}` },
      { type: 'callout', variant: 'info', text: 'pickRoom yaprağa inene kadar rastgele bir alt dal seçiyor. Hep aynı odayı birleştirmek yerine harita her seferinde biraz farklı akıyor.' },
      { type: 'h2', text: 'Çıkış ve Zorluk Odaları' },
      { type: 'p', text: 'Harita üretildikten sonra en uzak iki odayı bulup birini spawn, diğerini boss yapıyorum. BFS ile tüm odalar arası en kısa yol hesaplanıyor; en uzun path\'in iki ucu seçiliyor.' },
      { type: 'code', lang: 'ts', text: `function pickSpawnAndBoss(rooms: Rect[], tiles: Tile[][]): [Rect, Rect] {
  let best: { a: Rect; b: Rect; dist: number } | null = null

  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const d = bfsDistance(tiles, center(rooms[i]), center(rooms[j]))
      if (d && (!best || d > best.dist)) best = { a: rooms[i], b: rooms[j], dist: d }
    }
  }
  return best ? [best.a, best.b] : [rooms[0], rooms[1]]
}` },
      { type: 'h2', text: 'Düşman Yerleştirme: Leaf Derinliği' },
      { type: 'p', text: 'Düşmanları leaf\'in derinliğine göre dağıtıyorum. Ağacın derinine inildikçe oda spawn\'dan uzak düşme eğiliminde (yol uzuyor). Daha derin odalara daha güçlü düşman düşüyor. Tuning gerekiyor ama başlangıç noktası olarak iyi çalışıyor.' },
      { type: 'code', lang: 'ts', text: `function populateLeaf(leaf: Leaf, depth: number) {
  if (leaf.left)  populateLeaf(leaf.left,  depth + 1)
  if (leaf.right) populateLeaf(leaf.right, depth + 1)
  if (!leaf.room) return

  const tier = Math.min(3, Math.floor(depth / 2))   // 0,1,2,3
  const count = 1 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    spawnEnemy(leaf.room, tier)
  }
}` },
      { type: 'h2', text: 'Senkron Üretim: Tüm Oyuncular Aynı Haritayı Görsün' },
      { type: 'p', text: 'Multiplayer tarafındaki kritik nokta: üretim sunucuda yapılıyor, tile grid\'i bir kez client\'lara gönderiliyor. Her kullanıcı kendi RNG\'sini koşsaydı haritalar ayrışır, oyun dağılırdı. Tek doğruluk kaynağı sunucu.' },
      { type: 'code', lang: 'ts', text: `// server/gameStart.ts
function startRun(roomId: string, seed: number) {
  const rng  = mulberry32(seed)
  const grid = generateDungeon(rng)
  const { spawn, boss, enemies } = populate(grid, rng)

  io.to(roomId).emit('run:start', { seed, grid, spawn, boss, enemies })
}` },
      { type: 'callout', variant: 'warning', text: 'Sadece seed göndermek (grid yerine) cazip gelebilir — trafik azalır. Ama client seed\'i bilirse düşman pozisyonlarını önceden hesaplayabilir. Grid\'in kendisini göndermek doğru karar.' },
      { type: 'h2', text: 'Kapanış' },
      { type: 'p', text: 'BSP\'nin güzeli öngörülebilir olması. Parametreleri değiştirdikçe (min leaf size, max depth, koridor genişliği) haritanın karakteri değişiyor ama hiçbir zaman bozuk harita üretmiyor. Dungeon Mates\'te aynı kodla bir zindan, bir mağara, bir şehir parkı hissi alabildim; leaf\'in içine farklı tile set çizmek yetti.' },
      { type: 'p', text: 'Oyun geliştirmeye yeni başlayan biri için iyi bir giriş noktası: gözle takip edebiliyorsun, hata ayıklamak kolay, sonucu görmek tatmin edici. Bir seed sabitleyip her adımı canvas\'a çizerek ilerlemek öğrenmek için en temiz yol.' },
    ],
  }

export default post
