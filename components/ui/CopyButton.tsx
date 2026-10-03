'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from '@/components/ui/Button'

/**
 * Panoya kopyalama düğmesi.
 *
 *   <CopyButton value="ahmet@ahmetakyapi.com">E-postayı Kopyala</CopyButton>
 *   <CopyButton value={kod} variant="ghost" size="sm" copiedLabel="Kopyalandı" />
 *
 * Sonuç ekran okuyucuya `aria-live` ile söylenir; görsel etiket 1,8 sn
 * sonra eski hâline döner. Clipboard API yoksa (eski Safari, güvensiz
 * köken) gizli textarea yöntemine düşer; o da olmazsa "Tekrar Dene" der.
 */
const RESET_MS = 1800

type CopyButtonProps = {
  value: string
  children?: ReactNode
  copiedLabel?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function CopyButton({
  value,
  children = 'Kopyala',
  copiedLabel = 'Kopyalandı',
  variant = 'secondary',
  size = 'md',
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function handleClick() {
    const ok = await copyText(value)
    setState(ok ? 'copied' : 'error')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), RESET_MS)
  }

  return (
    <button type="button" onClick={handleClick} className={buttonClass({ variant, size, className })}>
      {state === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{state === 'copied' ? copiedLabel : state === 'error' ? 'Tekrar Dene' : children}</span>
    </button>
  )
}

export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Aşağıdaki textarea yöntemine düş.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)
  return copied
}
