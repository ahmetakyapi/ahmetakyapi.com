'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SketchMark } from '@/components/ui/Sketch'

/**
 * Gezinme göstergesi: başlığın altında ince, süresiz bir çizgi; yalnız
 * gezinme SHOW_AFTER_MS'yi geçerse.
 *
 *   <RouteProgress />   // (site)/layout.tsx, bir kez
 *
 * Site statik ve sayfalar önden yükleniyor: çoğu gezinme 100 ms'nin
 * altında biter. Her tıklamada yanıp sönen bir çizgi arayüzü seğiriyor gibi
 * gösterirdi; çizgi yalnız okuyucu gerçekten bekliyorsa çıkar.
 * Yüzde göstermez (kalan süreyi bilmiyoruz). Desen Açılış Zili'nden
 * (components/layout/RouteProgress.tsx), sadeleşmiş hâli.
 *
 * Bağlantılar tek tek sarılmıyor: belge yakalama evresinde dinleniyor,
 * sunucu bileşenlerindeki `<Link>`ler de kapsanıyor. Aynı yolun yalnız
 * sorgusunu değiştiren bağlantı (projeler süzgeci, `scroll={false}`)
 * gezinme sayılmaz: sayfa yerinde kalıyor, çizgi gereksiz. Uzantılı adres
 * (`/rss.xml`) de sayılmaz: rota değil dosya; tarayıcı onu indirirse
 * sayfa hiç değişmez ve çizgi frene kadar yanardı.
 *
 * Koddan gezinme (`router.push`: ⌘K, G kısayolları) tıklama değil; onlar
 * `route-progress:start` olayını adresle birlikte yollar, aynı süzgeçten
 * geçer.
 *
 * TUZAK (Açılış Zili): Next'in yamalı `history.replaceState`i uçuştaki
 * gezinmeyi sessizce iptal eder ve yol hiç değişmez. Çizgi o durumda
 * sönmezdi; MAX_RUN_MS emniyet freni bunun için.
 *
 * Geri/ileri tuşu (`popstate`): `<html data-nav-pop>` kısa süre için konur
 * ve rota geçişi perde silme yerine yalnız solma oynar (globals.css).
 * `useSearchParams` OKUNMAZ: okusaydı rota statik ön çizimden düşerdi.
 */
const SHOW_AFTER_MS = 300
const MAX_RUN_MS = 8000
/** Geri tuşu işaretinin ömrü: geçişin başlaması için yeterli, sonraki tıklamaya taşmayacak kadar kısa. */
const POP_FLAG_MS = 700

export function RouteProgress() {
  const pathname = usePathname()
  /* Çizgi hangi yoldan AYRILIRKEN açıldı. Yol değişince çizimde sıfırlanır
     (efekt içinde durum yazmadan): sıfırlanmasaydı aynı sayfaya hızlıca
     geri dönüşte eşleşme yeniden tutar ve çizgi takılı kalırdı. */
  const [shownAt, setShownAt] = useState<string | null>(null)
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setShownAt(null)
  }
  const settled = useRef(pathname)
  const timers = useRef<{ show: number; brake: number }>({ show: 0, brake: 0 })

  useEffect(() => {
    const clear = () => {
      window.clearTimeout(timers.current.show)
      window.clearTimeout(timers.current.brake)
    }
    const start = () => {
      clear()
      timers.current.show = window.setTimeout(() => setShownAt(settled.current), SHOW_AFTER_MS)
      timers.current.brake = window.setTimeout(() => {
        clear()
        setShownAt(null)
      }, MAX_RUN_MS)
    }

    const startFor = (href: string) => {
      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      // Aynı yol (çapa ya da yalnız sorgu): gezinme değil, çizgi hiç sönmezdi.
      if (url.pathname === window.location.pathname) return
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return
      start()
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!anchor || anchor.hasAttribute('download')) return
      const target = anchor.getAttribute('target')
      if (target && target !== '_self') return
      startFor(anchor.href)
    }

    const onStartRequest = (event: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === 'string') startFor(event.detail)
    }

    let popTimer = 0
    const onPop = () => {
      const root = document.documentElement
      root.setAttribute('data-nav-pop', '')
      window.clearTimeout(popTimer)
      popTimer = window.setTimeout(() => root.removeAttribute('data-nav-pop'), POP_FLAG_MS)
      if (window.location.pathname !== settled.current) start()
    }

    document.addEventListener('click', onClick, { capture: true })
    window.addEventListener('popstate', onPop)
    window.addEventListener('route-progress:start', onStartRequest)
    return () => {
      clear()
      window.clearTimeout(popTimer)
      document.removeEventListener('click', onClick, { capture: true })
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('route-progress:start', onStartRequest)
    }
  }, [])

  /* Hedef sayfa bağlandı: iş bitti. */
  useEffect(() => {
    if (pathname === settled.current) return
    settled.current = pathname
    window.clearTimeout(timers.current.show)
    window.clearTimeout(timers.current.brake)
  }, [pathname])

  /* Çizginin yanında altta küçük bir hap: marka üçgeni kara kalemle çizilip
     silinir. Okuyucu beklediğini görür; yüzde yok (kalan süreyi bilmiyoruz).
     Ekran okuyucu için durum bölgesi HEP yerinde, yalnız metni değişir:
     bölge metniyle birlikte eklenince çoğu okuyucu onu duyurmuyor. */
  const showing = shownAt === pathname
  return (
    <>
      <span role="status" className="sr-only">
        {showing ? 'Yükleniyor' : ''}
      </span>
      {showing ? (
        <>
          <span aria-hidden="true" className="route-progress" />
          <span aria-hidden="true" className="route-loader">
            <SketchMark />
            <span>Yükleniyor</span>
          </span>
        </>
      ) : null}
    </>
  )
}
