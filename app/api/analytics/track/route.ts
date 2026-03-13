import { randomUUID } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { trackVisit } from '@/lib/server/analytics-store'

export const runtime = 'nodejs'

const VISITOR_COOKIE = 'aa_visitor_id'

export async function POST(request: NextRequest) {
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
