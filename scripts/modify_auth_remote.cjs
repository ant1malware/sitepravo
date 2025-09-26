const fs = require('fs');
const file = 'src/store/authRemote.ts';
let s = fs.readFileSync(file, 'utf8');

// 1) Extend RemoteUser
s = s.replace(/export type RemoteUser = \{([\s\S]*?)\n\};/m, (all, inner) => {
  if (inner.includes('bannedUntil')) return all;
  return all.replace('\
};', '\
  bannedUntil?: string | null;\
  mutedUntil?: string | null;\
};');
});

// 2) Insert moderation functions after setRole
if (!s.includes('export async function banUser')) {
  const needle = 'export async function setRole';
  const i = s.indexOf(needle);
  if (i !== -1) {
    // find end of setRole function (next "}\n\n")
    const endIdx = s.indexOf('\n}\n\n', i);
    const insertAt = endIdx + 3; // after the closing brace and one newline
    const block = `
// Moderation actions
export async function banUser(id: string, until?: string) {
  const body = until ? JSON.stringify({ until }) : JSON.stringify({ days: 7 });
  const { user } = await api('/users/' + encodeURIComponent(id) + '/ban', { method: 'POST', body });
  return user as RemoteUser;
}
export async function unbanUser(id: string) {
  const { user } = await api('/users/' + encodeURIComponent(id) + '/unban', { method: 'POST' });
  return user as RemoteUser;
}
export async function muteUser(id: string, until?: string) {
  const body = until ? JSON.stringify({ until }) : JSON.stringify({ minutes: 60 });
  const { user } = await api('/users/' + encodeURIComponent(id) + '/mute', { method: 'POST', body });
  return user as RemoteUser;
}
export async function unmuteUser(id: string) {
  const { user } = await api('/users/' + encodeURIComponent(id) + '/unmute', { method: 'POST' });
  return user as RemoteUser;
}
`;
    s = s.slice(0, insertAt) + block + s.slice(insertAt);
  }
}

fs.writeFileSync(file, s, 'utf8');
console.log('authRemote.ts modified');
