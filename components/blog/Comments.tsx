import GiscusComments from './GiscusComments'

/*
 * Yorumların kapısı, SUNUCUDA. Giscus'un iki kimliği (`REPO_ID`,
 * `CATEGORY_ID`) yoksa üretimde hiçbir şey basılmaz ve istemci bileşeni
 * ağaca hiç girmez: Giscus'un kodu sayfaya inmez. Eskiden kapı istemci
 * bileşeninin içindeydi; kimlik olmasa da paket iniyordu ve bir dönem
 * ziyaretçiye "değerleri .env.local'a ekleyin" yazan bir kutu gösteriliyordu.
 * Hatırlatma yalnızca geliştirmede.
 */
const CONFIGURED = Boolean(process.env.NEXT_PUBLIC_GISCUS_REPO_ID && process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID)

export function Comments() {
  if (CONFIGURED) return <GiscusComments />
  if (process.env.NODE_ENV === 'production') return null
  return (
    <p className="mt-12 border-t border-line pt-6 font-mono text-small text-muted">
      Geliştirme notu: Giscus ortam değişkenleri boş, yorum bölümü üretimde gösterilmeyecek (.env.example).
    </p>
  )
}
