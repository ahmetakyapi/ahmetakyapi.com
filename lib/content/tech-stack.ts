import {
  siDrizzle,
  siNeon,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
} from 'simple-icons'

/**
 * Ana sayfadaki Yığın şeridi: yalnız logo, etiket yok (ad ekran okuyucuya
 * `title` ile gider). Liste projelerin `tags` alanlarında geçen araçlardan,
 * artı hepsinin altında duran Node.js ve yayın yeri Vercel. Angular ve
 * Flutter eski listedeydi ama hiçbir güncel projede yok; çıkarıldı.
 *
 * `simple-icons` adlandırılmış içe aktarımla ağaçtan sarsılıyor: pakete
 * yalnızca buradaki yollar girer, ve bu dosya yalnızca sunucu
 * bileşenlerinden okunur (istemci paketine hiç girmez).
 */
export type StackLogo = { name: string; path: string }

export const techStack: readonly StackLogo[] = [
  { name: 'Next.js', path: siNextdotjs.path },
  { name: 'React', path: siReact.path },
  { name: 'TypeScript', path: siTypescript.path },
  { name: 'Tailwind CSS', path: siTailwindcss.path },
  { name: 'PostgreSQL', path: siPostgresql.path },
  { name: 'Neon', path: siNeon.path },
  { name: 'Drizzle ORM', path: siDrizzle.path },
  { name: 'Node.js', path: siNodedotjs.path },
  { name: 'Socket.io', path: siSocketdotio.path },
  { name: 'Vitest', path: siVitest.path },
  { name: 'Vercel', path: siVercel.path },
]
