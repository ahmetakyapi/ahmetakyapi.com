import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequest } from '@/lib/server/admin-auth'
import { getAnalyticsSummary } from '@/lib/server/analytics-store'
import { getCommentInsights } from '@/lib/server/comment-insights'
import { getSiteContent } from '@/lib/server/content-store'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [content, analytics] = await Promise.all([
    getSiteContent(),
    getAnalyticsSummary(),
  ])

  const comments = await getCommentInsights(content.blogPosts)

  return NextResponse.json({
    analytics,
    comments,
    totals: {
      projects: content.projects.length,
      blogPosts: content.blogPosts.length,
      valueProps: content.home.valueProps.length,
      expertise: content.home.expertise.length,
    },
  })
}
