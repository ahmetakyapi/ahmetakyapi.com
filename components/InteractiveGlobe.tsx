'use client'

import { useRef, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface City {
  name: string
  lat: number
  lng: number
  color: string
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
const SIZE = 500
const CENTER = SIZE / 2
const RADIUS = 190
const AUTO_SPEED = 0.002
const DRAG_SENSITIVITY = 0.006
const MOMENTUM_DECAY = 0.94
const RESUME_DELAY = 2000

const CITIES: City[] = [
  { name: 'Istanbul', lat: 41.01, lng: 28.98, color: '#22d3ee' },
  { name: 'San Francisco', lat: 37.77, lng: -122.42, color: '#a78bfa' },
  { name: 'Tokyo', lat: 35.68, lng: 139.69, color: '#f0abfc' },
  { name: 'London', lat: 51.51, lng: -0.13, color: '#34d399' },
  { name: 'New York', lat: 40.71, lng: -74.01, color: '#fb923c' },
  { name: 'Sydney', lat: -33.87, lng: 151.21, color: '#60a5fa' },
  { name: 'Paris', lat: 48.86, lng: 2.35, color: '#fcd34d' },
  { name: 'Singapore', lat: 1.35, lng: 103.82, color: '#86efac' },
]

const ARCS: Arc[] = [
  { from: 0, to: 3 }, // Istanbul-London
  { from: 0, to: 4 }, // Istanbul-NYC
  { from: 1, to: 4 }, // SF-NYC
  { from: 2, to: 5 }, // Tokyo-Sydney
  { from: 3, to: 1 }, // London-SF
  { from: 6, to: 3 }, // Paris-London
  { from: 7, to: 2 }, // Singapore-Tokyo
  { from: 0, to: 6 }, // Istanbul-Paris
  { from: 4, to: 6 }, // NYC-Paris
  { from: 1, to: 7 }, // SF-Singapore
]

const STAR_COUNT = 120

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function project(lat: number, lng: number, rotY: number, cosRx: number, sinRx: number) {
  const phi = toRad(90 - lat)
  const theta = toRad(lng) + rotY

  let x = RADIUS * Math.sin(phi) * Math.cos(theta)
  let y = RADIUS * Math.cos(phi)
  const z0 = RADIUS * Math.sin(phi) * Math.sin(theta)

  const y2 = y * cosRx - z0 * sinRx
  const z = y * sinRx + z0 * cosRx
  y = y2

  return { x: CENTER + x, y: CENTER - y, z }
}

function slerp(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  t: number,
): [number, number] {
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

  let dot = x1 * x2 + y1 * y2 + z1 * z2
  dot = Math.max(-1, Math.min(1, dot))
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

  const lat = 90 - (Math.acos(y / Math.sqrt(x * x + y * y + z * z)) * 180) / Math.PI
  const lng = (Math.atan2(z, x) * 180) / Math.PI

  return [lat, lng]
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
    dpr: 1,
  })

  // Generate stars once
  useEffect(() => {
    const s = stateRef.current
    s.stars = Array.from({ length: STAR_COUNT }, () => ({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      brightness: 0.3 + Math.random() * 0.7,
    }))
  }, [])

  // ─── Drawing ─────────────────────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current
    const t = s.time
    // Precompute once — used across all project() calls this frame
    const cosRx = Math.cos(s.rotX)
    const sinRx = Math.sin(s.rotX)

    ctx.clearRect(0, 0, SIZE, SIZE)

    // ── Outer pulsing rings ──
    for (let i = 0; i < 3; i++) {
      const pulse = Math.sin(t * 1.5 + i * 2.1) * 0.5 + 0.5
      const ringR = RADIUS + 22 + i * 14 + pulse * 6
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(139,92,246,${0.08 + pulse * 0.06})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // ── Atmosphere glow ──
    const atmosGrad = ctx.createRadialGradient(CENTER, CENTER, RADIUS - 4, CENTER, CENTER, RADIUS + 30)
    atmosGrad.addColorStop(0, 'rgba(139,92,246,0.0)')
    atmosGrad.addColorStop(0.4, 'rgba(139,92,246,0.08)')
    atmosGrad.addColorStop(0.7, 'rgba(34,211,238,0.05)')
    atmosGrad.addColorStop(1, 'rgba(139,92,246,0.0)')
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS + 30, 0, Math.PI * 2)
    ctx.fillStyle = atmosGrad
    ctx.fill()

    // ── Sphere core ──
    const coreGrad = ctx.createRadialGradient(
      CENTER - RADIUS * 0.3, CENTER - RADIUS * 0.3, 0,
      CENTER, CENTER, RADIUS,
    )
    coreGrad.addColorStop(0, '#16103a')
    coreGrad.addColorStop(0.6, '#0c0820')
    coreGrad.addColorStop(1, '#06040f')
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = coreGrad
    ctx.fill()

    // ── Sphere border ──
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(139,92,246,0.45)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // ── Grid lines (latitude) ──
    for (let lat = -80; lat <= 80; lat += 20) {
      const isEquator = lat === 0
      ctx.beginPath()
      let started = false
      for (let lng = -180; lng <= 180; lng += 5) {
        const p = project(lat, lng, s.rotY, cosRx, sinRx)
        if (p.z > 0) {
          if (!started) {
            ctx.moveTo(p.x, p.y)
            started = true
          } else {
            ctx.lineTo(p.x, p.y)
          }
        } else {
          started = false
        }
      }
      ctx.strokeStyle = isEquator
        ? 'rgba(139,92,246,0.25)'
        : 'rgba(139,92,246,0.08)'
      ctx.lineWidth = isEquator ? 1.2 : 0.6
      ctx.stroke()
    }

    // ── Grid lines (longitude) ──
    for (let lng = -180; lng < 180; lng += 20) {
      ctx.beginPath()
      let started = false
      for (let lat = -90; lat <= 90; lat += 5) {
        const p = project(lat, lng, s.rotY, cosRx, sinRx)
        const alpha = Math.max(0, Math.min(1, p.z / RADIUS))
        if (p.z > 0) {
          if (!started) {
            ctx.moveTo(p.x, p.y)
            started = true
          } else {
            ctx.lineTo(p.x, p.y)
          }
        } else {
          started = false
        }
      }
      // Brightness based on facing angle - approximate with last point z
      const sampleP = project(0, lng, s.rotY, cosRx, sinRx)
      const facing = Math.max(0, sampleP.z / RADIUS)
      ctx.strokeStyle = `rgba(139,92,246,${0.04 + facing * 0.14})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    // ── Stars on sphere ──
    for (const star of s.stars) {
      const p = project(star.lat, star.lng, s.rotY, cosRx, sinRx)
      if (p.z > RADIUS * 0.1) {
        const alpha = ((p.z / RADIUS) * star.brightness * (0.7 + Math.sin(t * 2 + star.lat) * 0.3))
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`
        ctx.fill()
      }
    }

    // ── Arcs ──
    for (let ai = 0; ai < ARCS.length; ai++) {
      const arc = ARCS[ai]
      const cityA = CITIES[arc.from]
      const cityB = CITIES[arc.to]

      // Draw arc path
      ctx.beginPath()
      let arcStarted = false
      const arcPoints: { x: number; y: number; z: number }[] = []
      for (let st = 0; st <= 1; st += 0.02) {
        const [lat, lng] = slerp(cityA.lat, cityA.lng, cityB.lat, cityB.lng, st)
        // Elevate the arc slightly above the sphere
        const elev = Math.sin(st * Math.PI) * 18
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
          if (!arcStarted) {
            ctx.moveTo(px, py)
            arcStarted = true
          } else {
            ctx.lineTo(px, py)
          }
        } else {
          arcStarted = false
        }
      }
      const arcColor = cityA.color
      ctx.strokeStyle = `${arcColor}33`
      ctx.lineWidth = 1
      ctx.stroke()

      // ── Data packet on arc ──
      s.packetPhases[ai] = (s.packetPhases[ai] + 0.004) % 1
      const phase = s.packetPhases[ai]

      // Draw trail + head
      for (let ti = 0; ti < 8; ti++) {
        const tp = phase - ti * 0.02
        if (tp < 0 || tp > 1) continue
        const idx = Math.floor(tp * (arcPoints.length - 1))
        if (idx < 0 || idx >= arcPoints.length) continue
        const pt = arcPoints[idx]
        if (pt.z <= 0) continue
        const alpha = (1 - ti / 8) * 0.8
        const sz = ti === 0 ? 2.5 : 1.5 - ti * 0.12
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, Math.max(0.5, sz), 0, Math.PI * 2)
        ctx.fillStyle = ti === 0
          ? arcColor
          : `${arcColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      }
    }

    // ── Satellite orbit ──
    const satOrbitTilt = 0.4
    const satAngle = t * 0.5
    const satOrbitR = RADIUS + 42

    // Draw orbit path (dashed)
    ctx.save()
    ctx.setLineDash([4, 6])
    ctx.beginPath()
    for (let a = 0; a <= Math.PI * 2; a += 0.05) {
      let sx = satOrbitR * Math.cos(a)
      let sy = satOrbitR * Math.sin(a) * Math.cos(satOrbitTilt)
      const sz = satOrbitR * Math.sin(a) * Math.sin(satOrbitTilt)

      const sy2 = sy * cosRx - sz * sinRx
      sy = sy2

      if (a === 0) ctx.moveTo(CENTER + sx, CENTER - sy)
      else ctx.lineTo(CENTER + sx, CENTER - sy)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(250,204,21,0.15)'
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.restore()

    // Satellite position
    let satX = satOrbitR * Math.cos(satAngle)
    let satY = satOrbitR * Math.sin(satAngle) * Math.cos(satOrbitTilt)
    const satZ = satOrbitR * Math.sin(satAngle) * Math.sin(satOrbitTilt)

    const satY2 = satY * cosRx - satZ * sinRx
    satY = satY2

    const satPx = CENTER + satX
    const satPy = CENTER - satY

    // Satellite glow
    const satGlow = ctx.createRadialGradient(satPx, satPy, 0, satPx, satPy, 12)
    satGlow.addColorStop(0, 'rgba(250,204,21,0.3)')
    satGlow.addColorStop(1, 'rgba(250,204,21,0)')
    ctx.beginPath()
    ctx.arc(satPx, satPy, 12, 0, Math.PI * 2)
    ctx.fillStyle = satGlow
    ctx.fill()

    // Satellite body
    ctx.fillStyle = '#fcd34d'
    ctx.fillRect(satPx - 3, satPy - 2, 6, 4)
    // Solar panels
    ctx.fillStyle = '#60a5fa'
    ctx.fillRect(satPx - 10, satPy - 1.5, 6, 3)
    ctx.fillRect(satPx + 4, satPy - 1.5, 6, 3)

    // ── Cities ──
    for (const city of CITIES) {
      const p = project(city.lat, city.lng, s.rotY, cosRx, sinRx)
      const visibility = p.z / RADIUS

      if (visibility > 0) {
        const alpha = Math.min(1, visibility * 1.5)

        // Outer halo
        const haloGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16)
        haloGrad.addColorStop(0, `${city.color}40`)
        haloGrad.addColorStop(1, `${city.color}00`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2)
        ctx.fillStyle = haloGrad
        ctx.globalAlpha = alpha
        ctx.fill()

        // Pulsing rings
        for (let ri = 0; ri < 2; ri++) {
          const pulse = (Math.sin(t * 2.5 + ri * Math.PI) + 1) / 2
          const ringR = 5 + pulse * 8 + ri * 3
          ctx.beginPath()
          ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2)
          ctx.strokeStyle = `${city.color}${Math.round((0.3 - pulse * 0.2) * alpha * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        // Center dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = city.color
        ctx.fill()

        // White inner dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        // Label (pill shape)
        if (visibility > 0.35) {
          const labelAlpha = Math.min(1, (visibility - 0.35) * 3)
          ctx.globalAlpha = labelAlpha * alpha

          const text = city.name
          ctx.font = '600 10px Manrope, -apple-system, sans-serif'
          const tw = ctx.measureText(text).width
          const pw = tw + 14
          const ph = 20
          const lx = p.x - pw / 2
          const ly = p.y - 26

          // Pill background
          const pillR = ph / 2
          ctx.beginPath()
          ctx.moveTo(lx + pillR, ly)
          ctx.lineTo(lx + pw - pillR, ly)
          ctx.arc(lx + pw - pillR, ly + pillR, pillR, -Math.PI / 2, Math.PI / 2)
          ctx.lineTo(lx + pillR, ly + ph)
          ctx.arc(lx + pillR, ly + pillR, pillR, Math.PI / 2, -Math.PI / 2)
          ctx.closePath()
          ctx.fillStyle = 'rgba(6,4,15,0.85)'
          ctx.fill()
          ctx.strokeStyle = `${city.color}66`
          ctx.lineWidth = 0.8
          ctx.stroke()

          // Label text
          ctx.fillStyle = '#ffffff'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(text, p.x, ly + ph / 2)
        }

        ctx.globalAlpha = 1
      }
    }

    // ── Particles ──
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.97
      p.vy *= 0.97
      p.life -= 1

      if (p.life <= 0) {
        s.particles.splice(i, 1)
        continue
      }

      const pAlpha = p.life / p.maxLife
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * pAlpha, 0, Math.PI * 2)
      ctx.fillStyle = `${p.color}${Math.round(pAlpha * 200).toString(16).padStart(2, '0')}`
      ctx.fill()
    }

    // ── Ripples ──
    for (let i = s.ripples.length - 1; i >= 0; i--) {
      const r = s.ripples[i]
      r.radius += 2.5
      r.life -= 1

      if (r.life <= 0 || r.radius > r.maxRadius) {
        s.ripples.splice(i, 1)
        continue
      }

      const rAlpha = r.life / 60
      ctx.beginPath()
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `${r.color}${Math.round(rAlpha * 180).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [])

  // ─── Animation loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    stateRef.current.dpr = dpr
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width = `${SIZE}px`
    canvas.style.height = `${SIZE}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(dpr, dpr)

    let raf: number

    function loop() {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return

      const s = stateRef.current
      s.time += 0.016

      // Auto rotation
      if (s.autoRotate && !s.isDragging) {
        s.rotY += AUTO_SPEED
      }

      // Momentum
      if (!s.isDragging) {
        s.rotY += s.velY
        s.rotX += s.velX
        s.velY *= MOMENTUM_DECAY
        s.velX *= MOMENTUM_DECAY
      }

      // Clamp rotX
      s.rotX = Math.max(-1.2, Math.min(1.2, s.rotX))

      // Reset scale and draw
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx!)
    }

    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
  }, [draw])

  // ─── Mouse handlers ────────────────────────────────────────────────────
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
    s.resumeTimer = setTimeout(() => {
      s.autoRotate = true
    }, RESUME_DELAY)
  }, [])

  // ─── Click effect ──────────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const s = stateRef.current

    // Only trigger if near the globe
    const dist = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2)
    if (dist > RADIUS + 40) return

    // Particle burst
    const colors = ['#22d3ee', '#a78bfa', '#f0abfc', '#34d399', '#fb923c', '#60a5fa', '#fcd34d', '#86efac']
    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * i) / 90 + Math.random() * 0.3
      const speed = 1.5 + Math.random() * 4
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1.5 + Math.random() * 2.5,
      })
    }

    // Ripples
    const rippleColors = ['#22d3ee', '#a78bfa', '#93c5fd']
    for (let i = 0; i < 3; i++) {
      s.ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: 80 + i * 30,
        life: 50 + i * 10,
        color: rippleColors[i],
      })
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        {/* Background glow behind globe */}
        <div
          className="absolute inset-0 -m-8 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)',
          }}
        />
        <canvas
          ref={canvasRef}
          className="relative z-10"
          style={{
            width: SIZE,
            height: SIZE,
            cursor: 'grab',
            touchAction: 'none',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={handleClick}
          onGotPointerCapture={() => {
            if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
          }}
          onLostPointerCapture={() => {
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
          }}
        />
      </div>
      <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500/60 select-none">
        Drag to rotate · Click for effect
      </p>
    </div>
  )
}
