'use client'

import { ArrowUp } from 'lucide-react'
import type { MouseEvent } from 'react'
import { cx } from '@/lib/utils'

/**
 * Alt bilginin "Başa Dön" düğmesi.
 *
 * Önceden düz bir `#main-content` bağlantısıydı ve iki sorunu vardı
 * (4 Ekim 2026, iPhone): hedef `<main>`in üstüydü, yapışkan başlık o
 * hattın üstüne bindiği için sayfa en üste değil başlığın ~70 piksel
 * altına iniyor, "Full-Stack & AI Developer" künyesi başlığın arkasında
 * kalıyordu; adrese de `#main-content` ekleniyordu. Şimdi pencere 0'a
 * kayar, odak `<main>`e geçer (klavye ve ekran okuyucu için) ama sayfa
 * odak yüzünden bir daha kaymaz. JavaScript yoksa bağlantı eskisi gibi
 * çalışır.
 *
 * Görünüm: metin bağlantısı düğme olduğunu belli etmiyordu; çerçeveli bir
 * hap, oku dolu bir dairenin içinde.
 */
export function BackToTop({ className }: { className?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <a
      href="#main-content"
      onClick={onClick}
      className={cx(
        'group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-4 pr-1.5 text-sm font-semibold text-strong shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus active:translate-y-0',
        className,
      )}
    >
      Başa Dön
      <span
        aria-hidden="true"
        className="inline-grid size-8 place-items-center rounded-full bg-primary text-on-primary transition-colors duration-300 group-hover:bg-primary-hover"
      >
        <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </span>
    </a>
  )
}
