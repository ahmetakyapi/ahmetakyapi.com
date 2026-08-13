import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'
import { projects } from '@/lib/data'

export const runtime = 'edge'
export const alt = 'Projeler — Ahmet Akyapı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  const live = projects.filter((p) => p.badge === 'Canlı').length

  return renderOgCard({
    eyebrow: 'Projeler',
    title: 'Yazdığım, yayınladığım ve hâlâ uğraştığım işler.',
    subtitle:
      'Açılış Zili, Mimio, One Piece Hub, Harfiyen, ElevenForge ve diğerleri — hepsi canlı, hepsinin kodu açık.',
    accent: '#8b5cf6',
    badges: [`${live} canlı proje`, 'Next.js', 'Drizzle'],
  })
}
