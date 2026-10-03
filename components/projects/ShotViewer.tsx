'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { buttonClass } from '@/components/ui/Button'
import { ThemedImage } from '@/components/ui/ThemedImage'

/**
 * Ekran görüntüsünü büyüten pencere: yerel `<dialog>`.
 *
 * Görseller ve tetikleyici düğmeler SUNUCUDA çiziliyor (sayfa statik, LCP
 * görseli bu adayı beklemiyor); ada yalnızca pencereyi taşır ve
 * `[data-shot]` düğmelerine tıklamayı belgede yakalar. Ada yüklenmeden
 * tıklanan düğme hiçbir şey yapmaz, sayfa yine okunur.
 *
 * Klavye: Esc kapatır (yerel), ←/→ görünümler arasında gezer, Tab pencerenin
 * içinde kalır (showModal belgenin geri kalanını etkisiz kılar). Kapanınca
 * odak açan düğmeye döner; tarayıcı bunu çoğunlukla kendisi yapıyor ama
 * her motorda değil, o yüzden elle de.
 */
/** `alt`: ekran okuyucuya giden cümle. `caption`: pencerenin altındaki künye (Title Case). */
export type ViewerShot = { light: string; dark?: string; width: number; height: number; alt: string; caption: string }

/** Pencere görüntüsü ekranın en çok bu kadarını kaplar. */
const MAX_VW = 92
const MAX_SVH = 82

export function ShotViewer({ shots }: { shots: ViewerShot[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const [index, setIndex] = useState(0)

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length),
    [shots.length],
  )

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-shot]') : null
      if (!target) return
      const i = Number(target.dataset.shot)
      if (!Number.isInteger(i) || i < 0 || i >= shots.length) return
      openerRef.current = target
      setIndex(i)
      dialogRef.current?.showModal()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [shots.length])

  function onClose() {
    openerRef.current?.focus()
    openerRef.current = null
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (shots.length < 2) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  /* Arka plana (pencerenin dışına) tıklama kapatır. */
  function onDialogClick(event: ReactMouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) dialogRef.current?.close()
  }

  const shot = shots[index]
  if (!shot) return null
  const width = `min(${MAX_VW}vw, calc(${MAX_SVH}svh * ${shot.width / shot.height}))`

  return (
    <dialog
      ref={dialogRef}
      className="shot-dialog"
      aria-label="Ekran görüntüsü"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={onDialogClick}
    >
      <figure className="flex flex-col items-center gap-3">
        <div className="overflow-hidden rounded-card border border-line bg-surface-sunken shadow-modal" style={{ width }}>
          <ThemedImage key={index} light={shot.light} dark={shot.dark} width={shot.width} height={shot.height} alt={shot.alt} />
        </div>
        <figcaption className="flex w-full items-center justify-between gap-3" style={{ width }}>
          <span className="min-w-0 truncate text-sm text-body">{shot.caption}</span>
          <span className="flex shrink-0 items-center gap-1">
            {shots.length > 1 ? (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Önceki görüntü" className={buttonClass({ variant: 'ghost', size: 'icon' })}>
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Sonraki görüntü" className={buttonClass({ variant: 'ghost', size: 'icon' })}>
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Kapat"
              autoFocus
              className={buttonClass({ variant: 'secondary', size: 'icon' })}
            >
              <X aria-hidden="true" />
            </button>
          </span>
        </figcaption>
      </figure>
    </dialog>
  )
}
