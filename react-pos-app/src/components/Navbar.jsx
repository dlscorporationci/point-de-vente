import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';

export const Navbar = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!e.target.closest('.landing-nav-wrapper')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const navLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Tarifs',          href: '#pricing' },
    { label: 'Témoignages',     href: '#testimonials' },
    { label: 'Contact',         href: '#contact' },
  ];

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className="landing-nav-wrapper"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 2000,
          background: scrolled
            ? 'rgba(255,255,255,0.92)'
            : 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(37,99,235,0.10)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 2px 24px rgba(37,99,235,0.08)'
            : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>

          {/* ── LOGO ── */}
          <div
            onClick={() => onNavigate ? onNavigate('home') : scrollTo('#hero')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
          >
            <img src={logo} alt="ApexPOS" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(37,99,235,0.18)' }} />
            <span style={{
              fontSize: '22px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563eb, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}>
              ApexPOS
            </span>
          </div>

          {/* ── LIENS DESKTOP ── */}
          <div className="landing-nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}>
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  transition: 'color 0.2s, background 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.background = 'rgba(37,99,235,0.07)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.background = 'none';
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── CTAs DESKTOP ── */}
          <div className="landing-nav-ctas" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={() => onNavigate ? onNavigate('auth') : scrollTo('#auth')}
              style={{
                background: 'none',
                border: '1.5px solid #2563eb',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '13px',
                padding: '8px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(37,99,235,0.07)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
              }}
            >
              Se connecter
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('register') : scrollTo('#register')}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #10b981)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                padding: '9px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37,99,235,0.28)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.28)';
              }}
            >
              Démarrer gratuitement
            </button>
          </div>

          {/* ── BURGER MOBILE ── */}
          <button
            className="landing-burger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: '40px',
              height: '40px',
              background: 'rgba(37,99,235,0.07)',
              border: '1.5px solid rgba(37,99,235,0.15)',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: '8px',
              flexShrink: 0,
            }}
          >
            <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#2563eb' : '#374151', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#2563eb' : '#374151', borderRadius: '2px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#2563eb' : '#374151', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* ── MENU MOBILE DROPDOWN ── */}
        <div
          className="landing-mobile-menu"
          style={{
            maxHeight: menuOpen ? '420px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.35s ease',
            background: 'rgba(255,255,255,0.97)',
            borderTop: menuOpen ? '1px solid rgba(37,99,235,0.10)' : '1px solid transparent',
          }}
        >
          <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#374151',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(37,99,235,0.07)';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                {label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid rgba(37,99,235,0.10)', marginTop: '8px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { setMenuOpen(false); onNavigate && onNavigate('auth'); }}
                style={{
                  background: 'none',
                  border: '1.5px solid #2563eb',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Se connecter
              </button>
              <button
                onClick={() => { setMenuOpen(false); onNavigate && onNavigate('register'); }}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #10b981)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '13px 18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                }}
              >
                Démarrer gratuitement →
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── STYLES RESPONSIVE ── */}
      <style>{`
        @media (max-width: 768px) {
          .landing-nav-links,
          .landing-nav-ctas { display: none !important; }
          .landing-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
};
