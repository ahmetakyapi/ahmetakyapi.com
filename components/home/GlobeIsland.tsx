'use client'

import dynamic from 'next/dynamic'

/**
 * Hero'nun sağ yarısındaki küre için ince istemci adası.
 *
 * `ssr: false` Next 16'da sunucu bileşeninde yazılamıyor; bu ada o yüzden
 * var. Tuval kodu hidrasyondan sonra ayrı bir parça olarak iner; ilk
 * boyamayı ve LCP'yi (isim) beklemez. Yer tutucu yok: kare kutu sunucuda,
 * adanın dışında (HomeHero → `.home-globe-box`). Kutu önceden adanın
 * içindeydi; küre inince hero boy atıyor, altındaki her şey kayıyordu
 * (CLS 0,10-0,34; ölçüldü, 21 Ekim 2026).
 */
const HeroGlobe = dynamic(() => import('@/components/home/HeroGlobe'), {
  ssr: false,
  loading: () => null,
})

export function GlobeIsland() {
  return <HeroGlobe />
}
