'use client'

import { useEffect, useRef } from 'react'

/**
 * Hero'nun sağ yarısı: sitenin ilk sürümündeki etkileşimli küre, geri döndü.
 *
 * Geçmişi: ilk sürümde (8c6e2e8) şehirler, aralarında veri paketi akan
 * yaylar, nabız halkaları ve tıklayınca saçılan kıvılcımlarla mor/camgöbeği
 * bir küreydi. Yeniden tasarımda önce sadeleşip ismin ARKASINA geçti, orada
 * anlamsız bir harita gibi okundu ve kaldırıldı. 3 Ekim 2026'da sahibi
 * "Gece Mavisi" yönünü seçerken sağ yarıya Açılış Zili ekranı yerine
 * "eski tarzda" bu küreyi istedi: hero tek bir projeyi öne çıkarmamalı.
 *
 * Yapı ilk sürümle aynı; değişenler:
 *   - Renkler token'dan (`--globe-*`, globals.css), mor yok. Şehirler
 *     markanın mavi ailesinde, İstanbul sıcak vurguyla (`--accent-warm`).
 *   - Şehir adları Türkçe, etiket fontu sitenin fontu.
 *   - Dokunmatikte dikey kaydırma küreye takılmaz (`touch-action: pan-y`);
 *     ilk sürümde `none` idi ve küreye denk gelen parmak sayfayı
 *     kaydıramıyordu.
 *   - React durumu yok: boyut, görünürlük ve hareket tercihi tek efektte,
 *     her kare doğrudan tuvale.
 *
 * Bütçe: 60 kare/sn, DPR en çok 2; ekrandan çıkınca ve sekme gizliyken
 * durur. Yay geometrisi bir kez hesaplanır (aşağıda). Hareketi azaltan
 * okuyucuya tek kare, kıvılcım yok.
 */

type Rgb = readonly [number, number, number]

type City = {
  name: string
  lat: number
  lng: number
  /** Renk sırası: 0 sıcak vurgu (ev), 1-4 mavi ailesi. */
  tone: 0 | 1 | 2 | 3 | 4
  size?: number
  labelDir?: 'above' | 'below' | 'left' | 'right'
}

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; tone: number; size: number }
type Ripple = { x: number; y: number; radius: number; maxRadius: number; life: number; tone: number }

/*
 * Küre YALNIZ basılı tutup sürükleyince döner (3 Ekim 2026 gecesi, sahibinin
 * isteği). Kendiliğinden dönüş, bırakınca süren atalet ve eğimin geri
 * dönmesi kaldırıldı: bıraktığın yerde durur. Sahne yine canlı; yaylarda
 * paketler akar, şehirler nabız gibi atar. Kare hızı 60, adımlar süreye
 * bağlı (ilk sürüm 30 kare/sn'de kare başına sabit adım atıyordu).
 */
/** Sürüklemede piksel başına dönüş (radyan). */
const DRAG_SENSITIVITY = 0.0062
/** Eğimin başlangıç açısı. */
const REST_TILT = 0.15
/** Bu kadar pikselden kısa hareket "dokunma" sayılır: kıvılcım çıkar. */
const TAP_SLOP = 6
/** Dokunmatikte yön kararı için gereken hareket (piksel). */
const LOCK_SLOP = 8
/** Sahne saati, saniyede bu kadar ilerler (nabız ve titreşim hızları buna göre). */
const TIME_RATE = 0.48
/** Kıvılcım ve dalga adımları ilk sürümde 30 kare/sn'lik karelerdi. */
const LEGACY_FRAME_MS = 1000 / 30
const TARGET_FPS = 60
const FRAME_INTERVAL = 1000 / TARGET_FPS
/** Sekme uzun süre arkada kaldıysa tek karede zıplamasın. */
const MAX_STEP_MS = 64
const MAX_DPR = 2
const MIN_SIZE = 240
const MAX_SIZE = 560
const RADIUS_RATIO = 0.375
const ROT_X_LIMIT = 1.1
const STAR_COUNT = 140
const BURST_COUNT = 100
const RIPPLE_COUNT = 4
/** Kıvılcım ancak kürenin bu kadar dışına kadar tetiklenir (CSS piksel). */
const BURST_REACH = 40

