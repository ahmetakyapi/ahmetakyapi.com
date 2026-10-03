'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { buttonClass } from '@/components/ui/Button'
import { copyText } from '@/components/ui/CopyButton'

/**
 * Kod bloğunun kopyala düğmesi: yazı sayfasının üç istemci adacığından biri.
 *
 * Kodu prop olarak ALMAZ, kendi bloğunun `<pre>`sinden okur. Prop olarak
 * verilseydi her kod bloğu sayfaya iki kez inerdi: bir kez HTML'de, bir kez
 * de RSC yükünde bu düğmenin argümanı olarak.
 */
const RESET_MS = 1800

export function CopyCode() {
  const ref = useRef<HTMLButtonElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function handleClick() {
    const code = ref.current?.closest('figure')?.querySelector('pre')?.textContent ?? ''
    const ok = code !== '' && (await copyText(code))
    setState(ok ? 'copied' : 'error')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), RESET_MS)
  }

  return (
    <button ref={ref} type="button" onClick={handleClick} className={buttonClass({ variant: 'ghost', size: 'sm' })}>
      {state === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{state === 'copied' ? 'Kopyalandı' : state === 'error' ? 'Tekrar Dene' : 'Kopyala'}</span>
    </button>
  )
}
