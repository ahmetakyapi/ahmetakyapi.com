/**
 * Türkçe tipografi, saf metin üzerinde. `"use client"` DEĞİL: sunucu
 * çizicisi (components/blog/Inline.tsx), yazı dizini ve istemci adaları
 * aynı fonksiyonu okur.
 *
 * Düz çift tırnak açılış/kapanış tırnağına, ek ayıran kesme işareti
 * tipografik kesmeye (’) döner. Sayı biçimine dokunulmaz.
 *
 * `afterCode`: metin bir kod parçasından hemen sonra başlıyorsa baştaki
 * kesme de ek ayırır (`useState`'i → `useState`’i).
 */
export function typeset(text: string, afterCode = false): string {
  let quote = 0
  return text
    .replace(/"/g, () => (quote++ % 2 === 0 ? '“' : '”'))
    .replace(/(^|[\p{L}\p{N})”])'(?=\p{L})/gu, (match, before: string, offset: number) =>
      before === '' && !(offset === 0 && afterCode) ? match : `${before}’`,
    )
}
