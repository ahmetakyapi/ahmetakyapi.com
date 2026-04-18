import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          background: 'linear-gradient(135deg, #7c6fe0 0%, #4f7ef5 55%, #3b8ef0 100%)',
        }}
      >
        <svg width="108" height="108" viewBox="0 0 42 42" fill="none">
          <path
            d="M21 12L30 29H12L21 12Z"
            stroke="white"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
