import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

/**
 * Bölüm başlığı: üst satır (künye) + başlık + tek cümle + sağda tek eylem.
 *
 *   <SectionHeading
 *     id="son-yazilar"            // başlığın id'si; bölüm aria-labelledby ile bağlar
 *     kunye="03 · Yazılar"        // isteğe bağlı üst satır (Title Case)
 *     title="Son Yazılar"
 *     description="Yaptıklarımdan çıkan notlar."
 *     action={<ButtonLink href="/blog" variant="ghost">Tümü</ButtonLink>}
 *     as="h2"                     // sayfa başlığıysa "h1"
 *     size="section"              // "page" daha büyük
 *   />
 *
 * Eyebrow tavanı: künye yalnızca bilgi taşıyorsa verilir, süs için değil.
 * 9 Ekim 2026: künye mono 13 pikselden gövde yazısına, 15 piksel yarı
 * kalına ve gövde rengine geçti; küçük mono üst satır okunmuyordu.
 */
type SectionHeadingProps = {
  title: ReactNode
  id?: string
  kunye?: ReactNode
  description?: ReactNode
  action?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  /** `home`: ana sayfanın büyük bölüm başlığı, stili app/(site)/home.css → `.home-title`. */
  size?: 'section' | 'page' | 'home'
  className?: string
}

export function SectionHeading({
  title,
  id,
  kunye,
  description,
  action,
  as: Heading = 'h2',
  size = 'section',
  className,
}: SectionHeadingProps) {
  return (
    <header className={cx('flex flex-wrap items-end justify-between gap-x-8 gap-y-4', className)}>
      <div className="min-w-0 max-w-3xl">
        {kunye ? <p className="mb-3 text-[0.9375rem] leading-snug font-semibold text-body">{kunye}</p> : null}
        <Heading
          id={id}
          className={cx(
            'font-semibold tracking-[-0.03em] text-strong',
            size === 'home'
              ? 'home-title'
              : size === 'page'
                ? 'text-display'
                : 'text-heading sm:text-[2.25rem] sm:leading-[1.1]',
          )}
        >
          {title}
        </Heading>
        {description ? <p className="mt-4 max-w-2xl text-read text-body">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}
