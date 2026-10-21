'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { similarity } from '@/lib/search'

/**
 * 404'te "Bunu mu arıyordun?": adresin son parçasına en çok benzeyen proje
 * ya da yazı (lib/search.ts → `similarity`).
 *
 * Neden: 404'e gelenlerin çoğu bozuk bir bağlantıyla geliyor; elle yazılmış
 * ya da kesilmiş bir adres ("/projeler/acilizili", "/blog/acilis-zili-nasil")
 * ya da eski bir slug. Sayfa yalnız "Ana Sayfa" diyordu; okur aradığını
 * listede baştan bulmak zorundaydı.
 *
 * Sayfa statik, adres yalnız tarayıcıda biliniyor: öneri hidrasyondan sonra
 * belirir (sunucuda ve JavaScript yokken hiçbir şey çizmez). Düğmelerin
 * ALTINA asılır (`absolute`, akışın dışında): ortalanmış blok onunla
 * yeniden ortalanıp yukarı kaymaz (mobilde 84 px, CLS 0,05 ölçülmüştü).
 * Yeterince benzer bir şey yoksa (eşik 0,5) öneri yok: alakasız bir
 * sayfayı "bunu mu arıyordun" diye göstermek hiç göstermemekten kötü.
 */
export type SuggestTarget = { title: string; href: string; slug: string; kind: 'Proje' | 'Yazı' }

const THRESHOLD = 0.5

const noop = () => () => {}
const readPath = () => window.location.pathname
const serverPath = () => null

function bestMatch(pathname: string, targets: readonly SuggestTarget[]): SuggestTarget | null {
  let path = pathname
  try {
    path = decodeURIComponent(pathname)
  } catch {
    // Bozuk yüzde kodlaması: ham adresle devam.
  }
  const parts = path.split('/').filter(Boolean)
  const last = parts.at(-1)
  if (!last) return null
  /* /projeler/… yalnız projelerde, /blog/… yalnız yazılarda aranır. */
  const scope = parts[0] === 'projeler' ? 'Proje' : parts[0] === 'blog' ? 'Yazı' : null

  let best: SuggestTarget | null = null
  let bestScore = THRESHOLD
  for (const target of targets) {
    if (scope && target.kind !== scope) continue
    const score = Math.max(similarity(last, target.slug), similarity(last, target.title))
    if (score >= bestScore) {
      best = target
      bestScore = score
    }
  }
  return best
}

export function NotFoundSuggest({ targets }: { targets: readonly SuggestTarget[] }) {
  const pathname = useSyncExternalStore(noop, readPath, serverPath)
  const match = pathname ? bestMatch(pathname, targets) : null
  if (!match) return null

  return (
    <div className="panel-in absolute inset-x-0 top-full mt-10 border-t border-line pt-8">
      <p className="text-small font-medium text-muted">Bunu mu arıyordun?</p>
      <Link
        href={match.href}
        className="group mt-3 inline-flex min-h-11 max-w-full items-center gap-3 rounded-full border border-line bg-surface py-2 pr-2 pl-5 text-left transition-colors hover:border-primary-soft"
      >
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold text-strong">{match.title}</span>
          <span className="block text-small font-medium text-muted">{match.kind}</span>
        </span>
        <span
          aria-hidden="true"
          className="inline-grid size-9 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-transform group-hover:translate-x-0.5"
        >
          <ArrowRight className="size-4" />
        </span>
      </Link>
    </div>
  )
}
