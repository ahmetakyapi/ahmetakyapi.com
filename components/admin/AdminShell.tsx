'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  ExternalLink,
  FileText,
  Home,
  Layers,
  LogOut,
  Moon,
  Save,
  Sun,
  X,
} from 'lucide-react'
import type { AdminSection, Toast } from './admin-types'

// ── Section metadata ──────────────────────────────────────────────────────────

const SECTIONS: Array<{
  key: AdminSection
  label: string
  Icon: typeof Home
  color: string
  glow: string
}> = [
  { key: 'dashboard', label: 'Dashboard',  Icon: BarChart3, color: '#6366f1', glow: 'rgba(99,102,241,0.15)'  },
  { key: 'home',      label: 'Ana Sayfa',  Icon: Home,      color: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
  { key: 'projects',  label: 'Projeler',   Icon: Layers,    color: '#22d3ee', glow: 'rgba(34,211,238,0.15)'  },
  { key: 'blog',      label: 'Blog',       Icon: FileText,  color: '#34d399', glow: 'rgba(52,211,153,0.15)'  },
]

export function getSectionMeta(section: AdminSection) {
  return SECTIONS.find((s) => s.key === section) ?? SECTIONS[0]
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function AdminShell({
  section,
  setSection,
  saving,
  hasChanges,
  onSave,
  onLogout,
  toasts,
  onDismissToast,
  children,
}: Readonly<{
  section: AdminSection
  setSection: (s: AdminSection) => void
  saving: boolean
  hasChanges: boolean
  onSave: () => void
  onLogout: () => void
  toasts: Toast[]
  onDismissToast: (id: string) => void
  children: React.ReactNode
}>) {
  const active = getSectionMeta(section)
  const { theme, setTheme } = useTheme()
  const isDark = theme !== 'light'

  return (
    <div
      className="flex h-screen overflow-hidden text-slate-900 dark:text-white"
      style={{ background: 'var(--adm-bg)' }}
    >
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="relative z-20 flex w-[200px] shrink-0 flex-col border-r border-black/[0.08] dark:border-white/[0.05]"
        style={{ background: 'var(--adm-sidebar)', backdropFilter: 'blur(20px)' }}
      >
        {/* Brand */}
        <div className="flex h-[54px] items-center gap-3 border-b border-black/[0.08] dark:border-white/[0.05] px-4">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 16px -2px rgba(99,102,241,0.5)',
            }}
          >
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-white/90">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-2.5 pt-3">
          {SECTIONS.map(({ key, label, Icon, color }) => {
            const isActive = section === key
            const activeTextColor = isDark ? '#f1f5f9' : '#1e293b'
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
                style={
                  isActive
                    ? { background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`, boxShadow: `inset 0 0 0 1px ${color}30` }
                    : {}
                }
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
                    style={{ background: color }}
                  />
                )}
                <Icon
                  className="h-4 w-4 shrink-0 transition"
                  style={{ color: isActive ? color : 'var(--adm-nav-inactive)' }}
                />
                <span
                  className="font-medium transition"
                  style={{ color: isActive ? activeTextColor : 'var(--adm-nav-inactive)' }}
                >
                  {label}
                </span>
                {/* Glow on hover */}
                {!isActive && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                    style={{ background: 'var(--adm-toggle-off)' }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom decoration */}
        <div className="border-t border-black/[0.06] dark:border-white/[0.04] p-2.5">
          <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.04] bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
              Portfolio Admin
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-700">v2.0</p>
          </div>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <header
          className="flex h-[54px] shrink-0 items-center justify-between border-b border-black/[0.08] dark:border-white/[0.05] px-6"
          style={{ background: 'var(--adm-topbar)', backdropFilter: 'blur(20px)' }}
        >
          {/* Section identity */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-xl"
              style={{ background: `${active.color}18`, boxShadow: `0 0 12px -2px ${active.glow}` }}
            >
              <active.Icon className="h-3.5 w-3.5" style={{ color: active.color }} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{active.label}</span>

            {/* Unsaved indicator */}
            {hasChanges && (
              <div className="flex items-center gap-1.5">
                <div className="h-px w-4 bg-black/10 dark:bg-white/10" />
                <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-2 py-0.5">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-300/80">Kaydedilmedi</span>
                </div>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-black/[0.09] bg-black/[0.02] dark:border-white/[0.06] dark:bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-black/[0.14] dark:hover:border-white/[0.10] hover:text-slate-700 dark:hover:text-slate-300"
            >
              <ExternalLink className="h-3 w-3" />
              Siteyi Gör
            </Link>

            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center justify-center h-[30px] w-[30px] rounded-lg border border-black/[0.09] bg-black/[0.02] dark:border-white/[0.06] dark:bg-white/[0.02] text-slate-500 transition hover:border-black/[0.14] dark:hover:border-white/[0.10] hover:text-slate-700 dark:hover:text-slate-300"
              title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-lg border border-black/[0.09] bg-black/[0.02] dark:border-white/[0.06] dark:bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-rose-500/30 hover:bg-rose-500/[0.05] hover:text-rose-500 dark:hover:border-rose-500/20 dark:hover:text-rose-400"
            >
              <LogOut className="h-3 w-3" />
              Çıkış
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition disabled:opacity-40"
              style={{
                background: hasChanges
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'rgba(128,128,128,0.15)',
                boxShadow: hasChanges ? '0 0 20px -4px rgba(99,102,241,0.6)' : 'none',
              }}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </header>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* ── Toasts ────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'border-emerald-500/25 bg-[#031a0f]/90 text-emerald-200'
                : 'border-rose-500/25 bg-[#1a030a]/90 text-rose-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            )}
            <span className="text-sm">{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismissToast(toast.id)}
              className="ml-1 text-current opacity-40 transition hover:opacity-80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
