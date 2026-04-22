import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #5a0a1a 0%, #8b1a2a 60%, #6e1422 100%)',
          fontFamily: 'Georgia, serif',
          padding: '60px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 14,
              border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            💎
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.02em',
            }}
          >
            RockhoundingNear.com
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: 22,
            maxWidth: 900,
          }}
        >
          Find Rockhounding Sites Near You
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: 26,
            color: 'rgba(255,255,255,0.68)',
            textAlign: 'center',
            maxWidth: 680,
            lineHeight: 1.4,
            marginBottom: 48,
          }}
        >
          Discover over 1,000 hand-curated gem hunting locations across all 50 states.
        </div>

        {/* Stats pills */}
        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          {['1,000+ Locations', 'All 50 States', '40+ Gem Types'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.22)',
                borderRadius: 50,
                padding: '10px 24px',
                fontSize: 18,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
