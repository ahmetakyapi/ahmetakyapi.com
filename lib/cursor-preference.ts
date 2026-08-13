/**
 * Özel imleç tercihi.
 *
 * İmleci gizlemek herkes için doğru değil: motor becerisi kısıtlı olan ya da
 * sistem imlecini büyütmüş kullanıcılar için doğrudan engel. Kapatma yolu
 * komut paletinde ("Özel İmleci Kapat") ve tercih localStorage'da kalıyor.
 */
const KEY = 'aa:cursor'
export const CURSOR_PREFERENCE_EVENT = 'cursor-preference:change'

export function isCustomCursorEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(KEY) !== 'system'
}

export function setCustomCursorEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, enabled ? 'custom' : 'system')
  window.dispatchEvent(new CustomEvent(CURSOR_PREFERENCE_EVENT, { detail: enabled }))
}
