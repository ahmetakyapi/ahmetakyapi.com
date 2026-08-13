import { Fragment } from 'react'

/**
 * Küçük bir sözdizimi boyayıcı.
 *
 * Neden hazır kütüphane değil: Shiki sunucuda ~1 MB, Prism istemcide ~15 KB
 * ve dil paketleri ayrı. Buradaki yazılarda geçen diller beş tane —
 * ts/tsx/js, css, bash, md, json. Tek geçişli bir tokenizer bunu 2 KB'da
 * yapıyor ve tema değişimini CSS değişkeniyle takip ediyor.
 *
 * Boyama kaba ama tutarlı: yorum → dize → sayı → anahtar kelime → tip →
 * fonksiyon. Sıra önemli; yorumun içindeki tırnak dize sanılmasın diye
 * yorumlar ilk sırada eşleşiyor.
 */

type Lang = 'ts' | 'tsx' | 'js' | 'css' | 'bash' | 'md' | 'json' | 'text'

const KEYWORDS =
  /\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|interface|type|enum|implements|public|private|readonly|static|as|in|of|void|null|undefined|true|false|this|super|yield|satisfies)\b/

const TOKEN_PATTERNS: { kind: string; re: RegExp }[] = [
  { kind: 'comment', re: /\/\/[^\n]*|\/\*[\s\S]*?\*\/|(?<=^|\n)\s*#[^\n]*/ },
  { kind: 'string', re: /`(?:\\[\s\S]|[^\\`])*`|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'/ },
  { kind: 'number', re: /\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b/i },
  { kind: 'keyword', re: KEYWORDS },
  { kind: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b/ },
  { kind: 'fn', re: /\b[a-zA-Z_$][\w$]*(?=\s*\()/ },
  { kind: 'punct', re: /[{}()[\];,.:?=<>+\-*/%!&|]/ },
]

const CLASS: Record<string, string> = {
  comment: 'text-slate-500 dark:text-slate-500 italic',
  string: 'text-emerald-700 dark:text-emerald-300',
  number: 'text-amber-700 dark:text-amber-300',
  keyword: 'text-violet-700 dark:text-violet-300',
  type: 'text-cyan-700 dark:text-cyan-300',
  fn: 'text-blue-700 dark:text-sky-300',
  punct: 'text-slate-500 dark:text-slate-400',
}

function normalizeLang(lang: string): Lang {
  const l = lang.toLowerCase()
  if (l === 'tsx' || l === 'jsx') return 'tsx'
  if (l === 'ts' || l === 'typescript') return 'ts'
  if (l === 'js' || l === 'javascript') return 'js'
  if (l === 'css' || l === 'scss') return 'css'
  if (l === 'bash' || l === 'sh' || l === 'shell') return 'bash'
  if (l === 'md' || l === 'markdown') return 'md'
  if (l === 'json') return 'json'
  return 'text'
}

/** Tek birleşik regex — her tur en soldaki eşleşmeyi alıp ilerliyor. */
const COMBINED = new RegExp(TOKEN_PATTERNS.map((p) => `(${p.re.source})`).join('|'), 'gm')

function tokenize(code: string) {
  const out: { text: string; kind: string | null }[] = []
  let last = 0

  COMBINED.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = COMBINED.exec(code)) !== null) {
    if (match.index > last) out.push({ text: code.slice(last, match.index), kind: null })

    // Hangi grup eşleşti → hangi tür.
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined)
    out.push({ text: match[0], kind: TOKEN_PATTERNS[groupIndex]?.kind ?? null })
    last = match.index + match[0].length

    // Sıfır uzunluklu eşleşme sonsuz döngü yapmasın.
    if (match[0].length === 0) COMBINED.lastIndex += 1
  }

  if (last < code.length) out.push({ text: code.slice(last), kind: null })
  return out
}

export default function CodeHighlight({ code, lang }: { code: string; lang: string }) {
  const normalized = normalizeLang(lang)

  /* Markdown ve düz metinde boyama yapmıyoruz — gürültü oluyor. */
  if (normalized === 'md' || normalized === 'text') {
    return <>{code}</>
  }

  return (
    <>
      {tokenize(code).map((token, i) => (
        <Fragment key={i}>
          {token.kind ? <span className={CLASS[token.kind]}>{token.text}</span> : token.text}
        </Fragment>
      ))}
    </>
  )
}
