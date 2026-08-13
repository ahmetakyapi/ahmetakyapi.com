/**
 * Rota giriş animasyonu — saf CSS.
 *
 * `template.tsx` her gezinmede yeniden monte edilir (`layout.tsx` edilmez),
 * yani sınıf her gezinmede yeniden uygulanıyor ve animasyon oynuyor.
 *
 * Çıkış animasyonu bilerek yok: App Router yeni sayfayı render ederken eski
 * ağacı beklemiyor, çıkışı oynatacak bir düğüm ortada kalmıyor. Yarım
 * çalışan bir exit yerine tek yönlü ve tutarlı bir giriş.
 *
 * Artık istemci bileşeni değil — animasyonun JavaScript'e ihtiyacı yok.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>
}
