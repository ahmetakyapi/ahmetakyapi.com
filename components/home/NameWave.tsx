'use client'

import { useEffect } from 'react'

/**
 * Masaüstünde ismin "ağırlık dalgası".
 *
 * İmleç bir harfe yaklaştıkça Schibsted Grotesk'in ağırlık ekseni 560'tan
 * 860'a çıkar, komşulara Gauss eğrisiyle azalarak yayılır. Harf kutuları
 * sunucuda sabit genişlikte (name-metrics.ts): harf kalınlaşınca kutu
 * büyümez, satır zıplamaz (ölçüldü: dalga sırasında satır genişliği ve
 * harf konumları birebir aynı, CLS 0).
 *
 * Her kare React'e değil doğrudan stile yazılır; hedefe yaklaşınca döngü
 * kendini durdurur. Yalnız fare + hareket açık: dokunmatikte ve hareketi
 * azaltan okuyucuda dinleyici hiç bağlanmaz.
 */
const BASE = 560
const PEAK = 860
/** Etki yarıçapı, punto cinsinden: bir harf boyu kadar uzakta etki ~%37. */
const REACH = 0.85
/** Dikey mesafe daha az sayılır: imleç satırın üstündeyken de dalga okunsun. */
const Y_WEIGHT = 0.55
/** Kare başına hedefe yaklaşma oranı; 60 Hz'de ~200 ms'lik yumuşak takip. */
const FOLLOW = 0.16
const SETTLE = 0.5

const FINE = '(hover: hover) and (pointer: fine)'
const STILL = '(prefers-reduced-motion: reduce)'

export function NameWave() {
  useEffect(() => {
    const title = document.getElementById('hero-baslik')
    const section = title?.closest('section')
    if (!title || !section) return

    if (!window.matchMedia(FINE).matches || window.matchMedia(STILL).matches) return

    const glyphs = Array.from(title.querySelectorAll<HTMLElement>('.home-glyph'))
    const lines = Array.from(title.querySelectorAll<HTMLElement>('.home-name-line'))

    // Harf merkezleri, başlığın sol üstüne göre ve punto cinsinden. Punto
    // kabın genişliğine bağlı; boyut değişince yeniden ölçülür.
    let centers: { x: number; y: number }[] = []
    const measure = () => {
      const size = parseFloat(getComputedStyle(title).fontSize)
      if (!size) return
      const box = title.getBoundingClientRect()
      centers = []
      for (const line of lines) {
        const lineBox = line.getBoundingClientRect()
        for (const item of line.querySelectorAll<HTMLElement>('.home-glyph')) {
          const r = item.getBoundingClientRect()
          centers.push({
            x: (r.left + r.width / 2 - box.left) / size,
            y: (lineBox.top + lineBox.height / 2 - box.top) / size,
          })
        }
      }
    }
    void document.fonts.ready.then(measure)
    const resize = new ResizeObserver(measure)
    resize.observe(title)

    const current = glyphs.map(() => BASE)
    const target = glyphs.map(() => BASE)
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const tick = () => {
      frame = 0
      if (pointer && centers.length === glyphs.length) {
        const box = title.getBoundingClientRect()
        const size = parseFloat(getComputedStyle(title).fontSize)
        const px = (pointer.x - box.left) / size
        const py = (pointer.y - box.top) / size
        for (let i = 0; i < glyphs.length; i++) {
          const dx = px - centers[i].x
          const dy = (py - centers[i].y) * Y_WEIGHT
          const d = Math.hypot(dx, dy) / REACH
          target[i] = BASE + (PEAK - BASE) * Math.exp(-d * d)
        }
      } else {
        target.fill(BASE)
      }

      let moving = false
      for (let i = 0; i < glyphs.length; i++) {
        const next = current[i] + (target[i] - current[i]) * FOLLOW
        if (Math.abs(target[i] - next) > SETTLE) moving = true
        if (Math.round(next) !== Math.round(current[i])) {
          glyphs[i].style.fontWeight = String(Math.round(next))
        }
        current[i] = next
      }
      if (moving) frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      wake()
    }
    const onLeave = () => {
      pointer = null
      wake()
    }

    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)

    return () => {
      resize.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
