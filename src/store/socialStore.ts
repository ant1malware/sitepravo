// Lightweight social features stored in localStorage with optional remote sync
// - profile follows
// - profile comments (threads, edit, soft-delete, pagination)
// Backward compatible with previous exports.

export type FollowEdge = {
  followerId: string;
  targetId: string;
  createdAt: string;
};

export type ProfileComment = {
  id: string;
  targetId: string;
  authorId: string;
  authorName?: string;
  content: string; // empty when soft-deleted
  createdAt: string;
  parentId?: string | null;

  // new fields (auto-migrated on read)
  updatedAt?: string | null;
  edited?: boolean;
  deleted?: boolean;
  deletedAt?: string | null;
  deletedById?: string | null;
};

// ---------- config / utils ----------

const NS = "forum:";
const FOLLOWS_KEY = `${NS}follows`; // array of FollowEdge
const COMMENTS_PREFIX = `${NS}profile_comments:`; // per targetId
const EVT_SOCIAL_CHANGE = `${NS}social-change`;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const mem = new Map<string, string>();
const memoryStorage: StorageLike = {
  getItem: (k) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k, v) => void mem.set(k, v),
  removeItem: (k) => void mem.delete(k),
};

const storage: StorageLike = ((): StorageLike => {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {}
  return memoryStorage;
})();

const hasWindow = typeof window !== "undefined";

function nowISO() {
  return new Date().toISOString();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try { return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}

function uuid() {
  try {
    // @ts-ignore
    const g = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : null;
    if (g) return g;
  } catch {}
  // RFC4122-ish fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function dispatchChange(detail: any) {
  if (!hasWindow) return;
  try {
    window.dispatchEvent(new CustomEvent(EVT_SOCIAL_CHANGE, { detail }));
  } catch {}
}

// cross-tab sync -> re-emit custom event
if (hasWindow) {
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (e.key.startsWith(COMMENTS_PREFIX) || e.key === FOLLOWS_KEY) {
      dispatchChange({ key: e.key, type: "storage" });
    }
  });
}

// ---------- FOLLOWS ----------

function readFollows(): FollowEdge[] {
  return safeParse<FollowEdge[]>(storage.getItem(FOLLOWS_KEY), []);
}
function saveFollows(edges: FollowEdge[]) {
  // dedupe
  const seen = new Set<string>();
  const deduped: FollowEdge[] = [];
  for (const e of edges) {
    const key = `${e.followerId}=>${e.targetId}`;
    if (e.followerId === e.targetId) continue; // no self
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(e);
  }
  try { storage.setItem(FOLLOWS_KEY, JSON.stringify(deduped)); } catch {}
  dispatchChange({ scope: "follows" });
}

// Remote helpers
function getApiBase(): string {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('api');
    if (fromQuery) {
      localStorage.setItem('forum:api_base', fromQuery);
      try { url.searchParams.delete('api'); history.replaceState({}, '', url.toString()); } catch {}
    }
    const stored = localStorage.getItem('forum:api_base');
    if (stored) return stored;
  } catch {}
  const env = (import.meta as any).env?.VITE_API_BASE;
  if (env) return env;
  return '';
}
const BASE: string = getApiBase();
function readToken(): string | null { try { return localStorage.getItem('forum:token') ?? sessionStorage.getItem('forum:token'); } catch { return null; } }
async function remote(path: string, init: RequestInit = {}) {
  const token = readToken();
  const headers: any = { 'Content-Type': 'application/json', ...(init.headers||{}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const text = await res.text(); let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text || res.statusText }; }
  if (!res.ok) throw new Error(data?.error || `${res.status} ${res.statusText}`);
  return data;
}
function canRemote() { return !!BASE && !!readToken(); }

