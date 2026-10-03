import { ArrowRight } from 'lucide-react'
import { GlobeIsland } from '@/components/home/GlobeIsland'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { KunyeGrid } from '@/components/ui/Kunye'
import { EMAIL, SOCIAL_LINKS } from '@/lib/nav'
import type { HomeContent } from '@/lib/site-content'

/**
 * Hero: üstte künye ızgarası, sol altta isim imzası, sağda küre.
 *
 * Künye eyebrow'un yerini tutuyor: rol, şu anki iş, tech stack ve bağlantı
 * okuyucunun ilk soracağı dört şey; ayrıca bir üst etiket yok.
 *
 * İsim satır satır maskeli açılır (home.css → `.home-sign-line`). Satır
 * maskenin içinde %60 aşağıdan başlıyor, tümden dışarıdan değil: ilk karede
 * harflerin üst yarısı zaten boyalı, yani LCP animasyonu beklemiyor.
 * `.display-ink` transform taşımaz (globals.css'teki tuzak notu); hareket
 * onu saran `<span>`da.
 */
const LINK = 'underline decoration-line-strong underline-offset-4 transition-colors hover:text-primary-ink hover:decoration-primary-soft'

export function HomeHero({ home }: { home: HomeContent }) {
  const github = SOCIAL_LINKS.find((link) => link.id === 'github')

  return (
    <Container
      as="section"
      size="wide"
      aria-labelledby="hero-baslik"
      className="flex flex-col pt-6 pb-10 sm:pt-8 lg:min-h-[min(calc(100svh-10rem),52rem)] lg:pb-12"
    >
      <KunyeGrid
        className="border-t-0 pt-0"
        items={[
          { label: 'Ne Yapıyorum', value: home.role },
          {
            label: 'Şu An',
            value: (
              <>
                <a href={home.now.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {home.now.label}
                </a>
                {"'ni Geliştiriyorum"}
              </>
            ),
          },
          { label: 'Tech Stack', value: home.stack.join(', ') },
          {
            label: 'Bağlantı',
            value: (
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {github ? (
                  <a href={github.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    GitHub
                  </a>
                ) : null}
                <a href={`mailto:${EMAIL}`} className={LINK}>
                  E-posta
                </a>
              </span>
            ),
          },
        ]}
      />

      <div className="mt-10 grid flex-1 items-end gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)]">
        <div className="min-w-0">
          <h1 id="hero-baslik" className="text-hero font-semibold tracking-[-0.05em]">
            <span className="home-sign-line">
              <span className="home-sign-inner text-strong">{home.firstName}</span>
            </span>
            <span className="home-sign-line">
              <span className="home-sign-inner home-sign-delay">
                <span className="display-ink">{home.lastName}</span>
              </span>
            </span>
          </h1>
          <p className="home-fade mt-6 max-w-[34rem] text-lead text-body sm:mt-8">{home.intro}</p>
          <div className="home-fade mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/projeler" variant="primary" size="lg">
              Projeleri Gör
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/blog" variant="secondary" size="lg">
              Yazıları Oku
            </ButtonLink>
          </div>
        </div>

        <div className="hidden w-full self-center lg:block">
          <GlobeIsland />
        </div>
      </div>
    </Container>
  )
}
