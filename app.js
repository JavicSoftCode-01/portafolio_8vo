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
   * Hero Visual Microinteractions
   * Adds subtle 3D tilt perspective and parallax on floating chips
   * Fully bypasses animation if user prefers reduced motion
   */
  const initHeroMicrointeractions = () => {
    const heroVisual = document.getElementById('hero-visual-card');
    if (!heroVisual) return;

    const portraitCard = heroVisual.querySelector('.portrait-card');
    const chipExperience = heroVisual.querySelector('.chip-experience');
    const chipDiscipline = heroVisual.querySelector('.chip-discipline');

    if (!portraitCard) return;

    let isHovering = false;
    let rafId = null;

    const resetTransformations = () => {
      portraitCard.style.transform = '';
      if (chipExperience) chipExperience.style.transform = '';
      if (chipDiscipline) chipDiscipline.style.transform = '';
    };

    heroVisual.addEventListener('mouseenter', () => {
      if (AppState.reducedMotion) return;
      isHovering = true;
    });

    heroVisual.addEventListener('mousemove', (event) => {
      if (AppState.reducedMotion || !isHovering) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = heroVisual.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4; // Max -4 to 4 deg
        const rotateY = ((x - centerX) / centerX) * 4;  // Max -4 to 4 deg

        portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

        const shiftX = ((x - centerX) / centerX) * 6;
        const shiftY = ((y - centerY) / centerY) * 6;

        if (chipExperience) {
          chipExperience.style.transform = `translate3d(${-shiftX.toFixed(1)}px, ${-shiftY.toFixed(1)}px, 12px)`;
        }
        if (chipDiscipline) {
          chipDiscipline.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 12px)`;
        }
      });
    });

    heroVisual.addEventListener('mouseleave', () => {
      isHovering = false;
      if (rafId) cancelAnimationFrame(rafId);
      resetTransformations();
    });

    // Reset immediately if reduced motion is toggled at system level
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) resetTransformations();
    });
  };

  /**
   * Metrics Counting Animation (Sobre Mí)
   * Progressive numeric interpolation using requestAnimationFrame and cubic-out easing
   * Bypasses counting immediately if user prefers reduced motion
   */
  const initMetricsCounter = () => {
    const metricValues = document.querySelectorAll('.metric-value[data-target]');
    if (!metricValues.length) return;

    const animateNumber = (element) => {
      const target = parseInt(element.getAttribute('data-target') || '0', 10);
      const suffix = element.getAttribute('data-suffix') || '';

      if (AppState.reducedMotion || target === 0) {
        element.textContent = `${target}${suffix}`;
        return;
      }

      const duration = 1200; // ms
      const startTime = performance.now();

      const updateFrame = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease out
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        element.textContent = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateFrame);
        } else {
          element.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateFrame);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateNumber(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      metricValues.forEach((el) => observer.observe(el));
    } else {
      metricValues.forEach((el) => animateNumber(el));
    }
  };

  /**
   * Sequential Progress Bars Animation (Habilidades)
   * Staggered width transition when skills section enters viewport
   * Instantly fills widths if prefers-reduced-motion is active
   */
  const initSkillsProgressBars = () => {
    const skillsSection = document.getElementById('habilidades');
    const progressFills = document.querySelectorAll('.progress-fill[data-width]');
    if (!skillsSection || !progressFills.length) return;

    const fillBars = () => {
      progressFills.forEach((fill, index) => {
        const targetWidth = fill.getAttribute('data-width') || '0';

        if (AppState.reducedMotion) {
          fill.style.transition = 'none';
          fill.style.width = `${targetWidth}%`;
        } else {
          setTimeout(() => {
            fill.style.width = `${targetWidth}%`;
          }, index * 75); // Staggered 75ms cascade
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillBars();
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(skillsSection);
    } else {
      fillBars();
    }

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        progressFills.forEach((fill) => {
          fill.style.transition = 'none';
          fill.style.width = `${fill.getAttribute('data-width') || '0'}%`;
        });
      }
    });
  };

  /**
   * Dynamic Projects Filtering Controller
   * Real-time client filtering by category with ARIA status updates and animated transitions
   */
  const initProjectFilter = () => {
    const filterToolbar = document.getElementById('project-filters');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterToolbar || !filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-filter');
        if (!targetCategory) return;

        // Update active classes and ARIA pressed states
        filterButtons.forEach((b) => {
          const isSelected = b === btn;
          b.classList.toggle('active-filter', isSelected);
          b.setAttribute('aria-pressed', String(isSelected));
        });

        // Filter cards with smooth opacity / display transition
        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          const isMatch = targetCategory === 'all' || cardCategory === targetCategory;

          if (AppState.reducedMotion) {
            if (isMatch) {
              card.style.display = 'grid';
              card.style.opacity = '1';
              card.style.transform = 'none';
              card.hidden = false;
            } else {
              card.style.display = 'none';
              card.hidden = true;
            }
            return;
          }

          if (isMatch) {
            card.hidden = false;
            card.style.display = 'grid';
            // Trigger reflow for transition
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.97)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
                card.hidden = true;
              }
            }, 250);
          }
        });
      });
    });
  };

  /**
   * Token Clipboard Copy Controller (Sistema de Diseño)
   * Copies HEX values to clipboard and broadcasts status via ARIA live region
   */
  const initTokenClipboard = () => {
    const copyButtons = document.querySelectorAll('.btn-copy-token[data-copy]');
    const a11yAnnouncer = document.getElementById('a11y-announcer');

    const copyToken = async (hexValue, buttonEl) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(hexValue);
        } else {
          // Fallback for non-secure contexts
          const tempInput = document.createElement('input');
          tempInput.value = hexValue;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Visual Feedback on trigger button
        const originalHtml = buttonEl.innerHTML;
        buttonEl.innerHTML = `
          <span class="material-symbols-outlined copy-icon" aria-hidden="true" style="color: #10B981;">check</span>
          <span style="color: #10B981;">¡Copiado!</span>
        `;
        buttonEl.classList.add('btn-copied');

        // Accessible Screen Reader Announcement
        if (a11yAnnouncer) {
          a11yAnnouncer.textContent = `Token de color ${hexValue} copiado al portapapeles.`;
        }

        setTimeout(() => {
          buttonEl.innerHTML = originalHtml;
          buttonEl.classList.remove('btn-copied');
        }, 1800);
      } catch (err) {
        if (a11yAnnouncer) {
          a11yAnnouncer.textContent = `No se pudo copiar el token ${hexValue}.`;
        }
      }
    };

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hex = btn.getAttribute('data-copy');
        if (hex) copyToken(hex, btn);
      });
    });
  };

  /**
   * HTML Sanitization Utility
   * Prevents XSS attacks before reflecting any user-supplied content into the DOM
   */
  const escapeHtml = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  /**
   * Accessible Contact Form Controller
   * Real-time client-side validation, anti-XSS sanitization, and state announcements
   */
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('btn-submit-contact');
    const feedbackBanner = document.getElementById('form-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const a11yAnnouncer = document.getElementById('a11y-announcer');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setFieldError = (inputEl, errorEl, message) => {
      inputEl.classList.add('is-invalid');
      inputEl.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    };

    const clearFieldError = (inputEl, errorEl) => {
      inputEl.classList.remove('is-invalid');
      inputEl.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    };

    [nameInput, emailInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const errSpan = document.getElementById(`${input.name}-error`);
        clearFieldError(input, errSpan);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let isValid = true;
      let firstInvalidField = null;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setFieldError(nameInput, nameError, 'Por favor, introduce tu nombre completo.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = nameInput;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal || !emailRegex.test(emailVal)) {
        setFieldError(emailInput, emailError, 'Introduce un correo profesional válido.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal || messageVal.length < 10) {
        setFieldError(messageInput, messageError, 'El mensaje debe tener al menos 10 caracteres.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = messageInput;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (!isValid) {
        if (firstInvalidField) firstInvalidField.focus();
        if (a11yAnnouncer) {
          a11yAnnouncer.textContent = 'El formulario contiene errores. Por favor, corrígelos antes de enviar.';
        }
        return;
      }

      // Sanitize inputs
      const safeName = escapeHtml(nameVal);

      // Simulate secure submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = 'Enviar Mensaje';
        }

        if (feedbackBanner && feedbackText) {
          feedbackText.innerHTML = `¡Mensaje recibido con éxito, <strong>${safeName}</strong>! Me pondré en contacto contigo hoy mismo.`;
          feedbackBanner.classList.remove('hidden');
        }

        if (a11yAnnouncer) {
          a11yAnnouncer.textContent = `Mensaje enviado correctamente por ${safeName}.`;
        }

        form.reset();

        setTimeout(() => {
          if (feedbackBanner) feedbackBanner.classList.add('hidden');
        }, 8000);
      }, 700);
    });
  };

  /**
   * Accessible Smooth Scrolling with Retained Focus Controller
   * Handles keyboard focus transfer, URL hash synchronization, and screen-reader announcements
   */
  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const a11yAnnouncer = document.getElementById('a11y-announcer');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        event.preventDefault();

        // Respect user motion preference
        const scrollBehavior = AppState.reducedMotion ? 'auto' : 'smooth';
        targetEl.scrollIntoView({
          behavior: scrollBehavior,
          block: 'start'
        });

        // Sync browser history state
        if (history.pushState) {
          history.pushState(null, '', targetId);
        } else {
          window.location.hash = targetId;
        }

        // Transfer keyboard/screen reader focus securely
        if (!targetEl.hasAttribute('tabindex')) {
          targetEl.setAttribute('tabindex', '-1');
        }
        targetEl.focus({ preventScroll: true });

        // Announce section navigation
        if (a11yAnnouncer) {
          const heading = targetEl.querySelector('h1, h2, h3') || targetEl;
          const sectionLabel = heading.textContent ? heading.textContent.trim() : targetId.replace('#', '');
          a11yAnnouncer.textContent = `Navegado a la sección ${sectionLabel}.`;
        }
      });
    });
  };

  /**
   * Footer & Dynamic Metadata Controller
   * Synchronizes dynamic year and back-to-top status
   */
  const initFooter = () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = String(new Date().getFullYear());
    }
  };

  /**
   * Main Application Lifecycle Bootstrap
   * Safe execution guaranteed after DOM is fully parsed
   */
  const initApp = () => {
    initMotionPreferences();
    initThemeController();
    initMobileNavigation();
    initHeroMicrointeractions();
    initMetricsCounter();
    initSkillsProgressBars();
    initProjectFilter();
    initTokenClipboard();
    initContactForm();
    initSmoothScroll();
    initFooter();
  };

  // Safe DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp, { once: true });
  } else {
    initApp();
  }
})();






