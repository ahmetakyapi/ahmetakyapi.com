'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, Layers, BookOpen, Github, Mail, Sun, Moon, ExternalLink, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  category: string
  action: () => void
  shortcut?: string
}

interface Props {
  onNavigate: (tab: string) => void
}

export default function CommandPalette({ onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme, setTheme } = useTheme()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  const commands: Command[] = [
    {
      id: 'nav-home',
      label: 'Ana Sayfa',
      description: 'Profil ve hakkımda',
      icon: <Home className="w-4 h-4" />,
      category: 'Navigasyon',
      action: () => { onNavigate('home'); close() },
      shortcut: 'G H',
    },
    {
      id: 'nav-projects',
      label: 'Projeler',
      description: 'Geliştirdiğim uygulamalar',
      icon: <Layers className="w-4 h-4" />,
      category: 'Navigasyon',
      action: () => { onNavigate('projects'); close() },
      shortcut: 'G P',
    },
    {
      id: 'nav-blog',
      label: 'Blog',
      description: 'Teknik yazılar',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Navigasyon',
      action: () => { onNavigate('blog'); close() },
      shortcut: 'G B',
    },
    {
      id: 'social-github',
      label: 'GitHub',
      description: 'github.com/ahmetakyapi',
      icon: <Github className="w-4 h-4" />,
      category: 'Sosyal',
      action: () => { window.open('https://github.com/ahmetakyapi', '_blank'); close() },
    },
    {
      id: 'social-mail',
      label: 'E-posta Gönder',
      description: 'ahmet@ahmetakyapi.com',
      icon: <Mail className="w-4 h-4" />,
      category: 'Sosyal',
      action: () => { window.location.href = 'mailto:ahmet@ahmetakyapi.com'; close() },
    },
    {
      id: 'social-site',
      label: 'ahmetakyapi.com',
      description: 'Bu site',
      icon: <ExternalLink className="w-4 h-4" />,
      category: 'Sosyal',
      action: () => { window.open('https://ahmetakyapi.com', '_blank'); close() },
    },
    {
      id: 'theme-toggle',
      label: resolvedTheme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç',
      description: 'Tema değiştir',
      icon: resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      category: 'Ayarlar',
      action: () => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); close() },
      shortcut: '⌥ T',
    },
  ]

  const filtered = query
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands

  /* Group by category */
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  /* Flat list for keyboard nav */
  const flat = filtered

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (!open) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(v => Math.min(v + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(v => Math.max(v - 1, 0)) }
      if (e.key === 'Enter' && flat[selected]) { flat[selected].action() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, flat, selected, close])

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Focus trap: keep Tab cycling within the panel
  useEffect(() => {
    if (!open) return

    function onTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
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
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
              onClick={close}
            />

            {/* Panel */}
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
              <div className="mx-4 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 dark:border-white/10 border-gray-200 bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-2xl">

                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-white/8">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Komut veya sayfa ara..."
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                  />
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[340px] overflow-y-auto py-2">
                  {Object.keys(grouped).length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-400">Sonuç bulunamadı</p>
                  ) : (
                    Object.entries(grouped).map(([category, cmds]) => {
                      return (
                        <div key={category}>
                          <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest font-mono">
                            {category}
                          </p>
                          {cmds.map((cmd) => {
                            const globalIdx = flat.indexOf(cmd)
                            return (
                              <button
                                key={cmd.id}
                                onClick={cmd.action}
                                onMouseEnter={() => setSelected(globalIdx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  selected === globalIdx
                                    ? 'bg-indigo-500/15 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                <span className={`flex-shrink-0 ${selected === globalIdx ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                  {cmd.icon}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block text-sm font-medium">{cmd.label}</span>
                                  {cmd.description && (
                                    <span className="block text-xs text-gray-400 dark:text-gray-600 mt-0.5">{cmd.description}</span>
                                  )}
                                </span>
                                {cmd.shortcut && (
                                  <span className="flex-shrink-0 flex gap-1">
                                    {cmd.shortcut.split(' ').map((k, i) => (
                                      <kbd key={i} className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded">
                                        {k}
                                      </kbd>
                                    ))}
                                  </span>
                                )}
                                {selected === globalIdx && (
                                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/5 flex items-center gap-4 text-[10px] text-gray-400 dark:text-gray-700 font-mono">
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
    </>
  )
}
