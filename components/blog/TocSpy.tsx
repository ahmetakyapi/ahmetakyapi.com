'use client'

import { useEffect } from 'react'

/**
 * İçindekilerin "şu an buradasın" işareti. Çizim yapmaz (null döner):
 * bağlantılar sunucuda basılı, bu adacık yalnızca etkin olana
 * `aria-current="location"` yazar. JavaScript yoksa içindekiler yine
 * çalışır, yalnızca işaret olmaz.
 *
 * Kare başına kaydırma dinleyicisi yok; IntersectionObserver başlıkların ekranın üst
 * bandına girip çıkmasını haber verir, etkin bölüm her seferinde baştan
 * hesaplanır: üst çizgiyi (ekranın %30'u) geçmiş SON başlık. Hiçbiri
 * geçmediyse işaret yok.
 *
 * Önceki sürüm etkin bölümü olayın kendisinden çıkarıyordu ("banda giren
 * başlık etkin, bandın altına inen bir öncekine devreder"). Sayfa ilk
 * açıldığında bütün başlıklar bandın altında olduğu için her biri bir
 * öncekini işaretliyor ve en sonuncusu kazanıyordu: okur yazının en
 * başındayken içindekilerde sondan ikinci bölüm seçili duruyordu.
 */
const LINE = 0.3

export function TocSpy({ ids }: { ids: string[] }) {
  useEffect(() => {
    const headings = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc] a[href^="#"]'))
    if (headings.length === 0 || links.length === 0) return

    function update() {
      const line = window.innerHeight * LINE
      let current: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id
        else break
      }
      for (const link of links) {
        if (current !== null && link.hash === `#${current}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      }
    }

    const observer = new IntersectionObserver(update, { rootMargin: `0px 0px -${(1 - LINE) * 100}% 0px` })
    headings.forEach((heading) => observer.observe(heading))
    /* Gözlemci başlık çizgiyi GEÇERKEN haber veriyor; yumuşak kaydırmada
       (içindekilerden bir bölüme atlama) o an başlık henüz çizginin
       birkaç piksel altında olabiliyor ve işaret bir önceki bölümde
       kalıyordu (ölçüldü). Kaydırma bitince bir kez daha hesaplanır;
       `scrollend` kare başına değil, hareket başına bir kez ateşlenir. */
    window.addEventListener('scrollend', update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('scrollend', update)
    }
  }, [ids])

  return null
}
