/**
 * Kara kalem çizgileri: elle çizilmiş gibi duran küçük SVG'ler.
 *
 * Açılış Zili'nin mürekkep sahnelerinden (lib/ink) esinlenen, çok daha
 * hafif bir dil: tuval yok, JavaScript yok. Her çizgi iki geçişten oluşur:
 * biri tam, öteki biraz kaymış ve ince; kurşun kalemin iki kez üstünden
 * geçilmiş izi gibi okunur. Çizim hareketi CSS'te (globals.css → "Kara
 * Kalem"): `pathLength=1` sayesinde her yol 0'dan 1'e aynı sürede çizilir.
 *
 * Hepsi süs: `aria-hidden`. Renk `currentColor`, rengi kullanan yer verir.
 */

/** Kelimenin altında el çizimi alt çizgi. Kabın genişliğine uzar. */
export function SketchUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`sketch sketch-underline ${className ?? ''}`}
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      focusable="false"
    >
      <path pathLength={1} d="M3 10.5C38 5.5 86 4 128 6.5c26 1.6 46 3.2 69 1.2" />
      <path pathLength={1} className="sketch-second" d="M9 13c44-4.2 98-5 186-4.4" />
    </svg>
  )
}

/** Yukarı kıvrılan küçük ok: bir ipucunu bir nesneye bağlar. */
export function SketchArrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`sketch sketch-arrow ${className ?? ''}`} viewBox="0 0 48 40" focusable="false">
      <path pathLength={1} d="M5 35c9-1 18-6 24-14 4-5 6-10 7-16" />
      <path pathLength={1} className="sketch-tip" d="M29 10l7-6 4 9" />
    </svg>
  )
}

/** Marka üçgeni, kara kalemle: yükleme işareti. Döngüde çizilip silinir. */
export function SketchMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`sketch sketch-mark ${className ?? ''}`} viewBox="0 0 40 40" focusable="false">
      <path pathLength={1} d="M20 6.5L33.5 32.5H6.5Z" />
      <path pathLength={1} className="sketch-second" d="M19.2 8.4 32 33.4 7.6 31.6 19.6 7.2" />
    </svg>
  )
}
