const fs = require('fs');
const file = 'src/store/authRemote.ts';
let s = fs.readFileSync(file, 'utf8');

// Extend RemoteUser type with moderation fields if not present
s = s.replace(/export type RemoteUser = \{([\s\S]*?)\n\};/m, (m) => {
  if (m.includes('bannedUntil')) return m;
  return m.replace(/\n\};/, "\n  bannedUntil?: string | null;\n  mutedUntil?: string | null;\n};");
});

// Add functions for ban/mute endpoints after setRole
if (!s.includes('export async function banUser')) {
  s = s.replace(
    /export async function setRole\([\s\S]*?\}\n\r?\n/, 
    `$&
// Moderation actions
export async function banUser(id: string, until?: string) {
  const body = until ? JSON.stringify({ until }) : JSON.stringify({ days: 7 });
  const { user } = await api(`/users/${id}/ban`, { method: 'POST', body });
  return user as RemoteUser;
}
export async function unbanUser(id: string) {
  const { user } = await api(`/users/${id}/unban`, { method: 'POST' });
  return user as RemoteUser;
}
export async function muteUser(id: string, until?: string) {
  const body = until ? JSON.stringify({ until }) : JSON.stringify({ minutes: 60 });
  const { user } = await api(`/users/${id}/mute`, { method: 'POST', body });
  return user as RemoteUser;
}
export async function unmuteUser(id: string) {
  const { user } = await api(`/users/${id}/unmute`, { method: 'POST' });
  return user as RemoteUser;
}
`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('authRemote.ts patched');
