import { PROJECT_GROUPS, type Project, type ProjectGroup } from '@/lib/content/types'

/**
 * Proje ekranlarının saf metin yardımcıları. `"use client"` DEĞİL: süzgeç
 * adası (istemci) ve sayfalar (sunucu) aynı etiketleri okur.
 */

/** Süzgeç çiplerinin etiketleri, `PROJECT_GROUPS` sırasıyla. */
export const GROUP_LABELS = {
  platform: 'Platformlar',
  oyun: 'Oyunlar',
  arac: 'Araçlar',
} as const satisfies Record<ProjectGroup, string>

/** Adres parametresinin adı: `/projeler?kategori=oyun`. */
export const FILTER_PARAM = 'kategori'

/**
 * Süzgecin `data-filter`, önizlemenin `--px/--py` yazdığı listenin kabı.
 * Burada, istemci modülünde değil: `"use client"` bir modülden dışa
 * aktarılan değer sunucu bileşenine gerçek değer olarak gelmez, istemci
 * referansına dönüşür.
 */
export const LIST_ID = 'proje-listesi'

export function isProjectGroup(value: unknown): value is ProjectGroup {
  return typeof value === 'string' && (PROJECT_GROUPS as readonly string[]).includes(value)
}

/**
 * Bir cümleden kısa ilk parça bir künyeye benziyor ("Bu site."): kartın tek
 * cümlesi en az bu uzunlukta olsun, değilse ikinci cümle de eklenir.
 */
const MIN_LEAD_LENGTH = 24

/** Cümle sonu: nokta/ünlem/soru, boşluk, büyük harf ya da tırnakla başlayan yeni cümle. */
const SENTENCE_BREAK = /(?<=[.!?])\s+(?=["'“A-ZÇĞİÖŞÜ0-9])/u

/**
 * Açıklamayı "tek cümle" ve "kalanı" diye böler: kart ve detay başlığı
 * birinciyi, detayın gövdesi ikinciyi gösterir. Metin değişmez, yalnız
 * bölünür.
 */
export function splitLead(text: string): { lead: string; rest: string } {
  const sentences = text.split(SENTENCE_BREAK)
  let count = 1
  while (count < sentences.length && sentences.slice(0, count).join(' ').length < MIN_LEAD_LENGTH) count++
  return { lead: sentences.slice(0, count).join(' '), rest: sentences.slice(count).join(' ') }
}

/** Türkçe Title Case'te küçük kalan bağlaç ve edatlar (başta değilse). */
const SMALL_WORDS = new Set(['ve', 'ile', 'için', 'de', 'da', 'mi', 'ya', 'veya'])

/**
 * Veri içindeki küçük harfli künyeyi ("veri sağlayıcı") Title Case'e
 * çevirir. `text-transform: capitalize` KULLANILMAZ: `i → I` üretir, `İ`
 * değil. Büyük harf `tr-TR` yerel ayarıyla.
 */
export function titleCaseTr(text: string): string {
  return text
    .split(' ')
    .map((word, i) =>
      i > 0 && SMALL_WORDS.has(word) ? word : word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1),
    )
    .join(' ')
}

/**
 * Durum rozetinin metni. Veride `badge: 'GitHub'` canlı adresi olmayan
 * proje demek; ekranda bir platform adı değil durum yazılır.
 */
const BADGE_LABELS = { Canlı: 'Canlı', GitHub: 'Açık Kaynak' } as const satisfies Record<Project['badge'], string>

export function badgeLabel(badge: Project['badge']): string {
  return BADGE_LABELS[badge]
}
