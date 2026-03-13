'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminShell from './AdminShell'
import AdminDashboard from './AdminDashboard'
import AdminHome from './AdminHome'
import AdminProjects from './AdminProjects'
import AdminBlog from './AdminBlog'
import { defaultSiteContent } from '@/lib/site-content'
import type { SiteContent } from '@/lib/site-content'
import type { AdminSection, DashboardData, SessionResponse, Toast } from './admin-types'
import { EMPTY_DASHBOARD } from './admin-types'

export default function AdminClient() {
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [savedContent, setSavedContent] = useState<SiteContent>(defaultSiteContent)
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)
  const [dashboard, setDashboard] = useState<DashboardData>(EMPTY_DASHBOARD)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [toasts, setToasts] = useState<Toast[]>([])

  const hasChanges = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => dismissToast(id), 3500)
  }, [dismissToast])

  useEffect(() => {
    void loadSession()
  }, [])

  useEffect(() => {
    if (session?.authenticated) void loadAdminData()
  }, [session?.authenticated])

  async function loadSession() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' })
      setSession((await res.json()) as SessionResponse)
    } finally {
      setLoading(false)
    }
  }

  async function loadAdminData() {
    const [contentRes, dashboardRes] = await Promise.all([
      fetch('/api/admin/content', { cache: 'no-store' }),
      fetch('/api/admin/dashboard', { cache: 'no-store' }),
    ])
    if (contentRes.ok) {
      const data = (await contentRes.json()) as SiteContent
      setSavedContent(data)
      setContent(data)
    }
    if (dashboardRes.ok) {
      setDashboard((await dashboardRes.json()) as DashboardData)
    }
  }

  async function handleLogin(password: string): Promise<string | null> {
    const res = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({ error: 'Giriş başarısız.' }))) as { error?: string }
      return payload.error ?? 'Giriş başarısız.'
    }
    await loadSession()
    return null
  }

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' })
    setSession((prev) => (prev ? { ...prev, authenticated: false } : prev))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({ error: 'Kaydetme başarısız.' }))) as { error?: string }
        throw new Error(payload.error ?? 'Kaydetme başarısız.')
      }
      const saved = (await res.json()) as SiteContent
      setSavedContent(saved)
      setContent(saved)
      showToast('İçerik başarıyla kaydedildi.')
      void loadAdminData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Kaydetme başarısız.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06090f]">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  // ── Login screen ───────────────────────────────────────────────────────────

  if (!session.authenticated) {
    return <AdminLogin session={session} onLogin={handleLogin} />
  }

  // ── Authenticated shell ────────────────────────────────────────────────────

  const sectionNode = (() => {
    switch (section) {
      case 'dashboard':
        return <AdminDashboard dashboard={dashboard} />
      case 'home':
        return <AdminHome content={content} setContent={setContent} />
      case 'projects':
        return <AdminProjects content={content} setContent={setContent} />
      case 'blog':
        return <AdminBlog content={content} setContent={setContent} />
    }
  })()

  return (
    <AdminShell
      section={section}
      setSection={setSection}
      saving={saving}
      hasChanges={hasChanges}
      onSave={handleSave}
      onLogout={handleLogout}
      toasts={toasts}
      onDismissToast={dismissToast}
    >
      {sectionNode}
    </AdminShell>
  )
}
