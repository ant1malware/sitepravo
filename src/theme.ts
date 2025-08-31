export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const ACCENT_KEY = 'accent-color';

export function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

export function systemPrefersDark(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem(STORAGE_KEY, t);
  // Sync meta theme-color for nicer mobile address bar
  const color = t === 'dark' ? '#0a0a0a' : '#fafafa';
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
}

export function initTheme() {
  const stored = getStoredTheme();
  const theme: Theme = stored ?? (systemPrefersDark() ? 'dark' : 'light');
  applyTheme(theme);
  initAccentColor();
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function getStoredAccentColor(): string | null {
  try {
    const v = localStorage.getItem(ACCENT_KEY);
    return v ? v : null;
  } catch {
    return null;
  }
}

function shade(color: string, percent: number): string {
  const num = parseInt(color.slice(1), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
  let b = (num & 0x0000ff) + Math.round(255 * percent);
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

export function setAccentColor(color: string) {
  const root = document.documentElement;
  root.style.setProperty('--accent', color);
  root.style.setProperty('--accent-600', shade(color, -0.15));
  try { localStorage.setItem(ACCENT_KEY, color); } catch {}
}

export function initAccentColor() {
  const stored = getStoredAccentColor();
  if (stored) setAccentColor(stored);
}
