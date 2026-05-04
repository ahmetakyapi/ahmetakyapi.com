import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bsp-ile-prosedurel-zindan-uretmek',
  tag: 'Gamedev',
  tagColor: '#a855f7',
  title: 'Dungeon Mates: BSP ile Prosedürel Zindan Üretmek',
  excerpt:
    'Her oyunda farklı ama bozuk olmayan bir zindan üretmek için BSP yaklaşımını nasıl kullandığıma dair, oyun hissini de düşünen sade notlar.',
  date: '2026-02-14',
  readTime: '11 dk',
  coverGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%)',
  content: [
    {
      type: 'p',
      text: 'Dungeon Mates için en başta çözmem gereken soru şuydu: Her oyunda farklı görünen ama yine de düzgün gezilebilen bir zindan nasıl çıkar? Tamamen rastgele denemeler kısa sürede dağıldı. Odalar üst üste bindi, koridorlar yarım kaldı, bazı yerler de anlamsız boşluklara dönüştü.',
    },
    {
      type: 'p',
      text: 'BSP burada çok dengeli bir çözüm verdi. Rastgelelik var ama başıboş değil. Önce haritayı parçalara ayırıyor, sonra odaları ve bağlantıları bu iskelet üstüne kuruyorsun. Böylece hem tekrar oynama hissi geliyor hem de kırık harita üretme ihtimali ciddi biçimde azalıyor.',
    },
    { type: 'h2', text: 'BSP Mantığı' },
    {
      type: 'p',
      text: 'Temel fikir büyük bir alanı adım adım daha küçük parçalara bölmek. En küçük yapraklara odalar yerleştiriliyor, sonra bu odalar birbirine bağlanıyor. Güzel tarafı şu: Harita rastgele görünse bile kendi içinde düzenli kalıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export class Leaf {
  rect: Rect
  left: Leaf | null = null
  right: Leaf | null = null
  room: Rect | null = null
}`,
    },
    { type: 'h2', text: 'Yatay mı, Dikey mi?' },
    {
      type: 'p',
      text: 'Bu karar haritanın karakterini doğrudan etkiliyor. Tamamen rastgele bölünce bazı parçalar çok ince ve uzun kalıyor. O yüzden dikdörtgenin oranına bakıp yön seçmek bana daha dengeli sonuç verdi.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `const ratio = leaf.rect.w / leaf.rect.h
let horizontal: boolean
if (ratio > 1.25)      horizontal = false
else if (ratio < 0.75) horizontal = true
else                   horizontal = rng() < 0.5`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Rastgele sayı üreten fonksiyonu dışarıdan vermek, seed desteğini neredeyse bedavaya getiriyor. Hata ayıklarken çok rahatlatıyor.',
    },
    { type: 'h2', text: 'Odaları Yerleştirmek' },
    {
      type: 'p',
      text: 'En alttaki yaprakları odalar için güvenli alan gibi düşünebilirsin. Odayı kenarlardan biraz boşluk bırakarak yerleştirmek, hem koridorlara yer açıyor hem de sonuçta daha doğal bir görünüm veriyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `const w = Math.floor(minW + rng() * (leaf.rect.w - minW - 2))
const h = Math.floor(minH + rng() * (leaf.rect.h - minH - 2))
const x = leaf.rect.x + 1 + Math.floor(rng() * (leaf.rect.w - w - 1))
const y = leaf.rect.y + 1 + Math.floor(rng() * (leaf.rect.h - h - 1))`,
    },
    { type: 'h2', text: 'Koridorları Bağlamak' },
    {
      type: 'p',
      text: 'Haritanın hissi büyük ölçüde burada oluşuyor. İç düğümlerde alt dallardaki odaları birbirine bağlayınca zindan sadece çalışır hale gelmiyor, aynı zamanda okunur hale de geliyor. L biçimli koridorlar basit ama yeterince güçlü bir çözüm oldu.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `if (rng() < 0.5) {
  drawHLine(ax, bx, ay)
  drawVLine(ay, by, bx)
} else {
  drawVLine(ay, by, ax)
  drawHLine(ax, bx, by)
}`,
    },
    { type: 'h2', text: 'Çok Oyunculu Tarafta Tek Kaynak' },
    {
      type: 'p',
      text: 'Harita üretimi çok oyunculu oyunda mutlaka sunucuda yapılmalı. Her istemci kendi seed’iyle kendi zindanını üretirse küçük bir fark bile bütün koşuyu dağıtabiliyor. O yüzden haritayı sunucu üretip herkese aynı sonucu göndermek en temiz yol oldu.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `function startRun(roomId: string, seed: number) {
  const rng  = mulberry32(seed)
  const grid = generateDungeon(rng)
  const { spawn, boss, enemies } = populate(grid, rng)

  io.to(roomId).emit('run:start', { seed, grid, spawn, boss, enemies })
}`,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Sadece seed paylaşmak ilk bakışta cazip gelebilir ama istemci tarafında fazla öngörülebilirlik yaratabilir. Oyun mantığında gereğinden fazla bilgi vermemek daha sağlıklı.',
    },
  ],
}

export default post
