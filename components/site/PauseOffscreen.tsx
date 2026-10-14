'use client'

import { useEffect, useRef } from 'react'

/**
 * Ekrandan çıkan sonsuz CSS döngülerini durdurur: içine konduğu öğeye
 * (ebeveyn) görünür değilken `data-offscreen` yazar; CSS o öznitelik
 * varken döngüyü `animation-play-state: paused` ile bekletir.
 *
 *   <section className="home-marquee">
 *     …
 *     <PauseOffscreen />
 *   </section>
 *
 * Neden: teknoloji şeridi, film şeridi, kapak sahneleri ve deneyim
 * kartındaki nabız sayfa açık kaldıkça, okur onlardan çok uzaktayken de
 * her karede dönüyordu (telefonda pil). Küre zaten ekran dışında
 * çizmiyor (HeroGlobe); CSS döngüleri de artık aynı kurala uyuyor.
 *
 * Ebeveyne bir yer imi gerekmesin diye kendisi gizli bir `<span>` çizer ve
 * gözlemciyi onun ebeveynine bağlar; sunucu bileşeni olan kap öyle kalır.
 * JavaScript yoksa öznitelik hiç yazılmaz, döngüler her zamanki gibi döner.
 * Yerleşimi etkilemez (`hidden`).
 */
export function PauseOffscreen() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = ref.current?.parentElement
    if (!host || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) host.removeAttribute('data-offscreen')
        else host.setAttribute('data-offscreen', '')
      },
      /* Ekrana girmeden biraz önce yeniden başlasın: görünür olduğu ilk
         karede duruk bir kare yakalanmasın. */
      { rootMargin: '120px 0px' },
    )
    observer.observe(host)
    return () => {
      observer.disconnect()
      host.removeAttribute('data-offscreen')
    }
  }, [])

  return <span ref={ref} hidden />
}
