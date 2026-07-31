import { ImageResponse } from 'next/og';

export const alt = 'Jorge Doicela — Software Developer & AI Engineer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          color: '#f4f4f5',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '14px',
              letterSpacing: '0.1em',
              color: '#818cf8',
              textTransform: 'uppercase',
            }}
          >
            jorgedoicela.com
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#71717a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Quito, Ecuador
          </div>
        </div>

        {/* Middle Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Jorge Doicela
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              margin: 0,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            Full Stack Developer & AI Engineering Student
          </p>
        </div>

        {/* Bottom Badges Row */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: '#c7d2fe',
              padding: '10px 20px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Biblia
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#a7f3d0',
              padding: '10px 20px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Software
          </div>
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              color: '#e9d5ff',
              padding: '10px 20px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Portafolio
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
