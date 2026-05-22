const fs = require('fs');
const file = 'src/AdminPanel2.tsx';
let s = fs.readFileSync(file, 'utf8');

// Ensure forum imports present (already added above).

// Insert me/role/tabs after the tab state line
const marker = '>("users");';
if (s.includes(marker) && !s.includes('const tabs =')) {
  const insert = `
  const [me, setMe] = React.useState<any | null>(null);
  React.useEffect(() => { (async () => { try { setMe(await getSessionAccount()); } catch {} })(); }, []);
  const role = me?.role as string | undefined;
  const tabs = (role === 'developer' || role === 'admin')
    ? ['users','sections','topics','invites','maintenance']
    : (role === 'moderator' ? ['users','topics'] : ['topics']);
`;
  s = s.replace(marker, marker + insert);
}

// Replace static tabs mapping with dynamic tabs
s = s.replace(
  /(\{\()(\s*\["users",\s*"sections",\s*"topics",\s*"invites",\s*"maintenance"\]\s*as\s*const\s*)(\)\.map\(\(t\)\s*=>\s*\()/m,
  '{(tabs as string[]).map((t) => ('
);

fs.writeFileSync(file, s, 'utf8');
console.log('AdminPanel2: tabs & role state inserted');
