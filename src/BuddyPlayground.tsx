import React from 'react';
import { Link } from 'react-router-dom';
import LiquidGlass from './components/LiquidGlass';

/* =========================================================
   Types
========================================================= */

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
type CosmeticKind =
  | 'hat' | 'glasses' | 'hoodie' | 'costume'
  | 'palette' | 'backpack' | 'headphones' | 'cape'
  | 'wings' | 'tail' | 'aura' | 'sticker' | 'pet';

type Cosmetic = {
  id: string;
  name: string;
  kind: CosmeticKind;
  rarity: Rarity;
  price: number;
  season?: string;
  data?: Record<string, any>;
  exclusive?: 'code' | 'developer';
  unlockCode?: string;
};

type Stats = { hunger: number; mood: number; energy: number; name: string; last: number };
type Inv   = { cookie: number; meal: number; toy: number; medkit: number; gift: number };
type Quest = {
  id: string;
  label: string;
  progress: number;
  target: number;
  reward: number;
  claimed?: boolean;
  icon?: string;
  tracker?: string;
  hint?: string;
};

type DailyBuffType = 'xp' | 'coins' | 'mood' | 'stamina';
type DailyBuff = {
  type: DailyBuffType;
  amount?: number;
  label?: string;
  description?: string;
};

type WeeklyChallenge = Quest & {
  tracker?: string;
  icon?: string;
  expiresAt: string;
};

type Daily = {
  date: string;
  rewardClaimed: boolean;
  buff: DailyBuff;
  quests: Quest[];
  weeklyChallenge?: WeeklyChallenge;
  bonusBuffExpires?: number;
};
type Game  = { xp: number; level: number; coins: number; streak: number; lastLogin: string; minigameBest: number; highs?: Record<string, number> };

type Achievements = Record<string, boolean>;
type ChebConfig = { animations: boolean; sounds?: boolean; haptics?: boolean };

type CosmeticsState = {
  owned: string[];
  equipped: Partial<Record<CosmeticKind, string>>;
};

type FatigueState = { stamina: number; last: number };

type AmbientOrb = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};


type Save = {
  version: 1;
  stats: Stats;
  inv: Inv;
  daily: Daily;
  game: Game;
  log: string[];
  config?: ChebConfig;
  achievements?: Achievements;
  cosm?: CosmeticsState;
  shop?: { rotAt: number; items: string[] };
  codes?: string[];
  fatigue?: FatigueState;
};

/* =========================================================
   Utils & Constants
========================================================= */

const K = 'buddy:save:v1';
const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const clamp01 = (x: number) => clamp(x, 0, 1);
const now = () => Date.now();
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const inSeconds = (sec: number) => sec * 1000;
const MINIGAME_FATIGUE_COST = 20;
type MiniGameKind = 'blink' | 'snake' | 'meteor' | 'glow';
const MINI_GAME_COST: Record<MiniGameKind, number> = {
  blink: 20,
  snake: 22,
  meteor: 18,
  glow: 15,
};
const MINI_GAME_PAYOUT: Record<MiniGameKind, { coinDivider: number; xpMultiplier: number }> = {
  blink: { coinDivider: 2, xpMultiplier: 4 },
  snake: { coinDivider: 2, xpMultiplier: 4 },
  meteor: { coinDivider: 1.8, xpMultiplier: 3.5 },
  glow: { coinDivider: 2.4, xpMultiplier: 3 },
};
const MINI_GAME_LABEL: Record<MiniGameKind, string> = {
  blink: 'Блик',
  snake: 'Змейка',
  meteor: 'Метеор-дождь',
  glow: 'Неоновое поле',
};

const HEX_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
function toRgba(hex: string, alpha: number) {
  const match = HEX_RE.exec(hex.trim());
  if (!match) return `rgba(139, 92, 246, ${alpha})`;
  const [r, g, b] = match.slice(1).map((chunk) => parseInt(chunk, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function useLiquid(): boolean {
  const read = () => {
    try { return document.documentElement.classList.contains('theme-liquid'); } catch { return false; }
  };
  const [val, setVal] = React.useState<boolean>(() => read());
  React.useEffect(() => {
    try {
      const root = document.documentElement;
      const obs = new MutationObserver(() => setVal(read()));
      obs.observe(root, { attributes: true, attributeFilter: ['class'] });
      const onStorage = (e: StorageEvent) => { if (!e || e.key === 'ui:style-mode') setVal(read()); };
      window.addEventListener('storage', onStorage);
      return () => { obs.disconnect(); window.removeEventListener('storage', onStorage); };
    } catch { /* no-op */ }
  }, []);
  return val;
}

function useIsDark(): boolean {
  const read = () => {
    try { return document.documentElement.classList.contains('dark'); } catch { return false; }
  };
  const [val, setVal] = React.useState<boolean>(() => read());
  React.useEffect(() => {
    try {
      const root = document.documentElement;
      const obs = new MutationObserver(() => setVal(read()));
      obs.observe(root, { attributes: true, attributeFilter: ['class'] });
      const onStorage = (e: StorageEvent) => { if (!e || e.key === 'theme') setVal(read()); };
      window.addEventListener('storage', onStorage);
      return () => { obs.disconnect(); window.removeEventListener('storage', onStorage); };
    } catch { /* no-op */ }
  }, []);
  return val;
}

function useThemeMode() {
  return React.useContext(ThemeContext);
}

function useThemeClasses() {
  const dark = useThemeMode();
  return React.useMemo(() => {
    if (dark) {
      return {
        dark,
        textPrimary: 'text-white/90',
        textSecondary: 'text-white/70',
        textMuted: 'text-white/60',
        panel: 'border border-[color:var(--card-border,rgba(255,255,255,0.12))] bg-[color:var(--surface,rgba(20,24,40,0.94))] text-white/90 shadow-[0_26px_80px_rgba(6,10,24,0.55)] backdrop-blur-lg',
        card: 'border border-[color:var(--card-border,rgba(255,255,255,0.1))] bg-[color:var(--card-surface,rgba(255,255,255,0.08))] text-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(6,10,24,0.35)]',
        pill: 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-white/15 text-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
        actionTile: 'group relative flex w-full items-start gap-3 overflow-hidden rounded-3xl border border-transparent bg-[rgba(12,16,28,0.88)] p-4 text-left text-white/85 shadow-[0_22px_48px_rgba(8,12,26,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_64px_rgba(8,12,26,0.58)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#8B5CF6)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
        iconButton: 'grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20',
        modalBackdrop: 'bg-black/60',
        hero: 'relative overflow-hidden rounded-3xl border border-white/12 bg-[rgba(14,18,32,0.9)] p-6 shadow-[0_32px_90px_rgba(6,10,30,0.55)] backdrop-blur-lg',
        heroSecondarySurface: 'bg-[rgba(255,255,255,0.04)]',
        heroMix: 'mix-blend-screen',
        listEmpty: 'rounded-2xl p-4 text-sm text-white/70 border border-white/12 bg-white/5',
        boundary: 'mx-auto max-w-2xl p-6 text-sm rounded-2xl border border-white/10 bg-[rgba(12,14,22,.9)] text-white/80',
      };
    }
    return {
      dark,
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-500',
      panel: 'border border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-md',
      card: 'border border-slate-200 bg-white/90 text-slate-800 shadow-[0_16px_40px_rgba(148,163,184,0.24)] backdrop-blur-sm',
      pill: 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-slate-900/5 text-slate-700 shadow-[0_2px_8px_rgba(148,163,184,0.25)]',
      actionTile: 'group relative flex w-full items-start gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-4 text-left text-slate-800 shadow-[0_22px_40px_rgba(148,163,184,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_56px_rgba(148,163,184,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#8B5CF6)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
      iconButton: 'grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
      modalBackdrop: 'bg-slate-900/15',
      hero: 'relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_32px_72px_rgba(15,23,42,0.16)] backdrop-blur-lg text-slate-900',
      heroSecondarySurface: 'bg-slate-100/70',
      heroMix: 'mix-blend-multiply',
      listEmpty: 'rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600',
      boundary: 'mx-auto max-w-2xl p-6 text-sm rounded-2xl border border-slate-200 bg-white/95 text-slate-700 shadow-[0_12px_40px_rgba(148,163,184,0.2)]',
    };
  }, [dark]);
}


/* =========================================================
   Mini SFX (safe)
========================================================= */

function vibr(ms: number) { try { (navigator as any).vibrate?.(ms); } catch {} }
let ACX: AudioContext | null = null;
function ctx() { try { if (!ACX) ACX = new ((window as any).AudioContext || (window as any).webkitAudioContext)(); } catch {} return ACX!; }
function beep(freq = 880, dur = .12, type: OscillatorType = 'triangle', gain = 0.07) {
  try {
    const ac = ctx(); if (!ac) return;
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    const shimmer = ac.createOscillator();
    const shimmerGain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.52), ac.currentTime + dur);

    shimmer.frequency.value = 18;
    shimmerGain.gain.value = freq * 0.035;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(osc.frequency);

    gainNode.gain.setValueAtTime(gain, ac.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ac.destination);

    osc.start(); shimmer.start();
    const stopAt = ac.currentTime + dur + 0.1;
    osc.stop(stopAt);
    shimmer.stop(stopAt);
  } catch {}
}
function chord(freqs: number[], dur = .14, type: OscillatorType = 'triangle') { freqs.forEach((f, i) => sparkle(f * (1 + i * 0.05), dur + i * 0.03, 0.065)); }
function sparkle(freq = 860, dur = .18, gain = 0.08) {
  try {
    const ac = ctx(); if (!ac) return;
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    const vibrato = ac.createOscillator();
    const vibratoGain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, ac.currentTime + dur);

    vibrato.frequency.value = 12;
    vibratoGain.gain.value = freq * 0.05;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    gainNode.gain.value = gain;
    gainNode.gain.setValueAtTime(gain, ac.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ac.destination);

    osc.start(); vibrato.start();
    const stopAt = ac.currentTime + dur + 0.08;
    osc.stop(stopAt);
    vibrato.stop(stopAt);
  } catch {}
}

/* =========================================================
   Catalog (demo)
========================================================= */

const ThemeContext = React.createContext(false);

const DEV_UNLOCK_CODE = 'CHEB-DEV-ACCESS';

const LIGHT_THEME_FIXES = `
.buddy-light { color: #0f172a; }
.buddy-light .text-white { color: #0f172a !important; }
.buddy-light .text-white\/90 { color: rgba(15,23,42,0.92) !important; }
.buddy-light .text-white\/85 { color: rgba(15,23,42,0.9) !important; }
.buddy-light .text-white\/80 { color: rgba(30,41,59,0.88) !important; }
.buddy-light .text-white\/75 { color: rgba(51,65,85,0.86) !important; }
.buddy-light .text-white\/70 { color: rgba(71,85,105,0.84) !important; }
.buddy-light .text-white\/65 { color: rgba(71,85,105,0.75) !important; }
.buddy-light .text-white\/60 { color: rgba(100,116,139,0.85) !important; }
.buddy-light .text-white\/55 { color: rgba(100,116,139,0.72) !important; }
.buddy-light .text-white\/45 { color: rgba(148,163,184,0.75) !important; }
.buddy-light .text-white\/35 { color: rgba(148,163,184,0.6) !important; }
.buddy-light .text-white\/30 { color: rgba(148,163,184,0.5) !important; }
.buddy-light .text-white\/25 { color: rgba(148,163,184,0.45) !important; }
.buddy-light .text-white\/20 { color: rgba(148,163,184,0.35) !important; }
.buddy-light .text-white\/15 { color: rgba(148,163,184,0.3) !important; }
.buddy-light .text-white\/10 { color: rgba(148,163,184,0.25) !important; }
.buddy-light .text-white\/5 { color: rgba(148,163,184,0.2) !important; }
.buddy-light .text-white\/0 { color: rgba(148,163,184,0.18) !important; }
.buddy-light .text-white\/40 { color: rgba(148,163,184,0.68) !important; }
.buddy-light .text-white\/50 { color: rgba(148,163,184,0.7) !important; }
.buddy-light .text-white\/25 { color: rgba(148,163,184,0.45) !important; }
.buddy-light .text-emerald-200 { color: #0f766e !important; }
.buddy-light .text-emerald-200\/80 { color: rgba(16,185,129,0.85) !important; }
.buddy-light .bg-[rgba(14,18,32,0.9)] { background-color: rgba(255,255,255,0.94) !important; color: #0f172a; }
.buddy-light .bg-[rgba(12,16,28,0.88)] { background-color: rgba(248,250,252,0.94) !important; color: #0f172a; }
.buddy-light .bg-[rgba(12,16,26,0.86)] { background-color: rgba(248,250,252,0.9) !important; }
.buddy-light .bg-[rgba(255,255,255,0.04)] { background-color: rgba(226,232,240,0.35) !important; }
.buddy-light .bg-white\/10 { background-color: rgba(15,23,42,0.08) !important; }
.buddy-light .bg-white\/12 { background-color: rgba(15,23,42,0.1) !important; }
.buddy-light .bg-white\/15 { background-color: rgba(15,23,42,0.1) !important; color: #1f2937; }
.buddy-light .bg-white\/20 { background-color: rgba(15,23,42,0.12) !important; }
.buddy-light .bg-white\/25 { background-color: rgba(15,23,42,0.16) !important; }
.buddy-light .bg-white\/30 { background-color: rgba(15,23,42,0.2) !important; }
.buddy-light .bg-black\/20 { background-color: rgba(15,23,42,0.06) !important; }
.buddy-light .bg-black\/60 { background-color: rgba(15,23,42,0.12) !important; }
.buddy-light .bg-[rgba(4,6,12,0.72)] { background-color: rgba(15,23,42,0.18) !important; }
.buddy-light .border-white\/20 { border-color: rgba(148,163,184,0.32) !important; }
.buddy-light .border-white\/15 { border-color: rgba(148,163,184,0.28) !important; }
.buddy-light .border-white\/12 { border-color: rgba(148,163,184,0.25) !important; }
.buddy-light .border-white\/10 { border-color: rgba(148,163,184,0.22) !important; }
.buddy-light .border-white\/5 { border-color: rgba(148,163,184,0.18) !important; }
.buddy-light .text-white\/70 b, .buddy-light .text-white\/65 b { color: rgba(15,23,42,0.92) !important; }
.buddy-light .font-mono.text-white { color: #0f172a !important; }
.buddy-light .hover\:bg-white\/20:hover { background-color: rgba(15,23,42,0.12) !important; }
.buddy-light .hover\:bg-white\/15:hover { background-color: rgba(15,23,42,0.1) !important; }
.buddy-light .hover\:bg-white\/10:hover { background-color: rgba(15,23,42,0.08) !important; }
.buddy-light .!bg-white\/10 { background-color: rgba(15,23,42,0.08) !important; }
.buddy-light .!bg-white\/15 { background-color: rgba(15,23,42,0.12) !important; }
.buddy-light .!border-white\/20 { border-color: rgba(148,163,184,0.32) !important; }
.buddy-light .text-white\/55 strong { color: rgba(15,23,42,0.92) !important; }
.buddy-light .text-white\/65 span { color: rgba(71,85,105,0.75) !important; }
.buddy-light .text-white\/65 > b { color: rgba(15,23,42,0.92) !important; }
.buddy-light .text-white\/70 > b { color: rgba(15,23,42,0.92) !important; }
.buddy-light .text-white\/90 a { color: #2563eb !important; }
.buddy-light .text-white\/70 a { color: #2563eb !important; }
.buddy-light .text-white\/90 button:hover { color: #1f2937 !important; }
.buddy-light .text-white\/70 button { color: #334155 !important; }
.buddy-light .bg-black\/40 { background-color: rgba(15,23,42,0.12) !important; }
.buddy-light .text-white\/75 span { color: rgba(51,65,85,0.86) !important; }
.buddy-light .text-white\/70 span { color: rgba(71,85,105,0.84) !important; }
.buddy-light .text-white\/60 span { color: rgba(100,116,139,0.85) !important; }
.buddy-light .text-white\/70 svg { color: rgba(71,85,105,0.84) !important; }
.buddy-light .text-white\/65 svg { color: rgba(71,85,105,0.75) !important; }
.buddy-light .text-white\/90 svg { color: rgba(15,23,42,0.92) !important; }
.buddy-light .shadow-[0_32px_90px_rgba(6,10,30,0.55)] { box-shadow: 0 32px 70px rgba(148,163,184,0.28) !important; }
.buddy-light .shadow-[0_22px_48px_rgba(8,12,26,0.45)] { box-shadow: 0 26px 56px rgba(148,163,184,0.25) !important; color: #0f172a; }
.buddy-light .shadow-[0_26px_80px_rgba(6,10,24,0.55)] { box-shadow: 0 26px 70px rgba(148,163,184,0.28) !important; }
.buddy-light .shadow-[0_10px_30px_rgba(6,10,24,0.35)] { box-shadow: 0 14px 40px rgba(148,163,184,0.28) !important; }
.buddy-light .shadow-[0_10px_30px_rgba(8,12,26,0.25)] { box-shadow: 0 12px 36px rgba(148,163,184,0.22) !important; }
.buddy-light .bg-[rgba(255,255,255,0.08)] { background-color: rgba(226,232,240,0.35) !important; }
.buddy-light .bg-[rgba(255,255,255,0.18)] { background-color: rgba(226,232,240,0.38) !important; }
.buddy-light .text-white\/85 button { color: #1f2937 !important; }
.buddy-light .text-white\/90 input::placeholder { color: rgba(100,116,139,0.7) !important; }
.buddy-light .text-white\/70 input::placeholder { color: rgba(100,116,139,0.65) !important; }
.buddy-light .text-white\/65 input::placeholder { color: rgba(100,116,139,0.6) !important; }
.buddy-light .text-white\/60 input::placeholder { color: rgba(100,116,139,0.55) !important; }
.buddy-light .text-white\/70 .font-mono { color: rgba(15,23,42,0.92) !important; }
.buddy-light .text-white\/60 .font-mono { color: rgba(15,23,42,0.82) !important; }
.buddy-light .text-white\/55 .font-mono { color: rgba(15,23,42,0.78) !important; }
.buddy-light .bg-black\/30 { background-color: rgba(15,23,42,0.1) !important; }
.buddy-light .bg-white\/5 { background-color: rgba(226,232,240,0.3) !important; }
.buddy-light .bg-white\/8 { background-color: rgba(226,232,240,0.32) !important; }
.buddy-light .mix-blend-screen { mix-blend-mode: normal !important; opacity: 0.65 !important; }
.buddy-light .text-white\/90 strong { color: rgba(15,23,42,0.92) !important; }
.buddy-light .text-white\/70 strong { color: rgba(15,23,42,0.82) !important; }
.buddy-light .text-white\/60 strong { color: rgba(15,23,42,0.78) !important; }
.buddy-light .text-white\/55 strong { color: rgba(15,23,42,0.72) !important; }
.buddy-light .text-white\/50 strong { color: rgba(15,23,42,0.7) !important; }
.buddy-light .text-white\/65 button { color: rgba(51,65,85,0.86) !important; }
.buddy-light .text-white\/60 button { color: rgba(71,85,105,0.82) !important; }
.buddy-light .text-white\/70 > span > b { color: rgba(15,23,42,0.9) !important; }
.buddy-light .text-white\/70 > span > strong { color: rgba(15,23,42,0.9) !important; }
.buddy-light .text-white\/70 > span { color: rgba(71,85,105,0.84) !important; }
.buddy-light .text-white\/55 span { color: rgba(148,163,184,0.75) !important; }
.buddy-light .text-white\/65 small { color: rgba(100,116,139,0.75) !important; }
.buddy-light .text-white\/60 small { color: rgba(100,116,139,0.72) !important; }
.buddy-light .text-white\/90 button { color: #0f172a !important; }
.buddy-light .text-white\/70 button:hover { color: #0f172a !important; }
.buddy-light .text-white\/90 .hover\:underline:hover { color: #1d4ed8 !important; }
.buddy-light .border-white\/12.bg-white\/5 { background-color: rgba(248,250,252,0.86) !important; }
.buddy-light .text-white\/70 .opacity-70 { color: rgba(100,116,139,0.75) !important; }
.buddy-light .text-white\/90 .opacity-70 { color: rgba(100,116,139,0.78) !important; }
.buddy-light .text-white\/60 .opacity-60 { color: rgba(100,116,139,0.72) !important; }
.buddy-light .text-white\/65 .opacity-60 { color: rgba(100,116,139,0.7) !important; }
.buddy-light .text-white\/70 .opacity-60 { color: rgba(100,116,139,0.7) !important; }
.buddy-light .text-white\/70 .opacity-80 { color: rgba(51,65,85,0.86) !important; }
.buddy-light .text-white\/70 .opacity-75 { color: rgba(71,85,105,0.78) !important; }
.buddy-light .text-white\/70 .opacity-65 { color: rgba(100,116,139,0.72) !important; }
.buddy-light .text-white\/60 .opacity-80 { color: rgba(51,65,85,0.84) !important; }
.buddy-light .text-white\/90 .opacity-65 { color: rgba(71,85,105,0.78) !important; }
.buddy-light .text-white\/60 .opacity-50 { color: rgba(148,163,184,0.6) !important; }
.buddy-light .text-white\/70 .opacity-50 { color: rgba(148,163,184,0.6) !important; }
.buddy-light .text-white\/70 .opacity-40 { color: rgba(148,163,184,0.5) !important; }
.buddy-light .text-white\/70 .opacity-45 { color: rgba(148,163,184,0.52) !important; }
`;

