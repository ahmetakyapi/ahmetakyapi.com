'use client'

import dynamic from 'next/dynamic'

/**
 * Hero'nun arkasındaki küre için ince istemci adası.
 *
 * `ssr: false` Next 16'da sunucu bileşeninde yazılamıyor; bu ada o yüzden
 * var. Küre artık her genişlikte yükleniyor (eskiden yalnız ≥1024): ismin
 * arkasında, soluk ve işaretçiye kapalı duruyor, telefonda da sahnenin
 * parçası. Tuval kodu hidrasyondan sonra ayrı bir parça olarak iner; ilk
 * boyamayı ve LCP'yi (isim) beklemez. Yer tutucu boş bir kutu: küre mutlak
 * konumlu olduğu için yüklenince hiçbir şey kaymaz.
 */
const HeroGlobe = dynamic(() => import('@/components/home/HeroGlobe'), {
  ssr: false,
  loading: () => null,
})

export function GlobeIsland() {
  return <HeroGlobe />
}
