'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { FILTER_PARAM, GRID_ID, GROUP_LABELS, isProjectGroup } from '@/components/projects/project-text'
import { ChipLink } from '@/components/ui/Tag'
import { PROJECT_GROUPS, type ProjectGroup } from '@/lib/content/types'

/**
 * /projeler süzgeci: adres parametresi (`?kategori=oyun`), `scroll={false}`.
 *
 * Sayfa STATİK kalsın diye süzgeç sunucuda değil burada: `searchParams`
 * okuyan bir sayfa her istekte yeniden çizilir. Kartların tamamı HTML'de;
 * bu ada yalnız ızgaraya `data-filter` yazıyor ve gizleme CSS'te
 * (projects.css). JavaScript yoksa ya da ada henüz yüklenmediyse bütün
 * projeler görünür, hiçbir şey kaybolmaz.
 *
 * Bilinmeyen değer ("?kategori=xyz") "Tümü" sayılır.
 */
type Counts = Record<ProjectGroup | 'all', number>

export function ProjectFilter({ counts }: { counts: Counts }) {
  const raw = useSearchParams().get(FILTER_PARAM)
  const active = isProjectGroup(raw) ? raw : null

  useEffect(() => {
    document.getElementById(GRID_ID)?.setAttribute('data-filter', active ?? 'all')
  }, [active])

  return (
    <>
      <FilterChips active={active} counts={counts} />
      <p className="sr-only" aria-live="polite">
        {active ? `${GROUP_LABELS[active]}: ${counts[active]} Proje` : `Tümü: ${counts.all} Proje`}
      </p>
    </>
  )
}

/** Sunucu çiziminde (Suspense yedeği) ve istemcide aynı çipler. */
export function FilterChips({ active, counts }: { active: ProjectGroup | null; counts: Counts }) {
  return (
    <nav aria-label="Projeleri süz" className="flex flex-wrap gap-2">
      <ChipLink href="/projeler" active={active === null}>
        Tümü <Count n={counts.all} active={active === null} />
      </ChipLink>
      {PROJECT_GROUPS.map((group) => (
        <ChipLink key={group} href={`/projeler?${FILTER_PARAM}=${group}`} active={active === group}>
          {GROUP_LABELS[group]} <Count n={counts[group]} active={active === group} />
        </ChipLink>
      ))}
    </nav>
  )
}

/* Sayı `opacity-70` ile soluyordu ve seçili olmayan çipte AA'nın altına
   düşüyordu; artık sessiz metin rengi. Seçili çipin zemini koyu (açık
   temada) ya da açık (koyu temada): orada çipin kendi rengini alır. */
function Count({ n, active }: { n: number; active: boolean }) {
  return <span className={active ? 'ml-1.5 font-mono text-small' : 'ml-1.5 font-mono text-small text-muted'}>{n}</span>
}
