import versions from './data/versions.json';

export interface EntityVersionInfo {
  version: string;
  updated_at: string; // YYYY-MM-DD
  updated_by?: string;
  changelog?: { version: string; date: string; author?: string; summary: string; details?: string[] }[];
}

export function getVersionInfo(id: string): EntityVersionInfo | null {
  // @ts-ignore
  const v = (versions as any).entities?.[id];
  return v || null;
}

export function isRecentlyUpdated(id: string, days = 30): { recent: boolean; date?: string } {
  const v = getVersionInfo(id);
  if (!v?.updated_at) return { recent: false };
  const d = new Date(v.updated_at + 'T00:00:00Z');
  const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return { recent: diff <= days, date: v.updated_at };
}

// Tiny line diff (no external deps). Returns HTML with ins/del marks.
export function diffText(prev: string, curr: string): string {
  const a = prev.split(/\r?\n/);
  const b = curr.split(/\r?\n/);
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: string[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { out.push(escape(a[i])); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<del>${escape(a[i])}</del>`); i++; }
    else { out.push(`<ins>${escape(b[j])}</ins>`); j++; }
  }
  while (i < m) { out.push(`<del>${escape(a[i++])}</del>`); }
  while (j < n) { out.push(`<ins>${escape(b[j++])}</ins>`); }
  return out.join('\n');
}

function escape(s: string) { return s.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'} as any)[c]); }

export function getWhatsNew() {
  // Flatten and sort by date
  const items: { id: string; version: string; date: string; summary: string; details?: string[] }[] = [];
  // @ts-ignore
  const ents = (versions as any).entities || {};
  for (const [id, v] of Object.entries<any>(ents)) {
    const last = v.changelog?.[0];
    if (last) items.push({ id, version: last.version, date: last.date, summary: last.summary, details: last.details });
  }
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return items;
}

export default {};
