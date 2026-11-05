'use client'

import { useSyncExternalStore } from 'react'

/**
 * İstanbul'da şimdiki saat ("15:42"), dakikada bir yenilenir.
 *
 * Sayfa statik: sunucu saati bilemez, ilk boyamada yer tutucu (`--:--`)
 * basılır ve istemci kendi saatini koyar. Hidrasyon farkı yok:
 * `useSyncExternalStore` sunucu anlık görüntüsünü (`null`) ilk karede
 * kullanır, sonra istemcininkine geçer. Zamanlayıcı dakikanın başına
 * hizalanır; saniyede bir değil, dakikada bir çalışır.
 */
const FORMAT = new Intl.DateTimeFormat('tr-TR', {
  timeZone: 'Europe/Istanbul',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>
  const tick = () => {
    onChange()
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
  }
  timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
  return () => clearTimeout(timer)
}

/* Dakika içinde aynı dizeyi döndürür: React gereksiz çizim yapmaz. */
const snapshot = () => FORMAT.format(Date.now())
const serverSnapshot = () => null

export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  return (
    <time className={className} suppressHydrationWarning>
      {time ?? '--:--'}
    </time>
  )
}
