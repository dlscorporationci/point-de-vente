import React from 'react';

// Graphique 1 : Évolution des revenus mensuels (SVG Line Chart)
export const RevenueLineChart = ({ data = [] }) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const values = data.length > 0 ? data : [1200000, 1900000, 1500000, 2500000, 2200000, 3100000, 4200000, 3900000, 4500000, 5100000, 6200000, 7500000];
  
  const maxValue = Math.max(...values, 1000000) * 1.15;
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 35;

  const points = values.map((val, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (values.length - 1);
    const y = chartHeight - padding - (val * (chartHeight - padding * 2)) / maxValue;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="saas-chart-box card">
      <h4 className="chart-title"><i className="fa-solid fa-chart-line me-2 text-primary"></i> Évolution des revenus annuels (XOF)</h4>
      <div className="svg-chart-container">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
          <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grille horizontale */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
            const y = padding + r * (chartHeight - padding * 2);
            return (
              <line key={idx} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--border-color)" strokeDasharray="4 4" />
            );
          })}

          {/* Zone de remplissage dégradée */}
          <path d={areaD} fill="url(#chart-area-grad)" className="chart-area-path" />

          {/* Ligne principale */}
          <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" className="chart-line-path" />

          {/* Points de données interactifs */}
          {points.map((p, idx) => (
            <g key={idx} className="chart-interactive-point">
              <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-card)" stroke="var(--color-primary)" strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="10" fill="var(--color-primary)" opacity="0" className="hover-pulse" />
              <title>{months[idx]} : {new Intl.NumberFormat('fr-FR').format(p.val)} XOF</title>
            </g>
          ))}

          {/* Libellés de l'axe X */}
          {points.map((p, idx) => (
            <text key={idx} x={p.x} y={chartHeight - 10} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600">
              {months[idx]}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Graphique 2 : Répartition des moyens de paiement (Bar Chart)
export const PaymentMethodsBarChart = ({ data = [] }) => {
  const defaultData = [
    { payment_method: 'cash', total: 4200000 },
    { payment_method: 'card', total: 1500000 },
    { payment_method: 'credit', total: 900000 }
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const maxTotal = Math.max(...chartData.map(d => parseFloat(d.total) || 1), 1);

  const getMethodLabel = (m) => {
    const map = { cash: 'Espèces', card: 'Carte', credit: 'Crédit' };
    return map[m] || m;
  };

  const getMethodColor = (m) => {
    const map = { cash: '#00A651', card: '#0F4A86', credit: '#EF4444' };
    return map[m] || 'var(--text-muted)';
  };

  return (
    <div className="saas-chart-box card">
      <h4 className="chart-title"><i className="fa-solid fa-chart-simple me-2 text-primary"></i> Répartition des transactions par mode de paiement</h4>
      <div className="bar-chart-container">
        {chartData.map((item, idx) => {
          const totalVal = parseFloat(item.total) || 0;
          const percentage = (totalVal / maxTotal) * 100;
          const color = getMethodColor(item.payment_method);

          return (
            <div className="bar-row" key={idx}>
              <span className="bar-label">{getMethodLabel(item.payment_method)}</span>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ 
                    '--target-width': `${percentage}%`, 
                    backgroundColor: color 
                  }} 
                />
              </div>
              <span className="bar-value">{new Intl.NumberFormat('fr-FR').format(totalVal)} XOF</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .saas-chart-box {
          padding: 24px;
          height: 100%;
          min-height: 260px;
        }

        .chart-title {
          font-family: var(--font-title);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 18px;
          color: var(--text-main);
        }

        /* Line Chart SVG */
        .svg-chart-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .svg-chart {
          width: 100%;
          overflow: visible;
        }

        .chart-line-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s forwards ease-in-out;
        }

        .chart-area-path {
          opacity: 0;
          animation: fadeIn 1.5s 0.8s forwards;
        }

        .chart-interactive-point {
          cursor: pointer;
        }

        .chart-interactive-point:hover .hover-pulse {
          opacity: 0.3;
          r: 15px;
          transition: all 0.2s;
        }

        /* Bar Chart */
        .bar-chart-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: center;
          height: calc(100% - 40px);
        }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-label {
          width: 80px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-align: left;
        }

        .bar-track {
          flex: 1;
          height: 10px;
          background: var(--bg-input);
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .bar-fill {
          height: 100%;
          border-radius: 5px;
          width: 0;
          animation: expandWidth 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .bar-value {
          width: 100px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-main);
          text-align: right;
        }

        /* Animations */
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes expandWidth {
          to { width: var(--target-width); }
        }
      `}</style>
    </div>
  );
};
