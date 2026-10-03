'use client'

import { useEffect, useRef } from 'react'

/**
 * Hero'nun arkasındaki küre: ince çizgili, etiketsiz, sakin bir sanat parçası.
 *
 * Eskiden etkileşimli bir "harita aracı"ydı: şehir etiketleri, haleler,
 * yaylarda kayan paketler, "döndürmek için sürükle" ipucu, sağ kolonda
 * kendi kutusu. İsmin arkasına geçince hepsi gürültüye döndü. Şimdi yalnız
 * meridyenler ve paraleller; arka yüz çok soluk, ön yüz derinliğe göre
 * belirginleşiyor, küre içi boş bir hacim gibi okunuyor. Tek renk vurgusu
 * İstanbul: küçük, sıcak bir nokta ve yavaş genişleyen tek halka.
 * Renkler temadan (`--primary`, `--accent-warm`).
 *
 * İşaretçi olaylarına kapalı (`pointer-events: none`, home.css): imleç
 * ismin ağırlık dalgasına ait, parmak sayfa kaydırmaya. Telefonda kaydırmayı
 * asla tutamaz. Fare varsa küre imlece doğru çok hafif eğilir.
 *
 * Bütçe: en çok 30 kare/sn, DPR en çok 1,25, arka tampon kenarı en çok
 * 1.400 piksel; ekrandan çıkınca ve sekme gizliyken durur. Çizgi parçaları
 * 6 saydamlık kovasına ayrılıp kova başına TEK `stroke` ile çiziliyor.
 * Hareketi azaltan okuyucuya tek kare.
 */

type Rgb = readonly [number, number, number]
type Palette = { line: Rgb; warm: Rgb }

const TARGET_FPS = 30
const FRAME_MS = 1000 / TARGET_FPS
const MAX_DPR = 1.25
const MAX_BACKING = 1400
/** Radyan/sn. Bir tur ~3 dakika: göz hareketi fark eder ama izlemeye çalışmaz. */
const SPIN = 0.034
const TILT = 0.3
/** Fareyle eğilme payı (radyan). */
const LEAN = 0.12
const RADIUS_RATIO = 0.48
/** Meridyen ve paralel aralığı (derece) ve çizgi başına örnek sayısı. */
const MERIDIAN_STEP = 10
const PARALLEL_STEP = 10
const SAMPLES = 72
const BINS = 6

type Vec = { x: number; y: number; z: number }

function toVec(lat: number, lng: number): Vec {
  const phi = (lat * Math.PI) / 180
  const theta = (lng * Math.PI) / 180
  return { x: Math.cos(phi) * Math.cos(theta), y: Math.sin(phi), z: Math.cos(phi) * Math.sin(theta) }
}

/** Bütün çizgiler tek düz dizide: her çizgi SAMPLES noktalık bir polyline. */
const LINES = (() => {
  const paths: Vec[][] = []
  for (let lng = -180; lng < 180; lng += MERIDIAN_STEP) {
    paths.push(Array.from({ length: SAMPLES }, (_, i) => toVec(-90 + (180 * i) / (SAMPLES - 1), lng)))
  }
  for (let lat = -70; lat <= 70; lat += PARALLEL_STEP) {
    paths.push(Array.from({ length: SAMPLES }, (_, i) => toVec(lat, -180 + (360 * i) / (SAMPLES - 1))))
  }
  const flat = paths.flat()
  // Meridyenler kutba doğru söner: hepsi kutupta tek noktada birleşiyor ve
  // orada örümcek ağı gibi koyu bir düğüm oluşuyordu (ilk turda görüldü).
  const meridianPoints = (360 / MERIDIAN_STEP) * SAMPLES
  return {
    count: paths.length,
    w: Float32Array.from(flat, (v, i) => (i < meridianPoints ? Math.sqrt(1 - v.y * v.y) : 1)),
    x: Float32Array.from(flat, (v) => v.x),
    y: Float32Array.from(flat, (v) => v.y),
    z: Float32Array.from(flat, (v) => v.z),
  }
})()

