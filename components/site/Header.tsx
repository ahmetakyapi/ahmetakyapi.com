'use client'

import { Command, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Logo } from '@/components/site/Logo'
import { Signature } from '@/components/site/Signature'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { NAV_ITEMS } from '@/lib/nav'
import { cx } from '@/lib/utils'

/** Bu kadar kaydırınca başlık cam yüzeye geçer; en üstte zemin saydam. */
const SCROLL_GLASS_AT = 8

/** /blog/bir-yazi da "Blog" sekmesini işaretlesin. */
function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/* Görünüşte bölüm etkin, ekran okuyucuya ayrım: "geçerli sayfa" yalnız
   tam eşleşmede; yazının içindeyken Blog bağlantısı "geçerli" (`true`). */
function currentOf(pathname: string, href: string) {
  return pathname === href ? 'page' : isActive(pathname, href) ? 'true' : undefined
}

/**
 * Site başlığı: yapışkan, tek satır, 64px.
 *
 * Cam yüzey İSTEĞE BAĞLI: sayfanın en üstünde başlık zeminle aynı; içerik
 * altından geçmeye başlayınca `.glass` (desteklenmiyorsa ya da saydamlık
 * azaltılmışsa opak). Rota geçişinde başlık sabit kalır (`.vt-header`).
 *
 * Mobil menü: açılınca odak ilk öğeye (arama) gider, Tab menünün içinde
 * döner (menü düğmesi dahil), Esc ve dışarı tıklama kapatır, kapanınca
 * odak menü düğmesine döner. Menü açıldığı adrese bağlı: gezinme olunca
 * kendiliğinden kapanır (efekt içinde durum yazmadan).
 *
 * Telefonda arama mobil menünün başında (14 Ekim 2026): ⌘K hapı yalnız
 * 640 piksel üstünde görünüyor ve palet telefonda hiç açılamıyordu; proje
 * ya da yazı aramak için tek yol listeyi kaydırmaktı. Başlığa ayrı bir
 * büyüteç denendi: 390 pikselde imzanın üstüne biniyordu (ölçüldü, 17 px).
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
    const active = nav.querySelector<HTMLElement>('[aria-current]')
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

  /* Açılışta odak ilk öğeye (arama); dışarı tıklama kapatır. */
  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus()

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
    const focusables = [menuButtonRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a, button')]
    const index = focusables.indexOf(document.activeElement as HTMLElement)
    const nextIndex = event.shiftKey ? index - 1 : index + 1
    event.preventDefault()
    focusables[(nextIndex + focusables.length) % focusables.length]?.focus()
  }

  /* Menüden açılınca odak önce menü düğmesine döner: palet kapanınca
     odağı açıldığı öğeye geri veriyor ve menüdeki düğme o an sökülmüş
     olurdu (odak sayfanın başına düşerdi). */
  function openPalette(fromMenu = false) {
    if (fromMenu) closeMenu(true)
    window.dispatchEvent(new CustomEvent('command-palette:open'))
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
          {/* Unvan burada yok: hero'nun üst satırında zaten yazıyor ve iki
              yerde aynı metin duruyordu (3 Ekim 2026). */}
          <Signature className="header-signature" />
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
                aria-current={currentOf(pathname, item.href)}
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
            onClick={() => openPalette()}
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
            {/* Arama kutusu görünümünde düğme: dokununca menü kapanır, ⌘K
                paleti açılır (yazmaya hazır). Metin paletin kendi arama
                kutusuyla aynı. Odak döngüsünde (onMenuKeyDown) ilk sırada. */}
            <button
              type="button"
              onClick={() => openPalette(true)}
              className="mb-1 flex min-h-12 w-full items-center gap-3 rounded-button border border-line bg-surface px-4 text-left text-base text-muted transition-colors hover:border-line-strong hover:text-strong"
            >
              <Search className="size-[1.125rem] shrink-0" aria-hidden="true" />
              Sayfa, proje ya da yazı ara
            </button>
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={currentOf(pathname, item.href)}
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
