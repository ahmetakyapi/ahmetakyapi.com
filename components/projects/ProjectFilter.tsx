'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { FILTER_PARAM, GROUP_LABELS, LIST_ID, isProjectGroup } from '@/components/projects/project-text'
import { PROJECT_GROUPS, type ProjectGroup } from '@/lib/content/types'
import { cx } from '@/lib/utils'

/**
 * /projeler süzgeci: adres parametresi (`?kategori=oyun`), `scroll={false}`.
 *
 * Sayfa STATİK kalsın diye süzgeç sunucuda değil burada: `searchParams`
 * okuyan bir sayfa her istekte yeniden çizilir. Satırların tamamı HTML'de;
 * bu ada yalnız listeye `data-filter` yazıyor ve gizleme CSS'te
 * (projects.css). JavaScript yoksa ya da ada henüz yüklenmediyse bütün
 * projeler görünür, hiçbir şey kaybolmaz.
 *
 * Görünüm çip değil METİN SEKMESİ: dört kutu yan yana listenin üstünde
 * ikinci bir başlık gibi duruyordu. Seçili olan koyu ve altı çizili, sayı
 * yanında sessiz tonda. Bilinmeyen değer ("?kategori=xyz") "Tümü" sayılır.
 */
type Counts = Record<ProjectGroup | 'all', number>

export function ProjectFilter({ counts }: { counts: Counts }) {
  const raw = useSearchParams().get(FILTER_PARAM)
  const active = isProjectGroup(raw) ? raw : null

  useEffect(() => {
    document.getElementById(LIST_ID)?.setAttribute('data-filter', active ?? 'all')
  }, [active])

  return (
    <>
      <FilterTabs active={active} counts={counts} />
      <p className="sr-only" aria-live="polite">
        {active ? `${GROUP_LABELS[active]}: ${counts[active]} Proje` : `Tümü: ${counts.all} Proje`}
      </p>
    </>
  )
}

/** Sunucu çiziminde (Suspense yedeği) ve istemcide aynı sekmeler. */
export function FilterTabs({ active, counts }: { active: ProjectGroup | null; counts: Counts }) {
  return (
    <nav aria-label="Projeleri süz" className="tabs">
      <Tab href="/projeler" active={active === null} label="Tümü" count={counts.all} />
      {PROJECT_GROUPS.map((group) => (
        <Tab
          key={group}
          href={`/projeler?${FILTER_PARAM}=${group}`}
          active={active === group}
          label={GROUP_LABELS[group]}
          count={counts[group]}
        />
      ))}
    </nav>
  )
}

function Tab({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link href={href} scroll={false} aria-current={active ? 'page' : undefined} className={cx('tab', active && 'is-active')}>
      {label}
      <span className="tab-count">{count}</span>
    </Link>
  )
}
