'use client'

import Giscus from '@giscus/react'
import { useSyncExternalStore } from 'react'
import { readTheme, subscribeTheme } from '@/lib/theme-client'

/*
 * Yorumlar (GitHub Discussions üzerinden Giscus). Yalnızca Comments.tsx
 * çağırır ve o, iki kimlik doluysa çağırır: kimlik denetimi sunucuda.
 * Depo ve kategori adının eski varsayılanları korunuyor; üretim ortamı
 * yalnızca iki kimliği tanımlamış olabilir.
 */
const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO || 'ahmetakyapi/ahmetakyapi.com'
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'General'
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''

export default function GiscusComments() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null)

  return (
    <section aria-labelledby="yorumlar" className="mt-16 border-t border-line pt-10">
      <h2 id="yorumlar" className="mb-6 text-title font-semibold text-strong">
        Yorumlar
      </h2>
      {/* Tema sunucuda bilinmiyor: ilk istemci karesine kadar çizilmez,
          yanlış temada açılıp yeniden yüklenmesin. */}
      {theme ? (
        <Giscus
          repo={REPO as `${string}/${string}`}
          repoId={REPO_ID}
          category={CATEGORY}
          categoryId={CATEGORY_ID}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme === 'dark' ? 'transparent_dark' : 'light'}
          lang="tr"
          loading="lazy"
        />
      ) : null}
    </section>
  )
}
