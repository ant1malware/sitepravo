export interface Env {
  // уведомления
  NOTIF_KV: KVNamespace
  NOTIFY_SECRET: string

  // чат
  ROOM: DurableObjectNamespace
  ADMIN_KEY: string

  // +++ ДОБАВЛЕНО: авторизация/роли
  AUTH_KV?: KVNamespace               // KV для пользователей и сессий
  USER_COUNTER?: DurableObjectNamespace // DO-счётчик userNumber
  API_BASE?: string                   // префикс API (напр. "/skyapi")
  CORS_ORIGINS?: string               // (необяз.) список разрешённых Origin через запятую
}

/* ============================ УВЕДОМЛЕНИЯ ============================ */

type Notif = { id: string; title?: string; text: string; date: string; url?: string }
type Feed = { items: Notif[] }

const FEED_KEY = 'feed.json'
const NICK_EPOCH_KEY = 'nick:epoch'

// динамический CORS: эхо Origin + креды, иначе '*'
function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || ''
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Bot-Api-Secret-Token, x-admin-secret, Authorization',
  }
  if (origin) {
    h['Access-Control-Allow-Origin'] = origin
    h['Access-Control-Allow-Credentials'] = 'true'
    h['Vary'] = 'Origin'
  } else {
    h['Access-Control-Allow-Origin'] = '*'
  }
  return h
}

function json(req: Request, body: unknown, init: ResponseInit = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json', ...corsHeaders(req), ...(init.headers || {}) })
  return new Response(JSON.stringify(body), { ...init, headers })
}

function text(req: Request, body: string, init: ResponseInit = {}) {
  const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders(req), ...(init.headers || {}) })
  return new Response(body, { ...init, headers })
}

async function readFeed(env: Env): Promise<Feed> {
  const raw = await env.NOTIF_KV.get(FEED_KEY)
  if (!raw) return { items: [] }
  try { return JSON.parse(raw) as Feed } catch { return { items: [] } }
}

async function writeFeed(env: Env, feed: Feed) {
  await env.NOTIF_KV.put(FEED_KEY, JSON.stringify(feed))
}

async function readNickEpoch(env: Env): Promise<number> {
  const v = await env.NOTIF_KV.get(NICK_EPOCH_KEY)
  const n = v ? parseInt(v, 10) : 1
  return Number.isFinite(n) && n > 0 ? n : 1
}

async function writeNickEpoch(env: Env, value: number) {
  const v = Math.max(1, Math.min(10_000_000, Math.floor(value)))
  await env.NOTIF_KV.put(NICK_EPOCH_KEY, String(v))
}

function parseTelegramBody(body: any) {
  const update = body || {}
  const msg = update?.message || update?.edited_message
  const text: string = msg?.text || ''
  if (!text) return null

  let title: string | undefined
  let url: string | undefined
  let bodyText = text
  const firstLine = text.split('\n')[0]
  const m = /^\s*\[(.*?)\]\s*(?:\((https?:[^\s]+)\))?\s*$/m.exec(firstLine)
  if (m) {
    title = m[1] || undefined
    url = m[2] || undefined
    bodyText = text.split('\n').slice(1).join('\n').trim() || title || text
  }

  const id = String(update.update_id || Date.now())
  return { id, title, text: bodyText, date: new Date().toISOString(), url } as Notif
}

/* ============================ ADMIN cookie ============================ */

function getCookie(header: string | null | undefined, name: string): string | undefined {
  if (!header) return
  const parts = header.split(/; */)
  for (const p of parts) {
    const idx = p.indexOf('=')
    if (idx === -1) continue
    const k = decodeURIComponent(p.slice(0, idx).trim())
    if (k === name) return decodeURIComponent(p.slice(idx + 1).trim())
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

async function hmac(env: Env, data: string): Promise<string> {
  const keyRaw = new TextEncoder().encode(env.ADMIN_KEY || '')
  const cryptoKey = await crypto.subtle.importKey('raw', keyRaw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data))
  const bin = String.fromCharCode(...new Uint8Array(sig))
  // @ts-ignore
  return btoa(bin)
}

async function makeAdminToken(env: Env): Promise<string> {
  const ts = Date.now().toString()
  const sig = await hmac(env, `v1|${ts}`)
  return `v1.${ts}.${sig}`
}

async function checkAdminToken(env: Env, token?: string): Promise<boolean> {
  if (!token || !env.ADMIN_KEY) return false
  const [v, tsStr, sig] = token.split('.')
  if (v !== 'v1' || !tsStr || !sig) return false
  const ts = parseInt(tsStr, 10); if (!ts) return false
  if (Date.now() - ts > 30 * 24 * 60 * 60 * 1000) return false
  const expect = await hmac(env, `v1|${tsStr}`)
  return timingSafeEqual(sig, expect)
}

/* ============================ ЧАТ (WS + Durable Object) ============================ */

type ChatMessage = { id: string; author: string; text: string; ts: number }
type Session = { ws: WebSocket; name: string; isAdmin: boolean; last: number[] }

function uid(): string {
  try {
    // @ts-ignore
    const f = (crypto && (crypto as any).randomUUID) || (self as any)?.crypto?.randomUUID
    if (typeof f === 'function') return f()
  } catch {}
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

/* ===================== АВТОРИЗАЦИЯ/РОЛИ (добавлено) ===================== */

type Role = 'developer'|'admin'|'moderator'|'vip'|'user'|'newbie'
type UserFull = {
  id: string; username: string; email: string;
  passwordHash: string; salt: string;
  userNumber: number; role: Role; createdAt: string;
}
type UserPublic = Omit<UserFull, 'passwordHash'|'salt'>

const USERNAME = /^[A-Za-z0-9_]{3,16}$/

// base64 helpers
function b64(bytes: ArrayBuffer | Uint8Array) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let s = ''; for (let i=0;i<u8.length;i++) s += String.fromCharCode(u8[i])
  // @ts-ignore
  return btoa(s)
}
function b64dec(s: string) {
  const bin = atob(s)
  const u8 = new Uint8Array(bin.length)
  for (let i=0;i<bin.length;i++) u8[i] = bin.charCodeAt(i)
  return u8
}
function randB64(n=16) { const u8=new Uint8Array(n); crypto.getRandomValues(u8); return b64(u8) }

async function pbkdf2(password: string, saltB64: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), {name:'PBKDF2'}, false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', iterations:100_000, salt: b64dec(saltB64)}, key, 256)
  return b64(bits)
}