// Legacy surface helpers remain for existing markup; light theme overrides restyle them.
const PANEL_SURFACE = 'border border-[color:var(--card-border,rgba(255,255,255,0.12))] bg-[color:var(--surface,rgba(20,24,40,0.94))] text-white/90 shadow-[0_26px_80px_rgba(6,10,24,0.55)] backdrop-blur-lg';
const CARD_SURFACE = 'border border-[color:var(--card-border,rgba(255,255,255,0.1))] bg-[color:var(--card-surface,rgba(255,255,255,0.08))] text-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(6,10,24,0.35)]';


const COSMETICS: Cosmetic[] = [
  // Hats
  { id: 'hat_beanie',     name: 'Шапка-бини',          kind: 'hat',        rarity: 'common',    price: 20 },
  { id: 'hat_witch',      name: 'Ведьмина шляпа',      kind: 'hat',        rarity: 'epic',      price: 120, season: 'halloween' },
  { id: 'hat_crown',      name: 'Корона рассвета',     kind: 'hat',        rarity: 'legendary', price: 260 },
  { id: 'hat_aurora',     name: 'Диадема «Аврора»',    kind: 'hat',        rarity: 'epic',      price: 190 },
  { id: 'hat_sailor',     name: 'Бескозырка',          kind: 'hat',        rarity: 'rare',      price: 85 },
  { id: 'hat_flower',     name: 'Венок из звёзд',      kind: 'hat',        rarity: 'rare',      price: 95 },
  { id: 'hat_stargazer',  name: 'Шляпа астронома',     kind: 'hat',        rarity: 'epic',      price: 180 },
  { id: 'hat_starfall',   name: 'Корона «Звёздопад»',  kind: 'hat',        rarity: 'legendary', price: 0, exclusive: 'code', unlockCode: 'STARFALL' },

  // Glasses & face
  { id: 'gls_round',      name: 'Круглые очки',        kind: 'glasses',    rarity: 'rare',      price: 55 },
  { id: 'gls_star',       name: 'Звёздные линзы',      kind: 'glasses',    rarity: 'epic',      price: 120 },
  { id: 'gls_visor',      name: 'Неоновый визор',      kind: 'glasses',    rarity: 'legendary', price: 210 },
  { id: 'gls_holo',       name: 'Голографические очки',kind: 'glasses',    rarity: 'legendary', price: 240 },

  // Hoodies & costumes
  { id: 'hood_purple',    name: 'Фиолетовый худи',     kind: 'hoodie',     rarity: 'rare',      price: 70 },
  { id: 'hood_neon',      name: 'Неоновый худи',       kind: 'hoodie',     rarity: 'epic',      price: 130 },
  { id: 'hood_frost',     name: 'Ледяной плащ',        kind: 'hoodie',     rarity: 'epic',      price: 150 },
  { id: 'costume_starlight', name: 'Костюм «Сияние»',  kind: 'costume',    rarity: 'legendary', price: 280 },
  { id: 'costume_aurora', name: 'Костюм «Аврора»',     kind: 'costume',    rarity: 'epic',      price: 230 },
  { id: 'costume_cosmo',  name: 'Космокостюм',         kind: 'costume',    rarity: 'legendary', price: 320 },
  { id: 'costume_fairy',  name: 'Небесная фея',        kind: 'costume',    rarity: 'epic',      price: 250 },
  { id: 'costume_dev_grid', name: 'DEV-костюм «Сетка»', kind: 'costume',   rarity: 'legendary', price: 0, exclusive: 'developer', unlockCode: DEV_UNLOCK_CODE },

  // Back items
  { id: 'backpack_sky',   name: 'Рюкзак «Sky»',        kind: 'backpack',   rarity: 'common',    price: 25 },
  { id: 'backpack_nebula',name: 'Рюкзак «Туманность»', kind: 'backpack',   rarity: 'epic',      price: 140 },
  { id: 'cape_night',     name: 'Плащ ночи',           kind: 'cape',       rarity: 'epic',      price: 110 },
  { id: 'cape_sakura',    name: 'Плащ сакуры',         kind: 'cape',       rarity: 'rare',      price: 105 },
  { id: 'backpack_pixel', name: 'Пиксельный рюкзак',   kind: 'backpack',   rarity: 'rare',      price: 90 },

  // Wings & tails
  { id: 'wings_angel',    name: 'Крылья ангела',       kind: 'wings',      rarity: 'epic',      price: 140 },
  { id: 'wings_starlight',name: 'Звёздные крылья',     kind: 'wings',      rarity: 'legendary', price: 250 },
  { id: 'wings_mech',     name: 'Меха-крылья',         kind: 'wings',      rarity: 'epic',      price: 210 },
  { id: 'tail_cat',       name: 'Хвост котика',        kind: 'tail',       rarity: 'rare',      price: 45 },
  { id: 'tail_dragon',    name: 'Хвост дракона',       kind: 'tail',       rarity: 'epic',      price: 135 },
  { id: 'wings_lumen',    name: 'Крылья «Люмен»',      kind: 'wings',      rarity: 'legendary', price: 0, exclusive: 'code', unlockCode: 'LUMENWINGS' },
  { id: 'tail_starfire',  name: 'Хвост «Звёздное пламя»', kind: 'tail',    rarity: 'epic',      price: 165 },

  // Aura & sticker
  { id: 'aura_neon',      name: 'Неоновая аура',       kind: 'aura',       rarity: 'legendary', price: 220 },
  { id: 'aura_starlight', name: 'Аура сияния',         kind: 'aura',       rarity: 'legendary', price: 260 },
  { id: 'aura_blizzard',  name: 'Аура метели',         kind: 'aura',       rarity: 'epic',      price: 210 },
  { id: 'aura_dev_debug', name: 'DEV-аура «Отладка»',  kind: 'aura',       rarity: 'legendary', price: 0, exclusive: 'developer', unlockCode: DEV_UNLOCK_CODE },
  { id: 'sticker_hearts', name: 'Сердечки',            kind: 'sticker',    rarity: 'rare',      price: 40 },
  { id: 'sticker_stars',  name: 'Звёздочки',           kind: 'sticker',    rarity: 'common',    price: 35 },
  { id: 'sticker_moon',   name: 'Лунный свет',         kind: 'sticker',    rarity: 'rare',      price: 48 },
  { id: 'sticker_patch',  name: 'Патч ноут',           kind: 'sticker',    rarity: 'rare',      price: 52 },

  // Pets & gadgets
  { id: 'pet_ghost',      name: 'Мини-призрак',        kind: 'pet',        rarity: 'epic',      price: 150 },
  { id: 'pet_fox',        name: 'Лисёнок Ки',          kind: 'pet',        rarity: 'legendary', price: 280 },
  { id: 'pet_drone',      name: 'Дрон-спутник',        kind: 'pet',        rarity: 'epic',      price: 220 },
  { id: 'pet_capibara',   name: 'Капибара Сырок',      kind: 'pet',        rarity: 'epic',      price: 260 },
  { id: 'pet_moonling',   name: 'Питомец «Мунлинг»',   kind: 'pet',        rarity: 'legendary', price: 0, exclusive: 'code', unlockCode: 'MOONBUDDY' },
  { id: 'pet_dev_pixel',  name: 'DEV-питомец «Пиксельный кот»', kind: 'pet', rarity: 'legendary', price: 0, exclusive: 'developer', unlockCode: DEV_UNLOCK_CODE },

  // Audio & tech
  { id: 'head_on',        name: 'Наушники',            kind: 'headphones', rarity: 'rare',      price: 60 },
  { id: 'head_neon',      name: 'Неоновые наушники',   kind: 'headphones', rarity: 'epic',      price: 125 },
  { id: 'head_chroma',    name: 'Хрома-наушники',      kind: 'headphones', rarity: 'legendary', price: 170 },

  // Palettes
  { id: 'pal_ocean',      name: 'Океан',               kind: 'palette',    rarity: 'common',    price: 10,  data: { grad: ['#bcd3ff', '#6a79ff'] } },
  { id: 'pal_sunset',     name: 'Закат',               kind: 'palette',    rarity: 'rare',      price: 40,  data: { grad: ['#ffd7a1', '#ff6a88'] } },
  { id: 'pal_void',       name: 'Космос',              kind: 'palette',    rarity: 'epic',      price: 120, data: { grad: ['#a7b0ff', '#5a2cff'] } },
  { id: 'pal_blossom',    name: 'Цветение',            kind: 'palette',    rarity: 'rare',      price: 55,  data: { grad: ['#ffb3d2', '#ff77a9'] } },
  { id: 'pal_midnight',   name: 'Полночь',             kind: 'palette',    rarity: 'epic',      price: 140, data: { grad: ['#2b2d55', '#141729'] } },
  { id: 'pal_aurora',     name: 'Аврора',              kind: 'palette',    rarity: 'legendary', price: 180, data: { grad: ['#7de3ff', '#8b5cf6'] } },
  { id: 'pal_candy',      name: 'Маршмеллоу',          kind: 'palette',    rarity: 'rare',      price: 58,  data: { grad: ['#ffe6f3', '#ffc8de'] } },
  { id: 'pal_celestial',  name: 'Небула',              kind: 'palette',    rarity: 'legendary', price: 0, exclusive: 'code', unlockCode: 'NEBULOVE', data: { grad: ['#8ad7ff', '#b388ff'] } },
  { id: 'pal_softnight',  name: 'Лунная ночь',         kind: 'palette',    rarity: 'epic',      price: 150, data: { grad: ['#1f2448', '#513d8a'] } },
];

const ALL_COSMETIC_IDS = COSMETICS.map((c) => c.id);
const COSMETICS_BY_ID = Object.fromEntries(COSMETICS.map((c) => [c.id, c] as const)) as Record<string, Cosmetic>;

const INV_LABELS: Record<keyof Inv, { label: string; emoji: string }> = {
  cookie: { label: 'Печеньки', emoji: '🍪' },
  meal: { label: 'Обеды', emoji: '🍲' },
  toy: { label: 'Игрушки', emoji: '🧸' },
  medkit: { label: 'Аптечки', emoji: '💊' },
  gift: { label: 'Подарки', emoji: '🎁' },
};

type SecretCodeGrant = {
  addCosmetics?: string[] | 'ALL';
  addCoins?: number;
  minCoins?: number;
  addInventory?: Partial<Record<keyof Inv, number>>;
  minInventory?: Partial<Record<keyof Inv, number>>;
};

type SecretCode = {
  code: string;
  title: string;
  description: string;
  rewards: string[];
  developerOnly?: boolean;
  grant: SecretCodeGrant;
};

type RedeemResult = { ok: boolean; message: string };

const SECRET_CODES: SecretCode[] = [
  {
    code: 'CHEB2025',
    title: 'Старт сезона',
    description: 'Подарок для быстрого старта приключений.',
    rewards: ['+25 монет', '🍪 Печенька'],
    grant: {
      addCoins: 25,
      addInventory: { cookie: 1 },
    },
  },
  {
    code: 'AURABOOM',
    title: 'Неоновая вспышка',
    description: 'Сияющая аура и немного монет на радость.',
    rewards: ['Аура «Неон»', '+10 монет'],
    grant: {
      addCosmetics: ['aura_neon'],
      addCoins: 10,
    },
  },
  {
    code: 'STARFALL',
    title: 'Звёздный дождь',
    description: 'Эксклюзивная корона только по секретному коду.',
    rewards: ['Корона «Звёздопад»'],
    grant: {
      addCosmetics: ['hat_starfall'],
    },
  },
  {
    code: 'LUMENWINGS',
    title: 'Полёт Люмена',
    description: 'Дарит легендарные крылья и немного энергии в монетах.',
    rewards: ['Крылья «Люмен»', '+15 монет'],
    grant: {
      addCosmetics: ['wings_lumen'],
      addCoins: 15,
    },
  },
  {
    code: 'MOONBUDDY',
    title: 'Лунный друг',
    description: 'Призовите редкого питомца Мунлинга.',
    rewards: ['Питомец «Мунлинг»', '🧸 Игрушка'],
    grant: {
      addCosmetics: ['pet_moonling'],
      addInventory: { toy: 1 },
    },
  },
  {
    code: 'NEBULOVE',
    title: 'Объятия туманности',
    description: 'Палитра космических оттенков и немного подарков.',
    rewards: ['Палитра «Небула»', '🎁 Подарок'],
    grant: {
      addCosmetics: ['pal_celestial'],
      addInventory: { gift: 1 },
    },
  },
  {
    code: DEV_UNLOCK_CODE,
    title: 'Developer Access',
    description: 'Разблокирует весь каталог, выдаёт ресурсы и DEV-эксклюзивы.',
    rewards: [
      'Весь каталог аксессуаров',
      'DEV-набор: костюм «Сетка», аура «Отладка», питомец «Пиксельный кот»',
      'Минимум 9999 монет и полный инвентарь',
    ],
    developerOnly: true,
    grant: {
      addCosmetics: 'ALL',
      minCoins: 9999,
      minInventory: { cookie: 12, meal: 6, toy: 6, medkit: 4, gift: 6 },
    },
  },
];

const SECRET_CODE_MAP: Record<string, SecretCode> = SECRET_CODES.reduce((acc, code) => {
  acc[code.code] = code;
  return acc;
}, {} as Record<string, SecretCode>);

const ACHIEVEMENTS_CATALOG = [
  { id: 'firstPet',   label: 'Погладить Чебзика' },
  { id: 'firstWin',   label: 'Первая победа в мини-игре' },
  { id: 'blink15',    label: 'Блик: 15 очков' },
  { id: 'snake10',    label: 'Змейка: 10 яблок' },
  { id: 'meteor12',   label: 'Метеор-дождь: 12 звёзд' },
  { id: 'glow14',     label: 'Неоновое поле: 14 огоньков' },
  { id: 'streak3',    label: 'Серия входов: 3 дня' },
  { id: 'level5',     label: 'Достигнуть уровня 5' },
] as const;

function rarityBadge(r: Rarity) {
  return r === 'legendary'
    ? 'border-[rgba(255,214,130,0.5)] bg-[rgba(255,214,130,0.18)] shadow-[0_12px_36px_rgba(255,214,130,0.2)]'
    : r === 'epic'
    ? 'border-[rgba(209,134,255,0.5)] bg-[rgba(155,92,255,0.16)] shadow-[0_12px_36px_rgba(150,70,255,0.2)]'
    : r === 'rare'
    ? 'border-[rgba(126,195,255,0.5)] bg-[rgba(70,160,255,0.16)] shadow-[0_12px_36px_rgba(80,170,255,0.18)]'
    : 'border-white/12 bg-[rgba(255,255,255,0.08)] shadow-[0_10px_30px_rgba(8,12,26,0.25)] backdrop-blur-sm';
}

/* =========================================================
   Default Save & Hook
========================================================= */

type QuestTemplate = {
  tracker: string;
  icon: string;
  hint: string;
  label: (target: number) => string;
  weeklyLabel?: (target: number) => string;
  target: [number, number];
  reward: [number, number];
  weight?: number;
};

const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    tracker: 'feed',
    icon: '🍪',
    hint: 'Корми Чебзика печеньками или обедом из инвентаря.',
    label: (t) => `Покорми Чебзика ${t} ${t === 1 ? 'раз' : 'раза'}`,
    target: [2, 4],
    reward: [6, 10],
    weight: 1.2,
  },
  {
    tracker: 'pet',
    icon: '🤲',
    hint: 'Нажимай на Чебзика, чтобы почесать ему макушку.',
    label: (t) => `Погладь Чебзика ${t} ${t === 1 ? 'раз' : 'раза'}`,
    target: [1, 3],
    reward: [4, 8],
  },
  {
    tracker: 'playtoy',
    icon: '🧸',
    hint: 'Используй игрушки — они повышают настроение.',
    label: (t) => `Поиграй с игрушкой ${t} ${t === 1 ? 'раз' : 'раза'}`,
    target: [1, 2],
    reward: [6, 9],
  },
  {
    tracker: 'mini_any',
    icon: '🎮',
    hint: 'Запускай любые мини-игры из быстрых действий.',
    label: (t) => `Сыграй мини-игры ${t} ${t === 1 ? 'раз' : 'раза'}`,
    weeklyLabel: (t) => `Сыграй ${t} мини-игр за неделю`,
    target: [1, 3],
    reward: [7, 12],
    weight: 1.1,
  },
  {
    tracker: 'mini_blink',
    icon: '✨',
    hint: 'Лови вспышки света в мини-игре «Блик».',
    label: (t) => `Победи в «Блике» ${t} ${t === 1 ? 'раз' : 'раза'}`,
    weeklyLabel: (t) => `Выиграй «Блик» ${t} раз за неделю`,
    target: [1, 2],
    reward: [7, 12],
  },
  {
    tracker: 'mini_snake',
    icon: '🐍',
    hint: 'Собирай яблоки в мини-игре «Змейка».',
    label: (t) => `Победи в «Змейке» ${t} ${t === 1 ? 'раз' : 'раза'}`,
    weeklyLabel: (t) => `Победи в «Змейке» ${t} раз за неделю`,
    target: [1, 2],
    reward: [7, 12],
  },
  {
    tracker: 'mini_meteor',
    icon: '☄️',
    hint: 'Лови падающие звёзды в мини-игре «Метеор-дождь».',
    label: (t) => `Играй в «Метеор-дождь» ${t} ${t === 1 ? 'раз' : 'раза'}`,
    weeklyLabel: (t) => `Играй в «Метеор-дождь» ${t} раз за неделю`,
    target: [1, 2],
    reward: [7, 12],
  },
  {
    tracker: 'mini_glow',
    icon: '💡',
    hint: 'Щёлкай по огонькам в «Неоновом поле».',
    label: (t) => `Сыграй «Неоновое поле» ${t} ${t === 1 ? 'раз' : 'раза'}`,
    weeklyLabel: (t) => `Сыграй «Неоновое поле» ${t} раз за неделю`,
    target: [1, 2],
    reward: [7, 12],
  },
  {
    tracker: 'equip_rare',
    icon: '👑',
    hint: 'Надень редкий или эпический предмет в гардеробе.',
    label: (t) => `Надень редкие вещи ${t} ${t === 1 ? 'раз' : 'раза'}`,
    weeklyLabel: (t) => `Меняй редкие образы ${t} раз`,
    target: [1, 2],
    reward: [8, 14],
    weight: 0.7,
  },
  {
    tracker: 'gift_open',
    icon: '🎁',
    hint: 'Покупай и открывай подарки в магазине припасов.',
    label: (t) => `Открой подарки ${t} шт.`,
    weeklyLabel: (t) => `Открой ${t} подарков за неделю`,
    target: [1, 3],
    reward: [6, 10],
    weight: 0.6,
  },
];

