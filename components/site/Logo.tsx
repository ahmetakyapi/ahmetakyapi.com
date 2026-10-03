import { useId } from 'react'
import { cx } from '@/lib/utils'

/**
 * Marka işareti: üçgen, `signature` marka degradesinde karo.
 *
 *   <Logo />                     // 36px
 *   <Logo size={28} />
 *
 * Tek bileşen; başlık, alt bilgi ve 404 aynı işareti çizer. Degrade
 * `id`si `useId` ile benzersiz: eski iki kopya `lg` ve `flg` id'lerini
 * paylaşıyordu ve aynı sayfadaki ikinci SVG birincinin degradesini
 * okuyabiliyordu. Duraklar token'dan (`--brand-from/mid/to`); sekme ikonu
 * (app/icon.svg), apple-icon ve OG (lib/og.tsx) aynı değerleri sabit
 * olarak taşır, çünkü orada CSS değişkeni çözülmez.
 *
 * Dekoratiftir (`aria-hidden`); erişilebilir adı onu saran bağlantı verir.
 */
export function Logo({ size = 36, className }: { size?: number; className?: string }) {
  const id = useId()
  const gradientId = `logo-gradient-${id.replace(/:/g, '')}`

  return (
    <svg
      viewBox="0 0 42 42"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cx('shrink-0', className)}
    >
      <rect width="42" height="42" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M21 12L30 29H12L21 12Z"
        stroke="var(--on-brand)"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <defs>
        {/* 150°lik CSS degradesinin SVG karşılığı: sol üst açık, sağ alt koyu. */}
        <linearGradient id={gradientId} x1="10" y1="0" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--brand-from)' }} />
          <stop offset="0.48" style={{ stopColor: 'var(--brand-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--brand-to)' }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
