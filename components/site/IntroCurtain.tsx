/**
 * Açılış perdesi: marka karosu kendini çizer, isim maskeden yükselir, perde
 * yukarı kalkar ve kahramanın harf girişi perdenin altından devam eder.
 *
 *   <IntroCurtain />   // kök layout'ta, <body>'nin ilk çocuğu
 *
 * Sunucu bileşeni, sıfır JavaScript. Varsayılan `display: none`; yalnız
 * `<html data-intro>` varken görünür (lib/intro.ts → INTRO_SCRIPT, hangi
 * durumda konduğu orada). Sayfa arkada zaten çizili: perde içeriği
 * bekletmez, üstünde 1,2 saniye durup kalkar. İşaretçiyi tutmaz.
 *
 * Zaman çizelgesi (app/globals.css → "Açılış perdesi"):
 *     0-340 ms  karonun kenarı çizilir
 *   300-580 ms  karo marka degradesiyle dolar
 *   300-740 ms  üçgen çizilir, isim maskeden yükselir
 *   760-1180 ms perde kalkar; kahraman harfleri 760'ta yükselmeye başlar
 *
 * Neden: ilk ziyarette okuyucuya "kimin sitesindesin" bir kez, sakin
 * söylenir; ikinci yüklemede ve sonraki gezinmelerde hiç yok.
 * Dekoratif: `aria-hidden`, isim zaten sayfanın `h1`i.
 */
export function IntroCurtain() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <svg viewBox="0 0 42 42" width="56" height="56" fill="none" className="intro-mark" focusable="false">
          <defs>
            <linearGradient id="intro-gradient" x1="10" y1="0" x2="32" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0" style={{ stopColor: 'var(--brand-from)' }} />
              <stop offset="0.48" style={{ stopColor: 'var(--brand-mid)' }} />
              <stop offset="1" style={{ stopColor: 'var(--brand-to)' }} />
            </linearGradient>
          </defs>
          <rect className="intro-tile" x="1" y="1" width="40" height="40" rx="11.5" pathLength={1} />
          <rect className="intro-fill" width="42" height="42" rx="12" fill="url(#intro-gradient)" />
          <path className="intro-tri" d="M21 12L30 29H12L21 12Z" pathLength={1} />
        </svg>
        <p className="intro-name">
          <span>Ahmet Akyapı</span>
        </p>
      </div>
    </div>
  )
}
