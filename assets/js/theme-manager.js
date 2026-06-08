// Theme Manager
/* ============================================================
   THEME MANAGER — Dark / Light mode with localStorage persistence
   ============================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'ak-portfolio-theme';
  const ATTR = 'data-theme';
  let currentTheme = 'dark';

  /**
   * Initialize theme from localStorage or JSON default
   */
  function init(defaultMode = 'dark', allowToggle = true) {
    const saved = localStorage.getItem(STORAGE_KEY);
    currentTheme = saved || defaultMode || 'dark';
    apply(currentTheme);

    if (allowToggle) {
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.addEventListener('click', toggle);

      const mobileBtn = document.getElementById('theme-toggle-mobile');
      if (mobileBtn) mobileBtn.addEventListener('click', toggle);
    }
  }

  /**
   * Apply a theme to the document root
   */
  function apply(theme) {
    document.documentElement.setAttribute(ATTR, theme);
    currentTheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    updateMeta(theme);
  }

  /**
   * Toggle between light and dark
   */
  function toggle() {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    apply(next);
  }

  /**
   * Update theme-color meta tag for mobile browsers
   */
  function updateMeta(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#020817' : '#f8fafc');
    }
  }

  /**
   * Apply theme colors from JSON data
   */
  function applyColors(colors) {
    if (!colors) return;
    const root = document.documentElement;
    const map = {
      primary: '--clr-primary',
      accent: '--clr-accent',
    };
    Object.entries(map).forEach(([key, cssVar]) => {
      if (colors[key]) root.style.setProperty(cssVar, colors[key]);
    });
  }

  function getCurrent() { return currentTheme; }

  return { init, apply, toggle, applyColors, getCurrent };
})();