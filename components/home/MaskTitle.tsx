import type { ReactNode } from 'react'

/**
 * Bölüm başlığının maskeli açılışı: metin kendi satırının altından yükselir.
 *
 *   <h2 className="home-title"><MaskTitle accentLast>Öne Çıkan Projeler</MaskTitle></h2>
 *
 * Neden: ana sayfada her bölüm aynı hareketle "başlar"; okuyucu bir kutudan
 * ötekine atlamıyor, aynı hikâyenin sıradaki başlığını okuyor. Zamanlayıcı
 * başlığın kendi görünümü (home.css → `.home-mask`), JavaScript yok.
 * Desteksiz tarayıcıda ve hareketi azaltan okuyucuda başlık olduğu gibi.
 *
 * `accentLast`: son kelime markanın mavisinde ("Gece Mavisi" yönü, 3 Ekim
 * 2026). Bütün bölüm başlıkları aynı kalıpta; renk yalnız metin rengi,
 * degrade değil. `.display-ink` taşıyan bir başlığa konmaz
 * (globals.css → TUZAK).
 */
export function MaskTitle({ children, accentLast = false }: { children: ReactNode; accentLast?: boolean }) {
  let content = children
  if (accentLast && typeof children === 'string') {
    const cut = children.lastIndexOf(' ')
    if (cut > 0) {
      content = (
        <>
          {children.slice(0, cut)} <span className="home-title-accent">{children.slice(cut + 1)}</span>
        </>
      )
    }
  }
  return (
    <span className="home-mask">
      <span className="home-mask-in">{content}</span>
    </span>
  )
}
