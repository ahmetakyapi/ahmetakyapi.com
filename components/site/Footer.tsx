import { Mail, Rss } from 'lucide-react'
import Link from 'next/link'
import { BackToTop } from '@/components/site/BackToTop'
import { BrandIcon } from '@/components/site/BrandIcon'
import { Logo } from '@/components/site/Logo'
import { Signature } from '@/components/site/Signature'
import { EMAIL, JOB_TITLE, NAV_ITEMS, SOCIAL_LINKS } from '@/lib/nav'

/**
 * Alt bilgi: sade, sunucu bileşeni; istemciye giden tek parça Başa Dön.
 *
 * İki satır. Üstte marka (karo + imza), ortada gezinme, sağda bağlantılar;
 * altta ince bir çizginin altında künye ve "Başa Dön" (BackToTop, tek
 * istemci parçası).
 *
 * E-posta artık ikon (4 Ekim 2026): adresin tamamı yazılıydı ve satırın
 * en uzun öğesi oydu; adres kapanış bölümünde zaten büyük ve kopyalanabilir
 * duruyor. Bütün bağlantılar aynı yuvarlak düğme, erişilebilir adı
 * `aria-label`dan.
 *
 * Kontrast: künye `text-muted` (açıkta #536477 / zemin ≈ 5,4:1).
 */
const ICON_LINK =
  'inline-grid size-11 place-items-center rounded-full border border-line text-body transition-colors hover:border-primary-soft hover:bg-primary-wash hover:text-primary-ink pointer-fine:size-10'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-line pb-[env(safe-area-inset-bottom)] sm:mt-20">
      <div className="mx-auto w-full max-w-[88rem] px-[max(1rem,env(safe-area-inset-left))] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          {/* Telefonda Başa Dön imzanın hizasında, en sağda: alttaki künye
              satırına sığmayıp sola, tek başına bir satıra düşüyordu
              (4 Ekim 2026). Geniş ekranda künye satırının sağında. */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Ahmet Akyapı, ana sayfa" className="flex w-fit items-center gap-3">
              <Logo size={36} />
              <Signature className="h-8" />
            </Link>
            <BackToTop className="md:hidden" />
          </div>

          <nav aria-label="Alt gezinme" className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="tap-y text-[0.9375rem] font-medium text-body transition-colors hover:text-strong">
                {item.label}
              </Link>
            ))}
            <a
              href="/rss.xml"
              className="tap-y inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-body transition-colors hover:text-strong"
            >
              <Rss className="size-3.5" aria-hidden="true" />
              RSS
            </a>
          </nav>

          <ul className="flex flex-wrap items-center gap-2" aria-label="Bağlantılar">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.id}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className={ICON_LINK}>
                  <BrandIcon name={link.id} />
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${EMAIL}`} aria-label={`E-posta gönder: ${EMAIL}`} title={EMAIL} className={ICON_LINK}>
                <Mail className="size-[1.125rem]" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line py-6">
          <p className="font-mono text-small text-muted">
            © {year} Ahmet Akyapı · {JOB_TITLE}
          </p>
          <BackToTop className="max-md:hidden" />
        </div>
      </div>
    </footer>
  )
}