// KV keys
const U_BY_ID = (id: string) => `auth:user:${id}`
const IDX_U = (u: string) => `auth:idx:u:${u.toLowerCase()}`
const IDX_E = (e: string) => `auth:idx:e:${e.toLowerCase()}`
const SESS = (t: string) => `auth:sess:${t}`
// Invites
const INV = (code: string) => `auth:invite:${code}`

// CRUD users in KV
async function getUserByIdKV(env: Env, id: string): Promise<UserFull|null> {
  const raw = await env.AUTH_KV!.get(U_BY_ID(id))
  return raw ? JSON.parse(raw) as UserFull : null
}
async function getIdByUsername(env: Env, username: string) {
  return env.AUTH_KV!.get(IDX_U(username))
}
async function getIdByEmail(env: Env, email: string) {
  return env.AUTH_KV!.get(IDX_E(email))
}
async function putUserKV(env: Env, u: UserFull) {
  await env.AUTH_KV!.put(U_BY_ID(u.id), JSON.stringify(u))
  await env.AUTH_KV!.put(IDX_U(u.username), u.id)
  await env.AUTH_KV!.put(IDX_E(u.email), u.id)
}
async function listUsersKV(env: Env): Promise<UserPublic[]> {
  const out: UserPublic[] = []
  let cursor: string | undefined = undefined
  do {
    const page = await env.AUTH_KV!.list({ prefix: 'auth:user:', cursor })
    for (const k of page.keys) {
      const raw = await env.AUTH_KV!.get(k.name)
      if (!raw) continue
      const u = JSON.parse(raw) as UserFull
      const { passwordHash, salt, ...pub } = u
      out.push(pub as UserPublic)
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  out.sort((a,b)=> (a.userNumber||0) - (b.userNumber||0))
  return out
}

// ----- Invites in KV -----
type Invite = { code: string; createdAt: string; createdBy: string; note?: string; usedBy?: string|null; usedAt?: string|null }

function normalizeInvite(code: string) { return (code||'').toString().replace(/[^A-Za-z0-9]/g,'').toUpperCase() }
function randomInvite(len=16) { const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=''; for(let i=0;i<len;i++) s+=a[Math.floor(Math.random()*a.length)]; return s }
async function putInvite(env: Env, inv: Invite) { await env.AUTH_KV!.put(INV(inv.code), JSON.stringify(inv)) }
async function getInvite(env: Env, code: string): Promise<Invite|null> { const raw = await env.AUTH_KV!.get(INV(code)); return raw? JSON.parse(raw) as Invite : null }
async function listInvitesKV(env: Env): Promise<Invite[]> { const out: Invite[]=[]; let cursor: string|undefined=undefined; do{ const page=await env.AUTH_KV!.list({prefix:'auth:invite:',cursor}); for(const k of page.keys){ const raw=await env.AUTH_KV!.get(k.name); if(!raw) continue; out.push(JSON.parse(raw) as Invite) } cursor = page.list_complete? undefined : page.cursor } while(cursor); out.sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||'')); return out }
async function markInviteUsed(env: Env, code: string, userId: string) { const inv = await getInvite(env, code); if (!inv) throw new Error('invite not found'); inv.usedBy=userId; inv.usedAt=new Date().toISOString(); await putInvite(env, inv) }

/* ===================== Forum: Sections/Topics/Posts in KV ===================== */

type Section = { id: string; title: string; description?: string; icon?: string; createdAt: string; order: number; moderatorIds: string[]; topicCount: number; postCount: number }
type Topic = { id: string; sectionId: string; title: string; authorId: string; createdAt: string; updatedAt: string; pinned: boolean; locked: boolean; viewCount: number; replyCount: number; lastPostAt: string; lastPostBy: string }
type Post = { id: string; topicId: string; authorId: string; content: string; createdAt: string; editedAt?: string|null }

