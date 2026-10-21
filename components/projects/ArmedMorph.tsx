'use client'

import { ViewTransition, createContext, useContext, useRef, useState, type ReactNode } from 'react'

/** Takılı ad; ArmedMorph dışında (ya da tıklanmadan) yok. */
const ArmedNameContext = createContext<string | undefined>(undefined)

/**
 * Yalnız TIKLANINCA adlanan morf: /projeler satırlarının önizlemesi ve
 * detaydaki "Sıradaki Proje" küçük resmi.
 *
 * Küçük resim sonraki projenin kahramanına morf etmek için
 * `project-<sonraki>` adını taşımak zorunda. Ad hep takılı kalınca dizinden
 * gelen geçişte YANLIŞ bir çift kuruluyordu: Mimio'ya tıklayınca dizinde
 * hemen yanındaki One Piece Hub kartı da görünür ve yeni sayfanın dibindeki
 * "Sonraki Proje: One Piece Hub" küçük resmiyle eşleşip ekranın dışına
 * uçuyordu (ölçüldü, 3 Ekim 2026). Ad artık yalnız bu bölgede bir tıklama
 * olunca takılıyor; durum güncellemesi ayrık olay önceliğinde, gezinme
 * geçişi başlamadan işleniyor.
 *
 * Adı hangi kutunun taşıyacağını kapak seçer (`<ProjectCover morph="armed" />`
 * → ArmedName): dev-starter'da 16/10 çerçeve değil afişin kendisi.
 * Görünmeyen kapak (masaüstünde klavyeyle Enter, önizleme saydam) ad
 * almaz: saydam kutunun kırpık görüntüsü kahramana uçuyordu; gezinme
 * düz yönlü geçişle olur.
 *
 * Görsel ve metin SUNUCUDA çiziliyor; ada yalnız sarmalayıcı.
 */
export function ArmedMorph({
  name,
  className,
  coverClassName,
  content,
  cover,
  coverHidden = false,
}: {
  name: string
  className?: string
  coverClassName?: string
  content: ReactNode
  cover: ReactNode
  /** Görsel süs: ad hemen yanında yazılı, ekran okuyucuya ikinci kez söylenmez. */
  coverHidden?: boolean
}) {
  const [armed, setArmed] = useState(false)
  const coverRef = useRef<HTMLDivElement>(null)

  function arm() {
    const el = coverRef.current
    if (!el?.checkVisibility || el.checkVisibility({ opacityProperty: true })) setArmed(true)
  }

  return (
    <div className={className} onClickCapture={arm}>
      {content}
      <div ref={coverRef} className={coverClassName} aria-hidden={coverHidden || undefined}>
        <ArmedNameContext value={armed ? name : undefined}>{cover}</ArmedNameContext>
      </div>
    </div>
  )
}

/** Kapağın morf kutusu: ArmedMorph tıklanınca takılan adı taşır. */
export function ArmedName({ children }: { children: ReactNode }) {
  const name = useContext(ArmedNameContext)
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  )
}
