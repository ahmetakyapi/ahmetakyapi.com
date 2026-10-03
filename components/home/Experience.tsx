import { ArrowRight, Building2, FlaskConical, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { MaskTitle } from '@/components/home/MaskTitle'
import { ProjectCover } from '@/components/projects/ProjectCover'
import { Container } from '@/components/ui/Container'
import type { Project } from '@/lib/content/types'
import { getOrderedProjects } from '@/lib/project-order'
import type { HomeContent } from '@/lib/site-content'

/**
 * İş Deneyimi: solda çalıştığım kurum, sağda kendi ürünlerim.
 *
 * Sol kart: kurum ve kendini çizen bir zaman çizgisi üstünde roller.
 *
 * Sağ kart ("Kendi Ürünlerim") 4 Ekim 2026'da sıfırdan kuruldu. Önceki
 * denemeler (dev rakam + ikonlu haplar; pirinç tonlu kart; lacivert "kasa";
 * arkada solan eğik mozaik) hep aynı yerde takıldı: kart 13 gerçek ürünü
 * anlatacakken içinde ya yalnız sayılar ya da yarı saydam, okunmayan
 * kapaklar vardı. Şimdi kartın ortası bir FİLM ŞERİDİ: iki sıra net kapak,
 * ters yönde yavaşça akıyor, her kapağın altında projenin adı (home.css →
 * "Kendi Ürünlerim"). Üstünde başlık ve alanlar, altında iki ölçü ve düğme.
 * "Yayında" sayısı sahibinin isteğiyle kaldırıldı.
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
  const years = new Date().getFullYear() - experience.since
  const workProjects = experience.roles.flatMap((role) => role.project.split(/, | ve /)).length
  /* Şerit: sıralı liste ikiye bölünür, üst sıra öne çıkanlarla başlar. */
  const ordered = getOrderedProjects(projects)
  const half = Math.ceil(ordered.length / 2)
  const rows = [ordered.slice(0, half), ordered.slice(half)]

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
              <Building2 />
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

          {/* Kartın dibi: üç ölçü ve Ar-Ge notu. Kart sağdaki şeritli kartla
              aynı boyda; roller bitince alt yarı boş kalıyordu (4 Ekim 2026).
              Ölçüler veriden: yıl başlangıçtan, proje sayısı rollerin proje
              adlarından ("MDM, Revenue ve OYS" üç sayılır). */}
          <footer className="home-xp-foot">
            <dl className="home-own-stats">
              <div>
                <dd>{years}</dd>
                <dt>Yıl</dt>
              </div>
              <div>
                <dd>{experience.roles.length}</dd>
                <dt>Rol</dt>
              </div>
              <div>
                <dd>{workProjects}</dd>
                <dt>Proje</dt>
              </div>
            </dl>
            <p className="home-xp-note">
              <FlaskConical aria-hidden="true" />
              {experience.note}
            </p>
          </footer>
        </article>

        <article className="tint-card home-xp-card home-own reveal">
          <header className="home-xp-card-head home-own-head">
            <span className="home-xp-icon" aria-hidden="true">
              <Sparkles />
            </span>
            <div>
              <h3 className="home-xp-company">Kendi Ürünlerim</h3>
              <p className="home-xp-tag">{domains.map(([domain]) => domain).join(' · ')}</p>
            </div>
          </header>

          {/* İki sıra, ters yönde akar; her sıra iki kez basılır ki döngü
              dikişsiz olsun. Süs: adlar ve bağlantı aşağıda, sayılar
              ekran okuyucuya yetiyor. */}
          <div className="home-own-reel" aria-hidden="true">
            {rows.map((row, r) => (
              <div key={r} className="home-own-row" data-dir={r === 0 ? 'left' : 'right'}>
                {[0, 1].map((copy) => (
                  <div key={copy} className="home-own-track">
                    {row.map((project) => (
                      <figure key={project.slug} className="home-own-tile">
                        <ProjectCover project={project} alt="" />
                        <figcaption>{project.title}</figcaption>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>


          <div className="home-own-foot">
            <dl className="home-own-stats">
              <div>
                <dd>{projects.length}</dd>
                <dt>Proje</dt>
              </div>
              <div>
                <dd>{domains.length}</dd>
                <dt>Alan</dt>
              </div>
            </dl>
            <Link href="/projeler" className="tint-card-btn w-fit">
              Tüm Projeler
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </article>
      </div>
    </Container>
  )
}
