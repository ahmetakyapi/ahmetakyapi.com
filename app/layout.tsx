import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ahmet Akyapı | Fullstack Developer',
  description:
    'React, TypeScript ve Next.js odaklı çalışan Fullstack Developer. Performanslı, rafine ve kullanıcı odaklı ürün deneyimleri geliştiriyorum.',
  keywords: ['Fullstack Developer', 'React', 'TypeScript', 'Next.js', 'Ahmet Akyapı'],
  authors: [{ name: 'Ahmet Akyapı', url: 'https://github.com/ahmetakyapi' }],
  openGraph: {
    title: 'Ahmet Akyapı | Fullstack Developer',
    description: 'React, TypeScript ve Next.js odaklı Fullstack Developer.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