const F_SEC = (id: string) => `forum:section:${id}`
const F_TOP = (id: string) => `forum:topic:${id}`
const F_POS = (id: string) => `forum:post:${id}`
const IDX_T_S = (sectionId: string, id: string) => `forum:idx:topics:section:${sectionId}:${id}`
const IDX_P_T = (topicId: string, id: string) => `forum:idx:posts:topic:${topicId}:${id}`

async function listSectionsKV(env: Env): Promise<Section[]> {
  const out: Section[] = []
  let cursor: string | undefined = undefined
  do {
    const page = await env.AUTH_KV!.list({ prefix: 'forum:section:', cursor })
    for (const k of page.keys) {
      const raw = await env.AUTH_KV!.get(k.name)
      if (!raw) continue
      out.push(JSON.parse(raw) as Section)
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  out.sort((a,b)=> (a.order||0)-(b.order||0))
  return out
}
async function putSectionKV(env: Env, s: Section) { await env.AUTH_KV!.put(F_SEC(s.id), JSON.stringify(s)) }
async function getSectionKV(env: Env, id: string) { const raw = await env.AUTH_KV!.get(F_SEC(id)); return raw? JSON.parse(raw) as Section : null }
async function deleteSectionKV(env: Env, id: string) { await env.AUTH_KV!.delete(F_SEC(id)) }

async function listTopicsKV(env: Env, sectionId?: string): Promise<Topic[]> {
  if (sectionId) {
    const out: Topic[] = []
    let cursor: string | undefined = undefined
    const prefix = `forum:idx:topics:section:${sectionId}:`
    do {
      const page = await env.AUTH_KV!.list({ prefix, cursor })
      for (const k of page.keys) {
        const id = k.name.slice(prefix.length)
        const raw = await env.AUTH_KV!.get(F_TOP(id)); if (!raw) continue
        out.push(JSON.parse(raw) as Topic)
      }
      cursor = page.list_complete ? undefined : page.cursor
    } while (cursor)
    out.sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    return out
  }
  const out: Topic[] = []
  let cursor: string | undefined = undefined
  do { const page = await env.AUTH_KV!.list({ prefix:'forum:topic:', cursor });
    for (const k of page.keys) { const raw = await env.AUTH_KV!.get(k.name); if (!raw) continue; out.push(JSON.parse(raw) as Topic) }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  out.sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  return out
}
async function putTopicKV(env: Env, t: Topic) { await env.AUTH_KV!.put(F_TOP(t.id), JSON.stringify(t)); await env.AUTH_KV!.put(IDX_T_S(t.sectionId, t.id), '1') }
async function deleteTopicKV(env: Env, t: Topic) { await env.AUTH_KV!.delete(F_TOP(t.id)); await env.AUTH_KV!.delete(IDX_T_S(t.sectionId, t.id)) }

async function listPostsKV(env: Env, topicId: string, limit=200): Promise<Post[]> {
  const out: Post[] = []
  let cursor: string | undefined = undefined
  const prefix = `forum:idx:posts:topic:${topicId}:`
  do {
    const page = await env.AUTH_KV!.list({ prefix, cursor })
    for (const k of page.keys) { const id = k.name.slice(prefix.length); const raw = await env.AUTH_KV!.get(F_POS(id)); if (!raw) continue; out.push(JSON.parse(raw) as Post) }
    cursor = page.list_complete ? undefined : page.cursor
    if (out.length >= limit) break
  } while (cursor)
  out.sort((a,b)=> new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  return out.slice(0, limit)
}
async function putPostKV(env: Env, p: Post) { await env.AUTH_KV!.put(F_POS(p.id), JSON.stringify(p)); await env.AUTH_KV!.put(IDX_P_T(p.topicId, p.id), '1') }
async function deletePostKV(env: Env, p: Post) { await env.AUTH_KV!.delete(F_POS(p.id)); await env.AUTH_KV!.delete(IDX_P_T(p.topicId, p.id)) }

// Durable Object: глобальный счётчик userNumber
export class UserCounter {
  constructor(private state: DurableObjectState) {}
  async fetch(req: Request) {
    const url = new URL(req.url)
    if (req.method === 'POST' && url.pathname === '/next') {
      let n = (await this.state.storage.get<number>('n')) ?? 0
      n += 1
      await this.state.storage.put('n', n)
      return new Response(JSON.stringify({ n }), { status: 200 })
    }
    return new Response('not found', { status: 404 })
  }
}
async function nextUserNumber(env: Env) {
  const id = env.USER_COUNTER!.idFromName('global')
  const stub = env.USER_COUNTER!.get(id)
  const r = await stub.fetch('https://counter/next', { method: 'POST' })
  const data = await r.json()
  return Number(data.n) || 1
}

// sessions in KV
async function createSession(env: Env, userId: string) {
  const token = crypto.randomUUID()
  await env.AUTH_KV!.put(SESS(token), userId, { expirationTtl: 60*60*24*7 }) // 7 дней
  return token
}
async function readSession(env: Env, req: Request) {
  const h = req.headers.get('Authorization') || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!token) return null
  const uid = await env.AUTH_KV!.get(SESS(token))
  return uid ? { token, userId: uid } : null
}

// API handler (/skyapi/*)
async function handleAuthApi(req: Request, env: Env): Promise<Response|null> {
  const base = env.API_BASE || '/skyapi'
  const url = new URL(req.url)
  if (!url.pathname.startsWith(base)) return null
  const method = req.method

  if (!env.AUTH_KV || !env.USER_COUNTER) {
    return json(req, { error: 'auth service not configured' }, { status: 501 })
  }

  if (method === 'OPTIONS') return json(req, { ok: true })

  const sub = url.pathname.slice(base.length) // "/register", "/login", ...
  try {
    // POST /register
    if (sub === '/register' && method === 'POST') {
      const { username, email, password='1234', inviteCode='' } = await req.json().catch(()=> ({}))
      if (!USERNAME.test(String(username||''))) return json(req, { error:'bad username' }, { status: 400 })
      if (!email || !String(email).includes('@')) return json(req, { error:'bad email' }, { status: 400 })
      if (!password || String(password).length < 4) return json(req, { error:'bad password' }, { status: 400 })
      // тут можно проверить inviteCode, если нужно

      {
        const norm = normalizeInvite(String(inviteCode||''))
        if (norm.length !== 16) return json(req, { error:'invite required' }, { status: 400 })
        const inv = await getInvite(env, norm)
        if (!inv) return json(req, { error:'invite invalid' }, { status: 400 })
        if (inv.usedBy) return json(req, { error:'invite used' }, { status: 409 })
        ;(req as any)._normInvite = norm
      }
      if (await getIdByUsername(env, username)) return json(req, { error:'username exists' }, { status: 409 })
      if (await getIdByEmail(env, email)) return json(req, { error:'email exists' }, { status: 409 })

      const userNumber = await nextUserNumber(env)
      const role: Role = userNumber === 1 ? 'developer' : 'newbie'

      const id = crypto.randomUUID()
      const salt = randB64(16)
      const passwordHash = await pbkdf2(String(password), salt)
      const user: UserFull = {
        id, username, email, passwordHash, salt,
        userNumber, role, createdAt: new Date().toISOString()
      }
      await putUserKV(env, user)
      try { const norm = (req as any)._normInvite as string|undefined; if (norm) await markInviteUsed(env, norm, id) } catch {}
      const token = await createSession(env, id)
      const { passwordHash: _1, salt: _2, ...pub } = user
      return json(req, { token, user: pub })
    }

    // POST /login
    if (sub === '/login' && method === 'POST') {
      const { usernameOrEmail, password='1234' } = await req.json().catch(()=> ({}))
      let id = await getIdByUsername(env, String(usernameOrEmail||''))
      if (!id) id = await getIdByEmail(env, String(usernameOrEmail||''))
      if (!id) return json(req, { error:'not found' }, { status: 401 })
      const u = await getUserByIdKV(env, id)
      if (!u) return json(req, { error:'not found' }, { status: 401 })
      const ok = (await pbkdf2(String(password), u.salt)) === u.passwordHash
      if (!ok) return json(req, { error:'bad credentials' }, { status: 401 })
      const token = await createSession(env, u.id)
      const { passwordHash: _1, salt: _2, ...pub } = u
      return json(req, { token, user: pub })
    }

    // GET /me
    if (sub === '/me' && method === 'GET') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const u = await getUserByIdKV(env, s.userId)
      if (!u) return json(req, { error:'unauthorized' }, { status: 401 })
      const { passwordHash: _1, salt: _2, ...pub } = u
      return json(req, { user: pub })
    }

    // GET /users (admin/dev)
    if (sub === '/users' && method === 'GET') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
      const users = await listUsersKV(env)
      return json(req, { users })
    }

    // PATCH /users/:id/role (admin/dev)
    const m = sub.match(/^\/users\/([^/]+)\/role$/)
    if (m && method === 'PATCH') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
      const id = m[1]
      const body = await req.json().catch(()=> ({}))
      const role = String(body.role || '')
      if (!['developer','admin','moderator','vip','user','newbie'].includes(role)) return json(req, { error:'bad role' }, { status: 400 })
      const u = await getUserByIdKV(env, id)
      if (!u) return json(req, { error:'not found' }, { status: 404 })
      u.role = role as Role
      await putUserKV(env, u)
      const { passwordHash: _1, salt: _2, ...pub } = u
      return json(req, { user: pub })
    }

    /* ---------- Forum: sections/topics/posts ---------- */

    // GET /sections
    if (sub === '/sections' && method === 'GET') {
      const sections = await listSectionsKV(env)
      return json(req, { sections })
    }
    // POST /sections (admin/dev)
    if (sub === '/sections' && method === 'POST') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
      const body = await req.json().catch(()=> ({}))
      const title = String(body.title||'').trim(); if (!title) return json(req, { error:'bad title' }, { status: 400 })
      const list = await listSectionsKV(env); const now = new Date().toISOString()
      const sec: Section = { id: crypto.randomUUID(), title, description: String(body.description||'').trim()||undefined, icon: typeof body.icon==='string'?body.icon:undefined, createdAt: now, order: list.length+1, moderatorIds: [], topicCount: 0, postCount: 0 }
      await putSectionKV(env, sec)
      return json(req, { section: sec })
    }
    // PATCH /sections/:id (admin/dev)
    {
      const mSec = sub.match(/^\/sections\/([^/]+)$/)
      if (mSec && method === 'PATCH') {
        const s = await readSession(env, req)
        if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
        const me = await getUserByIdKV(env, s.userId)
        if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
        const id = mSec[1]
        const sec = await getSectionKV(env, id)
        if (!sec) return json(req, { error:'not found' }, { status: 404 })
        const body = await req.json().catch(()=> ({}))
        if (typeof body.title==='string') sec.title = body.title
        if (typeof body.description==='string') sec.description = body.description
        await putSectionKV(env, sec)
        return json(req, { section: sec })
      }
    }

    // GET /topics?sectionId=
    if (sub.startsWith('/topics') && method === 'GET') {
      const u = new URL(req.url)
      const sectionId = u.searchParams.get('sectionId') || undefined
      const topics = await listTopicsKV(env, sectionId || undefined)
      return json(req, { topics })
    }
    // POST /topics (auth)
    if (sub === '/topics' && method === 'POST') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me) return json(req, { error:'unauthorized' }, { status: 401 })
      const body = await req.json().catch(()=> ({}))
      const sectionId = String(body.sectionId||'')
      const sec = await getSectionKV(env, sectionId)
      if (!sec) return json(req, { error:'bad section' }, { status: 400 })
      const title = String(body.title||'').trim(); if (!title) return json(req, { error:'bad title' }, { status: 400 })
      const now = new Date().toISOString()
      const top: Topic = { id: crypto.randomUUID(), sectionId, title, authorId: me.id, createdAt: now, updatedAt: now, pinned: false, locked: false, viewCount: 0, replyCount: 0, lastPostAt: now, lastPostBy: me.id }
      await putTopicKV(env, top)
      sec.topicCount += 1; await putSectionKV(env, sec)
      if (typeof body.content==='string' && body.content.trim()) {
        const p: Post = { id: crypto.randomUUID(), topicId: top.id, authorId: me.id, content: String(body.content), createdAt: now }
        await putPostKV(env, p)
        top.replyCount = 1; top.lastPostAt = now; top.lastPostBy = me.id; await putTopicKV(env, top)
        sec.postCount += 1; await putSectionKV(env, sec)
      }
      return json(req, { topic: top })
    }
    // PATCH /topics/:id (pin/lock/title)
    {
      const mt = sub.match(/^\/topics\/([^/]+)$/)
      if (mt && method === 'PATCH') {
        const s = await readSession(env, req)
        if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
        const me = await getUserByIdKV(env, s.userId)
        if (!me) return json(req, { error:'unauthorized' }, { status: 401 })
        const id = mt[1]
        const raw = await env.AUTH_KV!.get(F_TOP(id))
        if (!raw) return json(req, { error:'not found' }, { status: 404 })
        const top = JSON.parse(raw) as Topic
        const body = await req.json().catch(()=> ({}))
        if (typeof body.title==='string') top.title = body.title
        if (typeof body.pinned==='boolean') top.pinned = body.pinned
        if (typeof body.locked==='boolean') top.locked = body.locked
        top.updatedAt = new Date().toISOString()
        await putTopicKV(env, top)
        return json(req, { topic: top })
      }
    }
    // POST /topics/:id/move
    {
      const mm = sub.match(/^\/topics\/([^/]+)\/move$/)
      if (mm && method === 'POST') {
        const s = await readSession(env, req)
        if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
        const id = mm[1]
        const topRaw = await env.AUTH_KV!.get(F_TOP(id)); if (!topRaw) return json(req,{error:'not found'},{status:404})
        const top = JSON.parse(topRaw) as Topic
        const body = await req.json().catch(()=> ({}))
        const to = String(body.to || body.toSectionId || '')
        const toS = await getSectionKV(env, to); if (!toS) return json(req,{error:'bad section'},{status:400})
        const fromS = await getSectionKV(env, top.sectionId)
        await env.AUTH_KV!.delete(IDX_T_S(top.sectionId, top.id))
        top.sectionId = to; top.updatedAt = new Date().toISOString(); await putTopicKV(env, top)
        if (fromS) { fromS.topicCount = Math.max(0, fromS.topicCount-1); await putSectionKV(env, fromS) }
        toS.topicCount += 1; await putSectionKV(env, toS)
        return json(req, { topic: top })
      }
    }

    // GET /posts?topicId=
    if (sub.startsWith('/posts') && method === 'GET') {
      const u = new URL(req.url); const topicId = u.searchParams.get('topicId') || ''
      const posts = await listPostsKV(env, topicId)
      return json(req, { posts })
    }
    // POST /posts (auth)
    if (sub === '/posts' && method === 'POST') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me) return json(req, { error:'unauthorized' }, { status: 401 })
      const body = await req.json().catch(()=> ({}))
      const topicId = String(body.topicId || '')
      const topRaw = await env.AUTH_KV!.get(F_TOP(topicId)); if (!topRaw) return json(req,{error:'bad topic'},{status:400})
      const top = JSON.parse(topRaw) as Topic
      if (top.locked) return json(req, { error:'locked' }, { status: 403 })
      const text = String(body.content || '').trim(); if (!text) return json(req,{error:'bad content'},{status:400})
      const now = new Date().toISOString(); const post: Post = { id: crypto.randomUUID(), topicId, authorId: me.id, content: text, createdAt: now }
      await putPostKV(env, post)
      top.replyCount += 1; top.updatedAt = now; top.lastPostAt = now; top.lastPostBy = me.id; await putTopicKV(env, top)
      const sec = await getSectionKV(env, top.sectionId); if (sec) { sec.postCount += 1; await putSectionKV(env, sec) }
      return json(req, { post })
    }
    // GET /latest-posts
    if (sub === '/latest-posts' && method === 'GET') {
      const topics = await listTopicsKV(env)
      const all: Post[] = []
      for (const t of topics) { const p = await listPostsKV(env, t.id, 50); for (const it of p) all.push(it) }
      const limit = Math.min(50, Math.max(1, parseInt(new URL(req.url).searchParams.get('limit') || '8', 10)))
      all.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return json(req, { posts: all.slice(0, limit) })
    }

    // GET /invites (admin/dev)
    if (sub === '/invites' && method === 'GET') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
      const invites = await listInvitesKV(env)
      return json(req, { invites })
    }

    // POST /invites (admin/dev)
    if (sub === '/invites' && method === 'POST') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
      const body = await req.json().catch(()=> ({}))
      const n = Math.max(1, Math.min(20, Math.floor(Number(body.count)||1)))
      const note = body.note ? String(body.note).slice(0,200) : undefined
      const exist = new Set((await listInvitesKV(env)).map(i=>i.code))
      const created: any[] = []
      let attempts = 0
      while (created.length < n && attempts < n*15) {
        const code = normalizeInvite(randomInvite(16))
        attempts++
        if (exist.has(code)) continue
        const inv = { code, createdAt: new Date().toISOString(), createdBy: me.id, note, usedBy: null, usedAt: null }
        await putInvite(env, inv as any)
        created.push(inv)
        exist.add(code)
      }
      return json(req, { invites: created })
    }

    // POST /bootstrap (create/update Pavel); guarded by ?key=ADMIN_KEY
    if (sub === '/bootstrap' && method === 'POST') {
      const key = new URL(req.url).searchParams.get('key') || ''
      if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return json(req, { error:'unauthorized' }, { status: 401 })
      const { password='ChangeMe123!', email='pavel@forum.local' } = await req.json().catch(()=> ({}))
      const name = 'Pavel'
      let id = await getIdByUsername(env, name)
      if (id) {
        const u = await getUserByIdKV(env, id)
        if (!u) return json(req, { error:'not found' }, { status: 404 })
        const salt = randB64(16)
        const passwordHash = await pbkdf2(String(password), salt)
        u.salt = salt; u.passwordHash = passwordHash; u.role = 'developer'
        await putUserKV(env, u)
        const token = await createSession(env, u.id)
        const { passwordHash: _1, salt: _2, ...pub } = u
        return json(req, { user: pub, token })
      } else {
        const userNumber = await nextUserNumber(env)
        const newId = crypto.randomUUID()
        const salt = randB64(16)
        const passwordHash = await pbkdf2(String(password), salt)
        const u: UserFull = { id: newId, username: name, email, passwordHash, salt, userNumber, role: 'developer', createdAt: new Date().toISOString() }
        await putUserKV(env, u)
        const token = await createSession(env, u.id)
        const { passwordHash: _1, salt: _2, ...pub } = u
        return json(req, { user: pub, token })
      }
    }

    return json(req, { error:'not found' }, { status: 404 })
  } catch (e: any) {
    return json(req, { error: e?.message || 'internal' }, { status: 500 })
  }
}

