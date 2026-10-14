'use client'

import { useEffect, useState } from 'react'
import { copyText } from '@/components/ui/CopyButton'

/**
 * Bölüm bağlantılarının (PostBody → SectionAnchor) davranışı: tıklanınca
 * bölümün adresini panoya kopyalar, adres çubuğuna çapayı yazar ve "Bağlantı
 * Kopyalandı" der. Çizim yapmaz; bağlantılar sunucuda basılı, bu adacık
 * belgedeki tıklamayı yakalar (TocSpy ve ShotViewer ile aynı desen).
 *
 * Neden: çapalar başlıktan türüyor ve paylaşılmak için okunur tutuldu
 * (components/blog/posts.ts → `slugify`), ama okurun o adresi alacağı bir
 * yol yoktu; içindekilerden tıklayıp adres çubuğundan kopyalamak gerekiyordu.
 *
 * Adres kanonik bağlantıdan kurulur (`<link rel="canonical">`): paylaşılan
 * adres her zaman sitenin asıl adresi, yerelde ya da önizlemede açılmış olsa
 * da. JavaScript yoksa bağlantı düz çapa: bölüme gider, adres değişir.
 * Sayfa kaydırılmaz: okur zaten o başlığın üstünde.
 */
const RESET_MS = 1800

export function HeadingAnchors() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    let timer: number | undefined
    let active: HTMLElement | null = null

    async function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-anchor]') : null
      if (!anchor) return
      event.preventDefault()

      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
      const base = canonical || `${location.origin}${location.pathname}`
      const ok = await copyText(`${base}${anchor.hash}`)
      history.replaceState(history.state, '', anchor.hash)

      active?.removeAttribute('data-copied')
      window.clearTimeout(timer)
      active = anchor
      if (ok) anchor.setAttribute('data-copied', '')
      setMessage(ok ? 'Bölümün bağlantısı kopyalandı.' : 'Bağlantı kopyalanamadı; adres çubuğundan kopyalayabilirsin.')
      timer = window.setTimeout(() => {
        anchor.removeAttribute('data-copied')
        setMessage('')
      }, RESET_MS)
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <p className="sr-only" aria-live="polite">
      {message}
    </p>
  )
}
