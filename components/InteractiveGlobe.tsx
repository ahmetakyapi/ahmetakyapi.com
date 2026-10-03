'use client'

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
/** Şehir rengi bir ROL: `home` sıcak vurgu (tek nokta), geri kalanı vurgu ailesi. */
type Tone = 'primary' | 'soft' | 'warm' | 'ink'

interface City {
  name: string
  lat: number
  lng: number
  tone: Tone
  size?: number
  labelDir?: 'above' | 'below' | 'left' | 'right'
}

interface Arc {
  from: number
  to: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  tone: Tone
  size: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  life: number
  tone: Tone
}

// ─── Constants ───────────────────────────────────────────────────────────────
const AUTO_SPEED = 0.0018
const DRAG_SENSITIVITY = 0.006
const MOMENTUM_DECAY = 0.93
const RESUME_DELAY = 2000
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS

const CITIES: City[] = [
  { name: 'Istanbul',     lat: 41.01,  lng: 28.98,   tone: 'warm', size: 5.5, labelDir: 'above' },
  { name: 'New York',     lat: 40.71,  lng: -74.01,  tone: 'primary', size: 4 },
  { name: 'Tokyo',        lat: 35.68,  lng: 139.69,  tone: 'primary', size: 4 },
  { name: 'London',       lat: 51.51,  lng: -0.13,   tone: 'primary', size: 3.5 },
  { name: 'Sydney',       lat: -33.87, lng: 151.21,  tone: 'primary', size: 3.5 },
  { name: 'Singapore',    lat: 1.35,   lng: 103.82,  tone: 'primary', size: 3 },
  { name: 'Dubai',        lat: 25.20,  lng: 55.27,   tone: 'primary', size: 3.5 },
  { name: 'Mumbai',       lat: 19.07,  lng: 72.88,   tone: 'primary', size: 3 },
  { name: 'Seoul',        lat: 37.57,  lng: 126.98,  tone: 'primary', size: 3 },
  { name: 'São Paulo',    lat: -23.55, lng: -46.63,  tone: 'primary', size: 3 },
  { name: 'Mexico City',  lat: 19.43,  lng: -99.13,  tone: 'primary', size: 3 },
  { name: 'Johannesburg', lat: -26.20, lng: 28.04,   tone: 'primary', size: 3 },
  { name: 'Lagos',        lat: 6.52,   lng: 3.38,    tone: 'primary', size: 2.5 },
]

const ARCS: Arc[] = [
  { from: 0, to: 3 },   // Istanbul-London
  { from: 0, to: 1 },   // Istanbul-New York
  { from: 0, to: 6 },   // Istanbul-Dubai
  { from: 1, to: 3 },   // New York-London
  { from: 1, to: 9 },   // New York-São Paulo
  { from: 1, to: 10 },  // New York-Mexico City
  { from: 2, to: 8 },   // Tokyo-Seoul
  { from: 2, to: 4 },   // Tokyo-Sydney
  { from: 3, to: 6 },   // London-Dubai
  { from: 4, to: 5 },   // Sydney-Singapore
  { from: 5, to: 7 },   // Singapore-Mumbai
  { from: 6, to: 7 },   // Dubai-Mumbai
  { from: 11, to: 12 }, // Johannesburg-Lagos
]

const STAR_COUNT = 80

/** Küre yarıçapı / tuval kenarı. Halkalar kalkınca küre boşalan payı aldı. */
const RADIUS_RATIO = 0.42

/**
 * Yay geometrisi bir kere hesaplanıyor.
 *
 * Her karede 13 yay × 41 nokta = 533 slerp çağrısı yapılıyordu; her biri
 * acos dahil ~15 trigonometrik işlem, yani kare başına ~8000 işlem. Oysa
 * iki şehir arasındaki büyük daire yolu hiç değişmiyor: değişen tek şey
 * kürenin dönüş açısı.
 *
 * Burada noktanın küre üstündeki sabit yeri saklanıyor. Dönüş, açı toplama
 * formülüyle uygulanıyor:
 *   cos(θ₀ + rotY) = cosθ₀·cos(rotY) − sinθ₀·sin(rotY)
 * cos(rotY) ve sin(rotY) kare başına bir kez hesaplandığı için nokta başına
 * hiç trigonometri kalmıyor.
 */
