const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');
const start = s.indexOf("// DELETE /topics/:id (auth)");
if (start !== -1) {
  const a = s.indexOf("if (!me) return json(req, { error:'unauthorized' }, { status: 401 })", start);
  const b = s.indexOf("const id = m[1]", a);
  if (a !== -1 && b !== -1) {
    const before = s.slice(0, a + "if (!me) return json(req, { error:'unauthorized' }, { status: 401 })".length);
    const mid = "\n        if (!(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })\n        ";
    const after = s.slice(b);
    s = before + mid + after;
    fs.writeFileSync(file, s, 'utf8');
    console.log('DELETE /topics admin guard enforced and stray lines removed');
  } else {
    console.log('Markers not found for delete topics patch');
  }
}
