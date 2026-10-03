/**
 * Hero ismindeki harflerin genişliği, punto (`em`) cinsinden.
 *
 * Ölçüldü: Schibsted Grotesk, ağırlık 560, harf aralığı -0.055em (home.css →
 * `.home-name`), her harf ayrı `inline-block` (3 Ekim 2026, Chrome). Harf
 * aralığı genişliğe dahil. Harfler ayrı kutularda olduğu için aralarında
 * kerning yok; yani bu tablo kelimenin gerçek genişliğini birebir verir.
 *
 * İki işe yarıyor, ikisi de sunucuda, JavaScript beklemeden:
 *   1. Her harfin kutusu bu genişlikte sabit. Masaüstündeki ağırlık
 *      dalgası harfi kalınlaştırınca kutu büyümez, satır zıplamaz; font
 *      geç inerse (swap) de satır kaymaz.
 *   2. Degrade iki kelimeyi TEK yüzey gibi kaplar: her harf degradenin
 *      kendi dilimini gösterir (`--gx` yeri, `--w1`/`--w2` kelime boyları).
 *
 * Tabloda olmayan harf `FALLBACK` alır; NameWave fontlar inince bütün
 * harfleri yeniden ölçüp düzeltir (isim değişirse tabloyu da güncelle).
 */
export const GLYPH_EM: Readonly<Record<string, number>> = {
  A: 0.6635, B: 0.6061, C: 0.6548, Ç: 0.6548, D: 0.6607, E: 0.5402, F: 0.5169, G: 0.6688, Ğ: 0.6688,
  H: 0.6807, I: 0.3332, İ: 0.3332, J: 0.5062, K: 0.6364, L: 0.5065, M: 0.8453, N: 0.6921, O: 0.7138,
  Ö: 0.7138, P: 0.5871, R: 0.6047, S: 0.5748, Ş: 0.5748, T: 0.6102, U: 0.6393, Ü: 0.6393, V: 0.6403,
  Y: 0.5852, Z: 0.5589,
  a: 0.5177, b: 0.5528, c: 0.5113, ç: 0.5113, d: 0.5526, e: 0.5293, f: 0.2997, g: 0.5113, ğ: 0.5113,
  h: 0.5296, ı: 0.2073, i: 0.2073, j: 0.2316, k: 0.5232, l: 0.224, m: 0.8369, n: 0.5433, o: 0.5485,
  ö: 0.5485, p: 0.5533, r: 0.3734, s: 0.4728, ş: 0.4728, t: 0.304, u: 0.5433, ü: 0.5433, v: 0.5228,
  y: 0.5221, z: 0.4677,
}

export const FALLBACK = 0.55

export type GlyphBox = { glyph: string; width: number; x: number }

/** Kelimeyi harf kutularına böler: genişlik ve kelime içindeki yer (em). */
export function layoutWord(word: string): { glyphs: GlyphBox[]; width: number } {
  let x = 0
  const glyphs = Array.from(word).map((glyph) => {
    const width = GLYPH_EM[glyph] ?? FALLBACK
    const box = { glyph, width, x }
    x += width
    return box
  })
  return { glyphs, width: x }
}
