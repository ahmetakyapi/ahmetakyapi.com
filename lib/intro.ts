/**
 * Açılış perdesi (components/site/IntroCurtain.tsx): oturumun İLK
 * yüklemesinde ~1,2 saniyelik markalı giriş.
 *
 * Perdeyi CSS gösterir, ama yalnız `<html data-intro>` varsa. Özniteliği
 * `<head>`deki bu küçük betik ilk boyamadan ÖNCE koyar; yani:
 *   - JavaScript kapalıysa öznitelik yok, perde hiç görünmez;
 *   - betik engelleyici ve satır içi, "geç yüklenme" diye bir durum yok;
 *   - sayfa statik kalır (sunucu hiçbir şey okumaz, UA kontrolü burada).
 *
 * Göstermediği durumlar: aynı sekmede ikinci yükleme (sessionStorage),
 * hareketi azaltan okuyucu, otomasyon (`navigator.webdriver`), bilinen bot
 * ve önizleme ajanları, adreste çapa (#hakkimda gibi bir yere doğrudan
 * gelen okuyucu beklemesin).
 *
 * 4 Ekim 2026: perde imza tamamen yazılana kadar bekliyor (kalkış 760
 * ms'den 1500 ms'ye); kahramanın girişi buna göre kaydı (isim 1500/1590,
 * alt blok 1760 + 700 ≈ 2460 ms), öznitelik 2700'de kalkıyor.
 *
 * Öznitelik INTRO_CLEAR_MS sonra kalkar: kalkmasaydı ana sayfaya istemci
 * gezinmesiyle dönüldüğünde kahramanın harf girişi perdeyi bekleyip
 * (gecikmeli) yeniden oynardı. Süre harf girişinin bitişinden sonra
 * seçildi (masaüstü 760 + son harf 340 + 520 ≈ 1620 ms, telefonda 900 ile
 * ≈ 1760 ms, alt blok ≈ 1680 ms);
 * erken kalksaydı animasyon gecikmesi ortada kısalır ve harfler sıçrardı.
 */
export const INTRO_KEY = 'intro-seen'
export const INTRO_CLEAR_MS = 2700

const BOT_UA =
  'bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|slack|vercel|pingdom|gtmetrix'

export const INTRO_SCRIPT = `(function(){try{var s=window.sessionStorage;if(s.getItem("${INTRO_KEY}"))return;s.setItem("${INTRO_KEY}","1");if(navigator.webdriver||location.hash)return;if(/${BOT_UA}/i.test(navigator.userAgent))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-intro","");setTimeout(function(){d.removeAttribute("data-intro")},${INTRO_CLEAR_MS})}catch(e){}})()`
