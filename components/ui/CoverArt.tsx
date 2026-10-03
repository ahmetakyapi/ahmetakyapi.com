/**
 * Görseli olmayan kapak (yazı ve proje): hareketli, tipografik bir sahne.
 *
 * 3 Ekim 2026: ekran görüntüsü olmayan yazılar düz bir mavi degrade kutuda
 * yalnız etiketini taşıyordu ("görseli olmayanlara güzel bir tasarım
 * görseli"). Uydurma bir ekran çizilmez; sahne soyut: iki ışık lekesi yavaşça
 * süzülür, ana sayfadaki kürenin yörüngelerini anan iki halka döner,
 * köşede noktalı ızgara ve kelimenin altında kara kalem bir karalama
 * (globals.css → "Kapak Sahnesi"). Hepsi CSS; hareketi azaltan okuyucuda
 * duruk.
 *
 * Renk marka degradesinden (`bg-cta`), metin `--on-brand` (her noktada AA).
 * Süs öğeleri `aria-hidden`; erişilebilir ad kapağı kullanan yerden gelir.
 */
export function CoverArt({ word, kicker }: { word: string; kicker?: string }) {
  return (
    <div className="cover-art bg-cta" aria-hidden="true">
      <span className="cover-art-orb cover-art-orb-1" />
      <span className="cover-art-orb cover-art-orb-2" />
      <span className="cover-art-grid" />
      <svg className="cover-art-rings" viewBox="0 0 200 200" focusable="false">
        <ellipse cx="100" cy="100" rx="92" ry="34" />
        <ellipse cx="100" cy="100" rx="70" ry="22" transform="rotate(-24 100 100)" />
        <circle cx="100" cy="100" r="44" />
      </svg>
      <div className="cover-art-text">
        {kicker ? <span className="cover-art-kicker">{kicker}</span> : null}
        <span className="cover-art-word">
          {word}
          <svg className="cover-art-scribble" viewBox="0 0 200 16" preserveAspectRatio="none" focusable="false">
            <path pathLength={1} d="M3 10.5C38 5.5 86 4 128 6.5c26 1.6 46 3.2 69 1.2" />
          </svg>
        </span>
      </div>
    </div>
  )
}
