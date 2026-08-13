import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import './globals.css'

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })

/* Beş ağırlık × iki subset = 16 woff2 dosyası preload ediliyordu. Kullanılan
   ağırlıklar 500/600/800; 400 ve 700 hiçbir yerde geçmiyordu. */
const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ahmet Akyapı | Fullstack Developer',
    template: '%s — Ahmet Akyapı',
  },
  description:
    'React, TypeScript ve Next.js odaklı çalışan Fullstack Developer. Performanslı, rafine ve kullanıcı odaklı ürün deneyimleri geliştiriyorum.',
  keywords: ['Fullstack Developer', 'React', 'TypeScript', 'Next.js', 'Ahmet Akyapı'],
  authors: [{ name: 'Ahmet Akyapı', url: 'https://github.com/ahmetakyapi' }],
  creator: 'Ahmet Akyapı',
  metadataBase: new URL('https://ahmetakyapi.com'),
  /* canonical burada TANIMLI DEĞİL — kökte '/' yazılıydı ve Next metadata'yı
     alan bazında sığ birleştirdiği için her blog yazısı da ana sayfayı
     canonical gösteriyordu. Her rota kendi canonical'ını veriyor. */
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    title: 'Ahmet Akyapı | Fullstack Developer',
    description: 'React, TypeScript ve Next.js odaklı Fullstack Developer.',
    url: 'https://ahmetakyapi.com',
    siteName: 'Ahmet Akyapı',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ahmetakyapi',
    creator: '@ahmetakyapi',
    title: 'Ahmet Akyapı | Fullstack Developer',
    description: 'React, TypeScript ve Next.js odaklı Fullstack Developer.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${manrope.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-medium"
          >
            İçeriğe geç
          </a>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
