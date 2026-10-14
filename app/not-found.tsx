import type { Metadata } from 'next'
import { Logo } from '@/components/site/Logo'
import { NotFoundSuggest, type SuggestTarget } from '@/components/site/NotFoundSuggest'
import { ButtonLink } from '@/components/ui/Button'
import { blogPosts } from '@/lib/content/posts'
import { projects } from '@/lib/content/projects'

export const metadata: Metadata = { title: 'Sayfa Bulunamadı' }

/**
 * 404: sade ve markalı, iki bağlantı. Eski sürümdeki "glitch" animasyonu
 * istemci bileşeniydi ve yalnızca süs için JavaScript yüklüyordu.
 *
 * Bu sayfa (site) kabuğunun DIŞINDA çizilir (kök not-found), o yüzden
 * atlama bağlantısının hedefi burada kendi `<main>`i.
 *
 * Altta "Bunu mu arıyordun?" (NotFoundSuggest): adrese en çok benzeyen
 * proje ya da yazı. İstemciye yalnız başlık, adres ve slug gider.
 */
const SUGGEST_TARGETS: SuggestTarget[] = [
  ...projects.map((p) => ({ title: p.title, href: `/projeler/${p.slug}`, slug: p.slug, kind: 'Proje' as const })),
  ...blogPosts.map((p) => ({ title: p.title, href: `/blog/${p.slug}`, slug: p.slug, kind: 'Yazı' as const })),
]

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto grid min-h-dvh max-w-xl place-items-center px-4 py-16 text-center">
      <div>
        <Logo size={48} className="mx-auto" />
        <p className="mt-8 font-mono text-small text-muted">404</p>
        <h1 className="mt-2 text-display font-semibold tracking-[-0.03em]">Sayfa Bulunamadı</h1>
        <p className="mt-4 text-base text-body">Aradığın adres taşınmış ya da hiç var olmamış olabilir.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Ana Sayfa
          </ButtonLink>
          <ButtonLink href="/blog" variant="secondary">
            Yazıları Oku
          </ButtonLink>
        </div>
        <NotFoundSuggest targets={SUGGEST_TARGETS} />
      </div>
    </main>
  )
}
