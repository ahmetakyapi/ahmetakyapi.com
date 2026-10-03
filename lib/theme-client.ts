import { setThemeAction } from '@/app/actions/theme'
import type { Theme } from '@/lib/theme'

/**
 * Temayı değiştir: ThemeToggle ve ⌘K aynı yolu kullanır.
 *
 * Görsel değişim anında (`<html data-theme>`), çerez arkada (server action):
 * sunucuyu beklemek düğmeyi dondururdu. Bir sonraki sunucu çizimi çerezden
 * aynı temayı basar.
 *
 * `origin` verilirse yeni tema o noktadan büyüyen bir dairenin içinde açılır
 * (View Transitions, app/globals.css → `theme-reveal`). Hareketi azaltan
 * okuyucuda ya da API yoksa anında değişir.
 */
let activeTransition: ViewTransition | null = null

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  const apply = () => {
    root.dataset.theme = next
  }
  void setThemeAction(next)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) {
    apply()
    return
  }

  root.style.setProperty('--vt-x', origin ? `${origin.x}px` : '50%')
  root.style.setProperty('--vt-y', origin ? `${origin.y}px` : '0px')
  root.classList.add('theme-switching')

  const transition = document.startViewTransition(apply)
  activeTransition = transition
  /* Üst üste iki tıklamada sınıfı yalnızca SON geçiş kaldırır; yoksa ilk
     geçişin bitişi ikincisi oynarken sınıfı siler ve tarayıcının varsayılan
     çapraz solması araya girer. */
  void transition.finished.finally(() => {
    if (activeTransition !== transition) return
    activeTransition = null
    root.classList.remove('theme-switching')
  })
}

/** `<html data-theme>` değişimini dinler (useSyncExternalStore için). */
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
