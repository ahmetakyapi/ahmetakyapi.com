import { shotSources, type ShotSources } from '@/lib/content/project-shots'
import { blogPosts } from '@/lib/content/posts'
import { projects } from '@/lib/content/projects'
import type { BlogPost, Project } from '@/lib/content/types'
import { foldTr } from '@/lib/search'

/*
 * Blog yüzeyinin veri yardımcıları. Saf ve yalnızca sunucuda okunuyor:
 * istemci adacıkları buradan hiçbir şey içe aktarmaz (yazı gövdeleri
 * pakete girmesin).
 */

/**
 * Yazılar YENİDEN ESKİYE. Sıralama tek yerde, `lib/content/posts/index.ts`;
 * dizin, RSS ve "diğer yazılar" sırayı bu addan okur.
 */
export const postsByDate: readonly BlogPost[] = blogPosts

export function findPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

/**
 * Yazıyı anlatan proje. Önce yazının kendi `project` alanı (bir projenin
 * ikinci yazısı da kapağını alsın diye), yoksa projects.ts'teki `postSlug`
 * eşleşmesi.
 */
export function projectForPost(slug: string): Project | undefined {
  const own = findPost(slug)?.project
  if (own) {
    const project = projects.find((p) => p.slug === own)
    if (project) return project
  }
  return projects.find((project) => project.postSlug === slug)
}

/** Kapak görseli: ilgili projenin masaüstü ekran görüntüsü; yoksa `null`. */
export function postShot(slug: string): { project: Project; shot: ShotSources } | null {
  const project = projectForPost(slug)
  if (!project) return null
  const shot = shotSources(project.slug, 'desktop')
  return shot ? { project, shot } : null
}

/**
 * Tipografik kapağın alt satırı: başlığın iki noktadan önceki öznesi
 * ("ahmetakyapi.com", "İlk Sohbet Uygulamam"); yoksa `null`. Büyük sözcük
 * etiket: üç yazı aynı özneyi (ahmetakyapi.com) taşıyor ve özne büyük
 * yazılınca dizinde üç eş mavi karo yan yana duruyordu.
 */
export function coverSubject(post: BlogPost): string | null {
  const head = post.title.split(':')[0]?.trim()
  return head && head !== post.title ? head : null
}

/**
 * Ara başlık çapası. Eskiden `section-<blok sırası>`ydı: yazıya bir
 * paragraf eklenince bütün çapalar kayıyordu. Başlıktan türeyen ad hem
 * paylaşılan bağlantıda okunuyor hem de içerik düzenlenince yerinde kalıyor.
 * Türkçe katlama aramayla ortak (lib/search.ts → `foldTr`).
 */
function slugify(text: string): string {
  return foldTr(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type PostSection = { id: string; text: string }

/** Blok sırası → çapa (yalnız h2). İçindekiler ve gövde aynı haritayı okur. */
export function postSections(post: BlogPost): { sections: PostSection[]; byIndex: Map<number, PostSection> } {
  const used = new Set<string>()
  const sections: PostSection[] = []
  const byIndex = new Map<number, PostSection>()

  post.content.forEach((block, index) => {
    if (block.type !== 'h2') return
    const base = slugify(block.text) || 'bolum'
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    const section = { id, text: block.text }
    byIndex.set(index, section)
    sections.push(section)
  })

  return { sections, byIndex }
}

/**
 * Yazının sonundaki "diğer yazılar": önce aynı etiketten, sonra en yeniler.
 * Tarih sırası korunur.
 */
export function morePosts(post: BlogPost, count: number): BlogPost[] {
  const others = postsByDate.filter((p) => p.slug !== post.slug)
  const sameTag = others.filter((p) => p.tag === post.tag)
  const rest = others.filter((p) => p.tag !== post.tag)
  return [...sameTag, ...rest].slice(0, count)
}
