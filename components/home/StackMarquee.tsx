import { techStack } from '@/lib/content/tech-stack'

/**
 * Tech stack: sayfadaki TEK marquee. 3 Ekim 2026: logolar küçük ve
 * süssüz duruyordu; artık her logo kendi karosunda, büyük ve altında adı
 * yazılı; ad masaüstünde de hep görünür (9 Ekim 2026). Üzerine gelinen
 * karo yükselir, logo markanın mavisine döner.
 *
 * Neden kayan şerit: on bir logoyu tek tek okutmaya değmez, tech stack'in
 * genişliği bir bakışta anlaşılsın yeter. Üzerine gelince ya da klavyeyle
 * odaklanınca durur (WCAG 2.2.2: kendiliğinden hareket eden içerik
 * durdurulabilmeli); hareket azaltılmışsa sarılı, durağan bir ızgara.
 * İkinci kopya yalnız döngünün dikişini kapatmak için: `aria-hidden`.
 */
function Logos({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="home-marquee-list" aria-hidden={hidden || undefined}>
      {techStack.map((tech) => (
        <li key={tech.name} className="home-stack-tile">
          <span className="home-stack-logo">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d={tech.path} />
            </svg>
          </span>
          <span className="home-stack-name">{tech.name}</span>
        </li>
      ))}
    </ul>
  )
}

export function StackMarquee() {
  return (
    <section aria-labelledby="tech-stack" className="mt-16 py-6 sm:mt-20 sm:py-8">
      <h2 id="tech-stack" className="sr-only">
        Tech Stack
      </h2>
      <div className="home-marquee" tabIndex={0} aria-label="Kullandığım araçların logoları; odaklanınca durur">
        <div className="home-marquee-track">
          <Logos />
          <Logos hidden />
        </div>
      </div>
    </section>
  )
}
