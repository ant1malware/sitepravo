// Local-only emoji reactions for forum posts (per postId)
export type PostReaction = 'like' | 'smile' | 'heart' | 'laugh' | 'rocket' | 'eyes';
export type PostReactionEntry = { counts: Record<PostReaction, number>; byUser: Record<string, PostReaction | undefined> };

const NS = 'forum:';
const KEY = (postId: string) => `${NS}post_reactions:${postId}`;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const mem = new Map<string, string>();
const memoryStorage: StorageLike = {
  getItem: (k) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k, v) => void mem.set(k, v),
  removeItem: (k) => void mem.delete(k),
};
const storage: StorageLike = ((): StorageLike => {
  try { if (typeof window !== 'undefined' && window.localStorage) return window.localStorage; } catch {}
  return memoryStorage;
})();

function safeParse<T>(raw: string | null, fallback: T): T {
  try { return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}

function read(postId: string): PostReactionEntry {
  const def: PostReactionEntry = { counts: { like: 0, smile: 0, heart: 0, laugh: 0, rocket: 0, eyes: 0 }, byUser: {} };
  return safeParse<PostReactionEntry>(storage.getItem(KEY(postId)), def);
}
function write(postId: string, val: PostReactionEntry) {
  try { storage.setItem(KEY(postId), JSON.stringify(val)); } catch {}
  try { window.dispatchEvent(new CustomEvent('forum:post-reactions', { detail: { postId } })); } catch {}
}

export function listPostReactions(postId: string): PostReactionEntry {
  return read(postId);
}

export function getMyPostReaction(postId: string, userId: string): PostReaction | undefined {
  return read(postId).byUser[userId];
}

export function togglePostReaction(postId: string, userId: string, reaction: PostReaction): PostReactionEntry {
  const entry = read(postId);
  const prev = entry.byUser[userId];
  if (prev === reaction) {
    entry.byUser[userId] = undefined;
    entry.counts[reaction] = Math.max(0, (entry.counts[reaction] || 0) - 1);
  } else {
    if (prev) entry.counts[prev] = Math.max(0, (entry.counts[prev] || 0) - 1);
    entry.byUser[userId] = reaction;
    entry.counts[reaction] = (entry.counts[reaction] || 0) + 1;
  }
  write(postId, entry);
  return entry;
}
