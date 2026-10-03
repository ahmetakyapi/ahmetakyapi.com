'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { PaletteLink } from '@/components/site/CommandPalette'

/**
 * ⌘K komut paletinin açıcısı: ilk yükte yalnızca bu küçük dinleyici var.
 *
 *   <CommandPaletteLauncher projects={…} posts={…} />   // (site)/layout.tsx
 *
 * Açılış yolları: ⌘K / Ctrl+K, başlıktaki düğme (`command-palette:open`
 * olayı) ve G H / G P / G B kısayolları (iki tuş, 800 ms içinde).
 *
 * Paletin kendisi (ikonlar, arama, liste) tembel: tarayıcı boşta kalınca
 * önden indirilir, ilk açılışta hazır olur. Ölçüldü: palet ilk yükteyken
 * her sayfa ~5 KB (gzip) fazladan taşıyordu.
 */
const CommandPalette = dynamic(() => import('@/components/site/CommandPalette'), { ssr: false })

/** İki tuşluk dizinin (G sonra H) tamamlanma süresi. */
const SEQUENCE_MS = 800
const SEQUENCES: Record<string, string> = { h: '/', p: '/projeler', b: '/blog' }

export function CommandPaletteLauncher({ projects, posts }: { projects: PaletteLink[]; posts: PaletteLink[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  /* Boşta kalınca paleti önden indir: ilk ⌘K beklemesin. */
  useEffect(() => {
    const preload = () => void import('@/components/site/CommandPalette')
    // Safari'de requestIdleCallback yok: kısa bir gecikmeyle aynı iş.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(preload, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(preload, 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let lastKey = ''
    let lastKeyAt = 0

    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (open) return

      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const now = Date.now()
      if (lastKey === 'g' && now - lastKeyAt < SEQUENCE_MS) {
        const href = SEQUENCES[e.key.toLowerCase()]
        if (href) {
          e.preventDefault()
          router.push(href)
        }
        lastKey = ''
        return
      }
      lastKey = e.key.toLowerCase() === 'g' ? 'g' : ''
      lastKeyAt = now
    }

    function onOpenRequest() {
      setOpen(true)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('command-palette:open', onOpenRequest)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('command-palette:open', onOpenRequest)
    }
  }, [open, router])

  return open ? <CommandPalette projects={projects} posts={posts} onClose={() => setOpen(false)} /> : null
}
