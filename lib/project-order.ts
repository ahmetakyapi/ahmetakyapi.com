import type { Project } from '@/lib/content/types'

/**
 * Proje sırası: öne çıkanlar önce, geri kalanlar ORDER'daki sırayla.
 *
 * Sıra sahibinin kararı (9 Ekim 2026): öne çıkanlar Açılış Zili, DigyNotes,
 * Derinay; ardından dev-starter ve ElevenForge, sonra geri kalanlar. Listede olmayan
 * proje sona, veri dosyasındaki sırasıyla düşer (yeni proje kaybolmaz).
 *
 * Saf fonksiyon kendi dosyasında: `lib/site-content.ts` varsayılan içerik
 * için `blogPosts`'u DEĞER olarak import ediyor ve istemci bileşenleri
 * oradan tek bir yardımcı almak için dokuz makalenin tam metnini (38 KB
 * gzip) paketlerine alıyordu.
 */
const ORDER = [
  'acilis-zili',
  'digynotes',
  'derinay',
  'dev-starter',
  'elevenforge',
  'mimio',
  'onepiece-hub',
  'harfiyen',
  'karalama',
  'dungeon-mates',
  'keskealsaydim',
  'ramazan-vakitleri',
  'ahmetakyapi-com',
] as const

function rank(project: Project): number {
  const index = (ORDER as readonly string[]).indexOf(project.slug)
  return index === -1 ? ORDER.length : index
}

export function getOrderedProjects(projects: Project[]): Project[] {
  const sorted = [...projects].sort((a, b) => rank(a) - rank(b))
  return [...sorted.filter((project) => project.featured), ...sorted.filter((project) => !project.featured)]
}