export function listFollowers(targetId: string): string[] {
  if (canRemote()) {
    try {
      const cache: Map<string, string[]> = (window as any).__socialRemoteFollowersCache || ((window as any).__socialRemoteFollowersCache = new Map());
      const cached = cache.get(targetId);
      if (cached) return cached;
      remote(`/social/followers/${encodeURIComponent(targetId)}`).then((d:any)=>{ try { cache.set(targetId, Array.isArray(d.followers)? d.followers : []); dispatchChange({ scope:'follows', targetId }); } catch {} });
    } catch {}
  }
  return readFollows().filter(e => e.targetId === targetId).map(e => e.followerId);
}
export function listFollowing(followerId: string): string[] {
  return readFollows().filter(e => e.followerId === followerId).map(e => e.targetId);
}
export function followersCount(targetId: string): number {
  return readFollows().reduce((n, e) => n + (e.targetId === targetId ? 1 : 0), 0);
}
export function followingCount(followerId: string): number {
  return readFollows().reduce((n, e) => n + (e.followerId === followerId ? 1 : 0), 0);
}
export function isFollowing(followerId: string | undefined | null, targetId: string): boolean {
  if (!followerId) return false;
  if (canRemote()) {
    try {
      const cache: Map<string, string[]> = (window as any).__socialRemoteFollowingCache || ((window as any).__socialRemoteFollowingCache = new Map());
      const arr = cache.get(followerId);
      if (arr) return arr.includes(targetId);
      remote(`/social/following/${encodeURIComponent(followerId)}`).then((d:any)=>{ try { cache.set(followerId, Array.isArray(d.following)? d.following : []); dispatchChange({ scope:'follows', followerId }); } catch {} });
    } catch {}
  }
  return readFollows().some(e => e.followerId === followerId && e.targetId === targetId);
}
export function follow(followerId: string, targetId: string) {
  if (!followerId || !targetId || followerId === targetId) return;
  if (canRemote()) { try { remote('/social/follow', { method:'POST', body: JSON.stringify({ targetId }) }); } catch {} }
  const edges = readFollows();
  if (edges.some(e => e.followerId === followerId && e.targetId === targetId)) return;
  edges.push({ followerId, targetId, createdAt: nowISO() });
  saveFollows(edges);
}
export function unfollow(followerId: string, targetId: string) {
  if (canRemote()) { try { remote('/social/unfollow', { method:'POST', body: JSON.stringify({ targetId }) }); } catch {} }
  const edges = readFollows().filter(e => !(e.followerId === followerId && e.targetId === targetId));
  saveFollows(edges);
}
export function toggleFollow(followerId: string, targetId: string): boolean {
  if (isFollowing(followerId, targetId)) { unfollow(followerId!, targetId); return false; }
  follow(followerId!, targetId); return true;
}

// ---------- COMMENTS ----------

function commentsKey(targetId: string) { return `${COMMENTS_PREFIX}${targetId}`; }

function migrateComments(arr: any[]): ProfileComment[] {
  return (arr as any[]).map((c) => {
    const base: ProfileComment = {
      id: c.id ?? uuid(),
      targetId: c.targetId,
      authorId: c.authorId,
      authorName: c.authorName,
      content: typeof c.content === "string" ? c.content : "",
      createdAt: c.createdAt ?? nowISO(),
      parentId: c.parentId ?? null,
      updatedAt: c.updatedAt ?? null,
      edited: !!c.edited,
      deleted: !!c.deleted,
      deletedAt: c.deletedAt ?? null,
      deletedById: c.deletedById ?? null,
    };
    return base;
  });
}

function readComments(targetId: string): ProfileComment[] {
  if (canRemote()) {
    try {
      const cache: Map<string, ProfileComment[]> = (window as any).__socialRemoteCommentsCache || ((window as any).__socialRemoteCommentsCache = new Map());
      const cached = cache.get(targetId);
      if (cached) return cached;
      remote(`/profiles/${encodeURIComponent(targetId)}/comments`).then((d:any)=>{ try { const arr = migrateComments(Array.isArray(d.comments)? d.comments : []); cache.set(targetId, arr); dispatchChange({ scope:'comments', targetId }); } catch {} });
    } catch {}
  }
  const raw = storage.getItem(commentsKey(targetId));
  const arr = safeParse<ProfileComment[]>(raw, []);
  return migrateComments(arr);
}
function saveComments(targetId: string, items: ProfileComment[]) {
  try { storage.setItem(commentsKey(targetId), JSON.stringify(items)); } catch {}
  dispatchChange({ scope: "comments", targetId });
}

