'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Hash,
  Plus,
  Trash2,
} from 'lucide-react'
import type { Block, BlogPost } from '@/lib/data'
import type { SiteContent } from '@/lib/site-content'
import { moveItem } from './admin-types'
import { ColorInput, dangerBtnCls, Field, iconBtnCls, inputCls, textareaCls } from './admin-ui'

const ACCENT = '#34d399'

// ── Constants ─────────────────────────────────────────────────────────────────

const BLOCK_TYPES: { type: Block['type']; label: string; short: string; color: string }[] = [
  { type: 'p',       label: 'Paragraf',   short: 'P',   color: '#64748b' },
  { type: 'h2',      label: 'Başlık H2',  short: 'H2',  color: '#6366f1' },
  { type: 'h3',      label: 'Alt Başlık', short: 'H3',  color: '#8b5cf6' },
  { type: 'code',    label: 'Kod',        short: 'KOD', color: '#059669' },
  { type: 'ul',      label: 'Liste',      short: 'UL',  color: '#0ea5e9' },
  { type: 'callout', label: 'Callout',    short: 'NOT', color: '#f59e0b' },
]

const BLOCK_COLOR = Object.fromEntries(BLOCK_TYPES.map((b) => [b.type, b.color])) as Record<Block['type'], string>
const BLOCK_SHORT = Object.fromEntries(BLOCK_TYPES.map((b) => [b.type, b.short])) as Record<Block['type'], string>

const HEADING_STYLES: Partial<Record<Block['type'], React.CSSProperties>> = {
  h2: { fontWeight: 700, fontSize: '1.1rem' },
  h3: { fontWeight: 600, fontSize: '0.95rem' },
}

// ── Factories ─────────────────────────────────────────────────────────────────

function createBlock(type: Block['type'] = 'p'): Block {
  switch (type) {
    case 'h2':      return { type: 'h2', text: 'Yeni başlık' }
    case 'h3':      return { type: 'h3', text: 'Yeni alt başlık' }
    case 'code':    return { type: 'code', lang: 'tsx', text: '// kod örneği' }
    case 'ul':      return { type: 'ul', items: ['İlk madde'] }
    case 'callout': return { type: 'callout', variant: 'tip', text: 'Not girin.' }
    default:        return { type: 'p', text: 'Paragraf girin.' }
  }
}

function createPost(posts: BlogPost[]): BlogPost {
  return {
    slug: `yeni-yazi-${posts.length + 1}`,
    tag: 'Yeni',
    tagColor: '#6366f1',
    title: 'Yeni Blog Yazısı',
    excerpt: 'Kısa özet girin.',
    date: new Date().toISOString().slice(0, 10),
    readTime: '5 dk',
    coverGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    content: [createBlock('p')],
  }
}

// ── Post-level helpers (avoids deep nesting) ──────────────────────────────────

function applyBlockUpdate(post: BlogPost, bi: number, block: Block): BlogPost {
  return { ...post, content: post.content.map((b, i) => (i === bi ? block : b)) }
}

function applyBlockDelete(post: BlogPost, bi: number): BlogPost {
  return { ...post, content: post.content.filter((_, i) => i !== bi) }
}

function applyBlockMove(post: BlogPost, bi: number, dir: -1 | 1): BlogPost {
  return { ...post, content: moveItem(post.content, bi, dir) }
}

// ── Block card ────────────────────────────────────────────────────────────────

