Cloudflare Worker: Telegram → Notifications feed

Overview
- Exposes two endpoints compatible with your current UI format:
  - `GET /api/notifications` → returns `{ items: Notif[] }`
  - `POST /tg-notify?secret=...` → accepts Telegram bot updates and prepends items.
- Uses Workers KV to store a single `feed.json` with up to 100 latest items.
- Adds CORS headers so your GitHub Pages build can fetch from anywhere.

Quick start
1) Install Wrangler CLI
   - `npm i -g wrangler` or `pnpm add -g wrangler` or `yarn global add wrangler`

2) Create a KV namespace
   - `wrangler kv:namespace create NOTIF_KV`
   - Copy the returned `id` and paste into `wrangler.toml` under `kv_namespaces`.

3) Configure secret
   - `wrangler secret put NOTIFY_SECRET`
   - Enter the same secret you’ll append in the webhook URL: `...?secret=YOUR_SECRET`.

4) Deploy
   - From this folder: `wrangler deploy`
   - You’ll get a URL like `https://<your-worker>.workers.dev`

5) Point your app and Telegram bot
   - In your app `.env` (at repo root):
     - `VITE_NOTIF_URL=https://<your-worker>.workers.dev/api/notifications`
  - Set Telegram webhook to:
     - `https://<your-worker>.workers.dev/tg-notify?secret=YOUR_SECRET`

Admin endpoints (cleanup)
- Protected by the same `NOTIFY_SECRET`. Pass it either as `?secret=...` or header `x-admin-secret: ...`.
- Clear all:
  - `POST https://<your-worker>.workers.dev/admin/notifs/clear?secret=YOUR_SECRET`
- Trim to N newest:
  - `POST https://<your-worker>.workers.dev/admin/notifs/trim?secret=YOUR_SECRET&limit=10`
- Delete by id:
  - `POST https://<your-worker>.workers.dev/admin/notifs/delete?secret=YOUR_SECRET&id=<ID>`

Tips
- Узнать `id` можно, открыв `GET /api/notifications` в браузере или через `curl` — это `update_id` из Telegram при добавлении.
- Для быстрой очистки тестового мусора чаще всего достаточно `trim` на 3–5 записей.

Notes
- The worker replicates the Netlify function’s mini-format for messages:
  - Optional first line: `[Title] (https://link)` then a blank line and body.
  - If present, `title` and `url` are extracted; body becomes the item text.
- Data model: `{ items: { id, title?, text, date?, url? }[] }`
- To change max items or key name, edit `src/worker.ts`.
