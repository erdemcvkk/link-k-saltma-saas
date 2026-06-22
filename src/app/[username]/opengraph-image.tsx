import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';

export const alt = 'Clinkor User Profile';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ username: string }> | { username: string } }) {
  const resolvedParams = typeof (params as any).then === 'function' || 'then' in params ? await params : params;
  const username = resolvedParams.username;
  const cleanUsername = username.replace("%40", "").replace(/^@/, "");

  const user = await db.user.findFirst({
    where: { username: cleanUsername.toLowerCase() },
    include: { profile: true },
  });

  const displayName = user?.profile?.displayName || `@${cleanUsername}`;
  const bio = user?.profile?.bio || '';
  const avatarUrl = user?.profile?.avatarUrl;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0b0c0e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Profile Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '75px',
              objectFit: 'cover',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '24px',
            }}
          />
        ) : (
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '75px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#ffffff',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '24px',
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Name */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {displayName}
        </div>

        {/* Bio */}
        {bio && (
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: '1.5',
            }}
          >
            {bio.length > 120 ? `${bio.substring(0, 120)}...` : bio}
          </div>
        )}

        {/* Footer Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Powered by <span style={{ fontWeight: 'bold', color: '#ffffff', marginLeft: '6px' }}>Clinkor</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
