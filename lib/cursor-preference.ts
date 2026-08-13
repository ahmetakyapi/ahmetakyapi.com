/**
 * Özel imleç tercihi — VARSAYILAN KAPALI.
 *
 * Neden kapalı: işletim sistemi imleci donanım katmanında çizilir, gecikmesi
 * pratikte sıfırdır. JS ile çizilen bir imleç en iyi ihtimalle bir kare
 * geridedir; Windows'ta compositor gecikmesiyle birlikte 30-50 ms'yi bulur.
 * Üstüne halka kasten yumuşatıldığı için imlecin arkasından süzülür.
 *
 * Sonuç: sayfa hızlı olsa bile "kasıyor" hissi veriyor, çünkü kullanıcının
 * en sık kullandığı geri bildirim döngüsü — el, imleç — bozuluyor. Ölçülen
 * kare süresi bunu göstermiyor; his ölçüme yansımıyor.
 *
 * İsteyen komut paletinden ("Özel İmleci Aç") açabiliyor, tercih kalıcı.
 */
const KEY = 'aa:cursor'
export const CURSOR_PREFERENCE_EVENT = 'cursor-preference:change'

export function isCustomCursorEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(KEY) === 'custom'
}

export function setCustomCursorEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, enabled ? 'custom' : 'system')
  window.dispatchEvent(new CustomEvent(CURSOR_PREFERENCE_EVENT, { detail: enabled }))
}
