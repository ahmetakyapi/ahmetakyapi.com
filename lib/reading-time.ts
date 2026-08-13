import type { BlogPost, Block } from '@/lib/content/types'

/**
 * Okuma süresi.
 *
 * Eskiden elle yazılıyordu ve tutmuyordu: 287 kelimelik bir yazının üstünde
 * "11 dk" yazıyordu. Okur 90 saniyede bitirince yazının içi boş çıkmış
 * hissediyor. Artık gerçek içerikten hesaplanıyor.
 *
 * Türkçe için ~180 kelime/dakika alıyorum (ortalama okuma hızı 200-250 ama
 * teknik metin ve kod arasında gidip gelmek yavaşlatıyor). Kod blokları
 * ayrı sayılıyor: satır satır okunmuyor, taranıyor.
 */
const WORDS_PER_MINUTE = 180
const CODE_LINES_PER_MINUTE = 22

function blockWords(block: Block): { words: number; codeLines: number } {
  switch (block.type) {
    case 'lead':
    case 'p':
    case 'h2':
    case 'h3':
    case 'quote':
    case 'callout':
      return { words: countWords(block.text), codeLines: 0 }
    case 'ul':
    case 'ol':
      return { words: block.items.reduce((n, item) => n + countWords(item), 0), codeLines: 0 }
    case 'steps':
      return {
        words: block.items.reduce((n, item) => n + countWords(item.title) + countWords(item.text), 0),
        codeLines: 0,
      }
    case 'table':
      return {
        words:
          block.head.reduce((n, cell) => n + countWords(cell), 0) +
          block.rows.reduce((n, row) => n + row.reduce((m, cell) => m + countWords(cell), 0), 0),
        codeLines: 0,
      }
    case 'stats':
      return { words: block.items.reduce((n, item) => n + countWords(item.note), 0), codeLines: 0 }
    case 'compare':
      return { words: countWords(block.note ?? '') + 6, codeLines: 0 }
    case 'code':
      return { words: 0, codeLines: block.text.split('\n').length }
    default:
      return { words: 0, codeLines: 0 }
  }
}

function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function readingMinutes(post: Pick<BlogPost, 'content'>): number {
  let words = 0
  let codeLines = 0

  for (const block of post.content) {
    const measured = blockWords(block)
    words += measured.words
    codeLines += measured.codeLines
  }

  const minutes = words / WORDS_PER_MINUTE + codeLines / CODE_LINES_PER_MINUTE
  return Math.max(1, Math.round(minutes))
}

export function readingTime(post: Pick<BlogPost, 'content'>): string {
  return `${readingMinutes(post)} dk`
}

/** Yazı listelerinde ve künyede kullanılan tek tarih biçimi. */
export function formatPostDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
