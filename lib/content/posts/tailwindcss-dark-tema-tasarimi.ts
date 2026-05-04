import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'tailwindcss-dark-tema-tasarimi',
  tag: 'Design',
  tagColor: '#06b6d4',
  title: 'TailwindCSS ile Modern Dark Tema Tasarımı',
  excerpt:
    'next-themes ve TailwindCSS ile sadece çalışan değil, iki temada da göze düzgün oturan bir dark mode yapısını nasıl kurduğuma dair sade notlar.',
  date: '2024-01-10',
  readTime: '6 dk',
  coverGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  content: [
    {
      type: 'p',
      text: 'Dark tema artık ek özellik gibi durmuyor. İnsanlar doğrudan bekliyor. Ama iyi bir dark mode yapmak sadece arka planı siyaha boyamak değil. Yazı okunaklı olacak, yüzeyler birbirinden ayrılacak ve açık temadaki düzen duygusu karanlık temada da korunacak.',
    },
    {
      type: 'p',
      text: 'Benim için en önemli nokta şu oldu: tema değişince sitenin karakteri değişmemeli. Yani biri açık, biri koyu versiyon gibi değil; aynı sitenin iki düzgün hali gibi durmalı. Bunun için de baştan temiz bir renk sistemi kurmak gerekiyor.',
    },
    { type: 'h2', text: 'Kurulum: tailwind.config ve next-themes' },
    {
      type: 'code',
      lang: 'ts',
      text: `// tailwind.config.ts
export default {
  darkMode: 'class',
  // ...
}`,
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Sunucu ilk anda hangi temanın seçileceğini bilmez. Bu yüzden hydration tarafında küçük görünen ama can sıkıcı uyuşmazlıklar çıkabilir.',
    },
    { type: 'h2', text: 'Renkleri Değişkenle Yönetmek' },
    {
      type: 'p',
      text: 'Dark mode kurarken en yorucu yol, her bileşene tek tek `dark:` sınıfı eklemek. Başta hızlı gibi görünür ama proje büyüdükçe toparlaması zorlaşır. Renkleri değişkenle yönetince hem düzen korunuyor hem de sonradan ayar yapmak kolaylaşıyor.',
    },
    {
      type: 'code',
      lang: 'css',
      text: `:root {
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
}`,
    },
    { type: 'h2', text: 'İlk Yüklenmedeki Titremeyi Önlemek' },
    {
      type: 'p',
      text: 'Tema düğmesi gibi parçalar ilk istemci renderında henüz hangi temada olduğunu bilmeyebilir. Bu durumda kullanıcı bir anlığına yanlış temayı görür, sonra ekran yerine oturur. Küçük bir `mounted` kontrolü bu titremeyi kesmek için yeterli oluyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}`,
    },
    { type: 'h2', text: 'Cam Etkili Kartlar Her Temada Aynı Çalışmaz' },
    {
      type: 'code',
      lang: 'css',
      text: `.glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

html:not(.dark) .glass {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}`,
    },
    {
      type: 'p',
      text: 'Cam etkisi koyu temada çoğu zaman güzel görünür ama açık temada aynı etki kolayca dağılır. O yüzden iki tema için aynı ayarı körü körüne kopyalamak yerine, her birini kendi içinde dengelemek daha doğru geliyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'backdrop-filter her cihazda aynı sonucu vermeyebilir. Zayıf cihazlarda okunurluk bozuluyorsa güzel görünen efektin pek anlamı kalmıyor.',
    },
  ],
}

export default post
