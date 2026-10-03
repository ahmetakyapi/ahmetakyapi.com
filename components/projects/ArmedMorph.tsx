'use client'

import { ViewTransition, useState, type ReactNode } from 'react'

/**
 * Yalnız TIKLANINCA adlanan morf: detaydaki "Sonraki Proje" küçük resmi.
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
 * Görsel ve metin SUNUCUDA çiziliyor; ada yalnız sarmalayıcı.
 */
export function ArmedMorph({
  name,
  className,
  coverClassName,
  content,
  cover,
}: {
  name: string
  className?: string
  coverClassName?: string
  content: ReactNode
  cover: ReactNode
}) {
  const [armed, setArmed] = useState(false)
  return (
    <div className={className} onClickCapture={() => setArmed(true)}>
      {content}
      <div className={coverClassName}>
        <ViewTransition name={armed ? name : undefined} share="morph" default="none">
          {cover}
        </ViewTransition>
      </div>
    </div>
  )
}
