import React, { useState, useEffect } from 'react';

export const CountUp = ({ end, duration = 1000, prefix = '', suffix = '', format = true }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = parseFloat(end) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(progress * endValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  const displayValue = format 
    ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)
    : Math.round(value);

  return (
    <span>
      {prefix}{displayValue}{suffix}
    </span>
  );
};
