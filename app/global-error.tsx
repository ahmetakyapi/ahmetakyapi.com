'use client'

/**
 * Son çare: kök layout çöktüğünde devreye girer ve onun YERİNE geçer.
 *
 * Kendi `<html>` ve `<body>`sini basmak zorunda; globals.css'in yüklendiğine
 * güvenilemez. Renkler bu yüzden satır içi ve `signature` paletinin
 * değerleriyle aynı (token tekrarı bilinçli bir istisna). Tema çerezi
 * okunamadığı için işletim sistemi tercihine bakılır.
 */
const STYLES = `
:root{color-scheme:dark light;--bg:#070d16;--fg:#eaf1f8;--soft:#94a7ba;--btn:#35b8ff;--on:#06121f}
@media (prefers-color-scheme:light){:root{--bg:#f5f7fa;--fg:#0e1a28;--soft:#3a4a5c;--btn:#0d74c4;--on:#fff}}
body{margin:0;min-height:100dvh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,sans-serif;padding:1rem}
main{max-width:28rem;text-align:center}
h1{font-size:1.5rem;margin:0 0 .75rem}
p{color:var(--soft);margin:0}
button{margin-top:1.5rem;min-height:44px;padding:0 1.25rem;border:0;border-radius:.75rem;background:var(--btn);color:var(--on);font:600 .875rem system-ui,sans-serif;cursor:pointer}
code{display:block;margin-top:1.5rem;font-size:.75rem;color:var(--soft)}
`

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="tr">
      <head>
        <title>Bir Şeyler Ters Gitti</title>
        <style>{STYLES}</style>
      </head>
      <body>
        <main>
          <h1>Site Şu An Açılamıyor</h1>
          <p>Beklenmedik bir hata oluştu. Tekrar dene; sorun sürerse birazdan yeniden bak.</p>
          <button type="button" onClick={() => retry()}>
            Tekrar Dene
          </button>
          {error.digest ? <code>Hata Kimliği {error.digest}</code> : null}
        </main>
      </body>
    </html>
  )
}
