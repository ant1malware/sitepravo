// src/recent.ts

const KEY = 'recent:items';
type RecentItem = { url: string; title?: string; ts: number };

export function pushRecent(url: string, title?: string) {
  try {
    const raw = localStorage.getItem(KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    const now: RecentItem = { url, title, ts: Date.now() };
    // Avoid stacking duplicates at the top
    if (list.length && list[0].url === url) return;
    const filtered = list.filter((i) => i.url !== url);
    filtered.unshift(now);
    // Keep only unique by URL and cap length
    const uniq: RecentItem[] = [];
    const seen = new Set<string>();
    for (const it of filtered) { if (!seen.has(it.url)) { seen.add(it.url); uniq.push(it); } }
    while (uniq.length > 15) uniq.pop();
    localStorage.setItem(KEY, JSON.stringify(uniq));
  } catch {}
}

export function getRecents(): RecentItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.ts - a.ts);
  } catch { return []; }
}
