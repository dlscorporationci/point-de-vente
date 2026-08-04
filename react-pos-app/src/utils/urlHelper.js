/**
 * Utilitaire de résolution d'URL dynamique pour la production et le développement local.
 * Évite de fixer "http://127.0.0.1:8000" en dur et s'adapte au domaine réel de production.
 */
export const getAssetUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;

  const origin = typeof window !== 'undefined'
    ? ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (window.location.port === '5173' || window.location.port === '3000')
        ? 'http://127.0.0.1:8000'
        : window.location.origin)
    : '';

  return `${origin}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
};
