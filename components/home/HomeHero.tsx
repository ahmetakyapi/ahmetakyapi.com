import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { layoutWord } from '@/components/home/name-metrics'
import { NameWave } from '@/components/home/NameWave'
import { ButtonLink } from '@/components/ui/Button'
import type { HomeContent } from '@/lib/site-content'

/**
 * Hero: isim sahnenin kendisi, içeriği kadar yer kaplayan sıkı bir blok.
 *
 * Bir dönem üstte dört kutulu mono künye ızgarası, sonra ismin arkasında
 * ince çizgili bir küre ve tam ekran yükseklik vardı. Telefonda isimle
 * düğmeler arasında yarım ekranlık boşluk kalıyor, küre de anlamsız bir
 * "dünya haritası" gibi okunuyordu (3 Ekim 2026, Ahmet: "boşluk çok
 * gereksiz, dünya sistemi gibi saçma duruyor"). Küre ve tam ekran
 * yükseklik kalktı; hero bitince Hakkımda hemen başlar.
 *
 * Düzen her genişlikte aynı sıra: isim (telefonda iki satır, masaüstünde
 * tek satır kenardan kenara), altında unvan, tek cümle ve iki düğme.
 *
 * Harfler: her biri ayrı kutu, genişliği sunucuda sabit (name-metrics.ts).
 * Harf harf maskeli yükselir (home.css → `.home-glyph`); maskenin dışından
 * değil yarı yoldan başlar, ilk karede her harfin üstü zaten boyalı.
 * Degrade iki kelimeyi tek yüzey gibi kaplar: degrade ebeveyne DEĞİL her
 * harfin kendisine uygulanır, çünkü `.display-ink` içindeki bir çocuğa
 * transform vermek onu background-clip bölgesinden çıkarır ve harf görünmez
 * olur (globals.css → TUZAK). Her harf degradenin kendi dilimini gösterir.
 *
 * Harfler `aria-hidden`; başlığın adı `aria-label`dan gelir, ekran okuyucu
 * ismi harf harf hecelemez.
 */
export function HomeHero({ home }: { home: HomeContent }) {
  const first = layoutWord(home.firstName)
  const last = layoutWord(home.lastName)
  const nameStyle = {
    '--w1': `${first.width}em`,
    '--w2': `${last.width}em`,
    '--w1n': first.width,
    '--w2n': last.width,
  } as CSSProperties

  return (
    <section aria-labelledby="hero-baslik" className="home-hero">
      <div className="home-hero-inner">
        <h1 id="hero-baslik" aria-label={`${home.firstName} ${home.lastName}`} className="home-name" style={nameStyle}>
          {[first, last].map((word, line) => (
            <span key={line} className={`home-name-line home-name-l${line + 1}`} aria-hidden="true">
              {word.glyphs.map((box, i) => (
                <span
                  key={i}
                  className="home-glyph"
                  style={
                    {
                      width: `${box.width}em`,
                      '--gx': `${box.x}em`,
                      '--d': line === 0 ? i : first.glyphs.length + i,
                    } as CSSProperties
                  }
                >
                  {box.glyph}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="home-hero-foot home-rise">
          <div className="min-w-0">
            <p className="font-mono text-small font-medium text-body">{home.role}</p>
            <p className="home-hero-line mt-3 font-display text-strong">{home.intro}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/projeler" variant="primary" size="lg">
              Projeleri Gör
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/blog" variant="secondary" size="lg">
              Yazıları Oku
            </ButtonLink>
          </div>
        </div>
      </div>

      <NameWave />
    </section>
  )
}
