/**
 * Lagodiv Lake Resort — Main ES Module Entrypoint
 */
export function initLagodivApp() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initLagodivApp);
}
