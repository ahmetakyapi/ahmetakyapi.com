/**
 * Tema sabitleri. Bu modül SAF: sunucu ve istemci ikisi de okur (çerez
 * adı tema düğmesinde, betik kök layout'ta lazım). `next/headers` burada
 * olsaydı istemci bu modülü içe aktaramazdı.
 *
 * Tema tek kaynaktan: çerez. Sayfalar STATİK: sunucu `<html data-theme>`
 * özniteliğine varsayılanı basar, `<head>`'deki engelleyici küçük betik
 * (THEME_SCRIPT) ilk boyamadan ÖNCE çerezi okuyup doğru temayı yazar; yanlış
 * tema hiç boyanmaz (FOUC yok).
 *
 * Neden sunucuda çerezden değil (Açılış Zili ve dev-starter şablonu öyle):
 * kök layout `cookies()` okuyunca BÜTÜN rotalar dinamik oluyor ve her ziyaret
 * bir fonksiyon çağrısına dönüyordu (3 Ekim 2026, build çıktısında her rota
 * ƒ). Portfolyo için yanlış takas: içerik değişmiyor, Hobby planında
 * fonksiyon kotası da sınırlı. Statik HTML + 300 baytlık betik aynı sonucu
 * veriyor.
 *
 * next-themes yine yok: o temayı hidrasyondan sonra yazıyordu ve bileşenler
 * `mounted` bekçisi tutuyordu. Burada öznitelik ilk boyamadan önce doğru.
 */
export const THEME_COOKIE = 'theme'
export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

/** Portfolyo: varsayılan KOYU. Açık tema eksiksiz, çerezle seçilir. */
export const DEFAULT_THEME: Theme = 'dark'

/**
 * Renk paleti: `<html data-palette>`. Değerler app/globals.css'te; bu site
 * Açılış Zili'nin `signature` mavi ailesini kullanıyor.
 */
export const PALETTE = 'signature' as const

/**
 * Her temanın sayfa zemini, CSS'in okunamadığı yerler için (viewport
 * `themeColor`, manifest, paylaşım görseli). Kaynak `app/globals.css` →
 * `--page-bg`; orada değişirse burada da değişir.
 */
export const THEME_COLOR = { dark: '#070d16', light: '#f7f9fb' } as const satisfies Record<Theme, string>

/** Çerez bir yıl yaşar; tercih her ziyarette yenilenmek zorunda kalmaz. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/**
 * `<head>` içinde, ilk boyamadan önce çalışan betik. Çerezdeki temayı
 * `<html data-theme>`'ye ve tarayıcı çubuğu rengine yazar. Bağımlılıksız ve
 * hatada sessiz: çerez okunamazsa varsayılan tema kalır.
 * `theme-color` meta etiketi betikten sonra basılabildiği için onu
 * DOMContentLoaded'da da günceller.
 */
export const THEME_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(dark|light)/);var t=m?m[1]:"${DEFAULT_THEME}";var d=document.documentElement;d.dataset.theme=t;var c=${JSON.stringify(THEME_COLOR)}[t];var s=function(){var e=document.querySelector('meta[name="theme-color"]');if(e)e.setAttribute("content",c)};s();document.addEventListener("DOMContentLoaded",s)}catch(e){}})()`
