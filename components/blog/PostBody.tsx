import { ArrowRight, Info, Lightbulb, TriangleAlert } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Block } from '@/lib/content/types'
import { CodeBlock } from './CodeBlock'
import { Inline } from './Inline'
import type { PostSection } from './posts'

/**
 * Yazı gövdesi, SUNUCUDA çizilir. Eskiden bütün gövde bir istemci
 * bileşeninin içindeydi; yazının tamamı ve boyayıcı tarayıcıya JavaScript
 * olarak da iniyordu.
 *
 * Görünüm app/(site)/blog/blog.css içinde ve yalnızca `data-block` /
 * `data-part` kancalarını okur; burada yerleşim sınıfı yok. Tek hat:
 * gövde, başlıklar ve yüzeyler (kod, tablo, rakam, karşılaştırma, not)
 * okuma sütununun aynı sol kenarından başlar.
 */
export function PostBody({ blocks, sections }: { blocks: Block[]; sections: Map<number, PostSection> }) {
  return (
    <div className="post-prose">
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} section={sections.get(index)} />
      ))}
    </div>
  )
}

const CALLOUT = {
  tip: { label: 'İpucu', Icon: Lightbulb },
  info: { label: 'Bilgi', Icon: Info },
  warning: { label: 'Dikkat', Icon: TriangleAlert },
} as const

function BlockView({ block, section }: { block: Block; section?: PostSection }) {
  switch (block.type) {
    case 'lead':
      return (
        <p data-block="lead">
          <Inline text={block.text} />
        </p>
      )

    case 'p':
      return (
        <p>
          <Inline text={block.text} />
        </p>
      )

    case 'h2':
      return (
        /* Numara yok: "03" gibi mono bir sayı başlığın önünde okumayı
           yavaşlatıyordu; sıra içindekilerde zaten görünüyor. */
        <h2 id={section?.id}>
          <Inline text={block.text} />
        </h2>
      )

    case 'h3':
      return (
        <h3>
          <Inline text={block.text} />
        </h3>
      )

    case 'code':
      return <CodeBlock lang={block.lang} text={block.text} file={block.file} />

    case 'ul':
      return (
        <ul data-block="list">
          {block.items.map((item, i) => (
            <li key={i}>
              <span data-part="marker" aria-hidden="true">
                <span />
              </span>
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      )

    case 'ol':
      return (
        <ol data-block="list" data-ordered="">
          {block.items.map((item, i) => (
            <li key={i}>
              <span data-part="marker" aria-hidden="true">
                {i + 1}.
              </span>
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ol>
      )

    case 'callout': {
      const { label, Icon } = CALLOUT[block.variant]
      return (
        <div data-block="callout" data-variant={block.variant} role="note">
          <p data-part="label">
            <Icon aria-hidden="true" />
            {label}
          </p>
          <p>
            <Inline text={block.text} />
          </p>
        </div>
      )
    }

    case 'quote':
      return (
        <blockquote data-block="quote">
          <p>
            <Inline text={block.text} />
          </p>
        </blockquote>
      )

    case 'table':
      return (
        /* Telefonda (640 px altı) her satır bir kart olur: satır başlığı
           üstte, her değer kendi sütun etiketiyle (`data-label`) altında.
           Yatay kaydırma yok (4 Ekim 2026: "dikeyde tablolar kaymadan
           okunsun"; üç sütunlu tablo 480 piksele zorlanıyordu). Kart
           düzeninde `display` değiştiği için tablo rolleri açıkça yazılı;
           Safari aksi hâlde tablo anlamını düşürür. Geniş ekranda tablo
           kayabilir: ilk sütun yerinde durur, sağ gölge "devamı var" der. */
        <div
          data-block="table"
          role="region"
          aria-label={`Tablo: ${block.head.join(', ')}`}
          tabIndex={0}
          style={{ '--cols': block.head.length } as CSSProperties}
        >
          <table role="table">
            <thead role="rowgroup">
              <tr role="row">
                {block.head.map((cell) => (
                  <th key={cell} scope="col" role="columnheader">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {block.rows.map((row, ri) => (
                <tr key={ri} role="row">
                  {row.map((cell, ci) =>
                    ci === 0 ? (
                      <th key={ci} scope="row" role="rowheader">
                        <Inline text={cell} />
                      </th>
                    ) : (
                      <td key={ci} role="cell" data-label={block.head[ci]}>
                        <Inline text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'stats':
      return (
        <figure data-block="stats">
          {block.label ? (
            <figcaption data-part="label">
              <Inline text={block.label} />
            </figcaption>
          ) : null}
          <dl>
            {block.items.map((item) => (
              <div key={item.note}>
                <dt>
                  <Inline text={item.note} />
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </figure>
      )

    case 'compare':
      return (
        <figure data-block="compare">
          {block.label ? (
            <figcaption data-part="label">
              <Inline text={block.label} />
            </figcaption>
          ) : null}
          <div data-part="pair">
            <div data-part="before">
              <p data-part="side">
                <Inline text={block.before.label} />
              </p>
              <p data-part="value">{block.before.value}</p>
            </div>
            <ArrowRight data-part="arrow" aria-hidden="true" />
            <div data-part="after">
              <p data-part="side">
                <Inline text={block.after.label} />
              </p>
              <p data-part="value">{block.after.value}</p>
            </div>
          </div>
          {block.note ? (
            <p data-part="note">
              <Inline text={block.note} />
            </p>
          ) : null}
        </figure>
      )

    case 'steps':
      return (
        <ol data-block="steps">
          {block.items.map((item, i) => (
            <li key={item.title}>
              <span data-part="marker" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <p data-part="title">{item.title}</p>
                <p data-part="text">
                  <Inline text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      )

    default:
      /* Yeni bir Block tipi eklenip burada ele alınmazsa TypeScript bu
         satırda hata verir; blok sessizce çizilmeden kaybolmasın. */
      return assertNever(block)
  }
}

function assertNever(value: never): never {
  throw new Error(`Bilinmeyen blok tipi: ${JSON.stringify(value)}`)
}
