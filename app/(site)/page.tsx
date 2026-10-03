import type { Metadata } from 'next'
import { Closing } from '@/components/home/Closing'
import { HomeHero } from '@/components/home/HomeHero'
import { HowIWork } from '@/components/home/HowIWork'
import { ProjectStrip } from '@/components/home/ProjectStrip'
import { RecentPosts } from '@/components/home/RecentPosts'
import { SelectedWork } from '@/components/home/SelectedWork'
import { StackMarquee } from '@/components/home/StackMarquee'
import { PageTransition } from '@/components/site/PageTransition'
import { personJsonLd, websiteJsonLd } from '@/lib/seo'
import { getOrderedProjects, getSiteContent } from '@/lib/site-content'
import './home.css'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/*
 * Ana sayfa, yedi bölüm ve yedi ayrı düzen ailesi: künye + isim imzası
 * (hero), yatay şerit, üst üste binen paneller, kinetik paragraf, marquee,
 * editoryal liste, kapanış. Aynı düzen iki kez kullanılmıyor; sayfa
 * kaydırıldıkça ritim değişiyor.
 *
 * Tamamı sunucu bileşeni. İstemciye giden üç ada var: küre (yalnız geniş
 * ekranda istenir), yazı önizlemesi ve e-posta kopyalama düğmesi. Bölüm
 * hareketlerinin hepsi CSS (./home.css); rota statik kalır.
 */
export default function HomePage() {
  const { home, projects, blogPosts } = getSiteContent()
  const ordered = getOrderedProjects(projects)
  // Öne çıkan üçü hemen altta Seçili İşler'de büyük panel olarak duruyor;
  // şeritte de olurlarsa okuyucu aynı ekran görüntüsünü iki kez görüyor.
  const stripProjects = ordered.filter((project) => !project.featured)

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        // Yapısal veri; Google'ın kişi ve site bilgisini doğru okuması için.
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd(), websiteJsonLd()]) }}
      />
      <HomeHero home={home} />
      <ProjectStrip projects={stripProjects} total={projects.length} />
      <SelectedWork home={home} projects={projects} />
      <HowIWork text={home.approach} />
      <StackMarquee />
      <RecentPosts posts={blogPosts} projects={projects} />
      <Closing closing={home.closing} />
    </PageTransition>
  )
}