const WEEKLY_TEMPLATES: QuestTemplate[] = [
  { ...QUEST_TEMPLATES.find((t) => t.tracker === 'mini_any')!, target: [8, 12], reward: [40, 60], weight: 1 },
  { ...QUEST_TEMPLATES.find((t) => t.tracker === 'mini_snake')!, target: [4, 6], reward: [35, 55], weight: 0.9 },
  { ...QUEST_TEMPLATES.find((t) => t.tracker === 'equip_rare')!, target: [3, 5], reward: [42, 62], weight: 0.7 },
  { ...QUEST_TEMPLATES.find((t) => t.tracker === 'gift_open')!, target: [5, 7], reward: [38, 55], weight: 0.6 },
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickTemplate(pool: QuestTemplate[]): { template: QuestTemplate; index: number } {
  const total = pool.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i += 1) {
    roll -= pool[i].weight ?? 1;
    if (roll <= 0) {
      return { template: pool[i], index: i };
    }
  }
  const lastIndex = Math.max(0, pool.length - 1);
  return { template: pool[lastIndex], index: lastIndex };
}

function makeQuestFromTemplate(template: QuestTemplate, target: number, reward: number): Quest {
  return {
    id: `${template.tracker}_${Math.random().toString(36).slice(2, 7)}`,
    label: template.label(target),
    progress: 0,
    target,
    reward,
    icon: template.icon,
    tracker: template.tracker,
    hint: template.hint,
  };
}

function rollDailyQuests(): Quest[] {
  const pool = QUEST_TEMPLATES.slice();
  const result: Quest[] = [];
  while (result.length < 3 && pool.length > 0) {
    const { template, index } = pickTemplate(pool);
    const target = randInt(template.target[0], template.target[1]);
    const reward = randInt(template.reward[0], template.reward[1]);
    result.push(makeQuestFromTemplate(template, target, reward));
    pool.splice(index, 1);
  }
  return result;
}

function rollWeeklyChallenge(): WeeklyChallenge {
  const { template } = pickTemplate(WEEKLY_TEMPLATES);
  const target = randInt(template.target[0], template.target[1]);
  const reward = randInt(template.reward[0], template.reward[1]);
  const label = template.weeklyLabel ? template.weeklyLabel(target) : template.label(target);
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  return {
    ...makeQuestFromTemplate(template, target, reward),
    label,
    expiresAt: expires.toISOString(),
  };
}

function rollDailyBuff(): DailyBuff {
  const buffs: DailyBuff[] = [
    { type: 'xp', amount: 25, label: '+25% XP', description: 'Опыт за действия увеличен.' },
    { type: 'coins', amount: 20, label: '+20% монет', description: 'Монеты начисляются чаще.' },
    { type: 'mood', amount: 15, label: 'Настроение ×1.5', description: 'Мини-игры сильнее повышают настроение.' },
    { type: 'stamina', amount: 18, label: '+Восстановление', description: 'Мини-игры возвращают немного выносливости.' },
  ];
  return buffs[Math.floor(Math.random() * buffs.length)];
}

function describeBuff(buff: DailyBuff): string {
  if (buff.label) return buff.label;
  switch (buff.type) {
    case 'xp':
      return '+XP';
    case 'coins':
      return '+монеты';
    case 'mood':
      return '+настроение';
    case 'stamina':
      return '+выносливость';
    default:
      return 'бафф';
  }
}

function buffMatches(buff: DailyBuff, type: DailyBuffType): boolean {
  return buff.type === type;
}

function buffMultiplier(buff: DailyBuff, type: 'xp' | 'coins'): number {
  if (!buffMatches(buff, type)) return 1;
  const amt = typeof buff.amount === 'number' ? buff.amount : 20;
  return 1 + Math.max(0, amt) / 100;
}

function defaultSave(): Save {
  return {
    version: 1,
    stats: { hunger: 35, mood: 70, energy: 80, name: 'Чебзик', last: now() },
    inv: { cookie: 2, meal: 1, toy: 1, medkit: 0, gift: 0 },
    daily: {
      date: today(),
      rewardClaimed: false,
      buff: rollDailyBuff(),
      quests: rollDailyQuests(),
      weeklyChallenge: rollWeeklyChallenge(),
      bonusBuffExpires: now() + inSeconds(24 * 3600),
    },
    game: { xp: 0, level: 1, coins: 20, streak: 1, lastLogin: today(), minigameBest: 0, highs: {} },
    log: ['Чебзик появился в вашем мире! ✨'],
    config: { animations: true, sounds: true, haptics: true },
    achievements: {},
    cosm: {
      owned: ['pal_ocean', 'hat_beanie', 'gls_round', 'hood_purple'],
      equipped: { palette: 'pal_ocean' }
    },
    shop: { rotAt: 0, items: [] },
    codes: [],
    fatigue: { stamina: 100, last: now() }
  };
}

function normalizeQuest(raw: any): Quest | null {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || typeof raw.label !== 'string') return null;
  const target = typeof raw.target === 'number' && Number.isFinite(raw.target) ? Math.max(1, Math.round(raw.target)) : 1;
  const progress = typeof raw.progress === 'number' && Number.isFinite(raw.progress)
    ? Math.max(0, Math.min(target, Math.round(raw.progress)))
    : 0;
  const reward = typeof raw.reward === 'number' && Number.isFinite(raw.reward) ? Math.max(0, Math.round(raw.reward)) : 0;
  const icon = typeof raw.icon === 'string' ? raw.icon : undefined;
  const tracker = typeof raw.tracker === 'string' ? raw.tracker : undefined;
  const hint = typeof raw.hint === 'string' ? raw.hint : undefined;
  return { id: raw.id, label: raw.label, target, progress, reward, claimed: !!raw.claimed, icon, tracker, hint };
}

function normalizeWeekly(raw: any): WeeklyChallenge | undefined {
  const quest = normalizeQuest(raw);
  if (!quest) return undefined;
  const expiresAt = typeof raw?.expiresAt === 'string' ? raw.expiresAt : new Date().toISOString();
  return { ...quest, expiresAt };
}

function normalizeDailyBuff(raw: any, fallback: DailyBuff): DailyBuff {
  if (!raw) return fallback;
  if (typeof raw === 'string') {
    return {
      type: (['xp', 'coins', 'mood', 'stamina'].includes(raw) ? raw : fallback.type) as DailyBuffType,
      amount: fallback.amount,
    };
  }
  if (typeof raw === 'object') {
    const type: DailyBuffType = ['xp', 'coins', 'mood', 'stamina'].includes(raw.type)
      ? raw.type
      : fallback.type;
    const amount = typeof raw.amount === 'number' && Number.isFinite(raw.amount) ? raw.amount : fallback.amount;
    const label = typeof raw.label === 'string' ? raw.label : fallback.label;
    const description = typeof raw.description === 'string' ? raw.description : fallback.description;
    return { type, amount, label, description };
  }
  return fallback;
}

function hydrateSave(raw: unknown): Save {
  const base = defaultSave();
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Partial<Save>;

  const stats = typeof data.stats === 'object' && data.stats
    ? { ...base.stats, ...data.stats }
    : base.stats;

  const inv = typeof data.inv === 'object' && data.inv
    ? { ...base.inv, ...data.inv }
    : base.inv;

  const dailyRaw = typeof data.daily === 'object' && data.daily ? data.daily : {};
  const questsRaw = Array.isArray((dailyRaw as any).quests) ? (dailyRaw as any).quests : [];
  const quests = questsRaw.map(normalizeQuest).filter((q): q is Quest => q !== null);
  const daily: Daily = {
    ...base.daily,
    date: typeof (dailyRaw as any).date === 'string' ? (dailyRaw as any).date : base.daily.date,
    rewardClaimed: typeof (dailyRaw as any).rewardClaimed === 'boolean'
      ? (dailyRaw as any).rewardClaimed
      : base.daily.rewardClaimed,
    quests: quests.length > 0 ? quests : base.daily.quests,
    buff: normalizeDailyBuff((dailyRaw as any).buff, base.daily.buff),
    weeklyChallenge: normalizeWeekly((dailyRaw as any).weeklyChallenge) ?? base.daily.weeklyChallenge,
    bonusBuffExpires: typeof (dailyRaw as any).bonusBuffExpires === 'number' && Number.isFinite((dailyRaw as any).bonusBuffExpires)
      ? (dailyRaw as any).bonusBuffExpires
      : base.daily.bonusBuffExpires,
  };

  const game = typeof data.game === 'object' && data.game
    ? { ...base.game, ...data.game }
    : base.game;

  const cosmRaw = typeof data.cosm === 'object' && data.cosm ? data.cosm : undefined;
  const cosm: CosmeticsState | undefined = cosmRaw
    ? {
        owned: Array.isArray((cosmRaw as any).owned)
          ? (cosmRaw as any).owned.filter((id: unknown): id is string => typeof id === 'string')
          : base.cosm?.owned ?? [],
        equipped: {
          ...(base.cosm?.equipped ?? {}),
          ...(typeof (cosmRaw as any).equipped === 'object' && (cosmRaw as any).equipped
            ? (cosmRaw as any).equipped
            : {}),
        },
      }
    : base.cosm;

  return {
    ...base,
    ...data,
    stats,
    inv,
    daily,
    game,
    cosm,
    shop: typeof data.shop === 'object' && data.shop ? data.shop : base.shop,
    codes: Array.isArray(data.codes) ? data.codes.filter((c): c is string => typeof c === 'string') : base.codes,
    achievements: typeof data.achievements === 'object' && data.achievements
      ? { ...base.achievements, ...data.achievements }
      : base.achievements,
    config: typeof data.config === 'object' && data.config
      ? { ...base.config, ...data.config }
      : base.config,
    fatigue: typeof data.fatigue === 'object' && data.fatigue
      ? { ...base.fatigue, ...data.fatigue }
      : base.fatigue,
  };
}

function useSave(): [Save, React.Dispatch<React.SetStateAction<Save>>] {
  const [save, setSave] = React.useState<Save>(() => {
    try {
      const raw = localStorage.getItem(K);
      if (raw) return hydrateSave(JSON.parse(raw));
    } catch {}
    return defaultSave();
  });
  React.useEffect(() => { try { localStorage.setItem(K, JSON.stringify(save)); } catch {} }, [save]);
  return [save, setSave];
}

/* =========================================================
   Avatar (SVG with overlays & palettes)
========================================================= */

