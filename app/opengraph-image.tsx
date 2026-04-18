import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ahmet Akyapı — Fullstack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#04070d',
          backgroundImage:
            'radial-gradient(circle at 18% 12%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 82% 10%, rgba(34,211,238,0.25), transparent 40%), radial-gradient(circle at 50% 100%, rgba(16,185,129,0.18), transparent 45%)',
          color: '#e2e8f0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #7c6fe0 0%, #4f7ef5 55%, #3b8ef0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 42 42" fill="none">
              <path
                d="M21 12L30 29H12L21 12Z"
                stroke="white"
                strokeWidth="2.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#e2e8f0' }}>Ahmet Akyapı</div>
            <div
              style={{
                fontSize: 13,
                color: '#64748b',
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Fullstack Dev
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#f1f5f9',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            React, TypeScript ve Next.js ile
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              display: 'flex',
              background: 'linear-gradient(90deg, #818cf8, #22d3ee, #34d399)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            rafine ürün deneyimi.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 22, color: '#94a3b8' }}>ahmetakyapi.com</div>
          <div style={{ display: 'flex', gap: '14px' }}>
            {['Next.js', 'TypeScript', 'Framer Motion'].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 18,
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#cbd5e1',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
