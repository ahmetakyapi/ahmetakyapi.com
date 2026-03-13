'use client'

import { useMemo } from 'react'
import { Eye, FileText, Globe, Layers, MessageCircle } from 'lucide-react'
import type { DashboardData } from './admin-types'
import { formatDate } from './admin-types'

export default function AdminDashboard({ dashboard }: Readonly<{ dashboard: DashboardData }>) {
  const topPages = useMemo(
    () =>
      Object.entries(dashboard.analytics.pageViewsByPath)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8),
    [dashboard.analytics.pageViewsByPath],
  )

  const maxViews = topPages[0]?.[1] ?? 1
  const total = dashboard.analytics.totalPageViews

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-7 px-8 py-8">

        {/* ── Hero metrics ──────────────────────────────────────────────── */}
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500">Site istatistikleri ve içerik özeti</p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <HeroMetric
            Icon={Globe}
            label="Görüntülenme"
            value={dashboard.analytics.totalPageViews}
            color="#6366f1"
            glow="rgba(99,102,241,0.2)"
          />
          <HeroMetric
            Icon={Eye}
            label="Tekil Ziyaretçi"
            value={dashboard.analytics.uniqueVisitors}
            color="#a78bfa"
            glow="rgba(167,139,250,0.2)"
          />
          <HeroMetric
            Icon={Layers}
            label="Proje"
            value={dashboard.totals.projects}
            color="#22d3ee"
            glow="rgba(34,211,238,0.2)"
          />
          <HeroMetric
            Icon={FileText}
            label="Blog Yazısı"
            value={dashboard.totals.blogPosts}
            color="#34d399"
            glow="rgba(52,211,153,0.2)"
          />
        </div>

        {/* ── Analytics row ─────────────────────────────────────────────── */}
        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

          {/* Top pages */}
          <div
            className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
            style={{ background: 'var(--adm-surface)' }}
          >
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #6366f160, transparent 60%)' }} />
            <div className="p-6">
              <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">En Çok Ziyaret Edilen</h2>
              <p className="mb-5 text-xs text-slate-500">Tüm zamanlar</p>

              {topPages.length === 0 ? (
                <p className="text-sm text-slate-500">Henüz ziyaret verisi yok.</p>
              ) : (
                <div className="space-y-3">
                  {topPages.map(([path, views], i) => {
                    const pct = Math.round((views / maxViews) * 100)
                    const totalPct = total > 0 ? Math.round((views / total) * 100) : 0
                    return (
                      <div key={path}>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="shrink-0 text-[11px] tabular-nums text-slate-400 dark:text-slate-700">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">{path}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-[11px] text-slate-400 dark:text-slate-600">{totalPct}%</span>
                            <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
                              {views.toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.04]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: i === 0
                                ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                : 'linear-gradient(90deg, rgba(99,102,241,0.5), rgba(139,92,246,0.3))',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent visits timeline */}
          <div
            className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
            style={{ background: 'var(--adm-surface)' }}
          >
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #a78bfa60, transparent 60%)' }} />
            <div className="p-6">
              <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">Son Ziyaretler</h2>
              <p className="mb-5 text-xs text-slate-500">Son 10 istek</p>

              {dashboard.analytics.recentVisits.length === 0 ? (
                <p className="text-sm text-slate-500">Henüz ziyaret kaydı yok.</p>
              ) : (
                <div className="relative space-y-0">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-black/[0.06] dark:bg-white/[0.04]" />

                  {dashboard.analytics.recentVisits.slice(0, 10).map((visit, i) => (
                    <div key={`${visit.visitorId}-${visit.visitedAt}-${i}`} className="flex gap-3 py-2">
                      <div className="relative mt-[5px] flex shrink-0 items-start">
                        <div
                          className="h-[9px] w-[9px] rounded-full ring-2 ring-[var(--adm-dot-ring)]"
                          style={{ background: i === 0 ? '#6366f1' : 'rgba(99,102,241,0.4)' }}
                        />
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <p className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">{visit.path}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-700">
                          {formatDate(visit.visitedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Content overview ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Proje', value: dashboard.totals.projects, color: '#22d3ee' },
            { label: 'Blog Yazısı', value: dashboard.totals.blogPosts, color: '#34d399' },
            { label: 'Öne Çıkan Kart', value: dashboard.totals.valueProps, color: '#a78bfa' },
            { label: 'Uzmanlık Alanı', value: dashboard.totals.expertise, color: '#f59e0b' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-black/[0.07] dark:border-white/[0.05] px-4 py-4 text-center"
              style={{ background: `linear-gradient(135deg, ${item.color}08 0%, transparent 60%)` }}
            >
              <p
                className="text-3xl font-black tabular-nums tracking-tight"
                style={{ color: item.color }}
              >
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ── Comments ──────────────────────────────────────────────────── */}
        {(dashboard.comments.configured || dashboard.comments.items.length > 0) && (
          <div
            className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
            style={{ background: 'var(--adm-surface)' }}
          >
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #34d39960, transparent 60%)' }} />
            <div className="p-6">
              <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">Yorum İçgörüleri</h2>
              <p className="mb-5 text-xs text-slate-500">GitHub Discussions</p>

              {dashboard.comments.configured && dashboard.comments.items.length === 0 && (
                <p className="text-sm text-slate-500">Eşleşen yorum bulunamadı.</p>
              )}
              {dashboard.comments.configured && dashboard.comments.items.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {dashboard.comments.items.map((item) => (
                    <a
                      key={item.slug}
                      href={item.discussionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] p-4 transition hover:border-black/[0.12] dark:hover:border-white/[0.10] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03]">
                        <MessageCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.totalComments} yorum
                          {item.commenters.length > 0 && ` · ${item.commenters.slice(0, 2).join(', ')}`}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Hero metric card ──────────────────────────────────────────────────────────

function HeroMetric({
  Icon,
  label,
  value,
  color,
  glow,
}: Readonly<{
  Icon: typeof Globe
  label: string
  value: number
  color: string
  glow: string
}>) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06] p-5"
      style={{
        background: `linear-gradient(135deg, ${color}0c 0%, var(--adm-card) 60%)`,
      }}
    >
      <div
        className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: `${color}18`, boxShadow: `0 0 20px -4px ${glow}` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p
        className="text-3xl font-black tabular-nums tracking-tight"
        style={{ color }}
      >
        {value.toLocaleString('tr-TR')}
      </p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  )
}
