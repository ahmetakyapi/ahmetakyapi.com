import type { ReactNode } from 'react'

/**
 * Bölüm başlığının maskeli açılışı: metin kendi satırının altından yükselir.
 *
 *   <h2><MaskTitle>Öne Çıkan Projeler</MaskTitle></h2>
 *
 * Neden: ana sayfada her bölüm aynı hareketle "başlar"; okuyucu bir kutudan
 * ötekine atlamıyor, aynı hikâyenin sıradaki başlığını okuyor. Zamanlayıcı
 * başlığın kendi görünümü (home.css → `.home-mask`), JavaScript yok.
 * Desteksiz tarayıcıda ve hareketi azaltan okuyucuda başlık olduğu gibi.
 * `.display-ink` taşıyan bir başlığa konmaz (globals.css → TUZAK).
 */
export function MaskTitle({ children }: { children: ReactNode }) {
  return (
    <span className="home-mask">
      <span className="home-mask-in">{children}</span>
    </span>
  )
}
