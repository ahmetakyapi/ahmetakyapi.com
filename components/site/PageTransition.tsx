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
 * Türsüz gezinme kısa bir solma + yükselme (`page-fade`); bağlantıya
 * `transitionTypes={['nav-forward']}` ya da `['nav-back']` verilirse yönlü
 * kayar. Animasyonlar app/globals.css'te, hareketi azaltan okuyucuda kapalı.
 * Paylaşılan öğe morfları (`project-<slug>`, `post-<slug>`) bundan
 * bağımsızdır; kendi `<ViewTransition name share="morph" default="none">`
 * sarmalayıcılarıyla gelir.
 */
const ENTER_EXIT = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'page-fade' }

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={ENTER_EXIT} exit={ENTER_EXIT} default="none">
      {children}
    </ViewTransition>
  )
}
