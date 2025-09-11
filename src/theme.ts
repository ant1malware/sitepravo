export type Theme = 'light' | 'dark';
export type Accent = 'indigo' | 'violet' | 'blue' | 'custom';
export type Background = 'none' | 'bg1' | 'bg2' | 'bg3' | 'custom';

const STORAGE_KEY = 'theme';
const ACCENT_KEY = 'accent';
const ACCENT_CUSTOM_KEY = 'accent_custom';
const BG_KEY = 'bg';
const BG_CUSTOM_KEY = 'bg_custom';

export const ACCENTS: Record<Exclude<Accent, 'custom'>, { 500: string; 600: string }> = {
  indigo: { 500: '#6366F1', 600: '#4F46E5' },
  violet: { 500: '#8B5CF6', 600: '#7C3AED' },
  blue:   { 500: '#3B82F6', 600: '#2563EB' },
};


export const BACKGROUNDS: Record<'bg1' | 'bg2' | 'bg3' | 'bg4' | 'bg5', string> = {
  bg1: 'img/bg1.png',
  bg2: 'img/bg2.png',
  bg3: 'img/bg3.png',
  bg4: 'img/bg4.png',
  bg5: 'img/bg5.png',
};

export function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

export function getStoredAccent(): Accent | null {
  const v = localStorage.getItem(ACCENT_KEY) as Accent | null;
  if (!v) return null;
  if (v === 'custom') return 'custom';
  return (v in ACCENTS) ? v : null;
}

export function getStoredCustomAccent(): string | null {
  return localStorage.getItem(ACCENT_CUSTOM_KEY);
}

export function getStoredBackground(): Background | null {
  const v = localStorage.getItem(BG_KEY) as Background | null;
  return v && (v === 'none' || v === 'custom' || v in BACKGROUNDS) ? v : null;
}

export function getStoredCustomBackground(): string | null {
  return localStorage.getItem(BG_CUSTOM_KEY);
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
  // Ensure canvas matches theme tokens immediately
  try {
    root.style.backgroundColor = 'var(--bg-1)';
    document.body.style.backgroundColor = 'var(--bg-1)';
  } catch {}
}

export function applyAccent(a: Accent) {
  if (a === 'custom') {
    const hex = getStoredCustomAccent() || '#6366F1';
    document.documentElement.style.setProperty('--accent', hex);
    // Derive a slightly darker shade for --accent-600 (simple fallback)
    const darker = shadeHexColor(hex, -0.15);
    document.documentElement.style.setProperty('--accent-600', darker);
  } else {
    const c = ACCENTS[a];
    document.documentElement.style.setProperty('--accent', c[500]);
    document.documentElement.style.setProperty('--accent-600', c[600]);
  }
  localStorage.setItem(ACCENT_KEY, a);
}

export function setCustomAccent(hex: string) {
  localStorage.setItem(ACCENT_CUSTOM_KEY, normalizeHex(hex));
  applyAccent('custom');
}

export function applyBackground(b: Background) {
  const body = document.body;
  const isDark = document.documentElement.classList.contains('dark');
  // In dark theme keep background clean and solid for readability
  if (isDark) {
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    body.style.backgroundPosition = '';
    localStorage.setItem(BG_KEY, b);
    return;
  }
  if (b === 'none') {
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    body.style.backgroundPosition = '';
  } else if (b === 'custom') {
    const url = getStoredCustomBackground();
    if (!url) {
      body.style.backgroundImage = '';
    } else {
      body.style.backgroundImage = `url(${url})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundPosition = 'center';
    }
  } else {
    const url = `${import.meta.env.BASE_URL}${BACKGROUNDS[b]}`;
    body.style.backgroundImage = `url(${url})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundPosition = 'center';
  }
  localStorage.setItem(BG_KEY, b);
}

export function setCustomBackground(urlOrDataUrl: string) {
  localStorage.setItem(BG_CUSTOM_KEY, urlOrDataUrl);
  applyBackground('custom');
}

export function initTheme() {
  const stored = getStoredTheme();
  const theme: Theme = stored ?? (systemPrefersDark() ? 'dark' : 'light');
  applyTheme(theme);
  const accent = getStoredAccent() ?? 'indigo';
  applyAccent(accent);
  const bg = getStoredBackground() ?? 'none';
  applyBackground(bg);
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

// Helpers
function normalizeHex(hex: string): string {
  let h = hex.trim();
  if (!h.startsWith('#')) h = `#${h}`;
  if (h.length === 4) {
    // #RGB -> #RRGGBB
    const r = h[1]; const g = h[2]; const b = h[3];
    h = `#${r}${r}${g}${g}${b}${b}`;
  }
  return h;
}

function shadeHexColor(hex: string, percent: number): string {
  const h = normalizeHex(hex).slice(1);
  const num = parseInt(h, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.round(r + (255 * percent))));
  g = Math.max(0, Math.min(255, Math.round(g + (255 * percent))));
  b = Math.max(0, Math.min(255, Math.round(b + (255 * percent))));
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
