// theme.ts

export type Theme = 'light' | 'dark';
export type Accent = 'indigo' | 'violet' | 'blue' | 'custom';
export type Background = 'none' | 'bg1' | 'bg2' | 'bg3' | 'bg4' | 'bg5' | 'custom';
export type StyleMode = 'classic' | 'liquid';
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

/* ====== ACCENTS ====== */
export const ACCENTS: Record<Exclude<Accent, 'custom'>, { 500: string; 600: string }> = {
  indigo: { 500: '#6366F1', 600: '#4F46E5' },
  violet: { 500: '#8B5CF6', 600: '#7C3AED' },
  blue:   { 500: '#3B82F6', 600: '#2563EB' },
};

/* ====== ASSETS FOR BACKGROUNDS ====== */
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

/* ====== READ STORED ====== */
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
  return v === 'classic' || v === 'liquid' ? (v as StyleMode) : null;
}
export function getStoredLiquidTone(): LiquidTone {
  const v = (safeGet(LIQUID_TONE_KEY) || 'dark') as LiquidTone;
  return v === 'light' ? 'light' : 'dark';
}

/* ====== INTERNAL: DESIGN TOKENS ======
   Мы ставим CSS-переменные напрямую,
   чтобы всё работало без отдельного CSS. */
function setVars(vars: Record<string, string>) {
  const root = document.documentElement;
  for (const k of Object.keys(vars)) {
    root.style.setProperty(k, vars[k]!);
  }
}

// Палитры для разных сочетаний (classic/light|dark и liquid/light|dark)
function applyDesignTokens(theme: Theme, isLiquid: boolean, tone: LiquidTone) {
  // базовые неизменные
  setVars({
    '--shadow-lg': '0 10px 30px rgba(0,0,0,0.45)',
    '--glass-blur': '10px',
  });

  if (!isLiquid) {
    if (theme === 'light') {
      setVars({
        '--bg-1': '#FAFAFA',
        '--bg-2': '#F2F3F7',
        '--surface-1': 'rgba(10,10,10,0.06)',
        '--surface-2': 'rgba(10,10,10,0.03)',
        '--border-1': 'rgba(10,10,10,0.08)',
        '--text-1': '#0A0A0A',
        '--text-2': 'rgba(10,10,10,0.65)',
        '--liquid-a': 'transparent',
        '--liquid-b': 'transparent',
      });
      // совместимость с существующими стилями
      setVars({
        '--surface': 'var(--surface-1)',
        '--card': 'var(--surface-1)',
        '--border': 'var(--border-1)',
        '--card-border': 'var(--border-1)',
        '--muted': 'var(--text-2)',
        '--ring': 'rgba(161,161,170,1)',
      });
    } else {
      setVars({
        '--bg-1': '#0E0F14',
        '--bg-2': '#12141B',
        '--surface-1': 'rgba(255,255,255,0.06)',
        '--surface-2': 'rgba(255,255,255,0.03)',
        '--border-1': 'rgba(255,255,255,0.08)',
        '--text-1': 'rgba(255,255,255,0.90)',
        '--text-2': 'rgba(255,255,255,0.65)',
        '--liquid-a': 'transparent',
        '--liquid-b': 'transparent',
      });
      setVars({
        '--surface': 'var(--surface-1)',
        '--card': 'var(--surface-1)',
        '--border': 'var(--border-1)',
        '--card-border': 'var(--border-1)',
        '--muted': 'var(--text-2)',
        '--ring': 'rgba(82,82,91,1)',
      });
    }
  } else {
    if (tone === 'light') {
      setVars({
        '--bg-1': '#F7F9FF',
        '--bg-2': '#EDF1FF',
        '--surface-1': 'rgba(10,10,10,0.06)',
        '--surface-2': 'rgba(10,10,10,0.03)',
        '--border-1': 'rgba(10,10,10,0.08)',
        '--text-1': '#0A0A0A',
        '--text-2': 'rgba(10,10,10,0.65)',
        '--liquid-a': 'rgba(92,102,255,0.10)',
        '--liquid-b': 'rgba(0,255,224,0.10)',
      });
      setVars({
        '--surface': 'var(--surface-1)',
        '--card': 'var(--surface-1)',
        '--border': 'var(--border-1)',
        '--card-border': 'var(--border-1)',
        '--muted': 'var(--text-2)',
        '--ring': 'rgba(100,120,220,0.5)',
      });
    } else {
      setVars({
        '--bg-1': '#0B0C11',
        '--bg-2': '#0E0F14',
        '--surface-1': 'rgba(255,255,255,0.06)',
        '--surface-2': 'rgba(255,255,255,0.03)',
        '--border-1': 'rgba(255,255,255,0.08)',
        '--text-1': 'rgba(255,255,255,0.90)',
        '--text-2': 'rgba(255,255,255,0.65)',
        '--liquid-a': 'rgba(92,102,255,0.16)',
        '--liquid-b': 'rgba(0,255,224,0.12)',
      });
      setVars({
        '--surface': 'var(--surface-1)',
        '--card': 'var(--surface-1)',
        '--border': 'var(--border-1)',
        '--card-border': 'var(--border-1)',
        '--muted': 'var(--text-2)',
        '--ring': 'rgba(122,148,255,0.42)',
      });
    }
  }
}

