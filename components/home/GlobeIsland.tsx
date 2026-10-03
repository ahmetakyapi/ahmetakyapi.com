'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'

/**
 * Hero'daki küre, yalnız geniş ekranda.
 *
 * Telefonda hero zaten künye + isim + cümle + iki düğmeyle ekranı
 * dolduruyor; küre oraya sığmıyordu ve küçültülünce süs olmaktan öteye
 * geçmiyordu. CSS ile gizlemek yetmezdi: tuval kodu (4,4 KB gzip, ölçüldü) yine
 * inerdi. Burada ölçü tutmuyorsa modül HİÇ istenmez.
 *
 * `ssr: false` Next 16'da sunucu bileşeninde yazılamıyor; bu ince ada o
 * yüzden var. Yer tutucu küreyle aynı oranda: yükleme bitince satır kaymaz.
 */
const InteractiveGlobe = dynamic(() => import('@/components/InteractiveGlobe'), {
  ssr: false,
  loading: () => <div className="aspect-square w-full" aria-hidden="true" />,
})

const WIDE = '(min-width: 1024px)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const isWide = () => window.matchMedia(WIDE).matches
const onServer = () => false

export function GlobeIsland() {
  const wide = useSyncExternalStore(subscribe, isWide, onServer)
  return wide ? <InteractiveGlobe /> : <div className="aspect-square w-full" aria-hidden="true" />
}
