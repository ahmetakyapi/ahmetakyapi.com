'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Giscus from '@giscus/react'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  // Giscus yapılandırması için:
  // 1. github.com/ahmetakyapi/ahmetakyapi.com reposunda Discussions'ı etkinleştirin
  // 2. giscus.app adresine gidip repo bilgilerini girin
  // 3. Aldığınız data-repo-id ve data-category-id değerlerini buraya yazın
  const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO ?? 'ahmetakyapi/ahmetakyapi.com'
  const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''
  const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General'
  const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''

  const isConfigured = REPO_ID !== '' && CATEGORY_ID !== ''

  if (!isConfigured) {
    return (
      <div className="mt-12 pt-10 border-t border-white/5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Yorumlar</h3>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500 font-mono mb-2">// giscus henüz yapılandırılmadı</p>
          <p className="text-xs text-gray-600">
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              giscus.app
            </a>{' '}
            üzerinden repo bilgilerini alıp{' '}
            <code className="text-indigo-400">.env.local</code>'a ekleyin.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 pt-10 border-t border-white/5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Yorumlar</h3>
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
        theme={resolvedTheme === 'dark' ? 'transparent_dark' : 'light'}
        lang="tr"
        loading="lazy"
      />
    </div>
  )
}