/* ====== APPLYERS ====== */
export function applyLiquidTone(tone: LiquidTone) {
  safeSet(LIQUID_TONE_KEY, tone);
  const root = document.documentElement;
  root.classList.toggle('liquid-light', tone === 'light');
  root.classList.toggle('liquid-dark', tone !== 'light');

  // если Liquid активен — обновим токены и базовую тему
  const isLiquid = root.classList.contains('theme-liquid');
  if (isLiquid) {
    try { applyTheme(tone === 'light' ? 'light' : 'dark'); } catch {}
    try {
      applyDesignTokens(tone === 'light' ? 'light' : 'dark', true, tone);
    } catch {}
  }
}

export function applyStyleMode(mode: StyleMode) {
  const root = document.documentElement;
  root.classList.toggle('theme-liquid', mode === 'liquid');
  (root as any).dataset.styleMode = mode;

  const isLiquid = mode === 'liquid';
  if (isLiquid) {
    // запомним предыдущую тему и включим тон
    try {
      const prev = getStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light');
      safeSet(LIQUID_PREV_THEME_KEY, prev);
      const tone = getStoredLiquidTone();
      applyLiquidTone(tone);
    } catch {}

    // глушим фоновые картинки
    try {
      const body = document.body;
      body.style.removeProperty('background');
      body.style.removeProperty('background-size');
      body.style.removeProperty('background-repeat');
      body.style.removeProperty('background-attachment');
      body.style.removeProperty('background-position');
    } catch {}
  } else {
    // вернём прошлую тему и фоны
    try {
      const prev = safeGet(LIQUID_PREV_THEME_KEY) as Theme | null;
      if (prev === 'light' || prev === 'dark') applyTheme(prev);
      safeRemove(LIQUID_PREV_THEME_KEY);
    } catch {}
    try {
      const bg = getStoredBackground() ?? 'none';
      applyBackground(bg);
    } catch {}
  }

  // обновим токены под текущее состояние
  try {
    const t = getStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light');
    const tone = getStoredLiquidTone();
    applyDesignTokens(t, isLiquid, tone);
  } catch {}

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

  // моб. адрес-бар
  let color = t === 'dark' ? '#0a0a0a' : '#fafafa';
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta);
  }
  // если Liquid, подставим актуальный --bg-1
  try {
    const isLiquid = root.classList.contains('theme-liquid');
    if (isLiquid) {
      const cs = getComputedStyle(root);
      const bg = cs.getPropertyValue('--bg-1').trim();
      if (bg) color = bg;
    }
  } catch {}
  meta.setAttribute('content', color);

  // моментально красим фон через токены
  try {
    const isLiquid = root.classList.contains('theme-liquid');
    const tone = getStoredLiquidTone();
    applyDesignTokens(t, isLiquid, tone);
    root.style.backgroundColor = 'var(--bg-1)';
    document.body.style.backgroundColor = 'var(--bg-1)';
  } catch {}
}

export function applyAccent(a: Accent) {
  const root = document.documentElement;
  let main = '#6366F1', darker = '#4F46E5';
  if (a === 'custom') {
    const hex = getStoredCustomAccent() || main;
    main = normalizeHex(hex);
    darker = shadeHexColor(main, -0.18);
  } else {
    const c = ACCENTS[a as Exclude<Accent,'custom'>];
    if (c) { main = c[500]; darker = c[600]; }
  }
  root.style.setProperty('--accent', main);
  root.style.setProperty('--accent-500', main);
  root.style.setProperty('--accent-600', darker);
  root.style.setProperty('--accent-contrast', pickContrast(main));
  root.style.setProperty('--focus', rgba(main, 0.55)); // подсветка фокуса в тон акцента
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

  // если включён Liquid — не трогаем фон (он рисуется градиентами)
  if (document.documentElement.classList.contains('theme-liquid')) {
    safeSet(BG_KEY, b);
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
      (body.style as any).backgroundAttachment = attach;
      body.style.backgroundPosition = 'center';
    }
  } else {
    const url = BACKGROUNDS[b];
    body.style.backgroundImage = `url(${url})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    (body.style as any).backgroundAttachment = attach;
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

/* ====== Helpers ====== */
function normalizeHex(hex: string): string {
  let h = hex.trim();
  if (!h.startsWith('#')) h = `#${h}`;
  if (h.length === 4) {
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
  r = clamp255(Math.round(r + (255 * percent)));
  g = clamp255(Math.round(g + (255 * percent)));
  b = clamp255(Math.round(b + (255 * percent)));
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function clamp255(n: number) { return Math.max(0, Math.min(255, n)); }
function hexToRgb(hex: string){ const n=parseInt(normalizeHex(hex).slice(1),16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 }; }
function pickContrast(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // относительная яркость (γ=2.2 — достаточно для выбора)
  const L = 0.2126*Math.pow(r/255,2.2) + 0.7152*Math.pow(g/255,2.2) + 0.0722*Math.pow(b/255,2.2);
  return L > 0.5 ? '#0A0A0A' : '#FFFFFF';
}
function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}
