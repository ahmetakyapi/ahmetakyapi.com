import { MaskTitle } from '@/components/home/MaskTitle'
import { BrandIcon } from '@/components/site/BrandIcon'
import { Container } from '@/components/ui/Container'
import { CopyButton } from '@/components/ui/CopyButton'
import { EMAIL, SOCIAL_LINKS } from '@/lib/nav'
import type { HomeContent } from '@/lib/site-content'

/**
 * Kapanış: dev başlık, tek cümle, e-posta ve sosyal bağlantılar.
 *
 * Birincil (degrade) düğme yok: sayfanın tek birincil eylemi hero'daki
 * "Projeleri Gör". E-posta adresinin kendisi bağlantı (mailto); ayrıca bir
 * "E-posta Gönder" düğmesi aynı niyeti ikinci kez söylerdi. Posta
 * uygulaması kullanmayan için yanında kopyala düğmesi.
 */
const ICON_LINK =
  'inline-grid size-11 place-items-center rounded-full border border-line text-body transition-colors hover:border-line-strong hover:text-strong'

export function Closing({ closing }: { closing: HomeContent['closing'] }) {
  return (
    <Container as="section" size="wide" aria-labelledby="iletisim" className="pt-28 sm:pt-40">
      <h2
        id="iletisim"
        className="text-[clamp(3rem,10vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-strong"
      >
        <MaskTitle>{closing.title}</MaskTitle>
      </h2>
      <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <p className="max-w-[32rem] text-lead text-body">{closing.text}</p>
          <p className="mt-5">
            <a
              href={`mailto:${EMAIL}`}
              className="tap-y inline-block break-all font-mono text-[clamp(1.125rem,2.4vw,1.5rem)] text-strong underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-primary-ink hover:decoration-primary-soft"
            >
              {EMAIL}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton value={EMAIL} variant="secondary" size="lg">
            Adresi Kopyala
          </CopyButton>
          <ul className="flex items-center gap-2" aria-label="Sosyal bağlantılar">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.id}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className={ICON_LINK}>
                  <BrandIcon name={link.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  )
}
