'use client'

import { useEffect, useRef, useState } from 'react'
import { CURSOR_PREFERENCE_EVENT, isCustomCursorEnabled } from '@/lib/cursor-preference'

/** Halkanın etkileşimli eleman üzerinde büyüme oranı. */
const HOVER_SCALE = 1.75

export default function CustomCursor() {
  const [active, setActive] = useState(false)

  const dotRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)

  /* Konum ref'lerde tutuluyor — mount'tan sonra tek bir re-render yok. */
  const mouse = useRef({ x: -200, y: -200 })
  const ring = useRef({ x: -200, y: -200 })
  const scale = useRef(1)
  const targetScale = useRef(1)
  const rafId = useRef(0)

  useEffect(() => {
    function evaluate() {
      const fine = window.matchMedia('(pointer: fine)').matches
      const hover = window.matchMedia('(hover: hover)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setActive(fine && hover && !reduced && isCustomCursorEnabled())
    }

    evaluate()
    window.addEventListener(CURSOR_PREFERENCE_EVENT, evaluate)
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedQuery.addEventListener('change', evaluate)

    return () => {
      window.removeEventListener(CURSOR_PREFERENCE_EVENT, evaluate)
      reducedQuery.removeEventListener('change', evaluate)
    }
  }, [])

  useEffect(() => {
    if (!active) {
      document.documentElement.classList.remove('cursor-custom')
      return
    }

    /* Sınıf CSS'te değil burada ekleniyor: JS gelmezse sistem imleci kalır. */
    document.documentElement.classList.add('cursor-custom')

    function onMove(e: MouseEvent) {
      // İlk görünüşte halka ekranın ortasından süzülmesin.
      if (mouse.current.x === -200) {
        ring.current.x = e.clientX
        ring.current.y = e.clientY
      }
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      const el = e.target as HTMLElement | null
      const interactive = el?.closest?.('a, button, [role="button"], input, textarea, select, summary')
      targetScale.current = interactive ? HOVER_SCALE : 1

      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    function hide() {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    function show() {
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    function tick() {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.14
      ring.current.y += (mouse.current.y - ring.current.y) * 0.14
      scale.current += (targetScale.current - scale.current) * 0.16

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${mouse.current.x}px - 50%), calc(${mouse.current.y}px - 50%))`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%)) scale(${scale.current.toFixed(3)})`
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
      document.documentElement.classList.remove('cursor-custom')
    }
  }, [active])

  if (!active) return null

  return (
    <>
      <span
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'var(--cursor-dot-color)',
          opacity: 0,
          willChange: 'transform',
        }}
      />
      <span
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
        style={{
          width: 26,
          height: 26,
          border: '1.5px solid var(--cursor-ring-color)',
          background: 'var(--cursor-ring-bg)',
          opacity: 0,
          transition: 'border-color 0.2s ease, background 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}