const ChebzikAvatar: React.FC<{
  className?: string;
  mood?: number;
  energy?: number;
  palette?: string | undefined;
  equipped?: Partial<Record<CosmeticKind, string>>;
  showSticker?: boolean;
}> = ({ className, mood = 0.7, energy = 0.8, palette, equipped, showSticker }) => {
  const eyeDy = (1 - energy) * 1.6;
  const smile = 19 + (0.5 - mood) * 4;
  const pal = COSMETICS.find(c => c.id === palette);
  const gradA: string = pal?.data?.grad?.[0] ?? '#bcd3ff';
  const gradB: string = pal?.data?.grad?.[1] ?? '#6a79ff';

  const accentHex = pal?.data?.grad?.[1] ?? '#8B5CF6';

  // pieces
  const Hat = () => {
    const id = equipped?.hat;
    if (!id) return null;
    switch (id) {
      case 'hat_beanie':
        return <path d="M9 9c2-3 6-4 9-4s7 1 9 4l-1 2H10z" fill="#2b2b3a" stroke="#3c425d" strokeWidth=".4" />;
      case 'hat_witch':
        return (
          <g>
            <path d="M7 12l12-7 2 7h5l-7 3H9z" fill="#3b1e5a" stroke="#9c6bff" strokeWidth=".5" />
            <path d="M11 13.2h14" stroke="#c3a7ff" strokeWidth=".4" opacity=".8" />
          </g>
        );
      case 'hat_crown':
        return (
          <g>
            <path d="M8 11l2.8 4 2.8-3.2L16 15l2.6-3.2L21 15l3-4 3 4 1 3H7l1-3z" fill="url(#crown-g)" stroke="#ffd86e" strokeWidth=".5" />
            <circle cx="10.6" cy="11.4" r=".7" fill="#ffe6a3" />
            <circle cx="18.6" cy="10.8" r=".8" fill="#fff2c3" />
            <circle cx="25.4" cy="11.4" r=".7" fill="#ffe6a3" />
          </g>
        );
      case 'hat_aurora':
        return <path d="M7.5 13.2c3.5-5.4 17.5-5.4 21 0l-1.5 2.6H9z" fill="url(#hat-aurora-g)" stroke="#9fd8ff" strokeWidth=".45" opacity=".95" />;
      case 'hat_sailor':
        return (
          <g>
            <path d="M9 11.2c2.5-2 15.5-2 18 0l-.8 2.2H9.8z" fill="#f1f5ff" stroke="#a3b6ff" strokeWidth=".35" />
            <path d="M12 9.8c3-1.4 8-1.4 11 0l-5.4 1.6z" fill="#d1dcff" opacity=".9" />
          </g>
        );
      case 'hat_flower':
        return (
          <g opacity=".92">
            <path d="M8.4 12.6c3.4-3.8 16.8-3.8 20.2 0l-1.4 2H9.8z" fill="#3b2f5e" stroke="#f6dcff" strokeWidth=".35" />
            {[11, 15.2, 19, 22.8, 26.6].map((cx, idx) => (
              <circle key={idx} cx={cx} cy={11.2} r={0.9} fill={idx % 2 === 0 ? '#ff99da' : '#ffd27a'} stroke="#fff2f7" strokeWidth=".2" />
            ))}
          </g>
        );
      case 'hat_stargazer':
        return (
          <g opacity=".94">
            <ellipse cx="18" cy="14" rx="11.6" ry="3.2" fill="#1c1c33" stroke="#6474ff" strokeWidth=".4" />
            <path d="M12.2 10.4c2.4-2 9.2-2 11.6 0l-1.3 3.8H13.5z" fill="#232a55" stroke="#7ea5ff" strokeWidth=".35" />
            <path d="M18 7.8l1 2h2.2l-1.8 1.1.7 2-2.1-1.3-2.1 1.3.7-2-1.8-1.1h2.2z" fill="#ffe48a" stroke="#ffcf6b" strokeWidth=".3" />
          </g>
        );
      case 'hat_starfall':
        return (
          <g opacity=".96">
            <path d="M8.2 12.4l2.4 3.6 2.6-3 3 3.6 2.8-3.6 2.8 3.6 2.8-3 2.6 3 1.2 2.6H7l1.2-2.6z" fill="url(#crown-g)" stroke="#ffe39c" strokeWidth=".45" />
            <path d="M18 7.2l1 2.6h2.6l-2.1 1.2.8 2.4-2.3-1.4-2.3 1.4.8-2.4-2.1-1.2h2.6z" fill="#fff4c1" stroke="#ffd670" strokeWidth=".32" />
          </g>
        );
      default:
        return null;
    }
  };

  const Glasses = () => {
    const id = equipped?.glasses;
    if (!id) return null;
    if (id === 'gls_round') {
      return (
        <g opacity=".95">
          <circle cx="13.5" cy="13.6" r="3.1" fill="none" stroke="#1e2336" strokeWidth=".8" />
          <circle cx="22.5" cy="13.6" r="3.1" fill="none" stroke="#1e2336" strokeWidth=".8" />
          <rect x="16.1" y="13.1" width="3.8" height=".8" fill="#1e2336" />
        </g>
      );
    }
    if (id === 'gls_star') {
      return (
        <g fill="none" stroke="url(#gls-star-g)" strokeWidth=".7" strokeLinejoin="round">
          <path d="M10 13l1.2-2.6L13 9.2l1.8 1.2.8 2.6-1 2.5-2.6.8z" />
          <path d="M23 13l1.2-2.6L26 9.2l1.8 1.2.8 2.6-1 2.5-2.6.8z" />
          <line x1="14.6" y1="13.2" x2="21.2" y2="13.2" strokeWidth=".6" strokeLinecap="round" />
        </g>
      );
    }
    if (id === 'gls_visor') {
      return (
        <path d="M10 12.5c1.5-3 14.5-3 16 0l-.8 3c-4.6.8-9.8.8-14.4 0z" fill="url(#visor-g)" stroke="#65fff5" strokeWidth=".4" opacity=".9" />
      );
    }
    if (id === 'gls_holo') {
      return (
        <g opacity=".9">
          <rect x="9.6" y="11.4" width="17" height="3.2" rx="1.4" fill="url(#visor-g)" stroke="#7de3ff" strokeWidth=".35" />
          <path d="M13 11.8l-1.6 3" stroke="#ffffff" strokeOpacity=".4" strokeWidth=".3" />
          <path d="M24.6 11.8l1.6 3" stroke="#ffffff" strokeOpacity=".4" strokeWidth=".3" />
        </g>
      );
    }
    return null;
  };

  const Hoodie = () => {
    const id = equipped?.hoodie;
    if (!id) return null;
    switch (id) {
      case 'hood_purple':
        return <path d="M6 18c0-8 6-12 12-12s12 4 12 12v4c0 2-1.6 3.5-3.6 3.5-1.2 0-2.3-.6-3-1.6-.6 1-1.7 1.6-2.8 1.6s-2.2-.6-2.8-1.6c-.7 1-1.8 1.6-3 1.6C7.6 25.5 6 24 6 22z" fill="url(#hood-purple-g)" opacity=".65" />;
      case 'hood_neon':
        return <path d="M6 18c0-8 6-12 12-12s12 4 12 12v4c0 2-1.4 3.8-3.4 3.8-1.1 0-2.2-.6-3-1.5-.7 1.1-2 1.8-3.3 1.8s-2.6-.7-3.3-1.8c-.8.9-1.9 1.5-3 1.5C7.4 25.8 6 24 6 22z" fill="url(#hood-neon-g)" opacity=".85" />;
      case 'hood_frost':
        return <path d="M6 18.4c0-8.2 6-12.4 12-12.4s12 4.2 12 12.4v3.4c0 2-1.4 3.4-3.2 3.4-1.2 0-2.3-.6-3-1.4-.7.8-1.8 1.4-3 1.4s-2.3-.6-3-1.4c-.7.8-1.8 1.4-3 1.4-1.8 0-3.8-1.4-3.8-3.4z" fill="url(#hood-frost-g)" opacity=".9" />;
      default:
        return null;
    }
  };

  const Costume = () => {
    const id = equipped?.costume;
    if (!id) return null;
    if (id === 'costume_starlight') {
      return <path d="M9 18c0-5.6 4.8-9.8 9-9.8s9 4.2 9 9.8v4.2c0 2.6-2 4.8-4.6 4.8-1.6 0-3-.8-4-2-.9 1.2-2.4 2-4 2-2.6 0-4.4-2.2-4.4-4.8z" fill="url(#costume-starlight-g)" opacity=".95" stroke="#c4d4ff" strokeWidth=".35" />;
    }
    if (id === 'costume_aurora') {
      return <path d="M8.6 18.2c0-6 5.4-10.6 9.4-10.6s9.4 4.6 9.4 10.6v3.8c0 3-2.4 5.6-5.3 5.6-1.8 0-3.4-.8-4.4-2.1-1 1.3-2.6 2.1-4.4 2.1-2.9 0-4.7-2.6-4.7-5.6z" fill="url(#costume-aurora-g)" opacity=".92" stroke="#75d6ff" strokeWidth=".32" />;
    }
    if (id === 'costume_cosmo') {
      return (
        <g opacity=".95">
          <path d="M8.6 18.2c0-6 5.2-10.4 9.4-10.4s9.4 4.4 9.4 10.4v4c0 2.8-2.2 5.2-4.9 5.2-1.7 0-3.1-.7-4.2-1.9-1 1.2-2.5 1.9-4.2 1.9-2.7 0-4.9-2.4-4.9-5.2z" fill="url(#wing-starlight-g)" stroke="#6cd4ff" strokeWidth=".32" />
          <circle cx="18" cy="18" r="1" fill="#fff" opacity=".45" />
          <circle cx="21.4" cy="20.2" r="0.8" fill="#ffe9a8" opacity=".5" />
        </g>
      );
    }
    if (id === 'costume_fairy') {
      return (
        <g opacity=".92">
          <path d="M8.8 18.4c0-6.2 5.2-10.8 9.2-10.8s9.2 4.6 9.2 10.8v3.8c0 3-2.2 5.6-5 5.6-1.8 0-3.3-.8-4.4-2-1.1 1.2-2.6 2-4.4 2-2.8 0-4.6-2.6-4.6-5.6z" fill="url(#cape-sakura-g)" stroke="#ffbdea" strokeWidth=".32" />
          <path d="M11 18c2.6-1.2 5.2-1.2 7.8 0" stroke="#ffe4f6" strokeWidth=".4" strokeLinecap="round" opacity=".7" />
        </g>
      );
    }
    if (id === 'costume_dev_grid') {
      return (
        <g opacity=".95">
          <path d="M9 18.2c0-5.8 4.8-10.2 9-10.2s9 4.4 9 10.2v4c0 2.8-2 5-4.6 5-1.6 0-3-.8-4-1.8-1 1.1-2.4 1.8-4 1.8-2.6 0-4.4-2.2-4.4-5z" fill="#151a2c" stroke="#6ee7ff" strokeWidth=".3" />
          <path d="M12 18h12" stroke="#6ee7ff" strokeWidth=".3" strokeDasharray="2 1" opacity=".6" />
          <path d="M18 13v10" stroke="#6ee7ff" strokeWidth=".3" strokeDasharray="2 1" opacity=".6" />
        </g>
      );
    }
    return null;
  };

  const Backpack = () => {
    const id = equipped?.backpack;
    if (!id) return null;
    switch (id) {
      case 'backpack_sky':
        return <rect x="7" y="17.5" width="6.4" height="7.2" rx="1.6" fill="#394260" opacity=".6" stroke="#4e5678" strokeWidth=".3" />;
      case 'backpack_nebula':
        return (
          <g opacity=".9">
            <rect x="6.6" y="17.2" width="6.8" height="7.6" rx="1.8" fill="url(#backpack-nebula-g)" stroke="#82a2ff" strokeWidth=".35" />
            <circle cx="10" cy="21" r="1.2" fill="#fff" opacity=".6" />
          </g>
        );
      case 'backpack_pixel':
        return (
          <g opacity=".95">
            <rect x="6.8" y="17.4" width="6.6" height="7.2" rx="1.4" fill="#1f253f" stroke="#6dd4ff" strokeWidth=".32" />
            {[0, 1, 2].map((row) => (
              [0, 1, 2].map((col) => (
                <rect key={`${row}-${col}`} x={7.4 + col * 2} y={18 + row * 2} width="1.3" height="1.3" fill={row === 1 && col === 1 ? '#7de3ff' : '#8b5cf6'} opacity=".65" />
              ))
            ))}
          </g>
        );
      default:
        return null;
    }
  };

  const Headphones = () => {
    const id = equipped?.headphones;
    if (!id) return null;
    if (id === 'head_on') {
      return (
        <g opacity=".9">
          <path d="M10 11c2-4 12-4 16 0" stroke="#1e2238" strokeWidth="1.2" fill="none" />
          <rect x="8.5" y="12.2" width="2.6" height="4.4" rx="1" fill="#2a2e48" />
          <rect x="24.9" y="12.2" width="2.6" height="4.4" rx="1" fill="#2a2e48" />
        </g>
      );
    }
    if (id === 'head_neon') {
      return (
        <g>
          <path d="M9.4 11.2c2.2-4.4 14.6-4.4 16.8 0" stroke="url(#head-neon-band)" strokeWidth="1.3" fill="none" />
          <rect x="8" y="12" width="3" height="4.8" rx="1.1" fill="url(#head-neon-ear)" />
          <rect x="24.2" y="12" width="3" height="4.8" rx="1.1" fill="url(#head-neon-ear)" />
          <circle cx="9.5" cy="14.4" r=".7" fill="#fff" opacity=".75" />
          <circle cx="26.8" cy="14.4" r=".7" fill="#fff" opacity=".75" />
        </g>
      );
    }
    if (id === 'head_chroma') {
      return (
        <g opacity=".95">
          <path d="M9.2 11c2.4-4.6 15.2-4.6 17.6 0" stroke="url(#head-neon-band)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <rect x="8" y="12" width="3.2" height="5" rx="1.2" fill="#1c1f34" stroke="#7de3ff" strokeWidth=".28" />
          <rect x="24.6" y="12" width="3.2" height="5" rx="1.2" fill="#1c1f34" stroke="#f472b6" strokeWidth=".28" />
          <circle cx="9.4" cy="14.6" r=".6" fill="#7de3ff" opacity=".8" />
          <circle cx="27" cy="14.6" r=".6" fill="#f472b6" opacity=".8" />
        </g>
      );
    }
    return null;
  };

  const Cape = () => {
    const id = equipped?.cape;
    if (!id) return null;
    if (id === 'cape_night') {
      return <path d="M6 20c6 4 18 4 24 0l-3 6H9z" fill="#1c1d2f" opacity=".35" />;
    }
    if (id === 'cape_sakura') {
      return <path d="M6 20.2c6.6 4.4 18 4.4 24.6 0l-3.4 6.6H9.4z" fill="url(#cape-sakura-g)" opacity=".75" />;
    }
    return null;
  };

  const Tail = () => {
    const id = equipped?.tail;
    if (!id) return null;
    if (id === 'tail_cat') {
      return <path d="M28 26c4 1 5 3 4.2 4.3-.8 1.3-3 .6-5.4-1.3" stroke="#99a6ff" strokeWidth="1" fill="none" />;
    }
    if (id === 'tail_dragon') {
      return <path d="M27.6 25.4c5.4 1.4 6.8 4.4 5.4 6.2-1.2 1.7-4.4.8-7.6-1.6 1.2-.8 2.6-1.8 3.4-3.2l-3.4-.8z" fill="url(#tail-dragon-g)" stroke="#3854b8" strokeWidth=".4" />;
    }
    if (id === 'tail_starfire') {
      return (
        <path
          d="M27 25.8c5 1.6 6.4 4.2 5.2 5.8-1.1 1.5-3.8.8-6.8-1.2 1.3-.6 2.6-1.6 3.3-2.8l-3.1-.6z"
          fill="url(#wing-starlight-g)"
          stroke="#f59e0b"
          strokeWidth=".38"
        />
      );
    }
    return null;
  };

  const Wings = () => {
    const id = equipped?.wings;
    if (!id) return null;
    if (id === 'wings_angel') {
      return (
        <g opacity=".65">
          <path d="M4 16c3-2 5-3 8-3-1 3-3 5-7 6" fill="rgba(200,220,255,.25)" />
          <path d="M32 16c-3-2-5-3-8-3 1 3 3 5 7 6" fill="rgba(200,220,255,.25)" />
        </g>
      );
    }
    if (id === 'wings_starlight') {
      return (
        <g opacity=".8">
          <path d="M3.6 16.4c3.6-2.6 6.4-3.6 9.6-3-1.4 3.6-4 6.2-8.6 7.6" fill="url(#wing-starlight-g)" />
          <path d="M32.4 16.4c-3.6-2.6-6.4-3.6-9.6-3 1.4 3.6 4 6.2 8.6 7.6" fill="url(#wing-starlight-g)" />
        </g>
      );
    }
    if (id === 'wings_mech') {
      return (
        <g opacity=".9">
          <path d="M5 17l6-4 2 3-6 5z" fill="url(#wing-mech-g)" stroke="#6d7be0" strokeWidth=".35" />
          <path d="M31 17l-6-4-2 3 6 5z" fill="url(#wing-mech-g)" stroke="#6d7be0" strokeWidth=".35" />
        </g>
      );
    }
    if (id === 'wings_lumen') {
      return (
        <g opacity=".88">
          <path d="M4.4 16.2c3.2-2.2 6-3 9-2-1.2 3.4-3.8 6-7.8 7.2" fill={toRgba(accentHex, 0.28)} stroke={accentHex} strokeWidth=".32" />
          <path d="M31.6 16.2c-3.2-2.2-6-3-9-2 1.2 3.4 3.8 6 7.8 7.2" fill={toRgba(accentHex, 0.28)} stroke={accentHex} strokeWidth=".32" />
        </g>
      );
    }
    return null;
  };

  const Aura = () => {
    const id = equipped?.aura;
    if (!id) return null;
    if (id === 'aura_neon') {
      return <circle cx="18" cy="18" r="13" fill="none" stroke="url(#aura-g)" strokeWidth="3" opacity=".35" />;
    }
    if (id === 'aura_starlight') {
      return <circle cx="18" cy="18" r="13.5" fill="none" stroke="url(#aura-starlight-g)" strokeWidth="3.2" opacity=".45" />;
    }
    if (id === 'aura_blizzard') {
      return <circle cx="18" cy="18" r="12.8" fill="none" stroke="url(#aura-blizzard-g)" strokeWidth="3" opacity=".48" />;
    }
    if (id === 'aura_dev_debug') {
      return (
        <g opacity=".65">
          <circle cx="18" cy="18" r="13.2" fill="none" stroke="#7de3ff" strokeWidth="1.4" strokeDasharray="4 3" />
          <circle cx="18" cy="18" r="10.8" fill="none" stroke="#f472b6" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      );
    }
    return null;
  };

  const Sticker = () => {
    if (!showSticker) return null;
    const id = equipped?.sticker;
    if (!id) {
      if (mood > 0.8) return <text x="27" y="8" fontSize="5">✨</text>;
      if (mood < 0.3) return <text x="27" y="8" fontSize="5">💧</text>;
      return <text x="27" y="8" fontSize="5">💖</text>;
    }
    if (id === 'sticker_hearts') return <text x="27" y="8" fontSize="5">💖</text>;
    if (id === 'sticker_stars') return <text x="27" y="8" fontSize="5">🌟</text>;
    if (id === 'sticker_moon') return <text x="26" y="8" fontSize="5">🌙</text>;
    if (id === 'sticker_patch') return <text x="26" y="8" fontSize="5">🛠️</text>;
    return null;
  };

  const Pet = () => {
    const id = equipped?.pet;
    if (!id) return null;
    if (id === 'pet_ghost') {
      return (
        <g transform="translate(29,23)">
          <circle cx="0" cy="0" r="3.6" fill="#eef3ff" stroke="#a3b6ff" strokeWidth=".6" />
          <circle cx="-1" cy="-0.4" r=".7" fill="#2a2e48" />
          <circle cx="1" cy="-0.4" r=".7" fill="#2a2e48" />
          <path d="M-1 1.2c1 .8 2 .8 3 0" stroke="#2a2e48" strokeWidth=".5" fill="none" strokeLinecap="round" />
        </g>
      );
    }
    if (id === 'pet_fox') {
      return (
        <g transform="translate(30,24)">
          <path d="M-2.6 0c0-2.4 1.8-4.2 3.8-4.2s3.8 1.8 3.8 4.2-1.6 4.2-3.8 4.2-3.8-1.8-3.8-4.2z" fill="url(#pet-fox-g)" stroke="#ff9f5a" strokeWidth=".4" />
          <path d="M-2.8-1.2l1.4-2 1.4 1.2 1.4-1.2 1.4 2" fill="#ffd7a3" stroke="#ff9f5a" strokeWidth=".35" />
          <circle cx="-1" cy="-.6" r=".6" fill="#2a2e48" />
          <circle cx="1" cy="-.6" r=".6" fill="#2a2e48" />
          <path d="M-1 1.4c1 .6 2 .6 3 0" stroke="#2a2e48" strokeWidth=".45" strokeLinecap="round" fill="none" />
        </g>
      );
    }
    if (id === 'pet_drone') {
      return (
        <g transform="translate(30,23)">
          <circle cx="0" cy="0" r="3.2" fill="url(#pet-drone-g)" stroke="#86a5ff" strokeWidth=".4" />
          <circle cx="0" cy="0" r="1.1" fill="#0b1020" />
          <circle cx="0" cy="0" r=".4" fill="#7de3ff" />
          <path d="M-4.4-2.4l2.2.6" stroke="#9bb6ff" strokeWidth=".35" strokeLinecap="round" />
          <path d="M4.4-2.4l-2.2.6" stroke="#9bb6ff" strokeWidth=".35" strokeLinecap="round" />
          <path d="M-4.4 2.4l2.2-.6" stroke="#9bb6ff" strokeWidth=".35" strokeLinecap="round" />
          <path d="M4.4 2.4l-2.2-.6" stroke="#9bb6ff" strokeWidth=".35" strokeLinecap="round" />
        </g>
      );
    }
    if (id === 'pet_capibara') {
      return (
        <g transform="translate(30,24)">
          <ellipse cx="0" cy="0.4" rx="3.6" ry="2.6" fill="#d9b38c" stroke="#b08963" strokeWidth=".4" />
          <circle cx="-1.4" cy="-0.2" r=".6" fill="#2a2e48" />
          <circle cx="1.4" cy="-0.2" r=".6" fill="#2a2e48" />
          <path d="M-1 1.6c1 .6 2 .6 3 0" stroke="#2a2e48" strokeWidth=".4" strokeLinecap="round" />
          <circle cx="-2.2" cy="-1.6" r=".4" fill="#d9b38c" stroke="#b08963" strokeWidth=".3" />
          <circle cx="2.2" cy="-1.6" r=".4" fill="#d9b38c" stroke="#b08963" strokeWidth=".3" />
        </g>
      );
    }
    if (id === 'pet_moonling') {
      return (
        <g transform="translate(29,23)">
          <circle cx="0" cy="0" r="3.4" fill="rgba(210,220,255,0.92)" stroke="#9eb8ff" strokeWidth=".4" />
          <circle cx="-1" cy="-0.4" r=".7" fill="#2a2e48" />
          <circle cx="1" cy="-0.4" r=".7" fill="#2a2e48" />
          <path d="M-1.2 1.4c.9.9 2 .9 3 0" stroke="#2a2e48" strokeWidth=".4" strokeLinecap="round" />
          <circle cx="0" cy="2.6" r="1.1" fill="rgba(125,227,255,0.6)" opacity=".6" />
        </g>
      );
    }
    if (id === 'pet_dev_pixel') {
      return (
        <g transform="translate(30,24)" opacity=".95">
          <rect x="-2.6" y="-2.6" width="5.2" height="5.2" rx="0.6" fill="#1c1f34" stroke="#6ee7ff" strokeWidth=".4" />
          <rect x="-1.6" y="-1.2" width="1" height="1" fill="#7de3ff" />
          <rect x="0.6" y="-1.2" width="1" height="1" fill="#f472b6" />
          <rect x="-1.4" y="0.8" width="3" height=".6" fill="#7de3ff" />
        </g>
      );
    }
    return null;
  };

  return (
    <div className={`relative inline-grid place-items-center ${className ?? ''}`}>
      <span className="absolute inset-0 rounded-full opacity-60 blur-xl pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, var(--accent, #8B5CF6), transparent)' }} />
      <svg id="cheb-avatar-svg" width="144" height="144" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-label="Чебзик">
        <defs>
          <radialGradient id="cheb-g" cx="50%" cy="30%" r="70%">
            <stop offset="0%"  stopColor={gradA} stopOpacity="0.95"/>
            <stop offset="100%" stopColor={gradB} stopOpacity="0.85"/>
          </radialGradient>
          <linearGradient id="aura-g">
            <stop offset="0%"  stopColor="#9fd1ff"/>
            <stop offset="100%" stopColor="#b98bff"/>
          </linearGradient>
          <linearGradient id="crown-g">
            <stop offset="0%" stopColor="#ffe9a3"/>
            <stop offset="100%" stopColor="#ffcf73"/>
          </linearGradient>
          <linearGradient id="hat-aurora-g">
            <stop offset="0%" stopColor="#7de3ff"/>
            <stop offset="100%" stopColor="#9c8bff"/>
          </linearGradient>
          <linearGradient id="gls-star-g">
            <stop offset="0%" stopColor="#ffecb3"/>
            <stop offset="100%" stopColor="#fbcfe8"/>
          </linearGradient>
          <linearGradient id="visor-g">
            <stop offset="0%" stopColor="rgba(103,232,249,0.85)"/>
            <stop offset="100%" stopColor="rgba(139,92,246,0.55)"/>
          </linearGradient>
          <linearGradient id="hood-purple-g">
            <stop offset="0%" stopColor="#4b2b6e"/>
            <stop offset="100%" stopColor="#2f1d4a"/>
          </linearGradient>
          <linearGradient id="hood-neon-g">
            <stop offset="0%" stopColor="#3b0b7a"/>
            <stop offset="100%" stopColor="#0ea5e9"/>
          </linearGradient>
          <linearGradient id="hood-frost-g">
            <stop offset="0%" stopColor="#e0f2ff"/>
            <stop offset="100%" stopColor="#9ec9ff"/>
          </linearGradient>
          <linearGradient id="costume-starlight-g">
            <stop offset="0%" stopColor="#fdf2ff"/>
            <stop offset="100%" stopColor="#a3b8ff"/>
          </linearGradient>
          <linearGradient id="costume-aurora-g">
            <stop offset="0%" stopColor="#7ee7ff"/>
            <stop offset="100%" stopColor={accentHex}/>
          </linearGradient>
          <linearGradient id="backpack-nebula-g">
            <stop offset="0%" stopColor="#7f9cff"/>
            <stop offset="100%" stopColor="#a855f7"/>
          </linearGradient>
          <linearGradient id="head-neon-band">
            <stop offset="0%" stopColor="#67e8f9"/>
            <stop offset="100%" stopColor="#c084fc"/>
          </linearGradient>
          <linearGradient id="head-neon-ear">
            <stop offset="0%" stopColor="#1f2937"/>
            <stop offset="100%" stopColor="#4c1d95"/>
          </linearGradient>
          <linearGradient id="cape-sakura-g">
            <stop offset="0%" stopColor="#ffb7d5"/>
            <stop offset="100%" stopColor="#ff7fb4"/>
          </linearGradient>
          <linearGradient id="wing-starlight-g">
            <stop offset="0%" stopColor="rgba(255,255,255,0.82)"/>
            <stop offset="100%" stopColor="rgba(129,178,255,0.15)"/>
          </linearGradient>
          <linearGradient id="wing-mech-g">
            <stop offset="0%" stopColor="#9da8ff"/>
            <stop offset="100%" stopColor="#4850aa"/>
          </linearGradient>
          <linearGradient id="tail-dragon-g">
            <stop offset="0%" stopColor="#6b9cff"/>
            <stop offset="100%" stopColor="#2f3d8a"/>
          </linearGradient>
          <linearGradient id="pet-fox-g">
            <stop offset="0%" stopColor="#ffb27a"/>
            <stop offset="100%" stopColor="#ff8a4c"/>
          </linearGradient>
          <linearGradient id="pet-drone-g">
            <stop offset="0%" stopColor="#9cc9ff"/>
            <stop offset="100%" stopColor="#5b7cf7"/>
          </linearGradient>
          <radialGradient id="aura-starlight-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,247,222,0.9)"/>
            <stop offset="100%" stopColor="rgba(135,206,255,0.2)"/>
          </radialGradient>
          <radialGradient id="aura-blizzard-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(214,240,255,0.9)"/>
            <stop offset="100%" stopColor="rgba(147,197,253,0.15)"/>
          </radialGradient>
        </defs>
        <g>
          <Aura/>
          <Cape/>
          <Wings/>
          <Backpack/>
          <Hoodie/>
          <Costume/>
          {/* тело */}
          <path d="M18 2c6.2 0 11 4.8 11 11v8.5c0 2-1.7 3.7-3.7 3.7-1.3 0-2.6-.7-3.3-1.8-.6 1.1-1.8 1.8-3 1.8s-2.4-.7-3-1.8c-.7 1.1-2 1.8-3.3 1.8-2 0-3.7-1.7-3.7-3.7V13C5 6.8 10 2 16.2 2H18z" fill="url(#cheb-g)" />
          <Hat/>
          <Headphones/>
          {/* глаза */}
          <g transform={`translate(0, ${eyeDy.toFixed(2)})`}>
            <circle cx="13.5" cy="13.5" r="2.2" fill="#0b1020"/>
            <circle cx="22.5" cy="13.5" r="2.2" fill="#0b1020"/>
            <circle cx="13" cy="13.2" r=".7" fill="#fff"/>
            <circle cx="22" cy="13.2" r=".7" fill="#fff"/>
          </g>
          <Glasses/>
          {/* рот */}
          <path d={`M12 ${smile.toFixed(2)}c1.8 2.2 6.2 2.2 8 0`} stroke="#0b1020" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <Tail/>
          <Sticker/>
          <Pet/>
        </g>
      </svg>
    </div>
  );
};

