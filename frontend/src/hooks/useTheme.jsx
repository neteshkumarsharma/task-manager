import { useCallback, useEffect, useState } from 'react';

/**
 * useTheme hook
 * - reads localStorage 'theme' ('light' | 'dark') if present
 * - falls back to prefers-color-scheme
 * - applies data-theme attribute on document.documentElement
 * - returns { theme, toggleTheme, setTheme }
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // ignore
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const applyTheme = useCallback((t) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('theme', t);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    // respond to system changes if user hasn't explicitly set a preference
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e) {
      try {
        const saved = localStorage.getItem('theme');
        if (saved !== 'light' && saved !== 'dark') {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch (err) {
        // ignore
      }
    }
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    } else if (mq && mq.addListener) {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
    return undefined;
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    applyTheme(t);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
      }
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  return { theme, toggleTheme, setTheme };
}