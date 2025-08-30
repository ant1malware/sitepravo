// Lightweight client-side tracker that posts to backend (Cloudflare Worker or Netlify)
const API_BASE = (import.meta as any).env?.VITE_API_BASE || (import.meta as any).env?.VITE_VOTE_API_BASE || 'https://sky-api.wizardiowhy.workers.dev';

function uid(): string {
  try {
    const k = 'anon_uid';
    let v = localStorage.getItem(k);
    if (!v) { v = crypto.randomUUID(); localStorage.setItem(k, v); }
    return v;
  } catch { return 'na'; }
}

function payloadBase() {
  return {
    site: typeof location !== 'undefined' ? location.host : '',
    path: typeof location !== 'undefined' ? (location.pathname + location.search + location.hash) : '',
    ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    uid: uid(),
  };
}

export function track(event: string, data?: Record<string, any>) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('telemetry_disabled') === '1') return;
  } catch {}
  try {
    const dnt = (navigator as any)?.doNotTrack || (window as any)?.doNotTrack || (navigator as any)?.msDoNotTrack;
    if (String(dnt) === '1' || String(dnt) === 'yes') return;
  } catch {}

  const body = JSON.stringify({ event, ...payloadBase(), data });
  const url = `${API_BASE}/api/track`;

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      // @ts-ignore - TS may not know sendBeacon signature
      if (navigator.sendBeacon(url, blob)) return;
    } catch { /* fallthrough to fetch */ }
  }

  try {
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
  } catch { /* ignore */ }
}
