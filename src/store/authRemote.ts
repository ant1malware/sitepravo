// src/store/authRemote.ts
// Тонкий клиент к твоему воркеру (Cloudflare Workers).
// НИКАКИХ KV/DO тут нет — только HTTP к /skyapi/*


function getApiBase(): string {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('api');
    if (fromQuery) {
      localStorage.setItem('forum:api_base', fromQuery);
      // clean query param to avoid leaking
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
const TOKEN_KEY = "forum:token";
const SESSION_KEY = "forum:session";
export type Role = "developer" | "admin" | "moderator" | "vip" | "user" | "newbie";
export type RemoteUser = {
  id: string;
  username: string;
  email: string;
  userNumber: number;
  role: Role;
  createdAt: string;
  bannedUntil?: string | null;
  mutedUntil?: string | null;
  vipUntil?: string | null;
  invitedById?: string | null;
  invitedByName?: string | null;
  owner?: boolean;
};
export type RemoteProfile = {
  avatarData?: string;
  bannerData?: string;
  bio?: string;
  signature?: string;
  links?: { website?: string };
  accentFrom?: string;
  accentTo?: string;
  badges?: string[];
  labels?: string[];
  privacy?: { showEmail?: boolean; showStats?: boolean; showLinks?: boolean; allowComments?: boolean; showFollowers?: boolean };
};
export type Invite = {
  code: string;
  createdAt: string;
  createdBy: string;
  note?: string;
  usedBy?: string | null;
  usedAt?: string | null;
  createdByName?: string;
};
export type ServerSettings = { registrationMode?: 'invite'|'open'; allowGuestRead?: boolean };

function saveToken(token: string, remember = true) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
}

function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } finally {
    window.dispatchEvent(new Event("forum:session"));
  }
}

async function api(path: string, init: RequestInit = {}) {
  const token = readToken();
  const headers: any = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  // пробуем распарсить JSON даже при ошибке, чтобы показать норм текст
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text || res.statusText };
  }
  if (!res.ok) {
    throw new Error(data?.error || `${res.status} ${res.statusText}`);
  }
  return data;
}

// ---- Публичные функции, которыми пользуются компоненты ----

export async function registerAccount(input: {
  username: string;
  email: string;
  password?: string;
  remember?: boolean;
  inviteCode?: string;
  captchaToken?: string | null;
}) {
  const body = JSON.stringify({
    username: input.username,
    email: input.email,
    password: input.password || "1234",
    inviteCode: input.inviteCode || "",
    captchaToken: input.captchaToken || undefined,
  });
  const { token, user } = await api("/register", { method: "POST", body });
  saveToken(token, input.remember !== false);

  // для совместимости с твоим watcher'ом
  const ses = {
    userId: (user as RemoteUser).id,
    remember: input.remember !== false,
    lastLogin: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(ses));
  window.dispatchEvent(new Event("forum:session"));

  return user as RemoteUser;
}

export async function authenticateAccount(input: {
  usernameOrEmail: string;
  password?: string;
  remember?: boolean;
  otp?: string;
  captchaToken?: string | null;
}) {
  const body = JSON.stringify({
    usernameOrEmail: input.usernameOrEmail,
    password: input.password || "1234",
    otp: input.otp || undefined,
    captchaToken: input.captchaToken || undefined,
  });
  const { token, user } = await api("/login", { method: "POST", body });
  saveToken(token, input.remember !== false);

  const ses = {
    userId: (user as RemoteUser).id,
    remember: input.remember !== false,
    lastLogin: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(ses));
  window.dispatchEvent(new Event("forum:session"));

  return user as RemoteUser;
}

// Возвращает текущего юзера (или null, если не залогинен/токен просрочен)
export async function getSessionAccount(): Promise<RemoteUser | null> {
  const token = readToken();
  if (!token) return null;
  try {
    const { user } = await api("/me");
    return user as RemoteUser;
  } catch {
    clearSession();
    return null;
  }
}

// Только для админа
export async function listAccounts(): Promise<RemoteUser[]> {
  const { users } = await api("/users");
  return users as RemoteUser[];
}

