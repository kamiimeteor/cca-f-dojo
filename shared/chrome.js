/* Shared theme bootstraps synchronously, before styles and body are parsed. */
(() => {
  'use strict';
  const script = document.currentScript;
  const app = script.dataset.app;
  const siteRoot = new URL('../', script.src);
  const isTheme = value => value === 'dark' || value === 'light';
  function readTheme(key) {
    try {
      const value = localStorage.getItem(key);
      const theme = key === 'signal0.theme' ? value : JSON.parse(value)?.prefs?.theme;
      return isTheme(theme) ? theme : undefined;
    } catch (_) { return undefined; }
  }
  function writeTheme(theme) {
    try { localStorage.setItem('signal0.theme', theme); } catch (_) {}
  }
  let theme = readTheme('signal0.theme');
  if (!theme) {
    // The hub retains CCA-F migration and also accepts the React archive.
    const keys = app === 'hub' ? ['ccae.v2', 'react-quiz-v1']
      : app === 'cca-f' ? ['ccae.v2'] : app === 'react' ? ['react-quiz-v1'] : [];
    for (const key of keys) {
      theme = readTheme(key);
      if (theme) break;
    }
  }
  if (!theme) {
    try { theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    catch (_) { theme = 'light'; }
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    const button = document.getElementById('themeBtn');
    if (button) {
      button.textContent = theme === 'dark' ? '☀' : '◐';
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }
  window.Signal0Chrome = { applyTheme, onThemeChange: null };
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    const themeButton = document.getElementById('themeBtn');
    if (themeButton) themeButton.onclick = () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      writeTheme(theme);
      try { window.Signal0Chrome.onThemeChange?.(theme); } catch (_) {}
      applyTheme();
    };
    const button = document.getElementById('appswitchBtn');
    const menu = document.getElementById('appswitchMenu');
    if (!button || !menu) return;
    function setAppMenu(open) {
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    }
    button.onclick = (e) => {
      setAppMenu(menu.hidden);
    };
    menu.querySelectorAll('a').forEach(link => {
      if (location.protocol === 'file:') {
        link.href = new URL(link.getAttribute('href').slice(1) + 'index.html', siteRoot).href;
      }
      link.onclick = () => setAppMenu(false);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.appswitch-wrap')) setAppMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        e.preventDefault();
        e.stopPropagation();
        setAppMenu(false);
        button.focus();
      }
    }, true);
  });
})();
