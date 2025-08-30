// Netlify Function: Forwards lightweight telemetry events to Telegram
// Keep bot token and chat id in Netlify env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { statusCode: 500, body: 'Missing TELEGRAM env vars' };
  }

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const ip = event.headers['x-nf-client-connection-ip']
    || event.headers['x-forwarded-for']
    || 'unknown';
  const ua = event.headers['user-agent'] || '';
  const ref = event.headers['referer'] || payload.ref || '';

  // Build concise message (no parse_mode to avoid escaping)
  const now = new Date().toISOString();
  const evt = String(payload.event || 'event');
  const site = payload.site || (event.headers['host'] || '');
  const path = payload.path || '';
  const extra = payload.data ? JSON.stringify(payload.data).slice(0, 600) : '';

  const lines = [
    `SKY: ${evt}`,
    path ? `Path: ${path}` : null,
    ref ? `Ref: ${ref}` : null,
    site ? `Host: ${site}` : null,
    `IP: ${ip}`,
    ua ? `UA: ${ua}` : null,
    extra ? `Data: ${extra}` : null,
    `At: ${now}`,
  ].filter(Boolean);

  const text = lines.join('\n');

  const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    // Node 18+ has global fetch in Netlify
    const resp = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    if (!resp.ok) {
      const t = await resp.text();
      console.error('Telegram send failed', resp.status, t);
    }
  } catch (e) {
    console.error('Telegram send error', e);
  }

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify({ ok: true })
  };
};

