import type { ComponentProps, ElementType } from 'react'
import { cx } from '@/lib/utils'

/**
 * Sayfa kabı: yatay ölçü ve kenar boşluğu tek yerden.
 *
 *   <Container>…</Container>                    // 72rem, varsayılan
 *   <Container size="wide" as="section">…</Container>
 *   <Container size="read">…</Container>         // yazı gövdesi, ~68ch
 *
 * Kenar boşluğu telefonda 16px, `sm` üstünde 24px, `lg` üstünde 32px;
 * çentikli telefonda güvenli alanı da hesaba katar.
 */
const SIZES = {
  read: 'max-w-[46rem]',
  default: 'max-w-6xl',
  wide: 'max-w-[88rem]',
} as const

type ContainerProps<T extends ElementType> = {
  as?: T
  size?: keyof typeof SIZES
} & Omit<ComponentProps<T>, 'as'>

export function Container<T extends ElementType = 'div'>({
  as,
  size = 'default',
  className,
  ...props
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? 'div'
  return (
    <Tag
      className={cx(
        'mx-auto w-full px-[max(1rem,env(safe-area-inset-left))] sm:px-6 lg:px-8',
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
