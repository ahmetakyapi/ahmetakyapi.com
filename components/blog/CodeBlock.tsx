import CodeHighlight from './CodeHighlight'
import { CopyCode } from './CopyCode'

/**
 * Kod bloğu, sunucuda boyanır: CodeHighlight artık istemci paketinde değil.
 * Başlık satırında dosya yolu (yoksa dil) ve kopyala düğmesi; gövde
 * yatayda kayar, satır kırılmaz (kodda kırılan satır yanlış okunur).
 */
export function CodeBlock({ lang, text, file }: { lang: string; text: string; file?: string }) {
  return (
    <figure className="post-code" data-block="code">
      <figcaption>
        {/* Dosya yolu varsa dil yerine o yazılır: kodun nerede yaşadığı
            hangi dilde yazıldığından daha çok bilgi taşıyor. */}
        <span className="post-code-file">{file ?? lang}</span>
        <CopyCode />
      </figcaption>
      {/* Kaydırılabilir bölge klavyeyle de kaydırılabilsin (WCAG 2.1.1). */}
      <pre tabIndex={0}>
        <code>
          <CodeHighlight code={text} lang={lang} />
        </code>
      </pre>
    </figure>
  )
}
