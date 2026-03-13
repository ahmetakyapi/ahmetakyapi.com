export type AdminSection = 'dashboard' | 'home' | 'projects' | 'blog'

export interface Toast {
  id: string
  type: 'success' | 'error'
  message: string
}

export interface SessionResponse {
  authenticated: boolean
  configured: boolean
  defaultPasswordActive?: boolean
}

export interface DashboardData {
  analytics: {
    totalPageViews: number
    uniqueVisitors: number
    pageViewsByPath: Record<string, number>
    recentVisits: Array<{ path: string; visitorId: string; visitedAt: string }>
  }
  comments: {
    configured: boolean
    reason?: string
    items: Array<{
      slug: string
      title: string
      totalComments: number
      commenters: string[]
      discussionUrl: string
    }>
  }
  totals: {
    projects: number
    blogPosts: number
    valueProps: number
    expertise: number
  }
}

export const EMPTY_DASHBOARD: DashboardData = {
  analytics: { totalPageViews: 0, uniqueVisitors: 0, pageViewsByPath: {}, recentVisits: [] },
  comments: { configured: false, items: [] },
  totals: { projects: 0, blogPosts: 0, valueProps: 0, expertise: 0 },
}

export function moveItem<T>(items: T[], from: number, direction: -1 | 1): T[] {
  const to = from + direction
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString('tr-TR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
