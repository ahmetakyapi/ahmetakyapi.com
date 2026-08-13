'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * Zemindeki parçacık alanı.
 *
 * Eskiden three.js + @react-three/fiber ile çiziliyordu: 232 KB gzip,
 * ~880 KB parse. Karşılığı 200 parçacık ve maksimum 0.14 opaklıktı — yani
 * sitenin geri kalanının tamamından ağır bir dekordu. Aynı görüntüyü 2D
 * canvas veriyor; bu dosya bağımlılıksız.
 *
 * Kapatma koşulları: dokunmatik cihaz, hareket azaltma tercihi, sekme arka
 * planda. Üçü de kontrol ediliyor ve hiçbiri kütüphane indirmiyor.
 */

const PARTICLE_COUNT = 90
const DRIFT = 0.055

type Particle = {
  x: number
  y: number
  z: number
  size: number
  phase: number
  colorIndex: number
}

const DARK_PALETTE = ['227,238,255', '184,219,250', '156,192,247', '84,130,245', '102,230,204']
const LIGHT_PALETTE = ['69,84,158', '56,77,184', '46,66,148', '31,51,128', '77,122,191']

export default function AmbientBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'
  const isLightRef = useRef(isLight)

  useEffect(() => {
    isLightRef.current = isLight
  }, [isLight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseQuery = window.matchMedia('(pointer: coarse)')
    if (motionQuery.matches || coarseQuery.matches) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    // Dekoratif bir katman; retina'da 2x çizmek görünür fayda vermiyor.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      // Derinlik hem boyutu hem opaklığı sürüyor — paralaks hissi buradan.
      z: 0.25 + Math.random() * 0.75,
      size: 0.5 + Math.pow(Math.random(), 3) * 2.6,
      phase: Math.random() * Math.PI * 2,
      colorIndex: Math.floor(Math.random() * 5),
    }))

    function resize() {
      if (!canvas) return
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    let raf = 0
    let running = true
    const start = performance.now()

    function frame(now: number) {
      if (!running || !ctx) return
      const t = (now - start) / 1000
      const palette = isLightRef.current ? LIGHT_PALETTE : DARK_PALETTE
      const alphaScale = isLightRef.current ? 0.42 : 0.3

      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        const drift = t * DRIFT
        // Sarmalama: parçacık kenardan çıkınca öbür kenardan girsin.
        const nx = (p.x + drift * p.z * 0.14) % 1
        const ny = (p.y + Math.sin(t * 0.18 + p.phase) * 0.012 + 1) % 1

        const x = nx * width
        const y = ny * height
        const radius = p.size * p.z
        const twinkle = 0.72 + Math.sin(t * 0.9 + p.phase) * 0.28

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${palette[p.colorIndex]},${(p.z * twinkle * alphaScale).toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        if (!running) {
          running = true
          raf = requestAnimationFrame(frame)
        }
      } else {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    function onMotionChange() {
      if (motionQuery.matches) {
        running = false
        cancelAnimationFrame(raf)
        ctx?.clearRect(0, 0, width, height)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}
