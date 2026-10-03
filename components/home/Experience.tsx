import { ArrowRight, BookOpen, Gamepad2, HeartPulse, Shapes, Sparkles, TrendingUp, Wrench, Zap, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { MaskTitle } from '@/components/home/MaskTitle'
import { Container } from '@/components/ui/Container'
import type { Project } from '@/lib/content/types'
import type { HomeContent } from '@/lib/site-content'

/**
 * Deneyim: çalıştığım yer ve kendi ürünlerimin alanları, kısa ve sessiz.
 * Kurumdaki roller en yeniden eskiye, ince bir zaman çizgisi üstünde.
 *
 * Yerinde "Ne Yaptım" vardı: 22rem'lik dev bir "13" ve yanında iki rakam.
 * Sahibi kaldırılmasını istedi (3 Ekim 2026, "çok büyük"). İlk hâli
 * bilerek sessizdi (küçük başlık, kutusuz satırlar); aynı akşam "daha
 * zengin, havalı" istendi. Şimdi iki tonlu kart (`.tint-card`): solda
 * kurum ve kendini çizen bir zaman çizgisi üstünde roller, sağda kendi
 * ürünlerimin sayısı ve ikonlu alan hapları.
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

const DOMAIN_ICONS = {
  Finans: TrendingUp,
  Sağlık: HeartPulse,
  Oyun: Gamepad2,
  Araçlar: Wrench,
  İçerik: BookOpen,
  Diğer: Shapes,
} as const satisfies Record<Domain, LucideIcon>

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
      <h2 id="deneyim" className="home-title home-title-sm">
        <MaskTitle accentLast>İş Deneyimi</MaskTitle>
      </h2>

      <div className="home-xp mt-8 sm:mt-10">
        <article className="tint-card home-xp-card reveal">
          <span aria-hidden="true" className="tint-card-glow" />
          <header className="home-xp-card-head">
            <span className="home-xp-icon" aria-hidden="true">
              <Zap />
            </span>
            <div>
              <h3 className="home-xp-company">{experience.company}</h3>
              <p className="home-xp-tag">
                {experience.sector} · {experience.period}
              </p>
            </div>
          </header>
          <ol className="home-xp-roles">
            {experience.roles.map((role) => (
              <li key={role.title}>
                <p className="home-xp-role">
                  <span className="font-semibold text-strong">{role.title}</span>
                  <span className="home-xp-period">{role.period}</span>
                </p>
                <p className="home-xp-project">{role.project}</p>
                <p className="home-xp-desc">{role.text}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="tint-card home-xp-card home-xp-own reveal">
          <span aria-hidden="true" className="tint-card-glow" />
          <header className="home-xp-card-head">
            <span className="home-xp-icon" aria-hidden="true">
              <Sparkles />
            </span>
            <div>
              <h3 className="home-xp-company">Kendi Ürünlerim</h3>
              <p className="home-xp-tag">Kendi Fikirlerimden</p>
            </div>
          </header>
          <svg className="home-xp-rings" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="44" />
          </svg>
          <p className="home-xp-big">
            <span className="home-xp-big-num">{projects.length}</span>
            <span className="home-xp-big-label">Proje</span>
          </p>
          {/* Alanların payı tek çubukta: hangi alanda ne kadar iş var,
              okumadan görülsün. Hap listesi sayıları ayrıca veriyor. */}
          <div className="home-xp-bar" aria-hidden="true">
            {domains.map(([domain, count], i) => (
              <span key={domain} style={{ flexGrow: count, '--i': i } as CSSProperties} />
            ))}
          </div>
          <ul className="home-xp-domains" aria-label="Alanlar">
            {domains.map(([domain, count]) => {
              const Icon = DOMAIN_ICONS[domain]
              return (
                <li key={domain}>
                  <Icon aria-hidden="true" />
                  {domain}
                  <span className="home-xp-count">{count}</span>
                </li>
              )
            })}
          </ul>
          <Link href="/projeler" className="tint-card-btn w-fit">
            Tüm Projeler
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
      </div>
    </Container>
  )
}
