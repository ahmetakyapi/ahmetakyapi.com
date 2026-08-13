'use client'

import { useEffect } from 'react'
import { trackView } from '@/lib/track-view'

/** Server Component sayfalarına takılan tek satırlık görüntülenme kaydı. */
export default function PageView({ pathname }: { pathname: string }) {
  useEffect(() => {
    void trackView(pathname)
  }, [pathname])

  return null
}
