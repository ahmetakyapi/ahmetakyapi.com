'use client'

import type { HomeValueProp, SiteContent } from '@/lib/site-content'
import { moveItem } from './admin-types'
import {
  ColorInput,
  dangerBtnCls,
  EmptyState,
  Field,
  iconBtnCls,
  inputCls,
  textareaCls,
} from './admin-ui'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

const ACCENT = '#a78bfa'

export default function AdminHome({
  content,
  setContent,
}: Readonly<{
  content: SiteContent
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>
}>) {
  function updateHome<K extends keyof SiteContent['home']>(key: K, value: SiteContent['home'][K]) {
    setContent((c) => ({ ...c, home: { ...c.home, [key]: value } }))
  }

  function updateExpertise(index: number, value: string) {
    const next = [...content.home.expertise]
    next[index] = value
    updateHome('expertise', next)
  }

  function removeExpertise(index: number) {
    updateHome('expertise', content.home.expertise.filter((_, i) => i !== index))
  }

  function updateValueProp(index: number, patch: Partial<HomeValueProp>) {
    setContent((c) => ({
      ...c,
      home: {
        ...c.home,
        valueProps: c.home.valueProps.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }))
  }

  function addValueProp() {
    setContent((c) => ({
      ...c,
      home: {
        ...c.home,
        valueProps: [
          ...c.home.valueProps,
          { icon: '✦', title: 'Yeni Kart', description: 'Açıklama girin.', color: '#6366f1', glow: 'rgba(99,102,241,0.18)' },
        ],
      },
    }))
  }

  function removeValueProp(index: number) {
    setContent((c) => ({
      ...c,
      home: { ...c.home, valueProps: c.home.valueProps.filter((_, i) => i !== index) },
    }))
  }

  function moveValueProp(index: number, dir: -1 | 1) {
    setContent((c) => ({
      ...c,
      home: { ...c.home, valueProps: moveItem(c.home.valueProps, index, dir) },
    }))
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-5 px-8 py-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ana Sayfa</h1>
          <p className="mt-1 text-sm text-slate-500">Hero metni, uzmanlık ve öne çıkan kartlar</p>
        </div>

        {/* ── Identity ─────────────────────────────────────────────────── */}
        <Section title="Kimlik" accent={ACCENT}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Ad">
              <input value={content.home.firstName} onChange={(e) => updateHome('firstName', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Soyad">
              <input value={content.home.lastName} onChange={(e) => updateHome('lastName', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Rol Etiketi">
              <input value={content.home.roleLabel} onChange={(e) => updateHome('roleLabel', e.target.value)} className={inputCls} placeholder="Fullstack Developer" />
            </Field>
          </div>
        </Section>

        {/* ── Intro texts ──────────────────────────────────────────────── */}
        <Section title="Giriş Metinleri" subtitle="Hero bölümünde gösterilen iki paragraf" accent={ACCENT}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Birinci Metin">
              <textarea value={content.home.introPrimary} onChange={(e) => updateHome('introPrimary', e.target.value)} className={textareaCls} rows={5} />
            </Field>
            <Field label="İkinci Metin">
              <textarea value={content.home.introSecondary} onChange={(e) => updateHome('introSecondary', e.target.value)} className={textareaCls} rows={5} />
            </Field>
          </div>
        </Section>

        {/* ── Expertise ────────────────────────────────────────────────── */}
        <Section
          title="Uzmanlık Alanları"
          accent={ACCENT}
          action={
            <button
              type="button"
              onClick={() => updateHome('expertise', [...content.home.expertise, 'Yeni'])}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition hover:border-black/[0.14] dark:hover:border-white/[0.12] hover:text-slate-900 dark:hover:text-white"
            >
              <Plus className="h-3 w-3" />
              Alan Ekle
            </button>
          }
        >
          {content.home.expertise.length === 0 ? (
            <EmptyState
              label="Uzmanlık alanı yok"
              onAdd={() => updateHome('expertise', ['Yeni Uzmanlık'])}
              addLabel="Alan Ekle"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {content.home.expertise.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 transition"
                  style={{ borderColor: `${ACCENT}25`, background: `${ACCENT}08` }}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  <input
                    value={item}
                    onChange={(e) => updateExpertise(index, e.target.value)}
                    className="w-20 min-w-0 bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeExpertise(index)}
                    className="shrink-0 text-slate-400 dark:text-slate-700 transition hover:text-rose-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── Value props ──────────────────────────────────────────────── */}
        <Section
          title="Öne Çıkan Kartlar"
          accent={ACCENT}
          action={
            <button
              type="button"
              onClick={addValueProp}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.09] bg-black/[0.03] dark:border-white/[0.07] dark:bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition hover:border-black/[0.14] dark:hover:border-white/[0.12] hover:text-slate-900 dark:hover:text-white"
            >
              <Plus className="h-3 w-3" />
              Kart Ekle
            </button>
          }
        >
          {content.home.valueProps.length === 0 ? (
            <EmptyState label="Kart yok" onAdd={addValueProp} addLabel="Kart Ekle" />
          ) : (
            <div className="space-y-3">
              {content.home.valueProps.map((item, index) => (
                <ValuePropCard
                  key={`${item.title}-${index}`}
                  item={item}
                  onUpdate={(patch) => updateValueProp(index, patch)}
                  onMoveUp={() => moveValueProp(index, -1)}
                  onMoveDown={() => moveValueProp(index, 1)}
                  onDelete={() => removeValueProp(index)}
                />
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  accent,
  action,
  children,
}: Readonly<{
  title: string
  subtitle?: string
  accent: string
  action?: React.ReactNode
  children: React.ReactNode
}>) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
      style={{ background: 'var(--adm-surface)' }}
    >
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}50, transparent 55%)` }} />
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between gap-3">
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

// ── Value prop card ───────────────────────────────────────────────────────────

function ValuePropCard({
  item,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Readonly<{
  item: HomeValueProp
  onUpdate: (patch: Partial<HomeValueProp>) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}>) {
  return (
    <div
      className="group overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06] transition hover:border-black/[0.12] dark:hover:border-white/[0.09]"
      style={{ background: `linear-gradient(135deg, ${item.color}0a 0%, var(--adm-card) 50%)` }}
    >
      {/* Preview strip */}
      <div className="h-0.5 w-full" style={{ background: item.color }} />

      <div className="p-4">
        {/* Header row */}
        <div className="mb-4 flex items-center gap-3">
          {/* Icon preview */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{ background: item.glow, border: `1px solid ${item.color}30` }}
          >
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title || 'İsimsiz Kart'}</p>
            <p className="text-xs" style={{ color: item.color }}>{item.color}</p>
          </div>
          {/* Actions */}
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
            <button type="button" onClick={onMoveUp} className={iconBtnCls} title="Yukarı">
              <ChevronUp className="h-3 w-3" />
            </button>
            <button type="button" onClick={onMoveDown} className={iconBtnCls} title="Aşağı">
              <ChevronDown className="h-3 w-3" />
            </button>
            <button type="button" onClick={onDelete} className={dangerBtnCls} title="Sil">
              ×
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="İkon">
            <input
              value={item.icon}
              onChange={(e) => onUpdate({ icon: e.target.value })}
              className={inputCls}
              placeholder="⚡ ◈ ✦"
            />
          </Field>
          <Field label="Başlık">
            <input
              value={item.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Renk (hex)">
            <ColorInput value={item.color} onChange={(v) => onUpdate({ color: v })} />
          </Field>
          <Field label="Glow (rgba)" hint="örn: rgba(99,102,241,0.18)">
            <input
              value={item.glow}
              onChange={(e) => onUpdate({ glow: e.target.value })}
              className={inputCls}
              placeholder="rgba(99,102,241,0.18)"
            />
          </Field>
        </div>
        <Field label="Açıklama" className="mt-3">
          <textarea
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className={textareaCls}
            rows={4}
          />
        </Field>
      </div>
    </div>
  )
}
