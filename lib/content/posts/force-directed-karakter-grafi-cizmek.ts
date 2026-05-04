import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'force-directed-karakter-grafi-cizmek',
  tag: 'Visualization',
  tagColor: '#ef4444',
  title: 'One Piece Hub: Büyük Bir Evreni Görselleştirmek',
  excerpt:
    '66 karakter ve yüzlerce ilişkiyi sıkıcı bir listeye boğmak yerine, d3-force ile canlı ve anlaşılır bir karakter grafı kurarken aldığım temel kararlar.',
  date: '2026-04-15',
  readTime: '10 dk',
  coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
  content: [
    {
      type: 'p',
      text: 'One Piece Hub için karakter sayfasını hazırlarken önümde net bir problem vardı: karakter çoktu, ilişkiler daha da fazlaydı. Kaptanlar, tayfa arkadaşları, rakipler, aile bağları. Bunları düz bir tabloda göstermek mümkün ama tadı yoktu. Bilgi vardı ama evren hissi yoktu.',
    },
    {
      type: 'p',
      text: 'Bu yüzden çözümü ilişki grafında aradım. Force-directed yaklaşımı burada çok doğal duruyor. Birbirine bağlı karakterler yakın duruyor, ortak bağı olanlar merkeze geliyor, alakasız gruplar kendiliğinden ayrılıyor. Yani yerleşimi tek tek elle yapmak yerine fiziğe bırakıyorsun.',
    },
    { type: 'h2', text: 'Veriyi Nasıl Düzenledim?' },
    {
      type: 'p',
      text: 'İlk düzgün karar veriyi temiz ayırmak oldu. Karakterler ayrı, ilişkiler ayrı tutulunca hem kod rahatlıyor hem de aynı veri ileride başka yerde de kullanılabiliyor. Ayrıca ilişkinin türünü ve gücünü ayrı ayrı yazmak, grafın davranışını daha anlamlı hale getiriyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `export interface CharacterNode {
  id: string
  name: string
  crew: string | null
  bounty: number | null
  avatar: string
}

export type RelationKind =
  | 'crewmate'
  | 'captain'
  | 'rival'
  | 'family'
  | 'mentor'
  | 'enemy'

export interface Relation {
  source: string
  target: string
  kind: RelationKind
  weight: number
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Her ilişki eşit değil. Ağırlık değeri eklemek, bazı bağların gerçekten daha kuvvetli görünmesini sağlıyor.',
    },
    { type: 'h2', text: 'Önce Kısa Bir Fizik Mantığı' },
    {
      type: 'p',
      text: 'd3-force kullanmadan önce ufak bir fizik denemesi yapmak çok faydalı oldu. Düğümler birbirini itiyor, bağlı olanlar birbirini çekiyor, sistem de hafifçe merkeze dönmeye çalışıyor. İçeride ne döndüğünü görünce hazır kütüphaneyi ayarlamak da kolaylaşıyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `interface Point { x: number; y: number; vx: number; vy: number }

function step(nodes: Point[], links: [number, number][], dt: number) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.01
      const force = 800 / (dist * dist)
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx -= fx; a.vy -= fy
      b.vx += fx; b.vy += fy
    }
  }
}`,
    },
    { type: 'h2', text: 'Neden d3-force Kullandım?' },
    {
      type: 'p',
      text: 'Kendi yazdığın fizik küçük örnekte öğretici ama veri büyüdükçe yorucu hale geliyor. d3-force burada hem performans hem de ayar kolaylığı açısından çok daha iyi çalıştı. Çarpışma, merkezleme ve bağlantı kuvvetlerini tek tek ayarlayabiliyorsun.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `return forceSimulation(nodes)
  .force('link',
    forceLink(links)
      .id((d) => d.id)
      .distance((d) => 120 - d.weight * 80)
      .strength((d) => d.weight),
  )
  .force('charge', forceManyBody().strength(-380))
  .force('center', forceCenter(0, 0))
  .force('collide', forceCollide(38))`,
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Simülasyonun biraz uzun sürmesi her zaman kötü değil. Yerleşim temiz oturuyorsa kullanıcı bunu doğrudan kalite olarak hissediyor.',
    },
    { type: 'h2', text: 'React ile Beraber Kullanım' },
    {
      type: 'p',
      text: 'Buradaki önemli nokta şu: her tick anında React state güncellemek istemiyorsun. Bu pahalı. Daha rahat çalışan yol, React’in kabuğu kurması ve sonra SVG öğelerini d3’ün doğrudan güncellemesi oldu.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `useEffect(() => {
  const sim = createSimulation(nodes, links)

  sim.on('tick', () => {
    for (const n of sim.nodes()) {
      const el = nodeEls.get(n.id)
      if (el) el.setAttribute('transform', \`translate(\${n.x},\${n.y})\`)
    }
  })

  return () => sim.stop()
}, [nodes, links])`,
    },
    { type: 'h2', text: 'Mobilde Aynı Şeyi Zorlamadım' },
    {
      type: 'p',
      text: 'Masaüstünde çok iyi duran ilişki grafı, mobilde aynı rahatlığı vermiyor. Düğümler sıkışıyor, sürükleme ile sayfa kaydırma birbirine giriyor. O yüzden mobilde grafı kapatıp daha okunur bir avatar düzenine geçmek daha mantıklı oldu.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Her özelliği her ekrana aynı haliyle taşımak zorunda değilsiniz. Aynı bilginin farklı cihazlarda farklı sunulması çoğu zaman daha iyi sonuç verir.',
    },
  ],
}

export default post
