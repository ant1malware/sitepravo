const fs = require('fs');
const file = 'src/store/authRemote.ts';
let s = fs.readFileSync(file, 'utf8');
// Extend Invite type with createdByName
s = s.replace(
  /export type Invite = \{([^}]*)\};/m,
  (all, inner) => {
    if (inner.includes('createdByName')) return all;
    return all.replace('};', '  createdByName?: string;\n};');
  }
);
// Extend RemoteUser with invitedById/Name
s = s.replace(
  /export type RemoteUser = \{([\s\S]*?)\n\};/m,
  (all) => {
    if (all.includes('invitedById')) return all;
    return all.replace('\n};', '\n  invitedById?: string | null;\n  invitedByName?: string | null;\n};');
  }
);
fs.writeFileSync(file, s, 'utf8');
console.log('authRemote Invite/RemoteUser extended');
