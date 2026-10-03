import { ArrowRight } from 'lucide-react'
import { GlobeIsland } from '@/components/home/GlobeIsland'
import { ButtonLink } from '@/components/ui/Button'
import type { HomeContent } from '@/lib/site-content'

/**
 * Hero: "Gece Mavisi" (3 Ekim 2026, sahibinin üç yön taslağından seçtiği).
 *
 * İki kolon, ilk ekranın tamamı: solda kimlik (unvan, isim, tek cümle, iki
 * düğme), sağda ilk sürümün etkileşimli küresi. Önceki tipografik hero
 * (kenardan kenara isim, harf harf ağırlık dalgası) "editör sitesi gibi"
 * okunuyordu; sağ yarıya Açılış Zili ekranı da denendi ve reddedildi:
 * hero tek bir projeyi öne çıkarmamalı.
 *
 * Telefonda tek kolon: metin üstte, küre altında kendi alanında. Küre
 * metnin ARKASINA konmaz; bir kez denendi ve harita gibi gürültü yaptı.
 *
 * İsim iki satır, her satır kendi maskesinden yükselir (home.css). Degrade
 * hareket eden öğenin KENDİSİNDE: `.display-ink` içindeki bir çocuğa
 * transform vermek onu boyama alanından çıkarıyor (globals.css → TUZAK).
 */
export function HomeHero({ home }: { home: HomeContent }) {
  return (
    <section aria-labelledby="hero-baslik" className="home-hero">
      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow home-rise">{home.role}</p>
          <h1 id="hero-baslik" className="home-name">
            <span className="home-name-line">
              <span className="home-name-in home-name-1">{home.firstName}</span>
            </span>{' '}
            <span className="home-name-line">
              <span className="home-name-in home-name-2">{home.lastName}</span>
            </span>
          </h1>
          <p className="home-hero-lead home-rise">{home.intro}</p>
          <div className="home-hero-cta home-rise">
            <ButtonLink href="/projeler" variant="primary" size="lg">
              Projeleri Gör
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/#iletisim" variant="secondary" size="lg">
              Benimle Çalış
            </ButtonLink>
          </div>
        </div>

        <div className="home-hero-art">
          <GlobeIsland />
          <p className="home-globe-hint">Sürükleyerek döndürebilirsin.</p>
        </div>
      </div>
    </section>
  )
}
