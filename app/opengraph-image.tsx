import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og'

export const alt = 'Ahmet Akyapı, Full-Stack & AI Developer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return renderOgCard({
    eyebrow: 'Portfolyo',
    title: 'Ölçerek geliştirilmiş, hızlı ve okunaklı arayüzler.',
    subtitle: 'Next.js, TypeScript, Postgres ve Claude API ile ürün geliştiriyorum. Projeler, teknik yazılar ve kararların gerekçeleri burada.',
    badges: ['Next.js', 'TypeScript', 'PostgreSQL', 'Claude API'],
  })
}