const CITIES: City[] = [
  { name: 'İstanbul', lat: 41.01, lng: 28.98, tone: 0, size: 5.5, labelDir: 'above' },
  { name: 'New York', lat: 40.71, lng: -74.01, tone: 1, size: 4 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69, tone: 2, size: 4 },
  { name: 'Londra', lat: 51.51, lng: -0.13, tone: 3, size: 3.5 },
  { name: 'Sidney', lat: -33.87, lng: 151.21, tone: 4, size: 3.5 },
  { name: 'Singapur', lat: 1.35, lng: 103.82, tone: 3, size: 3 },
  { name: 'Dubai', lat: 25.2, lng: 55.27, tone: 1, size: 3.5 },
  { name: 'Mumbai', lat: 19.07, lng: 72.88, tone: 2, size: 3 },
  { name: 'Seul', lat: 37.57, lng: 126.98, tone: 4, size: 3 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63, tone: 2, size: 3 },
  { name: 'Meksiko', lat: 19.43, lng: -99.13, tone: 4, size: 3 },
  { name: 'Johannesburg', lat: -26.2, lng: 28.04, tone: 1, size: 3 },
  { name: 'Lagos', lat: 6.52, lng: 3.38, tone: 3, size: 2.5 },
]

const ARCS = [
  { from: 0, to: 3 }, // İstanbul-Londra
  { from: 0, to: 1 }, // İstanbul-New York
  { from: 0, to: 6 }, // İstanbul-Dubai
  { from: 1, to: 3 }, // New York-Londra
  { from: 1, to: 9 }, // New York-São Paulo
  { from: 1, to: 10 }, // New York-Meksiko
  { from: 2, to: 8 }, // Tokyo-Seul
  { from: 2, to: 4 }, // Tokyo-Sidney
  { from: 3, to: 6 }, // Londra-Dubai
  { from: 4, to: 5 }, // Sidney-Singapur
  { from: 5, to: 7 }, // Singapur-Mumbai
  { from: 6, to: 7 }, // Dubai-Mumbai
  { from: 11, to: 12 }, // Johannesburg-Lagos
] as const

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function slerp(lat1: number, lng1: number, lat2: number, lng2: number, t: number): [number, number] {
  const p1 = toRad(90 - lat1)
  const t1 = toRad(lng1)
  const p2 = toRad(90 - lat2)
  const t2 = toRad(lng2)
  const x1 = Math.sin(p1) * Math.cos(t1)
  const y1 = Math.cos(p1)
  const z1 = Math.sin(p1) * Math.sin(t1)
  const x2 = Math.sin(p2) * Math.cos(t2)
  const y2 = Math.cos(p2)
  const z2 = Math.sin(p2) * Math.sin(t2)
  const omega = Math.acos(Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2)))
  if (omega < 0.001) return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]
  const sinO = Math.sin(omega)
  const a = Math.sin((1 - t) * omega) / sinO
  const b = Math.sin(t * omega) / sinO
  const x = a * x1 + b * x2
  const y = a * y1 + b * y2
  const z = a * z1 + b * z2
  const norm = Math.sqrt(x * x + y * y + z * z)
  return [90 - (Math.acos(y / norm) * 180) / Math.PI, (Math.atan2(z, x) * 180) / Math.PI]
}

/**
 * Yay geometrisi bir kez hesaplanıyor: iki şehir arasındaki büyük daire
 * yolu hiç değişmiyor, değişen yalnız dönüş açısı. Dönüş açı toplama
 * formülüyle uygulanıyor; nokta başına trigonometri kalmıyor.
 */
const ARC_STEPS = 41
/** Yayın ortası küreden bu oranda yükselir. */
const ARC_LIFT = 0.09
const ARC_GEOMETRY = ARCS.map((arc) => {
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
      rFactor: 1 + Math.sin(st * Math.PI) * ARC_LIFT,
    }
  })
})
const ARC_SCREEN = ARC_GEOMETRY.map((points) => points.map(() => ({ x: 0, y: 0, z: 0 })))
/** Paketlerin yay üstündeki hızı, tur/ms. */
const PACKET_SPEED = 0.00015
const PACKET_TAIL = 7

function project(lat: number, lng: number, rotY: number, cosRx: number, sinRx: number, radius: number, center: number) {
  const phi = toRad(90 - lat)
  const theta = toRad(lng) + rotY
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z0 = radius * Math.sin(phi) * Math.sin(theta)
  return { x: center + x, y: center - (y * cosRx - z0 * sinRx), z: y * sinRx + z0 * cosRx }
}

