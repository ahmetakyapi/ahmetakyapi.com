import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Project } from '@/lib/content/types'
import type { HomeContent } from '@/lib/site-content'

/**
 * Deneyim: çalıştığım yer ve kendi ürünlerimin alanları, kısa ve sessiz.
 * Kurumdaki roller en yeniden eskiye, ince bir zaman çizgisi üstünde.
 *
 * Yerinde "Ne Yaptım" vardı: 22rem'lik dev bir "13" ve yanında iki rakam.
 * Sahibi kaldırılmasını istedi (3 Ekim 2026, "çok büyük"); yerine bu
 * bölüm geldi ve bilerek göz almıyor: bölüm başlığı küçük, satırlar gövde
 * puntosunda, kutu yok. Sayfanın büyük başlıkları projeler ve kapanışta.
 *
 * Alan sayıları veriden HESAPLANIR (lib/content/projects.ts): proje
 * eklenince burası kendiliğinden doğru kalır. Eşleşmeyen kategori
 * "Diğer"e düşer, toplam her zaman proje sayısına eşit.
 */
const DOMAINS = {
  Finans: ['Finansal Takip', 'Finans'],
  Sağlık: ['Klinik SaaS', 'Klinik Panel'],
  Oyun: ['Günlük Oyun', 'Çok Oyunculu Oyun'],
  Araçlar: ['Üretkenlik', 'Geliştirici Aracı', 'Yardımcı Araç'],
  İçerik: ['Fan Platformu', 'Portfolyo'],
} as const satisfies Record<string, readonly string[]>

type Domain = keyof typeof DOMAINS | 'Diğer'

function domainOf(category: string): Domain {
  for (const [domain, categories] of Object.entries(DOMAINS) as [keyof typeof DOMAINS, readonly string[]][]) {
    if (categories.includes(category)) return domain
  }
  return 'Diğer'
}

export function Experience({ experience, projects }: { experience: HomeContent['experience']; projects: Project[] }) {
  const counts = new Map<Domain, number>()
  for (const project of projects) {
    const domain = domainOf(project.category)
    counts.set(domain, (counts.get(domain) ?? 0) + 1)
  }
  const domains = [...counts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <Container as="section" size="wide" aria-labelledby="deneyim" className="pt-16 sm:pt-24">
      <h2 id="deneyim" className="ink text-heading font-bold tracking-[-0.03em]">
        Deneyim
      </h2>

      <div className="home-xp mt-6">
        <div className="home-xp-row reveal">
          <p className="home-xp-head">
            <span className="text-strong">{experience.company}</span>
            <span className="home-xp-tag">
              {experience.sector} · {experience.period}
            </span>
          </p>
          <ol className="home-xp-roles">
            {experience.roles.map((role) => (
              <li key={role.title}>
                <p className="home-xp-role">
                  <span className="font-semibold text-strong">{role.title}</span>
                  <span className="home-xp-tag">{role.period}</span>
                </p>
                <p className="mt-1 text-body">
                  <span className="font-medium text-strong">{role.project}:</span> {role.text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="home-xp-row reveal">
          <p className="home-xp-head">
            <span className="text-strong">Kendi Ürünlerim</span>
            <span className="home-xp-tag">{projects.length} Proje</span>
          </p>
          <div>
            <ul className="home-xp-domains" aria-label="Alanlar">
              {domains.map(([domain, count]) => (
                <li key={domain}>
                  {domain}
                  <span className="home-xp-count">{count}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/projeler"
              className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-ink pointer-fine:min-h-8"
            >
              Tüm Projeler
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
