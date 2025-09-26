export type Theme = 'light' | 'dark';
export type Accent = 'indigo' | 'violet' | 'blue' | 'custom';
export type Background = 'none' | 'bg1' | 'bg2' | 'bg3' | 'bg4' | 'bg5' | 'custom';

export type StyleMode = 'classic' | 'liquid' | 'beta';
export type LiquidTone = 'dark' | 'light';


const STORAGE_KEY = 'theme';
const ACCENT_KEY = 'accent';
const ACCENT_CUSTOM_KEY = 'accent_custom';
const BG_KEY = 'bg';
const BG_CUSTOM_KEY = 'bg_custom';
const STYLE_MODE_KEY = 'ui:style-mode';
const LIQUID_PREV_THEME_KEY = 'ui:liquid:prev-theme';
const LIQUID_TONE_KEY = 'ui:liquid:tone';

function safeGet(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  } catch {}
}

export const ACCENTS: Record<Exclude<Accent, 'custom'>, { 500: string; 600: string }> = {
  indigo: { 500: '#6366F1', 600: '#4F46E5' },
  violet: { 500: '#8B5CF6', 600: '#7C3AED' },
  blue:   { 500: '#3B82F6', 600: '#2563EB' },
};



const BASE = (import.meta as any)?.env?.BASE_URL ?? '/';
const asset = (p: string) => {
  const clean = p.replace(/^\/+/, '');
  return (BASE.endsWith('/') ? BASE : BASE + '/') + clean;
};

export const BACKGROUNDS: Record<'bg1' | 'bg2' | 'bg3' | 'bg4' | 'bg5', string> = {
  bg1: asset('img/bg1.png'),
  bg2: asset('img/bg2.png'),
  bg3: asset('img/bg3.png'),
  bg4: asset('img/bg4.png'),
  bg5: asset('img/bg5.png'),
};

export function getStoredTheme(): Theme | null {
  const v = safeGet(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

export function getStoredAccent(): Accent | null {
  const v = safeGet(ACCENT_KEY) as Accent | null;
  if (!v) return null;
  if (v === 'custom') return 'custom';
  return (v in ACCENTS) ? v : null;
}

export function getStoredCustomAccent(): string | null {
  return safeGet(ACCENT_CUSTOM_KEY);
}

export function getStoredBackground(): Background | null {
  const v = safeGet(BG_KEY);

  return v && (v === 'none' || v === 'custom' || v in BACKGROUNDS) ? (v as Background) : null;
}

export function getStoredCustomBackground(): string | null {
  return safeGet(BG_CUSTOM_KEY);
}

export function getStoredStyleMode(): StyleMode | null {
  const v = safeGet(STYLE_MODE_KEY);
  return v === 'classic' || v === 'liquid' || v === 'beta' ? v as StyleMode : null;
}

export function getStoredLiquidTone(): LiquidTone {
  const v = (safeGet(LIQUID_TONE_KEY) || 'dark') as LiquidTone;
  return v === 'light' ? 'light' : 'dark';
}

export function applyLiquidTone(tone: LiquidTone) {
  safeSet(LIQUID_TONE_KEY, tone);
  const root = document.documentElement;
  root.classList.toggle('liquid-light', tone === 'light');
  root.classList.toggle('liquid-dark', tone !== 'light');
  // If Liquid mode is active, sync base theme for better contrast
  if (root.classList.contains('theme-liquid')) {
    try { applyTheme(tone === 'light' ? 'light' : 'dark'); } catch {}
  }
}

export function applyStyleMode(mode: StyleMode) {
  const root = document.documentElement;
  root.classList.toggle('theme-liquid', mode === 'liquid');
  root.classList.toggle('theme-beta', mode === 'beta');
  root.dataset.styleMode = mode;
  if (mode === 'liquid' || mode === 'beta') {
    // Force dark theme for Liquid mode and remember previous theme
    try {
      const prev = getStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light');
      safeSet(LIQUID_PREV_THEME_KEY, prev);
      const tone = getStoredLiquidTone();
      applyLiquidTone(tone);
    } catch {}
    try {
      const body = document.body;
      body.style.removeProperty('background');
      body.style.removeProperty('background-size');
      body.style.removeProperty('background-repeat');
      body.style.removeProperty('background-attachment');
      body.style.removeProperty('background-position');
    } catch {}
  } else {
    // Restore theme that was active before Liquid mode
    try {
      const prev = safeGet(LIQUID_PREV_THEME_KEY) as Theme | null;
      if (prev === 'light' || prev === 'dark') {
        applyTheme(prev);
      }
      safeRemove(LIQUID_PREV_THEME_KEY);
    } catch {}
    try {
      const bg = getStoredBackground() ?? 'none';
      applyBackground(bg);
    } catch {}
  }
  try { window.dispatchEvent(new CustomEvent<StyleMode>('stylemodechange', { detail: mode })); } catch {}
  safeSet(STYLE_MODE_KEY, mode);
}

export function toggleStyleMode(): StyleMode {
  const next: StyleMode = document.documentElement.classList.contains('theme-liquid') ? 'classic' : 'liquid';
  applyStyleMode(next);
  return next;
}

export function systemPrefersDark(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  safeSet(STORAGE_KEY, t);
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
  safeSet(ACCENT_KEY, a);
}

export function setCustomAccent(hex: string) {
  safeSet(ACCENT_CUSTOM_KEY, normalizeHex(hex));
  applyAccent('custom');
}

export function applyBackground(b: Background) {
  const body = document.body;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const attach = isMobile ? 'scroll' : 'fixed';
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
      body.style.backgroundAttachment = attach as any;
      body.style.backgroundPosition = 'center';
    }
  } else {
    const url = BACKGROUNDS[b];
    body.style.backgroundImage = `url(${url})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = attach as any;
    body.style.backgroundPosition = 'center';
  }
  safeSet(BG_KEY, b);
}

export function setCustomBackground(urlOrDataUrl: string) {
  safeSet(BG_CUSTOM_KEY, urlOrDataUrl);
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
  const styleMode = getStoredStyleMode() ?? 'classic';
  applyStyleMode(styleMode);
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
