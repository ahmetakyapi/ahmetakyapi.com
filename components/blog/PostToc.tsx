import { ChevronDown } from 'lucide-react'
import { Inline } from './Inline'
import type { PostSection } from './posts'
import { TocSpy } from './TocSpy'

/**
 * İçindekiler, iki biçimde ve ikisi de sunucuda basılı:
 *   - masaüstünde (lg) metnin sağında yapışkan liste,
 *   - telefonda gövdenin başında katlanır `<details>`: JavaScript'siz açılır.
 * Numaralar gövdedeki ara başlık numarasıyla aynı ("03" iki yerde de 03).
 * Etkin bölüm işaretini yalnızca TocSpy koyar.
 */
function TocList({ sections }: { sections: PostSection[] }) {
  return (
    <ol>
      {sections.map((section) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>
            <span aria-hidden="true">{section.number}</span>
            <span>
              <Inline text={section.text} />
            </span>
          </a>
        </li>
      ))}
    </ol>
  )
}

export function PostTocAside({ sections }: { sections: PostSection[] }) {
  if (sections.length === 0) return null
  return (
    <nav aria-label="Bu yazının bölümleri" className="post-toc" data-toc="">
      <p className="post-toc-title">Bu Yazıda</p>
      <TocList sections={sections} />
      <TocSpy ids={sections.map((s) => s.id)} />
    </nav>
  )
}

export function PostTocInline({ sections }: { sections: PostSection[] }) {
  if (sections.length === 0) return null
  return (
    <details className="post-toc-m">
      <summary>
        <span>Bu Yazıda</span>
        <span className="post-toc-m-count">{sections.length} Bölüm</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <nav aria-label="Bu yazının bölümleri" className="post-toc-m-list">
        <TocList sections={sections} />
      </nav>
    </details>
  )
}