/* =========================================================
   Small UI
========================================================= */

const Pill: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const theme = useThemeClasses();
  return <span className={`${theme.pill} ${className ?? ''}`}>{children}</span>;
};
const StatDonut: React.FC<{ value: number; label: string; invert?: boolean; tip?: string }> = ({ value, label, invert, tip }) => {
  const v = Math.max(0, Math.min(1, invert ? 1 - value : value));
  const size = 84; const stroke = 8; const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  const theme = useThemeClasses();
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${theme.card}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" strokeOpacity=".18" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--accent, #8B5CF6)" strokeWidth={stroke} fill="none" strokeDasharray={`${(v*c).toFixed(1)} ${c.toFixed(1)}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div>
        <div className={`text-sm font-medium ${theme.textPrimary}`}>{label}</div>
        <div className={`text-xs opacity-80 ${theme.textSecondary}`}>{Math.round(v * 100)}%</div>
        {tip && <div className={`text-[11px] ${theme.textMuted}`}>{tip}</div>}
      </div>
    </div>
  );
};

type ActionTileProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent?: boolean;
  disabled?: boolean;
  badge?: string;
  color?: string;
};

const ActionTile: React.FC<ActionTileProps> = ({ icon, title, description, onClick, accent, disabled, badge, color }) => {
  const theme = useThemeClasses();
  const baseColor = React.useMemo(() => {
    if (!color) return '#8B5CF6';
    const raw = color.trim();
    if (HEX_RE.test(raw)) {
      return raw.startsWith('#') ? raw : `#${raw}`;
    }
    return '#8B5CF6';
  }, [color]);
  const accentLayer = accent ? toRgba(baseColor, 0.32) : theme.dark ? 'rgba(16,20,36,0.82)' : 'rgba(241,245,249,0.95)';
  const accentBase = accent ? toRgba(baseColor, 0.12) : theme.dark ? 'rgba(12,16,26,0.86)' : 'rgba(248,250,252,0.92)';
  const borderColor = accent ? toRgba(baseColor, theme.dark ? 0.6 : 0.4) : theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.35)';
  const iconBg = accent ? toRgba(baseColor, theme.dark ? 0.3 : 0.22) : (theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)');
  const iconShadow = accent
    ? (theme.dark ? `0 12px 28px ${toRgba(baseColor, 0.45)}` : `0 12px 30px ${toRgba(baseColor, 0.36)}`)
    : (theme.dark ? '0 8px 20px rgba(8,12,26,0.45)' : '0 10px 22px rgba(148,163,184,0.3)');
  const badgeBg = accent ? toRgba(baseColor, theme.dark ? 0.28 : 0.24) : (theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={theme.actionTile}
      style={{ borderColor, boxShadow: accent ? (theme.dark ? `0 26px 60px ${toRgba(baseColor, 0.42)}` : `0 24px 56px ${toRgba(baseColor, 0.28)}`) : undefined }}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: `linear-gradient(135deg, ${accentLayer}, ${accentBase})` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: `radial-gradient(120% 120% at 80% 0%, ${toRgba(baseColor, accent ? 0.45 : 0.28)}, transparent)` }}
      />
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg shadow ${theme.dark ? 'text-white' : 'text-slate-700'}`}
        style={{ background: iconBg, boxShadow: iconShadow }}
      >
        {icon}
      </span>
      <div className="flex-1 text-left">
        <div className={`flex items-center gap-2 text-sm font-semibold ${theme.textPrimary}`}>
          {title}
          {badge ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] ${theme.dark ? 'text-white' : 'text-slate-900'}`}
              style={{ background: badgeBg }}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <div className={`mt-1 text-xs ${theme.textSecondary}`}>{description}</div>
      </div>
    </button>
  );
};

type QuickAction = ActionTileProps & { key: string };

/* =========================================================
   Modals (Shop, Boutique, Wardrobe, Settings, Achievements, Quests)
========================================================= */

const FoodShopModal: React.FC<{ onClose: () => void; onBuy: (id: keyof Inv, price: number) => void; coins: number }> = ({ onClose, onBuy, coins }) => {
  const theme = useThemeClasses();
  return (
    <div className={`fixed inset-0 z-[90] grid place-items-center p-4 backdrop-blur ${theme.modalBackdrop}`} onClick={onClose}>
      <div className={`w-full max-w-md p-4 ${theme.panel}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div className={`text-sm font-medium ${theme.textPrimary}`}>Магазин — предметы</div>
          <button aria-label="Закрыть" className={theme.iconButton} onClick={onClose}>✕</button>
        </div>
        <div className={`mb-4 text-sm ${theme.textSecondary}`}>Монеты: <b className={theme.textPrimary}>{coins}</b></div>
        <div className="grid gap-2">
          {[
            { id: 'cookie', name: 'Печенька', price: 3, emoji: '🍪', hint: '+ чуть сытость / + настроение' },
            { id: 'meal', name: 'Обед', price: 8, emoji: '🍲', hint: '− много голода / + настроение' },
            { id: 'toy', name: 'Игрушка', price: 6, emoji: '🧸', hint: '+ настроение, − энергия' },
            { id: 'medkit', name: 'Аптечка', price: 10, emoji: '💊', hint: '+ энергия' },
            { id: 'gift', name: 'Подарок', price: 7, emoji: '🎁', hint: 'рандомный лут' },
          ].map((it) => (
            <div key={it.id} className={`flex items-center justify-between rounded-xl p-3 ${theme.card}`}>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">{it.emoji}</span>
                <div>
                  <div className={`font-medium ${theme.textPrimary}`}>{it.name}</div>
                  <div className={theme.textMuted}>{it.hint}</div>
                </div>
              </div>
              <button
                className="btn btn-primary !rounded-full !px-3 !py-1.5"
                disabled={coins < it.price}
                onClick={() => onBuy(it.id as keyof Inv, it.price)}
                title={coins < it.price ? 'Недостаточно монет' : 'Купить'}
              >
                {it.price} 🪙
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BoutiqueModal: React.FC<{
  onClose: () => void;
  rotIds: string[];
  coins: number;
  owned: string[];
  onBuy: (id: string, price: number) => void;
}> = ({ onClose, rotIds, coins, owned, onBuy }) => {
  const [tab, setTab] = React.useState<'rotation' | 'catalog' | 'exclusive'>('rotation');
  const rotationItems = React.useMemo(
    () => rotIds.map((id) => COSMETICS_BY_ID[id]).filter(Boolean) as Cosmetic[],
    [rotIds]
  );
  const catalogItems = React.useMemo(
    () => COSMETICS.filter((c) => !c.exclusive).slice().sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    []
  );
  const exclusiveItems = React.useMemo(
    () => COSMETICS.filter((c) => !!c.exclusive).slice().sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    []
  );

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 dark:bg-black/60 p-4 backdrop-blur" onClick={onClose}>
      <div className={`w-full max-w-3xl p-5 ${PANEL_SURFACE}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-white/90">Бутик Чебзика</div>
            <div className="text-xs text-white/65">Ротация обновляется каждые 6 часов, но весь каталог теперь под рукой.</div>
          </div>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20" onClick={onClose}>✕</button>
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-white/75">
          <span>Монеты: <b className="text-white/90">{coins}</b></span>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'rotation' as const, label: 'Ротация' },
              { id: 'catalog' as const, label: 'Весь каталог' },
              { id: 'exclusive' as const, label: 'Эксклюзивы' },
            ].map((t) => (
              <button
                key={t.id}
                className={`btn !px-3 !py-1 ${tab === t.id ? 'btn-primary' : '!bg-white/10 !text-white/80 hover:!bg-white/15'}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'rotation' && (
          <div className="space-y-3">
            <div className="text-xs text-white/65">Эти вещи продаются прямо сейчас. Обновление витрины произойдёт автоматически.</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[52vh] overflow-auto pr-1">
              {rotationItems.length ? rotationItems.map((it) => (
                <div key={it.id} className={`flex flex-col justify-between gap-3 rounded-2xl p-3 ${rarityBadge(it.rarity)}`}>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{it.name}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/65">{it.kind}</div>
                    {it.season && <div className="mt-1 text-[11px] text-white/60">Сезон: {it.season}</div>}
                  </div>
                  <button
                    className="btn btn-primary"
                    disabled={owned.includes(it.id) || coins < it.price}
                    onClick={() => onBuy(it.id, it.price)}
                  >
                    {owned.includes(it.id) ? '✔ В коллекции' : `${it.price} 🪙`}
                  </button>
                </div>
              )) : <div className={`rounded-2xl p-4 text-sm text-white/70 ${CARD_SURFACE}`}>Витрина загружается…</div>}
            </div>
          </div>
        )}

        {tab === 'catalog' && (
          <div className="space-y-3">
            <div className="text-xs text-white/65">Листайте весь ассортимент и выискивайте желанные аксессуары. Если вещь уже куплена, она отмечена галочкой.</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[52vh] overflow-auto pr-1">
              {catalogItems.map((it) => (
                <div key={it.id} className={`flex flex-col justify-between gap-3 rounded-2xl p-3 ${rarityBadge(it.rarity)}`}>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{it.name}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/65">{it.kind}</div>
                  </div>
                  <button
                    className="btn btn-primary"
                    disabled={owned.includes(it.id) || coins < it.price}
                    onClick={() => onBuy(it.id, it.price)}
                  >
                    {owned.includes(it.id) ? '✔ В коллекции' : `${it.price} 🪙`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'exclusive' && (
          <div className="space-y-3">
            <div className="text-xs text-white/65">Эти предметы не продаются в бутике. Получите их с помощью секретных кодов или DEV-доступа.</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[52vh] overflow-auto pr-1">
              {exclusiveItems.map((it) => {
                const codeInfo = it.unlockCode ? SECRET_CODE_MAP[it.unlockCode] : undefined;
                const ownedItem = owned.includes(it.id);
                return (
                  <div key={it.id} className={`flex flex-col gap-2 rounded-2xl p-3 ${rarityBadge(it.rarity)}`}>
                    <div>
                      <div className="text-sm font-semibold text-white/90">{it.name}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-white/65">{it.kind}</div>
                    </div>
                    <div className="text-xs text-white/70">
                      {it.exclusive === 'developer' ? (
                        <span>Только для разработчиков с внутренним доступом.</span>
                      ) : codeInfo ? (
                        <span>Доступно через секретный код. Поспеши узнать детали у команды!</span>
                      ) : (
                        <span>Секретный способ получения.</span>
                      )}
                    </div>
                    <div className={`text-xs font-medium ${ownedItem ? 'text-emerald-200' : 'text-white/55'}`}>
                      {ownedItem ? 'Уже в коллекции' : 'Ещё не получено'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SecretCodesModal: React.FC<{
  onClose: () => void;
  onRedeem: (code: string) => RedeemResult;
}> = ({ onClose, onRedeem }) => {
  const [value, setValue] = React.useState('');
  const [feedback, setFeedback] = React.useState<{ type: 'ok' | 'err'; message: string } | null>(null);

  const submit = React.useCallback(
    (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) {
        setFeedback({ type: 'err', message: 'Введите код.' });
        return;
      }
      const result = onRedeem(trimmed);
      setFeedback({ type: result.ok ? 'ok' : 'err', message: result.message });
      if (result.ok) setValue('');
    },
    [onRedeem]
  );

  const copy = React.useCallback((code: string) => {
    setValue(code);
    setFeedback(null);
    try { navigator.clipboard?.writeText(code); } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-black/60 p-4 backdrop-blur" onClick={onClose}>
      <div className={`w-full max-w-2xl space-y-4 p-5 ${PANEL_SURFACE}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white/90">Секретные коды</div>
            <div className="text-xs text-white/65">Активируй подарки и смотри, что открывается DEV-доступом.</div>
          </div>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20" onClick={onClose}>✕</button>
        </div>
        <form
          className={`flex flex-col gap-2 rounded-2xl p-4 ${CARD_SURFACE}`}
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <label className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Активировать код</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-white/15 bg-black/20 px-3 py-2 font-mono uppercase tracking-[0.2em] text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent,#8B5CF6)] focus:outline-none"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              placeholder="Например, STARFALL"
            />
            <button type="submit" className="btn btn-primary !rounded-xl !px-4">Активировать</button>
          </div>
          {feedback && (
            <div className={`text-xs ${feedback.type === 'ok' ? 'text-emerald-200' : 'text-rose-300'}`}>{feedback.message}</div>
          )}
        </form>
        <div className="max-h-[50vh] space-y-3 overflow-auto pr-1">
          {false && SECRET_CODES.map((code) => (
            <div key={code.code} className={`space-y-2 rounded-2xl p-4 ${CARD_SURFACE}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    {code.title}
                    {code.developerOnly && <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.28em] text-amber-200">DEV</span>}
                  </div>
                  <div className="text-xs text-white/65">{code.description}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-sm text-white">{code.code}</span>
                  <div className="flex gap-1">
                    <button type="button" className="btn !px-2 !py-1" onClick={() => copy(code.code)}>Вставить</button>
                    <button type="button" className="btn !px-2 !py-1" onClick={() => submit(code.code)}>Активировать</button>
                  </div>
                </div>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-xs text-white/70">
                {code.rewards.map((reward, idx) => (
                  <li key={idx}>{reward}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WardrobeModal: React.FC<{
  onClose: () => void;
  cosm: CosmeticsState;
  onEquip: (c: Cosmetic) => void;
  onUnequip: (kind: CosmeticKind) => void;
}> = ({ onClose, cosm, onEquip, onUnequip }) => {
  const [tab, setTab] = React.useState<CosmeticKind | 'all'>('all');
  const list = COSMETICS.filter(c => cosm.owned.includes(c.id) && (tab === 'all' || c.kind === tab));
  const equip = cosm.equipped;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 dark:bg-black/60 p-4 backdrop-blur" onClick={onClose}>
      <div className={`w-full max-w-3xl p-5 ${PANEL_SURFACE}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium text-white/90">Гардероб</div>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20" onClick={onClose}>✕</button>
        </div>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          {(['all','palette','hat','glasses','hoodie','costume','wings','aura','backpack','headphones','cape','tail','sticker','pet'] as const).map(k => (
            <button key={k} className={`btn !px-2 !py-1 ${tab===k?'btn-primary':''}`} onClick={()=>setTab(k)}>{k}</button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 max-h-[60vh] overflow-auto pr-1">
          {list.length ? list.map(c => {
            const selected = equip[c.kind] === c.id;
            return (
              <div key={c.id} className={`flex items-center justify-between rounded-xl p-3 ${rarityBadge(c.rarity)}`}>
                <div className="text-sm">
                  <div className="font-medium">{c.name}</div>
                  <div className="opacity-70">{c.kind}</div>
                </div>
                {selected ? (
                  <button className="btn" onClick={() => onUnequip(c.kind)}>Снять</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => onEquip(c)}>Надеть</button>
                )}
              </div>
            );
          }) : <div className="text-sm opacity-70">Нет предметов в этой вкладке.</div>}
        </div>
      </div>
    </div>
  );
};

const ChebSettingsModal: React.FC<{
  onClose: () => void;
  animations: boolean;
  sounds: boolean;
  onToggleAnimations: () => void;
  onToggleSounds: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onRename: () => void;
}> = ({ onClose, animations, sounds, onToggleAnimations, onToggleSounds, onExport, onImport, onReset, onRename }) => (
  <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 dark:bg-black/60 p-4 backdrop-blur" onClick={onClose}>
    <div className={`w-full max-w-md p-4 ${PANEL_SURFACE}`} onClick={(e) => e.stopPropagation()}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-white/90">Настройки Чебзика</div>
        <button aria-label="Закрыть" className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20" onClick={onClose}>✕</button>
      </div>
      <div className="space-y-2">
        <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
          <div><div className="text-sm font-medium text-white/90">Анимация аватара</div><div className="text-xs text-white/60">Лёгкое подпрыгивание</div></div>
          <button className="btn" onClick={onToggleAnimations}>{animations ? 'Вкл' : 'Выкл'}</button>
        </div>
        <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
          <div><div className="text-sm font-medium text-white/90">Звуки</div><div className="text-xs text-white/60">Клики, награды, достижения</div></div>
          <button className="btn" onClick={onToggleSounds}>{sounds ? 'Вкл' : 'Выкл'}</button>
        </div>
        <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
          <div>
            <div className="text-sm font-medium text-white/90">Новые звуки</div>
            <div className="text-xs text-white/60">Искры, щелчки и фанфары</div>
          </div>
          <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">Всегда активны</div>
        </div>
        <div className="grid gap-2">
          <button className="btn w-full justify-between" onClick={onRename}><span>✏️ Переименовать</span><span className="opacity-70">Изменить имя</span></button>
          <button className="btn w-full justify-between" onClick={onExport}><span>⬇️ Экспорт сейва</span><span className="opacity-70">chebzik-save.json</span></button>
          <button className="btn w-full justify-between" onClick={onImport}><span>⬆️ Импорт сейва</span><span className="opacity-70">вставка JSON</span></button>
          <button className="btn w-full justify-between !border-red-400/30 !bg-red-500/10 hover:!bg-red-500/15 text-red-200" onClick={onReset}><span>🗑️ Сброс прогресса</span><span className="opacity-80">безвозвратно</span></button>
        </div>
      </div>
    </div>
  </div>
);

const AchievementsModal: React.FC<{ onClose: () => void; save: Save }> = ({ onClose, save }) => {
  const unlocked = Object.keys(save.achievements ?? {}).length;
  const percent = Math.round((unlocked / ACHIEVEMENTS_CATALOG.length) * 100);
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[rgba(4,6,12,0.72)] p-4 backdrop-blur" onClick={onClose}>
      <div className={`w-full max-w-xl p-5 ${PANEL_SURFACE}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white/90">Достижения — {unlocked}/{ACHIEVEMENTS_CATALOG.length}</div>
            <div className="text-[11px] text-white/60">Открой ещё {Math.max(0, ACHIEVEMENTS_CATALOG.length - unlocked)} для полного комплекта</div>
          </div>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20" onClick={onClose}>✕</button>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[color:var(--accent,#8B5CF6)] transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS_CATALOG.map(a => {
            const done = !!(save.achievements?.[a.id]);
            return (
              <div
                key={a.id}
                className={`flex items-center justify-between rounded-xl p-3 ${done
                  ? 'border-[rgba(160,255,200,0.55)] bg-[rgba(70,200,150,0.22)] shadow-[0_14px_40px_rgba(70,200,150,0.25)]'
                  : CARD_SURFACE}`}
              >
                <div className="text-sm">
                  <div className="font-medium text-white/90">{a.label}</div>
                  <div className={`text-xs ${done ? 'text-emerald-200/80' : 'text-white/60'}`}>{done ? 'Получено' : 'Скрыто до выполнения'}</div>
                </div>
                <div className={`text-lg ${done ? 'text-emerald-200' : 'opacity-40 text-white/70'}`}>{done ? '✅' : '🔒'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const QuestsModal: React.FC<{
  onClose: () => void;
  daily: Daily;
  onClaim: (scope: 'daily' | 'weekly', quest: Quest) => void;
}> = ({ onClose, daily, onClaim }) => {
  const weekly = daily.weeklyChallenge;
  const buffInfo = describeBuff(daily.buff);
  const buffHint = daily.buff.description;
  const expiresIn = React.useMemo(() => {
    if (!weekly) return null;
    const expires = Date.parse(weekly.expiresAt);
    if (Number.isNaN(expires)) return null;
    const diff = expires - Date.now();
    if (diff <= 0) return 'истёк';
    const days = Math.floor(diff / 86400000);
    if (days >= 1) return `${days} д.`;
    const hours = Math.max(1, Math.floor(diff / 3600000));
    return `${hours} ч.`;
  }, [weekly]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 dark:bg-black/60 p-4 backdrop-blur" onClick={onClose}>
      <div className={`w-full max-w-lg p-4 ${PANEL_SURFACE}`} onClick={(e)=>e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium text-white/90">Квесты и баффы дня</div>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/20 bg-white/15 text-white/90 hover:bg-white/20" onClick={onClose}>✕</button>
        </div>

        <div className={`mb-4 rounded-2xl border border-white/12 bg-white/5 p-3 text-xs text-white/80`}> 
          <div className="flex items-center justify-between">
            <span>Дневной бафф: <b className="text-white/90">{buffInfo}</b></span>
            {daily.bonusBuffExpires && daily.bonusBuffExpires > Date.now() && (
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">до {new Date(daily.bonusBuffExpires).toLocaleTimeString()}</span>
            )}
          </div>
          {buffHint && <div className="mt-1 text-white/70">{buffHint}</div>}
        </div>

        {weekly && (
          <div className={`mb-4 rounded-2xl p-3 ${CARD_SURFACE}`}>
            <div className="mb-1 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/90">{weekly.icon ?? '⭐'} {weekly.label}</div>
                <div className="text-xs text-white/65">Прогресс: {weekly.progress}/{weekly.target}{expiresIn ? ` • До обновления: ${expiresIn}` : ''}</div>
                {weekly.hint && <div className="mt-1 text-xs text-white/60">{weekly.hint}</div>}
              </div>
              <div className="text-xs text-white/70">Награда: <b className="text-white/90">{weekly.reward} 🪙</b></div>
            </div>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400/80"
                style={{ width: `${Math.min(100, (weekly.progress / weekly.target) * 100)}%` }}
              />
            </div>
            <button
              className="btn btn-primary !rounded-full !px-3 !py-1.5"
              disabled={weekly.claimed || weekly.progress < weekly.target}
              onClick={() => onClaim('weekly', weekly)}
            >
              {weekly.claimed ? 'Получено' : (weekly.progress >= weekly.target ? 'Забрать награду' : 'Продолжай')}
            </button>
          </div>
        )}

        <div className="grid gap-2">
          {daily.quests.map((q) => {
            const done = q.progress >= q.target;
            return (
              <div key={q.id} className={`rounded-2xl p-3 ${CARD_SURFACE}`}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2 font-medium text-white/90">
                      <span className="text-lg">{q.icon ?? '⭐'}</span>
                      <span>{q.label}</span>
                    </div>
                    <div className="text-xs text-white/65">Прогресс: {q.progress}/{q.target} • Награда: {q.reward} 🪙</div>
                    {q.hint && <div className="text-xs text-white/60">{q.hint}</div>}
                  </div>
                  <button
                    className="btn btn-primary !rounded-full !px-3 !py-1.5"
                    disabled={q.claimed || !done}
                    onClick={() => onClaim('daily', q)}
                  >
                    {q.claimed ? 'Получено' : done ? 'Забрать' : 'В прогрессе'}
                  </button>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${done ? 'bg-emerald-400/80' : 'bg-white/40'}`}
                    style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Mini Games (unchanged)
========================================================= */

const MINIGAME_SHELL = 'relative overflow-hidden rounded-3xl border border-white/12 bg-[rgba(16,18,32,0.88)] p-5 shadow-[0_28px_80px_rgba(12,16,32,0.55)]';
const MINIGAME_BACKDROP: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(circle at 20% -10%, rgba(124,58,237,0.45), transparent 45%),' +
    'radial-gradient(circle at 85% 20%, rgba(6,182,212,0.28), transparent 50%),' +
    'radial-gradient(circle at 40% 110%, rgba(236,72,153,0.32), transparent 55%)',
  filter: 'blur(0px) saturate(130%)',
};

type MiniGameProps = { onClose: () => void; onFinish: (score: number) => void };
const MiniGameBlink: React.FC<MiniGameProps> = ({ onClose, onFinish }) => {
  const W = 380, H = 220, R = 18;
  const [t, setT] = React.useState(20);
  const [score, setScore] = React.useState(0);
  const [pos, setPos] = React.useState({ x: 60, y: 60 });
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((v) => v - 1), 1000);
    const mover = setInterval(() => randPos(), 700);
    return () => { clearInterval(id); clearInterval(mover); };
  }, [running]);

  React.useEffect(() => { if (t <= 0) { setRunning(false); onFinish(score); } }, [t]);

  function randPos() { setPos({ x: Math.random() * (W - R * 2) + R, y: Math.random() * (H - R * 2) + R }); }
  function hit() { if (!running) return; setScore((s) => s + 1); randPos(); beep(980, .05, 'triangle'); }

  return (
    <div className={MINIGAME_SHELL}>
      <div style={MINIGAME_BACKDROP} />
      <div className="absolute -left-12 top-6 h-24 w-24 rounded-full bg-violet-500/30 blur-[60px]" />
      <div className="absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-sky-400/20 blur-[70px]" />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              Реакция «Блик»
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/60">20s</span>
            </div>
            <div className="text-xs text-white/65">Нажимайте на светящийся шарик, чтобы набрать очки.</div>
          </div>
          <button className="btn !rounded-xl !border-white/20 !bg-white/10 hover:!bg-white/15 text-white/90" onClick={onClose}>Закрыть</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
          <Pill>⏳ Осталось: {t}s</Pill>
          <Pill>🏆 Счёт: {score}</Pill>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(252,255,255,0.18),rgba(12,16,32,0.92))] p-2"
          style={{ width: W + 16, height: H + 16 }}
        >
          <div className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_80%_20%,rgba(165,243,252,0.18),transparent_60%)]" />
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.06),transparent_65%)]" />
          <div className="relative h-full w-full overflow-hidden rounded-xl" style={{ width: W, height: H }}>
            <div
              onClick={hit}
              style={{ left: pos.x - R, top: pos.y - R, width: R * 2, height: R * 2 }}
              className="absolute grid place-items-center cursor-pointer"
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-0 animate-ping rounded-full bg-sky-300/30" />
                <div
                  className="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.7)]"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(56,189,248,0.35), rgba(14,15,30,0.4))' }}
                />
                <div className="absolute inset-[25%] rounded-full bg-white/70 blur-sm" />
              </div>
            </div>
          </div>
        </div>
        {!running && (<div className="text-sm text-white/75">Игра окончена. Счёт: {score}</div>)}
      </div>
    </div>
  );
};

