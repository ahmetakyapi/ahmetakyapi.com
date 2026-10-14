/**
 * Arama yardımcıları: ⌘K paleti ve 404 önerisi aynı kuralla eşleştirir.
 *
 * Neden: Türkçe klavyesi olmayan biri "acilis" yazıyor, telefon klavyesi
 * "Acılış"ı büyük harfle başlatıyor, biri de "İlk"i "Ilk" diye yazıyor.
 * Düz `includes` üçünü de kaçırıyordu (14 Ekim 2026, ⌘K'da "acilis" boş
 * liste döndü). Karşılaştırma iki tarafı da aynı biçime indirir:
 *   - `tr-TR` küçük harf (İ → i, I → ı),
 *   - Türkçe harfler ASCII karşılığına (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u,
 *     şapkalı â/î/û dahil),
 *   - kalan birleşik işaretler silinir (é → e).
 * Sorgu kelimelere bölünür ve HER kelime metinde geçmeli: "zili analiz"
 * yalnız ikisini birden taşıyan satırı bulur, sıra önemli değil.
 */
const TR_ASCII: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' }

export function foldTr(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşüâîû]/g, (ch) => TR_ASCII[ch] ?? ch)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
}

/** Sorgunun katlanmış kelimeleri; boş sorguda boş dizi. */
export function queryTokens(query: string): string[] {
  return foldTr(query).split(/\s+/).filter(Boolean)
}

/** Katlanmış metin bütün kelimeleri içeriyor mu? */
export function matchesTokens(foldedText: string, tokens: readonly string[]): boolean {
  return tokens.every((token) => foldedText.includes(token))
}

/**
 * İki adres parçasının benzerliği, 0-1 (ikili harf grupları üzerinden Dice
 * katsayısı). Yazım hatasını ve eksik/fazla harfi affeder: "acilizili" ile
 * "acilis-zili" 0,82; "dungeon" ile "dungeon-mates" 0,71; ilgisiz iki adres
 * 0'a yakın. Harf ve rakam dışındaki her şey (tire, nokta) yok sayılır.
 */
export function similarity(a: string, b: string): number {
  const clean = (text: string) => foldTr(text).replace(/[^a-z0-9]/g, '')
  const x = clean(a)
  const y = clean(b)
  if (!x || !y) return 0
  if (x === y) return 1
  if (x.length < 2 || y.length < 2) return 0
  const pairs = new Map<string, number>()
  for (let i = 0; i < x.length - 1; i++) {
    const pair = x.slice(i, i + 2)
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1)
  }
  let shared = 0
  for (let i = 0; i < y.length - 1; i++) {
    const pair = y.slice(i, i + 2)
    const count = pairs.get(pair) ?? 0
    if (count > 0) {
      pairs.set(pair, count - 1)
      shared++
    }
  }
  return (2 * shared) / (x.length - 1 + (y.length - 1))
}
