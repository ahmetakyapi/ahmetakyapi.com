import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { MaskTitle } from '@/components/home/MaskTitle'
import { Container } from '@/components/ui/Container'
import type { BlogPost, Project } from '@/lib/content/types'

/**
 * Ne Yaptım: görsel yok, yalnız sayılar ve alanlar.
 *
 * Yerinde bir dönem ekran görüntülerinden yatay bir proje şeridi vardı;
 * hemen altındaki Seçili İşler de ekran görüntüsü taşıdığı için iki bölüm
 * birbirinin tekrarı gibi okunuyordu. Bu bölüm sayfanın tek tipografik
 * molası: dev bir rakam, yanında iki küçük rakam, altında alanlar.
 *
 * Sayıların hepsi veriden HESAPLANIR (lib/content/projects.ts ve yazılar):
 * proje eklenince ya da çıkınca burası kendiliğinden doğru kalır; elle
 * yazılmış "13" bir gün yalan söylerdi. "Canlı" = `badge: 'Canlı'`.
 *
 * Rakamlar kaydırmayla yuvarlanarak gelir (home.css → `.home-odo`): her
 * basamak 0-9 şeridi, zamanlayıcı bölümün görünümü. Sunucunun bastığı
 * durağan hâl SON hâl; hareket yalnız oraya nereden gelindiğini çiziyor.
 * Desteksiz ya da hareketsiz okuyucu doğrudan sayıyı görür. Basamak
 * şeritleri `aria-hidden`, ekran okuyucu düz sayıyı okur.
 */

/**
 * Kategori → alan. Her kategori bir alana düşmek ZORUNDA: yeni bir
 * kategori eklenip buraya yazılmazsa tip denetimi değil derleme sonrası
 * sayım yanlış çıkardı, o yüzden eşleşmeyen kategori "Diğer"e düşer ve
 * toplam her zaman proje sayısına eşit kalır.
 */
const DOMAINS = {
  Finans: ['Finansal Takip', 'Finans'],
  Sağlık: ['Klinik SaaS', 'Klinik Panel'],
  Oyun: ['Günlük Oyun', 'Çok Oyunculu Oyun'],
  Araçlar: ['Üretkenlik', 'Geliştirici Aracı', 'Yardımcı Araç'],
  İçerik: ['Fan Platformu', 'Portfolyo'],
} as const satisfies Record<string, readonly string[]>

type Domain = keyof typeof DOMAINS | 'Diğer'

function domainOf(category: string): Domain {
  for (const [domain, categories] of Object.entries(DOMAINS) as [keyof typeof DOMAINS, readonly string[]][]) {
    if (categories.includes(category)) return domain
  }
  return 'Diğer'
}

/** Basamak şeridi: 0-9 alt alta, `--v` kadar yukarı kaymış hâli son hâl. */
function Odometer({ value }: { value: number }) {
  const digits = String(value).split('')
  return (
    <span className="home-odo">
      <span className="sr-only">{value}</span>
      {digits.map((digit, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="home-odo-digit"
          style={{ '--v': Number(digit), '--k': digits.length - 1 - i } as CSSProperties}
        >
          <span className="home-odo-strip">
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

export function WhatIBuilt({ projects, posts }: { projects: Project[]; posts: BlogPost[] }) {
  const live = projects.filter((project) => project.badge === 'Canlı').length
  const counts = new Map<Domain, number>()
  for (const project of projects) {
    const domain = domainOf(project.category)
    counts.set(domain, (counts.get(domain) ?? 0) + 1)
  }
  const domains = [...counts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <Container as="section" size="wide" aria-labelledby="ne-yaptim" className="home-built pt-24 sm:pt-36">
      <h2 id="ne-yaptim" className="text-heading font-semibold tracking-[-0.03em] text-strong sm:text-[2.25rem] sm:leading-[1.1]">
        <MaskTitle>Ne Yaptım</MaskTitle>
      </h2>

      <dl className="home-built-grid mt-10 sm:mt-14">
        <div className="home-built-main">
          <dt className="home-built-label">Proje</dt>
          <dd className="home-built-num home-built-num-xl">
            <Odometer value={projects.length} />
          </dd>
        </div>
        <div className="home-built-side">
          <div>
            <dt className="home-built-label">Canlı Yayında</dt>
            <dd className="home-built-num">
              <Odometer value={live} />
            </dd>
          </div>
          <div>
            <dt className="home-built-label">Yazı</dt>
            <dd className="home-built-num">
              <Odometer value={posts.length} />
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-12 flex flex-col gap-8 border-t border-line pt-8 lg:flex-row lg:items-end lg:justify-between">
        <ul className="home-built-domains" aria-label="Alanlar">
          {domains.map(([domain, count]) => (
            <li key={domain}>
              {domain}
              <sup className="home-built-sup">{count}</sup>
            </li>
          ))}
        </ul>
        <Link
          href="/projeler"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-primary-ink underline decoration-primary-soft/40 underline-offset-4 transition-colors hover:decoration-primary-ink"
        >
          Tüm Projeler
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Container>
  )
}
