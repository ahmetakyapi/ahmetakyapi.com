'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, ChevronUp, Plus, Trash2 } from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────

export const inputCls =
  'w-full rounded-xl border border-black/[0.1] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]'

export const textareaCls = `${inputCls} min-h-[100px] resize-y leading-relaxed`

export const selectCls =
  'w-full rounded-xl border border-black/[0.1] dark:border-white/[0.07] bg-[var(--adm-select-bg)] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition focus:border-indigo-500/50'

export const iconBtnCls =
  'inline-flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] text-slate-400 dark:text-slate-500 transition hover:border-black/[0.15] hover:bg-black/[0.05] dark:hover:border-white/[0.12] dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-200'

export const dangerBtnCls =
  'inline-flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/[0.06] text-rose-500/70 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400'

// ─── Field ───────────────────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  children,
  className = '',
}: Readonly<{
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}>) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        {hint && <span className="text-[11px] text-slate-400 dark:text-slate-700">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

// ─── SectionHead ─────────────────────────────────────────────────────────────

export function SectionHead({
  title,
  count,
  onAdd,
  addLabel = 'Ekle',
  children,
}: Readonly<{
  title: string
  count?: number
  onAdd?: () => void
  addLabel?: string
  children?: React.ReactNode
}>) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{title}</h3>
        {count !== undefined && (
          <span className="rounded-full border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.06] dark:bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium tabular-nums text-slate-500">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition hover:border-black/[0.14] dark:hover:border-white/[0.12] hover:text-slate-900 dark:hover:text-white"
          >
            <Plus className="h-3 w-3" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Panel ───────────────────────────────────────────────────────────────────

export function Panel({
  title,
  subtitle,
  accent,
  action,
  children,
}: Readonly<{
  title: string
  subtitle?: string
  accent?: string
  action?: React.ReactNode
  children: React.ReactNode
}>) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
      style={{ background: 'var(--adm-surface)' }}
    >
      {/* Accent top border */}
      {accent && (
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}60 0%, transparent 60%)` }} />
      )}
      <div className="px-6 py-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── ItemCard ─────────────────────────────────────────────────────────────────

export function ItemCard({
  title,
  subtitle,
  badge,
  badgeColor,
  accent,
  onMoveUp,
  onMoveDown,
  onDelete,
  defaultOpen = false,
  children,
}: Readonly<{
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  accent?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  defaultOpen?: boolean
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(defaultOpen)
  const color = accent ?? badgeColor ?? '#6366f1'

  return (
    <div
      className="group overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06] transition hover:border-black/[0.12] dark:hover:border-white/[0.09]"
      style={{ background: 'var(--adm-card)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Colored accent strip */}
        <div
          className="h-9 w-1 shrink-0 rounded-full opacity-70"
          style={{ background: color }}
        />

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <ChevronRight
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600 transition-transform ${open ? 'rotate-90 text-slate-600 dark:text-slate-400' : ''}`}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
            {subtitle && <p className="truncate text-xs text-slate-500 dark:text-slate-600">{subtitle}</p>}
          </div>
          {badge && (
            <span
              className="shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-semibold"
              style={{
                background: `${badgeColor ?? color}18`,
                color: badgeColor ?? color,
                border: `1px solid ${badgeColor ?? color}35`,
              }}
            >
              {badge}
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
          {onMoveUp && (
            <button type="button" onClick={onMoveUp} className={iconBtnCls} title="Yukarı taşı">
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
          {onMoveDown && (
            <button type="button" onClick={onMoveDown} className={iconBtnCls} title="Aşağı taşı">
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} className={dangerBtnCls} title="Sil">
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="border-t border-black/[0.07] dark:border-white/[0.05] px-4 py-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── ColorInput ──────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#10b981', '#06b6d4', '#0ea5e9', '#64748b',
]

export function ColorInput({
  value,
  onChange,
}: Readonly<{
  value: string
  onChange: (v: string) => void
}>) {
  const [showPresets, setShowPresets] = useState(false)
  const isHex = /^#[0-9a-fA-F]{3,8}$/.test(value)
  const pickerValue = isHex ? value.slice(0, 7) : '#6366f1'

  return (
    <div className="relative">
      <div className="flex items-center gap-2.5 rounded-xl border border-black/[0.1] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] px-3.5 py-2.5 transition focus-within:border-indigo-500/50">
        {/* Color swatch + picker */}
        <label className="relative h-5 w-5 shrink-0 cursor-pointer overflow-hidden rounded-md">
          <div
            className="absolute inset-0 rounded-md border border-black/20 dark:border-white/20"
            style={{ background: value || '#6366f1' }}
          />
          {isHex && (
            <input
              type="color"
              value={pickerValue}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          )}
        </label>

        {/* Text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
          placeholder="#6366f1"
        />

        {/* Presets toggle */}
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="shrink-0 text-slate-400 dark:text-slate-600 transition hover:text-slate-700 dark:hover:text-slate-300"
          title="Hazır renkler"
        >
          <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
            {['#6366f1', '#22d3ee', '#f59e0b', '#10b981'].map((c) => (
              <div key={c} className="rounded-[2px]" style={{ background: c }} />
            ))}
          </div>
        </button>
      </div>

      {/* Preset palette */}
      {showPresets && (
        <div className="absolute left-0 top-full z-10 mt-1.5 rounded-xl border border-black/[0.1] dark:border-white/[0.08] bg-white dark:bg-[#0c1424] p-2 shadow-2xl">
          <div className="grid grid-cols-6 gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { onChange(c); setShowPresets(false) }}
                className="h-6 w-6 rounded-lg border-2 transition hover:scale-110"
                style={{
                  background: c,
                  borderColor: value === c ? 'white' : 'transparent',
                }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
  accent = '#6366f1',
}: Readonly<{
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  accent?: string
}>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <div
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ background: checked ? accent : 'var(--adm-toggle-off)' }}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </div>
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
    </button>
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

export function EmptyState({
  label,
  description,
  onAdd,
  addLabel = 'Yeni Ekle',
}: Readonly<{
  label: string
  description?: string
  onAdd?: () => void
  addLabel?: string
}>) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/[0.09] dark:border-white/[0.07] py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03]">
        <Plus className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-600">{description}</p>}
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-1 inline-flex items-center gap-2 rounded-xl border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      )}
    </div>
  )
}