/* ============================ ВОРКЕР ============================ */

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)

    // CORS preflight для всех маршрутов
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req) })

    // +++ ДОБАВЛЕНО: наш /skyapi/* (или другой префикс)
    const authResp = await handleAuthApi(req, env)
    if (authResp) return authResp

    /* ---------- ник-эпоха ---------- */
    if (req.method === 'GET' && url.pathname === '/nick-epoch') {
      const epoch = await readNickEpoch(env)
      return json(req, { epoch })
    }
    if (req.method === 'POST' && url.pathname === '/admin/nick-epoch/bump') {
      if (!adminAuthorized(req, env)) return text(req, 'Unauthorized', { status: 401 })
      const cur = await readNickEpoch(env)
      const next = cur + 1
      await writeNickEpoch(env, next)
      return json(req, { epoch: next })
    }
    if (req.method === 'POST' && url.pathname === '/admin/nick-epoch/set') {
      if (!adminAuthorized(req, env)) return text(req, 'Unauthorized', { status: 401 })
      const value = Math.max(1, Math.floor(parseInt(url.searchParams.get('value') || '1', 10) || 1))
      await writeNickEpoch(env, value)
      return text(req, 'ok')
    }

    /* ---------- скрытый логин админа ---------- */
    if (url.pathname === '/admin/login') {
      const key = url.searchParams.get('key') || ''
      if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return text(req, 'Unauthorized', { status: 401 })
      const token = await makeAdminToken(env)
      const headers = new Headers(corsHeaders(req))
      const cookie = [
        `chat_admin=${encodeURIComponent(token)}`,
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=None', // GitHub Pages → кросс-сайт
        'Max-Age=2592000'
      ].join('; ')
      headers.append('Set-Cookie', cookie)
      return new Response('ok', { status: 200, headers })
    }
    if (url.pathname === '/admin/logout') {
      const headers = new Headers(corsHeaders(req))
      headers.append('Set-Cookie', 'chat_admin=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0')
      return new Response('ok', { status: 200, headers })
    }

    /* ---------- WebSocket → напрямую в DO ---------- */
    if (url.pathname === '/chat') {
      if (req.headers.get('Upgrade') !== 'websocket') return text(req, 'Expected websocket', { status: 426 })
      const room = (url.searchParams.get('room') || 'global').slice(0, 64)
      const id = env.ROOM.idFromName(room)
      const stub = env.ROOM.get(id)
      return await stub.fetch(req) // DO сам создаёт пару
    }

    /* ---------- уведомления ---------- */
    if (req.method === 'GET' && url.pathname === '/api/notifications') {
      const feed = await readFeed(env)
      return json(req, feed)
    }

    if (req.method === 'POST' && url.pathname === '/admin/notifs/clear') {
      if (!adminAuthorized(req, env)) return text(req, 'Unauthorized', { status: 401 })
      await writeFeed(env, { items: [] })
      return text(req, 'ok')
    }
    if (req.method === 'POST' && url.pathname === '/admin/notifs/trim') {
      if (!adminAuthorized(req, env)) return text(req, 'Unauthorized', { status: 401 })
      const limit = Math.max(0, Math.min(1000, parseInt(url.searchParams.get('limit') || '0', 10) || 0))
      const feed = await readFeed(env)
      feed.items = limit ? (feed.items || []).slice(0, limit) : []
      await writeFeed(env, feed)
      return text(req, 'ok')
    }
    if (req.method === 'POST' && url.pathname === '/admin/notifs/delete') {
      if (!adminAuthorized(req, env)) return text(req, 'Unauthorized', { status: 401 })
      const id = url.searchParams.get('id') || ''
      if (!id) return text(req, 'Missing id', { status: 400 })
      const feed = await readFeed(env)
      feed.items = (feed.items || []).filter(x => x.id !== id)
      await writeFeed(env, feed)
      return text(req, 'ok')
    }
    if (req.method === 'POST' && url.pathname === '/tg-notify') {
      const secret = env.NOTIFY_SECRET || ''
      const provided = url.searchParams.get('secret') || ''
      const headerToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token') || ''
      const authorized = !!secret && (provided === secret || headerToken === secret)
      if (!authorized) return text(req, 'Unauthorized', { status: 401 })
      try {
        const body = await req.json().catch(() => ({}))
        const item = parseTelegramBody(body)
        if (!item) return text(req, 'ok')
        const feed = await readFeed(env)
        feed.items = [item, ...(feed.items || [])].slice(0, 100)
        await writeFeed(env, feed)
        return text(req, 'ok')
      } catch {
        return text(req, 'ok')
      }
    }

    return text(req, 'Not Found', { status: 404 })
  },
}

