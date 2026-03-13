import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequest } from '@/lib/server/admin-auth'
import { getSiteContent, saveSiteContent } from '@/lib/server/content-store'
import { normalizeSiteContent } from '@/lib/site-content'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const payload = normalizeSiteContent(await request.json())
  const content = await saveSiteContent(payload)
  return NextResponse.json(content)
}
