# ahmetakyapi.com — Claude Code notları

## Yayın: doğrudan `main`

Değişiklikler doğrudan `main`'e gönderilir; sahibi ayrı dal ya da PR
istemiyor (4 Ekim 2026). Site Vercel'den `main` ile yayınlanıyor; ayrı bir
dalda kalan iş canlıya çıkmaz ve "deploy oldu mu, eskisi gibi duruyor"
sorusuna dönüşür. Oturum bir özellik dalı atasa bile iş bitince `main`'e
aktarılır (`git push origin HEAD:main`, hızlı ileri sarma).

Göndermeden önce üçü de temiz olmalı: `npm run typecheck`, `npm run lint`,
`npm run build`. Gönderdikten sonra canlıda yeni bir dosyanın ya da
değişikliğin geldiğini kontrol et (`https://www.ahmetakyapi.com`; çıplak
alan adı www'ye 307 ile yönleniyor).

## Yığın ve komutlar

Next.js 16 (App Router) · React 19 · Tailwind v4 · `motion` · TypeScript.
`npm run typecheck` (`next typegen && tsc --noEmit`), `npm run lint`, `npm run build`.

## İçerik nerede

- Projeler: `lib/content/projects.ts` (`featured`), sıra `lib/project-order.ts`
  (`ORDER`; öne çıkanlar önce), ana sayfa seçkisi `lib/site-content.ts` →
  `selectedWork`. Blog yazıları `lib/content/posts/*.ts`.
- Proje görselleri: `public/projects/<slug>/{desktop,desktop-2,mobile}-{dark,light}.webp`,
  envanter `lib/content/project-shots.ts` (dosya eklenir/silinirse burası da
  değişir). Çekim ölçüsü: masaüstü 1080×675, telefon 390×844, ikisi de 2x, WebP
  q80; canlı siteden, intro perdesi atlanarak. Paylaşım kartı kaynağı
  `assets/project-og/<slug>.jpg` (masaüstü koyu görselden 1050×656, JPEG q78).
- Tema çerez ile (`theme`, `lib/theme.ts`), next-themes yok.

## Commit yazarı

Commitler her zaman `Ahmet Akyapı <ahmetakyapii@gmail.com>` adına atılır;
yazarı yalnızca "Claude" olan commit atılmaz. Claude, mesajın sonundaki
`Co-Authored-By: Claude …` satırıyla ortak yazar olarak görünür. Oturum
başında, ilk committen önce:

```bash
git config user.name "Ahmet Akyapı"
git config user.email "ahmetakyapii@gmail.com"
```

Bu kural sahibinin tüm repolarında geçerli (9 Ekim 2026).

