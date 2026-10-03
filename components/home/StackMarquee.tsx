import { techStack } from '@/lib/content/tech-stack'

/**
 * Tech stack: sayfadaki TEK marquee. Yalnız logo; ad `<title>` ile ekran
 * okuyucuya gider.
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
        <li key={tech.name}>
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
            role={hidden ? undefined : 'img'}
            aria-label={hidden ? undefined : tech.name}
            focusable="false"
          >
            {hidden ? null : <title>{tech.name}</title>}
            <path d={tech.path} />
          </svg>
        </li>
      ))}
    </ul>
  )
}

export function StackMarquee() {
  return (
    <section aria-labelledby="tech-stack" className="border-y border-line py-10 sm:py-12">
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
