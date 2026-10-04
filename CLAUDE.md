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
