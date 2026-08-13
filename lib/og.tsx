import type { ReactElement } from 'react'

/**
 * Paylaşım kartlarının ortak iskeleti.
 *
 * WhatsApp, X, LinkedIn, Slack ve Telegram hepsi og:image okuyor; kartın
 * 1200×630 dışında bir şeye ihtiyacı yok ama okunaklı olması şart —
 * WhatsApp önizlemeyi ~400px genişlikte gösteriyor, yani 88px'lik başlık
 * orada ~30px'e iniyor. Bu yüzden başlık büyük, meta satırı kalın.
 *
 * Satori kuralları (buradaki her şey ona göre yazıldı):
 *  · Birden fazla çocuğu olan her düğümde `display: flex` AÇIKÇA yazılmalı
 *  · `gap` yalnızca flex kaplarında
 *  · `backgroundImage` içinde çoklu radial-gradient destekleniyor,
 *    ama `background` kısayolu + gradient karışımı "Invalid background
 *    image" hatası veriyor — bu yüzden hep ayrı ayrı yazılıyor
 */

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

const INK = '#f1f5f9'
const MUTED = '#94a3b8'
const GROUND = '#04070d'

/**
 * Satori'ye gömülecek Manrope.
 *
 * İKİ TUZAK VAR, ikisi de Türkçe yüzünden:
 *
 * 1. fontsource'un `latin-ext` dosyası YALNIZCA latin-ext'e özel glifleri
 *    taşır (ı, ğ, ş, İ, ç, ü). Temel harfler `latin` dosyasındadır. Sadece
 *    latin-ext yüklendiğinde "Açılış" kelimesinin yarısı Manrope, yarısı
 *    Satori'nin varsayılan fontuyla çiziliyordu.
 *
 * 2. Dördünü birden yükleyince de düzelmedi: Satori istenen ağırlıkta glif
 *    bulamazsa ağırlığı YOK SAYIP dizideki ilk uygun fonta düşüyor. Yani
 *    800'lük başlıktaki "ğ" harfi latin-ext-500'den geliyordu — kalın
 *    başlığın ortasında ince harfler.
 *
 * Çözüm: Google Fonts'un `text=` parametresi. İstenen karakterleri
 * içeren, ağırlık başına TEK dosya döndürüyor. Hem sorun bitiyor hem
 * dosya küçülüyor (tam TTF ~70 KB, metne özel alt küme ~6 KB).
 */
type OgFont = { name: string; data: ArrayBuffer; weight: 500 | 800; style: 'normal' }

const fontCache = new Map<string, OgFont[]>()

/** Kartta geçen benzersiz karakterler — alt kümeyi bu belirliyor. */
function uniqueChars(...parts: (string | undefined)[]): string {
  const joined = parts.filter(Boolean).join('')
  /* Rozetlerde büyük harfe çevirdiğimiz için her iki hâl de istenmeli;
     Türkçe'de i → İ olduğu için basit toUpperCase yetmez. */
  const all = joined + joined.toLocaleUpperCase('tr-TR') + joined.toLocaleLowerCase('tr-TR')

  const seen: Record<string, true> = {}
  let out = ''
  for (const ch of all.split('')) {
    if (seen[ch]) continue
    seen[ch] = true
    out += ch
  }
  return out
}

/**
 * Fontlar indirilemezse kart yine üretilsin — Satori kendi varsayılanına
 * düşer. Paylaşım kartının hiç çıkmaması, fontu jenerik olmasından kötü.
 */
export async function loadOgFonts(...text: (string | undefined)[]): Promise<OgFont[]> {
  const chars = uniqueChars(...text, 'ahmetakyapi.com FULLSTACK DEVELOPER Ahmet Akyapı 0123456789')
  const cached = fontCache.get(chars)
  if (cached) return cached

  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Manrope:wght@500;800&text=${encodeURIComponent(chars)}`
    // User-Agent göndermeyince Google TTF döndürüyor; woff2 gönderseydi
    // Satori'nin bazı sürümleri açamıyor.
    const css = await fetch(cssUrl).then((r) => (r.ok ? r.text() : Promise.reject(new Error('css'))))

    const faces = css.match(/@font-face\s*{[^}]*}/g) ?? []
    const parsed = faces
      .map((face) => {
        const weight = Number(/font-weight:\s*(\d+)/.exec(face)?.[1])
        const url = /src:\s*url\(([^)]+)\)/.exec(face)?.[1]
        return url && (weight === 500 || weight === 800) ? { url, weight: weight as 500 | 800 } : null
      })
      .filter((v): v is { url: string; weight: 500 | 800 } => v !== null)

    if (parsed.length === 0) throw new Error('font-face bulunamadı')

    const fonts = await Promise.all(
      parsed.map(async ({ url, weight }) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`font ${res.status}`)
        return { name: 'Manrope', data: await res.arrayBuffer(), weight, style: 'normal' as const }
      }),
    )

    fontCache.set(chars, fonts)
    return fonts
  } catch {
    return []
  }
}

/** Marka işareti — üçgen, header'daki logonun aynısı. */
function BrandMark({ accent }: { accent: string }) {
  return (
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: accent,
        backgroundImage: `linear-gradient(135deg, ${accent} 0%, #4f7ef5 100%)`,
        boxShadow: `0 8px 32px ${accent}66`,
      }}
    >
      <svg width="36" height="36" viewBox="0 0 42 42" fill="none">
        <path d="M21 12L30 29H12L21 12Z" stroke="white" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/**
 * Rotaların çağırdığı tek fonksiyon: çerçeveyi kurar, kartta geçen metne
 * göre font alt kümesini indirir ve görseli döndürür.
 */
