import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { ReactElement } from 'react'
import { SIGNATURE_MARK_A, SIGNATURE_MARK_FLOURISH } from '@/lib/brand/signature'
import { JOB_TITLE } from '@/lib/nav'

/**
 * Paylaşım kartlarının ortak iskeleti (1200×630).
 *
 * WhatsApp önizlemeyi ~400px genişlikte gösteriyor, yani 82px'lik başlık
 * orada ~28px'e iniyor: başlık büyük, künye kalın.
 *
 * Satori kuralları (buradaki her şey ona göre yazıldı):
 *  · Birden fazla çocuğu olan her düğümde `display: flex` AÇIKÇA yazılmalı
 *  · `gap` yalnızca flex kaplarında
 *  · CSS DEĞİŞKENİ ÇÖZÜLMEZ: renkler app/globals.css'teki `signature`
 *    paletinin koyu temasından BİREBİR sabit olarak burada. Orada
 *    değişirse burada da değişir.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

/** `signature` koyu: --page-bg, --text-strong, --text-body, --primary, --line. */
const C = {
  ground: '#070d16',
  ink: '#eaf1f8',
  body: '#94a7ba',
  muted: '#8497a9',
  primary: '#35b8ff',
  line: 'rgba(255,255,255,0.11)',
  surface: 'rgba(255,255,255,0.05)',
  /* Marka degradesi duraklar: --brand-from / --brand-mid / --brand-to. */
  brandFrom: '#5cc4ff',
  brandMid: '#1f86e0',
  brandTo: '#0b3f86',
  onBrand: '#ffffff',
  brandGlow: '#bfe6ff',
} as const

/**
 * Marka fontu DEPODA (`assets/fonts`, OFL lisansı yanında), Google'dan
 * çekilmiyor.
 *
 * Eskiden Manrope glifleri her soğuk render'da Google Fonts'tan metne özel
 * alt küme olarak indiriliyordu: her kart bir ağ turu bekliyor, istek
 * düştüğünde kart sessizce Satori'nin varsayılan fontuna dönüyordu.
 * Satori değişken font okuyamadığı için iki statik kesim: 400 ve 700.
 * Açılış Zili'yle aynı dosyalar.
 */
type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }

let fontCache: Promise<OgFont[]> | null = null

function loadFonts(): Promise<OgFont[]> {
  fontCache ??= (async () => {
    const dir = join(process.cwd(), 'assets', 'fonts')
    const [regular, bold] = await Promise.all([
      readFile(join(dir, 'SchibstedGrotesk-Regular.ttf')),
      readFile(join(dir, 'SchibstedGrotesk-Bold.ttf')),
    ])
    const toArrayBuffer = (buf: Buffer) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
    return [
      { name: 'Schibsted', data: toArrayBuffer(regular), weight: 400, style: 'normal' },
      { name: 'Schibsted', data: toArrayBuffer(bold), weight: 700, style: 'normal' },
    ]
  })()
  return fontCache
}

/** Marka işareti: components/site/Logo.tsx ile aynı üçgen ve degrade. */
function BrandMark({ size = 64, radius = size * 0.29 }: { size?: number; radius?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.brandMid,
        backgroundImage: `linear-gradient(150deg, ${C.brandFrom} 0%, ${C.brandMid} 48%, ${C.brandTo} 100%)`,
      }}
    >
      {/* İmza "A"sı ve kara kalem kuyruğu (lib/brand/signature.ts). */}
      <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
        <path d={SIGNATURE_MARK_A} fill={C.onBrand} />
        <path d={SIGNATURE_MARK_FLOURISH} stroke={C.brandGlow} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export type OgFrameProps = {
  /** Üst satırdaki künye: "Blog", "Projeler", yazının etiketi… (Title Case). */
  eyebrow: string
  title: string
  /** Başlığın altındaki bir-iki cümle. */
  subtitle?: string
  /** Alt satırdaki künye öğeleri: tarih, okuma süresi, tech stack. */
  badges?: string[]
}

/** Rotaların çağırdığı tek fonksiyon. */
export async function renderOgCard(props: OgFrameProps) {
  return new ImageResponse(OgFrame(props), { ...OG_SIZE, fonts: await loadFonts() })
}

/** Kare marka ikonu (apple-icon): aynı işaret, aynı degrade. Köşe yok:
    iOS ana ekran ikonunu kendi maskesiyle yuvarlıyor. */
export function renderBrandIcon(size: number) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <BrandMark size={size} radius={0} />
      </div>
    ),
    { width: size, height: size },
  )
}

export function OgFrame({ eyebrow, title, subtitle, badges = [] }: OgFrameProps): ReactElement {
  /* Uzun başlıkta puntoyu düşür: 1200px'e sığmayan başlık taşıyor. */
  const titleSize = title.length > 74 ? 56 : title.length > 46 ? 68 : 82

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 76px 56px',
        backgroundColor: C.ground,
        color: C.ink,
        fontFamily: 'Schibsted, sans-serif',
      }}
    >
      {/* Üst: marka + künye */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BrandMark />
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>Ahmet Akyapı</div>
            <div style={{ fontSize: 18, color: C.muted, marginTop: 4 }}>{JOB_TITLE}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            fontWeight: 700,
            padding: '10px 22px',
            borderRadius: 999,
            color: C.primary,
            border: `1px solid ${C.line}`,
            backgroundColor: C.surface,
          }}
        >
          {eyebrow}
        </div>
      </div>

      {/* Orta: başlık */}
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1010 }}>
        <div
          style={{
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            color: C.ink,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ display: 'flex', fontSize: 26, lineHeight: 1.45, color: C.body, marginTop: 24, maxWidth: 920 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* Alt: adres + künye */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: 24,
          borderTop: `1px solid ${C.line}`,
          fontSize: 22,
        }}
      >
        <div style={{ display: 'flex', fontWeight: 700, color: C.ink }}>ahmetakyapi.com</div>
        {badges.length > 0 ? (
          <div style={{ display: 'flex', color: C.body }}>{badges.slice(0, 4).join('  ·  ')}</div>
        ) : null}
      </div>
    </div>
  )
}
