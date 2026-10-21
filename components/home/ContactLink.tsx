'use client'

import type { ReactNode } from 'react'
import { ButtonLink } from '@/components/ui/Button'

/**
 * Hero'nun "İletişime Geç" düğmesi: kaydırma Next'in, odak burada.
 *
 * Next 16 çapaya yalnız kaydırıyor, odağa dokunmuyor: Enter'dan sonra odak
 * hero'da kalıyor, sonraki Tab sayfayı Hakkımda'ya geri atıyordu. Düz
 * `<a href="#iletisim">` odağı taşırdı ama geçmiş kaydı Next'in olmazdı:
 * oradan başka sayfaya gidip geri dönünce adres `/#iletisim`, içerik
 * önceki sayfa kalıyordu (ölçüldü, 21 Ekim 2026). `onNavigate` yalnız
 * istemci gezinmesinde çalışır; yeni sekmede açan tıklama odağı taşımaz.
 * Hedef başlık `tabIndex={-1}` (Closing).
 */
export function ContactLink({ children }: { children: ReactNode }) {
  return (
    <ButtonLink
      href="/#iletisim"
      variant="secondary"
      size="lg"
      onNavigate={() => document.getElementById('iletisim')?.focus({ preventScroll: true })}
    >
      {children}
    </ButtonLink>
  )
}
