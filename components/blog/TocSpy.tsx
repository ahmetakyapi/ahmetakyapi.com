'use client'

import { useEffect } from 'react'

/**
 * İçindekilerin "şu an buradasın" işareti. Çizim yapmaz (null döner):
 * bağlantılar sunucuda basılı, bu adacık yalnızca etkin olana
 * `aria-current="location"` yazar. JavaScript yoksa içindekiler yine
 * çalışır, yalnızca işaret olmaz.
 *
 * Kaydırma dinleyicisi yok; IntersectionObserver ekranın üst bandını
 * izler. Başlık banda girince etkin olur; yukarı kaydırırken bandın
 * ALTINA inen başlık bir öncekine devreder.
 */
const BAND = '-72px 0px -70% 0px'

export function TocSpy({ ids }: { ids: string[] }) {
  useEffect(() => {
    const headings = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc] a[href^="#"]'))
    if (headings.length === 0 || links.length === 0) return

    function mark(id: string | null) {
      for (const link of links) {
        if (id !== null && link.hash === `#${id}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = headings.indexOf(entry.target as HTMLElement)
          if (entry.isIntersecting) {
            mark(entry.target.id)
          } else if (entry.rootBounds && entry.boundingClientRect.top > entry.rootBounds.bottom) {
            mark(index > 0 ? headings[index - 1].id : null)
          }
        }
      },
      { rootMargin: BAND },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [ids])

  return null
}
