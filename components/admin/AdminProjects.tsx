'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Star, Trash2 } from 'lucide-react'
import type { Project } from '@/lib/data'
import type { SiteContent } from '@/lib/site-content'
import { moveItem } from './admin-types'
import {
  ColorInput,
  dangerBtnCls,
  EmptyState,
  Field,
  iconBtnCls,
  inputCls,
  selectCls,
  textareaCls,
  Toggle,
} from './admin-ui'

const ACCENT = '#22d3ee'

function createProject(projects: Project[]): Project {
  const nextId = projects.reduce((max, p) => Math.max(max, p.id), 0) + 1
  return {
    id: nextId,
    category: 'Yeni Kategori',
    title: 'Yeni Proje',
    description: 'Proje açıklamasını girin.',
    tags: ['Next.js'],
    link: 'https://example.com',
    github: '',
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    badge: 'Canlı',
    featured: false,
  }
}

export default function AdminProjects({
  content,
  setContent,
}: Readonly<{
  content: SiteContent
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>
}>) {
  function updateProject(index: number, patch: Partial<Project>) {
    setContent((c) => ({
      ...c,
      projects: c.projects.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }))
  }

  function addProject() {
    setContent((c) => ({ ...c, projects: [...c.projects, createProject(c.projects)] }))
  }

  function removeProject(index: number) {
    setContent((c) => ({ ...c, projects: c.projects.filter((_, i) => i !== index) }))
  }

  function moveProject(index: number, dir: -1 | 1) {
    setContent((c) => ({ ...c, projects: moveItem(c.projects, index, dir) }))
  }

  const projects = content.projects

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-8 py-8">

        {/* Header */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projeler</h1>
            <p className="mt-1 text-sm text-slate-500">
              Kart içerikleri, sıralama ve görsel özellikler
            </p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{
              background: 'linear-gradient(135deg, #22d3ee20, #0ea5e920)',
              border: '1px solid rgba(34,211,238,0.25)',
              boxShadow: '0 0 20px -6px rgba(34,211,238,0.3)',
            }}
          >
            <Plus className="h-4 w-4" style={{ color: ACCENT }} />
            <span style={{ color: ACCENT }}>Proje Ekle</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            label="Henüz proje yok"
            description="Portföy projesini buraya ekleyin"
            onAdd={addProject}
            addLabel="İlk Projeyi Ekle"
          />
        ) : (
          <div className="space-y-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={(patch) => updateProject(index, patch)}
                onMoveUp={() => moveProject(index, -1)}
                onMoveDown={() => moveProject(index, 1)}
                onDelete={() => removeProject(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Readonly<{
  project: Project
  onUpdate: (patch: Partial<Project>) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}>) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="group overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06] transition hover:border-black/[0.12] dark:hover:border-white/[0.09]"
      style={{
        background: `linear-gradient(135deg, ${project.accent}08 0%, var(--adm-card) 50%)`,
      }}
    >
      {/* Gradient preview strip */}
      <div className="h-[3px] w-full" style={{ background: project.gradient }} />

      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Accent dot */}
        <div
          className="h-10 w-1 shrink-0 rounded-full"
          style={{ background: project.accent }}
        />

        {/* Main info */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{project.title}</p>
              {project.featured && (
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-600">{project.category}</span>
              <span className="text-slate-400 dark:text-slate-700">·</span>
              <span
                className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                style={{
                  background: project.badge === 'Canlı' ? 'rgba(34,211,238,0.12)' : 'rgba(139,92,246,0.12)',
                  color: project.badge === 'Canlı' ? '#22d3ee' : '#a78bfa',
                }}
              >
                {project.badge}
              </span>
            </div>
          </div>

          {/* Tags preview */}
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-500"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-700">+{project.tags.length - 3}</span>
            )}
          </div>
        </button>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
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

      {/* Expanded editor */}
      {open && (
        <div className="border-t border-black/[0.07] dark:border-white/[0.05] px-5 pb-5 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Başlık">
              <input value={project.title} onChange={(e) => onUpdate({ title: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Kategori">
              <input value={project.category} onChange={(e) => onUpdate({ category: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Canlı Link">
              <input value={project.link} onChange={(e) => onUpdate({ link: e.target.value })} className={inputCls} placeholder="https://example.com" />
            </Field>
            <Field label="GitHub">
              <input value={project.github ?? ''} onChange={(e) => onUpdate({ github: e.target.value })} className={inputCls} placeholder="https://github.com/..." />
            </Field>
            <Field label="Accent Rengi">
              <ColorInput value={project.accent} onChange={(v) => onUpdate({ accent: v })} />
            </Field>
            <Field label="Rozet">
              <select value={project.badge} onChange={(e) => onUpdate({ badge: e.target.value as Project['badge'] })} className={selectCls}>
                <option value="Canlı">Canlı</option>
                <option value="GitHub">GitHub</option>
              </select>
            </Field>
          </div>

          <Field label="Etiketler" hint="virgülle ayır" className="mt-4">
            <input
              value={project.tags.join(', ')}
              onChange={(e) => onUpdate({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              className={inputCls}
              placeholder="Next.js, TypeScript, Tailwind, ..."
            />
          </Field>

          <Field label="Gradient" hint="CSS gradient string" className="mt-4">
            <input
              value={project.gradient}
              onChange={(e) => onUpdate({ gradient: e.target.value })}
              className={inputCls}
              placeholder="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
            />
          </Field>
          {/* Gradient preview */}
          <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: project.gradient }} />

          <Field label="Açıklama" className="mt-4">
            <textarea value={project.description} onChange={(e) => onUpdate({ description: e.target.value })} className={textareaCls} rows={4} />
          </Field>

          <div className="mt-4">
            <Toggle
              checked={project.featured}
              onChange={(v) => onUpdate({ featured: v })}
              label="Öne çıkan proje"
              accent={ACCENT}
            />
          </div>
        </div>
      )}
    </div>
  )
}
