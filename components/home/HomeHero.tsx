import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { GlobeIsland } from '@/components/home/GlobeIsland'
import { layoutWord } from '@/components/home/name-metrics'
import { NameWave } from '@/components/home/NameWave'
import { ButtonLink } from '@/components/ui/Button'
import type { HomeContent } from '@/lib/site-content'

/**
 * Hero: isim sahnenin kendisi, tek bir kompozisyon.
 *
 * Bir dönem üstte dört kutulu mono künye ızgarası, altında solda isim ve
 * sağda etiketli bir küre vardı: telefonda ilk ekranı künye kaplıyordu,
 * masaüstünde de sayfa "solda metin, sağda araç" diye ikiye bölünüyordu.
 * Şimdi isim ekranın genişliğini sahipleniyor: telefonda iki satır ve
 * kabın ~%93'ü, masaüstünde tek satır ve kenardan kenara. Küre etiketsiz,
 * ince çizgili bir arka plan; ismin arkasından yükselir.
 *
 * Düzen: telefonda isim üstte, blok (unvan, tek cümle, iki düğme) altta;
 * masaüstünde blok üstte, isim sahnenin tabanında. DOM sırası her yerde
 * aynı (önce `h1`); masaüstündeki yer değişimi yalnız görsel (`order`).
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
      <div className="home-hero-globe" aria-hidden="true">
        <GlobeIsland />
      </div>

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
