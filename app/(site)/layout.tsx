import type { ReactNode } from 'react'
import type { PaletteLink } from '@/components/site/CommandPalette'
import { CommandPaletteLauncher } from '@/components/site/CommandPaletteLauncher'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { RouteProgress } from '@/components/site/RouteProgress'
import { postsByDate } from '@/components/blog/posts'
import { projects } from '@/lib/content/projects'
import { getOrderedProjects } from '@/lib/project-order'
import { formatPostDate } from '@/lib/reading-time'

/*
 * Site kabuğu: başlık, ⌘K, içerik, alt bilgi. Ana sayfa, projeler ve yazı
 * sayfası aynı kabukta; yazı sayfası bir dönem grubun dışındaydı ve orada
 * ne başlık ne ⌘K ne de atlama bağlantısının hedefi vardı.
 *
 * `#main-content` (kök layout'taki "İçeriğe Geç" bağlantısının hedefi)
 * YALNIZCA burada. Sayfalar kendi `<main>`ini açmaz.
 *
 * ⌘K listesi burada, sunucuda kurulur ve istemciye yalnızca başlık, adres
 * ve kısa künye gider: proje açıklamaları ve yazı gövdeleri pakete girmez.
 */
/* Satırın ikinci satırı (`meta`) ve yalnız aranan kelimeler (`keywords`):
   kısa dizeler, sayfa başına ~1 KB. "oyun" yazan Dungeon Mates'i,
   "drizzle" yazan Drizzle kullanan projeleri bulsun; yalnız başlık
   aranırken ikisi de boş liste döndürüyordu. */
const paletteProjects: PaletteLink[] = getOrderedProjects(projects).map((project) => ({
  title: project.title,
  href: `/projeler/${project.slug}`,
  meta: project.category,
  keywords: project.tags.join(' '),
}))

const palettePosts: PaletteLink[] = postsByDate.map((post) => ({
  title: post.title,
  href: `/blog/${post.slug}`,
  meta: `${formatPostDate(post.date)} · ${post.tag}`,
}))

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <RouteProgress />
      <CommandPaletteLauncher projects={paletteProjects} posts={palettePosts} />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  )
}
