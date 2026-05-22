const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');

function insertAfter(hay, anchor, insert) {
  const idx = hay.indexOf(anchor);
  if (idx === -1) return hay;
  const pos = idx + anchor.length;
  return hay.slice(0, pos) + insert + hay.slice(pos);
}

// Topics: find "// POST /topics (auth)" block and after the line checking me, insert mute check
{
  const marker = "// POST /topics (auth)";
  const i = s.indexOf(marker);
  if (i !== -1) {
    const afterMeCheck = "if (!me) return json(req, { error:'unauthorized' }, { status: 401 })\n";
    const insert = "\n      { const _mu = me.mutedUntil ? Date.parse(me.mutedUntil) : 0; if (_mu && _mu > Date.now()) return json(req, { error:'muted' }, { status: 403 }) }\n";
    s = insertAfter(s, afterMeCheck, insert);
  }
}

// Posts: find "// POST /posts (auth)" similarly
{
  const marker = "// POST /posts (auth)";
  const i = s.indexOf(marker);
  if (i !== -1) {
    const afterMeCheck = "if (!me) return json(req, { error:'unauthorized' }, { status: 401 })\n";
    const insert = "\n      { const _mu = me.mutedUntil ? Date.parse(me.mutedUntil) : 0; if (_mu && _mu > Date.now()) return json(req, { error:'muted' }, { status: 403 }) }\n";
    s = insertAfter(s, afterMeCheck, insert);
  }
}

fs.writeFileSync(file, s, 'utf8');
console.log('mute checks inserted (best-effort)');
