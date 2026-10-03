import { useId } from 'react'
import { SIGNATURE_NAME } from '@/lib/brand/signature'
import { cx } from '@/lib/utils'

/**
 * "Ahmet Akyapı" imzası: başlıkta logonun yanındaki ad (3 Ekim 2026).
 * Harfler SVG yolu (lib/brand/signature.ts), yazı tipi yüklenmez. Dolgu
 * başlıklardaki mürekkeple aynı degrade (`--sig-from` → `--sig-to`).
 *
 * Sayfa açılınca imza soldan sağa "yazılır" (globals.css → `.signature`):
 * kalem kâğıtta ilerliyormuş gibi bir maske açılır. Başlık rota
 * değişince yeniden çizilmediği için yalnız ilk açılışta oynar.
 * Dekoratif; erişilebilir ad onu saran bağlantıda.
 */
export function Signature({ className }: { className?: string }) {
  const id = useId()
  const gradientId = `sig-${id.replace(/:/g, '')}`
  return (
    <svg
      viewBox={SIGNATURE_NAME.viewBox}
      aria-hidden="true"
      focusable="false"
      className={cx('signature', className)}
      style={{ aspectRatio: `${SIGNATURE_NAME.width} / ${SIGNATURE_NAME.height}` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--sig-from)' }} />
          <stop offset="1" style={{ stopColor: 'var(--sig-to)' }} />
        </linearGradient>
      </defs>
      <path d={SIGNATURE_NAME.d} fill={`url(#${gradientId})`} />
    </svg>
  )
}
