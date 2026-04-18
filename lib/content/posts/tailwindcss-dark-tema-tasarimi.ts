import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'tailwindcss-dark-tema-tasarimi',
    tag: 'Design',
    tagColor: '#06b6d4',
    title: 'TailwindCSS ile Modern Dark Tema Tasarımı',
    excerpt:
      'next-themes ve TailwindCSS kullanarak kullanıcı tercihine saygı duyan, tutarlı dark/light tema sistemi kurmanın detaylı rehberi.',
    date: '2024-01-10',
    readTime: '6 dk',
    coverGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    content: [
      { type: 'p', text: 'Dark tema artık bir "ekstra özellik" değil, kullanıcıların beklediği temel bir UX standardı. Doğru yapmak; sistemin tercihine saygı duymak, her iki temada da tutarlı görünmek ve hydration sorunlarına düşmemekten geçiyor.' },
      { type: 'h2', text: 'Kurulum: tailwind.config + next-themes' },
      { type: 'code', lang: 'ts', text: `// tailwind.config.ts
export default {
  darkMode: 'class', // 'media' değil — kullanıcı kontrolü için
  // ...
}` },
      { type: 'code', lang: 'tsx', text: `// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>   {/* Flash önlemek için şart */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}        // sistem tercihini ignore etmek için
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}` },
      { type: 'callout', variant: 'warning', text: 'suppressHydrationWarning olmadan "Text content did not match" hydration hatası alırsınız çünkü sunucu hangi temayı seçeceğini bilmez.' },
      { type: 'h2', text: 'CSS Değişkenleri ile Tutarlı Renk Sistemi' },
      { type: 'p', text: 'Her rengi dark: prefixi ile ikiye katlamak yerine CSS değişkenleri kurmak çok daha ölçeklenebilir.' },
      { type: 'code', lang: 'css', text: `/* globals.css */
:root {
  --bg:       255 255 255;
  --surface:  248 250 252;
  --text:      15  23  42;
  --muted:    100 116 139;
  --border:   226 232 240;
  --accent:    99 102 241;
}

.dark {
  --bg:         5   8  16;
  --surface:   15  18  28;
  --text:      241 245 249;
  --muted:     100 116 139;
  --border:    30  41  59;
  --accent:    129 140 248;
}

/* tailwind.config'de: */
/* colors: { bg: 'rgb(var(--bg) / <alpha-value>)' } */` },
      { type: 'h2', text: 'Hydration Flash Sorununu Çözmek' },
      { type: 'p', text: 'next-themes kullanan bileşenler ilk render\'da temayı bilmez. mounted state ile çözülür.' },
      { type: 'code', lang: 'tsx', text: `'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" /> // placeholder, layout shift önler

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}` },
      { type: 'h2', text: 'Glassmorphism: Her İki Temada Çalışan Kart' },
      { type: 'code', lang: 'css', text: `/* Dark varsayılan, light override */
.glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

html:not(.dark) .glass {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}` },
      { type: 'callout', variant: 'tip', text: 'Glassmorphism backdrop-filter\'ı desteklemez tarayıcılarda için @supports ile fallback verin: @supports not (backdrop-filter: blur(1px)) { .glass { background: rgb(var(--surface)); } }' },
    ],
  }

export default post