type Palette = {
  tones: Rgb[]
  grid: Rgb
  ring: Rgb
  core: [Rgb, Rgb, Rgb]
  star: Rgb
  labelBg: Rgb
  labelInk: Rgb
  font: string
}

function readPalette(): Palette {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const read = (token: string): Rgb => {
    probe.style.color = `var(${token})`
    const nums = getComputedStyle(probe).color.match(/[\d.]+/g)
    return nums && nums.length >= 3 ? [Number(nums[0]), Number(nums[1]), Number(nums[2])] : [128, 160, 200]
  }
  const palette: Palette = {
    tones: [read('--accent-warm'), read('--globe-c1'), read('--globe-c2'), read('--globe-c3'), read('--globe-c4')],
    grid: read('--globe-grid'),
    ring: read('--globe-ring'),
    core: [read('--globe-core-1'), read('--globe-core-2'), read('--globe-core-3')],
    star: read('--globe-star'),
    labelBg: read('--globe-label-bg'),
    labelInk: read('--globe-label-ink'),
    font: getComputedStyle(document.body).fontFamily,
  }
  probe.remove()
  return palette
}

const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`

export default function HeroGlobe() {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!box || !canvas || !ctx) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let palette = readPalette()
    let size = 0
    let dpr = 1
    let visible = false
    let raf = 0
    let lastFrame = 0
    
    const s = {
      rotY: 0.5,
      rotX: REST_TILT,
      dragging: false,
      /** Dokunmatikte yön kilidi: karar yok, yatay (küre), dikey (sayfa). */
      lock: 'none' as 'none' | 'x' | 'y',
      touch: false,
      /** Basılı bir işaretçi var mı: yalnız basılıyken döner. */
      pressed: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      moved: false,
      time: 0,
      particles: [] as Particle[],
      ripples: [] as Ripple[],
      stars: Array.from({ length: STAR_COUNT }, () => ({
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        brightness: 0.3 + Math.random() * 0.7,
      })),
      packets: ARCS.map(() => Math.random()),
      /** Son karenin süresi (ms); kare başına adımlar bununla ölçeklenir. */
      step: FRAME_INTERVAL,
    }

    const draw = () => {
      if (!size) return
      const sz = size
      const t = s.time
      const CENTER = sz / 2
      const RADIUS = sz * RADIUS_RATIO
      const cosRx = Math.cos(s.rotX)
      const sinRx = Math.sin(s.rotX)
      const cosRotY = Math.cos(s.rotY)
      const sinRotY = Math.sin(s.rotY)
      const tone = (i: number) => palette.tones[i] ?? palette.tones[1]

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, sz, sz)

      // Dış halkalar: nabız gibi genişleyip daralır.
      const ringTones = [palette.ring, tone(1), palette.ring]
      for (let i = 0; i < 3; i++) {
        const pulse = Math.sin(t * 1.2 + i * 2.1) * 0.5 + 0.5
        const ringR = RADIUS + sz * 0.05 + i * sz * 0.03 + pulse * sz * 0.012
        ctx.beginPath()
        ctx.arc(CENTER, CENTER, ringR, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(ringTones[i], 0.1 + pulse * 0.07)
        ctx.lineWidth = i === 1 ? 1.5 : 1
        ctx.stroke()
      }

      // En dış halkada dönen yay parçaları.
      const outerR = RADIUS + sz * 0.11
      for (let seg = 0; seg < 8; seg++) {
        const startA = (seg / 8) * Math.PI * 2 + t * 0.15
        const len = 0.18 + Math.sin(t * 0.8 + seg) * 0.05
        ctx.beginPath()
        ctx.arc(CENTER, CENTER, outerR, startA, startA + len)
        ctx.strokeStyle = rgba(tone(1), 0.25 + Math.sin(t * 1.2 + seg * 0.7) * 0.1)
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Atmosfer.
      const atmos = ctx.createRadialGradient(CENTER, CENTER, RADIUS - 4, CENTER, CENTER, RADIUS + sz * 0.08)
      atmos.addColorStop(0, rgba(palette.ring, 0))
      atmos.addColorStop(0.35, rgba(palette.ring, 0.14))
      atmos.addColorStop(0.65, rgba(tone(1), 0.07))
      atmos.addColorStop(1, rgba(palette.ring, 0))
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, RADIUS + sz * 0.08, 0, Math.PI * 2)
      ctx.fillStyle = atmos
      ctx.fill()

      // Çekirdek: sol üstten ışık alan koyu lacivert küre.
      const core = ctx.createRadialGradient(CENTER - RADIUS * 0.3, CENTER - RADIUS * 0.3, 0, CENTER, CENTER, RADIUS)
      core.addColorStop(0, rgba(palette.core[0], 1))
      core.addColorStop(0.55, rgba(palette.core[1], 1))
      core.addColorStop(1, rgba(palette.core[2], 1))
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = core
      ctx.fill()

      const spec = ctx.createRadialGradient(
        CENTER - RADIUS * 0.38,
        CENTER - RADIUS * 0.38,
        0,
        CENTER - RADIUS * 0.2,
        CENTER - RADIUS * 0.2,
        RADIUS * 0.65,
      )
      spec.addColorStop(0, rgba(palette.star, 0.05))
      spec.addColorStop(1, rgba(palette.star, 0))
      ctx.fillStyle = spec
      ctx.fill()

      ctx.beginPath()
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
      ctx.strokeStyle = rgba(palette.ring, 0.55)
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Izgara, kürenin içine kırpılmış.
      ctx.save()
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
      ctx.clip()

      for (let lat = -80; lat <= 80; lat += 20) {
        const equator = lat === 0
        ctx.beginPath()
        let started = false
        for (let lng = -180; lng <= 180; lng += 4) {
          const p = project(lat, lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
          if (p.z > 0) {
            if (started) ctx.lineTo(p.x, p.y)
            else {
              ctx.moveTo(p.x, p.y)
              started = true
            }
          } else started = false
        }
        ctx.strokeStyle = rgba(palette.grid, equator ? 0.32 : 0.11)
        ctx.lineWidth = equator ? 1 : 0.5
        ctx.stroke()
      }

      for (let lng = -180; lng < 180; lng += 20) {
        const facing = Math.max(0, project(0, lng, s.rotY, cosRx, sinRx, RADIUS, CENTER).z / RADIUS)
        if (facing < 0.04) continue
        ctx.beginPath()
        let started = false
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lat, lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
          if (p.z > 0) {
            if (started) ctx.lineTo(p.x, p.y)
            else {
              ctx.moveTo(p.x, p.y)
              started = true
            }
          } else started = false
        }
        ctx.strokeStyle = rgba(palette.grid, 0.05 + facing * 0.14)
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      ctx.restore()

      // Yüzeydeki yıldız tozu.
      for (const star of s.stars) {
        const p = project(star.lat, star.lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
        if (p.z <= RADIUS * 0.08) continue
        const alpha = (p.z / RADIUS) * star.brightness * (0.6 + Math.sin(t * 2.2 + star.lat) * 0.4)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.7, 0, Math.PI * 2)
        ctx.fillStyle = rgba(palette.star, alpha * 0.45)
        ctx.fill()
      }

      // Yaylar ve üzerlerinde akan veri paketleri.
      for (let ai = 0; ai < ARCS.length; ai++) {
        const color = tone(CITIES[ARCS[ai].from].tone)
        const geometry = ARC_GEOMETRY[ai]
        const points = ARC_SCREEN[ai]
        ctx.beginPath()
        let started = false
        for (let i = 0; i < geometry.length; i++) {
          const g = geometry[i]
          const cosT = g.cosT0 * cosRotY - g.sinT0 * sinRotY
          const sinT = g.sinT0 * cosRotY + g.cosT0 * sinRotY
          const r = RADIUS * g.rFactor
          const x = r * g.sinPhi * cosT
          const yBase = r * g.cosPhi
          const zBase = r * g.sinPhi * sinT
          const slot = points[i]
          slot.x = CENTER + x
          slot.y = CENTER - (yBase * cosRx - zBase * sinRx)
          slot.z = yBase * sinRx + zBase * cosRx
          if (slot.z > 0) {
            if (started) ctx.lineTo(slot.x, slot.y)
            else {
              ctx.moveTo(slot.x, slot.y)
              started = true
            }
          } else started = false
        }
        ctx.strokeStyle = rgba(color, 0.2)
        ctx.lineWidth = 1
        ctx.stroke()

        if (!still) s.packets[ai] = (s.packets[ai] + PACKET_SPEED * s.step) % 1
        const phase = s.packets[ai]
        for (let ti = 0; ti < PACKET_TAIL; ti++) {
          const tp = phase - ti * 0.022
          if (tp < 0 || tp > 1) continue
          const pt = points[Math.floor(tp * (points.length - 1))]
          if (!pt || pt.z <= 0) continue
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, Math.max(0.4, ti === 0 ? 2.2 : 1.4 - ti * 0.1), 0, Math.PI * 2)
          ctx.fillStyle = rgba(color, ti === 0 ? 1 : (1 - ti / PACKET_TAIL) * 0.75)
          ctx.fill()
        }
      }

      // Şehirler: hale, nabız halkaları, nokta ve etiket.
      const labelSize = Math.max(9, sz * 0.022)
      ctx.font = `600 ${labelSize}px ${palette.font}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const city of CITIES) {
        const p = project(city.lat, city.lng, s.rotY, cosRx, sinRx, RADIUS, CENTER)
        const visibility = p.z / RADIUS
        if (visibility <= 0) continue
        const color = tone(city.tone)
        const alpha = Math.min(1, visibility * 1.6)
        const dotR = (city.size ?? 3) * (sz / 480)

        ctx.globalAlpha = alpha
        const haloR = dotR * 5
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR)
        halo.addColorStop(0, rgba(color, 0.32))
        halo.addColorStop(1, rgba(color, 0))
        ctx.beginPath()
        ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()

        for (let ri = 0; ri < 2; ri++) {
          const pulse = (Math.sin(t * 2.8 + city.lat * 0.1 + ri * Math.PI) + 1) / 2
          ctx.beginPath()
          ctx.arc(p.x, p.y, dotR + pulse * dotR * 2.5 + ri * dotR * 1.2, 0, Math.PI * 2)
          ctx.strokeStyle = rgba(color, 0.35 - pulse * 0.2)
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2)
        ctx.fillStyle = rgba(color, 1)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, dotR * 0.38, 0, Math.PI * 2)
        ctx.fillStyle = rgba(palette.star, 1)
        ctx.fill()

        if (visibility > 0.3 && sz >= MIN_SIZE) {
          ctx.globalAlpha = Math.min(1, (visibility - 0.3) * 3.5) * alpha
          const tw = ctx.measureText(city.name).width
          const pw = tw + 12
          const ph = labelSize * 1.9
          const dir = city.labelDir ?? 'above'
          const gap = dotR * 2.8
          const lx = dir === 'left' ? p.x - pw - gap : dir === 'right' ? p.x + gap : p.x - pw / 2
          const ly = dir === 'below' ? p.y + gap : dir === 'above' ? p.y - gap - ph : p.y - ph / 2
          ctx.beginPath()
          ctx.roundRect(lx, ly, pw, ph, ph / 2)
          ctx.fillStyle = rgba(palette.labelBg, 0.88)
          ctx.fill()
          ctx.strokeStyle = rgba(color, 0.4)
          ctx.lineWidth = 0.7
          ctx.stroke()
          ctx.fillStyle = rgba(palette.labelInk, 1)
          ctx.fillText(city.name, lx + pw / 2, ly + ph / 2)
        }
        ctx.globalAlpha = 1
      }

      // Kıvılcımlar ve dalgalar (tıklama).
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        const k = s.step / LEGACY_FRAME_MS
        p.x += p.vx * k
        p.y += p.vy * k
        p.vx *= 0.97 ** k
        p.vy *= 0.97 ** k
        p.life -= k
        if (p.life <= 0) {
          s.particles.splice(i, 1)
          continue
        }
        const a = p.life / p.maxLife
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2)
        ctx.fillStyle = rgba(tone(p.tone), a * 0.82)
        ctx.fill()
      }
      for (let i = s.ripples.length - 1; i >= 0; i--) {
        const r = s.ripples[i]
        const k = s.step / LEGACY_FRAME_MS
        r.radius += 2.8 * k
        r.life -= k
        if (r.life <= 0 || r.radius > r.maxRadius) {
          s.ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(tone(r.tone), (r.life / 55) * 0.75)
        ctx.lineWidth = 1.8
        ctx.stroke()
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const elapsed = now - lastFrame
      if (elapsed < FRAME_INTERVAL) return
      lastFrame = now - (elapsed % FRAME_INTERVAL)
      const dt = Math.min(elapsed, MAX_STEP_MS)
      s.step = dt
      s.time += (dt / 1000) * TIME_RATE
      s.rotX = Math.max(-ROT_X_LIMIT, Math.min(ROT_X_LIMIT, s.rotX))
      draw()
    }

    const run = () => {
      if (still || !visible || raf) return
      lastFrame = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const resize = () => {
      const next = Math.round(Math.min(MAX_SIZE, Math.max(MIN_SIZE, box.clientWidth)))
      if (!next || next === size) return
      size = next
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      draw()
      canvas.dataset.ready = ''
    }

    const ro = new ResizeObserver(resize)
    ro.observe(box)
    resize()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) run()
        else pause()
      },
      { rootMargin: '120px' },
    )
    io.observe(box)

    const themeWatch = new MutationObserver(() => {
      palette = readPalette()
      draw()
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // Sürükle-döndür. Fareyle iki eksen; dokunmatikte önce yön kararı:
    // yatay başlayan hareket küreyi döndürür (yalnız yatay eksen), dikey
    // başlayan hareket sayfanın, tarayıcı kaydırır (`touch-action: pan-y`,
    // home.css) ve küre hiç kıpırdamaz. İlk sürümde dikey kaydırmaya
    // niyetlenen parmak küreyi de eğiyordu.
    const onDown = (event: PointerEvent) => {
      s.pressed = true
      s.touch = event.pointerType !== 'mouse'
      s.lock = s.touch ? 'none' : 'x'
      s.startX = s.lastX = event.clientX
      s.startY = s.lastY = event.clientY
      s.moved = false
      if (!s.touch) startDrag(event)
    }
    const startDrag = (event: PointerEvent) => {
      s.dragging = true
      canvas.setPointerCapture(event.pointerId)
      canvas.dataset.dragging = ''
    }
    const onMove = (event: PointerEvent) => {
      // Basılı değilken hareket yok sayılır. Önceden fareyle yalnız üzerine
      // gelmek de küreyi döndürüyordu: başlangıç noktası 0'da kaldığı için
      // ilk harekette yön kararı verilip sürükleme başlıyordu (4 Ekim 2026).
      if (!s.pressed) return
      const totalX = event.clientX - s.startX
      const totalY = event.clientY - s.startY
      if (Math.hypot(totalX, totalY) > TAP_SLOP) s.moved = true
      if (s.lock === 'none') {
        if (Math.hypot(totalX, totalY) < LOCK_SLOP) return
        s.lock = Math.abs(totalX) > Math.abs(totalY) ? 'x' : 'y'
        if (s.lock === 'y') return
        startDrag(event)
      }
      if (!s.dragging) return
      const dx = event.clientX - s.lastX
      const dy = s.touch ? 0 : event.clientY - s.lastY
      s.rotY += dx * DRAG_SENSITIVITY
      s.rotX -= dy * DRAG_SENSITIVITY
      s.lastX = event.clientX
      s.lastY = event.clientY
      if (still) draw()
    }
    const onUp = () => {
      s.pressed = false
      s.lock = 'none'
      if (!s.dragging) return
      s.dragging = false
      delete canvas.dataset.dragging
    }
    const onClick = (event: MouseEvent) => {
      // Sürüklemenin sonundaki tıklama kıvılcım çıkarmaz.
      if (still || s.moved) return
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (Math.hypot(x - size / 2, y - size / 2) > size * RADIUS_RATIO + BURST_REACH) return
      for (let i = 0; i < BURST_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / BURST_COUNT + Math.random() * 0.25
        const speed = 1.2 + Math.random() * 4.5
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 45 + Math.random() * 35,
          maxLife: 80,
          tone: Math.floor(Math.random() * palette.tones.length),
          size: 1.5 + Math.random() * 2.8,
        })
      }
      for (let i = 0; i < RIPPLE_COUNT; i++) {
        s.ripples.push({ x, y, radius: 0, maxRadius: 70 + i * 28, life: 55 + i * 8, tone: (i % 4) + 1 })
      }
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    // Kürenin dışında bırakılan parmak/fare da basılı durumu bitirir.
    window.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('lostpointercapture', onUp)
    canvas.addEventListener('click', onClick)

    return () => {
      pause()
      ro.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('lostpointercapture', onUp)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div ref={boxRef} className="home-globe-box">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Şehirleri ve aralarındaki bağlantıları gösteren dekoratif dünya küresi"
        className="home-globe-canvas"
      />
    </div>
  )
}
