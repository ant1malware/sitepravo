const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');
const before = "if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })";
const after  = "if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })";
let changed = false;
const idx = s.indexOf("// GET /users (admin/dev)");
if (idx !== -1) {
  const sub = s.slice(idx, idx+400);
  if (sub.includes(before)) {
    s = s.replace(before, after);
    changed = true;
  }
}
if (changed) { fs.writeFileSync(file, s, 'utf8'); console.log('GET /users now allows moderators'); }
else { console.log('No change (pattern not found or already updated)'); }
