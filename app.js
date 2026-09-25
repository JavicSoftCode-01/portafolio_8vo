/**
 * Elena Vance — Application Logic (app.js)
 * Clean frontend architecture, scoped execution & A11y motion validation
 */

(() => {
  'use strict';

  // Application State Hub
  const AppState = {
    reducedMotion: false,
    theme: 'dark'
  };

  /**
   * Evaluates user motion preferences via matchMedia
   * Listens for real-time operating system preference changes
   */
  const initMotionPreferences = () => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    AppState.reducedMotion = motionQuery.matches;

    motionQuery.addEventListener('change', (event) => {
      AppState.reducedMotion = event.matches;
      document.documentElement.dataset.reducedMotion = String(event.matches);
    });

    document.documentElement.dataset.reducedMotion = String(AppState.reducedMotion);
  };

  /**
   * Main Application Lifecycle Bootstrap
   * Safe execution guaranteed after DOM is fully parsed
   */
  const initApp = () => {
    initMotionPreferences();
    // Subsequent component controllers will be registered here across phases
  };

  // Safe DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp, { once: true });
  } else {
    initApp();
  }
})();
