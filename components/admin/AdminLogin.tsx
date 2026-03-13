'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'
import type { SessionResponse } from './admin-types'

export default function AdminLogin({
  session,
  onLogin,
}: {
  session: SessionResponse
  onLogin: (password: string) => Promise<string | null>
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const err = await onLogin(password)
      if (err) setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06090f] p-6">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[360px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/[0.08] bg-white/[0.04] shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] backdrop-blur">
            <Shield className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Paneli</h1>
          <p className="mt-1.5 text-sm text-slate-400">Devam etmek için giriş yapın</p>
        </div>

        {/* Alerts */}
        {!session.configured && (
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-300">
            <span className="font-mono font-semibold">ADMIN_PASSWORD</span> ve{' '}
            <span className="font-mono font-semibold">ADMIN_SESSION_SECRET</span> tanımlanmalı.
          </div>
        )}

        {session.defaultPasswordActive && (
          <div className="mb-4 rounded-2xl border border-sky-500/30 bg-sky-500/[0.08] px-4 py-3 text-sm text-sky-300">
            Geliştirme ortamı — varsayılan şifre:{' '}
            <span className="font-mono font-semibold">admin1234</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin şifresi"
              autoFocus
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60 focus:bg-white/[0.07]"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/[0.08] px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-4px_rgba(99,102,241,0.5)] transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <Shield className="h-4 w-4" />
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