const ARC_STEPS = 41

type ArcPointGeometry = {
  sinPhi: number
  cosPhi: number
  cosT0: number
  sinT0: number
  /** Yarıçap çarpanı: yayın ortası küreden hafifçe yükseliyor. */
  rFactor: number
}

const ARC_GEOMETRY: ArcPointGeometry[][] = ARCS.map((arc) => {
  const a = CITIES[arc.from]
  const b = CITIES[arc.to]

  return Array.from({ length: ARC_STEPS }, (_, i) => {
    const st = i / (ARC_STEPS - 1)
    const [lat, lng] = slerp(a.lat, a.lng, b.lat, b.lng, st)
    const phi = toRad(90 - lat)
    const theta0 = toRad(lng)

    return {
      sinPhi: Math.sin(phi),
      cosPhi: Math.cos(phi),
      cosT0: Math.cos(theta0),
      sinT0: Math.sin(theta0),
      rFactor: 1 + Math.sin(st * Math.PI) * 0.09,
    }
  })
})

/** Kare başına yeniden ayrılmasın diye tek sefer ayrılan ekran tamponu. */
const ARC_SCREEN: { x: number; y: number; z: number }[][] = ARC_GEOMETRY.map((points) =>
  points.map(() => ({ x: 0, y: 0, z: 0 })),
)

// ─── Renk: token'dan ─────────────────────────────────────────────────────────
/**
 * Küre renkleri SABİT DEĞİL, temadan okunuyor (app/globals.css). Eskiden
 * mor-cyan sabit bir palet ve koyu bir çekirdek vardı: açık temada beyaz
 * sayfanın ortasında gece mavisi bir top duruyordu.
 *
 * Canvas CSS değişkeni okuyamaz; değer bir yoklama öğesine `color` olarak
 * verilip hesaplanmış `rgb()` hâli alınıyor (değişken başka bir değişkene
 * başvursa da çözülmüş gelir). Tema değişimi `<html data-theme>` üzerinden
 * MutationObserver ile izleniyor.
 */
type Rgb = readonly [number, number, number]
type GlobePalette = Record<Tone | 'ground' | 'muted' | 'label', Rgb>

const TOKEN: Record<keyof GlobePalette, string> = {
  primary: '--primary',
  soft: '--primary-soft',
  warm: '--accent-warm',
  ink: '--text-strong',
  ground: '--page-bg',
  muted: '--text-muted',
  label: '--page-bg',
}

const FALLBACK: Rgb = [53, 184, 255]

function readPalette(): GlobePalette {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const out = {} as Record<keyof GlobePalette, Rgb>
  for (const key of Object.keys(TOKEN) as (keyof GlobePalette)[]) {
    probe.style.color = `var(${TOKEN[key]})`
    const nums = getComputedStyle(probe).color.match(/[\d.]+/g)
    out[key] = nums && nums.length >= 3 ? [Number(nums[0]), Number(nums[1]), Number(nums[2])] : FALLBACK
  }
  probe.remove()
  return out
}