// Только для админа
export async function setRole(id: string, role: Role) {
  const { user } = await api(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  return user as RemoteUser;
}

// Invites (admin/dev)
export async function listInvites(): Promise<Invite[]> {
  const { invites } = await api(`/invites`);
  return invites as Invite[];
}

export async function generateInvites(count = 5, note?: string): Promise<Invite[]> {
  const { invites } = await api(`/invites`, { method: "POST", body: JSON.stringify({ count, note }) });
  return invites as Invite[];
}

// Moderation actions
export async function banUser(id: string, until?: string) {
  const body = until ? JSON.stringify({ until }) : JSON.stringify({ days: 7 });
  const { user } = await api('/users/' + encodeURIComponent(id) + '/ban', { method: 'POST', body });
  return user as RemoteUser;
}
export async function unbanUser(id: string) {
  const { user } = await api('/users/' + encodeURIComponent(id) + '/unban', { method: 'POST' });
  return user as RemoteUser;
}
export async function muteUser(id: string, until?: string) {
  const body = until ? JSON.stringify({ until }) : JSON.stringify({ minutes: 60 });
  const { user } = await api('/users/' + encodeURIComponent(id) + '/mute', { method: 'POST', body });
  return user as RemoteUser;
}
export async function unmuteUser(id: string) {
  const { user } = await api('/users/' + encodeURIComponent(id) + '/unmute', { method: 'POST' });
  return user as RemoteUser;
}

export async function deleteInvite(code: string): Promise<void> {
  await api(`/invites/${encodeURIComponent(code)}`, { method: "DELETE" });
}

// Forum settings
export async function getServerSettings(): Promise<ServerSettings> {
  const { settings } = await api(`/settings`); return settings as ServerSettings;
}
export async function updateServerSettings(patch: ServerSettings): Promise<ServerSettings> {
  const { settings } = await api(`/settings`, { method: 'PATCH', body: JSON.stringify(patch) }); return settings as ServerSettings;
}

// Profiles
export type RemoteProfilePayload = {
  user: RemoteUser;
  profile: RemoteProfile | null;
  stats?: { posts?: number; topics?: number; likes?: number; score?: number } | null;
};

export async function getProfileByUsername(username: string): Promise<RemoteProfilePayload | null> {
  try {
    const data = await api(`/profiles/by-username/${encodeURIComponent(username)}`);
    return {
      user: data.user as RemoteUser,
      profile: (data.profile || null) as RemoteProfile | null,
      stats: (data.stats || null) as RemoteProfilePayload["stats"],
    };
  } catch {
    return null;
  }
}
export async function updateMyProfile(profile: RemoteProfile): Promise<RemoteProfile> {
  const { profile: saved } = await api(`/profiles/me`, { method: 'PATCH', body: JSON.stringify(profile) });
  return saved as RemoteProfile;
}

export async function getProfileById(id: string): Promise<RemoteProfile | null> {
  try { const { profile } = await api(`/profiles/${encodeURIComponent(id)}`); return profile as RemoteProfile; } catch { return null; }
}

export async function setCustomLabels(id: string, labels: string[]): Promise<RemoteProfile> {
  const payload = { labels: Array.isArray(labels) ? labels : [] } as any;
  const { profile } = await api(`/profiles/${encodeURIComponent(id)}/labels`, { method: 'PATCH', body: JSON.stringify(payload) });
  return profile as RemoteProfile;
}

export async function setVip(id: string, days = 30): Promise<RemoteUser> {
  const { user } = await api(`/users/${encodeURIComponent(id)}/vip`, { method: 'POST', body: JSON.stringify({ days }) });
  return user as RemoteUser;
}
export async function unsetVip(id: string): Promise<RemoteUser> {
  const { user } = await api(`/users/${encodeURIComponent(id)}/unvip`, { method: 'POST' });
  return user as RemoteUser;
}

export type PublicMember = Pick<RemoteUser, 'id'|'username'|'role'|'createdAt'|'userNumber'> & {
  profile?: Pick<RemoteProfile,
    'avatarData' | 'bannerData' | 'bio' | 'signature' | 'links' | 'accentFrom' | 'accentTo' | 'badges' | 'labels' | 'privacy'
  > | null;
  stats?: { posts?: number; topics?: number; likes?: number; score?: number } | null;
};
export async function listPublicMembers(): Promise<PublicMember[]> {
  const { members } = await api(`/members`);
  return members as PublicMember[];
}

// Bootstrap Pavel (one-time). Requires ADMIN_KEY via query param; call from browser/curl.
export async function bootstrapPavel(password: string, email?: string) {
  const key = (import.meta as any).env?.VITE_ADMIN_KEY || "";
  const { user, token } = await api(`/bootstrap?key=${encodeURIComponent(key)}`, { method: "POST", body: JSON.stringify({ password, email }) });
  if (token) saveToken(token, true);
  return user as RemoteUser;
}