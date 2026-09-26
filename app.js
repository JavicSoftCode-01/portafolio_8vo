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
   * Theme Controller (Dark / Light)
   * Restores preference from localStorage or prefers-color-scheme
   * Updates HTML class and aria-pressed on theme toggle button
   */
  const initThemeController = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');
    AppState.theme = currentTheme;

    const applyTheme = (theme) => {
      AppState.theme = theme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      if (themeToggleBtn) {
        const isDark = theme === 'dark';
        themeToggleBtn.setAttribute('aria-pressed', String(isDark));
        themeToggleBtn.setAttribute(
          'aria-label',
          isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
        );
      }
    };

    applyTheme(currentTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = AppState.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }
  };

  /**
   * Mobile Navigation Drawer Controller
   * Handles toggling, ARIA state, Escape key dismissal and link navigation
   */
  const initMobileNavigation = () => {
    const menuToggleBtn = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggleBtn || !primaryNav) return;

    const setMenuState = (isOpen) => {
      menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
      menuToggleBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      if (isOpen) {
        primaryNav.classList.add('is-open');
      } else {
        primaryNav.classList.remove('is-open');
      }
    };

    menuToggleBtn.addEventListener('click', () => {
      const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuState(!isExpanded);
    });

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        setMenuState(false);
        menuToggleBtn.focus();
      }
    });

    // Close when clicking outside header
    document.addEventListener('click', (event) => {
      const siteHeader = document.querySelector('.site-header');
      if (siteHeader && !siteHeader.contains(event.target) && primaryNav.classList.contains('is-open')) {
        setMenuState(false);
      }
    });
  };

  /**
   * Main Application Lifecycle Bootstrap
   * Safe execution guaranteed after DOM is fully parsed
   */
  const initApp = () => {
    initMotionPreferences();
    initThemeController();
    initMobileNavigation();
    // Subsequent component controllers will be registered here across phases
  };

  // Safe DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp, { once: true });
  } else {
    initApp();
  }
})();
