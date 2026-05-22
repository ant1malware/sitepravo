const fs = require('fs');
const file = 'src/AdminPanel2.tsx';
let s = fs.readFileSync(file, 'utf8');
// Add creator column in invites list
s = s.replace(
  /className=\"grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-\[[^\]]+\]\"/,
  'className="grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[160px_1fr_1fr_140px_1fr_auto]"'
);
// Insert creator name cell before note/used
s = s.replace(
  /<div className=\"text-xs opacity-70\">\s*created: \{new Date\(i\.createdAt\)\.toLocaleString\(\)\}\s*<\/div>\s*\n\s*<div className=\"text-xs\">\{i\.note \|\| \"\"\}<\/div>/,
  `<div className="text-xs opacity-70">created: {new Date(i.createdAt).toLocaleString()}</div>\n            <div className="text-xs opacity-80">by: {i.createdByName || i.createdBy?.slice(0,8)}</div>\n            <div className="text-xs">{i.note || ""}</div>`
);
fs.writeFileSync(file, s, 'utf8');
console.log('AdminPanel2 invites UI patched');
