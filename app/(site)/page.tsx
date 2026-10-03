import type { Metadata } from 'next'
import { About } from '@/components/home/About'
import { Experience } from '@/components/home/Experience'
import { Closing } from '@/components/home/Closing'
import { HomeHero } from '@/components/home/HomeHero'
import { RecentPosts } from '@/components/home/RecentPosts'
import { SelectedWork } from '@/components/home/SelectedWork'
import { StackMarquee } from '@/components/home/StackMarquee'
import { PageTransition } from '@/components/site/PageTransition'
import { personJsonLd, websiteJsonLd } from '@/lib/seo'
import { getSiteContent } from '@/lib/site-content'
import './home.css'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/*
 * Ana sayfa, yedi bölüm ve yedi ayrı düzen ailesi. SIRA bir hikâye:
 *   1. Hero: solda isim ve tek cümle, sağda etkileşimli küre.
 *   2. Hakkımda: kim olduğum (sayfanın tek renk bloğu, `surface-sunken`).
 *      Sahibinin isteği (Ekim 2026): beni tanıtan kısım projelerden önce.
 *      Okuyucu ilk önce ismi, sonra o ismin arkasındaki kişiyi okuyor.
 *   3. Öne Çıkan Projeler: üst üste binen paneller.
 *   4. Deneyim: çalıştığım yer ve ürünlerimin alanları, küçük ve sessiz
 *      (eskiden "Ne Yaptım": dev rakamlar; sahibi "çok büyük" dedi).
 *   5. Tech stack şeridi: Deneyim'in hemen altında, "neyle" sorusunun
 *      cevabı olarak. Listelenen sırada (yazılardan sonra) iş bölümünden
 *      kopuyor ve yazılarla kapanış arasına giren bir süs gibi duruyordu;
 *      burada "iş" bölümünü kapatan bir çizgi, yazılar ve kapanış ise
 *      sayfanın "konuşma" yarısı.
 *   6. Son Yazılar: editoryal liste.
 *   7. Kapanış.
 * Aynı düzen iki kez kullanılmıyor; bölüm başlıkları aynı maskeli
 * açılışla gelir (MaskTitle), bölümler birbirine bağlanır.
 *
 * Tamamı sunucu bileşeni. İstemciye giden adalar: küre ve e-posta kopyalama düğmesi. Bölüm
 * hareketlerinin hepsi CSS (./home.css); rota statik kalır.
 */
export default function HomePage() {
  const { home, projects, blogPosts } = getSiteContent()

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        // Yapısal veri; Google'ın kişi ve site bilgisini doğru okuması için.
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd(), websiteJsonLd()]) }}
      />
      <HomeHero home={home} />
      <About about={home.about} />
      <SelectedWork home={home} projects={projects} />
      <Experience experience={home.experience} projects={projects} />
      <StackMarquee />
      <RecentPosts posts={blogPosts} />
      <Closing closing={home.closing} />
    </PageTransition>
  )
}
