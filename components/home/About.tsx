import Link from 'next/link'
import type { ReactNode } from 'react'
import { MaskTitle } from '@/components/home/MaskTitle'
import { Container } from '@/components/ui/Container'
import type { HomeContent } from '@/lib/site-content'

/**
 * Hakkımda: sahibinin kendi metni, editoryal ve rahat okunan.
 *
 * Yerinde "Nasıl Çalışırım" vardı ve kelime kelime aydınlanan tek bir
 * paragraftı. Bu metin dört paragraf; o efekt bu uzunlukta okumayı
 * yavaşlatıyordu, kaldırıldı. Paragraflar görünüme girerken yalnız hafifçe
 * belirir (home.css → `.home-about-p`), hareketi azaltan okuyucuda hiç.
 *
 * Masaüstünde iki sütun: solda başlık yapışkan, sağda metin (30em: Schibsted'te 58ch ~77 karakter çıkıyordu; satır
 * başına ~65 karakter, ölçüldü).
 * Son paragraf ekran dışı hayat; ince bir çizgiyle ayrılır ve bir punto
 * küçük durur, ama kart değil.
 *
 * Bölüm sayfanın TEK renk bloğu: zemini kenardan kenara `surface-sunken`
 * ve kaydırdıkça yumuşakça koyulaşır (home.css → `.home-about`). Neden:
 * hero'dan sonra "isim"den "kişi"ye geçildiği, sayfanın en kişisel ve en
 * uzun okunan bölümüne girildiği hissedilsin; okuma bitince zemin geri
 * açılır ve projeler başlar.
 *
 * Ürün adları ilk geçtikleri yerde proje sayfasına ince altı çizili
 * bağlantı. Eşleme ad → slug burada; metin (lib/site-content.ts) düz kalır.
 */
const PRODUCT_LINKS = [
  { name: 'Açılış Zili', slug: 'acilis-zili' },
  { name: 'Derinay', slug: 'derinay' },
  { name: 'Ramazan Vakitleri', slug: 'ramazan-vakitleri' },
  { name: 'Dungeon Mates', slug: 'dungeon-mates' },
] as const

const LINK =
  'underline decoration-line-strong decoration-1 underline-offset-[0.22em] transition-colors hover:text-primary-ink hover:decoration-primary-ink'

/** Paragrafı düz metin + bağlantı parçalarına böler; her ad yalnız bir kez bağlanır. */
function linkify(text: string, used: Set<string>): ReactNode[] {
  const parts: ReactNode[] = []
  let rest = text
  for (;;) {
    let hit: { index: number; name: string; slug: string } | null = null
    for (const product of PRODUCT_LINKS) {
      if (used.has(product.slug)) continue
      const index = rest.indexOf(product.name)
      if (index >= 0 && (!hit || index < hit.index)) hit = { index, name: product.name, slug: product.slug }
    }
    if (!hit) break
    used.add(hit.slug)
    parts.push(rest.slice(0, hit.index))
    parts.push(
      <Link key={hit.slug} href={`/projeler/${hit.slug}`} className={LINK}>
        {hit.name}
      </Link>,
    )
    rest = rest.slice(hit.index + hit.name.length)
  }
  parts.push(rest)
  return parts
}

export function About({ about }: { about: HomeContent['about'] }) {
  const used = new Set<string>()
  const body = about.paragraphs.slice(0, -1)
  const aside = about.paragraphs.at(-1)

  return (
    <section id="hakkimda" aria-labelledby="hakkimda-baslik" className="home-about">
      <Container size="wide" className="pb-4 pt-10 sm:pb-8 sm:pt-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="hakkimda-baslik" className="home-title lg:sticky lg:top-28">
              <MaskTitle accentLast>{about.title}</MaskTitle>
            </h2>
          </div>

          <div className="max-w-[30em] text-[clamp(1.1875rem,0.95rem+0.55vw,1.3125rem)] leading-[1.7] text-strong">
            {body.map((paragraph, i) => (
              <p key={i} className="home-about-p mt-[1.1em] first:mt-0">
                {linkify(paragraph, used)}
              </p>
            ))}
            {aside ? (
              <p className="home-about-p mt-12 border-t border-line pt-8 text-read text-body">{linkify(aside, used)}</p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
