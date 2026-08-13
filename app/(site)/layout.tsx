import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CommandPalette from '@/components/CommandPalette'
import ScrollToTop from '@/components/ScrollToTop'
import NoiseTexture from '@/components/NoiseTexture'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NoiseTexture />
      <CommandPalette />
      <ScrollToTop />

      <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Sabit ortam ışıması — sayfa arkasında durur, etkileşime girmez. */}
        <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(120,110,80,0.05),transparent_26%),radial-gradient(circle_at_84%_8%,rgba(99,102,241,0.04),transparent_24%)] dark:bg-[radial-gradient(circle_at_18%_10%,rgba(79,70,229,0.12),transparent_26%),radial-gradient(circle_at_82%_8%,rgba(34,211,238,0.1),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_18%,transparent_78%,rgba(8,145,178,0.03)_100%)]" />
        </div>

        <Header />

        <main id="main-content" className="flex-1 pt-16 overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </>
  )
}
