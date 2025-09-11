// Netlify Function: Telegram webhook receiver
// Set webhook to: https://<your-site>/.netlify/functions/tg-notify?secret=YOUR_SECRET
// Env: NOTIFY_SECRET=YOUR_SECRET
// Writes to Netlify Blobs store consumed by /api/notifications
import type { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const STORE = 'notifications'
const KEY = 'feed.json'

type Feed = { items: { id: string; title?: string; text: string; date?: string; url?: string }[] }

export const handler: Handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' }

  const secret = process.env.NOTIFY_SECRET || ''
  const q = event.queryStringParameters || {}
  if (!secret || q.secret !== secret) return { statusCode: 401, headers: cors, body: 'Unauthorized' }

  try {
    const update = JSON.parse(event.body || '{}')
    const msg = update?.message || update?.edited_message
    const text: string = msg?.text || ''
    if (!text) return { statusCode: 200, headers: cors, body: 'ok' }

    // Parse optional mini-format: [title]| [url] \n text
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

    const store = getStore(STORE)
    const raw = (await store.get(KEY)) || '{"items":[]}'
    const feed: Feed = typeof raw === 'string' ? JSON.parse(raw) : JSON.parse(raw.toString())
    const id = String(update.update_id || Date.now())
    const item = { id, title, text: bodyText, date: new Date().toISOString(), url }
    feed.items = [item, ...(feed.items || [])].slice(0, 100)
    await store.set(KEY, JSON.stringify(feed))
    return { statusCode: 200, headers: cors, body: 'ok' }
  } catch (e) {
    return { statusCode: 200, headers: cors, body: 'ok' }
  }
}

