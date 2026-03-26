import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import './globals.css'

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })

export const metadata: Metadata = {
  title: 'Ahmet Akyapı | Fullstack Developer',
  description:
    'React, TypeScript ve Next.js odaklı çalışan Fullstack Developer. Performanslı, rafine ve kullanıcı odaklı ürün deneyimleri geliştiriyorum.',
  keywords: ['Fullstack Developer', 'React', 'TypeScript', 'Next.js', 'Ahmet Akyapı'],
  authors: [{ name: 'Ahmet Akyapı', url: 'https://github.com/ahmetakyapi' }],
  metadataBase: new URL('https://ahmetakyapi.com'),
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
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
    title: 'Ahmet Akyapı | Fullstack Developer',
    description: 'React, TypeScript ve Next.js odaklı Fullstack Developer.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
