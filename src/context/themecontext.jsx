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
      // apply accent colors from persisted apariencia so custom outgoing/incoming
      // choices affect global CSS variables (so buttons and mapped tailwind classes update)
      try {
        const root = document.documentElement;
        const chatOutgoing = merged.chatOutgoing || merged.acento || undefined;
        const chatIncoming = merged.chatIncoming || undefined;
        if (chatOutgoing) {
          root.style.setProperty('--accent', chatOutgoing);
          // also map 'success' token (many green buttons) to the outgoing color
          root.style.setProperty('--success', chatOutgoing);
          // set a computed foreground for buttons that use var(--btn-primary-foreground)
          const text = readableTextColor(chatOutgoing);
          root.style.setProperty('--btn-primary-foreground', text);
        }
        if (chatIncoming) {
          // map incoming color to primary (used by other buttons) so "entrada" affects them
          root.style.setProperty('--primary', chatIncoming);
          root.style.setProperty('--accent-incoming', chatIncoming);
        }
      } catch (err) {
        // ignore CSS var application failures
      }
    } catch (e) {
      // ignore
    }
  }, [mode]);

  // small helper: decide readable foreground for a hex background (#rrggbb)
  function readableTextColor(hex) {
    try {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      // relative luminance formula
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance > 0.6 ? '#000' : '#fff';
    } catch (e) {
      return '#000';
    }
  }

  // Ensure a sensible default apariencia object exists for fresh installs
  useEffect(() => {
    try {
      const raw = localStorage.getItem(APARIENCIA_KEY);
      if (!raw) {
        const defaultApariencia = { modoPreview: 'oscuro', chatOutgoing: '#00FFA0', chatIncoming: '#7C5CFF' };
        localStorage.setItem(APARIENCIA_KEY, JSON.stringify(defaultApariencia));
        // ensure CSS variables reflect defaults
        try {
          const root = document.documentElement;
          root.style.setProperty('--accent', defaultApariencia.chatOutgoing);
          root.style.setProperty('--success', defaultApariencia.chatOutgoing);
          root.style.setProperty('--primary', defaultApariencia.chatIncoming);
          root.style.setProperty('--btn-primary-foreground', readableTextColor(defaultApariencia.chatOutgoing));
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // listen to storage events (update from other tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === APARIENCIA_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.modoPreview && parsed.modoPreview !== mode) setModeState(parsed.modoPreview);
          // apply any changed accent/incoming colors immediately across tabs
          try {
            const root = document.documentElement;
            if (parsed.chatOutgoing) {
              root.style.setProperty('--accent', parsed.chatOutgoing);
              root.style.setProperty('--success', parsed.chatOutgoing);
              root.style.setProperty('--btn-primary-foreground', readableTextColor(parsed.chatOutgoing));
            }
            if (parsed.chatIncoming) {
              root.style.setProperty('--primary', parsed.chatIncoming);
              root.style.setProperty('--accent-incoming', parsed.chatIncoming);
            }
          } catch (err) {}
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
