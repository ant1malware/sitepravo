const KEY_PREFIX = 'forum:lastActive:';

export function recordLastActive(userId: string) {
  try {
    localStorage.setItem(KEY_PREFIX + userId, new Date().toISOString());
  } catch {}
}

export function getLastActive(userId: string): string | null {
  try {
    return localStorage.getItem(KEY_PREFIX + userId);
  } catch {
    return null;
  }
}

export function formatRelative(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  try {
    const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });
    const diff = d.getTime() - Date.now();
    const s = 1000, m = 60*s, h = 60*m, day = 24*h, mon = 30*day, yr = 365*day;
    if (Math.abs(diff) < m) return rtf.format(Math.round(diff / s), 'second');
    if (Math.abs(diff) < h) return rtf.format(Math.round(diff / m), 'minute');
    if (Math.abs(diff) < day) return rtf.format(Math.round(diff / h), 'hour');
    if (Math.abs(diff) < mon) return rtf.format(Math.round(diff / day), 'day');
    if (Math.abs(diff) < yr) return rtf.format(Math.round(diff / mon), 'month');
    return rtf.format(Math.round(diff / yr), 'year');
  } catch {
    return d.toLocaleString();
  }
}

