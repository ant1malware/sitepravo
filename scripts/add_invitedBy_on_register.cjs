const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');
const target = 'await putUserKV(env, user)';
if (s.includes(target) && !s.includes('user.invitedById')) {
  s = s.replace(target, `try { const norm = (req as any)._normInvite as string|undefined; if (norm) { const _inv = await getInvite(env, norm); if (_inv) { const _creator = await getUserByIdKV(env, _inv.createdBy); if (_creator) { user.invitedById = _creator.id; user.invitedByName = _creator.username; } } } } catch {}\n      ${target}`);
  fs.writeFileSync(file, s, 'utf8');
  console.log('invitedBy fields set during register');
} else {
  console.log('No change (already set or marker not found)');
}
