import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defaultSiteContent, normalizeSiteContent } from '@/lib/site-content'
import type { SiteContent } from '@/lib/site-content'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json')

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true })
}

export async function getSiteContent() {
  try {
    const raw = await readFile(CONTENT_FILE, 'utf8')
    return normalizeSiteContent(JSON.parse(raw) as SiteContent)
  } catch {
    return defaultSiteContent
  }
}

export async function saveSiteContent(content: SiteContent) {
  await ensureDataDir()
  const normalized = normalizeSiteContent(content)
  await writeFile(CONTENT_FILE, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
  return normalized
}
