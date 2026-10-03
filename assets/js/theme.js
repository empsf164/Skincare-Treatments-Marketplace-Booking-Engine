/**
 * LUMÉA - Theme Management Module
 * Supports Dark/Light mode, OS preference sync, and localStorage persistence.
 */

(function () {
  const THEME_STORAGE_KEY = 'lumea_theme_preference';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeToggleIcons(theme);
  }

  function updateThemeToggleIcons(theme) {
    const toggleButtons = document.querySelectorAll('.btn-theme-toggle');
    toggleButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('aria-label', 'Switch to Light Mode');
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });
  }

  function initTheme() {
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    // Bind all theme toggle buttons
    document.addEventListener('DOMContentLoaded', () => {
      updateThemeToggleIcons(getPreferredTheme());

      document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          const next = current === 'dark' ? 'light' : 'dark';
          applyTheme(next);
          if (window.LumeaNotifications) {
            window.LumeaNotifications.show(
              `${next.charAt(0).toUpperCase() + next.slice(1)} mode enabled`,
              'info'
            );
          }
        });
      });
    });

    // Listen to system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Execute immediately to prevent flash
  initTheme();

  window.LumeaTheme = {
    get: getPreferredTheme,
    set: applyTheme,
    toggle: () => {
      const current = getPreferredTheme();
      applyTheme(current === 'dark' ? 'light' : 'dark');
    }
  };
})();
