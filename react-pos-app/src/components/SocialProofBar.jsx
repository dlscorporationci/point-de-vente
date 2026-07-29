import React from 'react';

const stats = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="rgba(37,99,235,0.15)" />
        <path d="M8 12l3 3 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    value: '+50',
    label: 'boutiques actives',
    accent: '#2563eb',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: '4.8/5',
    label: 'satisfaction client',
    accent: '#f59e0b',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    value: 'Wave & CinetPay',
    label: 'paiements sécurisés',
    accent: '#10b981',
  },
];

export const SocialProofBar = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginTop: '28px',
      }}
    >
      {stats.map((stat, i) => (
        <React.Fragment key={i}>
          {/* Stat item */}
          <div
            className="social-proof-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '8px 14px',
              boxShadow: 'var(--box-shadow)',
              cursor: 'default',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <span style={{ flexShrink: 0, lineHeight: 1 }}>{stat.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                color: stat.accent,
              }}>
                {stat.value}
              </span>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                {stat.label}
              </span>
            </div>
          </div>

          {/* Séparateur entre les items */}
          {i < stats.length - 1 && (
            <div
              className="social-proof-divider"
              style={{
                width: '1px',
                height: '24px',
                background: 'var(--border-color)',
                borderRadius: '1px',
                flexShrink: 0,
              }}
            />
          )}
        </React.Fragment>
      ))}

      <style>{`
        .social-proof-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--box-shadow-hover) !important;
        }
        @media (max-width: 640px) {
          .social-proof-divider { display: none; }
        }
      `}</style>
    </div>
  );
};
