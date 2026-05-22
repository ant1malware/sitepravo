const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');

// 1) Allow moderators to list users
s = s.replace(
  /if \(!s\) return json\(req, \{ error:'unauthorized' \}, \{ status: 401 \} \)\s*\n\s*const me = await getUserByIdKV\(env, s\.userId\)\s*\n\s*if \(!me \|\| \!\(me\.role==='admin'\|\|me\.role==='developer'\)\) return json\(req, \{ error:'forbidden' \}, \{ status: 403 \} \)\s*\n\s*const users = await listUsersKV\(env\)/,
  (m) => m.replace("!(me.role==='admin'||me.role==='developer')", "!((me.role==='admin'||me.role==='developer'||me.role==='moderator'))")
);

// 2) Restrict DELETE /topics to admin/dev and remove stray mute checks
{
  const startMarker = "// DELETE /topics/:id (auth)";
  const i = s.indexOf(startMarker);
  if (i !== -1) {
    const blockStart = s.indexOf('{', i);
    const blockEnd = s.indexOf('}', blockStart + 1);
    if (blockStart !== -1) {
      // Extract block content
      const endMatch = s.indexOf('\n    }', blockStart);
      const block = s.slice(blockStart, endMatch + 5);
      let fixed = block;
      // Insert admin check after me loaded
      fixed = fixed.replace(
        /const me = await getUserByIdKV\(env, s\.userId\)\s*\n\s*if \(!me\) return json\(req, \{ error:'unauthorized' \}, \{ status: 401 \} \)/,
        `$&\n        if (!(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })`
      );
      // Remove any muted check lines accidentally inserted
      fixed = fixed.replace(/\n\s*\{ const _mu [^}]+\}\n/g, '\n');
      s = s.slice(0, blockStart) + fixed + s.slice(endMatch + 5);
    }
  }
}

fs.writeFileSync(file, s, 'utf8');
console.log('worker.ts blocks fixed');
