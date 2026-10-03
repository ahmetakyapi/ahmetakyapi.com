'use client'

import { useRouter } from 'next/navigation'

/**
 * Segment hata sınırı.
 *
 * `retry` (Next 16.3'te kararlı) segmenti sunucudan YENİDEN İSTER ve sonra
 * çizer; yalnızca `reset()` ağa çıkmaz ve sunucuda doğan hata aynı yükle
 * anında geri gelir.
 *
 * Bilerek yalın: hata sınırı HER sayfanın ilk yüküne giriyor. Button,
 * Link ve lucide ikonlarıyla ~4,7 KB (gzip) tutuyordu; düz öğe ve
 * sınıf dizeleriyle ~1 KB (yönlendirici zaten çerçevede).
 *
 * Hata MESAJI gösterilmez: sunucu hatası dosya yolu ya da yanıt
 * taşıyabilir. Kullanıcının iletebileceği tek şey `digest`.
 */
const PRIMARY =
  'inline-flex min-h-11 items-center justify-center rounded-button bg-cta px-4 text-sm font-semibold text-on-brand hover:brightness-110'
const GHOST =
  'inline-flex min-h-11 items-center justify-center rounded-button px-4 text-sm font-semibold text-body hover:bg-primary-wash hover:text-strong'

export default function ErrorBoundary({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter()
  return (
    <div className="mx-auto grid min-h-[60svh] max-w-xl place-items-center px-4 py-16 text-center">
      <div>
        <h1 className="text-heading font-semibold">Bir Şeyler Ters Gitti</h1>
        <p className="mt-3 text-base text-body">
          Bu sayfa yüklenemedi. Çoğu zaman geçici bir sorundur; tekrar denemek genellikle yeter.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className={PRIMARY} onClick={() => retry()}>
            Tekrar Dene
          </button>
          <button type="button" className={GHOST} onClick={() => router.push('/')}>
            Ana Sayfa
          </button>
        </div>
        {error.digest ? <p className="mt-6 font-mono text-small text-muted">Hata Kimliği {error.digest}</p> : null}
      </div>
    </div>
  )
}
