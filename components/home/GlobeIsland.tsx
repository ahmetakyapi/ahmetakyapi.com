'use client'

import dynamic from 'next/dynamic'

/**
 * Hero'nun sağ yarısındaki küre için ince istemci adası.
 *
 * `ssr: false` Next 16'da sunucu bileşeninde yazılamıyor; bu ada o yüzden
 * var. Tuval kodu hidrasyondan sonra ayrı bir parça olarak iner; ilk
 * boyamayı ve LCP'yi (isim) beklemez. Yer tutucu yok: kutu kare oranını
 * CSS'ten alıyor (home.css → `.home-hero-art`), küre inince hiçbir şey kaymaz.
 */
const HeroGlobe = dynamic(() => import('@/components/home/HeroGlobe'), {
  ssr: false,
  loading: () => null,
})

export function GlobeIsland() {
  return <HeroGlobe />
}