function adminAuthorized(req: Request, env: Env): boolean {
  const secret = env.NOTIFY_SECRET || ''
  const url = new URL(req.url)
  const provided = url.searchParams.get('secret') || ''
  const header = req.headers.get('x-admin-secret') || ''
  return !!secret && (provided === secret || header === secret)
}

/* ====================== Durable Object: ChatRoom ====================== */

export class ChatRoom {
  state: DurableObjectState
  env: Env
  sessions: Set<Session>

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
    this.sessions = new Set()
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Not Found', { status: 404 })
    }

    // создаём пару прямо здесь
    const pair = new WebSocketPair()
    // @ts-ignore
    const client = pair[0] as WebSocket
    // @ts-ignore
    const server = pair[1] as WebSocket

    // проверяем admin-cookie
    const cookie = request.headers.get('Cookie') || ''
    const adminToken = getCookie(cookie, 'chat_admin')
    const isAdmin = await checkAdminToken(this.env, adminToken)

    this.handleSession(server, isAdmin).catch((e) => console.error('handleSession error', e))
    return new Response(null, { status: 101, webSocket: client as any })
  }

  async handleSession(ws: WebSocket, isAdminInitial: boolean) {
    ws.accept()
    const session: Session = {
      ws,
      name: isAdminInitial ? 'Admin' : `Игрок${Math.floor(Math.random() * 900 + 100)}`,
      isAdmin: !!isAdminInitial,
      last: [],
    }
    this.sessions.add(session)
    console.log('do:open', { sessions: this.sessions.size, isAdmin: session.isAdmin })

    try {
      const history: ChatMessage[] = (await this.state.storage.get<ChatMessage[]>('history')) || []
      ws.send(JSON.stringify({ type: 'history', messages: history }))
      ws.send(JSON.stringify({ type: 'system', text: isAdminInitial ? 'admin-ok' : 'hello-ok' }))
    } catch (e) {
      console.error('do:history send failed', e)
    }

    this.broadcastPresence()

    const keepAlive = setInterval(() => {
      try { ws.send(JSON.stringify({ type: 'system', text: 'ping' })) } catch {}
    }, 30_000)

    ws.addEventListener('message', (ev) => this.onMessage(session, ev.data))
    const cleanup = () => {
      clearInterval(keepAlive)
      this.sessions.delete(session)
      console.log('do:close', { sessions: this.sessions.size })
      this.broadcastPresence()
    }
    ws.addEventListener('close', cleanup)
    ws.addEventListener('error', () => { try { ws.close() } catch {} cleanup() })
  }

  broadcastPresence() {
    if (!this.sessions.size) return
    const seen = new Set<string>()
    const names: string[] = []
    for (const sess of this.sessions) {
      const name = (sess.isAdmin ? 'Admin' : sess.name || '').trim()
      if (!name) continue
      const key = name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      names.push(name)
    }
    names.sort((a, b) => a.localeCompare(b, 'ru'))

    const payload = JSON.stringify({ type: 'system', text: 'presence', count: this.sessions.size, names })
    for (const sess of this.sessions) {
      try {
        sess.ws.send(payload)
      } catch (err) {
        console.warn('do:presence send failed', err)
        try { sess.ws.close() } catch {}
      }
    }
  }

  async onMessage(session: Session, data: any) {
    const now = Date.now()
    session.last.push(now)
    while (session.last.length && now - session.last[0] > 10_000) session.last.shift()
    if (session.last.length > 25) { try { session.ws.close(1011, 'rate') } catch {} return }

    let parsed: any
    try {
      parsed = JSON.parse(typeof data === 'string' ? data : new TextDecoder().decode(data))
    } catch (e) {
      console.warn('do:bad payload', e)
      return
    }

    const type = parsed?.type
    if (type === 'hello') {
      const rawName: string = (parsed.name || '').toString()
      const clean = this.cleanName(rawName)
      const desired = session.isAdmin ? 'Admin' : (clean.toLowerCase() === 'admin' ? 'Игрок' : clean)
      const unique = session.isAdmin ? 'Admin' : this.uniqueName(desired, session)

      session.name = unique
      try {
        session.ws.send(JSON.stringify({
          type: 'system',
          text: session.isAdmin ? 'admin-ok' : 'hello-ok',
          name: session.name, // итоговое имя
        }))
      } catch {}
      this.broadcastPresence()
      return
    }

    if (type === 'message') {
      const textMsg: string = (parsed.text || '').toString().trim().slice(0, 800)
      if (!textMsg) return
      const cid: string | undefined =
        typeof parsed.cid === 'string' ? parsed.cid.slice(0, 64) : undefined

      const msg: ChatMessage = { id: uid(), author: session.isAdmin ? 'Admin' : session.name, text: textMsg, ts: Date.now() }
      console.log('do:msg', { author: msg.author, text: msg.text })
      await this.appendAndBroadcast(msg, cid)
      return
    }

    if (type === 'delete' && session.isAdmin) {
      const id = (parsed.id || '').toString()
      await this.deleteAndBroadcast(id)
      return
    }

    if (type === 'edit' && session.isAdmin) {
      const id = (parsed.id || '').toString()
      const textMsg = (parsed.text || '').toString().trim().slice(0, 800)
      await this.editAndBroadcast(id, textMsg)
      return
    }
  }

  cleanName(raw: string) {
    const trimmed = raw.trim().slice(0, 24) || `Игрок${Math.floor(Math.random() * 900 + 100)}`
    return trimmed.replace(/[^\p{L}\p{N}_ -]+/gu, '')
  }

  /** делает имя уникальным среди текущих сессий в комнате */
  uniqueName(base: string, me: Session): string {
    const taken = new Set<string>()
    for (const s of this.sessions) {
      if (s !== me) taken.add((s.name || '').toLowerCase())
    }
    if (!taken.has(base.toLowerCase())) return base

    for (let i = 2; i <= 99; i++) {
      const candidate = `${base} ·${i}`
      if (!taken.has(candidate.toLowerCase())) return candidate
    }
    return `${base} ·${Math.floor(Math.random() * 900 + 100)}`
  }

  async appendAndBroadcast(msg: ChatMessage, cid?: string) {
    await this.state.blockConcurrencyWhile(async () => {
      const history: ChatMessage[] = (await this.state.storage.get<ChatMessage[]>('history')) || []
      history.push(msg)
      while (history.length > 200) history.shift()
      await this.state.storage.put('history', history)
      console.log('do:stored', { count: history.length })
    })
    this.broadcast(JSON.stringify({ type: 'message', message: msg, cid }))
  }

  async deleteAndBroadcast(id: string) {
    await this.state.blockConcurrencyWhile(async () => {
      const history: ChatMessage[] = (await this.state.storage.get<ChatMessage[]>('history')) || []
      const next = history.filter((m) => m.id !== id)
      await this.state.storage.put('history', next)
    })
    this.broadcast(JSON.stringify({ type: 'delete', id }))
  }

  async editAndBroadcast(id: string, text: string) {
    await this.state.blockConcurrencyWhile(async () => {
      const history: ChatMessage[] = (await this.state.storage.get<ChatMessage[]>('history')) || []
      const next = history.map((m) => (m.id === id ? { ...m, text } : m))
      await this.state.storage.put('history', next)
    })
    this.broadcast(JSON.stringify({ type: 'edit', id, text }))
  }

  broadcast(payload: string) {
    let ok = 0
    for (const s of this.sessions) { try { s.ws.send(payload); ok++ } catch {} }
    console.log('do:broadcast', { to: ok })
  }
}

