export interface Env {
  // уведомления
  NOTIF_KV: KVNamespace
  NOTIFY_SECRET: string

  // чат
  ROOM: DurableObjectNamespace
  ADMIN_KEY: string
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
    'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Bot-Api-Secret-Token, x-admin-secret',
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

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req) })

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
    const payload = JSON.stringify({ type: 'system', text: 'presence', count: this.sessions.size })
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
      return
    }

    if (type === 'message') {
      const text: string = (parsed.text || '').toString().trim().slice(0, 800)
      if (!text) return
      const cid: string | undefined =
        typeof parsed.cid === 'string' ? parsed.cid.slice(0, 64) : undefined

      const msg: ChatMessage = { id: uid(), author: session.isAdmin ? 'Admin' : session.name, text, ts: Date.now() }
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
      const text = (parsed.text || '').toString().trim().slice(0, 800)
      await this.editAndBroadcast(id, text)
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
