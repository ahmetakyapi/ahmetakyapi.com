import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export interface VisitEntry {
  path: string
  visitorId: string
  visitedAt: string
}

export interface SiteAnalyticsStore {
  totalPageViews: number
  uniqueVisitorIds: string[]
  pageViewsByPath: Record<string, number>
  recentVisits: VisitEntry[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json')
const MAX_RECENT_VISITS = 50

const defaultAnalytics: SiteAnalyticsStore = {
  totalPageViews: 0,
  uniqueVisitorIds: [],
  pageViewsByPath: {},
  recentVisits: [],
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true })
}

export async function getAnalyticsStore() {
  try {
    const raw = await readFile(ANALYTICS_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<SiteAnalyticsStore>

    return {
      totalPageViews: parsed.totalPageViews ?? 0,
      uniqueVisitorIds: Array.isArray(parsed.uniqueVisitorIds) ? parsed.uniqueVisitorIds : [],
      pageViewsByPath: parsed.pageViewsByPath ?? {},
      recentVisits: Array.isArray(parsed.recentVisits) ? parsed.recentVisits.slice(0, MAX_RECENT_VISITS) : [],
    }
  } catch {
    return defaultAnalytics
  }
}

async function saveAnalyticsStore(store: SiteAnalyticsStore) {
  await ensureDataDir()
  await writeFile(ANALYTICS_FILE, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
}

export async function trackVisit(pathname: string, visitorId: string) {
  const analytics = await getAnalyticsStore()
  const next: SiteAnalyticsStore = {
    totalPageViews: analytics.totalPageViews + 1,
    uniqueVisitorIds: analytics.uniqueVisitorIds.includes(visitorId)
      ? analytics.uniqueVisitorIds
      : [...analytics.uniqueVisitorIds, visitorId],
    pageViewsByPath: {
      ...analytics.pageViewsByPath,
      [pathname]: (analytics.pageViewsByPath[pathname] ?? 0) + 1,
    },
    recentVisits: [
      { path: pathname, visitorId, visitedAt: new Date().toISOString() },
      ...analytics.recentVisits,
    ].slice(0, MAX_RECENT_VISITS),
  }

  await saveAnalyticsStore(next)
  return next
}

export async function getAnalyticsSummary() {
  const analytics = await getAnalyticsStore()

  return {
    totalPageViews: analytics.totalPageViews,
    uniqueVisitors: analytics.uniqueVisitorIds.length,
    pageViewsByPath: analytics.pageViewsByPath,
    recentVisits: analytics.recentVisits,
  }
}
