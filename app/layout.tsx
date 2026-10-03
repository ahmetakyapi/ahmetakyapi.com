import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'
import { JOB_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, TWITTER } from '@/lib/seo'
import { IntroCurtain } from '@/components/site/IntroCurtain'
import { INTRO_SCRIPT } from '@/lib/intro'
import { DEFAULT_THEME, PALETTE, THEME_COLOR, THEME_SCRIPT } from '@/lib/theme'
import './globals.css'

/*
 * Fontlar (3 Ekim 2026, Ahmet'in seçimi: "Tüm başlıklar A, metinler B"):
 * - Başlıklar (hero'daki isim dahil, h1-h6): Schibsted Grotesk.
 * - Gövde, düğme, menü: Bricolage Grotesque (optik boyut ekseniyle).
 * - Künye, tarih, kod: IBM Plex Mono.
 *
 * TUZAK: next/font `variable` adı @theme'deki adla aynı olursa
 * (`--font-sans: var(--font-sans)`) değişken kendine başvurur ve font
 * sessizce sistem yazı tipine düşer. Bu yüzden `-face` soneki.
 * İkisi de değişken aile: `weight` verilmez.
 */
const display = Schibsted_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-face',
  display: 'swap',
})

const sans = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  variable: '--font-sans-face',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-face',
  display: 'swap',
})

const DEFAULT_TITLE = `${SITE_NAME} · ${JOB_TITLE}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['Full-Stack Developer', 'AI Developer', 'Yapay Zekâ', 'Frontend', 'React', 'Next.js', 'TypeScript', 'Claude API', 'Ahmet Akyapı'],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  /* canonical burada TANIMLI DEĞİL: kökte '/' yazılıydı ve Next metadata'yı
     alan bazında sığ birleştirdiği için her blog yazısı da ana sayfayı
     canonical gösteriyordu. Her rota kendi canonical'ını veriyor. */
  alternates: {
    types: { 'application/rss+xml': '/rss.xml' },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER,
    creator: TWITTER,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

/* Tarayıcı çubuğunun rengi işletim sisteminden değil SİTENİN temasından:
   varsayılan burada, seçilen tema THEME_SCRIPT ile ilk boyamadan önce. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: THEME_COLOR[DEFAULT_THEME],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Sayfalar statik; tema THEME_SCRIPT ile ilk boyamadan önce çerezden
  // (gerekçe lib/theme.ts).
  return (
    <html
      lang="tr"
      data-theme={DEFAULT_THEME}
      data-palette={PALETTE}
      // THEME_SCRIPT özniteliği hidrasyondan önce değiştirir; bu bilinçli
      // farkı React raporlamasın.
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Açılış perdesinin kararı da ilk boyamadan önce (lib/intro.ts). */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-page font-sans text-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-primary"
        >
          İçeriğe Geç
        </a>
        <IntroCurtain />
        {children}
        {/* Yalnız Vercel'de: başka yerde (yerel `next start`) betik adresi
            404 dönüp konsola hata basıyor. `VERCEL` derleme ve çalışma
            anında platformun kendisi tanımlıyor. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  )
}
