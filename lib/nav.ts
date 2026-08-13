/**
 * Gezinme tek kaynaktan. Header, komut paleti, 404 önerileri ve sitemap
 * aynı listeyi okur — biri değişince diğerleri geride kalmasın.
 */
export const NAV_ITEMS = [
  { href: '/', label: 'Ana Sayfa', icon: '⌂', shortcut: 'G H' },
  { href: '/projeler', label: 'Projeler', icon: '◈', shortcut: 'G P' },
  { href: '/blog', label: 'Blog', icon: '✦', shortcut: 'G B' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
