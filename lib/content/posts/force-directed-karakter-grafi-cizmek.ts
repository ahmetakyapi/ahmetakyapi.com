import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'force-directed-karakter-grafi-cizmek',
    tag: 'Visualization',
    tagColor: '#ef4444',
    title: 'One Piece Hub — Büyük Bir Evreni Yansıtmak',
    excerpt:
      '66 karakter, yüzlerce ilişki. Koca bir anime evrenini tek sayfada yansıtırken d3-force ile React içinde sürüklenebilir, canlı bir karakter grafı kurmanın notları.',
    date: '2026-04-15',
    readTime: '10 dk',
    coverGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #eab308 100%)',
    content: [
      { type: 'p', text: 'One Piece Hub\'a karakter sayfası eklerken kafamdaki sorun şuydu: 66 karakter var ve aralarında yüzlerce ilişki. Kaptan-mürettebat, aile, rakip, eğitmen-öğrenci. Bunu tabloyla anlatmanın yolu yok. Denedim; satır satır "şu şunun kaptanı" yazan bir liste çıktı, okuyan kimse bir şey hissetmiyor.' },
      { type: 'p', text: 'Sonunda kullandığım çözüm force-directed graph oldu. Her karakter bir düğüm, her ilişki bir kenar. Fizik motoru düğümleri öyle yerleştiriyor ki bağlı olanlar yakın, ilgisiz olanlar uzak duruyor. Şu anki halinde Shuhen ailesi bir köşede kümelenmiş, Marine komutanları karşı köşede, iki tarafla da bağı olan karakterler tam ortada kalıyor. Elle konumlandırma yapmadım; fizik halletti.' },
      { type: 'h2', text: 'Veri Modeli: Nodes ve Edges' },
      { type: 'p', text: 'Temiz bir veri yapısıyla başlamak şart. Karakterleri ve ilişkileri ayrı tutmak, aynı veriyi ileride başka görsellerde (örneğin bir zaman çizelgesi) tekrar kullanabilmek demek.' },
      { type: 'code', lang: 'ts', text: `// data/characters.ts
export interface CharacterNode {
  id:     string
  name:   string
  crew:   string | null      // Straw Hat, Marine, Blackbeard...
  bounty: number | null      // renklendirme için
  avatar: string
}

export type RelationKind =
  | 'crewmate'      // aynı mürettebat
  | 'captain'       // kaptan-mürettebat
  | 'rival'         // rakip
  | 'family'        // aile
  | 'mentor'        // eğitmen-öğrenci
  | 'enemy'         // düşman

export interface Relation {
  source: string              // character id
  target: string
  kind:   RelationKind
  weight: number              // 0-1 arası, ilişki yoğunluğu
}` },
      { type: 'callout', variant: 'tip', text: 'İlişkiye weight eklemek, fizik motoruna hangi bağın ne kadar çekim uygulayacağını söylemek demek. Kaptan-mürettebat bağı 0.9, "bir kez savaşmış" 0.3 olunca kümelemeler anlamlı çıkıyor.' },
      { type: 'h2', text: 'Önce Fiziği Anlamak: Kendi Simülasyonum' },
      { type: 'p', text: 'd3-force\'a geçmeden önce kısa bir simülasyon yazmak mantıklıydı; içeride ne döndüğünü bilmeden hazır kütüphaneye atlamak kafamda boşluk bırakıyor. Üç kuvvet var: düğümler birbirini iter (repulsion), bağlı düğümler birbirini çeker (spring), tümü merkeze hafifçe çekilir (gravity).' },
      { type: 'code', lang: 'ts', text: `interface Point { x: number; y: number; vx: number; vy: number }

function step(nodes: Point[], links: [number, number][], dt: number) {
  // 1) Repulsion — her çift birbirini iter
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.01
      const force = 800 / (dist * dist)          // ters-kare yasası
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx -= fx; a.vy -= fy
      b.vx += fx; b.vy += fy
    }
  }

  // 2) Spring — bağlı düğümler birbirini çeker
  for (const [i, j] of links) {
    const a = nodes[i], b = nodes[j]
    const dx = b.x - a.x, dy = b.y - a.y
    const dist = Math.hypot(dx, dy) || 0.01
    const target = 80                             // ideal bağ uzunluğu
    const force = (dist - target) * 0.04
    const fx = (dx / dist) * force
    const fy = (dy / dist) * force
    a.vx += fx; a.vy += fy
    b.vx -= fx; b.vy -= fy
  }

  // 3) Gravity + damping
  for (const n of nodes) {
    n.vx -= n.x * 0.003
    n.vy -= n.y * 0.003
    n.vx *= 0.92
    n.vy *= 0.92
    n.x += n.vx * dt
    n.y += n.vy * dt
  }
}` },
      { type: 'p', text: 'Bu 25 satır 20-30 düğüme kadar idare ediyor. 60 düğümle iki iç içe döngü yüzünden repulsion O(n²) işliyor ve browser teklemeye başlıyor. d3-force tam burada işe yarıyor: içindeki quadtree ile repulsion O(n log n)\'e iniyor.' },
      { type: 'h2', text: 'd3-force ile Üretim Çözümü' },
      { type: 'code', lang: 'bash', text: `npm install d3-force` },
      { type: 'code', lang: 'ts', text: `// lib/graph/simulation.ts
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force'

interface SimNode extends CharacterNode {
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface SimLink { source: SimNode | string; target: SimNode | string; weight: number }

export function createSimulation(nodes: SimNode[], links: SimLink[]) {
  return forceSimulation(nodes)
    .force('link',
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance((d) => 120 - d.weight * 80)    // yüksek weight → daha yakın
        .strength((d) => d.weight),
    )
    .force('charge', forceManyBody().strength(-380))
    .force('center', forceCenter(0, 0))
    .force('collide', forceCollide(38))          // avatar çakışmasını önle
    .alphaDecay(0.025)                            // daha yavaş soğuma
}` },
      { type: 'callout', variant: 'info', text: 'alphaDecay\'i düşürmek simülasyonun daha uzun dönmesi demek. 0.025\'te grafın oturması 3-4 saniyeyi buluyor ama yerleşim çok daha temiz. Default 0.0228 ile arada hızlı hızlı oynayan rahatsız edici bir titreşim görüyordum.' },
      { type: 'h2', text: 'React Tarafı: Kontrolü d3\'e Bırakmak' },
      { type: 'p', text: 'React state\'ine saniyede 60 kere yazmak pahalı. Doğru yaklaşım şu: simülasyon bir ref\'te, güncelleme döngüsü d3\'ün kendi tick\'inde. React sadece ilk DOM\'u kuruyor, sonra SVG elementlerini doğrudan mutasyonla güncelliyoruz.' },
      { type: 'code', lang: 'tsx', text: `'use client'
import { useEffect, useRef } from 'react'
import { createSimulation } from '@/lib/graph/simulation'
import type { CharacterNode, Relation } from '@/data/characters'

export function CharacterGraph({ nodes, links }: { nodes: CharacterNode[]; links: Relation[] }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const nodeEls = new Map<string, SVGGElement>()
    const linkEls = new Map<string, SVGLineElement>()
    // İlk render — DOM'u kur
    // ...

    const sim = createSimulation(
      nodes.map((n) => ({ ...n })),
      links.map((l) => ({ source: l.source, target: l.target, weight: l.weight })),
    )

    sim.on('tick', () => {
      for (const n of sim.nodes()) {
        const el = nodeEls.get(n.id)
        if (el) el.setAttribute('transform', \`translate(\${n.x},\${n.y})\`)
      }
      for (const l of (sim.force('link') as any).links()) {
        const el = linkEls.get(\`\${l.source.id}->\${l.target.id}\`)
        if (el) {
          el.setAttribute('x1', l.source.x)
          el.setAttribute('y1', l.source.y)
          el.setAttribute('x2', l.target.x)
          el.setAttribute('y2', l.target.y)
        }
      }
    })

    return () => { sim.stop() }
  }, [nodes, links])

  return <svg ref={svgRef} viewBox="-400 -400 800 800" />
}` },
      { type: 'callout', variant: 'warning', text: 'setAttribute ile yapılan mutasyon React\'in virtual DOM\'una haber vermiyor — 60fps render için istediğimiz tam olarak bu. Ama aynı React ağacında state dinleyen başka bileşenler varsa bu adayı onlardan ayırmak iyi fikir.' },
      { type: 'h2', text: 'Renk: Gürültüyü Az Tutmak' },
      { type: 'p', text: 'Node\'ları mürettebat rengine göre boyamak ilk refleks ama çok gürültülü; graf bir yama bohçasına dönüyor. İki alternatif denedim: (1) node\'un dış halkası mürettebat rengi, içi sadece avatar; (2) sadece kenarların rengi ilişki tipine göre, node\'lar nötr. İkincisi çok daha sakin durdu.' },
      { type: 'code', lang: 'ts', text: `const edgeColor: Record<RelationKind, string> = {
  captain:  '#ef4444',
  crewmate: '#f59e0b',
  rival:    '#8b5cf6',
  mentor:   '#06b6d4',
  family:   '#10b981',
  enemy:    '#64748b',
}

// Kenarın opaklığı weight ile
<line
  stroke={edgeColor[relation.kind]}
  strokeWidth={1 + relation.weight * 2}
  strokeOpacity={0.25 + relation.weight * 0.45}
/>` },
      { type: 'h2', text: 'Sürükleme: Kullanıcı Keşfetsin' },
      { type: 'p', text: 'İyi bir grafın bitmeyen detayı sürüklenebilir node\'lar. Kullanıcı bir karakteri çekip bırakınca diğer herkes otomatik kaymaya başlıyor — bu his "haa, bunların hepsi birbirine bağlıymış" dedirten nokta. Buradan sonra kullanıcı grafla oynamaya başlıyor.' },
      { type: 'code', lang: 'ts', text: `function attachDrag(nodeEl: SVGGElement, node: SimNode, sim: any) {
  let dragging = false

  nodeEl.addEventListener('pointerdown', (e) => {
    dragging = true
    nodeEl.setPointerCapture(e.pointerId)
    sim.alphaTarget(0.3).restart()      // simülasyonu canlandır
    node.fx = node.x
    node.fy = node.y
  })

  nodeEl.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const rect = svgRef.current!.getBoundingClientRect()
    const scale = 800 / rect.width       // viewBox -> ekran
    node.fx = (e.clientX - rect.left) * scale - 400
    node.fy = (e.clientY - rect.top) * scale - 400
  })

  nodeEl.addEventListener('pointerup', () => {
    dragging = false
    sim.alphaTarget(0)                   // tekrar soğu
    node.fx = null                       // serbest bırak
    node.fy = null
  })
}` },
      { type: 'p', text: 'fx ve fy sabit koordinat parametreleri; fizik etkilerini bypass ediyorlar. Sürükleme boyunca değer atıyoruz, parmak kalkınca null\'a çekiyoruz. Simülasyonu alphaTarget ile yeniden ısıtmazsak "artık oturdu" modundan çıkmıyor; sürükleme hissi donuk kalıyor.' },
      { type: 'h2', text: 'Mobilde Graf Çalışmıyor' },
      { type: 'p', text: 'Mobilde 66 düğümlü graf işe yaramıyor. Ekran küçük, avatar tıklanabilirliği bozuluyor, sürükleme sayfa scroll\'ıyla çakışıyor. Mobilde grafı tamamen devre dışı bırakmak en temiz çözüm oldu. Yerine mürettebatlarına göre gruplanmış bir avatar grid\'i geliyor; tıklanan karakter aynı detay sayfasına gidiyor, bilgi kaybı yok.' },
      { type: 'code', lang: 'tsx', text: `const isTouch = typeof window !== 'undefined'
  && window.matchMedia('(pointer: coarse)').matches

return isTouch
  ? <CharacterAvatarGrid characters={nodes} />
  : <CharacterGraph nodes={nodes} links={links} />` },
      { type: 'callout', variant: 'tip', text: '"Aynı özelliği her yere koyalım" refleksi yerine "her medyaya uygun özellik" kurmak genelde daha temiz sonuç veriyor. Mobilde avatar grid, desktop\'ta graf — aynı ürünün iki doğal yüzü.' },
      { type: 'h2', text: 'Performans Detayları' },
      { type: 'ul', items: [
        'Simülasyon soğuduktan sonra tick event\'i pratikte tetiklenmiyor. Ama 0.01 alpha civarında titreşim yapabiliyor; alphaMin\'i 0.02\'ye çekince durdu.',
        'SVG yerine Canvas\'a geçmek 300+ düğümde gerekebilir. 66 için SVG yeterli; hover/click handler\'ları da daha rahat bağlanıyor.',
        'Sekme arka plana alındığında sim.stop() çağırmak pili koruyor. visibilitychange dinleyicisiyle iki satırda halledilir.',
        'd3-force\'u SSR\'a sokmak bundle\'ı şişirir. next/dynamic ile { ssr: false } verip sadece graf görünürken yükleyin.',
      ]},
      { type: 'h2', text: 'Kapanış' },
      { type: 'p', text: 'Force-directed graph ilk bakışta süs gibi duruyor ama doğru kullanıldığında güçlü bir veri sunumu aracı. Kümeleri, boşlukları, merkez-çevre ayrımını bir bakışta veriyor; tablo bunu veremiyor. One Piece Hub\'da grafla oynayan kullanıcıların sayfada kalma süresi, düz listeye göre kayda değer şekilde yüksek.' },
      { type: 'p', text: 'Grafa bakmak isteyen "Karakterler" sekmesinden desktop üstünden girebilir; kod tarafı merak ediyorsa repo açık.' },
    ],
  }

export default post
