import { Fragment } from 'react'
import { typeset } from '@/lib/typeset'

/**
 * Blok metninin satır içi çizimi, sunucuda.
 *
 * İki iş yapar, başka bir şey değil:
 *   1. Ters tırnak arasını `<code>` olarak basar. Yazı metinlerinde
 *      `cursor: none`, `@supports` gibi parçalar düz metin olarak yazılıydı
 *      ve eski çizici ters tırnakları olduğu gibi ekrana basıyordu.
 *      Eşleşmeyen tek bir ters tırnak varsa metne hiç dokunulmaz.
 *   2. Türkçe tipografi (lib/typeset.ts): düz çift tırnak açılış/kapanış tırnağına, ek
 *      ayıran kesme işareti (CSS'ten, JavaScript'teydi) tipografik
 *      kesmeye döner. Kodun içi DOKUNULMADAN kalır.
 *
 * Sayı biçimine dokunulmaz: "38 KB", "1,2 sn" yazıldığı gibi durur.
 */
export function Inline({ text }: { text: string }) {
  const parts = text.split('`')
  if (parts.length === 1 || parts.length % 2 === 0) return <>{typeset(text, false)}</>

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="post-icode">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{typeset(part, i > 0)}</Fragment>
        ),
      )}
    </>
  )
}
