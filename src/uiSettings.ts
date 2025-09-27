// src/uiSettings.ts

const DENSITY_KEY = 'ui:density'; // 'standard' | 'compact'
const FONT_KEY = 'ui:font'; // number, 0.9..1.3
const FEATURES_KEY = 'ui:features'; // JSON map
const SHADOW_KEY = 'ui:shadow'; // 'none' | 'soft' | 'strong'
const RADIUS_KEY = 'ui:radius'; // 'subtle' | 'standard' | 'rounded'
const GLASS_KEY = 'ui:glass'; // number px (0..16)
const READW_KEY = 'ui:readw'; // number ch (60..96)
const ANIM_KEY = 'ui:anim'; // '1' | '0'
// Buddy (Chebzik)
const BUDDY_ENABLED_KEY = 'buddy:enabled'; // '1' | '0'
const BUDDY_SKIN_A = 'buddy:skin_a'; // hex color
const BUDDY_SKIN_B = 'buddy:skin_b'; // hex color

export type Density = 'standard' | 'compact';
export type Shadow = 'none' | 'soft' | 'strong';
export type Radius = 'subtle' | 'standard' | 'rounded';

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

export function applyDensity(d: Density) {
  document.documentElement.style.setProperty('--density', d === 'compact' ? '0.85' : '1');
  safeSet(DENSITY_KEY, d);
}

export function getDensity(): Density {
  const v = safeGet(DENSITY_KEY);
  return v === 'compact' ? 'compact' : 'standard';
}

export function applyFontScale(k: number) {
  const clamped = Math.max(0.9, Math.min(1.3, k));
  const base = 16 * clamped;
  document.documentElement.style.setProperty('--font-size', `${base}px`);
  safeSet(FONT_KEY, String(clamped));
}

export function getFontScale(): number {
  const raw = safeGet(FONT_KEY);
  const v = parseFloat(raw || '1');
  if (isFinite(v) && v > 0.6 && v < 2) return v; return 1;
}

type FeatureFlags = { [k: string]: boolean };

export function setFeature(key: string, on: boolean) {
  const f = getFeatures();
  f[key] = on;
  safeSet(FEATURES_KEY, JSON.stringify(f));
}

export function isFeatureOn(key: string, def = true): boolean {
  const f = getFeatures();
  return key in f ? !!f[key] : def;
}

export function getFeatures(): FeatureFlags {
  try {
    const raw = safeGet(FEATURES_KEY);
    return raw ? JSON.parse(raw) as FeatureFlags : {};
  } catch { return {}; }
}

export function exportSettings(): string {
  const keys = [
    'theme', 'accent', 'accent_custom', 'bg', 'bg_custom',
    DENSITY_KEY, FONT_KEY, SHADOW_KEY, RADIUS_KEY, GLASS_KEY, READW_KEY,
    'telemetry_disabled', 'cp_filter', 'recent:items', 'ui:features'
  ];
  const out: Record<string, string|null> = {};
  for (const k of keys) out[k] = safeGet(k);
  return JSON.stringify(out, null, 2);
}

export function importSettings(json: string) {
  const data = JSON.parse(json) as Record<string, string|null>;
  for (const k in data) {
    const v = data[k];
    if (v == null) safeRemove(k); else safeSet(k, v);
  }
}

// Visual customizations
export function applyShadow(s: Shadow) {
  let v = 'none';
  if (s === 'soft') v = '0 10px 30px -12px rgba(0,0,0,0.25)';
  if (s === 'strong') v = '0 20px 60px -24px rgba(0,0,0,0.35)';
  document.documentElement.style.setProperty('--card-shadow', v);
  safeSet(SHADOW_KEY, s);
}
export function getShadow(): Shadow {
  const v = safeGet(SHADOW_KEY) as Shadow | null;
  return v === 'none' || v === 'soft' || v === 'strong' ? v : 'soft';
}

export function applyRadius(r: Radius) {
  let lg = 8, xl = 16, xxl = 20; // px
  if (r === 'subtle') { lg = 6; xl = 10; xxl = 14; }
  if (r === 'rounded') { lg = 12; xl = 18; xxl = 24; }
  document.documentElement.style.setProperty('--radius-lg', lg + 'px');
  document.documentElement.style.setProperty('--radius-2xl', xl + 'px');
  document.documentElement.style.setProperty('--radius-3xl', xxl + 'px');
  safeSet(RADIUS_KEY, r);
}
export function getRadius(): Radius {
  const v = safeGet(RADIUS_KEY) as Radius | null;
  return v === 'subtle' || v === 'rounded' ? v : 'standard';
}

export function applyGlass(px: number) {
  const v = Math.max(0, Math.min(16, Math.round(px)));
  document.documentElement.style.setProperty('--glass-blur', v + 'px');
  safeSet(GLASS_KEY, String(v));
}
export function getGlass(): number {
  const raw = safeGet(GLASS_KEY);
  const v = parseInt(raw || '6', 10);
  return isFinite(v) ? v : 6;
}

export function applyReadingWidth(ch: number) {
  const v = Math.max(60, Math.min(96, Math.round(ch)));
  document.documentElement.style.setProperty('--reading-w', v + 'ch');
  safeSet(READW_KEY, String(v));
}
export function getReadingWidth(): number {
  const raw = safeGet(READW_KEY);
  const v = parseInt(raw || '78', 10);
  return isFinite(v) ? v : 78;
}

export function initUi() {
  try {
    applyDensity(getDensity());
    applyFontScale(getFontScale());
    applyShadow(getShadow());
    applyRadius(getRadius());
    applyGlass(getGlass());
    applyReadingWidth(getReadingWidth());
    applyAnimations(getAnimationsOn());
  } catch {}
}

// Animations on/off
export function applyAnimations(on: boolean) {
  const root = document.documentElement;
  root.classList.toggle('anim-off', !on);
  safeSet(ANIM_KEY, on ? '1' : '0');
}
export function getAnimationsOn(): boolean {
  try { return safeGet(ANIM_KEY) !== '0'; } catch { return true; }
}

// Buddy (Chebzik) helpers
export function setBuddyEnabled(on: boolean) {
  safeSet(BUDDY_ENABLED_KEY, on ? '1' : '0');
}
export function getBuddyEnabled(): boolean {
  try { return safeGet(BUDDY_ENABLED_KEY) !== '0'; } catch { return true; }
}
export function setBuddySkin(a: string, b: string) {
  const A = /^#?[0-9a-fA-F]{6}$/.test(a) ? (a.startsWith('#') ? a : '#' + a) : '#bcd3ff';
  const B = /^#?[0-9a-fA-F]{6}$/.test(b) ? (b.startsWith('#') ? b : '#' + b) : '#6a79ff';
  safeSet(BUDDY_SKIN_A, A);
  safeSet(BUDDY_SKIN_B, B);
}
export function getBuddySkin(): { a: string; b: string } {
  const a = safeGet(BUDDY_SKIN_A) || '#bcd3ff';
  const b = safeGet(BUDDY_SKIN_B) || '#6a79ff';
  return { a, b };
}
