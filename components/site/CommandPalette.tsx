'use client'

import { ArrowRight, ArrowUp, BookOpen, FileText, Folder, Home, Layers, Mail, Moon, Rss, Search, Sun, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { BrandIcon } from '@/components/site/BrandIcon'
import { EMAIL, SOCIAL_LINKS } from '@/lib/nav'
import { foldTr, matchesTokens, queryTokens } from '@/lib/search'
import { readTheme, subscribeTheme, switchTheme } from '@/lib/theme-client'

/**
 * ⌘K komut paleti: AÇIK hâlin kendisi. Açma/kapama, kısayollar ve tembel
 * yükleme CommandPaletteLauncher.tsx'te; bu modül ilk açılışta (ya da boşta
 * kalan ilk anda) indirilir, ilk yükün dışında.
 *
 *   <CommandPalette projects={…} posts={…} onClose={() => setOpen(false)} />
 *
 * Liste SUNUCUDAN, yalnızca başlık ve adres olarak gelir: istemci paketine
 * proje açıklaması ya da yazı gövdesi girmez (lib/data barrel'ı bir kez
 * dokuz yazının tam metnini, 124 KB, istemciye taşımıştı).
 *
 * Odak: açılınca arama kutusuna, kapanınca (bileşen sökülünce) geldiği
 * yere döner; Tab paletten dışarı kaçmaz.
 *
 * Arama Türkçe harflere duyarsız ve kelime kelime (lib/search.ts):
 * "acilis" Açılış Zili'yi, "oyun drizzle" iki kelimeyi birden taşıyan
 * satırı bulur. Satırın künyesi (kategori, tarih) ve görünmeyen anahtar
 * kelimeler (tech stack) de aranır.
 *
 * Dokunmatikte klavye ipuçları (Esc, ↑↓) yok; yerine görünür bir Kapat
 * düğmesi var (telefonda Esc tuşu yok, örtüye dokunmak tek yoldu).
 */
export type PaletteLink = {
  title: string
  href: string
  /** Satırın altındaki kısa künye: proje kategorisi, yazı tarihi ve etiketi. */
  meta?: string
  /** Görünmez, yalnız aranır (projenin tech stack'i). */
  keywords?: string
}

type Command = {
  id: string
  label: string
  description?: string
  icon: ReactNode
  category: string
  action: () => void
  shortcut?: string
  keywords?: string
}

const ICON = 'size-4'

export default function CommandPalette({
  projects,
  posts,
  onClose,
}: {
  projects: PaletteLink[]
  posts: PaletteLink[]
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'dark' as const)

  const close = useCallback(() => onClose(), [onClose])

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      router.push(href)
      close()
    }
    const openExternal = (href: string) => () => {
      window.open(href, '_blank', 'noopener,noreferrer')
      close()
    }

    return [
      { id: 'nav-home', label: 'Ana Sayfa', icon: <Home className={ICON} />, category: 'Gezinme', action: go('/'), shortcut: 'G H' },
      { id: 'nav-projects', label: 'Projeler', icon: <Layers className={ICON} />, category: 'Gezinme', action: go('/projeler'), shortcut: 'G P' },
      { id: 'nav-blog', label: 'Blog', icon: <BookOpen className={ICON} />, category: 'Gezinme', action: go('/blog'), shortcut: 'G B' },
      {
        id: 'nav-top',
        label: 'Başa Dön',
        icon: <ArrowUp className={ICON} />,
        category: 'Gezinme',
        action: () => {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
          close()
        },
      },
      ...projects.map((item) => ({
        id: `project-${item.title}`,
        label: item.title,
        description: item.meta,
        keywords: item.keywords,
        icon: <Folder className={ICON} />,
        category: 'Projeler',
        action: go(item.href),
      })),
      ...posts.map((item) => ({
        id: `post-${item.title}`,
        label: item.title,
        description: item.meta,
        keywords: item.keywords,
        icon: <FileText className={ICON} />,
        category: 'Yazılar',
        action: go(item.href),
      })),
      ...SOCIAL_LINKS.map((link) => ({
        id: `social-${link.id}`,
        label: link.label,
        description: link.handle,
        icon: <BrandIcon name={link.id} />,
        category: 'Bağlantılar',
        action: openExternal(link.href),
      })),
      {
        id: 'social-mail',
        label: 'E-posta Gönder',
        description: EMAIL,
        icon: <Mail className={ICON} />,
        category: 'Bağlantılar',
        action: () => {
          window.location.href = `mailto:${EMAIL}`
          close()
        },
      },
      {
        id: 'feed-rss',
        label: 'RSS Beslemesi',
        description: 'Yeni yazılardan haberdar ol',
        icon: <Rss className={ICON} />,
        category: 'Bağlantılar',
        action: openExternal('/rss.xml'),
      },
      {
        id: 'theme-toggle',
        label: theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç',
        icon: theme === 'dark' ? <Sun className={ICON} /> : <Moon className={ICON} />,
        category: 'Ayarlar',
        action: () => {
          switchTheme(readTheme() === 'dark' ? 'light' : 'dark')
          close()
        },
      },
    ]
  }, [projects, posts, theme, router, close])

  /* Her satırın aranan metni bir kez katlanır, tuş başına değil. */
  const haystacks = useMemo(
    () => commands.map((c) => foldTr([c.label, c.description, c.category, c.keywords].filter(Boolean).join(' '))),
    [commands],
  )

  const filtered = useMemo(() => {
    const tokens = queryTokens(query)
    if (tokens.length === 0) return commands
    return commands.filter((_, i) => matchesTokens(haystacks[i] ?? '', tokens))
  }, [commands, haystacks, query])

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
        ;(acc[cmd.category] ||= []).push(cmd)
        return acc
      }, {}),
    [filtered],
  )

  /* Klavyeyle seçilen satır görünür alana kaysın. */
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>(`[data-index="${selected}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((v) => Math.min(v + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected((v) => Math.max(v - 1, 0))
      } else if (e.key === 'Enter' && filtered[selected]) {
        e.preventDefault()
        filtered[selected].action()
      } else if (e.key === 'Tab') {
        /* Tek odaklanabilir öğe arama kutusu; satırlar oklarla seçilir
           (aria-activedescendant). Tab paletten dışarı kaçmasın. */
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filtered, selected, close])

  /* Odak: açılışta arama kutusuna, sökülünce geldiği yere. Kaydırma kilidi. */
  useEffect(() => {
    const restore = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      restore?.focus?.()
    }
  }, [])


  return (
    <>
      <div className="overlay-in fixed inset-0 z-[90] bg-scrim" onClick={close} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Komut paleti"
        className="panel-in fixed left-1/2 top-[14vh] z-[91] w-full max-w-lg -translate-x-1/2 px-4"
      >
        <div className="overflow-hidden rounded-card border border-line-strong bg-surface-solid shadow-modal">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelected(0)
              }}
              placeholder="Sayfa, proje ya da yazı ara"
              aria-label="Komut ara"
              role="combobox"
              aria-expanded="true"
              aria-controls="komut-listesi"
              aria-activedescendant={filtered[selected] ? `komut-${selected}` : undefined}
              className="min-w-0 flex-1 bg-transparent text-sm text-strong outline-none placeholder:text-muted"
            />
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-micro text-muted pointer-coarse:hidden">
              Esc
            </kbd>
            <button
              type="button"
              onClick={close}
              aria-label="Kapat"
              className="-mr-2 hidden size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:text-strong pointer-coarse:inline-grid"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div id="komut-listesi" role="listbox" aria-label="Komutlar" className="max-h-[min(360px,55vh)] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted" role="status">
                Sonuç bulunamadı. Başka bir kelimeyle dene.
              </p>
            ) : (
              Object.entries(grouped).map(([category, cmds]) => (
                <div key={category} role="group" aria-label={category}>
                  <p className="px-4 pb-1.5 pt-3 text-small font-semibold text-muted">{category}</p>
                  {cmds.map((cmd) => {
                    const idx = filtered.indexOf(cmd)
                    const active = selected === idx
                    return (
                      <button
                        key={cmd.id}
                        id={`komut-${idx}`}
                        type="button"
                        role="option"
                        aria-selected={active}
                        data-index={idx}
                        tabIndex={-1}
                        onClick={cmd.action}
                        onMouseMove={() => setSelected(idx)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          active ? 'bg-primary-wash text-strong' : 'text-body'
                        }`}
                      >
                        <span className={active ? 'shrink-0 text-primary-ink' : 'shrink-0 text-muted'} aria-hidden="true">
                          {cmd.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{cmd.label}</span>
                          {cmd.description ? (
                            <span className="mt-0.5 block truncate text-small text-muted">{cmd.description}</span>
                          ) : null}
                        </span>
                        {cmd.shortcut ? (
                          <span className="flex shrink-0 gap-1">
                            {cmd.shortcut.split(' ').map((k) => (
                              <kbd key={k} className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-micro text-muted">
                                {k}
                              </kbd>
                            ))}
                          </span>
                        ) : null}
                        {active ? <ArrowRight className="size-3.5 shrink-0 text-primary-ink" aria-hidden="true" /> : null}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-micro font-medium text-muted pointer-coarse:hidden">
            <span>↑↓ Seç</span>
            <span>↵ Aç</span>
            <span>Esc Kapat</span>
            <span className="ml-auto">⌘K</span>
          </div>
        </div>
      </div>
    </>
  )
}
