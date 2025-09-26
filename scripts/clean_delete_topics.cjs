const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');

const startTag = "// DELETE /topics/:id (auth)";
const si = s.indexOf(startTag);
if (si !== -1) {
  const blockStart = s.indexOf('{', si);
  let depth = 0, j = blockStart;
  for (; j < s.length; j++) {
    const ch = s[j];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { j++; break; } }
  }
  const block = s.slice(blockStart, j);
  let fixed = block;
  // insert admin check after the second line (after me check)
  fixed = fixed.replace(
    /(const me = await getUserByIdKV\(env, s\.userId\)\s*\n\s*if \(!me\) return json\(req, \{ error:'unauthorized' \}, \{ status: 401 \} \)\s*\n)/,
    "$1        if (!(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })\n"
  );
  // remove accidental mute lines within this block
  fixed = fixed.replace(/\n\s*\{ const _mu [^}]+\}\s*\n/g, '\n');
  s = s.slice(0, blockStart) + fixed + s.slice(j);
}
fs.writeFileSync(file, s, 'utf8');
console.log('DELETE /topics cleaned');
