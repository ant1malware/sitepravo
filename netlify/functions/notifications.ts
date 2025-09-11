// Netlify Function: GET /api/notifications
// Stores and reads notifications from Netlify Blobs
import type { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const STORE = 'notifications'
const KEY = 'feed.json'

export const handler: Handler = async (event) => {
  // CORS
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  try {
    const store = getStore(STORE)
    const txt = (await store.get(KEY)) || '{"items":[]}'
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
      body: typeof txt === 'string' ? txt : txt.toString(),
    }
  } catch (e) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', ...cors }, body: '{"items":[]}' }
  }
}

