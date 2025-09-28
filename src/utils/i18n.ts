export type Lang = 'ru' | 'en';

const KEY = 'app:lang';

export function getLang(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'ru' || v === 'en') return v;
  } catch {}
  return 'ru';
}

export function setLang(l: Lang) {
  try { localStorage.setItem(KEY, l); } catch {}
  try { const ev = new Event('i18n:change'); window.dispatchEvent(ev); } catch {}
}

export function t(ru: string, en: string): string {
  return getLang() === 'ru' ? ru : en;
}

