// Простое локальное хранилище. Позже можно заменить на БД без смены типов.
import { assertAsciiUsername } from "./lib/validators";
export type Role = "admin" | "moderator" | "vip" | "user" | "newbie";

export type Account = {
  id: string;
  username: string;       // латиница/цифры/_
  email: string;
  createdAt: string;
  role: Role;
  userNumber: number;     // #1, #2 ...
  posts: number;
  likes: number;
  topics: number;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt: string;
};

export type Topic = {
  id: string;
  sectionId: string;
  title: string;
  authorId: string;
  createdAt: string;
  pinned?: boolean;
  locked?: boolean;
  movedTo?: string | null;
};

export type Post = {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  deleted?: boolean;
  deletedBy?: string;
};

const K = {
  accounts: "forum:accounts",
  sections: "forum:sections",
  topics:   "forum:topics",
  posts:    "forum:posts",
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* Accounts */
export function listAccounts() { return get<Account[]>(K.accounts, []); }
export function saveAccounts(arr: Account[]) { set(K.accounts, arr); }
export function findAccountById(id: string) { return listAccounts().find(a => a.id === id) || null; }
export function findAccountByUsername(name: string) {
  return listAccounts().find(a => a.username.toLowerCase() === name.toLowerCase()) || null;
}
export function updateAccount(id: string, patch: Partial<Account>) {
  const arr = listAccounts().map(a => a.id === id ? { ...a, ...patch } : a);
  saveAccounts(arr);
}
export function setRole(id: string, role: Role) { updateAccount(id, { role }); }

/* Sections */
export function listSections() { return get<Section[]>(K.sections, []); }
export function createSection(title: string, description: string, icon?: string) {
  const s: Section = {
    id: crypto.randomUUID(),
    title, description, icon, createdAt: new Date().toISOString()
  };
  const arr = [s, ...listSections()];
  set(K.sections, arr);
  return s;
}

/* Topics */
export function listTopics(sectionId?: string) {
  const all = get<Topic[]>(K.topics, []);
  return sectionId ? all.filter(t => t.sectionId === sectionId) : all;
}
export function createTopic(sectionId: string, title: string, authorId: string) {
  const t: Topic = {
    id: crypto.randomUUID(), sectionId, title, authorId,
    createdAt: new Date().toISOString(), pinned: false, locked: false, movedTo: null
  };
  const arr = [t, ...listTopics()];
  set(K.topics, arr);
  return t;
}
export function updateTopic(id: string, patch: Partial<Topic>) {
  const arr = listTopics().map(t => t.id === id ? { ...t, ...patch } : t);
  set(K.topics, arr);
}

/* Posts */
export function listPosts(topicId: string) {
  return get<Post[]>(K.posts, []).filter(p => p.topicId === topicId);
}
export function createPost(topicId: string, authorId: string, content: string) {
  const p: Post = { id: crypto.randomUUID(), topicId, authorId, content, createdAt: new Date().toISOString() };
  const arr = [ ...get<Post[]>(K.posts, []), p ];
  set(K.posts, arr);
  return p;
}
export function modDeletePost(id: string, by: string) {
  const arr = get<Post[]>(K.posts, []).map(p => p.id === id ? { ...p, deleted: true, deletedBy: by, content: "Удалено модератором" } : p);
  set(K.posts, arr);
}
