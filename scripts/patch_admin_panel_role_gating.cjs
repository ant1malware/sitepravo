const fs = require('fs');
const file = 'src/AdminPanel2.tsx';
let s = fs.readFileSync(file, 'utf8');
if (!s.includes('getSessionAccount')) {
  s = s.replace(
    "} from \"./store/authRemote\";",
    ",\n  getSessionAccount\n} from \"./store/authRemote\";"
  );
}
// Add me role state and allowed tabs
if (!s.includes('const [me, setMe]')) {
  s = s.replace(
    /export default function AdminPanel2\(\) \{\n  const \[tab, setTab\] =[^\n]+\n/,
    `export default function AdminPanel2() {\n  const [tab, setTab] = React.useState<\n    \"users\" | \"sections\" | \"topics\" | \"invites\" | \"maintenance\"\n  >(\"users\");\n  const [me, setMe] = React.useState<any | null>(null);\n  React.useEffect(() => { (async ()=> { try { setMe(await getSessionAccount()); } catch {} })(); }, []);\n  const role = me?.role as string | undefined;\n  const tabs = (role === 'developer' || role === 'admin') ? ['users','sections','topics','invites','maintenance'] : (role === 'moderator' ? ['users','topics'] : ['topics']);\n`
  );
}
// Replace tab buttons to use tabs variable
s = s.replace(
  /\[\"users\", \"sections\", \"topics\", \"invites\", \"maintenance\"\] as const\n        \)\.map\(\(t\) => \(/,
  'tabs as any).map((t: string) => ('
);
// UsersTab: accept meRole prop and hide actions by role
if (!s.includes('function UsersTab({ meRole }')) {
  s = s.replace('function UsersTab() {', 'function UsersTab({ meRole }: { meRole?: string }) {');
}
// Wire UsersTab prop
s = s.replace('{tab === "users" && <UsersTab />}', '{tab === "users" && <UsersTab meRole={role} />}');
// Hide role change and ban buttons for moderators in UsersTab render
if (!s.includes('/* role-gated */')) {
  s = s.replace(
    /<select\n\s*className=\"input\"[\s\S]*?<\/select>/,
    `{/* role-gated */}\n            {meRole==='admin'||meRole==='developer' ? (\n              <select\n                className=\"input\"\n                value={u.role}\n                onChange={(e) => changeRole(u.id, e.target.value as Role)}\n              >\n                <option value=\"developer\">developer</option>\n                <option value=\"admin\">admin</option>\n                <option value=\"moderator\">moderator</option>\n                <option value=\"vip\">vip</option>\n                <option value=\"user\">user</option>\n                <option value=\"newbie\">newbie</option>\n              </select>\n            ) : (\n              <div className=\"text-sm opacity-80\">{u.role}</div>\n            )}`
  );
  s = s.replace(
    /<div className=\"flex gap-2\">[\s\S]*?<\/div>/,
    `<div className=\"flex gap-2\">\n            {/* Moderators: mute/unmute only; Admin/Dev: ban/unban too */}\n            <button className=\"btn\" onClick={() => mute(u.id)}>Mute</button>\n            <button className=\"btn\" onClick={() => unmute(u.id)}>Unmute</button>\n            {(meRole==='admin'||meRole==='developer') && (<><button className=\"btn\" onClick={() => ban(u.id)}>Ban</button><button className=\"btn\" onClick={() => unban(u.id)}>Unban</button></>)}\n            </div>`
  );
}
// TopicsTab: pass role and hide Delete for non-admins
if (!s.includes('function TopicsTab({ meRole }')) {
  s = s.replace('function TopicsTab() {', 'function TopicsTab({ meRole }: { meRole?: string }) {');
  s = s.replace('{tab === "topics" && <TopicsTab />}', '{tab === "topics" && <TopicsTab meRole={role} />}');
}
if (!s.includes('/* delete role gate */')) {
  s = s.replace(
    /<button className=\"btn\" onClick=\{\(\) => remove\(t\.id\)\}>Delete<\/button>/,
    `{/* delete role gate */}\n              {(meRole==='admin'||meRole==='developer') && (<button className=\"btn\" onClick={() => remove(t.id)}>Delete</button>)}`
  );
}
// SectionsTab and InvitesTab visibility is gated by tabs list already; no further changes.
fs.writeFileSync(file, s, 'utf8');
console.log('AdminPanel2 role gating patched');
