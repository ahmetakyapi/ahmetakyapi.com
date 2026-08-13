import Image from 'next/image'
import type { Project } from '@/lib/data'

/**
 * Proje kartındaki görsel.
 *
 * Önceden CSS ile çizilmiş soyut maketlerdi — renkli çubuklar, boş kutular.
 * Projeyi anlatmıyorlardı ve portfolyoda "bunu yaptım" demenin en zayıf
 * yolu buydu. Artık gerçek ekran görüntüsü: 1280×800, 2x, webp.
 *
 * Görüntü yoksa (yalnızca depo olan projeler) tarayıcı çerçevesi adresle
 * birlikte tek başına duruyor — sahte içerik uydurmuyoruz.
 */

type Size = 'sm' | 'lg'

export default function ProjectPreview({
  project,
  size = 'sm',
  className = '',
  priority = false,
}: {
  project: Project
  size?: Size
  className?: string
  priority?: boolean
}) {
  const host = safeHost(project.link)

  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-slate-300/80 bg-sunken shadow-sm dark:border-white/[0.08] ${className}`}
    >
      {/* Tarayıcı çubuğu — görüntüye bağlam ve çerçeve veriyor. */}
      <div
        className="flex items-center gap-1.5 border-b border-slate-300/70 bg-slate-100 px-2.5 py-1.5 dark:border-white/[0.07] dark:bg-white/[0.05]"
        aria-hidden="true"
      >
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        <span className="ml-1.5 truncate rounded bg-white/70 px-2 py-0.5 font-mono text-[9px] text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
          {host}
        </span>
      </div>

      {project.shot ? (
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={`/projects/${project.shot}.webp`}
            alt={`${project.title} arayüzünden görüntü`}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            /* Öne çıkan kart yarım ekran, ızgara kartları üçte bir. */
            sizes={size === 'lg' ? '(max-width: 1024px) 90vw, 560px' : '(max-width: 640px) 90vw, 380px'}
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[16/10] w-full items-center justify-center"
          style={{ background: `linear-gradient(145deg, ${project.accent}18, ${project.accent}06)` }}
          aria-hidden="true"
        >
          <span
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: project.accent }}
          >
            {project.badge === 'GitHub' ? 'depo' : project.title}
          </span>
        </div>
      )}
    </figure>
  )
}

function safeHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}
