import { ViewTransition } from 'react'
import { ThemedImage } from '@/components/ui/ThemedImage'
import type { BlogPost } from '@/lib/content/types'
import { DEFAULT_THEME } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { coverSubject, postShot } from './posts'

/**
 * Yazı kapağı, üç boyda: `hero` (yazı sayfası), `feature` (blog dizininin
 * öne çıkan yazısı) ve `thumb` (dizin satırı).
 *
 * Görsel: yazının anlattığı projenin gerçek ekran görüntüsü (projects.ts →
 * `postSlug`). Projesi ya da görseli olmayan yazıda tipografik kapak:
 * birincil eylemin degradesi (`bg-cta`, beyaz metinle her noktada AA) ve
 * başlığın öznesi büyük puntoyla. Div'den sahte ekran görüntüsü yok.
 *
 * `morph`: `post-${slug}` paylaşılan öğe geçişi (blog kartı ↔ yazı kapağı).
 * Bir sayfada bir ad yalnızca BİR öğede olur; dizinde satır küçük görseli,
 * yazıda kapak taşır. Ana sayfadaki Son Yazılar taşımaz.
 */
type Variant = 'hero' | 'feature' | 'thumb'

/* Ekran görüntüleri 16:10 çekildi; kapak her genişlikte aynı oranda. 2:1
   masaüstünde görselin alt %20'sini kesiyordu (başlık altındaki kartlar
   yarım kalıyordu). Tipografik kapak ayrı: blog.css'te 3:1. */
const FRAME: Record<Variant, string> = {
  hero: 'aspect-[16/10]',
  feature: 'aspect-[16/10]',
  thumb: 'aspect-[16/10]',
}

export function PostCover({
  post,
  variant,
  morph = true,
  priority = false,
  className,
}: {
  post: BlogPost
  variant: Variant
  morph?: boolean
  priority?: boolean
  className?: string
}) {
  const found = postShot(post.slug)
  /* Satır küçük görseli süs: başlık hemen yanında, ekran okuyucuya ikinci
     kez söylenmez. */
  const alt = variant === 'thumb' || !found ? '' : `${found.project.title} arayüzünün ekran görüntüsü`

  const cover = (
    <div
      className={cn(
        'post-cover relative overflow-hidden border border-line',
        variant === 'thumb' ? 'rounded-button' : 'rounded-card',
        FRAME[variant],
        className,
      )}
      data-variant={variant}
      data-kind={found ? 'shot' : 'type'}
    >
      {found ? (
        <ThemedImage
          {...found.shot}
          alt={alt}
          priority={priority}
          theme={priority ? DEFAULT_THEME : undefined}
          className="size-full object-cover object-top"
        />
      ) : (
        <div className="post-cover-type bg-cta" aria-hidden="true">
          <span className="post-cover-word">{post.tag}</span>
          {coverSubject(post) ? <span className="post-cover-tag">{coverSubject(post)}</span> : null}
        </div>
      )}
    </div>
  )

  if (!morph) return cover
  return (
    <ViewTransition name={`post-${post.slug}`} share="morph" default="none">
      {cover}
    </ViewTransition>
  )
}