function BlockCard({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Readonly<{
  block: Block
  onUpdate: (b: Block) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}>) {
  const color = BLOCK_COLOR[block.type]
  const short = BLOCK_SHORT[block.type]
  const calloutVariant = block.type === 'callout' ? block.variant : undefined
  const badgeLabel = calloutVariant ? `${short}:${calloutVariant.toUpperCase()}` : short

  return (
    <div
      className="group overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.06] transition hover:border-black/[0.12] dark:hover:border-white/[0.09]"
      style={{ background: `linear-gradient(135deg, ${color}08 0%, var(--adm-card) 60%)` }}
    >
      {/* Left accent + header */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="h-5 w-0.5 shrink-0 rounded-full" style={{ background: color }} />

        {/* Type switcher */}
        <select
          value={block.type}
          onChange={(e) => onUpdate(createBlock(e.target.value as Block['type']))}
          className="cursor-pointer appearance-none border-0 bg-transparent text-[11px] font-bold uppercase tracking-wider outline-none"
          style={{ color }}
        >
          {BLOCK_TYPES.map(({ type, label }) => (
            <option key={type} value={type} style={{ background: '#0b111e', color: '#e2e8f0' }}>
              {label}
            </option>
          ))}
        </select>

        <span
          className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold"
          style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
        >
          {badgeLabel}
        </span>

        <div className="ml-auto flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
          <button type="button" onClick={onMoveUp} className={iconBtnCls} title="Yukarı">
            <ChevronUp className="h-3 w-3" />
          </button>
          <button type="button" onClick={onMoveDown} className={iconBtnCls} title="Aşağı">
            <ChevronDown className="h-3 w-3" />
          </button>
          <button type="button" onClick={onDelete} className={dangerBtnCls} title="Sil">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {(block.type === 'p' || block.type === 'h2' || block.type === 'h3') && (
          <textarea
            value={block.text}
            onChange={(e) => onUpdate({ ...block, text: e.target.value })}
            rows={block.type === 'p' ? 4 : 2}
            placeholder={block.type === 'p' ? 'Paragraf metni...' : 'Başlık metni...'}
            className="w-full resize-y bg-transparent text-sm leading-relaxed text-slate-200 outline-none placeholder:text-slate-700"
            style={HEADING_STYLES[block.type]}
          />
        )}

        {block.type === 'code' && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600">Dil:</span>
              <input
                value={block.lang}
                onChange={(e) => onUpdate({ ...block, lang: e.target.value })}
                className="w-24 rounded-lg border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03] px-2 py-1 font-mono text-xs text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500/40"
                placeholder="tsx"
              />
            </div>
            <textarea
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              rows={8}
              className="w-full resize-y rounded-xl border border-emerald-500/15 bg-[#030d08] px-4 py-3 font-mono text-xs leading-relaxed text-emerald-300 outline-none"
            />
          </div>
        )}

        {block.type === 'ul' && (
          <div className="space-y-1.5">
            {block.items.map((item, i) => (
              <div key={`${item}-${i}`} className="flex items-center gap-2">
                <span className="shrink-0 text-slate-600">·</span>
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...block.items]
                    next[i] = e.target.value
                    onUpdate({ ...block, items: next })
                  }}
                  className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-700"
                  placeholder={`Madde ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => onUpdate({ ...block, items: block.items.filter((_, j) => j !== i) })}
                  className="shrink-0 text-slate-700 transition hover:text-rose-400"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onUpdate({ ...block, items: [...block.items, ''] })}
              className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 transition hover:text-slate-300"
            >
              <Plus className="h-3 w-3" />
              Madde ekle
            </button>
          </div>
        )}

        {block.type === 'callout' && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600">Tip:</span>
              {(['tip', 'info', 'warning'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onUpdate({ ...block, variant: v })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                    block.variant === v
                      ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-black/[0.04] dark:bg-white/[0.04] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <textarea
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              rows={3}
              placeholder="Callout metni..."
              className="w-full resize-y bg-transparent text-sm leading-relaxed text-slate-200 outline-none placeholder:text-slate-700"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add block bar ─────────────────────────────────────────────────────────────

function AddBlockBar({ onAdd }: Readonly<{ onAdd: (type: Block['type']) => void }>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {BLOCK_TYPES.map(({ type, label, color }) => (
        <button
          key={type}
          type="button"
          onClick={() => onAdd(type)}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition hover:opacity-80"
          style={{ background: `${color}12`, color, border: `1px solid ${color}28` }}
        >
          <Plus className="h-2.5 w-2.5" />
          {label}
        </button>
      ))}
    </div>
  )
}

// ── Post list sidebar item ────────────────────────────────────────────────────

function PostListItem({
  post,
  isActive,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Readonly<{
  post: BlogPost
  isActive: boolean
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}>) {
  return (
    <div
      className={`group overflow-hidden rounded-xl border transition ${
        isActive
          ? 'border-emerald-500/25 bg-emerald-500/[0.06]'
          : 'border-black/[0.07] bg-black/[0.02] dark:border-white/[0.05] dark:bg-white/[0.02] hover:border-black/[0.11] hover:bg-black/[0.03] dark:hover:border-white/[0.08] dark:hover:bg-white/[0.03]'
      }`}
    >
      {/* Cover gradient strip */}
      <div className="h-[3px] w-full" style={{ background: post.coverGradient }} />

      <button type="button" onClick={onSelect} className="w-full px-3 pb-2 pt-2.5 text-left">
        <p className={`truncate text-[13px] font-semibold leading-snug ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
          {post.title}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
            style={{
              background: `${post.tagColor}18`,
              color: post.tagColor,
              border: `1px solid ${post.tagColor}30`,
            }}
          >
            {post.tag}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-600">
            <Hash className="h-2.5 w-2.5" />
            {post.slug.slice(0, 12)}{post.slug.length > 12 ? '…' : ''}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-700">
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-2.5 w-2.5" />
            {post.content.length} blok
          </span>
        </div>
      </button>

      {/* Hover actions — bottom bar */}
      <div className="flex items-center justify-end gap-0.5 border-t border-black/[0.06] dark:border-white/[0.04] px-2 py-1.5 opacity-0 transition group-hover:opacity-100">
        <button type="button" onClick={onMoveUp} className={iconBtnCls} title="Yukarı">
          <ChevronUp className="h-2.5 w-2.5" />
        </button>
        <button type="button" onClick={onMoveDown} className={iconBtnCls} title="Aşağı">
          <ChevronDown className="h-2.5 w-2.5" />
        </button>
        <button type="button" onClick={onDelete} className={dangerBtnCls} title="Sil">
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  )
}

// ── Post editor ───────────────────────────────────────────────────────────────

type EditorTab = 'meta' | 'content'

function PostEditor({
  post,
  onUpdate,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}: Readonly<{
  post: BlogPost
  onUpdate: (patch: Partial<BlogPost>) => void
  onAddBlock: (type: Block['type']) => void
  onUpdateBlock: (i: number, b: Block) => void
  onDeleteBlock: (i: number) => void
  onMoveBlock: (i: number, dir: -1 | 1) => void
}>) {
  const [tab, setTab] = useState<EditorTab>('meta')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Editor top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-black/[0.08] dark:border-white/[0.05] px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Cover gradient dot */}
          <div className="h-5 w-5 shrink-0 rounded-lg" style={{ background: post.coverGradient }} />
          <h2 className="max-w-xs truncate text-sm font-semibold text-slate-900 dark:text-white">
            {post.title || 'İsimsiz Yazı'}
          </h2>
          <span
            className="shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-semibold"
            style={{
              background: `${post.tagColor}18`,
              color: post.tagColor,
              border: `1px solid ${post.tagColor}30`,
            }}
          >
            {post.tag}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center rounded-xl border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03] p-0.5">
          {([
            { key: 'meta', label: 'Bilgiler', count: undefined },
            { key: 'content', label: 'İçerik', count: post.content.length },
          ] as const).map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tab === key ? 'bg-black/[0.07] dark:bg-white/[0.08] text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {label}
              {count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                    tab === key ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Meta tab — scrollable */}
      {tab === 'meta' && (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Başlık">
                <input value={post.title} onChange={(e) => onUpdate({ title: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Slug" hint="/blog/[slug]">
                <input value={post.slug} onChange={(e) => onUpdate({ slug: e.target.value })} className={inputCls} placeholder="yazi-basligi" />
              </Field>
              <Field label="Etiket">
                <input value={post.tag} onChange={(e) => onUpdate({ tag: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Etiket Rengi">
                <ColorInput value={post.tagColor} onChange={(v) => onUpdate({ tagColor: v })} />
              </Field>
              <Field label="Tarih">
                <input type="date" value={post.date} onChange={(e) => onUpdate({ date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Okuma Süresi">
                <input value={post.readTime} onChange={(e) => onUpdate({ readTime: e.target.value })} className={inputCls} placeholder="5 dk" />
              </Field>
            </div>

            <Field label="Özet">
              <textarea value={post.excerpt} onChange={(e) => onUpdate({ excerpt: e.target.value })} className={textareaCls} rows={3} placeholder="Yazının kısa özeti" />
            </Field>

            <Field label="Kapak Gradient">
              <input value={post.coverGradient} onChange={(e) => onUpdate({ coverGradient: e.target.value })} className={inputCls} placeholder="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" />
              <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: post.coverGradient }} />
            </Field>
          </div>
        </div>
      )}

      {/* Content tab — sticky toolbar + scrollable list */}
      {tab === 'content' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ── Sticky add-block toolbar ── */}
          <div
            className="shrink-0 border-b border-black/[0.08] dark:border-white/[0.06] px-6 py-3"
            style={{ background: 'var(--adm-topbar)', backdropFilter: 'blur(16px)' }}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                Blok Ekle
              </span>
              <div className="h-3 w-px bg-white/[0.08]" />
              <AddBlockBar onAdd={onAddBlock} />
            </div>
          </div>

          {/* ── Block list ── */}
          <div className="flex-1 overflow-y-auto">
            {post.content.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
                  style={{ background: `${ACCENT}10` }}
                >
                  <Plus className="h-5 w-5" style={{ color: ACCENT }} />
                </div>
                <p className="text-sm font-medium text-slate-500">İçerik bloğu yok</p>
                <p className="text-xs text-slate-700">
                  Yukarıdaki araç çubuğundan blok tipi seçerek başlayın
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-6">
                {post.content.map((block, i) => (
                  <BlockCard
                    key={`${block.type}-${i}`}
                    block={block}
                    onUpdate={(b) => onUpdateBlock(i, b)}
                    onDelete={() => onDeleteBlock(i)}
                    onMoveUp={() => onMoveBlock(i, -1)}
                    onMoveDown={() => onMoveBlock(i, 1)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Empty editor state ────────────────────────────────────────────────────────

function EmptyEditorState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.08] dark:border-white/[0.07]"
        style={{ background: `${ACCENT}10` }}
      >
        <FileText className="h-6 w-6" style={{ color: ACCENT }} />
      </div>
      <p className="text-sm font-medium text-slate-400">Düzenlemek için bir yazı seçin</p>
      <p className="text-xs text-slate-700">veya yeni bir yazı oluşturun</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminBlog({
  content,
  setContent,
}: Readonly<{
  content: SiteContent
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>
}>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const posts = content.blogPosts

  function updatePost(index: number, patch: Partial<BlogPost>) {
    setContent((c) => ({
      ...c,
      blogPosts: c.blogPosts.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }))
  }

  function addPost() {
    setContent((c) => {
      const next = [...c.blogPosts, createPost(c.blogPosts)]
      setSelectedIndex(next.length - 1)
      return { ...c, blogPosts: next }
    })
  }

  function removePost(index: number) {
    setContent((c) => ({ ...c, blogPosts: c.blogPosts.filter((_, i) => i !== index) }))
    if (selectedIndex === index) setSelectedIndex(null)
  }

  function movePost(index: number, dir: -1 | 1) {
    setContent((c) => ({ ...c, blogPosts: moveItem(c.blogPosts, index, dir) }))
    if (selectedIndex === index) setSelectedIndex(index + dir)
  }

  function addBlock(postIndex: number, type: Block['type']) {
    setContent((c) => ({
      ...c,
      blogPosts: c.blogPosts.map((p, i) =>
        i === postIndex ? { ...p, content: [...p.content, createBlock(type)] } : p,
      ),
    }))
  }

  function updateBlock(postIndex: number, bi: number, block: Block) {
    setContent((c) => ({
      ...c,
      blogPosts: c.blogPosts.map((p, pi) =>
        pi === postIndex ? applyBlockUpdate(p, bi, block) : p,
      ),
    }))
  }

  function deleteBlock(postIndex: number, bi: number) {
    setContent((c) => ({
      ...c,
      blogPosts: c.blogPosts.map((p, pi) =>
        pi === postIndex ? applyBlockDelete(p, bi) : p,
      ),
    }))
  }

  function moveBlock(postIndex: number, bi: number, dir: -1 | 1) {
    setContent((c) => ({
      ...c,
      blogPosts: c.blogPosts.map((p, pi) =>
        pi === postIndex ? applyBlockMove(p, bi, dir) : p,
      ),
    }))
  }

  const selectedPost = selectedIndex === null ? undefined : posts[selectedIndex]

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Post list sidebar ──────────────────────────────────────────── */}
      <aside
        className="flex w-[280px] shrink-0 flex-col border-r border-black/[0.08] dark:border-white/[0.05]"
        style={{ background: 'var(--adm-blog-sidebar)' }}
      >
        {/* Sidebar header */}
        <div
          className="flex h-[54px] shrink-0 items-center justify-between border-b border-black/[0.08] dark:border-white/[0.05] px-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Blog Yazıları
            </span>
            <span className="rounded-full border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03] px-2 py-0.5 text-[11px] tabular-nums text-slate-500 dark:text-slate-600">
              {posts.length}
            </span>
          </div>
          <button
            type="button"
            onClick={addPost}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition"
            style={{
              background: `${ACCENT}18`,
              border: `1px solid ${ACCENT}30`,
              color: ACCENT,
            }}
            title="Yeni yazı ekle"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Post list */}
        <div className="flex-1 overflow-y-auto p-2.5">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FileText className="h-8 w-8 text-slate-700" />
              <p className="text-xs text-slate-600">Henüz yazı yok</p>
              <button
                type="button"
                onClick={addPost}
                className="rounded-lg border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white"
              >
                + İlk Yazıyı Ekle
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {posts.map((post, index) => (
                <PostListItem
                  key={post.slug}
                  post={post}
                  isActive={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                  onMoveUp={() => movePost(index, -1)}
                  onMoveDown={() => movePost(index, 1)}
                  onDelete={() => removePost(index)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Editor area ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedPost === undefined && <EmptyEditorState />}
        {selectedPost !== undefined && selectedIndex !== null && (
          <PostEditor
            post={selectedPost}
            onUpdate={(patch) => updatePost(selectedIndex, patch)}
            onAddBlock={(type) => addBlock(selectedIndex, type)}
            onUpdateBlock={(i, b) => updateBlock(selectedIndex, i, b)}
            onDeleteBlock={(i) => deleteBlock(selectedIndex, i)}
            onMoveBlock={(i, dir) => moveBlock(selectedIndex, i, dir)}
          />
        )}
      </div>
    </div>
  )
}
