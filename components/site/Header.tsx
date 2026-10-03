'use client'

import { Command, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Logo } from '@/components/site/Logo'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { JOB_TITLE, NAV_ITEMS } from '@/lib/nav'
import { cx } from '@/lib/utils'

/** Bu kadar kaydırınca başlık cam yüzeye geçer; en üstte zemin saydam. */
const SCROLL_GLASS_AT = 8

/** /blog/bir-yazi da "Blog" sekmesini işaretlesin. */
function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Site başlığı: yapışkan, tek satır, 64px.
 *
 * Cam yüzey İSTEĞE BAĞLI: sayfanın en üstünde başlık zeminle aynı; içerik
 * altından geçmeye başlayınca `.glass` (desteklenmiyorsa ya da saydamlık
 * azaltılmışsa opak). Rota geçişinde başlık sabit kalır (`.vt-header`).
 *
 * Mobil menü: açılınca odak ilk bağlantıya gider, Tab menünün içinde
 * döner (menü düğmesi dahil), Esc ve dışarı tıklama kapatır, kapanınca
 * odak menü düğmesine döner. Menü açıldığı adrese bağlı: gezinme olunca
 * kendiliğinden kapanır (efekt içinde durum yazmadan).
 */
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null)
  const menuOpen = menuOpenAt === pathname

  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  /* Aktif bağlantının konumunu ölçüp göstergeyi oraya taşıyor. */
  const positionPill = useCallback(() => {
    const nav = navRef.current
    const pill = pillRef.current
    if (!nav || !pill) return
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]')
    if (!active) {
      pill.style.opacity = '0'
      return
    }
    pill.style.opacity = '1'
    pill.style.setProperty('--pill-x', `${active.offsetLeft}px`)
    pill.style.setProperty('--pill-w', `${active.offsetWidth}px`)
  }, [])

  useEffect(() => {
    positionPill()
    // İlk yerleşimden sonra geçişi aç: sayfa açılırken gösterge kaymasın.
    const t = window.setTimeout(() => pillRef.current?.removeAttribute('data-first'), 60)
    return () => window.clearTimeout(t)
  }, [pathname, positionPill])

  useEffect(() => {
    window.addEventListener('resize', positionPill)
    // Font geç yüklenirse bağlantı genişliği değişir; gösterge de uysun.
    void document.fonts?.ready.then(positionPill)
    return () => window.removeEventListener('resize', positionPill)
  }, [positionPill])

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      setScrolled(window.scrollY > SCROLL_GLASS_AT)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpenAt(null)
    if (restoreFocus) menuButtonRef.current?.focus()
  }, [])

  /* Açılışta odak ilk bağlantıya; dışarı tıklama kapatır. */
  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()

    function onPointer(event: PointerEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return
      closeMenu(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [menuOpen, closeMenu])

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(true)
      return
    }
    if (event.key !== 'Tab' || !menuRef.current || !menuButtonRef.current) return
    const focusables = [menuButtonRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a')]
    const index = focusables.indexOf(document.activeElement as HTMLElement)
    const nextIndex = event.shiftKey ? index - 1 : index + 1
    event.preventDefault()
    focusables[(nextIndex + focusables.length) % focusables.length]?.focus()
  }

  return (
    <header
      className={cx(
        'vt-header sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color]',
        scrolled ? 'glass' : 'border-transparent bg-page',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between gap-4 px-[max(1rem,env(safe-area-inset-left))] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-h-11 min-w-11 items-center gap-3 rounded-button pointer-fine:min-h-9 pointer-fine:min-w-9"
          aria-label="Ahmet Akyapı, ana sayfa"
        >
          <Logo size={36} className="transition-transform group-hover:scale-105" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-semibold tracking-[-0.01em] text-strong">Ahmet Akyapı</span>
            <span className="mt-1 font-mono text-micro text-muted">{JOB_TITLE}</span>
          </span>
        </Link>

        <nav
          ref={navRef}
          aria-label="Ana gezinme"
          className="relative hidden items-center rounded-full border border-line bg-surface p-1 md:flex"
        >
          <span ref={pillRef} className="nav-pill" data-first aria-hidden="true" />
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  active ? 'text-strong' : 'text-body hover:text-strong',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('command-palette:open'))}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-small text-body transition-colors hover:border-line-strong hover:text-strong sm:inline-flex"
            aria-label="Komut paletini aç"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <Command className="size-3.5" aria-hidden="true" />
            <span>K</span>
          </button>

          <ThemeToggle />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (menuOpen ? closeMenu(false) : setMenuOpenAt(pathname))}
            onKeyDown={menuOpen ? onMenuKeyDown : undefined}
            className="inline-grid size-11 place-items-center rounded-full text-body transition-colors hover:bg-surface-raised hover:text-strong md:hidden"
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
            aria-controls="mobil-menu"
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobil-menu"
          ref={menuRef}
          onKeyDown={onMenuKeyDown}
          className="panel-in absolute inset-x-0 top-full px-4 pt-2 md:hidden"
        >
          <nav
            aria-label="Mobil gezinme"
            className="overflow-hidden rounded-card border border-line bg-surface-solid p-2 shadow-floating"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => closeMenu(false)}
                  className={cx(
                    'flex min-h-12 items-center rounded-button px-4 text-base font-medium transition-colors',
                    active ? 'bg-primary-wash text-strong' : 'text-body hover:bg-surface-raised hover:text-strong',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
