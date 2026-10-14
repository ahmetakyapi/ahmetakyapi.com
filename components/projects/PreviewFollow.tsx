'use client'

import { useEffect } from 'react'

/**
 * /projeler listesinde satırın üstünde durulunca beliren önizlemeyi imlece
 * bağlar. Çizim yapmaz (null döner): önizlemeler sunucuda, her satırın
 * içinde basılı; bu ada yalnızca iki şey yazar:
 *
 *   data-preview="follow" | "still"   liste kabına; önizleme kipini CSS'e söyler
 *   --px / --py / --pr                önizlemelere; imlecin yumuşatılmış konumu
 *
 * Konum değişkenleri liste kabına değil doğrudan `.pprev` öğelerine yazılır:
 * özel özellikler miras alındığı için kaba yazılan değer her karede listenin
 * bütün alt ağacının stilini yeniden hesaplatıyordu (14 Ekim 2026).
 *
 * React durumuna HİÇ yazılmıyor: konum her karede CSS değişkenine gidiyor,
 * ağaç yeniden çizilmiyor. Döngü yalnızca imleç hareket ederken ve hedefe
 * yakınsayana kadar dönüyor; durunca kendini kapatıyor.
 *
 * Yalnız ince imleçte (fare, iz dörtgeni). Dokunmatikte önizleme satırın
 * içinde küçük bir görsel olarak zaten görünür ve bu ada hiçbir şey yapmaz.
 * Hareketi azaltan okuyucuda imleç izlenmez (`still`): önizleme satırın
 * sağında sabit bir yerde, yalnızca solarak belirir.
 *
 * Görseller liste kabına imleç (ya da klavye odağı) ilk girdiğinde iner
 * (`data-armed`): o ana kadar `display: none` ve tembel yükleme onları hiç
 * istemez. Sayfayı yalnızca okuyan kişi on ekran görüntüsü indirmez.
 */
/** Konum yumuşatması: 0,2 imlece fazla yapışıyordu; 0,14 elle taşınan bir
    kartın ağırlığını veriyor (9 Ekim 2026). */
const SMOOTHING = 0.14
/** İmleç hızından eğilme: piksel başına derece ve üst sınır. */
const TILT_PER_PX = 0.12
const MAX_TILT = 6
const SETTLE_PX = 0.4
/** Önizlemenin sağ ekran kenarından payı; CSS'teki `--pp-gap` (2rem) bunun iki katı. */
const EDGE_MARGIN = 16

export function PreviewFollow({ targetId }: { targetId: string }) {
  useEffect(() => {
    const list = document.getElementById(targetId)
    if (!list) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const host: HTMLElement = list

    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let raf = 0
    let primed = false
    let previews: HTMLElement[] = []
    /** Önizleme genişliği; her imleç hareketinde ölçmek yerleşimi zorluyordu. */
    let previewWidth = 0

    function collect() {
      previews = Array.from(host.querySelectorAll<HTMLElement>('.pprev'))
      previewWidth = 0
    }

    /* Önizleme hareket yönüne hafifçe eğilir, durunca düzelir: elle
       taşınan bir kart gibi. */
    function write() {
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, (tx - x) * TILT_PER_PX))
      const px = `${x.toFixed(1)}px`
      const py = `${y.toFixed(1)}px`
      const pr = `${tilt.toFixed(2)}deg`
      for (const preview of previews) {
        preview.style.setProperty('--px', px)
        preview.style.setProperty('--py', py)
        preview.style.setProperty('--pr', pr)
      }
    }

    function frame() {
      x += (tx - x) * SMOOTHING
      y += (ty - y) * SMOOTHING
      const settled = Math.abs(tx - x) < SETTLE_PX && Math.abs(ty - y) < SETTLE_PX
      if (settled) {
        x = tx
        y = ty
      }
      write()
      raf = settled ? 0 : requestAnimationFrame(frame)
    }

    /* Önizleme imlecin sağında açılır; ekranın sağ kenarına yaklaşınca
       imlecin soluna geçmek yerine kenarda durur (sıçrama yok). */
    function clampX(clientX: number) {
      if (!previewWidth) previewWidth = previews[0]?.offsetWidth ?? 0
      return Math.min(clientX, window.innerWidth - previewWidth - EDGE_MARGIN * 3)
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      tx = clampX(event.clientX)
      ty = event.clientY
      if (!primed) {
        /* İlk girişte önizleme (0, 0)'dan uçarak gelmesin: doğrudan imleçte. */
        x = tx
        y = ty
        primed = true
        write()
        return
      }
      if (!raf) raf = requestAnimationFrame(frame)
    }

    function onEnter() {
      host.dataset.armed = ''
      collect()
    }

    function onLeave() {
      primed = false
    }

    function apply() {
      host.removeEventListener('pointermove', onMove)
      if (!fine.matches) {
        delete host.dataset.preview
        return
      }
      host.dataset.preview = still.matches ? 'still' : 'follow'
      if (!still.matches) host.addEventListener('pointermove', onMove, { passive: true })
    }

    collect()
    apply()
    window.addEventListener('resize', collect)
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('focusin', onEnter)
    host.addEventListener('pointerleave', onLeave)
    fine.addEventListener('change', apply)
    still.addEventListener('change', apply)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', collect)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('focusin', onEnter)
      host.removeEventListener('pointerleave', onLeave)
      fine.removeEventListener('change', apply)
      still.removeEventListener('change', apply)
    }
  }, [targetId])

  return null
}
