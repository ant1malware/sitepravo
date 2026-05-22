const fs = require('fs');
const file = 'src/AdminPanel2.tsx';
let s = fs.readFileSync(file, 'utf8');
// After email cell, insert invitedBy badge
s = s.replace(
  /<div className=\"text-sm opacity-80 truncate\">\{u\.email\}<\/div>/,
  `<div className="text-sm opacity-80 truncate">{u.email}</div>
            <div className="text-xs opacity-70">{u.invitedByName ? ('invited by: ' + u.invitedByName) : ''}</div>`
);
fs.writeFileSync(file, s, 'utf8');
console.log('UsersTab shows invitedBy');
