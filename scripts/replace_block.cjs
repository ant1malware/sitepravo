const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');

function replaceIfBlock(marker, newBlock) {
  const i = s.indexOf(marker);
  if (i === -1) return false;
  const start = s.indexOf('{', i);
  if (start === -1) return false;
  let depth = 0; let j = start;
  for (; j < s.length; j++) {
    const ch = s[j];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { j++; break; } }
  }
  s = s.slice(0, i) + newBlock + s.slice(j);
  return true;
}

const getBlock = `if (sub === '/invites' && method === 'GET') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })
      const all = await listInvitesKV(env)
      const visible = (me.role==='developer') ? all : all.filter(i => i.createdBy === me.id)
      const names = new Map<string, string>()
      try { const users = await listUsersKV(env); for (const u of users) names.set(u.id, (u as any).username) } catch {}
      const invites = visible.map(i => ({ ...i, createdByName: names.get(i.createdBy) || undefined }))
      return json(req, { invites })
    }`;

const postBlock = `if (sub === '/invites' && method === 'POST') {
      const s = await readSession(env, req)
      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })
      const me = await getUserByIdKV(env, s.userId)
      if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })
      const body = await req.json().catch(()=> ({}))
      const want = Math.max(1, Math.min(20, Math.floor(Number(body.count)||1)))
      let allowed = want
      if (me.role==='admin') {
        const since = Date.now() - 48*60*60*1000
        const all = await listInvitesKV(env)
        const recentMine = all.filter(i=> i.createdBy===me.id && new Date(i.createdAt).getTime()>=since).length
        allowed = Math.max(0, Math.min(2 - recentMine, want))
      } else if (me.role==='moderator') {
        const since = Date.now() - 72*60*60*1000
        const all = await listInvitesKV(env)
        const recentMine = all.filter(i=> i.createdBy===me.id && new Date(i.createdAt).getTime()>=since).length
        allowed = Math.max(0, Math.min(1 - recentMine, want))
      }
      if (allowed <= 0 && me.role!=='developer') return json(req, { error:'invite limit exceeded' }, { status: 429 })
      const note = body.note ? String(body.note).slice(0,200) : undefined
      const exist = new Set((await listInvitesKV(env)).map(i=>i.code))
      const created: any[] = []
      let attempts = 0
      const target = (me.role==='developer') ? want : allowed
      while (created.length < target && attempts < want*15) {
        const code = normalizeInvite(randomInvite(16))
        attempts++
        if (exist.has(code)) continue
        const inv = { code, createdAt: new Date().toISOString(), createdBy: me.id, note, usedBy: null, usedAt: null }
        await putInvite(env, inv as any)
        created.push({ ...inv, createdByName: me.username })
        exist.add(code)
      }
      return json(req, { invites: created })
    }`;

const okGet = replaceIfBlock("if (sub === '/invites' && method === 'GET')", getBlock);
const okPost = replaceIfBlock("if (sub === '/invites' && method === 'POST')", postBlock);

fs.writeFileSync(file, s, 'utf8');
console.log('Replaced blocks: GET', okGet, 'POST', okPost);
