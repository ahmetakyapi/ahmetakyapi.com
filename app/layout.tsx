import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import {
  ALTERNATES_BASE,
  JOB_TITLE,
  OPEN_GRAPH_BASE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TWITTER_BASE,
} from '@/lib/seo'
import { IntroCurtain } from '@/components/site/IntroCurtain'
import { INTRO_SCRIPT } from '@/lib/intro'
import { DEFAULT_THEME, PALETTE, THEME_SCRIPT } from '@/lib/theme'
import './globals.css'

/*
 * Fontlar (3 Ekim 2026, "Gece Mavisi" yönüyle): tek aile, Geist.
 * Önceki çift (Schibsted başlık + Bricolage gövde) "editör sitesi gibi"
 * okunuyordu; sahibi üç yön taslağı arasından Geist'li olanı seçti.
 * - Başlık, gövde, düğme, menü: Geist (değişken, 100-900).
 * - Kod, alan adı, e-posta ve yalnız rakamdan oluşan sayılar: Geist Mono.
 *   9 Ekim 2026: künye, tarih, etiket ve çipler mono'dan çıktı; küçük
 *   mono etiketler okunmuyordu ("bu tür başlıklar hiç okunmuyor").
 *
 * TUZAK: next/font `variable` adı @theme'deki adla aynı olursa
 * (`--font-sans: var(--font-sans)`) değişken kendine başvurur ve font
 * sessizce sistem yazı tipine düşer. Bu yüzden `-face` soneki.
 */
const sans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans-face',
  display: 'swap',
})

/* Mono ön yüklenmiyor: ilk ekranda neredeyse yok (masaüstü başlıktaki ⌘K'nın
   "K"si), ama her sayfada dört font ön yüklemesinin ~38 KB'ı onundu. Yazı
   kodu ve e-posta gibi yerlerde kullanıldığı an iner. */
const mono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono-face',
  display: 'swap',
  preload: false,
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
     canonical gösteriyordu. Her rota kendi canonical'ını veriyor ve aynı
     sebeple tabanları (lib/seo.ts) kendi nesnesine yayıyor. */
  alternates: ALTERNATES_BASE,
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: TWITTER_BASE,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

/* `themeColor` burada YOK: tarayıcı çubuğunun rengi SİTENİN temasından ve
   etiketi THEME_SCRIPT ilk boyamadan önce kendisi basıyor (gerekçe
   lib/theme.ts). */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Sayfalar statik; tema THEME_SCRIPT ile ilk boyamadan önce çerezden
  // (gerekçe lib/theme.ts).
  return (
    <html
      lang="tr"
      // globals.css `scroll-behavior: smooth`; bu öznitelik olmadan Next 16
      // sayfa geçişindeki başa sarmayı da yumuşak kaydırıyordu.
      data-scroll-behavior="smooth"
      data-theme={DEFAULT_THEME}
      data-palette={PALETTE}
      // THEME_SCRIPT özniteliği hidrasyondan önce değiştirir; bu bilinçli
      // farkı React raporlamasın.
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
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
