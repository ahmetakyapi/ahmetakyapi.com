import { clsx, type ClassValue } from 'clsx'

/**
 * Sınıf birleştirici: clsx, yalnızca birleştirir (~0,5 KB).
 *
 * Çakışan sınıfı ayıklayan bir birleştirici (tailwind-merge) BİLEREK yok:
 * istemci paketine ~9 KB (gzip) ekliyordu ve ölçüldü, Header, ThemeToggle
 * ve Button onu kullanırken her sayfanın ilk yükünde o 9 KB vardı
 * (performans bütçesi 140 KB). Primitive'lerde çakışma prop'la çözülür
 * (`variant`, `size`); `className` ekler, ezmez.
 */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs)
}
