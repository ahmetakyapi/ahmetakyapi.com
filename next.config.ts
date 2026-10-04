import type { NextConfig } from 'next'

/**
 * İçerik güvenliği politikası. next.config.mjs'teki hâliyle birebir; tek
 * ekleme Vercel Analytics.
 *
 * VERCEL ANALYTICS: üretimde betik ve ölçüm ucu aynı kökenden gelir
 * (`/_vercel/insights/script.js`, `/_vercel/insights/view`), yani `'self'`
 * yeter. Geliştirmede ise paket hata ayıklama betiğini
 * `va.vercel-scripts.com`dan çeker; o adres eklenmezse yerelde konsol CSP
 * ihlaliyle dolar. Yalnızca betik kaynağı genişledi, bağlantı kaynağı değil.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://giscus.app https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://giscus.app",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.github.com https://giscus.app",
  'frame-src https://giscus.app',
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Üst dizinlerde başka bir lockfile varsa Turbopack kökü yanlış tahmin eder.
  turbopack: { root: __dirname },
  async redirects() {
    return [
      {
        /* Yazı framer-motion kullanmayı değil, kütüphaneyi KALDIRMAYI
           anlatır hâle geldi; eski slug yanıltıcı olduğu için taşındı. */
        source: '/blog/framer-motion-sayfa-gecis-animasyonlari',
        destination: '/blog/ahmetakyapi-com-nasil-yapildi',
        permanent: true,
      },
      {
        /* 4 Ekim 2026: yazı hata avından sitenin nasıl kurulduğuna döndü
           ve baştan yazıldı. */
        source: '/blog/olculen-hiz-hissedilen-hiz',
        destination: '/blog/ahmetakyapi-com-nasil-yapildi',
        permanent: true,
      },
      {
        /* Yazı ORM karşılaştırmasından Mimio'nun kendi hikâyesine döndü. */
        source: '/blog/neon-drizzle-serverless-db-katmani',
        destination: '/blog/bilmedigim-meslege-arac-yazmak',
        permanent: true,
      },
      {
        /* Yazının konusu graf yerleşiminden spoiler korumasına taşındı. */
        source: '/blog/force-directed-karakter-grafi-cizmek',
        destination: '/blog/spoiler-vermeyen-wiki',
        permanent: true,
      },
      // Yeni Açılış Zili yazısı 3 Ekim'de kısa bir süre bu adresle yayındaydı.
      {
        source: '/blog/acilis-zili-ucretsiz-veri-guvenilir-ekran',
        destination: '/blog/acilis-zili-abd-borsalarini-takip',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/icon.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/rss.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

export default nextConfig
