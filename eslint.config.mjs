import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

/* Next 16'da `next lint` yok; ESLint doğrudan çalışır ("lint": "eslint").
   Eski .eslintrc.json'daki üç kural korunuyor. Bir kural rahatsız ediyorsa
   önce sorunu düzelt, `eslint-disable` yazma. */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    /* ThemedImage iki düz <img> basıyor ve bu bilinçli: next/image'ın
       optimizer'ı Vercel kotası yüzünden kapalı, kaynaklar gösterim
       ölçüsünde WebP ve ikisinden biri CSS ile gizleniyor. next/image
       `unoptimized` ile de aynı <img>'i üretirdi, yalnızca sarmalayıcıyla.
       İstisna dosya düzeyinde ve tek; başka yerde <img> yazılmaz,
       ThemedImage kullanılır. */
    files: ['components/ui/ThemedImage.tsx'],
    rules: { '@next/next/no-img-element': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '**/.tmp-*']),
])

export default eslintConfig
