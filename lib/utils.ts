import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Kendi punto adlarımız (`app/globals.css` → `@theme` içindeki `--text-*`).
 *
 * twMerge'e TANITILMAK ZORUNDA. Birleştirici `text-sm` gibi kendi bildiği
 * adları punto sayar; tanımadığı `text-read`i ise RENK sanar. Renk
 * token'larımız da aynı önekle yazıldığı için (`text-strong`, `text-muted`)
 * ikisi tek gruba düşer ve sonuncusu kazanır:
 *
 *     cn("text-read", "text-strong")  →  "text-strong"   (punto sessizce gider)
 *
 * Ölçeğe yeni bir basamak eklersen buraya da ekle.
 */
export const TEXT_SIZES = [
  'micro',
  'small',
  'read',
  'lead',
  'title',
  'heading',
  'display',
  'hero',
] as const

/** Yarıçap rolleri (`rounded-card`, `rounded-button`) aynı sebeple. */
export const RADII = ['card', 'button'] as const

/* Birleştirici İLK `cn` çağrısında kurulur. Modül düzeyinde kurulsaydı
   (`const twMerge = extendTailwindMerge(…)`) bu bir yan etki olurdu ve
   `cx`i içe aktaran her istemci bileşeni tailwind-merge'ü pakete çekerdi:
   ölçüldü, öyle oldu (+9 KB gzip, her sayfa). */
let twMerge: ((classes: string) => string) | undefined

function merge(classes: string) {
  twMerge ??= extendTailwindMerge({
    extend: {
      classGroups: {
        'font-size': [{ text: [...TEXT_SIZES] }],
        rounded: [{ rounded: [...RADII] }],
      },
    },
  })
  return twMerge(classes)
}

/**
 * Sınıf birleştirici, iki tane:
 *
 *   cx(...)  clsx: yalnızca birleştirir (~0,5 KB). components/ui ve
 *            components/site HEP bunu kullanır, çünkü oradaki her dosya bir
 *            istemci bileşenine girebilir.
 *   cn(...)  clsx + tailwind-merge: çakışan sınıfı ayıklar ("px-2 px-4" →
 *            "px-4"). YALNIZCA sunucu bileşenlerinde.
 *
 * Neden ikisi: tailwind-merge istemci paketine ~9 KB (gzip) ekliyor ve
 * ölçüldü: Header, ThemeToggle ve Button `cn` kullanırken her sayfanın ilk
 * yükünde o 9 KB vardı (performans bütçesi 140 KB). Primitive'lerde
 * çakışma prop'la çözülür (`variant`, `size`); `className` ekler, ezmez.
 */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs))
}
