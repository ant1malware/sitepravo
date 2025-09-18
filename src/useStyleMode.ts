import React from 'react';
import { applyStyleMode, getStoredStyleMode, type StyleMode } from './theme';

function readCurrentStyle(): StyleMode {
  if (typeof document !== 'undefined') {
    const ds = document.documentElement.dataset.styleMode;
    if (ds === 'classic' || ds === 'liquid') return ds;
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
      const detail = (event as CustomEvent<StyleMode>).detail;
      if (detail === 'classic' || detail === 'liquid') {
        setMode(detail);
      } else {
        syncFromDom();
      }
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
    applyStyleMode(next);
    setMode(next);
  }, []);

  return [mode, setStyle];
}
