/**
 * Gezinme tek kaynaktan. Header, komut paleti, 404 önerileri ve sitemap
 * aynı listeyi okur; biri değişince diğerleri geride kalmasın.
 */
export const NAV_ITEMS = [
  { href: '/', label: 'Ana Sayfa', shortcut: 'G H' },
  { href: '/projeler', label: 'Projeler', shortcut: 'G P' },
  { href: '/blog', label: 'Blog', shortcut: 'G B' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]

/** Kişisel bağlantılar: Footer, ⌘K ve JSON-LD `sameAs` aynı listeyi okur. */
export const SOCIAL_LINKS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/ahmetakyapi', handle: 'github.com/ahmetakyapi' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmetakyapi', handle: 'in/ahmetakyapi' },
  { id: 'x', label: 'X', href: 'https://x.com/ahmetakyapi', handle: '@ahmetakyapi' },
] as const

export type SocialId = (typeof SOCIAL_LINKS)[number]['id']

export const EMAIL = 'ahmet@ahmetakyapi.com'

/**
 * Unvan, tek yazım: başlık, künye, başlık çubuğu, JSON-LD, OG ve manifest
 * buradan okur. Tireli "Full-Stack", iki parçası da büyük (cümle içinde
 * küçük "full-stack"); tiresiz "Fullstack" hiçbir yerde yok. Burada,
 * lib/seo.ts'te değil: başlık çubuğu istemci bileşeni ve SEO yardımcılarını
 * paketine çekmesin.
 */
export const JOB_TITLE = 'Full-Stack & AI Developer'
