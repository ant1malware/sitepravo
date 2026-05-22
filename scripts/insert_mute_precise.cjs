const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');

function addMuteAfterBlock(marker) {
  let i = s.indexOf(marker);
  if (i === -1) return;
  let j = s.indexOf("if (!me) return json(req, { error:'unauthorized' }, { status: 401 })", i);
  if (j === -1) return;
  const insertAt = j + "if (!me) return json(req, { error:'unauthorized' }, { status: 401 })".length;
  const line = "\n      { const _mu = (me.mutedUntil ? Date.parse(me.mutedUntil) : 0); if (_mu && _mu > Date.now()) return json(req, { error:'muted' }, { status: 403 }) }";
  s = s.slice(0, insertAt) + line + s.slice(insertAt);
}

addMuteAfterBlock("// POST /topics (auth)");
addMuteAfterBlock("// POST /posts (auth)");

fs.writeFileSync(file, s, 'utf8');
console.log('Inserted mute checks in topics/posts');
