import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/**
 * İçerik güvenliği politikası.
 *
 * GELİŞTİRMEYE ÖZEL iki izin üretimde yok: `'unsafe-eval'` (React'in
 * geliştirme yapısı hata yığınlarını eval ile kuruyor; üretim paketinde eval
 * yok) ve `va.vercel-scripts.com` (Vercel Analytics geliştirmede hata
 * ayıklama betiğini oradan çeker; üretimde betik ve ölçüm ucu aynı kökende,
 * `/_vercel/insights/*`, `'self'` yeter).
 *
 * GISCUS yalnızca `frame-src`: @giscus/react bileşeni yerel bir parçadan
 * yükleniyor, sayfaya yalnızca giscus.app iframe'ini koyuyor ve onunla
 * postMessage ile konuşuyor; üst sayfaya betik, stil ya da istek getirmiyor
 * (node_modules/@giscus/react/dist, 21 Ekim 2026). GitHub'la konuşan da
 * iframe'in kendisi; `api.github.com` bu yüzden yok.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
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
  /* `same-origin` değil: o, sitenin açtığı açılır pencerelerle bağı da
     keserdi; bu değer yalnızca başka kökenin bu sekmeye uzanmasını keser. */
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    /* `interest-cohort` (FLoC) Chrome'dan kalktı ve her sayfada konsola
       "Unrecognized feature" hatası düşürüyordu; yerini `browsing-topics`
       aldı. */
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
]

const STATIC_ASSET_CACHE = 'public, max-age=3600, stale-while-revalidate=604800'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Üst dizinlerde başka bir lockfile varsa Turbopack kökü yanlış tahmin eder.
  turbopack: { root: __dirname },
  /* next/image kullanılmıyor (components/ui/ThemedImage.tsx); bu satır
     olmadan `/_next/image` ucu yine açıktı ve isteyen herkes Vercel'in
     görsel dönüştürme kotasını harcatabilirdi. */
  images: { unoptimized: true },
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
      /* Proje görselleri ve simge: adlar içerikten türemiyor, çekimler aynı
         adla yenileniyor; `immutable` olamaz. Bir saat taze, sonra bir hafta
         eskisi gösterilip arkada yenileniyor (Vercel varsayılanı max-age=0:
         her ziyarette her görsel için yeniden doğrulama). Simge manifestte
         sürümsüz adresle geçiyor; bir yıl `immutable` değişikliği
         kilitlerdi. */
      {
        source: '/projects/:path*',
        headers: [{ key: 'Cache-Control', value: STATIC_ASSET_CACHE }],
      },
      {
        source: '/icon.svg',
        headers: [{ key: 'Cache-Control', value: STATIC_ASSET_CACHE }],
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
