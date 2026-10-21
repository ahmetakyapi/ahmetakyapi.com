import { DEFAULT_THEME, THEME_COLOR, THEME_COOKIE, THEME_COOKIE_MAX_AGE, isTheme, type Theme } from '@/lib/theme'

/**
 * Temayı değiştir: ThemeToggle ve ⌘K aynı yolu kullanır.
 *
 * Görsel değişim anında (`<html data-theme>`), çerezi tarayıcı kendisi
 * yazar. Sunucu çerezi hiç okumuyor (sayfalar statik, lib/theme.ts); okuyan
 * yalnızca bir sonraki yüklemedeki THEME_SCRIPT. Eskiden çerez bir server
 * action ile yazılıyordu: Next çerez yazan eylemi yeniden doğrulama sayıp
 * her tıklamada sayfayı fonksiyonda baştan çiziyor ve istemcinin ön
 * yükleme önbelleğini siliyordu.
 *
 * `origin` verilirse yeni tema o noktadan büyüyen bir dairenin içinde açılır
 * (View Transitions, app/globals.css → `theme-reveal`). Hareketi azaltan
 * okuyucuda ya da API yoksa anında değişir.
 */
let activeTransition: ViewTransition | null = null

export function readTheme(): Theme {
  const value = document.documentElement.dataset.theme
  return isTheme(value) ? value : DEFAULT_THEME
}

function writeThemeCookie(theme: Theme) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

export function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  const apply = () => {
    root.dataset.theme = next
    // Tarayıcı çubuğu da siteyle döner; etiketi THEME_SCRIPT oluşturur.
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
  }
  writeThemeCookie(next)

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
