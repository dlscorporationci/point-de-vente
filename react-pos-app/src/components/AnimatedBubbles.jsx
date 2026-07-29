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
    <div className="js-bubbles-container no-print" style={{ pointerEvents: 'none' }}>
      {/* Fond statique sans animation de mouvement */}
    </div>
  );
};
