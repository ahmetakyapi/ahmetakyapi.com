import { Mail, Rss } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/site/BrandIcon'
import { Logo } from '@/components/site/Logo'
import { EMAIL, NAV_ITEMS, SOCIAL_LINKS } from '@/lib/nav'

/**
 * Alt bilgi: sade, sunucu bileşeni (istemciye JavaScript göndermez).
 *
 * Kontrast: metin `text-muted` (koyuda #8497a9 / #070d16 ≈ 6,4:1, açıkta
 * #586a7c / #f7f9fb ≈ 5,5:1). Eski `dark:text-gray-600` 2,6:1'di.
 */
const ICON_LINK =
  'inline-grid size-11 place-items-center rounded-full text-body transition-colors hover:bg-surface-raised hover:text-strong pointer-fine:size-9'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-8 px-[max(1rem,env(safe-area-inset-left))] py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <p className="font-mono text-small text-muted">© {year} Ahmet Akyapı</p>
        </div>

        <nav aria-label="Alt gezinme" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="tap-y text-sm text-body transition-colors hover:text-strong">
              {item.label}
            </Link>
          ))}
          <a href="/rss.xml" className="tap-y inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-strong">
            <Rss className="size-3.5" aria-hidden="true" />
            RSS
          </a>
        </nav>

        <ul className="-ml-2.5 flex items-center gap-1 md:ml-0" aria-label="Bağlantılar">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.id}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className={ICON_LINK}>
                <BrandIcon name={link.id} />
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${EMAIL}`} aria-label="E-posta gönder" className={ICON_LINK}>
              <Mail className="size-4" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