export async function renderOgCard(props: OgFrameProps) {
  const { ImageResponse } = await import('next/og')
  return new ImageResponse(OgFrame(props), {
    ...OG_SIZE,
    fonts: await loadOgFonts(props.title, props.subtitle, props.eyebrow, ...(props.badges ?? [])),
  })
}

export type OgFrameProps = {
  /** Üst satırdaki küçük etiket — "Blog Yazısı", "Projeler"… */
  eyebrow: string
  title: string
  /** Başlığın altındaki bir-iki cümle. */
  subtitle?: string
  /** Kartın imza rengi. Her yazı kendi etiket rengini alıyor. */
  accent: string
  /** Alt satırın sağındaki rozetler — teknoloji, tarih, okuma süresi. */
  badges?: string[]
}

export function OgFrame({ eyebrow, title, subtitle, accent, badges = [] }: OgFrameProps): ReactElement {
  /* Uzun başlıkta puntoyu düşür — 1200px'e sığmayan başlık taşıyor. */
  const titleSize = title.length > 74 ? 56 : title.length > 46 ? 68 : 82

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: GROUND,
        backgroundImage: `radial-gradient(circle at 12% 8%, ${accent}55, transparent 42%), radial-gradient(circle at 88% 4%, rgba(34,211,238,0.18), transparent 38%), radial-gradient(circle at 60% 108%, ${accent}2e, transparent 45%)`,
        color: INK,
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      {/* İnce ızgara dokusu — kartı düz bir renk olmaktan çıkarıyor. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          /* Satori'nin gradient ayrıştırıcısı yön belirtilmeden başlayan
             linear-gradient'i kabul etmiyor ("Missing comma before color
             stops"). Tarayıcıda `linear-gradient(rgba(…) 1px, …)` geçerli,
             burada `to bottom` yazmak şart. */
          backgroundImage:
            'linear-gradient(to bottom, rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(to right, rgba(148,163,184,0.055) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Sol kenardaki imza şeridi. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 10,
          display: 'flex',
          backgroundImage: `linear-gradient(180deg, ${accent} 0%, ${accent}33 100%)`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '68px 76px 60px 86px',
        }}
      >
        {/* Üst: marka + etiket */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BrandMark accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>Ahmet Akyapı</div>
              <div style={{ fontSize: 14, color: MUTED, letterSpacing: 2, marginTop: 3 }}>FULLSTACK DEVELOPER</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: 2.4,
              padding: '11px 22px',
              borderRadius: 999,
              color: accent,
              border: `1px solid ${accent}66`,
              backgroundColor: `${accent}1f`,
            }}
          >
            {eyebrow.toLocaleUpperCase('tr-TR')}
          </div>
        </div>

        {/* Orta: başlık */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#ffffff',
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                display: 'flex',
                fontSize: 25,
                lineHeight: 1.45,
                color: '#b8c4d4',
                marginTop: 24,
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Alt: adres + rozetler */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 26,
            borderTop: '1px solid rgba(148,163,184,0.16)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: 9, height: 9, borderRadius: 999, backgroundColor: accent }} />
            <div style={{ display: 'flex', fontSize: 23, fontWeight: 800, color: '#cbd5e1', marginLeft: 12 }}>
              ahmetakyapi.com
            </div>
          </div>

          {badges.length > 0 && (
            <div style={{ display: 'flex' }}>
              {badges.slice(0, 4).map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: 'flex',
                    fontSize: 18,
                    padding: '9px 18px',
                    borderRadius: 999,
                    marginLeft: 12,
                    border: '1px solid rgba(148,163,184,0.22)',
                    backgroundColor: 'rgba(148,163,184,0.08)',
                    color: '#cbd5e1',
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