function rgba(c: Rgb, a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`
}

/** `base` üstüne `amount` oranında `tint`: OPAK sonuç. Degrade durağı için. */
function mix(base: Rgb, tint: Rgb, amount: number) {
  const m = (i: 0 | 1 | 2) => Math.round(base[i] + (tint[i] - base[i]) * amount)
  return `rgb(${m(0)},${m(1)},${m(2)})`
}

const BURST_TONES: Tone[] = ['primary', 'soft', 'ink', 'primary', 'soft', 'warm']

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function project(
  lat: number,
  lng: number,
  rotY: number,
  cosRx: number,
  sinRx: number,
  radius: number,
  center: number,
) {
  const phi = toRad(90 - lat)
  const theta = toRad(lng) + rotY

  const x = radius * Math.sin(phi) * Math.cos(theta)
  let y = radius * Math.cos(phi)
  const z0 = radius * Math.sin(phi) * Math.sin(theta)

  const y2 = y * cosRx - z0 * sinRx
  const z = y * sinRx + z0 * cosRx
  y = y2

  return { x: center + x, y: center - y, z }
}

function slerp(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  t: number,
): [number, number] {
  const p1 = toRad(90 - lat1), t1 = toRad(lng1)
  const p2 = toRad(90 - lat2), t2 = toRad(lng2)

  const x1 = Math.sin(p1) * Math.cos(t1)
  const y1 = Math.cos(p1)
  const z1 = Math.sin(p1) * Math.sin(t1)
  const x2 = Math.sin(p2) * Math.cos(t2)
  const y2 = Math.cos(p2)
  const z2 = Math.sin(p2) * Math.sin(t2)

  const dot = Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2))
  const omega = Math.acos(dot)

  if (omega < 0.001) {
    return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]
  }

  const sinO = Math.sin(omega)
  const a = Math.sin((1 - t) * omega) / sinO
  const b = Math.sin(t * omega) / sinO

  const x = a * x1 + b * x2
  const y = a * y1 + b * y2
  const z = a * z1 + b * z2

  const norm = Math.sqrt(x * x + y * y + z * z)
  return [
    90 - (Math.acos(y / norm) * 180) / Math.PI,
    (Math.atan2(z, x) * 180) / Math.PI,
  ]
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  /* Baslangic 480 idi: mobilde once 480px cizilip sonra ~310'a
     dusuyordu, yani her yuklemede gorunur bir sicrama vardi.
     Artik olculene kadar 0; kap kare oranini kendisi tutuyor. */
  const [size, setSize] = useState(0)
  /* Tema değişince artan sayaç: hareket kapalıyken tek kareyi yeniden çizdirir. */
  const [paletteVersion, setPaletteVersion] = useState(0)
  const paletteRef = useRef<GlobePalette | null>(null)
  const fontRef = useRef('sans-serif')
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Responsive size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      // Tavan 480'di; 2xl ekranlarda kap 620'ye çıkıyor, küre onu doldursun.
      setSize(Math.min(620, Math.max(240, w)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const stateRef = useRef({
    rotY: 0.5,
    rotX: 0.15,
    velY: 0,
    velX: 0,
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    autoRotate: true,
    resumeTimer: 0 as ReturnType<typeof setTimeout> | 0,
    particles: [] as Particle[],
    ripples: [] as Ripple[],
    time: 0,
    stars: [] as { lat: number; lng: number; brightness: number }[],
    // Rastgele fazlar çizimden önce, efektte atanıyor (render saf kalsın).
    packetPhases: ARCS.map(() => 0),
    lastFrameTime: 0,
  })

  /* Ekranda degilken cizmenin anlami yok: kure sayfanin ustunde ama
     kullanici asagi kaydirinca hala 30 FPS harciyordu. */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(q.matches)
    apply()
    q.addEventListener('change', apply)
    return () => q.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const s = stateRef.current
    s.packetPhases = ARCS.map(() => Math.random())
    s.stars = Array.from({ length: STAR_COUNT }, () => ({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      brightness: 0.3 + Math.random() * 0.7,
    }))
  }, [])

  /* Renkler temadan; tema değişince yeniden okunur. */
  useEffect(() => {
    const apply = () => {
      paletteRef.current = readPalette()
      fontRef.current = getComputedStyle(document.body).fontFamily || 'sans-serif'
      setPaletteVersion((v) => v + 1)
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  // ─── Drawing ─────────────────────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D, sz: number) => {
    const s = stateRef.current
    const pal = paletteRef.current
    if (!pal) return
    const tone = (t: Tone) => pal[t]
    const t = s.time
    const CENTER = sz / 2
    const RADIUS = sz * RADIUS_RATIO

    const cosRx = Math.cos(s.rotX)
    const sinRx = Math.sin(s.rotX)
    /* Dönüş açısının sinüs/kosinüsü kare başına bir kez: yay noktaları
       bunları açı toplama formülüyle kullanıyor. */
    const cosRotY = Math.cos(s.rotY)
    const sinRotY = Math.sin(s.rotY)

    ctx.clearRect(0, 0, sz, sz)

    /* Yörünge halkaları ve dönen yay parçaları KALDIRILDI. Koyu temada
       kürenin çevresinde üç eş merkezli çizgi + sekiz parça "halka" gibi
       okunuyordu: küre bir nişan tahtasına dönüyordu ve göz önce halkaya,
       sonra küreye gidiyordu. Derinliği artık yalnız ince atmosfer veriyor. */

    // ── Atmosphere glow ──
    const atmosGrad = ctx.createRadialGradient(CENTER, CENTER, RADIUS - 4, CENTER, CENTER, RADIUS + sz * 0.05)
    atmosGrad.addColorStop(0, rgba(pal.primary, 0))
    atmosGrad.addColorStop(0.3, rgba(pal.primary, 0.07))
    atmosGrad.addColorStop(0.7, rgba(pal.soft, 0.025))
    atmosGrad.addColorStop(1, rgba(pal.primary, 0))
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS + sz * 0.05, 0, Math.PI * 2)
    ctx.fillStyle = atmosGrad
    ctx.fill()

    // ── Sphere core ──
    const coreGrad = ctx.createRadialGradient(
      CENTER - RADIUS * 0.3, CENTER - RADIUS * 0.3, 0,
      CENTER, CENTER, RADIUS,
    )
    /* Çekirdek sayfa zemininden, vurgu tonuna doğru hafifçe. Duraklar OPAK
       ve önceden karıştırılmış: önceki hâli yarı saydam maviden opak zemine
       gidiyordu; canvas rengi ve saydamlığı ayrı ayrı ara değerlediği için
       aradaki bantta mavi yüksek opaklıkla birleşip koyu temada parlak bir
       simit, açıkta beyaz bir leke çiziyordu (3 Ekim 2026, ekranda görüldü). */
    coreGrad.addColorStop(0, mix(pal.ground, pal.primary, 0.1))
    coreGrad.addColorStop(0.55, mix(pal.ground, pal.primary, 0.05))
    coreGrad.addColorStop(1, mix(pal.ground, pal.primary, 0))
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = coreGrad
    ctx.fill()

    // Sphere specular highlight
    const specGrad = ctx.createRadialGradient(
      CENTER - RADIUS * 0.38, CENTER - RADIUS * 0.38, 0,
      CENTER - RADIUS * 0.2, CENTER - RADIUS * 0.2, RADIUS * 0.65,
    )
    specGrad.addColorStop(0, rgba(pal.ink, 0.04))
    specGrad.addColorStop(1, rgba(pal.ink, 0))
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = specGrad
    ctx.fill()

    // ── Sphere border ──
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(pal.primary, 0.24)
    ctx.lineWidth = 1
    ctx.stroke()

    // ── Clip to sphere ──
    ctx.save()
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.clip()

    // ── Grid lines (latitude) ──
    for (let lat = -80; lat <= 80; lat += 20) {
      const isEquator = lat === 0
      ctx.beginPath()
      let started = false
      for (let lng = -180; lng <= 180; lng += 4) {
        const p = project(lat, lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
        if (p.z > 0) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true }
          else ctx.lineTo(p.x, p.y)
        } else { started = false }
      }
      ctx.strokeStyle = rgba(pal.primary, isEquator ? 0.28 : 0.1)
      ctx.lineWidth = isEquator ? 1 : 0.5
      ctx.stroke()
    }

    // ── Grid lines (longitude) ──
    for (let lng = -180; lng < 180; lng += 20) {
      const sampleP = project(0, lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
      const facing = Math.max(0, sampleP.z / RADIUS)
      if (facing < 0.04) continue

      ctx.beginPath()
      let started = false
      for (let lat = -90; lat <= 90; lat += 4) {
        const p = project(lat, lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
        if (p.z > 0) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true }
          else ctx.lineTo(p.x, p.y)
        } else { started = false }
      }
      ctx.strokeStyle = rgba(pal.primary, 0.05 + facing * 0.13)
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    ctx.restore()

    // ── Stars on sphere surface ──
    for (const star of s.stars) {
      const p = project(star.lat, star.lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
      if (p.z > RADIUS * 0.08) {
        const alpha = (p.z / RADIUS) * star.brightness * (0.6 + Math.sin(t * 2.2 + star.lat) * 0.4)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.7, 0, Math.PI * 2)
        ctx.fillStyle = rgba(pal.ink, alpha * 0.45)
        ctx.fill()
      }
    }

    // ── Arcs ──
    for (let ai = 0; ai < ARCS.length; ai++) {
      const arc = ARCS[ai]
      const cityA = CITIES[arc.from]

      ctx.beginPath()
      let arcStarted = false
      const geometry = ARC_GEOMETRY[ai]
      const arcPoints = ARC_SCREEN[ai]

      for (let i = 0; i < geometry.length; i++) {
        const g = geometry[i]
        // Açı toplama: nokta başına tek bir trigonometri bile yok.
        const cosT = g.cosT0 * cosRotY - g.sinT0 * sinRotY
        const sinT = g.sinT0 * cosRotY + g.cosT0 * sinRotY
        const r = RADIUS * g.rFactor

        const x = r * g.sinPhi * cosT
        const yBase = r * g.cosPhi
        const zBase = r * g.sinPhi * sinT
        const y = yBase * cosRx - zBase * sinRx
        const z = yBase * sinRx + zBase * cosRx

        const px = CENTER + x
        const py = CENTER - y

        const slot = arcPoints[i]
        slot.x = px
        slot.y = py
        slot.z = z

        if (z > 0) {
          if (!arcStarted) { ctx.moveTo(px, py); arcStarted = true }
          else ctx.lineTo(px, py)
        } else { arcStarted = false }
      }
      ctx.strokeStyle = rgba(tone(cityA.tone), 0.17)
      ctx.lineWidth = 1
      ctx.stroke()

      // Data packet
      s.packetPhases[ai] = (s.packetPhases[ai] + 0.005) % 1
      const phase = s.packetPhases[ai]

      for (let ti = 0; ti < 7; ti++) {
        const tp = phase - ti * 0.022
        if (tp < 0 || tp > 1) continue
        const idx = Math.floor(tp * (arcPoints.length - 1))
        if (idx < 0 || idx >= arcPoints.length) continue
        const pt = arcPoints[idx]
        if (pt.z <= 0) continue
        const alpha = (1 - ti / 7) * 0.85
        const sz2 = ti === 0 ? 2.2 : 1.4 - ti * 0.1
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, Math.max(0.4, sz2), 0, Math.PI * 2)
        ctx.fillStyle = rgba(tone(cityA.tone), ti === 0 ? 1 : alpha * 0.86)
        ctx.fill()
      }
    }

    // ── Cities ──
    const labelSize = Math.max(8, sz * 0.021)
    for (const city of CITIES) {
      const p = project(city.lat, city.lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
      const visibility = p.z / RADIUS
      if (visibility <= 0) continue

      const alpha = Math.min(1, visibility * 1.6)
      const dotR = (city.size ?? 3) * (sz / 480)

      // Outer halo
      const haloR = dotR * 5
      const haloGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR)
      haloGrad.addColorStop(0, rgba(tone(city.tone), 0.31))
      haloGrad.addColorStop(1, rgba(tone(city.tone), 0))
      ctx.beginPath()
      ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2)
      ctx.fillStyle = haloGrad
      ctx.globalAlpha = alpha
      ctx.fill()

      // Pulsing rings
      for (let ri = 0; ri < 2; ri++) {
        const pulse = (Math.sin(t * 2.8 + city.lat * 0.1 + ri * Math.PI) + 1) / 2
        const ringR = dotR + pulse * dotR * 2.5 + ri * dotR * 1.2
        ctx.beginPath()
        ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(tone(city.tone), (0.35 - pulse * 0.2) * alpha)
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Center dot
      ctx.beginPath()
      ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2)
      ctx.fillStyle = rgba(tone(city.tone), 1)
      ctx.fill()

      // White inner
      ctx.beginPath()
      ctx.arc(p.x, p.y, dotR * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = rgba(pal.ground, 1)
      ctx.fill()

      // Label
      if (visibility > 0.3 && sz >= 240) {
        const labelAlpha = Math.min(1, (visibility - 0.3) * 3.5)
        ctx.globalAlpha = labelAlpha * alpha

        const text = city.name
        ctx.font = `600 ${labelSize}px ${fontRef.current}`
        const tw = ctx.measureText(text).width
        const pw = tw + 10
        const ph = labelSize * 1.9
        const dir = city.labelDir ?? 'above'
        const gap = dotR * 2.8
        let lx: number
        if (dir === 'left') { lx = p.x - pw - gap }
        else if (dir === 'right') { lx = p.x + gap }
        else { lx = p.x - pw / 2 }
        let ly: number
        if (dir === 'below') { ly = p.y + gap }
        else if (dir === 'above') { ly = p.y - gap - ph }
        else { ly = p.y - ph / 2 }

        // Pill bg
        const pillR = ph / 2
        ctx.beginPath()
        ctx.moveTo(lx + pillR, ly)
        ctx.lineTo(lx + pw - pillR, ly)
        ctx.arc(lx + pw - pillR, ly + pillR, pillR, -Math.PI / 2, Math.PI / 2)
        ctx.lineTo(lx + pillR, ly + ph)
        ctx.arc(lx + pillR, ly + pillR, pillR, Math.PI / 2, -Math.PI / 2)
        ctx.closePath()
        ctx.fillStyle = rgba(pal.label, 0.9)
        ctx.fill()
        ctx.strokeStyle = rgba(tone(city.tone), 0.33)
        ctx.lineWidth = 0.7
        ctx.stroke()

        ctx.fillStyle = rgba(pal.ink, 1)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, p.x, ly + ph / 2)
      }

      ctx.globalAlpha = 1
    }

    // ── Particles ──
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.97
      p.vy *= 0.97
      p.life -= 1
      if (p.life <= 0) { s.particles.splice(i, 1); continue }

      const pAlpha = p.life / p.maxLife
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * pAlpha, 0, Math.PI * 2)
      ctx.fillStyle = rgba(tone(p.tone), pAlpha * 0.82)
      ctx.fill()
    }

    // ── Ripples ──
    for (let i = s.ripples.length - 1; i >= 0; i--) {
      const r = s.ripples[i]
      r.radius += 2.8
      r.life -= 1
      if (r.life <= 0 || r.radius > r.maxRadius) { s.ripples.splice(i, 1); continue }

      const rAlpha = r.life / 55
      ctx.beginPath()
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx.strokeStyle = rgba(tone(r.tone), rAlpha * 0.75)
      ctx.lineWidth = 1.8
      ctx.stroke()
    }
  }, [])

  // ─── Canvas setup & animation loop ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size === 0) return

    /* dpr 2'de 480px'lik küre 960×960 = 921k piksel demek ve bu her
       karede yeniden çiziliyor. 1.25'te kenarlar hâlâ yumuşak ama
       piksel işi ~%60 azalıyor. */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    let raf: number

    function loop(timestamp: number) {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return

      const elapsed = timestamp - stateRef.current.lastFrameTime
      if (elapsed < FRAME_INTERVAL) return
      stateRef.current.lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL)

      const s = stateRef.current
      s.time += 0.016 * (elapsed / FRAME_INTERVAL)

      if (s.autoRotate && !s.isDragging) s.rotY += AUTO_SPEED

      if (!s.isDragging) {
        s.rotY += s.velY
        s.rotX += s.velX
        s.velY *= MOMENTUM_DECAY
        s.velX *= MOMENTUM_DECAY
      }

      s.rotX = Math.max(-1.1, Math.min(1.1, s.rotX))

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx!, size)
    }

    if (reducedMotion) {
      // Hareket yok ama kure de bos kalmasin: tek kare cizilir.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, size)
      return
    }

    if (!visible) return

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw, size, visible, reducedMotion, paletteVersion])

  // ─── Pointer handlers ────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: PointerEvent) => {
    const s = stateRef.current
    s.isDragging = true
    s.autoRotate = false
    s.lastMouse = { x: e.clientX, y: e.clientY }
    s.velY = 0
    s.velX = 0
    if (s.resumeTimer) clearTimeout(s.resumeTimer)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const s = stateRef.current
    if (!s.isDragging) return
    /* Yalnızca YATAY sürükleme: dikey hareket sayfanın kaydırmasına ait
       (`touch-action: pan-y`). Eskiden `touch-action: none` vardı ve
       telefonda kürenin üstünden sayfa kaydırılamıyordu. */
    const dx = e.clientX - s.lastMouse.x
    s.velY = dx * DRAG_SENSITIVITY
    s.velX = 0
    s.rotY += s.velY
    s.lastMouse = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerUp = useCallback(() => {
    const s = stateRef.current
    s.isDragging = false
    s.resumeTimer = setTimeout(() => { s.autoRotate = true }, RESUME_DELAY)
  }, [])

  // ─── Click burst effect ──────────────────────────────────────────────────
  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const s = stateRef.current
    const CENTER = size / 2
    const RADIUS = size * RADIUS_RATIO

    const dist = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2)
    if (dist > RADIUS + 40) return

    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100 + Math.random() * 0.25
      const speed = 1.2 + Math.random() * 4.5
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 45 + Math.random() * 35,
        maxLife: 80,
        tone: BURST_TONES[Math.floor(Math.random() * BURST_TONES.length)],
        size: 1.5 + Math.random() * 2.8,
      })
    }

    for (let i = 0; i < 4; i++) {
      s.ripples.push({
        x, y,
        radius: 0,
        maxRadius: 70 + i * 28,
        life: 55 + i * 8,
        tone: i % 2 === 0 ? 'primary' : 'soft',
      })
    }
  }, [size])

  return (
    <div ref={containerRef} className="relative flex w-full flex-col items-center">
      <div className="relative aspect-square w-full max-w-[620px]">
        {/* Süs: etkileşimi (sürükle, tıkla) bilgi taşımıyor, klavye ve ekran
            okuyucu için karşılığı gerekmiyor. Eskiden `role="img"` taşıyordu
            ama işaretçi olaylarına açıktı; ikisi birden çelişkiliydi. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="relative z-10 mx-auto"
          style={{
            width: size,
            height: size,
            cursor: 'grab',
            touchAction: 'pan-y',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={handleClick}
          onGotPointerCapture={() => { if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing' }}
          onLostPointerCapture={() => { if (canvasRef.current) canvasRef.current.style.cursor = 'grab' }}
        />
      </div>
      <p className="mt-3 select-none font-mono text-micro text-muted" aria-hidden="true">
        Döndürmek için yana sürükle · Efekt için tıkla
      </p>
    </div>
  )
}
