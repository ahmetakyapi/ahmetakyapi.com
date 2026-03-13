import { NextResponse, type NextRequest } from 'next/server'
import {
  attachAdminSession,
  clearAdminSession,
  isAdminConfigured,
  isAdminRequest,
  validateAdminPassword,
} from '@/lib/server/admin-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminRequest(request),
    configured: isAdminConfigured(),
    defaultPasswordActive: !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production',
  })
}

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Admin panel yapılandırılmamış.' }, { status: 500 })
  }

  if (!password || !validateAdminPassword(password)) {
    return NextResponse.json({ error: 'Şifre hatalı.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  return attachAdminSession(response)
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  return clearAdminSession(response)
}
