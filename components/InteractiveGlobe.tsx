'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface City {
  name: string
  lat: number
  lng: number
  color: string
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
  color: string
  size: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  life: number
  color: string
}

// ─── Constants ───────────────────────────────────────────────────────────────
const AUTO_SPEED = 0.0018
const DRAG_SENSITIVITY = 0.006
const MOMENTUM_DECAY = 0.93
const RESUME_DELAY = 2000
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS

const CITIES: City[] = [
  { name: 'Istanbul',     lat: 41.01,  lng: 28.98,   color: '#22d3ee', size: 5.5, labelDir: 'above' },
  { name: 'New York',     lat: 40.71,  lng: -74.01,  color: '#fb923c', size: 4 },
  { name: 'Tokyo',        lat: 35.68,  lng: 139.69,  color: '#f0abfc', size: 4 },
  { name: 'London',       lat: 51.51,  lng: -0.13,   color: '#34d399', size: 3.5 },
  { name: 'Sydney',       lat: -33.87, lng: 151.21,  color: '#60a5fa', size: 3.5 },
  { name: 'Singapore',    lat: 1.35,   lng: 103.82,  color: '#86efac', size: 3 },
  { name: 'Dubai',        lat: 25.20,  lng: 55.27,   color: '#f472b6', size: 3.5 },
  { name: 'Mumbai',       lat: 19.07,  lng: 72.88,   color: '#fb7185', size: 3 },
  { name: 'Seoul',        lat: 37.57,  lng: 126.98,  color: '#38bdf8', size: 3 },
  { name: 'São Paulo',    lat: -23.55, lng: -46.63,  color: '#4ade80', size: 3 },
  { name: 'Mexico City',  lat: 19.43,  lng: -99.13,  color: '#fcd34d', size: 3 },
  { name: 'Johannesburg', lat: -26.20, lng: 28.04,   color: '#e879f9', size: 3 },
  { name: 'Lagos',        lat: 6.52,   lng: 3.38,    color: '#a3e635', size: 2.5 },
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

const STAR_COUNT = 140

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

  let x = radius * Math.sin(phi) * Math.cos(theta)
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

  let dot = Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2))
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
  const [size, setSize] = useState(480)

  // Responsive size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setSize(Math.min(480, Math.max(240, w)))
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
    packetPhases: ARCS.map(() => Math.random()),
    lastFrameTime: 0,
  })

  useEffect(() => {
    const s = stateRef.current
    s.stars = Array.from({ length: STAR_COUNT }, () => ({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      brightness: 0.3 + Math.random() * 0.7,
    }))
  }, [])

  // ─── Drawing ─────────────────────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D, sz: number) => {
    const s = stateRef.current
    const t = s.time
    const CENTER = sz / 2
    const RADIUS = sz * 0.375 // ~180px at 480

    const cosRx = Math.cos(s.rotX)
    const sinRx = Math.sin(s.rotX)

    ctx.clearRect(0, 0, sz, sz)

    // ── Outer orbit rings ──
    for (let i = 0; i < 3; i++) {
      const pulse = Math.sin(t * 1.2 + i * 2.1) * 0.5 + 0.5
      const ringR = RADIUS + sz * 0.05 + i * sz * 0.03 + pulse * sz * 0.012
      const colors = ['rgba(139,92,246,', 'rgba(34,211,238,', 'rgba(168,85,247,']
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = `${colors[i]}${0.1 + pulse * 0.07})`
      ctx.lineWidth = i === 1 ? 1.5 : 1
      ctx.stroke()
    }

    // Decorative arc segments on outer ring
    const outerR = RADIUS + sz * 0.11
    for (let seg = 0; seg < 8; seg++) {
      const startA = (seg / 8) * Math.PI * 2 + t * 0.15
      const len = 0.18 + Math.sin(t * 0.8 + seg) * 0.05
      const alpha = 0.25 + Math.sin(t * 1.2 + seg * 0.7) * 0.1
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, outerR, startA, startA + len)
      ctx.strokeStyle = `rgba(34,211,238,${alpha})`
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // ── Atmosphere glow ──
    const atmosGrad = ctx.createRadialGradient(CENTER, CENTER, RADIUS - 4, CENTER, CENTER, RADIUS + sz * 0.08)
    atmosGrad.addColorStop(0, 'rgba(139,92,246,0.0)')
    atmosGrad.addColorStop(0.35, 'rgba(139,92,246,0.12)')
    atmosGrad.addColorStop(0.65, 'rgba(34,211,238,0.07)')
    atmosGrad.addColorStop(1, 'rgba(139,92,246,0.0)')
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS + sz * 0.08, 0, Math.PI * 2)
    ctx.fillStyle = atmosGrad
    ctx.fill()

    // ── Sphere core ──
    const coreGrad = ctx.createRadialGradient(
      CENTER - RADIUS * 0.3, CENTER - RADIUS * 0.3, 0,
      CENTER, CENTER, RADIUS,
    )
    coreGrad.addColorStop(0, '#1a1040')
    coreGrad.addColorStop(0.55, '#0d0825')
    coreGrad.addColorStop(1, '#060412')
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = coreGrad
    ctx.fill()

    // Sphere specular highlight
    const specGrad = ctx.createRadialGradient(
      CENTER - RADIUS * 0.38, CENTER - RADIUS * 0.38, 0,
      CENTER - RADIUS * 0.2, CENTER - RADIUS * 0.2, RADIUS * 0.65,
    )
    specGrad.addColorStop(0, 'rgba(255,255,255,0.04)')
    specGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = specGrad
    ctx.fill()

    // ── Sphere border ──
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(139,92,246,0.5)'
    ctx.lineWidth = 1.5
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
      ctx.strokeStyle = isEquator ? 'rgba(139,92,246,0.28)' : 'rgba(139,92,246,0.09)'
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
      ctx.strokeStyle = `rgba(139,92,246,${0.04 + facing * 0.12})`
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
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.45})`
        ctx.fill()
      }
    }

    // ── Arcs ──
    for (let ai = 0; ai < ARCS.length; ai++) {
      const arc = ARCS[ai]
      const cityA = CITIES[arc.from]
      const cityB = CITIES[arc.to]

      ctx.beginPath()
      let arcStarted = false
      const arcPoints: { x: number; y: number; z: number }[] = []

      for (let st = 0; st <= 1; st += 0.025) {
        const [lat, lng] = slerp(cityA.lat, cityA.lng, cityB.lat, cityB.lng, st)
        const elev = Math.sin(st * Math.PI) * RADIUS * 0.09
        const phi = toRad(90 - lat)
        const theta = toRad(lng) + s.rotY
        const r = RADIUS + elev

        let x = r * Math.sin(phi) * Math.cos(theta)
        let y = r * Math.cos(phi)
        const z0 = r * Math.sin(phi) * Math.sin(theta)
        const y2 = y * cosRx - z0 * sinRx
        const z = y * sinRx + z0 * cosRx
        y = y2

        const px = CENTER + x
        const py = CENTER - y
        arcPoints.push({ x: px, y: py, z })

        if (z > 0) {
          if (!arcStarted) { ctx.moveTo(px, py); arcStarted = true }
          else ctx.lineTo(px, py)
        } else { arcStarted = false }
      }
      ctx.strokeStyle = `${cityA.color}2a`
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
        ctx.fillStyle = ti === 0
          ? cityA.color
          : `${cityA.color}${Math.round(alpha * 220).toString(16).padStart(2, '0')}`
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
      haloGrad.addColorStop(0, `${city.color}50`)
      haloGrad.addColorStop(1, `${city.color}00`)
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
        ctx.strokeStyle = `${city.color}${Math.round((0.35 - pulse * 0.2) * alpha * 255).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Center dot
      ctx.beginPath()
      ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2)
      ctx.fillStyle = city.color
      ctx.fill()

      // White inner
      ctx.beginPath()
      ctx.arc(p.x, p.y, dotR * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // Label
      if (visibility > 0.3 && sz >= 240) {
        const labelAlpha = Math.min(1, (visibility - 0.3) * 3.5)
        ctx.globalAlpha = labelAlpha * alpha

        const text = city.name
        ctx.font = `600 ${labelSize}px -apple-system, sans-serif`
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
        ctx.fillStyle = 'rgba(5,3,14,0.88)'
        ctx.fill()
        ctx.strokeStyle = `${city.color}55`
        ctx.lineWidth = 0.7
        ctx.stroke()

        ctx.fillStyle = '#ffffff'
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
      ctx.fillStyle = `${p.color}${Math.round(pAlpha * 210).toString(16).padStart(2, '0')}`
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
      ctx.strokeStyle = `${r.color}${Math.round(rAlpha * 190).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 1.8
      ctx.stroke()
    }
  }, [])

  // ─── Canvas setup & animation loop ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw, size])

  // ─── Pointer handlers ────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current
    s.isDragging = true
    s.autoRotate = false
    s.lastMouse = { x: e.clientX, y: e.clientY }
    s.velY = 0
    s.velX = 0
    if (s.resumeTimer) clearTimeout(s.resumeTimer)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current
    if (!s.isDragging) return
    const dx = e.clientX - s.lastMouse.x
    const dy = e.clientY - s.lastMouse.y
    s.velY = dx * DRAG_SENSITIVITY
    s.velX = -dy * DRAG_SENSITIVITY
    s.rotY += s.velY
    s.rotX += s.velX
    s.lastMouse = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerUp = useCallback(() => {
    const s = stateRef.current
    s.isDragging = false
    s.resumeTimer = setTimeout(() => { s.autoRotate = true }, RESUME_DELAY)
  }, [])

  // ─── Click burst effect ──────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const s = stateRef.current
    const CENTER = size / 2
    const RADIUS = size * 0.375

    const dist = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2)
    if (dist > RADIUS + 40) return

    const colors = ['#22d3ee','#a78bfa','#f0abfc','#34d399','#fb923c','#60a5fa','#fcd34d','#86efac','#f472b6','#38bdf8']
    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100 + Math.random() * 0.25
      const speed = 1.2 + Math.random() * 4.5
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 45 + Math.random() * 35,
        maxLife: 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1.5 + Math.random() * 2.8,
      })
    }

    const rippleColors = ['#22d3ee', '#a78bfa', '#93c5fd', '#f0abfc']
    for (let i = 0; i < 4; i++) {
      s.ripples.push({
        x, y,
        radius: 0,
        maxRadius: 70 + i * 28,
        life: 55 + i * 8,
        color: rippleColors[i],
      })
    }
  }, [size])

  return (
    <div ref={containerRef} className="relative flex w-full flex-col items-center">
      <div className="relative">
        <div
          className="absolute inset-0 -m-8 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
          }}
        />
        <canvas
          ref={canvasRef}
          className="relative z-10"
          style={{
            width: size,
            height: size,
            cursor: 'grab',
            touchAction: 'none',
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
      <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500/60 select-none">
        Döndürmek için sürükle · Efekt için tıkla
      </p>
    </div>
  )
}
