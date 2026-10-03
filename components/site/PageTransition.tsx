import { ViewTransition, type ReactNode } from 'react'

/**
 * Sayfa içeriğinin rota geçişi (template.tsx'teki CSS `route-in`in yerine).
 *
 *   export default function Page() {
 *     return <PageTransition>…</PageTransition>
 *   }
 *
 * Layout'a DEĞİL her `page.tsx`e konur: layout gezinmede kalıcı olduğu için
 * orada giriş/çıkış hiç tetiklenmez.
 *
 * Türsüz gezinme perde silme (`page-in`/`page-out`, globals.css); bağlantıya
 * `transitionTypes={['nav-forward']}` ya da `['nav-back']` verilirse yönlü
 * kayar. Animasyonlar app/globals.css'te, hareketi azaltan okuyucuda kapalı.
 * Paylaşılan öğe morfları (`project-<slug>`, `post-<slug>`) bundan
 * bağımsızdır; kendi `<ViewTransition name share="morph" default="none">`
 * sarmalayıcılarıyla gelir.
 */
const ENTER = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'page-in' }
const EXIT = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'page-out' }

/*
 * TEK sarmalayıcı, opak zeminli. İkisi de ölçülerek eklendi:
 *   - React `<ViewTransition>` her ÇOCUĞU ayrı yakalıyor: ana sayfanın yedi
 *     bölümü yedi ayrı geçiş grubuydu ve perde silme her bölümün kendi
 *     tepesinden ayrı ayrı başlıyordu (yedi mavi çizgi).
 *   - Silmenin mavi kenarı yeni sayfa grubunun zemini; yeni sayfanın
 *     görüntüsü saydam olunca zemin bütün sayfanın arkasından görünüyordu.
 *     Sarmalayıcı sayfa zemininde: görüntü opak, mavi yalnız kenarda.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={ENTER} exit={EXIT} default="none">
      <div className="bg-page">{children}</div>
    </ViewTransition>
  )
}
