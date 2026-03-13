'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch]  = useState(false)

  const dotRef  = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)

  /* Refs — no React state, zero re-renders after mount */
  const mouse   = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })
  const rafId   = useRef(0)

  useEffect(() => {
    setMounted(true)
    if (globalThis.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    function onMove(e: MouseEvent) {
      /* Teleport ring to cursor on first appearance to avoid swooping in */
      if (mouse.current.x === -200) {
        ring.current.x = e.clientX
        ring.current.y = e.clientY
      }
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      dotRef.current  && (dotRef.current.style.opacity  = '1')
      ringRef.current && (ringRef.current.style.opacity = '1')
    }
    function onLeave() {
      dotRef.current  && (dotRef.current.style.opacity  = '0')
      ringRef.current && (ringRef.current.style.opacity = '0')
    }
    function onEnter() {
      dotRef.current  && (dotRef.current.style.opacity  = '1')
      ringRef.current && (ringRef.current.style.opacity = '1')
    }

    /* RAF loop — lerps ring position, directly sets transform on DOM nodes */
    function tick() {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(calc(${mouse.current.x}px - 50%), calc(${mouse.current.y}px - 50%))`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%))`
      }

      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    globalThis.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(rafId.current)
      globalThis.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  if (!mounted || isTouch) return null

  return (
    <>
      {/* Dot — instant */}
      <span
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: 10,
          height: 10,
          backgroundColor: 'var(--cursor-dot-color)',
          opacity: 0,
          willChange: 'transform',
        }}
      />

      {/* Ring — lerp follower */}
      <span
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 26,
          height: 26,
          border: '1.5px solid var(--cursor-ring-color)',
          background: 'var(--cursor-ring-bg)',
          opacity: 0,
          willChange: 'transform',
        }}
      />
    </>
  )
}
