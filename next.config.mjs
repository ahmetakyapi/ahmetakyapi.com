const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://giscus.app",
  "style-src 'self' 'unsafe-inline' https://giscus.app",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.github.com https://giscus.app",
  "frame-src https://giscus.app",
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        /* Yazı framer-motion kullanmayı değil, kütüphaneyi KALDIRMAYI
           anlatır hâle geldi; eski slug yanıltıcı olduğu için taşındı. */
        source: '/blog/framer-motion-sayfa-gecis-animasyonlari',
        destination: '/blog/olculen-hiz-hissedilen-hiz',
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
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
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
