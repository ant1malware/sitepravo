// Minimal vote client with batching and offline queue
export type Totals = { up: number; down: number };
const API = (import.meta as any).env?.VITE_VOTE_API_BASE || (import.meta as any).env?.VITE_API_BASE || 'https://sky-api.wizardiowhy.workers.dev';

const visibleBatch: Set<string> = new Set();
let batchTimer: any = null;
const listeners: Map<string, (t: Totals)=>void> = new Map();

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {}
  return null;
}

function safeGet(key: string): string | null {
  const store = getStorage();
  try {
    return store ? store.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  const store = getStorage();
  try {
    store?.setItem(key, value);
  } catch {}
}

export function setStatsListener(id: string, cb: (t: Totals)=>void) {
  listeners.set(id, cb);
}
export function removeStatsListener(id: string) { listeners.delete(id); }

export function markVisible(id: string) {
  visibleBatch.add(id);
  if (batchTimer) return;
  batchTimer = setTimeout(async () => {
    try {
      const ids = [...visibleBatch];
      visibleBatch.clear();
      batchTimer = null;
      const resp = await fetch(`${API}/api/stats?ids=${encodeURIComponent(ids.join(','))}`);
      const data = await resp.json();
      const stats = data?.stats || {};
      for (const [cid, val] of Object.entries<Totals>(stats)) {
        listeners.get(cid)?.(val);
      }
    } catch {}
  }, 120);
}

export function getAnonUID() {
  const k = 'anon_uid';
  let v = safeGet(k);
  if (!v) { v = crypto.randomUUID(); safeSet(k, v); }
  return v;
}

export async function vote(cardId: string, v: 1 | -1): Promise<Totals | null> {
  if (safeGet('telemetry_disabled') === '1') return null;
  const key = `voted:${cardId}`;
  if (safeGet(key)) return null;
  safeSet(key, '1');
  try {
    const resp = await fetch(`${API}/api/vote`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ card_id: cardId, vote: v, anon_uid: getAnonUID() })
    });
    const data = await resp.json();
    if (data?.ok && data.totals) return data.totals as Totals;
  } catch {}
  return null;
}
