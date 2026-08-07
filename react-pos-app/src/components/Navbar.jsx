import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onNavigate }) => {
  const { theme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const isDark = theme && theme.includes('dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // ScrollSpy: Détection de la section active lors du défilement
      const sectionIds = ['hero', 'features', 'pricing', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

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
    { label: 'Fonctionnalités', href: '#features', id: 'features' },
    { label: 'Tarifs',          href: '#pricing',  id: 'pricing' },
    { label: 'Contact',         href: '#contact',   id: 'contact' },
  ];

  const scrollTo = (href) => {
    setMenuOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const navbarOffset = 72;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  return (
    <>
      <nav
        className="landing-nav-wrapper"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 2000,
          /* — Fond adapté au thème et à l'état de scroll ——————————————————————
             • Clair non-scrollé : blanc semi-transparent à 85% + légère teinte froide
               pour se distinguer du hero blanc sans être trop chargé
             • Clair scrollé    : --bg-card plein (blanc pur) + ombre + bordure
             • Sombre non-scrollé : noir semi-transparent 60%
             • Sombre scrollé   : --bg-card plein + ombre + bordure             */
          background: scrolled
            ? 'var(--bg-card)'
            : isDark
              ? 'rgba(15, 23, 42, 0.60)'
              : 'rgba(248, 250, 252, 0.85)',   /* blanc légèrement bleuté, distinct du hero */
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: isDark
            ? `1px solid ${scrolled ? 'var(--border-color)' : 'rgba(255,255,255,0.07)'}`
            : `1px solid ${scrolled ? 'var(--border-color)' : 'rgba(15,74,134,0.10)'}`,
          boxShadow: scrolled
            ? '0 2px 20px rgba(0,0,0,0.08)'
            : isDark ? 'none' : '0 1px 0 rgba(15,74,134,0.06)',
          transition: 'all 0.35s ease',
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
            <img
              src={logo}
              alt="dls POS"
              style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                objectFit: 'cover',
                boxShadow: '0 2px 8px rgba(37,99,235,0.18)',
              }}
            />
            <span style={{
              fontSize: '22px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563eb, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}>
              dls POS
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
            {navLinks.map(({ label, href, id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className={`landing-nav-link-btn ${isActive ? 'active' : ''}`}
                  style={{
                    background: isActive ? 'rgba(37,99,235,0.12)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--text-main)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── CTAs DESKTOP ── */}
          <div className="landing-nav-ctas" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={() => onNavigate ? onNavigate('auth') : scrollTo('#auth')}
              className="landing-nav-outline-btn"
              style={{
                background: 'none',
                border: '1.5px solid var(--color-primary)',
                color: 'var(--color-primary)',
                fontWeight: 600,
                fontSize: '13px',
                padding: '8px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
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
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.38)';
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
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border-color)',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: '8px',
              flexShrink: 0,
            }}
          >
            <span style={{
              display: 'block', width: '18px', height: '2px',
              background: 'var(--text-main)',
              borderRadius: '2px',
              transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '18px', height: '2px',
              background: 'var(--text-main)',
              borderRadius: '2px',
              transition: 'all 0.3s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '18px', height: '2px',
              background: 'var(--text-main)',
              borderRadius: '2px',
              transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          </button>
        </div>

        {/* ── MENU MOBILE DROPDOWN ── */}
        <div
          style={{
            maxHeight: menuOpen ? '420px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.35s ease',
            background: 'var(--bg-card)',
            borderTop: menuOpen ? '1px solid var(--border-color)' : '1px solid transparent',
          }}
        >
          <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="landing-nav-link-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-main)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}

            <div style={{
              borderTop: '1px solid var(--border-color)',
              marginTop: '8px',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <button
                onClick={() => { setMenuOpen(false); onNavigate && onNavigate('auth'); }}
                style={{
                  background: 'none',
                  border: '1.5px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
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

      {/* ── STYLES RESPONSIVE + HOVER ── */}
      <style>{`
        /* Responsive : affichage mobile/desktop */
        @media (max-width: 768px) {
          .landing-nav-links,
          .landing-nav-ctas { display: none !important; }
          .landing-burger { display: flex !important; }
        }

        /* Hover des liens de navigation */
        .landing-nav-link-btn:hover {
          color: var(--color-primary) !important;
          background: var(--bg-input) !important;
        }

        /* Hover bouton outline */
        .landing-nav-outline-btn:hover {
          background: var(--bg-input) !important;
        }
      `}</style>
    </>
  );
};
