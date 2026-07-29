import React, { useEffect, useState, useRef } from 'react';
import logo from '../assets/logo.jpg';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { SocialProofBar } from '../components/SocialProofBar';

/* ── Compteur animé ── */
const CountUp = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(target * ease));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>;
};

export const Home = ({ setActiveTab }) => {
  const { user } = useApp();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: 'fa-cash-register',
      color: '#3b82f6',
      title: 'Terminal Caisse Tactile',
      desc: 'Interface POS ultra-rapide optimisée pour les écrans tactiles. Scan code-barres, calcul de monnaie automatique, tickets clients, gestion des remises et paiements mixtes.',
      tags: ['Scan code-barres', 'Mode hors-ligne', 'Tickets PDF']
    },
    {
      icon: 'fa-layer-group',
      color: '#10b981',
      title: 'Stocks & PAMP en Temps Réel',
      desc: 'Suivi instantané des niveaux de stock par boutique. Recalcul automatique du Prix d\'Achat Moyen Pondéré à chaque mouvement. Alertes de seuil critique configurables.',
      tags: ['Multi-entrepôts', 'Alertes stock', 'Inventaire']
    },
    {
      icon: 'fa-right-left',
      color: '#f59e0b',
      title: 'Transferts Inter-Boutiques',
      desc: 'Initiez des transferts de marchandises entre succursales avec circuit de validation intégré. Traçabilité complète, statuts en temps réel et réception automatique du stock.',
      tags: ['Validation', 'Traçabilité', 'Multi-sites']
    },
    {
      icon: 'fa-chart-line',
      color: '#8b5cf6',
      title: 'Rapports & Analyses',
      desc: 'Tableaux de bord financiers complets : CA journalier, marge brute, top produits, performance par caissier. Export PDF et Excel professionnel en un clic.',
      tags: ['Export PDF', 'CA en temps réel', 'KPIs']
    },
    {
      icon: 'fa-users-gear',
      color: '#ef4444',
      title: 'Gestion du Personnel',
      desc: 'Créez des comptes opérateurs avec rôles granulaires (Admin, Gérant, Caissier). Chaque action est horodatée et attribuée pour une traçabilité totale.',
      tags: ['Rôles', 'Audit trail', 'Multi-utilisateurs']
    },
    {
      icon: 'fa-store',
      color: '#06b6d4',
      title: 'Multi-Boutiques',
      desc: 'Gérez un réseau de boutiques depuis une interface centralisée. Chaque espace de travail est isolé avec ses stocks, caisses et équipes propres.',
      tags: ['Centralisation', 'Isolation données', 'Dashboard global']
    }
  ];

  const steps = [
    { num: '01', icon: 'fa-store', title: 'Créez votre boutique', desc: 'Configurez votre profil d\'entreprise, ajoutez vos boutiques et paramétrez votre catalogue produits.' },
    { num: '02', icon: 'fa-users', title: 'Invitez votre équipe', desc: 'Créez les comptes de vos caissiers, gérants et admins avec des niveaux d\'accès précis.' },
    { num: '03', icon: 'fa-cash-register', title: 'Ouvrez votre caisse', desc: 'Démarrez une session de caisse, vendez vos produits et encaissez en quelques secondes.' },
    { num: '04', icon: 'fa-chart-pie', title: 'Analysez vos résultats', desc: 'Consultez vos rapports en temps réel et prenez des décisions éclairées basées sur vos données.' },
  ];

  return (
    <div className="home-v2">

      {/* ══════════ NAVBAR FIXE ══════════ */}
      <Navbar onNavigate={setActiveTab} />

      {/* ══════════ HERO ══════════ */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-bolt me-2" style={{ color: '#fbbf24' }}></i>
            Logiciel POS Professionnel — Multi-boutiques &amp; Multi-entreprises
          </div>

          <div className="hero-logo-wrap">
            <img src={logo} alt="ApexPOS" className="hero-logo" />
            <div className="hero-logo-ring" />
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">ApexPOS</span>
            <br />
            <span>La caisse intelligente</span>
            <br />
            <span className="hero-title-sub">de votre commerce</span>
          </h1>

          <p className="hero-desc">
            Gérez vos ventes, stocks, transferts et équipes depuis une plateforme unifiée.
            Conçue pour les boutiques modernes qui veulent aller vite et voir loin.
          </p>

          <div className="hero-actions">
            {user ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('dashboard')} className="btn-hero-primary">
                  <i className="fa-solid fa-gauge-high me-2"></i> Accéder au Dashboard
                </button>
                <button onClick={() => setActiveTab('pos')} className="btn-hero-secondary">
                  <i className="fa-solid fa-cash-register me-2"></i> Caisse Tactile
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setActiveTab('auth')} className="btn-hero-primary">
                  <i className="fa-solid fa-key me-2"></i> Se Connecter
                </button>
                <button onClick={() => setActiveTab('register')} className="btn-hero-secondary">
                  <i className="fa-solid fa-rocket me-2"></i> Démarrer gratuitement
                </button>
              </>
            )}
          </div>

          {/* ══════════ SOCIAL PROOF BAR ══════════ */}
          {!user && <SocialProofBar />}

          <div className="hero-trust">
            <div className="trust-item">
              <i className="fa-solid fa-shield-check text-success"></i>
              <span>Données sécurisées</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <i className="fa-solid fa-cloud text-primary"></i>
              <span>Accessible partout</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <i className="fa-solid fa-headset text-warning"></i>
              <span>Support inclus</span>
            </div>
          </div>
        </div>

        {/* Mockup flottant */}
        <div className="hero-mockup">
          <div className="mockup-card">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span style={{ background: '#ef4444' }} />
                <span style={{ background: '#fbbf24' }} />
                <span style={{ background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ApexPOS — Terminal</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-stat">
                <div className="mockup-stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                  <i className="fa-solid fa-arrow-trend-up"></i>
                </div>
                <div>
                  <div className="mockup-stat-val">847 500 XOF</div>
                  <div className="mockup-stat-lbl">CA du jour</div>
                </div>
                <span className="mockup-badge-up">+12%</span>
              </div>
              <div className="mockup-divider" />
              <div className="mockup-stat">
                <div className="mockup-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div>
                  <div className="mockup-stat-val">34 ventes</div>
                  <div className="mockup-stat-lbl">Transactions</div>
                </div>
                <span className="mockup-badge-up">+5</span>
              </div>
              <div className="mockup-divider" />
              <div className="mockup-stat">
                <div className="mockup-stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div>
                  <div className="mockup-stat-val">1 243 articles</div>
                  <div className="mockup-stat-lbl">En stock</div>
                </div>
                <span className="mockup-badge-warn">3 alertes</span>
              </div>
              <div className="mockup-pos-preview">
                <div className="mockup-pos-row">
                  <span>Câble USB-C × 3</span><span>4 500 XOF</span>
                </div>
                <div className="mockup-pos-row">
                  <span>Chargeur 65W</span><span>12 000 XOF</span>
                </div>
                <div className="mockup-pos-row highlight">
                  <span><strong>TOTAL</strong></span><span><strong>16 500 XOF</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { val: 50000, suffix: '+', label: 'Transactions traitées', icon: 'fa-receipt', color: '#3b82f6' },
            { val: 99, suffix: '.9%', label: 'Disponibilité garantie', icon: 'fa-server', color: '#10b981' },
            { val: 8, suffix: ' sec', label: 'Temps moyen par vente', icon: 'fa-bolt', color: '#f59e0b' },
            { val: 100, suffix: '%', label: 'Multi-boutiques natif', icon: 'fa-store', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.color + '22', color: s.color }}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              <div className="stat-val" style={{ color: s.color }}>
                <CountUp target={s.val} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FONCTIONNALITÉS ══════════ */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-badge">
            <i className="fa-solid fa-cube me-2"></i>Fonctionnalités
          </div>
          <h2 className="section-title">Tout ce dont votre commerce a besoin</h2>
          <p className="section-subtitle">Une suite complète d'outils pensés pour les commerces modernes</p>
        </div>

        <div className="features-tabs-layout">
          <div className="features-tab-list">
            {features.map((f, i) => (
              <button
                key={i}
                className={`feature-tab-btn ${activeFeature === i ? 'active' : ''}`}
                onClick={() => setActiveFeature(i)}
                style={{ '--feat-color': f.color }}
              >
                <div className="feat-tab-icon" style={{ background: f.color + '22', color: f.color }}>
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <span>{f.title}</span>
                {activeFeature === i && <i className="fa-solid fa-chevron-right ms-auto feat-arrow"></i>}
              </button>
            ))}
          </div>

          <div className="features-detail-panel">
            {features[activeFeature] && (
              <div className="feat-detail" key={activeFeature}>
                <div className="feat-detail-icon" style={{ background: features[activeFeature].color + '22', color: features[activeFeature].color }}>
                  <i className={`fa-solid ${features[activeFeature].icon}`}></i>
                </div>
                <h3 className="feat-detail-title">{features[activeFeature].title}</h3>
                <p className="feat-detail-desc">{features[activeFeature].desc}</p>
                <div className="feat-detail-tags">
                  {features[activeFeature].tags.map((t, i) => (
                    <span key={i} className="feat-tag" style={{ borderColor: features[activeFeature].color + '55', color: features[activeFeature].color }}>
                      <i className="fa-solid fa-check me-1"></i>{t}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-feat-action"
                  style={{ background: features[activeFeature].color }}
                  onClick={() => setActiveTab(user ? 'pos' : 'auth')}
                >
                  <i className="fa-solid fa-arrow-right me-2"></i>
                  {user ? 'Accéder maintenant' : 'Essayer gratuitement'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ COMMENT ÇA MARCHE ══════════ */}
      <section className="steps-section">
        <div className="section-header">
          <div className="section-badge">
            <i className="fa-solid fa-map me-2"></i>Démarrage rapide
          </div>
          <h2 className="section-title">Opérationnel en 4 étapes</h2>
          <p className="section-subtitle">Configurez votre système POS en moins de 10 minutes</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-num">{s.num}</div>
              <div className="step-icon-wrap">
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="step-arrow"><i className="fa-solid fa-arrow-right"></i></div>}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="cta-section">
        <div className="cta-orb-1" /><div className="cta-orb-2" />
        <div className="cta-content">
          <i className="fa-solid fa-cash-register cta-icon"></i>
          <h2 className="cta-title">Prêt à moderniser votre commerce ?</h2>
          <p className="cta-desc">Rejoignez les commerçants qui font confiance à ApexPOS pour gérer leur activité au quotidien.</p>
          <div className="cta-actions">
            <button onClick={() => setActiveTab('register')} className="btn-cta-primary">
              <i className="fa-solid fa-rocket me-2"></i> Créer mon compte gratuitement
            </button>
            <button onClick={() => setActiveTab('auth')} className="btn-cta-secondary">
              <i className="fa-solid fa-key me-2"></i> J'ai déjà un compte
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .home-v2 {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          padding: 108px 40px 80px;
          overflow: hidden;
          flex-wrap: wrap;
        }

        .hero-bg-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(var(--border-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
          z-index: 0;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: orb-float 8s ease-in-out infinite;
        }
        .hero-orb-1 { width: 500px; height: 500px; background: var(--color-primary); top: -100px; left: -100px; }
        .hero-orb-2 { width: 400px; height: 400px; background: #10b981; bottom: -100px; right: 200px; animation-delay: -3s; }
        .hero-orb-3 { width: 300px; height: 300px; background: #8b5cf6; top: 50%; right: -50px; animation-delay: -6s; }

        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 20px;
          max-width: 580px; flex: 1;
        }

        .hero-badge {
          display: inline-flex; align-items: center;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.3);
          color: var(--color-primary);
          padding: 6px 16px; border-radius: 50px;
          font-size: 13px; font-weight: 600;
          animation: badge-in 0.6s ease;
        }
        @keyframes badge-in { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }

        .hero-logo-wrap {
          position: relative; display: inline-block;
        }
        .hero-logo {
          width: 90px; height: 90px; border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--color-primary);
          box-shadow: 0 0 30px rgba(59,130,246,0.4);
          animation: logo-in 0.8s ease;
        }
        .hero-logo-ring {
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 2px dashed rgba(59,130,246,0.4);
          animation: spin 12s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes logo-in { from { opacity:0; transform: scale(0.8); } to { opacity:1; transform: scale(1); } }

        .hero-title {
          font-family: var(--font-title);
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 900; line-height: 1.1;
          color: var(--text-main); margin: 0;
          animation: title-in 0.8s 0.2s ease both;
        }
        .hero-title-sub { font-size: 0.7em; font-weight: 600; color: var(--text-muted); }
        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary), #10b981, #8b5cf6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes title-in { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

        .hero-desc {
          font-size: 17px; color: var(--text-muted);
          line-height: 1.7; margin: 0; max-width: 500px;
          animation: title-in 0.8s 0.4s ease both;
        }

        .hero-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          animation: title-in 0.8s 0.6s ease both;
        }
        .btn-hero-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--color-primary), #2563eb);
          color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          box-shadow: 0 8px 24px rgba(59,130,246,0.4);
          transition: all 0.2s; display: flex; align-items: center;
        }
        .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(59,130,246,0.5); }
        .btn-hero-secondary {
          padding: 14px 32px;
          background: var(--bg-card); color: var(--text-main);
          border: 1px solid var(--border-color); border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center;
        }
        .btn-hero-secondary:hover { border-color: var(--color-primary); color: var(--color-primary); transform: translateY(-2px); }

        .hero-trust {
          display: flex; align-items: center; gap: 16px;
          flex-wrap: wrap; animation: title-in 0.8s 0.8s ease both;
        }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); }
        .trust-divider { width: 1px; height: 16px; background: var(--border-color); }

        /* Mockup */
        .hero-mockup {
          position: relative; z-index: 2; flex: 1;
          max-width: 360px; min-width: 280px;
          animation: mockup-in 1s 0.4s ease both;
        }
        @keyframes mockup-in { from { opacity:0; transform: translateY(30px) rotate(2deg); } to { opacity:1; transform: translateY(0) rotate(0); } }

        .mockup-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.15);
          overflow: hidden;
          transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
          transition: transform 0.4s ease;
        }
        .mockup-card:hover { transform: perspective(1000px) rotateY(0deg) rotateX(0deg); }
        .mockup-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-input);
          border-bottom: 1px solid var(--border-color);
        }
        .mockup-dots { display: flex; gap: 6px; }
        .mockup-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .mockup-stat {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; background: var(--bg-input);
          border-radius: 10px; border: 1px solid var(--border-color);
        }
        .mockup-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .mockup-stat-val { font-size: 14px; font-weight: 800; color: var(--text-main); }
        .mockup-stat-lbl { font-size: 11px; color: var(--text-muted); }
        .mockup-badge-up {
          margin-left: auto; background: rgba(16,185,129,0.15);
          color: #10b981; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700;
        }
        .mockup-badge-warn {
          margin-left: auto; background: rgba(245,158,11,0.15);
          color: #f59e0b; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700;
        }
        .mockup-divider { height: 1px; background: var(--border-color); }
        .mockup-pos-preview {
          background: var(--bg-input); border-radius: 10px; padding: 10px 12px;
          border: 1px solid var(--border-color);
          display: flex; flex-direction: column; gap: 6px;
        }
        .mockup-pos-row {
          display: flex; justify-content: space-between;
          font-size: 12px; color: var(--text-muted); padding: 2px 0;
        }
        .mockup-pos-row.highlight {
          color: var(--text-main); padding-top: 8px;
          border-top: 1px solid var(--border-color); margin-top: 4px;
        }

        /* ── STATS ── */
        .stats-section {
          padding: 60px 40px;
          background: var(--bg-input);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px; max-width: 1100px; margin: 0 auto;
        }
        .stat-card {
          display: flex; flex-direction: column;
          align-items: center; gap: 10px; text-align: center;
          padding: 28px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); }
        .stat-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .stat-val { font-size: 32px; font-weight: 900; font-family: var(--font-title); }
        .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 600; }

        /* ── SECTION HEADER ── */
        .section-header { text-align: center; margin-bottom: 48px; }
        .section-badge {
          display: inline-flex; align-items: center;
          background: var(--bg-input); border: 1px solid var(--border-color);
          color: var(--text-muted); padding: 5px 14px;
          border-radius: 50px; font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-title); font-size: clamp(24px, 3vw, 36px);
          font-weight: 900; color: var(--text-main); margin: 0 0 12px;
        }
        .section-subtitle { font-size: 16px; color: var(--text-muted); margin: 0; }

        /* ── FEATURES ── */
        .features-section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
        .features-tabs-layout {
          display: grid; grid-template-columns: 1fr 1.4fr; gap: 32px;
        }
        @media (max-width: 768px) { .features-tabs-layout { grid-template-columns: 1fr; } }

        .features-tab-list { display: flex; flex-direction: column; gap: 8px; }
        .feature-tab-btn {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 14px;
          background: transparent; border: 1px solid var(--border-color);
          color: var(--text-muted); font-size: 14px; font-weight: 600;
          cursor: pointer; text-align: left; transition: all 0.2s;
          position: relative;
        }
        .feature-tab-btn:hover { background: var(--bg-input); color: var(--text-main); }
        .feature-tab-btn.active {
          background: var(--bg-input);
          border-color: var(--feat-color, var(--color-primary));
          color: var(--text-main);
          box-shadow: 0 0 0 1px var(--feat-color, var(--color-primary));
        }
        .feat-tab-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .feat-arrow { font-size: 12px; opacity: 0.6; }

        .features-detail-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px; padding: 36px;
          display: flex; flex-direction: column; gap: 20px;
          min-height: 320px;
        }
        .feat-detail { display: flex; flex-direction: column; gap: 16px; animation: feat-in 0.3s ease; }
        @keyframes feat-in { from { opacity:0; transform: translateX(10px); } to { opacity:1; transform: translateX(0); } }
        .feat-detail-icon {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center; font-size: 24px;
        }
        .feat-detail-title {
          font-family: var(--font-title); font-size: 22px; font-weight: 800;
          color: var(--text-main); margin: 0;
        }
        .feat-detail-desc { font-size: 15px; color: var(--text-muted); line-height: 1.7; margin: 0; }
        .feat-detail-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .feat-tag {
          padding: 4px 12px; border-radius: 50px;
          border: 1px solid; font-size: 12px; font-weight: 700;
          display: flex; align-items: center;
        }
        .btn-feat-action {
          display: inline-flex; align-items: center;
          padding: 12px 24px; border-radius: 10px;
          color: #fff; border: none; font-size: 14px; font-weight: 700;
          cursor: pointer; align-self: flex-start;
          transition: all 0.2s; margin-top: auto;
        }
        .btn-feat-action:hover { filter: brightness(1.1); transform: translateY(-1px); }

        /* ── STEPS ── */
        .steps-section {
          padding: 80px 40px;
          background: var(--bg-input);
          border-top: 1px solid var(--border-color);
        }
        .steps-section .section-header { max-width: 1100px; margin: 0 auto 48px; }
        .steps-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0; max-width: 1100px; margin: 0 auto;
          position: relative;
        }
        .step-card {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; text-align: center; padding: 32px 24px;
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 0;
        }
        .step-card:first-child { border-radius: 16px 0 0 16px; }
        .step-card:last-child { border-radius: 0 16px 16px 0; }
        @media (max-width: 768px) {
          .step-card:first-child { border-radius: 16px 16px 0 0; }
          .step-card:last-child { border-radius: 0 0 16px 16px; }
        }
        .step-num {
          font-size: 11px; font-weight: 900; letter-spacing: 2px;
          color: var(--color-primary); text-transform: uppercase;
          background: rgba(59,130,246,0.1); padding: 3px 10px; border-radius: 50px;
        }
        .step-icon-wrap {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), #10b981);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 22px; box-shadow: 0 8px 20px rgba(59,130,246,0.3);
        }
        .step-title { font-family: var(--font-title); font-size: 16px; font-weight: 800; color: var(--text-main); margin: 0; }
        .step-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0; }
        .step-arrow {
          position: absolute; right: -18px; top: 50%;
          transform: translateY(-50%); z-index: 10;
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--color-primary); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; box-shadow: 0 4px 12px rgba(59,130,246,0.4);
        }
        @media (max-width: 768px) { .step-arrow { display: none; } }

        /* ── CTA ── */
        .cta-section {
          position: relative; padding: 100px 40px;
          overflow: hidden; text-align: center;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-input));
          border-top: 1px solid var(--border-color);
        }
        .cta-orb-1, .cta-orb-2 {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.12;
        }
        .cta-orb-1 { width: 400px; height: 400px; background: var(--color-primary); top: -100px; left: -100px; }
        .cta-orb-2 { width: 300px; height: 300px; background: #10b981; bottom: -50px; right: -50px; }
        .cta-content { position: relative; z-index: 2; max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .cta-icon { font-size: 48px; color: var(--color-primary); animation: icon-pulse 2s ease-in-out infinite; }
        @keyframes icon-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .cta-title { font-family: var(--font-title); font-size: clamp(24px, 3vw, 36px); font-weight: 900; color: var(--text-main); margin: 0; }
        .cta-desc { font-size: 16px; color: var(--text-muted); margin: 0; line-height: 1.6; }
        .cta-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .btn-cta-primary {
          padding: 16px 36px;
          background: linear-gradient(135deg, var(--color-primary), #2563eb);
          color: #fff; border: none; border-radius: 14px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          box-shadow: 0 8px 24px rgba(59,130,246,0.4);
          display: flex; align-items: center; transition: all 0.2s;
        }
        .btn-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(59,130,246,0.5); }
        .btn-cta-secondary {
          padding: 16px 36px;
          background: var(--bg-card); color: var(--text-main);
          border: 1px solid var(--border-color); border-radius: 14px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .btn-cta-secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }
      `}</style>
    </div>
  );
};
