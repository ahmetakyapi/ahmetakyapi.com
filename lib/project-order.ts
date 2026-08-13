import type { Project } from '@/lib/content/types'

/**
 * Öne çıkanlar önce, geri kalanlar sırasıyla.
 *
 * Bu fonksiyon `lib/site-content.ts` içindeydi ve orası varsayılan içerik
 * için `blogPosts`'u DEĞER olarak import ediyor. İstemci bileşenleri
 * buradan tek bir yardımcı almak için dokuz makalenin tam metnini
 * (38 KB gzip) paketlerine alıyorlardı. Saf fonksiyon kendi dosyasında.
 */
export function getOrderedProjects(projects: Project[]): Project[] {
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)
  return [...featured, ...rest]
}
