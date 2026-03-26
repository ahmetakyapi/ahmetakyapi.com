import { createHmac, timingSafeEqual } from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'aa_admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[admin-auth] ADMIN_PASSWORD tanımlı değil — dev varsayılan şifre kullanılıyor.')
    return 'admin1234'
  }
  return ''
}

function getSessionSecret() {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[admin-auth] ADMIN_SESSION_SECRET tanımlı değil — dev varsayılan secret kullanılıyor.')
    return 'dev-admin-session-secret'
  }
  return ''
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('hex')
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}

export function isAdminConfigured() {
  return getAdminPassword() !== '' && getSessionSecret() !== ''
}

export function validateAdminPassword(password: string) {
  const expected = getAdminPassword()
  if (!expected) return false
  return safeEqual(password, expected)
}

export function createAdminSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = String(expiresAt)
  return `${payload}.${sign(payload)}`
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false

  const [expiresAt, signature] = token.split('.')
  if (!expiresAt || !signature) return false
  if (!safeEqual(sign(expiresAt), signature)) return false

  return Number(expiresAt) > Date.now()
}

export function isAdminRequest(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(COOKIE_NAME)?.value)
}

export function attachAdminSession(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: createAdminSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return response
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
