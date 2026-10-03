import { ArrowRight, Rss } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Container } from '@/components/ui/Container'
import { KunyeLine } from '@/components/ui/Kunye'
import type { BlogPost } from '@/lib/content/types'
import { formatPostDate, readingTime } from '@/lib/reading-time'
import { Inline } from './Inline'
import { PostCover } from './PostCover'

/**
 * Blog dizini, sunucu bileşeni ve sıfır JavaScript.
 *
 * Düzen: en yeni yazı büyük ve kapaklı, altında arşiv bir editoryal liste
 * (mono tarih, başlık, tek cümle, küçük kapak). Kart ızgarası değil: dokuz
 * yazının dokuz eş kutusu birbirinden ayırt edilmiyordu.
 *
 * ETİKET SÜZGECİ JAVASCRIPT'SİZ: her etiket bir radyo düğmesi, satırlar
 * `data-tag` taşıyor ve süzme `:has(:checked)` ile CSS'te. Sayfa statik
 * kalıyor (adres parametresi okumak rotayı dinamik yapardı), istemciye
 * tek bayt inmiyor, ok tuşlarıyla gezinme radyo grubunun kendisinden.
 * `:has()` kökte değil dizinin kabında (`.bl-scope`): yalnızca o alt ağaç
 * yeniden hesaplanır. Seçim adreste durmuyor, bilerek: paylaşılacak bir
 * durum değil.
 *
 * Süzgeç DOKUZ yazının hepsine uygulanır, öne çıkan dahil. Önceden yalnız
 * arşivi süzüyordu: başlıkta "9 Yazı", çipte "Tümü 8" yazıyordu ve etiket
 * sayıları öne çıkan yazıyı saymıyordu. Öne çıkan yazı seçili etikete
 * uymuyorsa gizlenir; çipler bu yüzden başlığın hemen altında, süzdükleri
 * her şeyin ÜSTÜNDE (altta olsalar gizlenen kapak çipleri yukarı kaydırırdı).
 */
export function BlogIndex({ posts }: { posts: readonly BlogPost[] }) {
  const [featured, ...rest] = posts
  const tags = countTags(posts)
  const tagIndex = (post: BlogPost) => tags.findIndex((t) => t.name === post.tag) + 1

  return (
    <Container as="section" aria-labelledby="blog-baslik" className="bl-scope page-top pb-4 pt-10 sm:pb-8 sm:pt-16">
      <style>{filterCss(tags, featured ? tagIndex(featured) : 0, rest.map(tagIndex))}</style>
      <header className="max-w-3xl">
        <h1 id="blog-baslik" className="page-title">
          <span className="display-ink">Yazılar</span>
        </h1>
        <p className="page-lead">
          Yaptığım projelerden çıkan notlar. Çoğu bir şeyin neden çalışmadığıyla başlıyor.
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 text-sm text-muted">
          <span>{posts.length} Yazı</span>
          <a
            href="/rss.xml"
            className="inline-flex min-h-11 items-center gap-1.5 font-medium text-body transition-colors hover:text-strong pointer-fine:min-h-8"
          >
            <Rss className="size-4" aria-hidden="true" />
            RSS ile Takip Et
          </a>
        </p>
      </header>

      <fieldset className="bl-filter tabs mt-8 sm:mt-10">
        <legend className="sr-only">Etikete göre süz</legend>
        <Chip id="bl-f-0" label="Tümü" count={posts.length} defaultChecked />
        {tags.map((tag, i) => (
          <Chip key={tag.name} id={`bl-f-${i + 1}`} label={tag.name} count={tag.count} />
        ))}
      </fieldset>

      {featured ? <Featured post={featured} tag={tagIndex(featured)} /> : null}

      {rest.length > 0 ? (
        <section aria-labelledby="arsiv" className="bl-archive mt-16 sm:mt-20">
          <h2 id="arsiv" className="bl-archive-title">
            Önceki Yazılar
          </h2>

          <ol className="bl-list">
            {rest.map((post) => (
              <li key={post.slug} className="bl-row" data-tag={tagIndex(post)}>
                <div className="reveal">
                  <Row post={post} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </Container>
  )
}

function Featured({ post, tag }: { post: BlogPost; tag: number }) {
  return (
    <article className="bl-featured-item reveal mt-10 sm:mt-12" data-tag={tag}>
      <Link href={`/blog/${post.slug}`} transitionTypes={['nav-forward']} className="group bl-featured">
        <PostCover post={post} variant="feature" priority />
        <div className="bl-featured-text">
          <KunyeLine items={['En Yeni', formatPostDate(post.date), readingTime(post)]} />
          <h2 className="bl-featured-title mt-3 text-strong transition-colors group-hover:text-primary-ink">
            <Inline text={post.title} />
          </h2>
          <p className="mt-3 text-read text-body">
            <Inline text={post.excerpt} />
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-strong">
            Yazıyı Oku
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}

function Row({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} transitionTypes={['nav-forward']} className="group bl-row-link">
      <span className="bl-row-meta font-mono text-small text-muted">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        <span className="bl-row-dot" aria-hidden="true">
          ·
        </span>
        <span>{readingTime(post)}</span>
      </span>
      <span className="bl-row-main">
        <span className="block text-small font-medium text-primary-ink">{post.tag}</span>
        <span className="mt-1.5 block font-display text-title font-semibold tracking-[-0.02em] text-strong transition-colors group-hover:text-primary-ink sm:text-[1.375rem] sm:leading-[1.25]">
          <Inline text={post.title} />
        </span>
        <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-body sm:text-base">
          <Inline text={post.excerpt} />
        </span>
      </span>
      <span className="bl-row-thumb">
        <PostCover post={post} variant="thumb" />
      </span>
    </Link>
  )
}

function Chip({ id, label, count, defaultChecked }: { id: string; label: string; count: number; defaultChecked?: boolean }) {
  return (
    <Fragment>
      <input type="radio" name="bl-tag" id={id} defaultChecked={defaultChecked} className="bl-chip-input" />
      <label htmlFor={id} className="bl-chip tab">
        {label}
        <span className="tab-count">{count}</span>
      </label>
    </Fragment>
  )
}

function countTags(posts: readonly BlogPost[]) {
  const counts = new Map<string, number>()
  for (const post of posts) counts.set(post.tag, (counts.get(post.tag) ?? 0) + 1)
  /* Çok yazısı olan etiket önce; eşitlikte alfabe (Türkçe sıralama). */
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
}

/**
 * Seçili etiketin dışında kalanı gizleyen kurallar, etiket başına:
 *   - arşivde etiketi taşımayan satırlar,
 *   - öne çıkan yazı etikete uymuyorsa onun kendisi (arşiv yukarı yaklaşır),
 *   - arşivde o etiketten hiç yazı yoksa arşiv bölümü (boş başlık kalmasın).
 */
function filterCss(tags: readonly { name: string }[], featuredTag: number, archiveTags: readonly number[]) {
  return tags
    .map((_, i) => {
      const n = i + 1
      const on = `.bl-scope:has(#bl-f-${n}:checked)`
      const rules = [`${on} .bl-row:not([data-tag="${n}"]){display:none}`]
      if (featuredTag !== n) rules.push(`${on} .bl-featured-item{display:none}`, `${on} .bl-archive{margin-top:2.5rem}`)
      if (!archiveTags.includes(n)) rules.push(`${on} .bl-archive{display:none}`)
      return rules.join('')
    })
    .join('')
}