// anti-spam: 1 post per 10s per (targetId, authorId)
const RATE_WINDOW_MS = 10_000;
function canPost(targetId: string, authorId: string): boolean {
  const key = `${NS}last_post:${targetId}:${authorId}`;
  const last = Number(storage.getItem(key) || "0");
  const ok = Date.now() - last >= RATE_WINDOW_MS;
  if (ok) try { storage.setItem(key, String(Date.now())); } catch {}
  return ok;
}

const MAX_LEN = 2000;

export function listProfileComments(
  targetId: string,
  opts?: { offset?: number; limit?: number; includeDeleted?: boolean; sort?: "new" | "old" }
): ProfileComment[] {
  const arr = readComments(targetId);
  const includeDeleted = !!opts?.includeDeleted;
  const sortOrder = opts?.sort ?? "new";
  const filtered = includeDeleted ? arr : arr.filter(c => !c.deleted);
  filtered.sort((a, b) => (sortOrder === "new"
    ? (a.createdAt < b.createdAt ? 1 : -1)
    : (a.createdAt > b.createdAt ? 1 : -1)));
  const start = Math.max(0, opts?.offset ?? 0);
  const end = opts?.limit ? start + Math.max(0, opts.limit) : undefined;
  return filtered.slice(start, end);
}

export function addProfileComment(
  targetId: string,
  authorId: string,
  content: string,
  opts?: { authorName?: string; parentId?: string | null; }
): ProfileComment {
  const trimmed = (content ?? "").trim();
  if (!trimmed) throw new Error("Comment is empty");
  if (trimmed.length > MAX_LEN) throw new Error(`Comment too long (${trimmed.length} > ${MAX_LEN})`);
  if (!canRemote() && !canPost(targetId, authorId)) throw new Error("You are posting too fast. Please wait a bit.");

  if (canRemote()) {
    try {
      remote(`/profiles/${encodeURIComponent(targetId)}/comments`, { method:'POST', body: JSON.stringify({ content: trimmed, parentId: opts?.parentId || null }) })
        .then((d:any)=>{ try { const cache: Map<string, ProfileComment[]> = (window as any).__socialRemoteCommentsCache; if (cache) { const list = cache.get(targetId) || []; const added = migrateComments(Array.isArray(d.comment) ? d.comment : [d.comment]); cache.set(targetId, [ ...added, ...list ]); dispatchChange({ scope:'comments', targetId }); } } catch {} })
        .catch(()=>{})
    } catch {}
  }

  // parent check if reply
  if (opts?.parentId) {
    const parent = readComments(targetId).find(c => c.id === opts.parentId);
    if (!parent) throw new Error("Parent comment not found");
  }

  const item: ProfileComment = {
    id: uuid(),
    targetId,
    authorId,
    authorName: opts?.authorName,
    content: trimmed,
    createdAt: nowISO(),
    parentId: opts?.parentId ?? null,
    updatedAt: null,
    edited: false,
    deleted: false,
    deletedAt: null,
    deletedById: null,
  };
  const list = readComments(targetId);
  list.unshift(item);
  saveComments(targetId, list);
  return item;
}

export function addReply(
  targetId: string,
  authorId: string,
  parentId: string,
  content: string,
  authorName?: string
) {
  return addProfileComment(targetId, authorId, content, { authorName, parentId });
}

export function editProfileComment(
  targetId: string,
  commentId: string,
  byUserId: string,
  newContent: string
): ProfileComment {
  const list = readComments(targetId);
  const i = list.findIndex(c => c.id === commentId);
  if (i < 0) throw new Error("Comment not found");
  const c = list[i];
  if (c.authorId !== byUserId) throw new Error("Only the author can edit their comment");
  if (c.deleted) throw new Error("Cannot edit a deleted comment");

  const trimmed = newContent.trim();
  if (!trimmed) throw new Error("Comment is empty");
  if (trimmed.length > MAX_LEN) throw new Error(`Comment too long (${trimmed.length} > ${MAX_LEN})`);

  const updated: ProfileComment = { ...c, content: trimmed, edited: true, updatedAt: nowISO() };
  list[i] = updated;
  saveComments(targetId, list);
  return updated;
}

