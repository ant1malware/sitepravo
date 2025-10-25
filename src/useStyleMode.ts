import React from 'react';
import { applyStyleMode, getStoredStyleMode, type StyleMode } from './theme';

function normalize(mode: StyleMode): StyleMode {
  return mode === 'liquid' ? 'classic' : mode;
}

function readCurrentStyle(): StyleMode {
  if (typeof document !== 'undefined') {
    const ds = document.documentElement.dataset.styleMode;
    if (ds === 'classic') return 'classic';
    if (ds === 'liquid') return 'classic';
  }
  try {
    return getStoredStyleMode() ?? 'classic';
  } catch {
    return 'classic';
  }
}

export function useStyleMode(): [StyleMode, (mode: StyleMode) => void] {
  const [mode, setMode] = React.useState<StyleMode>(() => readCurrentStyle());

  React.useEffect(() => {
    const syncFromDom = () => {
      const current = readCurrentStyle();
      setMode((prev) => (prev === current ? prev : current));
    };

    const handleChange = (event: Event) => {
      const detail = normalize((event as CustomEvent<StyleMode>).detail);
      if (detail === 'classic') setMode(detail); else syncFromDom();
    };

    window.addEventListener('stylemodechange', handleChange as EventListener);
    const observer = new MutationObserver(syncFromDom);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-style-mode'] });

    return () => {
      window.removeEventListener('stylemodechange', handleChange as EventListener);
      observer.disconnect();
    };
  }, []);

  const setStyle = React.useCallback((next: StyleMode) => {
    const normalized = normalize(next);
    applyStyleMode(normalized);
    setMode(normalized);
  }, []);

  return [mode, setStyle];
}
