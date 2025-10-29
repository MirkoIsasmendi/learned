import React, { createContext, useContext, useEffect, useState } from 'react';

const APARIENCIA_KEY = 'cfg_apariencia_v1';

const ThemeContext = createContext({ mode: 'oscuro', setMode: () => {} });

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    try {
      const raw = localStorage.getItem(APARIENCIA_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.modoPreview || 'oscuro';
      }
    } catch (e) {
      // ignore
    }
    return 'oscuro';
  });

  useEffect(() => {
    // apply class to html element for tailwind/class-based dark mode
    const root = document.documentElement;
    if (mode === 'oscuro' || mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // also persist to localStorage (merge with existing apariencia object)
    try {
      const raw = localStorage.getItem(APARIENCIA_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const merged = { ...parsed, modoPreview: mode };
      localStorage.setItem(APARIENCIA_KEY, JSON.stringify(merged));
    } catch (e) {
      // ignore
    }
  }, [mode]);

  // listen to storage events (update from other tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === APARIENCIA_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.modoPreview && parsed.modoPreview !== mode) setModeState(parsed.modoPreview);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [mode]);

  const setMode = (next) => {
    setModeState(next);
  };

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
