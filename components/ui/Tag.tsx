import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cx } from '@/lib/utils'

/**
 * Etiket ve süzgeç çipi. Çipler her zaman tam yuvarlak.
 *
 *   <Tag>Next.js 16</Tag>                       // durağan etiket (span)
 *   <Tag as="li" tone="primary">Canlı</Tag>      // liste öğesi, vurgulu
 *   <ChipLink href="/projeler?kategori=oyun" active={seçili}>Oyun</ChipLink>
 *
 * `ChipLink` sayfa içi süzgeç içindir: `scroll={false}` (App Router her
 * gezinmede başa kaydırır) ve etkin olan `aria-current="page"` taşır.
 */
const TONES = {
  neutral: 'border-line bg-surface text-body',
  primary: 'border-transparent bg-primary-wash text-primary-ink',
} as const

const TAG_BASE = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-small font-medium'

type TagProps = {
  children: ReactNode
  tone?: keyof typeof TONES
  as?: 'span' | 'li'
  className?: string
}

export function Tag({ children, tone = 'neutral', as: Element = 'span', className }: TagProps) {
  return <Element className={cx(TAG_BASE, TONES[tone], className)}>{children}</Element>
}

type ChipLinkProps = Omit<ComponentProps<typeof Link>, 'scroll'> & { active?: boolean }

export function ChipLink({ active = false, className, ...props }: ChipLinkProps) {
  return (
    <Link
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors pointer-fine:min-h-9',
        active
          ? 'border-transparent bg-strong text-page'
          : 'border-line bg-surface text-body hover:border-line-strong hover:text-strong',
        className,
      )}
      {...props}
    />
  )
}
