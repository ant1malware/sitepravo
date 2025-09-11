export interface Env {
  NOTIF_KV: KVNamespace
  NOTIFY_SECRET: string
}

type Notif = { id: string; title?: string; text: string; date?: string; url?: string }
type Feed = { items: Notif[] }

const KEY = 'feed.json'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json', ...CORS, ...(init.headers || {}) })
  return new Response(JSON.stringify(body), { ...init, headers })
}

function text(body: string, init: ResponseInit = {}) {
  const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8', ...CORS, ...(init.headers || {}) })
  return new Response(body, { ...init, headers })
}

async function readFeed(env: Env): Promise<Feed> {
  const raw = await env.NOTIF_KV.get(KEY)
  if (!raw) return { items: [] }
  try { return JSON.parse(raw) as Feed } catch { return { items: [] } }
}

async function writeFeed(env: Env, feed: Feed) {
  await env.NOTIF_KV.put(KEY, JSON.stringify(feed))
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

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

    // GET /api/notifications
    if (req.method === 'GET' && url.pathname === '/api/notifications') {
      const feed = await readFeed(env)
      return json(feed)
    }

    // Admin: secured helpers (use same NOTIFY_SECRET)
    const adminAuthorized = () => {
      const secret = env.NOTIFY_SECRET || ''
      const provided = url.searchParams.get('secret') || ''
      const header = req.headers.get('x-admin-secret') || ''
      return !!secret && (provided === secret || header === secret)
    }

    // POST /admin/notifs/clear?secret=...
    if (req.method === 'POST' && url.pathname === '/admin/notifs/clear') {
      if (!adminAuthorized()) return text('Unauthorized', { status: 401 })
      await writeFeed(env, { items: [] })
      return text('ok')
    }

    // POST /admin/notifs/trim?secret=...&limit=NN
    if (req.method === 'POST' && url.pathname === '/admin/notifs/trim') {
      if (!adminAuthorized()) return text('Unauthorized', { status: 401 })
      const limit = Math.max(0, Math.min(1000, parseInt(url.searchParams.get('limit') || '0', 10) || 0))
      const feed = await readFeed(env)
      feed.items = limit ? (feed.items || []).slice(0, limit) : []
      await writeFeed(env, feed)
      return text('ok')
    }

    // POST /admin/notifs/delete?secret=...&id=...
    if (req.method === 'POST' && url.pathname === '/admin/notifs/delete') {
      if (!adminAuthorized()) return text('Unauthorized', { status: 401 })
      const id = url.searchParams.get('id') || ''
      if (!id) return text('Missing id', { status: 400 })
      const feed = await readFeed(env)
      feed.items = (feed.items || []).filter((x) => x.id !== id)
      await writeFeed(env, feed)
      return text('ok')
    }

    // POST /tg-notify?secret=...
    if (req.method === 'POST' && url.pathname === '/tg-notify') {
      const secret = env.NOTIFY_SECRET || ''
      const provided = url.searchParams.get('secret') || ''
      const headerToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token') || ''
      const authorized = !!secret && (provided === secret || headerToken === secret)
      if (!authorized) return text('Unauthorized', { status: 401 })

      try {
        const body = await req.json().catch(() => ({}))
        const item = parseTelegramBody(body)
        if (!item) return text('ok')

        const feed = await readFeed(env)
        feed.items = [item, ...(feed.items || [])].slice(0, 100)
        await writeFeed(env, feed)
        return text('ok')
      } catch {
        return text('ok')
      }
    }

    return text('Not Found', { status: 404 })
  },
}
