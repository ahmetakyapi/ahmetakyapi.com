import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cx } from '@/lib/utils'

/**
 * Düğme ve düğme görünümlü bağlantı.
 *
 *   <Button variant="secondary" size="md" onClick={…}>Kopyala</Button>
 *   <ButtonLink href="/projeler" variant="primary" size="lg">Projeleri Gör</ButtonLink>
 *   <ButtonLink href="https://github.com/…" external>Kaynak Kod</ButtonLink>
 *   buttonClass({ variant: 'ghost' })   // başka bir öğeye aynı görünüm
 *
 * Varyantlar:
 *   primary   marka degradesi (`bg-cta`). Ekranın TEK birincil eylemi;
 *             ikinci bir primary görüyorsan biri secondary olmalı.
 *   secondary yüzey + çizgi.
 *   ghost     zeminsiz; araç çubukları ve satır içi eylemler.
 * Boylar: sm · md (varsayılan) · lg · icon (kare, yalnızca ikon + aria-label).
 *
 * Yarıçap her yerde `rounded-button` (12px). DOKUNMA HEDEFİ: dokunmatikte
 * her boy en az 44px; `sm` yalnızca hassas işaretçide 36px'e iner.
 * `external` yeni sekmede açar ve `rel="noopener noreferrer"` ekler.
 * `className` sınıf EKLER, çakışanı ezmez (tailwind-merge istemcide yok,
 * bkz. lib/utils.ts): boy ve renk için `size` / `variant` kullan.
 */

const BASE =
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-button font-semibold transition-[background-color,color,border-color,filter,transform] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0'

export const BUTTON_VARIANTS = {
  primary: 'bg-cta text-on-brand shadow-raised hover:brightness-110',
  secondary: 'border border-line-strong bg-surface text-strong hover:border-primary-soft hover:bg-surface-raised',
  ghost: 'text-body hover:bg-primary-wash hover:text-strong',
} as const

export const BUTTON_SIZES = {
  sm: 'min-h-11 px-3 text-small pointer-fine:min-h-9',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-6 text-base',
  icon: 'size-11',
} as const

export type ButtonVariant = keyof typeof BUTTON_VARIANTS
export type ButtonSize = keyof typeof BUTTON_SIZES

export function buttonClass({
  variant = 'secondary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cx(BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)
}

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize }

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Dış bağlantı: yeni sekme + güvenli `rel`. */
  external?: boolean
}

export function ButtonLink({ variant, size, className, external, ...props }: ButtonLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return <Link className={buttonClass({ variant, size, className })} {...externalProps} {...props} />
}
