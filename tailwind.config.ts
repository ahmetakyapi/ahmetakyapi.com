import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /**
       * Tailwind'in varsayılan opaklık skalası 5'in katlarıdır. Kodda
       * `/8`, `/12`, `/42` gibi ara değerler kullanılıyordu ve bunlar
       * SESSİZCE hiç CSS üretmiyor, sınıf light fallback'ine düşüyordu —
       * dark temada hero ayırıcısı parlak gri bir çizgi olarak çiziliyordu.
       * Kullanılan ara değerler burada tanımlı.
       */
      opacity: {
        3: '0.03',
        4: '0.04',
        6: '0.06',
        7: '0.07',
        8: '0.08',
        12: '0.12',
        14: '0.14',
        16: '0.16',
        18: '0.18',
        22: '0.22',
        42: '0.42',
        48: '0.48',
        55: '0.55',
        65: '0.65',
        74: '0.74',
        88: '0.88',
      },
      colors: {
        /* Yüzey tokenları — globals.css'teki CSS değişkenlerine bağlı.
           Her yeni koyu yüzey hex'i buraya, bileşene değil. */
        page: 'var(--surface-page)',
        card: 'var(--surface-card)',
        raised: 'var(--surface-raised)',
        sunken: 'var(--surface-sunken)',
        hairline: 'var(--line)',
        'hairline-strong': 'var(--line-strong)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: '1.25rem',
        panel: '1.75rem',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        gradient: 'gradient 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
        'grid-light':
          'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
    },
  },
  plugins: [],
}
export default config
