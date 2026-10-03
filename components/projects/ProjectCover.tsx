import { ViewTransition, type ReactNode } from 'react'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { DEV_STARTER_BANNER, isDarkInk, shotSources } from '@/lib/content/project-shots'
import type { Project } from '@/lib/content/types'
import { DEFAULT_THEME } from '@/lib/theme'
import { cx } from '@/lib/utils'

/**
 * Projenin kapak görseli: dizin kartında, detayın kahramanında, "Sonraki
 * Proje"de ve ana sayfanın proje şeridinde AYNI bileşen. Aynı bileşen
 * olması morfun şartı: iki uçtaki kutu aynı oranda ve aynı köşede.
 *
 *   <ProjectCover project={p} morph />                     // dizin kartı
 *   <ProjectCover project={p} morph priority />            // detay kahramanı (LCP)
 *
 * `morph`: kutu `project-${slug}` adlı paylaşılan öğe olur
 * (`share="morph" default="none"`). Bir sayfada bir ad YALNIZ BİR öğede;
 * aynı projeyi iki kez gösteren sayfa yalnız birine `morph` verir.
 *
 * Üç durum, envantere göre (lib/content/project-shots.ts):
 *  · ekran görüntüsü var: masaüstü görünümü, 16/10, temaya göre
 *  · dev-starter: README afişi. Morf eden kutu AFİŞİN KENDİSİ (3,5:1);
 *    kartta 16/10 bir yüzeyin ortasında durur, detayda tam genişlik.
 *    Kutu morf etseydi 16/10'dan geniş şeride geçerken görüntü esnerdi.
 *  · görsel yok (ahmetakyapi.com): adın kendisinden tipografik kapak.
 *    Uydurma bir ekran çizilmez.
 */
type ProjectCoverProps = {
  project: Pick<Project, 'slug' | 'title'>
  morph?: boolean
  /** LCP adayı: yalnız varsayılan temanın görseli öncelik alır. */
  priority?: boolean
  /** Kart: afiş 16/10 yüzeyin ortasında. Kahraman: afiş tam genişlik. */
  layout?: 'card' | 'hero'
  className?: string
  /** Görselin alt metni; verilmezse projenin adından kurulur. */
  alt?: string
}

const FRAME = 'relative overflow-hidden rounded-card border border-line bg-surface-sunken'

function Morph({ name, on, children }: { name: string; on: boolean; children: ReactNode }) {
  if (!on) return <>{children}</>
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  )
}

export function ProjectCover({ project, morph = false, priority = false, layout = 'card', className, alt }: ProjectCoverProps) {
  const name = `project-${project.slug}`
  const shot = shotSources(project.slug, 'desktop')
  const theme = priority ? DEFAULT_THEME : undefined

  if (shot) {
    return (
      <Morph name={name} on={morph}>
        <div className={cx(FRAME, 'aspect-[16/10]', className)} data-dark-ink={isDarkInk(project.slug) || undefined}>
          <ThemedImage
            {...shot}
            alt={alt ?? `${project.title} ana ekranı`}
            priority={priority}
            theme={theme}
            className="pcover-img size-full object-cover object-top"
          />
        </div>
      </Morph>
    )
  }

  if (project.slug === 'dev-starter') {
    const banner = (
      <Morph name={name} on={morph}>
        <div className="overflow-hidden rounded-[0.75rem]">
          <ThemedImage {...DEV_STARTER_BANNER} alt={alt ?? 'dev-starter README afişi'} priority={priority} theme={theme} />
        </div>
      </Morph>
    )
    return layout === 'card' ? (
      <div className={cx(FRAME, 'flex aspect-[16/10] items-center px-[6%]', className)}>
        <div className="pcover-img w-full">{banner}</div>
      </div>
    ) : (
      /* Kahramanda çerçeve YOK: afişin kendi kenarı ve köşesi var; dış
         kutu "çerçeve içinde çerçeve" gösteriyordu. */
      <div className={className}>{banner}</div>
    )
  }

  /* Tipografik kapak: kap sorgusu birimiyle punto kutuya göre ölçeklenir. */
  return (
    <Morph name={name} on={morph}>
      <div
        role="img"
        aria-label={alt ?? `${project.title} kapağı`}
        className={cx(FRAME, 'flex aspect-[16/10] flex-col justify-end p-[6%] @container', className)}
      >
        <span aria-hidden="true" className="font-mono text-[max(0.75rem,2.6cqw)] text-muted">
          Portfolyo ve Blog
        </span>
        <span
          aria-hidden="true"
          className="display-ink mt-[1.5cqw] block text-[10.5cqw] leading-[0.95] font-semibold tracking-[-0.045em]"
        >
          {project.title}
        </span>
      </div>
    </Morph>
  )
}
