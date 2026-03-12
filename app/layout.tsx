import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ahmet Akyapı | Frontend Developer',
  description:
    'React, TypeScript ve Next.js odaklı çalışan Frontend Developer. Performanslı, rafine ve kullanıcı odaklı ürün deneyimleri geliştiriyorum.',
  keywords: ['Frontend Developer', 'React', 'TypeScript', 'Next.js', 'Ahmet Akyapı'],
  authors: [{ name: 'Ahmet Akyapı', url: 'https://github.com/ahmetakyapi' }],
  openGraph: {
    title: 'Ahmet Akyapı | Frontend Developer',
    description: 'React, TypeScript ve Next.js odaklı Frontend Developer.',
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
