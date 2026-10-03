'use client'

import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore, type MouseEvent } from 'react'
import { DEFAULT_THEME, type Theme } from '@/lib/theme'
import { readTheme, subscribeTheme, switchTheme } from '@/lib/theme-client'
import { cx } from '@/lib/utils'

/**
 * Tema düğmesi.
 *
 *   <ThemeToggle />
 *
 * Tema `<html data-theme>` özniteliğinde yaşar; bileşen onu DİNLER, kendi
 * durumunu tutmaz. Böylece aynı sayfada iki düğme (başlık ve ⌘K) hep aynı
 * şeyi gösterir. Sunucu anlık görüntüsü varsayılan tema; THEME_SCRIPT
 * özniteliği önceden değiştirdiyse useSyncExternalStore hidrasyondan hemen
 * sonra doğru ikona geçer (`mounted` bekçisi gerekmez).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => DEFAULT_THEME)
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const label = next === 'light' ? 'Açık temaya geç' : 'Koyu temaya geç'

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    // Klavyeyle tetiklenen tıklamada koordinat yok (detail 0): düğmenin ortası.
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.detail > 0 ? event.clientX : box.left + box.width / 2
    const y = event.detail > 0 ? event.clientY : box.top + box.height / 2
    switchTheme(next, { x, y })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cx(
        'inline-grid size-11 place-items-center rounded-full text-body transition-colors hover:bg-surface-raised hover:text-strong pointer-fine:size-9 [&_svg]:size-[1.125rem]',
        className,
      )}
    >
      {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  )
}
