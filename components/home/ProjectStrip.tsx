import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ViewTransition } from 'react'
import { ThemedImage } from '@/components/ui/ThemedImage'
import { shotSources } from '@/lib/content/project-shots'
import type { Project } from '@/lib/content/types'

/**
 * Proje şeridi: hero'nun hemen altında, gerçek ekran görüntülerinden yatay
 * bir dizin. Yalnız yatay kaydırma (dokunma, iz paneli, klavye); sürükleme
 * yok, tarayıcının kendi kaydırması yeterli ve erişilebilir.
 *
 * Görseli olmayan projeler (dev-starter, ahmetakyapi.com) burada yok: şerit
 * bir görsel dizin, tipografik kapakları /projeler'de. Öne çıkan üç proje de
 * yok (sayfa süzer): onlar hemen altta Seçili İşler'de; şeritte de dursalar
 * aynı ekran görüntüsü ilk iki ekranda iki kez görünürdü. Son kart bu yüzden
 * şeritteki sayıyı değil bütün projelerin sayısını (`total`) yazar.
 *
 * Görseller `loading="eager"` + `fetchPriority="low"`: tembel yükleme yatay
 * kaydırmada geç tetikleniyordu ve kart boş geliyordu. Şeritteki projelerin
 * hepsi tek temalı (tek `<img>`), yani hevesli yükleme gizli bir ikinci
 * görseli indirmiyor; düşük öncelik LCP'nin önüne geçmesini engelliyor.
 *
 * Görsel `project-<slug>` adını TAŞIR (ana sayfada bu adı taşıyan tek öğe;
 * Seçili İşler taşımaz): karta basınca görsel proje sayfasının kapağına
 * morf eder. Öne çıkan üçünün ana sayfadan morfu bu yüzden yok; kabul
 * edilen bedel, panelleri bir adı iki öğeye vermeden taşıyamıyoruz.
 */
type StripItem = { project: Project; shot: NonNullable<ReturnType<typeof shotSources>> }

export function ProjectStrip({ projects, total }: { projects: Project[]; total: number }) {
  const items: StripItem[] = projects.flatMap((project) => {
    const shot = shotSources(project.slug, 'desktop')
    return shot ? [{ project, shot }] : []
  })

  return (
    <section aria-labelledby="proje-seridi" className="pb-6">
      <h2 id="proje-seridi" className="sr-only">
        Projeler
      </h2>
      <div className="home-strip" role="region" aria-label="Proje şeridi, yatay kaydırılır" tabIndex={0}>
        <ul className="home-strip-track">
          {items.map(({ project, shot }) => (
            <li key={project.slug} className="home-strip-item">
              <Link href={`/projeler/${project.slug}`} className="group block rounded-card">
                <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                  <div className="home-strip-frame">
                    <div className="home-strip-shot">
                      <ThemedImage {...shot} alt={`${project.title} ekran görüntüsü`} loading="eager" fetchPriority="low" />
                    </div>
                  </div>
                </ViewTransition>
                <span className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="truncate font-semibold text-strong transition-colors group-hover:text-primary-ink">
                    {project.title}
                  </span>
                  <span className="shrink-0 font-mono text-small text-muted">{project.category}</span>
                </span>
              </Link>
            </li>
          ))}
          <li className="home-strip-item home-strip-more">
            <Link
              href="/projeler"
              className="group flex h-full flex-col justify-between rounded-card border border-line bg-surface p-6 transition-colors hover:border-line-strong"
            >
              <span className="font-mono text-small text-muted">{total} Proje</span>
              <span className="flex items-center justify-between gap-3 text-title font-semibold text-strong">
                Tüm Projeler
                <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
