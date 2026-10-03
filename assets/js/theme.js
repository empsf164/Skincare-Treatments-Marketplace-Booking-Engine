/**
 * LUMÉA - Theme Configuration Module
 * Standardized Light Theme across all pages.
 */

(function () {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('lumea_theme_preference', 'light');

  window.LumeaTheme = {
    get: () => 'light',
    set: () => {},
    toggle: () => {}
  };
})();
