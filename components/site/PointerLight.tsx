'use client'

import { useEffect, useRef } from 'react'

/**
 * İmleci izleyen ışık: ebeveynine `--mx` / `--my` (piksel) yazar, ışığı
 * CSS çizer (app/craft.css → `.pointer-sheen`, home.css → hero ızgarası).
 *
 *   <article className="relative">
 *     <PointerLight />            // kendisi `.pointer-sheen` katmanıdır
 *     …
 *   </article>
 *
 *   <section className="home-hero">
 *     <PointerLight bare />       // katman çizmez, yalnız değişkeni yazar
 *   </section>
 *
 * React durumu yok: her `pointermove` bir kareye toplanır (rAF) ve yalnız
 * iki CSS değişkeni değişir, yeniden çizim yok. Yalnız hassas işaretçide
 * ve hareketi azaltmayan okuyucuda bağlanır; dokunmatikte hiçbir şey
 * dinlenmez. Ebeveyn sunucu bileşeni olarak kalır (PauseOffscreen deseni).
 */
export function PointerLight({ bare = false, className }: { bare?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = ref.current?.parentElement
    if (!host) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || calm.matches) return

    let frame = 0
    let x = 0
    let y = 0
    const paint = () => {
      frame = 0
      host.style.setProperty('--mx', `${x}px`)
      host.style.setProperty('--my', `${y}px`)
    }
    const onMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()
      x = Math.round(event.clientX - box.left)
      y = Math.round(event.clientY - box.top)
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const onEnter = () => host.setAttribute('data-pointer-in', '')
    const onLeave = () => host.removeAttribute('data-pointer-in')

    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
      host.removeAttribute('data-pointer-in')
    }
  }, [])

  return <span ref={ref} aria-hidden="true" className={bare ? undefined : (className ?? 'pointer-sheen')} hidden={bare} />
}
