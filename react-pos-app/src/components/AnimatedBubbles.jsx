import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export const AnimatedBubbles = () => {
  const { uiKit } = useApp();
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Génère 25 bulles plus grandes et plus opaques pour être bien visibles
    const initialBubbles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 100 + 50, // 50px à 150px
      left: Math.random() * 100, // 0% à 100%
      delay: Math.random() * 8, // 0s à 8s
      duration: Math.random() * 15 + 12, // 12s à 27s
      opacity: Math.random() * 0.3 + 0.25, // Opacité de 25% à 55%
    }));
    setBubbles(initialBubbles);
  }, []);

  // Couleur de bulle bleue DLS (plus saturée et visible)
  const bubbleColor = 'rgba(15, 74, 134, 0.85)';

  return (
    <div className="js-bubbles-container no-print">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="js-bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            opacity: b.opacity,
            background: `radial-gradient(circle, ${bubbleColor} 0%, rgba(15, 74, 134, 0) 70%)`,
          }}
        />
      ))}
      <style>{`
        .js-bubbles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .js-bubble {
          position: absolute;
          bottom: -130px;
          border-radius: 50%;
          animation: floatUp infinite linear;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: var(--bubble-opacity, 0.12);
          }
          90% {
            opacity: var(--bubble-opacity, 0.12);
          }
          100% {
            transform: translateY(-115vh) scale(1.25);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
