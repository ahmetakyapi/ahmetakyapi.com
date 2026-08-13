import type { Project } from '@/lib/data'

/**
 * Kart içindeki mini maket.
 *
 * Önceden bu çizimler sıradaki indekse bağlıydı (`i === 0` → not listesi,
 * `i === 1` → çubuk grafik). Proje sırası değişince DigyNotes'un maketi
 * Mimio'nun kartında çiziliyordu. Artık `project.preview` belirliyor.
 *
 * Hepsi saf CSS/SVG — görsel dosyası yok, iki temada da çalışır.
 */

type Size = 'sm' | 'lg'

export default function ProjectPreview({
  project,
  size = 'sm',
  className = '',
}: {
  project: Project
  size?: Size
  className?: string
}) {
  const accent = project.accent
  const tall = size === 'lg'

  const shell = [
    'relative overflow-hidden rounded-xl border',
    'border-slate-300/70 bg-slate-50 dark:border-white/[0.07] dark:bg-sunken',
    className,
  ].join(' ')

  switch (project.preview) {
    /* Piyasa şeridi — Açılış Zili */
    case 'ticker':
      return (
        <div className={shell} aria-hidden="true">
          <div className={`flex items-stretch divide-x divide-slate-200 dark:divide-white/[0.06] ${tall ? 'h-auto' : ''}`}>
            {[
              { sym: 'NDX', up: true, w: '68%' },
              { sym: 'SPX', up: true, w: '52%' },
              { sym: 'DJI', up: false, w: '34%' },
            ].map((col) => (
              <div key={col.sym} className="flex-1 px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                  {col.sym}
                </p>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: col.w, background: col.up ? '#0f8f63' : '#ce2044' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 px-3 py-2.5 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-slate-500 dark:text-slate-500">AÇILIŞA</span>
              <span className="font-mono text-[11px] font-semibold" style={{ color: accent }}>
                1s 28dk
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {['CPI · 15:30', 'FOMC tutanağı · 21:00'].map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
                  <span className="font-mono text-[9px] text-slate-600 dark:text-slate-400">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    /* Not listesi — DigyNotes, dev-starter, Ramazan Vakitleri */
    case 'notes':
      return (
        <div className={`${shell} px-3 py-2.5`} aria-hidden="true">
          <div className="space-y-2">
            {[0.95, 0.72, 0.85, 0.6].slice(0, tall ? 4 : 3).map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm border border-slate-400 dark:border-white/20" />
                <span
                  className="h-1.5 rounded-full bg-slate-300 dark:bg-white/[0.09]"
                  style={{ width: `${w * 100}%` }}
                />
                <span className="ml-auto h-1.5 w-4 flex-shrink-0 rounded-full" style={{ background: `${accent}55` }} />
              </div>
            ))}
          </div>
        </div>
      )

    /* Sütun grafik — Keşke Alsaydım, Derinay */
    case 'chart':
      return (
        <div className={`${shell} px-3 pb-2 pt-2.5`} aria-hidden="true">
          <div className={`flex items-end gap-0.5 ${tall ? 'h-20' : 'h-10'}`}>
            {[28, 40, 33, 52, 38, 65, 55, 78, 62, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{ height: `${h}%`, background: `${accent}${Math.round(40 + (i / 10) * 130).toString(16)}` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-mono text-[9px] text-slate-500 dark:text-slate-500">2020</span>
            <span className="font-mono text-[9px] font-semibold" style={{ color: accent }}>
              +2.840%
            </span>
            <span className="font-mono text-[9px] text-slate-500 dark:text-slate-500">Bugün</span>
          </div>
        </div>
      )

    /* Izgara — Harfiyen, One Piece Hub, Dungeon Mates */
    case 'grid':
      return (
        <div className={`${shell} p-3`} aria-hidden="true">
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: tall ? 36 : 18 }).map((_, i) => {
              const filled = [1, 3, 4, 8, 9, 10, 14, 16, 21, 22, 27, 30, 33].includes(i)
              return (
                <span
                  key={i}
                  className="aspect-square rounded-[3px] border border-slate-300 dark:border-white/[0.07]"
                  style={filled ? { background: `${accent}44`, borderColor: `${accent}66` } : undefined}
                />
              )
            })}
          </div>
        </div>
      )

    /* Pano — Mimio, ElevenForge, Karalama */
    case 'board':
      return (
        <div className={`${shell} p-3`} aria-hidden="true">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((col) => (
              <div key={col} className="space-y-1.5">
                <div className="h-1.5 w-2/3 rounded-full" style={{ background: `${accent}70` }} />
                {Array.from({ length: col === 1 ? 3 : 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-slate-300 bg-white p-1.5 dark:border-white/[0.07] dark:bg-white/[0.04]"
                  >
                    <div className="h-1 w-full rounded bg-slate-300 dark:bg-white/15" />
                    <div className="mt-1 h-1 w-3/5 rounded bg-slate-200 dark:bg-white/[0.09]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )

    /* Tarayıcı penceresi — bu site */
    case 'browser':
    default:
      return (
        <div className={shell} aria-hidden="true">
          <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2 dark:border-white/[0.07] dark:bg-white/[0.05]">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 font-mono text-[9px] text-slate-500 dark:bg-white/[0.06] dark:text-slate-500">
              {new URL(project.link).host}
            </span>
          </div>
          <div className="p-3">
            <div className="mb-1.5 h-1.5 w-12 rounded-full opacity-80" style={{ background: accent }} />
            <div className="mb-1 h-3 w-24 rounded bg-slate-300 dark:bg-white/20" />
            <div className="mb-2.5 h-3 w-16 rounded" style={{ background: `${accent}66` }} />
            <div className="grid grid-cols-3 gap-1.5">
              {[0.9, 0.7, 0.8].map((op, i) => (
                <div
                  key={i}
                  className="rounded-md border border-slate-300 bg-white p-1.5 dark:border-white/[0.06] dark:bg-white/[0.04]"
                >
                  <div className="mb-1 h-2.5 w-2.5 rounded" style={{ background: accent, opacity: 0.8 }} />
                  <div className="h-1 w-full rounded bg-slate-300 dark:bg-white/15" style={{ opacity: op }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
  }
}
