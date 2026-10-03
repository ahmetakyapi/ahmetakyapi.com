import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Comments } from '@/components/blog/Comments'
import { Inline } from '@/components/blog/Inline'
import { PostBody } from '@/components/blog/PostBody'
import { PostCover } from '@/components/blog/PostCover'
import { MorePosts, RelatedProject } from '@/components/blog/PostFooterLinks'
import { PostTocAside, PostTocInline } from '@/components/blog/PostToc'
import { findPost, morePosts, postSections, postsByDate, projectForPost } from '@/components/blog/posts'
import { PageTransition } from '@/components/site/PageTransition'
import { Container } from '@/components/ui/Container'
import { KunyeLine } from '@/components/ui/Kunye'
import { AUTHOR, SITE_URL, TWITTER, blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import { formatPostDate, readingTime } from '@/lib/reading-time'
import '../blog.css'

/*
 * Yazı sayfası, SUNUCU bileşeni. Düzen tek sütun: başlık, kapak (başlığın
 * ALTINDA, ekranın en çok %45'i), gövde ve yazı sonu aynı okuma sütununda;
 * masaüstünde sağda yapışkan içindekiler. Ayrıntı blog.css başındaki notta.
 * İstemciye inen yalnızca üç adacık: kod
 * kopyala (CopyCode), içindekilerin etkin bölüm işareti (TocSpy) ve
 * kimlikleri tanımlıysa Giscus. Okuma ilerlemesi CSS'te
 * (`animation-timeline: scroll()`), desteklemeyen tarayıcıda hiç görünmez.
 *
 * Bu segmentte `loading.tsx` YOK ve olmamalı: varsa sayfa bir Suspense
 * sınırında akış olarak gönderilir, başlıklar ilk baytla 200 gider ve
 * `notFound()` artık gerçek 404 üretemez (soft 404; dev-starter guides/06 §9).
 */

/** Yazılar derleme anında üretilir; listede olmayan slug doğrudan 404. */
export function generateStaticParams() {
  return postsByDate.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return { title: 'Yazı Bulunamadı' }

  const published = new Date(post.date).toISOString()
  const url = `/blog/${post.slug}`

  return {
    /* Şablon zaten " · Ahmet Akyapı" ekliyor; başlıkta tekrar yazmıyoruz. */
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    authors: [{ name: AUTHOR, url: SITE_URL }],
    keywords: [post.tag, 'Ahmet Akyapı', 'Türkçe teknik blog'],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      siteName: AUTHOR,
      locale: 'tr_TR',
      publishedTime: published,
      modifiedTime: published,
      authors: [AUTHOR],
      tags: [post.tag],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: TWITTER,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  const { sections, byIndex } = postSections(post)
  const project = projectForPost(post.slug)
  const more = morePosts(post, 3)

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            blogPostingJsonLd(post),
            breadcrumbJsonLd([
              { name: 'Ana Sayfa', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]),
        }}
      />
      <div className="post-progress" aria-hidden="true" />

      <article className="post">
        <Container className="pt-6 sm:pt-10">
          <div className="post-grid">
            <div className="post-main">
              <header>
                <Link
                  href="/blog"
                  transitionTypes={['nav-back']}
                  className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium text-body transition-colors hover:text-strong pointer-fine:min-h-9"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Tüm Yazılar
                </Link>
                <KunyeLine
                  className="mt-6 sm:mt-8"
                  items={[post.tag, <time key="t" dateTime={post.date}>{formatPostDate(post.date)}</time>, `${readingTime(post)} Okuma`]}
                />
                <h1 className="post-title">
                  <Inline text={post.title} />
                </h1>
                <p className="post-excerpt">
                  <Inline text={post.excerpt} />
                </p>
              </header>

              <PostCover post={post} variant="hero" priority />
              <PostTocInline sections={sections} />
              <PostBody blocks={post.content} sections={byIndex} />

              <footer className="post-end">
                <KunyeLine items={[AUTHOR, formatPostDate(post.date)]} />
                <a href="/rss.xml" className="tap-y font-mono text-small text-muted transition-colors hover:text-strong">
                  RSS ile Takip Et
                </a>
              </footer>
              <Comments />

              <div className="post-after">
                {project ? <RelatedProject project={project} /> : null}
                <MorePosts posts={more} />
              </div>
            </div>
            <aside className="hidden lg:block">
              <PostTocAside sections={sections} />
            </aside>
          </div>
        </Container>
      </article>
    </PageTransition>
  )
}
