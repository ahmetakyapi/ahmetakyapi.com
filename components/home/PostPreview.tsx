'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Son Yazılar listesinin imleci izleyen önizlemesi.
 *
 * Neden: başlıktan gözünü ayırmadan yazının hangi projeyi anlattığını
 * gösteriyor; liste kart olmadan görsel kazanıyor.
 *
 * Yalnız gerçekten fare olan ve hareketi kapatmamış okuyucuda çalışır
 * (`(hover: hover) and (pointer: fine)` + `prefers-reduced-motion`); geri
 * kalanında hiç dinleyici bağlanmaz, önizleme CSS ile de gizli
 * (home.css → "Son Yazılar"). Konum React durumuna YAZILMAZ: her kare
 * yeniden çizim olurdu. Hedef ref'te, takip rAF ile ve yalnız imleç
 * listenin üstündeyken; çıkınca döngü durur.
 *
 * Önizlemeler sunucuda çizilip `previews` ile gelir (her biri
 * `data-slug` taşır); bu bileşen yalnız hangisinin görüneceğini ve nerede
 * duracağını belirler.
 */
const QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
/** Takip yumuşaklığı: her karede kalan mesafenin bu kadarı kapanır. */
const FOLLOW = 0.18
/**
 * İmlece göre kayıklık: önizleme imlecin sağ ÜSTÜNDE durur. İlk sürümde
 * imlecin yanında (-60) duruyordu ve tam da okunan başlığın üstünü
 * kapatıyordu (1280'de ölçüldü). Kutu 272×170; altı imlecin 24 piksel
 * üstünde biter, üzerinde durulan satır açık kalır.
 */
const OFFSET_X = 32
const OFFSET_Y = -194

export function PostPreview({ children, previews }: { children: ReactNode; previews: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const float = floatRef.current
    if (!root || !float || !window.matchMedia(QUERY).matches) return

    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let raf = 0
    let active: string | null = null

    const tick = () => {
      pos.x += (target.x - pos.x) * FOLLOW
      pos.y += (target.y - pos.y) * FOLLOW
      float.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      raf = active ? requestAnimationFrame(tick) : 0
    }

    const show = (slug: string | null) => {
      if (slug === active) return
      active = slug
      root.toggleAttribute('data-previewing', slug !== null)
      for (const el of float.querySelectorAll<HTMLElement>('[data-slug]')) {
        el.toggleAttribute('data-on', el.dataset.slug === slug)
      }
      if (slug && !raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      target.x = e.clientX - rect.left + OFFSET_X
      target.y = e.clientY - rect.top + OFFSET_Y
      if (!active) {
        // İlk girişte süzülerek gelmesin; doğrudan imlecin yanında açılsın.
        pos.x = target.x
        pos.y = target.y
      }
      const row = (e.target as Element).closest<HTMLElement>('[data-preview]')
      show(row?.dataset.preview ?? null)
    }
    const onLeave = () => show(null)

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={rootRef} className="home-posts relative">
      {children}
      <div ref={floatRef} className="home-follow" aria-hidden="true">
        {previews}
      </div>
    </div>
  )
}
