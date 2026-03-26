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

  const raw = await request.json()

  // Basic content validation
  const errors: string[] = []

  if (raw?.home) {
    if (typeof raw.home.firstName === 'string' && raw.home.firstName.trim().length === 0) {
      errors.push('Ad alanı boş bırakılamaz.')
    }
    if (typeof raw.home.lastName === 'string' && raw.home.lastName.trim().length === 0) {
      errors.push('Soyad alanı boş bırakılamaz.')
    }
    if (typeof raw.home.roleLabel === 'string' && raw.home.roleLabel.length > 100) {
      errors.push('Rol etiketi en fazla 100 karakter olabilir.')
    }
    if (typeof raw.home.introPrimary === 'string' && raw.home.introPrimary.length > 2000) {
      errors.push('Giriş metni en fazla 2000 karakter olabilir.')
    }
  }

  if (Array.isArray(raw?.projects)) {
    for (const p of raw.projects) {
      if (typeof p.title === 'string' && p.title.trim().length === 0) {
        errors.push('Proje başlığı boş bırakılamaz.')
        break
      }
    }
  }

  if (Array.isArray(raw?.blogPosts)) {
    for (const b of raw.blogPosts) {
      if (typeof b.title === 'string' && b.title.trim().length === 0) {
        errors.push('Blog yazısı başlığı boş bırakılamaz.')
        break
      }
      if (typeof b.slug === 'string' && b.slug.trim().length === 0) {
        errors.push('Blog yazısı slug boş bırakılamaz.')
        break
      }
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 400 })
  }

  const payload = normalizeSiteContent(raw)
  const content = await saveSiteContent(payload)
  return NextResponse.json(content)
}
