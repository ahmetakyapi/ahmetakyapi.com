import { NextResponse } from 'next/server'
import { getSiteContent } from '@/lib/server/content-store'

export const runtime = 'nodejs'

export async function GET() {
  const content = await getSiteContent()
  return NextResponse.json(content)
}
