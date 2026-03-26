import { randomUUID } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { trackVisit } from '@/lib/server/analytics-store'

export const runtime = 'nodejs'

const VISITOR_COOKIE = 'aa_visitor_id'

// Simple in-memory rate limiter: max 30 requests per IP per minute
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { pathname } = (await request.json()) as { pathname?: string }

  if (!pathname) {
    return NextResponse.json({ error: 'pathname is required' }, { status: 400 })
  }

  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? randomUUID()
  await trackVisit(pathname, visitorId)

  const response = NextResponse.json({ ok: true })

  if (!request.cookies.get(VISITOR_COOKIE)?.value) {
    response.cookies.set({
      name: VISITOR_COOKIE,
      value: visitorId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}
