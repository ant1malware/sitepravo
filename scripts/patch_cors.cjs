const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');
const before = "'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'";
const after = "'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'";
if (s.includes(before)) {
  s = s.replace(before, after);
  fs.writeFileSync(file, s, 'utf8');
  console.log('CORS methods updated');
} else if (!s.includes(after)) {
  console.log('CORS header not found, no change');
} else {
  console.log('CORS already updated');
}
