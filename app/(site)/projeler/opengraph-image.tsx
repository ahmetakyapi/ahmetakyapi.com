import { projects } from '@/lib/content/projects'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'

export const alt = 'Projeler · Ahmet Akyapı'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {

  return renderOgCard({
    eyebrow: 'Projeler',
    title: 'Yazdığım, yayınladığım ve hâlâ uğraştığım işler.',
    subtitle: 'Açılış Zili, Mimio, One Piece Hub, Harfiyen, ElevenForge ve diğerleri. Hepsinin kodu açık.',
    badges: [`${projects.length} Proje`, 'Next.js', 'TypeScript'],
  })
}