const MiniGameSnake: React.FC<MiniGameProps> = ({ onClose, onFinish }) => {
  const size = 16, cols = 20, rows = 14;
  const [snake, setSnake] = React.useState<{x:number,y:number}[]>([{x:10,y:7}]);
  const [dir, setDir] = React.useState<{x:number,y:number}>({x:1,y:0});
  const [food, setFood] = React.useState<{x:number,y:number}>({x:5,y:5});
  const [score, setScore] = React.useState(0);
  const [over, setOver] = React.useState(false);

  React.useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dir.y !== 1) setDir({x:0,y:-1});
      if (e.key === 'ArrowDown' && dir.y !== -1) setDir({x:0,y:1});
      if (e.key === 'ArrowLeft' && dir.x !== 1) setDir({x:-1,y:0});
      if (e.key === 'ArrowRight' && dir.x !== -1) setDir({x:1,y:0});
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [dir]);

  React.useEffect(() => {
    if (over) return;
    const id = setInterval(() => {
      setSnake(s => {
        const head = {x: (s[0].x + dir.x + cols) % cols, y: (s[0].y + dir.y + rows) % rows};
        if (s.some(p => p.x===head.x && p.y===head.y)) { setOver(true); onFinish(score); return s; }
        const ns = [head, ...s];
        if (head.x===food.x && head.y===food.y) {
          setScore(sc => sc + 1);
          beep(760, .05, 'square');
          setFood({x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)});
          return ns;
        }
        ns.pop();
        return ns;
      });
    }, 120);
    return () => clearInterval(id);
  }, [dir, food, over, score, onFinish]);

  return (
    <div className={MINIGAME_SHELL}>
      <div style={MINIGAME_BACKDROP} />
      <div className="absolute -top-16 right-4 h-36 w-36 rounded-full bg-emerald-400/20 blur-[70px]" />
      <div className="absolute left-0 top-1/2 h-32 w-32 -translate-x-1/3 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[80px]" />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              Аркада «Змейка»
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/60">стрелки</span>
            </div>
            <div className="text-xs text-white/65">Собирайте вспышки света и избегайте собственного хвоста.</div>
          </div>
          <button className="btn !rounded-xl !border-white/20 !bg-white/10 hover:!bg-white/15 text-white/90" onClick={onClose}>Закрыть</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
          <Pill>🏆 Счёт: {score}</Pill>
          <Pill>🍏 Цель: бесконечность</Pill>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl border border-emerald-300/30 bg-[rgba(8,12,22,0.7)] p-2"
          style={{ width: cols * size + 16, height: rows * size + 16 }}
        >
          <div className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(rgba(45,212,191,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.08) 1px, transparent 1px)',
              backgroundSize: `${size}px ${size}px`,
            }}
          />
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_50%,rgba(15,118,110,0.25),rgba(8,11,20,0.9))]"
            style={{ width: cols * size, height: rows * size }}
          >
            <div
              className="absolute rounded-lg shadow-[0_0_18px_rgba(110,231,183,0.45)]"
              style={{
                left: food.x * size,
                top: food.y * size,
                width: size,
                height: size,
                background: 'radial-gradient(circle, rgba(167,243,208,0.95), rgba(45,212,191,0.3) 70%, rgba(6,95,70,0.4))',
              }}
            />
            {snake.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-lg bg-gradient-to-br from-emerald-400/70 to-emerald-500/50 shadow-[0_6px_14px_rgba(16,185,129,0.35)]"
                style={{
                  left: p.x * size + 1,
                  top: p.y * size + 1,
                  width: size - 2,
                  height: size - 2,
                }}
              />
            ))}
          </div>
        </div>
        {over && <div className="text-sm text-white/75">Игра окончена. Счёт: {score}</div>}
      </div>
    </div>
  );
};

