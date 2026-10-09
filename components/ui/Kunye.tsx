import { Fragment, type ReactNode } from 'react'
import { cx } from '@/lib/utils'

/**
 * Künye: küçük puntolu (13 px, orta kalınlık) bilgi satırı ya da ızgarası.
 * 9 Ekim 2026: mono'dan gövde yazısına geçti; küçük mono künye okunmuyordu.
 * Rakamlar `tabular-nums` ile hizalı.
 *
 *   <KunyeLine items={['3 Ekim 2026', '8 Dakika']} />
 *     → "3 Ekim 2026 · 8 Dakika" (ayraç `·`, boş öğeler atlanır)
 *
 *   <KunyeGrid
 *     columns={4}                 // telefonda her zaman 2
 *     items={[
 *       { label: 'Ne Yapıyorum', value: 'Full-Stack & AI Developer' },
 *       { label: 'Şu An', value: <Link href="/projeler/acilis-zili">Açılış Zili</Link> },
 *     ]}
 *   />
 *     → <dl>; etiket soluk ve orta kalın, değer gövde rengi. Hücreler hairline ile
 *       ayrılır, kutu açılmaz.
 *
 * Künye metni Title Case ("8 Dakika", "Kaynak Kod"); cümle değil.
 *
 * Künyedeki bağlantılar küçük puntolu metin; kaba imleçte `tap-y` ile
 * 44 piksellik vuruş alanı alırlar (görünüm değişmez). Kendi `min-h-11`i
 * olan bağlantı (ör. proje detayındaki Canlı Site) hariç.
 */
const LINK_TARGETS = '[&_a:not(.min-h-11)]:tap-y'
export function KunyeLine({ items, className }: { items: ReactNode[]; className?: string }) {
  const visible = items.filter((item) => item !== null && item !== undefined && item !== false && item !== '')
  return (
    <p className={cx('flex flex-wrap items-center gap-x-2 gap-y-1 text-small font-medium tabular-nums text-muted', LINK_TARGETS, className)}>
      {visible.map((item, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <span aria-hidden="true" className="text-line-strong">
              ·
            </span>
          ) : null}
          <span>{item}</span>
        </Fragment>
      ))}
    </p>
  )
}

export type KunyeItem = { label: ReactNode; value: ReactNode }

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const

export function KunyeGrid({
  items,
  columns = 4,
  className,
}: {
  items: KunyeItem[]
  columns?: keyof typeof COLUMNS
  className?: string
}) {
  return (
    <dl className={cx('grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5', COLUMNS[columns], className)}>
      {items.map((item, i) => (
        <div key={i} className="min-w-0">
          <dt className="text-small font-medium text-muted">{item.label}</dt>
          <dd className={cx('mt-1.5 text-sm text-strong', LINK_TARGETS)}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
