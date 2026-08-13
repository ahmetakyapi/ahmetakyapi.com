'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, Layers, BookOpen, Github, Mail, Sun, Moon, ExternalLink, ArrowRight, MousePointer2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { CURSOR_PREFERENCE_EVENT, isCustomCursorEnabled, setCustomCursorEnabled } from '@/lib/cursor-preference'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  category: string
  action: () => void
  shortcut?: string
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [cursorOn, setCursorOn] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  useEffect(() => {
    setCursorOn(isCustomCursorEnabled())
  }, [])

  const commands: Command[] = useMemo(() => {
    const go = (href: string) => () => {
      router.push(href)
      close()
    }

    return [
      {
        id: 'nav-home',
        label: 'Ana Sayfa',
        description: 'Profil ve öne çıkanlar',
        icon: <Home className="w-4 h-4" />,
        category: 'Gezinme',
        action: go('/'),
        shortcut: 'G H',
      },
      {
        id: 'nav-projects',
        label: 'Projeler',
        description: 'Geliştirdiğim uygulamalar',
        icon: <Layers className="w-4 h-4" />,
        category: 'Gezinme',
        action: go('/projeler'),
        shortcut: 'G P',
      },
      {
        id: 'nav-blog',
        label: 'Blog',
        description: 'Teknik yazılar',
        icon: <BookOpen className="w-4 h-4" />,
        category: 'Gezinme',
        action: go('/blog'),
        shortcut: 'G B',
      },
      {
        id: 'social-github',
        label: 'GitHub',
        description: 'github.com/ahmetakyapi',
        icon: <Github className="w-4 h-4" />,
        category: 'Bağlantılar',
        action: () => {
          window.open('https://github.com/ahmetakyapi', '_blank', 'noopener,noreferrer')
          close()
        },
      },
      {
        id: 'social-mail',
        label: 'E-posta Gönder',
        description: 'ahmet@ahmetakyapi.com',
        icon: <Mail className="w-4 h-4" />,
        category: 'Bağlantılar',
        action: () => {
          window.location.href = 'mailto:ahmet@ahmetakyapi.com'
          close()
        },
      },
      {
        id: 'feed-rss',
        label: 'RSS Beslemesi',
        description: 'Yeni yazılardan haberdar ol',
        icon: <ExternalLink className="w-4 h-4" />,
        category: 'Bağlantılar',
        action: () => {
          window.open('/rss.xml', '_blank', 'noopener,noreferrer')
          close()
        },
      },
      {
        id: 'theme-toggle',
        label: resolvedTheme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç',
        description: 'Tema değiştir',
        icon: resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        category: 'Ayarlar',
        action: () => {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          close()
        },
      },
      {
        id: 'cursor-toggle',
        label: cursorOn ? 'Özel İmleci Kapat' : 'Özel İmleci Aç',
        description: 'Sistem imlecine dön',
        icon: <MousePointer2 className="w-4 h-4" />,
        category: 'Ayarlar',
        action: () => {
          const next = !cursorOn
          setCustomCursorEnabled(next)
          setCursorOn(next)
          close()
        },
      },
    ]
  }, [resolvedTheme, setTheme, close, router, cursorOn])

  const filtered = useMemo(() => {
    if (!query) return commands
    const q = query.toLocaleLowerCase('tr')
    return commands.filter(
      (c) =>
        c.label.toLocaleLowerCase('tr').includes(q) ||
        c.description?.toLocaleLowerCase('tr').includes(q) ||
        c.category.toLocaleLowerCase('tr').includes(q),
    )
  }, [commands, query])

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
        ;(acc[cmd.category] ||= []).push(cmd)
        return acc
      }, {}),
    [filtered],
  )

  useEffect(() => {
    setSelected(0)
  }, [query])

  /* Açılış: ⌘K, başlıktaki düğme (custom event) ve g+h/g+p/g+b kısayolları. */
  useEffect(() => {
    let lastKey = ''
    let lastKeyAt = 0

    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }

      if (open) {
        if (e.key === 'Escape') {
          e.preventDefault()
          close()
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelected((v) => Math.min(v + 1, filtered.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelected((v) => Math.max(v - 1, 0))
        }
        if (e.key === 'Enter' && filtered[selected]) {
          e.preventDefault()
          filtered[selected].action()
        }
        return
      }

      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // İki tuşluk dizi: 800 ms içinde tamamlanmazsa sıfırlanır.
      const now = Date.now()
      if (lastKey === 'g' && now - lastKeyAt < 800) {
        const map: Record<string, string> = { h: '/', p: '/projeler', b: '/blog' }
        const href = map[e.key.toLowerCase()]
        if (href) {
          e.preventDefault()
          router.push(href)
        }
        lastKey = ''
        return
      }
      lastKey = e.key.toLowerCase() === 'g' ? 'g' : ''
      lastKeyAt = now
    }

    function onOpenRequest() {
      setOpen(true)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('command-palette:open', onOpenRequest)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('command-palette:open', onOpenRequest)
    }
  }, [open, filtered, selected, close, router])

  /* Odak yönetimi: açılışta input'a git, kapanışta geldiğin yere dön. */
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
    restoreFocusRef.current?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function onTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onTab)
    return () => window.removeEventListener('keydown', onTab)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Komut paleti"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[18%] left-1/2 -translate-x-1/2 z-[9991] w-full max-w-lg"
          >
            <div className="mx-4 overflow-hidden rounded-2xl border border-slate-300 bg-white/95 shadow-2xl shadow-black/40 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0e1117]/95">
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-white/[0.08]">
                <Search className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Komut veya sayfa ara…"
                  aria-label="Komut ara"
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                />
                <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[340px] overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Sonuç bulunamadı</p>
                ) : (
                  Object.entries(grouped).map(([category, cmds]) => (
                    <div key={category}>
                      <p className="px-4 pt-3 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {category}
                      </p>
                      {cmds.map((cmd) => {
                        const idx = filtered.indexOf(cmd)
                        const active = selected === idx
                        return (
                          <button
                            key={cmd.id}
                            type="button"
                            onClick={cmd.action}
                            onMouseEnter={() => setSelected(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              active
                                ? 'bg-indigo-500/15 text-slate-900 dark:text-white'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                          >
                            <span
                              className={`flex-shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
                              aria-hidden="true"
                            >
                              {cmd.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">{cmd.label}</span>
                              {cmd.description && (
                                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-500">
                                  {cmd.description}
                                </span>
                              )}
                            </span>
                            {cmd.shortcut && (
                              <span className="flex flex-shrink-0 gap-1">
                                {cmd.shortcut.split(' ').map((k) => (
                                  <kbd
                                    key={k}
                                    className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                                  >
                                    {k}
                                  </kbd>
                                ))}
                              </span>
                            )}
                            {active && (
                              <ArrowRight
                                className="h-3.5 w-3.5 flex-shrink-0 text-indigo-600 dark:text-indigo-400"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2.5 font-mono text-[10px] text-slate-400 dark:border-white/[0.06] dark:text-slate-600">
                <span>↑↓ seç</span>
                <span>↵ aç</span>
                <span>esc kapat</span>
                <span className="ml-auto">⌘K</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