function readPalette(): Palette {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const read = (token: string): Rgb => {
    probe.style.color = `var(${token})`
    const nums = getComputedStyle(probe).color.match(/[\d.]+/g)
    return nums && nums.length >= 3 ? [Number(nums[0]), Number(nums[1]), Number(nums[2])] : [128, 160, 200]
  }
  const palette = { line: read('--primary'), warm: read('--accent-warm') }
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
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    let palette = readPalette()
    let size = 0
    let scale = 1
    let visible = false
    let raf = 0
    let last = 0
    // İstanbul ilk karede ön yüzde, merkezin biraz solunda.
    let spin = -1.2
    const lean = { x: 0, y: 0, tx: 0, ty: 0 }
    const total = LINES.x.length
    const sx = new Float32Array(total)
    const sy = new Float32Array(total)
    const sz = new Float32Array(total)

    const draw = () => {
      if (!size) return
      const c = size / 2
      const r = size * RADIUS_RATIO
      const cy = Math.cos(spin + lean.x)
      const sny = Math.sin(spin + lean.x)
      const cx = Math.cos(TILT + lean.y)
      const snx = Math.sin(TILT + lean.y)

      // Dönüş: önce dikey eksen, sonra eğim. Nokta başına nesne ayrılmaz.
      for (let i = 0; i < total; i++) {
        const x = LINES.x[i]
        const y = LINES.y[i]
        const z = LINES.z[i]
        const x1 = x * cy + z * sny
        const z1 = -x * sny + z * cy
        sx[i] = c + x1 * r
        sy[i] = c - (y * cx - z1 * snx) * r
        sz[i] = y * snx + z1 * cx
      }

      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.clearRect(0, 0, size, size)
      ctx.lineWidth = 1
      ctx.lineCap = 'round'

      // Kenar: kürenin sınırı tek ince çizgi.
      ctx.strokeStyle = rgba(palette.line, 0.22)
      ctx.beginPath()
      ctx.arc(c, c, r, 0, Math.PI * 2)
      ctx.stroke()

      // Parçalar derinliğe göre kovalara: arka yüz ~%5, ön yüzün ortası ~%42.
      for (let b = 0; b < BINS; b++) {
        ctx.beginPath()
        for (let l = 0; l < LINES.count; l++) {
          const base = l * SAMPLES
          for (let k = 1; k < SAMPLES; k++) {
            const i = base + k
            const depth = ((sz[i] + sz[i - 1]) / 2) * LINES.w[i]
            const level = depth < 0.02 ? 0 : Math.min(BINS - 1, 1 + Math.floor(depth * (BINS - 1)))
            if (level !== b) continue
            ctx.moveTo(sx[i - 1], sy[i - 1])
            ctx.lineTo(sx[i], sy[i])
          }
        }
        ctx.strokeStyle = rgba(palette.line, b === 0 ? 0.05 : 0.1 + (b / (BINS - 1)) * 0.32)
        ctx.stroke()
      }

      // Ev noktası kaldırıldı: etiketsiz tek bir turuncu nokta ve halka
      // kürenin ortasında rastgele bir işaret gibi okunuyordu.
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const elapsed = now - last
      if (elapsed < FRAME_MS) return
      last = now - (elapsed % FRAME_MS)
      spin += (SPIN * Math.min(elapsed, 100)) / 1000
      lean.x += (lean.tx - lean.x) * 0.06
      lean.y += (lean.ty - lean.y) * 0.06
      draw()
    }

    const run = () => {
      if (still || !visible || raf) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const resize = () => {
      const next = box.clientWidth
      if (!next || next === size) return
      size = next
      scale = Math.min(window.devicePixelRatio || 1, MAX_DPR, MAX_BACKING / size)
      canvas.width = Math.round(size * scale)
      canvas.height = Math.round(size * scale)
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      draw()
      canvas.dataset.ready = ''
    }

    const ro = new ResizeObserver(resize)
    ro.observe(box)
    resize()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) run()
      else pause()
    })
    io.observe(box)

    const themeWatch = new MutationObserver(() => {
      palette = readPalette()
      draw()
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const onPointer = (event: PointerEvent) => {
      lean.tx = (event.clientX / window.innerWidth - 0.5) * LEAN * 2
      lean.ty = (event.clientY / window.innerHeight - 0.5) * LEAN
    }
    if (fine && !still) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      pause()
      ro.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <div ref={boxRef} className="home-globe-box">
      <canvas ref={canvasRef} className="home-globe-canvas" />
    </div>
  )
}
