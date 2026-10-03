/**
 * Türkçe Title Case, yalnız künye ve etiket gibi kısa metinler için.
 *
 * `text-transform: capitalize` ve `title()` KULLANILMAZ: ikisi de `i`yi `I`
 * yapar, `İ` değil. Burada her kelimenin ilk harfi `tr-TR` yereliyle
 * büyütülür; bağlaç ve edatlar (ve, ile, için, de, da, mi) başta değilse
 * küçük kalır.
 *
 * Neden var: proje verisindeki `stats` etiketleri küçük harfli
 * ("veri sağlayıcı") ve o dosya bu işin kapsamı dışında. Kural künyeleri
 * de kapsıyor ("4 Veri Sağlayıcı").
 */
const SMALL_WORDS = new Set(['ve', 'ile', 'için', 'de', 'da', 'mi', 'mı', 'mu', 'mü'])

export function trTitle(text: string): string {
  return text
    .split(' ')
    .map((word, i) => {
      if (!word || (i > 0 && SMALL_WORDS.has(word.toLocaleLowerCase('tr-TR')))) return word
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1)
    })
    .join(' ')
}