// Soft delete (keeps thread). Author OR profile owner can delete.
export function removeProfileComment(targetId: string, commentId: string, byUserId: string) {
  if (canRemote()) { try { remote(`/profiles/${encodeURIComponent(targetId)}/comments/${encodeURIComponent(commentId)}`, { method:'DELETE' }); } catch {} }
  const list = readComments(targetId);
  const i = list.findIndex(c => c.id === commentId);
  if (i < 0) return;
  const c = list[i];
  if (!(c.authorId === byUserId || targetId === byUserId)) return; // no rights
  if (c.deleted) return;

  list[i] = {
    ...c,
    content: "",
    deleted: true,
    deletedAt: nowISO(),
    deletedById: byUserId,
  };
  saveComments(targetId, list);
}

// Hard delete + cascade children (use carefully, e.g., admin tools)
export function purgeProfileComment(targetId: string, commentId: string, byUserId: string) {
  // allow profile owner or author
  const list = readComments(targetId);
  const me = list.find(c => c.id === commentId);
  if (!me) return;
  if (!(me.authorId === byUserId || targetId === byUserId)) return;

  const toDelete = new Set<string>();
  function collect(id: string) {
    toDelete.add(id);
    list.filter(c => c.parentId === id).forEach(child => collect(child.id));
  }
  collect(commentId);
  const next = list.filter(c => !toDelete.has(c.id));
  saveComments(targetId, next);
}

export type CommentNode = ProfileComment & { replies: CommentNode[] };

// Build a thread subtree starting from rootId. If rootId is null, build top-level forest.
export function getCommentThread(targetId: string, rootId: string | null = null, includeDeleted = false): CommentNode[] {
  const all = readComments(targetId).filter(c => includeDeleted ? true : !c.deleted);
  const byId = new Map(all.map(c => [c.id, { ...c, replies: [] as CommentNode[] }]));
  const roots: CommentNode[] = [];

  for (const node of byId.values()) {
    // ensure chronological in replies (old -> new)
    // will re-sort after building
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  function sortTree(nodes: CommentNode[]) {
    nodes.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    nodes.forEach(n => sortTree(n.replies));
  }
  sortTree(roots);

  if (rootId === null) return roots;
  const root = byId.get(rootId);
  return root ? [root] : [];
}

export function commentCount(targetId: string, includeDeleted = false): number {
  const arr = readComments(targetId);
  return includeDeleted ? arr.length : arr.filter(c => !c.deleted).length;
}

// ---------- REACTIONS (local-only) ----------
export type Reaction = 'like' | 'smile' | 'useful';
type CommentReactions = { counts: Record<Reaction, number>; byUser: Record<string, Reaction | undefined> };
type ReactionState = Record<string, CommentReactions>; // key: commentId

function reactKey(targetId: string) { return `${NS}comment_reactions:${targetId}`; }
function readReacts(targetId: string): ReactionState { return safeParse<ReactionState>(storage.getItem(reactKey(targetId)), {}); }
function saveReacts(targetId: string, data: ReactionState) { try { storage.setItem(reactKey(targetId), JSON.stringify(data)); } catch {} dispatchChange({ scope: 'reactions', targetId }); }

export function listReactions(targetId: string): ReactionState { return readReacts(targetId); }
export function getUserReaction(targetId: string, commentId: string, userId: string): Reaction | undefined {
  return readReacts(targetId)[commentId]?.byUser?.[userId];
}
export function toggleReaction(targetId: string, commentId: string, userId: string, reaction: Reaction): CommentReactions {
  const state = readReacts(targetId);
  const entry: CommentReactions = state[commentId] || { counts: { like: 0, smile: 0, useful: 0 }, byUser: {} };
  const prev = entry.byUser[userId];
  if (prev === reaction) {
    entry.byUser[userId] = undefined;
    entry.counts[reaction] = Math.max(0, (entry.counts[reaction] || 0) - 1);
  } else {
    if (prev) entry.counts[prev] = Math.max(0, (entry.counts[prev] || 0) - 1);
    entry.byUser[userId] = reaction;
    entry.counts[reaction] = (entry.counts[reaction] || 0) + 1;
  }
  state[commentId] = entry;
  saveReacts(targetId, state);
  return entry;
}