const MiniGameMeteor: React.FC<MiniGameProps> = ({ onClose, onFinish }) => {
  type Meteor = { lane: number; progress: number };
  const lanes = 3;
  const [player, setPlayer] = React.useState(1);
  const [meteors, setMeteors] = React.useState<Meteor[]>([]);
  const [score, setScore] = React.useState(0);
  const [misses, setMisses] = React.useState(0);
  const [time, setTime] = React.useState(30);
  const finishedRef = React.useRef(false);

  React.useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPlayer((p) => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setPlayer((p) => Math.min(lanes - 1, p + 1));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [lanes]);

  React.useEffect(() => {
    if (time <= 0 || misses >= 3) return;
    const drop = setInterval(() => {
      setMeteors((list) => {
        const next: Meteor[] = [];
        list.forEach((m) => {
          const progress = m.progress + 0.12;
          if (progress >= 1) {
            if (m.lane === player) {
              setScore((s) => s + 1);
              beep(720, .05, 'triangle');
            } else {
              setMisses((x) => x + 1);
            }
          } else {
            next.push({ lane: m.lane, progress });
          }
        });
        return next;
      });
    }, 120);
    return () => clearInterval(drop);
  }, [player, time, misses]);

  React.useEffect(() => {
    if (time <= 0 || misses >= 3) return;
    const spawn = setInterval(() => {
      setMeteors((list) => [...list, { lane: Math.floor(Math.random() * lanes), progress: 0 }]);
    }, 700);
    return () => clearInterval(spawn);
  }, [time, misses]);

  React.useEffect(() => {
    if (finishedRef.current) return;
    if (time <= 0 || misses >= 3) {
      finishedRef.current = true;
      onFinish(score);
    }
  }, [time, misses, score, onFinish]);

  React.useEffect(() => {
    if (finishedRef.current) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const active = !(time <= 0 || misses >= 3);

  return (
    <div className={`${MINIGAME_SHELL} w-[340px]`}>
      <div style={MINIGAME_BACKDROP} />
      <div className="absolute -top-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-[80px]" />
      <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-1/3 rounded-full bg-indigo-500/25 blur-[90px]" />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              Шторм «Метеор-дождь»
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/60">{Math.max(0, time)}s</span>
            </div>
            <div className="text-xs text-white/65">Перехватывайте падающие звёзды и избегайте промахов.</div>
          </div>
          <button className="btn !rounded-xl !border-white/20 !bg-white/10 hover:!bg-white/15 text-white/90" onClick={onClose}>Закрыть</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
          <Pill>☄️ Очки: {score}</Pill>
          <Pill>⚠️ Промахи: {misses}/3</Pill>
        </div>
        <div className="relative mx-auto h-44 w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/12 bg-[radial-gradient(circle_at_50%_-20%,rgba(129,140,248,0.35),rgba(10,12,24,0.92))]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(248,250,252,0.1), transparent 65%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)', backgroundSize: `100% ${100 / 6}%` }} />
          {meteors.map((m, idx) => (
            <div
              key={idx}
              className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-50/95 to-indigo-400/70 text-indigo-900 shadow-[0_12px_30px_rgba(129,140,248,0.4)]"
              style={{
                left: `${(m.lane + 0.5) * (100 / lanes)}%`,
                transform: 'translateX(-50%)',
                top: `${m.progress * 100}%`,
              }}
            >
              ✨
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-around px-4">
            {Array.from({ length: lanes }).map((_, lane) => (
              <div
                key={lane}
                className={`h-10 w-16 rounded-2xl border backdrop-blur-sm transition-colors ${player === lane ? 'border-emerald-300 bg-emerald-400/25 shadow-[0_0_18px_rgba(16,185,129,0.35)]' : 'border-white/12 bg-white/5'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm">
          <button className="btn !rounded-full !px-3" disabled={!active} onClick={() => setPlayer((p) => Math.max(0, p - 1))}>⬅️</button>
          <button className="btn !rounded-full !px-3" disabled={!active} onClick={() => setPlayer((p) => Math.min(lanes - 1, p + 1))}>➡️</button>
        </div>
        {!active && <div className="text-sm text-white/75">Игра окончена. Счёт: {score}</div>}
      </div>
    </div>
  );
};

const MiniGameGlow: React.FC<MiniGameProps> = ({ onClose, onFinish }) => {
  const cells = 9;
  const [active, setActive] = React.useState(() => Math.floor(Math.random() * cells));
  const [score, setScore] = React.useState(0);
  const [misses, setMisses] = React.useState(0);
  const [time, setTime] = React.useState(30);
  const [tapped, setTapped] = React.useState(true);
  const finishedRef = React.useRef(false);

  React.useEffect(() => {
    if (finishedRef.current) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (time <= 0 || misses >= 5) return;
    const swap = setInterval(() => {
      setActive((prev) => {
        if (!tapped) setMisses((m) => m + 1);
        const next = Math.floor(Math.random() * cells);
        setTapped(false);
        return next === prev ? (next + 1) % cells : next;
      });
    }, 850);
    return () => clearInterval(swap);
  }, [time, misses, tapped]);

  React.useEffect(() => {
    if (finishedRef.current) return;
    if (time <= 0 || misses >= 5) {
      finishedRef.current = true;
      onFinish(score);
    }
  }, [time, misses, score, onFinish]);

  const handleClick = (idx: number) => {
    if (finishedRef.current || time <= 0 || misses >= 5) return;
    if (idx === active) {
      setScore((s) => s + 1);
      setTapped(true);
      beep(880, .05, 'square');
    } else {
      setMisses((m) => m + 1);
    }
  };

  const activeGame = !(time <= 0 || misses >= 5);

  return (
    <div className={`${MINIGAME_SHELL} w-[320px]`}>
      <div style={MINIGAME_BACKDROP} />
      <div className="absolute -top-10 right-6 h-28 w-28 rounded-full bg-cyan-400/25 blur-[80px]" />
      <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 translate-y-1/3 rounded-full bg-purple-500/25 blur-[90px]" />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              «Неоновое поле»
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/60">{Math.max(0, time)}s</span>
            </div>
            <div className="text-xs text-white/65">Находите подсвеченную плитку, пока таймер не истечёт.</div>
          </div>
          <button className="btn !rounded-xl !border-white/20 !bg-white/10 hover:!bg-white/15 text-white/90" onClick={onClose}>Закрыть</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
          <Pill>⚡ Очки: {score}</Pill>
          <Pill>✖ Ошибки: {misses}/5</Pill>
        </div>
        <div className="rounded-2xl border border-white/12 bg-[rgba(9,13,24,0.65)] p-3 shadow-[0_20px_60px_rgba(13,17,33,0.4)]">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: cells }).map((_, idx) => (
              <button
                key={idx}
                className={`relative aspect-square overflow-hidden rounded-2xl border transition-all duration-200 ${idx === active ? 'border-cyan-300/90 bg-cyan-200/30 shadow-[0_0_25px_rgba(103,232,249,0.45)] scale-[1.04]' : 'border-white/10 bg-white/5'}`}
                onClick={() => handleClick(idx)}
                disabled={!activeGame}
              >
                <span
                  className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(165,243,252,0.45),transparent_65%)] transition-opacity ${idx === active ? 'opacity-100' : 'opacity-0'}`}
                />
                <span
                  className={`absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(129,140,248,0.3),transparent_70%)] blur-md transition-opacity ${idx === active ? 'opacity-70' : 'opacity-0'}`}
                />
              </button>
            ))}
          </div>
        </div>
        {!activeGame && <div className="text-sm text-white/75">Игра окончена. Счёт: {score}</div>}
      </div>
    </div>
  );
};

/* =========================================================
   Error Boundary (prevents black screen on unexpected errors)
========================================================= */

class NiceBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }>{
  declare context: React.ContextType<typeof ThemeContext>;
  static contextType = ThemeContext;
  constructor(props: any){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(){ /* no-op */ }
  render(){
    const dark = !!this.context;
    if (this.state.hasError) return (
      <div className={dark ? 'mx-auto max-w-2xl p-6 text-sm rounded-2xl border border-white/10 bg-[rgba(12,14,22,.9)] text-white/80' : 'mx-auto max-w-2xl p-6 text-sm rounded-2xl border border-slate-200 bg-white/95 text-slate-700 shadow-[0_12px_32px_rgba(148,163,184,0.2)]'}>
        Что-то пошло не так. Перезагрузите страницу. Ошибка перехвачена, поэтому чёрного экрана больше не будет.
      </div>
    );
    return this.props.children as any;
  }
}

/* =========================================================
   Layout wrapper
========================================================= */

const Body: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const dark = useThemeMode();
  const liquid = useLiquid();
  if (liquid) {
    return (
      <LiquidGlass className={`p-5 sm:p-6 ${dark ? 'text-white/90' : 'text-slate-900'} ${className ?? ''}`} blur={26} gloss={0.8} tint="16 18 36" opacity={0.2} elevation={1.2} animate>
        {children}
      </LiquidGlass>
    );
  }
  return (
    <section className={`rounded-3xl border ${dark ? 'border-white/12 bg-[rgba(18,22,38,0.92)] text-white/90 shadow-[0_28px_88px_rgba(5,8,24,0.52)]' : 'border-slate-200 bg-white/95 text-slate-900 shadow-[0_28px_88px_rgba(148,163,184,0.26)]'} p-5 sm:p-6 backdrop-blur ${className ?? ''}`}>
      {children}
    </section>
  );
};

/* =========================================================
   Main
========================================================= */

export default function BuddyPlayground() {
  const [save, setSave] = useSave();
  const [showMini, setShowMini] = React.useState<null | MiniGameKind>(null);
  const [showItemShop, setShowItemShop] = React.useState(false);
  const [showBoutique, setShowBoutique] = React.useState(false);
  const [showWardrobe, setShowWardrobe] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showAch, setShowAch] = React.useState(false);
  const [showQuests, setShowQuests] = React.useState(false);
  const [showCodesModal, setShowCodesModal] = React.useState(false);
  const isLiquid = useLiquid();
  const isDark = useIsDark();
  const prevLevelRef = React.useRef(save.game.level);
  const ambientOrbsRef = React.useRef<AmbientOrb[]>([]);
  if (!ambientOrbsRef.current.length) {
    ambientOrbsRef.current = Array.from({ length: 6 }).map(() => ({
      left: 8 + Math.random() * 84,
      top: 6 + Math.random() * 70,
      size: 120 + Math.random() * 80,
      duration: 10 + Math.random() * 6,
      delay: -Math.random() * 8,
      opacity: 0.25 + Math.random() * 0.25,
    }));
  }

  const toggleAnimations = React.useCallback(() => {
    setSave((s) => ({
      ...s,
      config: { ...(s.config ?? {}), animations: !(s.config?.animations ?? true) },
    }));
  }, [setSave]);

  const toggleSounds = React.useCallback(() => {
    setSave((s) => ({
      ...s,
      config: { ...(s.config ?? {}), sounds: !(s.config?.sounds ?? true) },
    }));
  }, [setSave]);

  const log = (line: string) => setSave((s) => ({ ...s, log: [line, ...s.log].slice(0, 20) }));

  function unlock(id: string, label?: string) {
    setSave(s => {
      const has = s.achievements?.[id];
      if (has) return s;
      const ach = { ...(s.achievements ?? {}), [id]: true };
      if (s.config?.sounds ?? true) chord([860, 1140, 1460], .12, 'triangle');
      if (s.config?.haptics ?? true) vibr(25);
      showFloaty('🏆 Достижение: ' + (label ?? id));
      return { ...s, achievements: ach, log: [`🏆 Достижение: ${label ?? id}`, ...s.log].slice(0, 20) };
    });
  }

  // Daily login & streak + daily quests/buff
  React.useEffect(() => {
    setSave((s) => {
      if (s.game.lastLogin === today()) return s;
      const prev = new Date(s.game.lastLogin);
      const nowD = new Date(today());
      const diffDays = Math.round((+nowD - +prev) / 86400000);
      const streak = diffDays === 1 ? s.game.streak + 1 : 1;
      if (streak >= 3) setTimeout(() => unlock('streak3', 'Серия входов: 3 дня'), 0);
      const buff = rollDailyBuff();
      const quests = rollDailyQuests();
      const ts = now();
      const weeklyActive = s.daily.weeklyChallenge;
      const weeklyExpired = weeklyActive ? Number.isNaN(Date.parse(weeklyActive.expiresAt)) || Date.parse(weeklyActive.expiresAt) <= ts : true;
      const weeklyChallenge = weeklyExpired || !weeklyActive ? rollWeeklyChallenge() : weeklyActive;
      const bonusBuffExpires = ts + inSeconds(24 * 3600);
      const daily: Daily = {
        ...s.daily,
        date: today(),
        rewardClaimed: false,
        quests,
        buff,
        weeklyChallenge,
        bonusBuffExpires,
      };
      const refreshedLog = [`Новые ежедневные задания — бафф: ${describeBuff(buff)}`, ...s.log].slice(0, 20);
      const log = weeklyExpired
        ? [`Обновлён недельный квест: ${weeklyChallenge.label}`, ...refreshedLog].slice(0, 20)
        : refreshedLog;
      return {
        ...s,
        game: { ...s.game, lastLogin: today(), streak },
        daily,
        log,
      };
    });
  }, []);

  // Idle stat changes + fatigue regen
  React.useEffect(() => {
    setSave((s) => {
      const rightNow = now();
      const dtMin = Math.max(0, (rightNow - (s.stats.last || rightNow)) / 60000);
      const hunger = clamp(s.stats.hunger + dtMin * 0.15);
      const energy = clamp(s.stats.energy + dtMin * 0.08);
      const mood = clamp(s.stats.mood - dtMin * (hunger > 70 ? 0.2 : 0.05) + (energy > 70 ? 0.04 * dtMin : 0));
      // fatigue regen
      const fat = s.fatigue ?? { stamina: 100, last: rightNow };
      const regen = (rightNow - fat.last) / 60000 * 6;
      const stamina = clamp(Math.round(Math.min(100, (fat.stamina ?? 100) + regen)));
      return { ...s, stats: { ...s.stats, hunger, energy, mood, last: rightNow }, fatigue: { stamina, last: rightNow } };
    });

    const id = setInterval(() => {
      setSave((s) => {
        const rightNow = now();
        const dtMin = Math.max(0, (rightNow - (s.stats.last || rightNow)) / 60000);
        const hunger = clamp(s.stats.hunger + dtMin * 0.03);
        const energy = clamp(s.stats.energy + dtMin * 0.05);
        const mood = clamp(s.stats.mood - dtMin * (hunger > 80 ? 0.12 : 0.03) + (energy > 80 ? 0.03 * dtMin : 0));
        const fat = s.fatigue ?? { stamina: 100, last: rightNow };
        const regen = (rightNow - fat.last) / 60000 * 6;
        const stamina = clamp(Math.round(Math.min(100, (fat.stamina ?? 100) + regen)));
        return { ...s, stats: { ...s.stats, hunger, energy, mood, last: rightNow }, fatigue: { stamina, last: rightNow } };
      });
    }, 20000);
    return () => clearInterval(id);
  }, []);

  // Level-up confetti
  React.useEffect(() => {
    const prev = prevLevelRef.current;
    if (save.game.level > prev) {
      try {
        const c = document.createElement('canvas');
        c.width = 300; c.height = 120; c.style.position = 'fixed'; c.style.right = '16px'; c.style.top = '16px'; c.style.zIndex = '200';
        document.body.appendChild(c);
        const ctx = c.getContext('2d')!;
        const pieces = Array.from({ length: 60 }).map((_, i) => ({
          x: 150, y: 20, vx: (Math.random() - 0.5) * 6, vy: Math.random() * 2 + 1, life: 60 + Math.random() * 40, hue: (i * 37) % 360
        }));
        let f = 0;
        const tick = () => {
          f++; ctx.clearRect(0, 0, c.width, c.height);
          pieces.forEach((p) => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 1;
            ctx.fillStyle = `hsl(${p.hue} 80% 60%)`; ctx.fillRect(p.x, p.y, 4, 8);
          });
          if (f < 120) requestAnimationFrame(tick); else c.remove();
        };
        tick();
        if (save.game.level >= 5) unlock('level5', 'Достигнут уровень 5');
      } catch {}
    }
    prevLevelRef.current = save.game.level;
  }, [save.game.level]);

  // Rotating boutique items
  React.useEffect(() => {
    setSave(s => {
      const rotEvery = inSeconds(6 * 3600); // 6h
      if (!s.shop || s.shop.rotAt < now()) {
        const pool = COSMETICS.filter((c) => !c.exclusive);
        const pick = pool.sort(() => Math.random() - 0.5).slice(0, 8).map((c) => c.id);
        return { ...s, shop: { rotAt: now() + rotEvery, items: pick } };
      }
      return s;
    });
  }, []);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyK') {
        e.preventDefault();
        setShowCodesModal(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Helpers
  function showStickerBurst() {
    try {
      const n = 8;
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        Object.assign(s.style, {
          position: 'fixed', left: '50%', top: '180px', width: '8px', height: '8px',
          background: 'radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,0))',
          borderRadius: '50%', transform: `translate(-50%, 0)`, pointerEvents: 'none',
          filter: 'drop-shadow(0 0 8px rgba(255,180,220,.7))', zIndex: '250'
        } as CSSStyleDeclaration);
        document.body.appendChild(s);
        const angle = (Math.PI * 2 * i) / n; const dx = Math.cos(angle) * 90; const dy = Math.sin(angle) * 50;
        s.animate([{ transform: 'translate(-50%,0) scale(0.6)', opacity: 1 }, { transform: `translate(calc(-50% + ${dx}px), ${dy}px) scale(0)`, opacity: 0 }], { duration: 650, easing: 'ease-out' })
          .onfinish = () => s.remove();
      }
    } catch {}
  }
  function addXpCoins(game: Game, xp: number, coins = 0): Game {
    const buff = save.daily.buff;
    const xr = Math.round(xp * buffMultiplier(buff, 'xp'));
    const cr = Math.round(coins * buffMultiplier(buff, 'coins'));
    let nxp = (game.xp ?? 0) + xr; let lvl = game.level; let coins2 = game.coins + cr;
    while (nxp >= 100) { nxp -= 100; lvl += 1; }
    return { ...game, xp: nxp, level: lvl, coins: coins2 };
  }
  function applyQuestProgress(source: Save, key: string, d = 1): Save {
    const quests = source.daily.quests.map((q) => {
      const matches = q.id === key || (!!q.tracker && q.tracker === key);
      if (!matches) return q;
      return { ...q, progress: Math.min(q.target, q.progress + d) };
    });
    let weekly = source.daily.weeklyChallenge;
    if (weekly && (weekly.id === key || (!!weekly.tracker && weekly.tracker === key))) {
      weekly = { ...weekly, progress: Math.min(weekly.target, weekly.progress + d) };
    }
    return { ...source, daily: { ...source.daily, quests, weeklyChallenge: weekly } };
  }

  function bumpQuest(key: string, d = 1) {
    setSave((s) => applyQuestProgress(s, key, d));
  }

  // Actions
  function feed(kind: 'cookie' | 'meal') {
    setSave((s) => {
      if (s.inv[kind] <= 0) { log('Нет в инвентаре.'); return s; }
      const inv = { ...s.inv, [kind]: s.inv[kind] - 1 } as Inv;
      const delta = kind === 'meal' ? 30 : 12;
      const stats: Stats = { ...s.stats, hunger: clamp(s.stats.hunger - delta), mood: clamp(s.stats.mood + (kind === 'meal' ? 10 : 5)) };
      const game = addXpCoins(s.game, kind === 'meal' ? 6 : 3, 0);
      log(kind === 'meal' ? 'М-мм! Спасибо! 😋' : 'Вкуснятина! ✨');
      beep(660, .06, 'triangle'); vibr(10);
      bumpQuest('feed', 1);
      return { ...s, inv, stats, game };
    });
  }
  function playToy() {
    setSave((s) => {
      if (s.inv.toy <= 0) { log('Игрушек нет.'); return s; }
      if (s.stats.energy < 8) { log('Мало энергии.'); return s; }
      const inv = { ...s.inv, toy: s.inv.toy - 1 };
      const stats = { ...s.stats, mood: clamp(s.stats.mood + 12), energy: clamp(s.stats.energy - 8) };
      const game = addXpCoins(s.game, 8, 2);
      log('Играли! 🎮 +XP');
      bumpQuest('playtoy', 1);
      return { ...s, inv, stats, game };
    });
  }
  function petCheb() {
    setSave(s => {
      const stats = { ...s.stats, mood: clamp(s.stats.mood + 6) };
      if (s.config?.sounds ?? true) beep(520, .07, 'sine');
      showStickerBurst(); vibr(8);
      return { ...s, stats };
    });
    unlock('firstPet', 'Погладить Чебзика');
    bumpQuest('pet', 1);
  }
  function useMedkit() {
    setSave((s) => {
      if (s.inv.medkit <= 0) { log('Аптечки нет.'); return s; }
      const inv = { ...s.inv, medkit: s.inv.medkit - 1 };
      const stats = { ...s.stats, energy: clamp(s.stats.energy + 25) };
      log('Энергия восстановлена.');
      beep(420, .08, 'sawtooth');
      return { ...s, inv, stats };
    });
  }
  function openGift() {
    setSave((s) => {
      if (s.inv.gift <= 0) { log('Подарков нет.'); return s; }
      const inv = { ...s.inv, gift: s.inv.gift - 1 };
      const roll = Math.random();
      if (roll < 0.4) {
        inv.cookie++;
        log('В подарке печенька! 🍪');
        return applyQuestProgress({ ...s, inv }, 'gift_open', 1);
      }
      if (roll < 0.7) {
        inv.toy++;
        log('В подарке игрушка! 🧸');
        return applyQuestProgress({ ...s, inv }, 'gift_open', 1);
      }
      const game = { ...s.game, coins: s.game.coins + 5 };
      log('Монетки! +5');
      return applyQuestProgress({ ...s, inv, game }, 'gift_open', 1);
    });
  }
  function claimDaily() {
    setSave((s) => {
      if (s.daily.rewardClaimed && s.daily.date === today()) { log('Награда уже получена.'); return s; }
      const game = { ...s.game, coins: s.game.coins + 8 };
      const inv: Inv = { ...s.inv, cookie: s.inv.cookie + 1 };
      log('Ежедневная награда: +8 монет и 🍪');
      beep(780, .09, 'square'); vibr(15);
      return { ...s, game, inv, daily: { ...s.daily, rewardClaimed: true } };
    });
  }
  function buyFood(id: keyof Inv, price: number) {
    setSave((s) => {
      if (s.game.coins < price) { log('Недостаточно монет.'); return s; }
      const inv = { ...s.inv, [id]: (s.inv[id] as number) + 1 } as Inv;
      const game = { ...s.game, coins: s.game.coins - price };
      log(`Куплено: ${id}`);
      return { ...s, inv, game };
    });
  }
  function buyCosmetic(id: string, price: number) {
    setSave(s => {
      if (s.game.coins < price) { log('Недостаточно монет.'); return s; }
      if (s.cosm?.owned.includes(id)) return s;
      const cosm = { ...(s.cosm ?? { owned: [], equipped: {} }), owned: [...(s.cosm?.owned ?? []), id] };
      const game = { ...s.game, coins: s.game.coins - price };
      log(`Куплено в бутике: ${COSMETICS.find(c=>c.id===id)?.name ?? id}`);
      return { ...s, cosm, game };
    });
  }
  function getPaletteAccent(paletteId?: string) {
    const pal = COSMETICS.find(c => c.id === paletteId);
    return pal?.data?.grad?.[1] ?? '#8B5CF6';
  }
  function applyPaletteAccent(paletteId?: string) {
    try {
      const style = document.documentElement.style;
      if (paletteId) {
        style.setProperty('--accent', getPaletteAccent(paletteId));
      } else {
        style.removeProperty('--accent');
      }
    } catch {}
  }
  function equipCosmetic(c: Cosmetic) {
    setSave(s => {
      // Only allow equipping items the player owns
      if (!(s.cosm?.owned ?? []).includes(c.id)) return s;
      if ((s.cosm?.equipped ?? {})[c.kind] === c.id) return s;
      const equipped = { ...(s.cosm?.equipped ?? {}) } as Partial<Record<CosmeticKind, string>>;
      equipped[c.kind] = c.id; // put on
      const cosm = { ...(s.cosm ?? { owned: [], equipped: {} }), equipped };
      if (c.kind === 'palette') applyPaletteAccent(c.id);
      let next: Save = { ...s, cosm };
      if (c.rarity === 'rare' || c.rarity === 'epic' || c.rarity === 'legendary') {
        next = applyQuestProgress(next, 'equip_rare', 1);
      }
      return next;
    });
  }
  function unequipCosmetic(kind: CosmeticKind) {
    setSave(s => {
      const equipped = { ...(s.cosm?.equipped ?? {}) } as Partial<Record<CosmeticKind, string>>;
      delete equipped[kind];
      if (kind === 'palette') applyPaletteAccent(undefined);
      const cosm = { ...(s.cosm ?? { owned: [], equipped: {} }), equipped };
      return { ...s, cosm };
    });
  }
  // Ensure accent is applied on first mount based on equipped palette
  React.useEffect(() => {
    try { applyPaletteAccent(save.cosm?.equipped?.palette); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function applySecretCode(def: SecretCode): string {
    const summary: string[] = [];
    setSave((s) => {
      const nextCodes = [...(s.codes ?? []), def.code];
      const baseCosm = s.cosm ?? { owned: [], equipped: {} };
      const cosmClone: CosmeticsState = {
        owned: [...baseCosm.owned],
        equipped: { ...(baseCosm.equipped ?? {}) },
      };
      const gameClone: Game = { ...s.game };
      const invClone: Inv = { ...s.inv };

      let cosmChanged = false;
      let gameChanged = false;
      let invChanged = false;

      if (def.grant.addCosmetics) {
        const toGrant = def.grant.addCosmetics === 'ALL' ? ALL_COSMETIC_IDS : def.grant.addCosmetics;
        const before = new Set(baseCosm.owned);
        const newItems = toGrant.filter((id) => !before.has(id));
        const owned = Array.from(new Set([...baseCosm.owned, ...toGrant]));
        if (newItems.length) {
          const names = newItems.map((id) => COSMETICS_BY_ID[id]?.name ?? id);
          const preview = names.slice(0, 4).join(', ');
          summary.push(names.length > 4 ? `аксессуары: ${preview} и ещё ${names.length - 4}` : `аксессуары: ${preview}`);
        }
        if (owned.length !== baseCosm.owned.length || newItems.length > 0) {
          cosmClone.owned = owned;
          cosmChanged = true;
        }
      }

      if (typeof def.grant.addCoins === 'number' && def.grant.addCoins !== 0) {
        gameClone.coins += def.grant.addCoins;
        summary.push(`+${def.grant.addCoins} монет`);
        gameChanged = true;
      }

      if (typeof def.grant.minCoins === 'number' && gameClone.coins < def.grant.minCoins) {
        gameClone.coins = def.grant.minCoins;
        summary.push(`баланс до ${def.grant.minCoins} монет`);
        gameChanged = true;
      }

      if (def.grant.addInventory) {
        const lines: string[] = [];
        (Object.entries(def.grant.addInventory) as [keyof Inv, number | undefined][]).forEach(([key, amount]) => {
          if (!amount) return;
          invClone[key] = (invClone[key] ?? 0) + amount;
          lines.push(`${INV_LABELS[key].emoji} +${amount}`);
        });
        if (lines.length) {
          summary.push(`припасы: ${lines.join(', ')}`);
          invChanged = true;
        }
      }

      if (def.grant.minInventory) {
        const lines: string[] = [];
        (Object.entries(def.grant.minInventory) as [keyof Inv, number | undefined][]).forEach(([key, amount]) => {
          if (typeof amount !== 'number') return;
          if (invClone[key] < amount) {
            invClone[key] = amount;
            lines.push(`${INV_LABELS[key].emoji} ≥${amount}`);
          }
        });
        if (lines.length) {
          summary.push(`минимум запасов: ${lines.join(', ')}`);
          invChanged = true;
        }
      }

      let next: Save = { ...s, codes: nextCodes };
      if (cosmChanged) next = { ...next, cosm: cosmClone };
      if (gameChanged) next = { ...next, game: gameClone };
      if (invChanged) next = { ...next, inv: invClone };
      return next;
    });
    return summary.join(', ');
  }

  function tryRedeemSecretCode(codeInput: string): RedeemResult {
    const normalized = codeInput.trim().toUpperCase();
    if (!normalized) return { ok: false, message: 'Введите код.' };
    const used = save.codes ?? [];
    if (used.includes(normalized)) return { ok: false, message: 'Код уже активирован.' };
    const def = SECRET_CODE_MAP[normalized];
    if (!def) return { ok: false, message: 'Такого кода нет.' };
    const summary = applySecretCode(def) || def.title;
    const message = `${def.code}: ${summary}`;
    beep(900, 0.1, 'triangle');
    log(`Код активирован — ${message}`);
    return { ok: true, message };
  }

  function onMiniFinish(kind: MiniGameKind, score: number) {
    setShowMini(null);
    setSave((s) => {
      const highs = { ...(s.game.highs ?? {}) };
      highs[kind] = Math.max(highs[kind] ?? 0, score);
      const payout = MINI_GAME_PAYOUT[kind];
      const coins = Math.max(0, Math.round(score / payout.coinDivider));
      const xp = Math.max(0, Math.round(score * payout.xpMultiplier));
      const game = addXpCoins({ ...s.game, highs }, xp, coins);
      let next: Save = { ...s, game, log: [`Победа в ${MINI_GAME_LABEL[kind]}: ${score}`, ...s.log].slice(0, 20) };
      if (buffMatches(s.daily.buff, 'mood')) {
        const stats = { ...next.stats, mood: clamp(next.stats.mood + Math.min(15, Math.round(score / 2))) };
        next = { ...next, stats };
      } else if (buffMatches(s.daily.buff, 'stamina')) {
        const fat = next.fatigue ?? { stamina: 100, last: now() };
        const staminaGain = Math.min(12, Math.round(score / 2));
        const stamina = clamp(Math.min(100, (fat.stamina ?? 100) + staminaGain));
        next = { ...next, fatigue: { stamina, last: now() } };
      }
      return next;
    });
    unlock('firstWin', 'Первая победа в мини-игре');
    if (kind === 'blink' && score >= 15) unlock('blink15', 'Блик: 15 очков');
    if (kind === 'snake' && score >= 10) unlock('snake10', 'Змейка: 10 яблок');
    if (kind === 'meteor' && score >= 12) unlock('meteor12', 'Метеор-дождь: 12 звёзд');
    if (kind === 'glow' && score >= 14) unlock('glow14', 'Неоновое поле: 14 огоньков');
    bumpQuest('mini_any', 1);
    bumpQuest(`mini_${kind}`, 1);
  }

  function startGame(kind: MiniGameKind) {
    const stamina = save.fatigue?.stamina ?? 100;
    const cost = MINI_GAME_COST[kind] ?? MINIGAME_FATIGUE_COST;
    if (stamina < cost) { alert('Чебзик устал. Немного отдохнём!'); return; }
    setSave(s => ({ ...s, fatigue: { stamina: clamp(stamina - cost), last: now() } }));
    setShowMini(kind);
  }

  function claimQuest(scope: 'daily' | 'weekly', quest: Quest) {
    setSave(s => {
      let daily = s.daily;
      if (scope === 'daily') {
        daily = {
          ...daily,
          quests: daily.quests.map((q) => (q.id === quest.id ? { ...q, claimed: true } : q)),
        };
      } else if (scope === 'weekly' && daily.weeklyChallenge) {
        daily = {
          ...daily,
          weeklyChallenge: { ...daily.weeklyChallenge, claimed: true },
        };
      }
      const game = { ...s.game, coins: s.game.coins + quest.reward };
      beep(800,.08,'square'); vibr(15);
      log(`Квест завершён: ${quest.label} (+${quest.reward}🪙)`);
      return { ...s, daily, game };
    });
  }

  function exportSave() {
    try {
      const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'chebzik-save.json';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      log('Сейв сохранён в файл chebzik-save.json');
    } catch { try { (navigator as any).clipboard.writeText(JSON.stringify(save, null, 2)); log('Сейв скопирован в буфер.'); } catch {} }
  }
  function importSave() {
    const raw = prompt('Вставьте JSON сейва:'); if (!raw) return;
    try { const data = JSON.parse(raw) as Save; setSave(data); log('Сейв импортирован.'); }
    catch { alert('Не удалось импортировать.'); }
  }
  function resetAll() { if (!confirm('Сбросить прогресс Чебзика?')) return; setSave(defaultSave()); }
  function rename(newName?: string) {
    const n = (newName ?? prompt('Новое имя Чебзика:', save.stats.name))?.trim();
    if (!n) return; setSave((s) => ({ ...s, stats: { ...s.stats, name: n } }));
  }

  // Derived
  const h = clamp01(1 - save.stats.hunger / 100);
  const m = clamp01(save.stats.mood / 100);
  const e = clamp01(save.stats.energy / 100);
  const status = (() => {
    if (1 - h > 0.8) return 'очень голоден';
    if (m < 0.3) return 'грустит';
    if (e < 0.25) return 'очень устал';
    if (m > 0.85) return 'в восторге';
    return 'доволен';
  })();

  const equip = save.cosm?.equipped ?? {};
  const paletteId = equip.palette;

  const stamina = save.fatigue?.stamina ?? 100;

  const accentColor = React.useMemo(() => getPaletteAccent(paletteId), [paletteId]);
  const accentSoft = React.useMemo(() => toRgba(accentColor, 0.35), [accentColor]);
  const accentFaint = React.useMemo(() => toRgba(accentColor, 0.18), [accentColor]);
  const stageBackdrop = React.useMemo(() => {
    const halo = toRgba(accentColor, 0.22);
    const mist = toRgba(accentColor, 0.12);
    return `radial-gradient(120% 140% at 15% 20%, ${halo}, transparent 65%), radial-gradient(160% 120% at 85% 10%, ${mist}, transparent 70%), linear-gradient(180deg, rgba(12,14,24,0.96), rgba(5,7,12,0.94))`;
  }, [accentColor]);
  const vibeTagline = React.useMemo(() => {
    if (h < 0.45) return 'Время перекуса — печеньки и обед спасут положение.';
    if (m < 0.4) return 'Добавь веселья: мини-игры и игрушки творят чудеса!';
    if (e < 0.4) return 'Чебзику нужен отдых: аптечка и спокойствие помогут восстановиться.';
    if (stamina < 40) return 'Дай Чебзику передышку перед следующими мини-играми.';
    return 'Настрой идеальный — можно заняться квестами и кастомизацией!';
  }, [h, m, e, stamina]);

  // keep accent synced to palette
  React.useEffect(() => { applyPaletteAccent(paletteId); }, [paletteId]);
  React.useEffect(() => () => { applyPaletteAccent(undefined); }, []);

  const dailyClaimedToday = save.daily.rewardClaimed && save.daily.date === today();
  const readyDaily = save.daily.quests.filter(q => q.progress >= q.target && !q.claimed).length;
  const weeklyReady = save.daily.weeklyChallenge && !save.daily.weeklyChallenge.claimed && save.daily.weeklyChallenge.progress >= save.daily.weeklyChallenge.target ? 1 : 0;
  const readyQuests = readyDaily + weeklyReady;
  const ownedCosmetics = save.cosm?.owned.length ?? 0;
  const boutiqueItems = save.shop?.items.length ?? 0;
  const achievementsUnlocked = Object.keys(save.achievements ?? {}).length;
  const achievementsTotal = ACHIEVEMENTS_CATALOG.length;
  const staminaEnough = (kind: MiniGameKind) => stamina >= (MINI_GAME_COST[kind] ?? MINIGAME_FATIGUE_COST);

  const actionTiles: QuickAction[] = [
    {
      key: 'blink',
      icon: '✨',
      title: 'Мини-игра «Блик»',
      description: staminaEnough('blink') ? 'Тренируй реакцию и копи монеты' : `Нужно ${MINI_GAME_COST.blink} выносливости`,
      onClick: () => startGame('blink'),
      accent: staminaEnough('blink'),
      disabled: !staminaEnough('blink'),
      color: accentColor,
    },
    {
      key: 'snake',
      icon: '🐍',
      title: 'Мини-игра «Змейка»',
      description: staminaEnough('snake') ? 'Классика: собери максимум яблок' : `Нужно ${MINI_GAME_COST.snake} выносливости`,
      onClick: () => startGame('snake'),
      accent: staminaEnough('snake'),
      disabled: !staminaEnough('snake'),
      color: '#34d399',
    },
    {
      key: 'meteor',
      icon: '☄️',
      title: 'Мини-игра «Метеор-дождь»',
      description: staminaEnough('meteor') ? 'Лови звёзды и избегай промахов' : `Нужно ${MINI_GAME_COST.meteor} выносливости`,
      onClick: () => startGame('meteor'),
      accent: staminaEnough('meteor'),
      disabled: !staminaEnough('meteor'),
      color: '#f87171',
    },
    {
      key: 'glow',
      icon: '💡',
      title: 'Мини-игра «Неоновое поле»',
      description: staminaEnough('glow') ? 'Щёлкай по вспышкам как можно быстрее' : `Нужно ${MINI_GAME_COST.glow} выносливости`,
      onClick: () => startGame('glow'),
      accent: staminaEnough('glow'),
      disabled: !staminaEnough('glow'),
      color: '#60a5fa',
    },
    {
      key: 'daily',
      icon: '🎁',
      title: 'Ежедневная награда',
      description: dailyClaimedToday ? 'Уже получена сегодня' : '+8 монет и печенька за вход',
      onClick: claimDaily,
      badge: dailyClaimedToday ? undefined : 'Готово',
      disabled: dailyClaimedToday,
      accent: !dailyClaimedToday,
      color: '#f59e0b',
    },
    {
      key: 'quests',
      icon: '📜',
      title: 'Квесты',
      description: readyQuests ? `Награды готовы: ${readyQuests}` : 'Прогресс ежедневных заданий',
      onClick: () => setShowQuests(true),
      badge: readyQuests ? `×${readyQuests}` : undefined,
      accent: readyQuests > 0,
      color: '#22d3ee',
    },
    {
      key: 'shop',
      icon: '🛒',
      title: 'Магазин предметов',
      description: 'Пополнить запасы еды и игрушек',
      onClick: () => setShowItemShop(true),
      color: '#38bdf8',
    },
    {
      key: 'boutique',
      icon: '🧢',
      title: 'Бутик',
      description: boutiqueItems ? `В витрине: ${boutiqueItems}` : 'Обновление каждые 6 часов',
      onClick: () => setShowBoutique(true),
      color: '#a855f7',
    },
    {
      key: 'wardrobe',
      icon: '🎨',
      title: 'Гардероб',
      description: `Коллекция: ${ownedCosmetics}`,
      onClick: () => setShowWardrobe(true),
      color: '#ec4899',
    },
    {
      key: 'achievements',
      icon: '🏆',
      title: 'Достижения',
      description: `Прогресс ${achievementsUnlocked}/${achievementsTotal}`,
      onClick: () => setShowAch(true),
      badge: achievementsUnlocked === achievementsTotal && achievementsTotal > 0 ? '100%' : undefined,
      color: '#10b981',
    },
    {
      key: 'settings',
      icon: '⚙️',
      title: 'Настройки',
      description: 'Звуки, музыка, экспорт сейва',
      onClick: () => setShowSettings(true),
      color: '#6366f1',
    },
    {
      key: 'secret',
      icon: '🔑',
      title: 'Секретный код',
      description: 'Введите код для награды',
      onClick: () => setShowCodesModal(true),
      color: '#f97316',
    },
  ];

  return (
    <ThemeContext.Provider value={isDark}>
      <NiceBoundary>
      {!isDark && <style dangerouslySetInnerHTML={{ __html: LIGHT_THEME_FIXES }} />}
      <div className={isDark ? '' : 'buddy-light'}>
        <div className="relative px-4 py-6">
        <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: stageBackdrop }} />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            opacity: 0.15,
            mixBlendMode: 'screen',
          }}
        />
        <div className="relative mx-auto max-w-3xl">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm opacity-90 hover:opacity-100 transition-opacity"><Link to="/">← На главную</Link></div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <ChebzikAvatar className="h-7 w-7" mood={m} energy={e} palette={paletteId} equipped={equip} />
            <button className="hover:underline" onClick={() => rename()} title="Переименовать">{save.stats.name}</button>
          </div>
        </div>

        <Body>
          <div className="flex flex-col gap-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[rgba(14,18,32,0.9)] p-6 shadow-[0_32px_90px_rgba(6,10,30,0.55)] backdrop-blur-lg">
              <div
                className="pointer-events-none absolute inset-0 opacity-90"
                style={{
                  background: `radial-gradient(120% 120% at 15% 15%, ${accentSoft}, transparent 65%), radial-gradient(120% 120% at 85% 90%, ${accentFaint}, transparent 70%)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%)' }}
              />
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {ambientOrbsRef.current.map((orb, idx) => (
                  <span
                    key={`orb-${idx}`}
                    style={{
                      position: 'absolute',
                      left: `${orb.left}%`,
                      top: `${orb.top}%`,
                      width: `${orb.size}px`,
                      height: `${orb.size}px`,
                      background: `radial-gradient(circle at 30% 30%, ${accentSoft}, transparent 70%)`,
                      borderRadius: '999px',
                      opacity: orb.opacity,
                      filter: 'blur(0px)',
                      animation: `cheb-ambient-float ${orb.duration}s ease-in-out infinite`,
                      animationDelay: `${orb.delay}s`,
                    }}
                  />
                ))}
                {ambientOrbsRef.current.map((orb, idx) => (
                  <span
                    key={`spark-${idx}`}
                    style={{
                      position: 'absolute',
                      left: `${(orb.left + 8) % 100}%`,
                      top: `${(orb.top + 20) % 100}%`,
                      width: '2px',
                      height: '2px',
                      background: 'rgba(255,255,255,0.65)',
                      borderRadius: '50%',
                      animation: `cheb-ambient-twinkle ${6 + idx}s ease-in-out infinite`,
                      animationDelay: `${orb.delay / 2}s`,
                    }}
                  />
                ))}
              </div>
              <div className="relative flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className={(save.config?.animations ?? true) ? 'animate-bounce-slow' : ''} onClick={petCheb} title="Погладить">
                    <ChebzikAvatar className="h-36 w-36 cursor-pointer" mood={m} energy={e} palette={paletteId} equipped={equip} showSticker />
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="opacity-80">Сейчас Чебзик <b className="opacity-100 text-[color:var(--accent,#8B5CF6)]">{status}</b>.</div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/60">{vibeTagline}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-3">
              <StatDonut value={h} label="Сытость" tip="Корми печенькой или обедом" />
              <StatDonut value={m} label="Настроение" tip="Игрушки и мини-игры повышают" />
              <StatDonut value={e} label="Энергия" tip="Аптечка помогает восстановиться" />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm opacity-90">
              <Pill>LVL {save.game.level}</Pill>
              <Pill>XP {save.game.xp}/100</Pill>
              <Pill>🪙 {save.game.coins}</Pill>
              <Pill>🔥 {save.game.streak} дн.</Pill>
              <Pill>⚡️ выносливость {stamina}</Pill>
              <Pill>🏆 рекорд Блик {save.game.highs?.blink ?? 0}</Pill>
              <Pill>🐍 рекорд Змейка {save.game.highs?.snake ?? 0}</Pill>
            </div>

            {/* Inventory */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
                <div className="flex items-center gap-3"><span className="text-xl">🍪</span><div className="text-sm"><div className="font-medium">Печенька</div><div className="opacity-60">− голод · + настроение</div></div></div>
                <div className="flex items-center gap-2"><Pill>× {save.inv.cookie}</Pill><button className="btn" onClick={() => feed('cookie')}>Использовать</button></div>
              </div>
              <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
                <div className="flex items-center gap-3"><span className="text-xl">🍲</span><div className="text-sm"><div className="font-medium">Обед</div><div className="opacity-60">сытость ++</div></div></div>
                <div className="flex items-center gap-2"><Pill>× {save.inv.meal}</Pill><button className="btn" onClick={() => feed('meal')}>Использовать</button></div>
              </div>
              <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
                <div className="flex items-center gap-3"><span className="text-xl">🧸</span><div className="text-sm"><div className="font-medium">Игрушка</div><div className="opacity-60">веселье! − энергия</div></div></div>
                <div className="flex items-center gap-2"><Pill>× {save.inv.toy}</Pill><button className="btn" onClick={playToy}>Использовать</button></div>
              </div>
              <div className={`flex items-center justify-between rounded-xl p-3 ${CARD_SURFACE}`}>
                <div className="flex items-center gap-3"><span className="text-xl">💊</span><div className="text-sm"><div className="font-medium">Аптечка</div><div className="opacity-60">+ энергия</div></div></div>
                <div className="flex items-center gap-2"><Pill>× {save.inv.medkit}</Pill><button className="btn" onClick={useMedkit}>Использовать</button></div>
              </div>
              <div className={`flex items-center justify-between rounded-xl p-3 sm:col-span-2 ${CARD_SURFACE}`}>
                <div className="flex items-center gap-3"><span className="text-xl">🎁</span><div className="text-sm"><div className="font-medium">Подарок</div><div className="opacity-60">рандомный лут</div></div></div>
                <div className="flex items-center gap-2"><Pill>× {save.inv.gift}</Pill><button className="btn" onClick={openGift}>Открыть</button></div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                <span>Быстрые действия</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium tracking-[0.2em] text-white/70">
                  всё под рукой
                </span>
              </div>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(10,14,24,0.82)] p-4 shadow-[0_28px_70px_rgba(6,10,26,0.55)]">
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 opacity-90"
                  style={{
                    background: `radial-gradient(120% 140% at 10% 20%, ${accentSoft}, transparent 65%), radial-gradient(140% 140% at 90% 0%, ${accentFaint}, transparent 70%)`,
                  }}
                />
                <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {actionTiles.map(({ key, ...tile }) => (
                    <ActionTile key={key} {...tile} />
                  ))}
                </div>
              </div>
            </div>

            {/* Log */}
            {!!save.log.length && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Лента событий</div>
                <ul className="space-y-1 text-sm text-[color:var(--text-2,#d6dcff)]">
                  {save.log.map((l, i) => (<li key={i}>— {l}</li>))}
                </ul>
              </div>
            )}
          </div>
        </Body>

{/* Modals */}
{showMini && (
  <div
    className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-3"
    onClick={() => setShowMini(null)}
  >
    <div onClick={(e) => e.stopPropagation()}>
      {showMini === 'blink' && (
        <MiniGameBlink
          onClose={() => setShowMini(null)}
          onFinish={(score) => {
            setShowMini(null);
            onMiniFinish('blink', score);
          }}
        />
      )}
      {showMini === 'snake' && (
        <MiniGameSnake
          onClose={() => setShowMini(null)}
          onFinish={(score) => {
            setShowMini(null);
            onMiniFinish('snake', score);
          }}
        />
      )}
      {showMini === 'meteor' && (
        <MiniGameMeteor
          onClose={() => setShowMini(null)}
          onFinish={(score) => {
            setShowMini(null);
            onMiniFinish('meteor', score);
          }}
        />
      )}
      {showMini === 'glow' && (
        <MiniGameGlow
          onClose={() => setShowMini(null)}
          onFinish={(score) => {
            setShowMini(null);
            onMiniFinish('glow', score);
          }}
        />
      )}
    </div>
  </div>
)}

{showItemShop && (
  <FoodShopModal
    onClose={() => setShowItemShop(false)}
    coins={save.game.coins}
    onBuy={(id, price) => buyFood(id, price)}
  />
)}

{showBoutique && (
  <BoutiqueModal
    onClose={() => setShowBoutique(false)}
    rotIds={save.shop?.items ?? []}
    coins={save.game.coins}
    owned={save.cosm?.owned ?? []}
    onBuy={buyCosmetic}
  />
)}

{showCodesModal && (
  <SecretCodesModal
    onClose={() => setShowCodesModal(false)}
    onRedeem={(code) => tryRedeemSecretCode(code)}
  />
)}

{showWardrobe && (
  <WardrobeModal
    onClose={() => setShowWardrobe(false)}
    cosm={save.cosm ?? { owned: [], equipped: {} }}
    onEquip={equipCosmetic}
    onUnequip={unequipCosmetic}
  />
)}

{showSettings && (
  <ChebSettingsModal
    onClose={() => setShowSettings(false)}
    animations={save.config?.animations ?? true}
    sounds={save.config?.sounds ?? true}
    onToggleAnimations={toggleAnimations}
    onToggleSounds={toggleSounds}
    onExport={exportSave}
    onImport={importSave}
    onReset={resetAll}
    onRename={() => rename()}
  />
)}


{showAch && (
  <AchievementsModal onClose={() => setShowAch(false)} save={save} />
)}
{showQuests && (
  <QuestsModal
    onClose={() => setShowQuests(false)}
    daily={save.daily}
    onClaim={claimQuest}
  />
)}

{/* slow bounce */}
<style>{`
  .animate-bounce-slow { animation: cheb-bounce 3s ease-in-out infinite; transform-origin: 50% 100%; }
  @keyframes cheb-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
  @keyframes cheb-ambient-float { 0%,100% { transform: translateY(0) scale(1); opacity: 0.32; } 50% { transform: translateY(-14px) scale(1.08); opacity: 0.55; } }
  @keyframes cheb-ambient-twinkle { 0%,100% { opacity: 0.12; transform: scale(0.85); } 50% { opacity: 0.62; transform: scale(1.18); } }
`}</style>
        </div>
      </div>
      </div>
      </NiceBoundary>
    </ThemeContext.Provider>
  );
}


/* =========================================================
   Tiny helpers
========================================================= */

function showFloaty(text: string) {
  try {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'fixed';
    el.style.right = '16px';
    el.style.top = '16px';
    el.style.padding = '8px 12px';
    el.style.background = 'rgba(20,24,40,.9)';
    el.style.color = 'white';
    el.style.border = '1px solid rgba(255,255,255,.12)';
    el.style.borderRadius = '12px';
    el.style.zIndex = '250';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    document.body.appendChild(el);
    el.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 1600, easing: 'ease' }).onfinish = () => el.remove();
  } catch {}
}