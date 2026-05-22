const fs = require('fs');
const file = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(file, 'utf8');

function save(){ fs.writeFileSync(file, s, 'utf8'); console.log('worker.ts updated'); }

function ensureUserFields() {
  const anchor = 'userNumber: number; role: Role; createdAt: string;';
  if (s.includes('invitedById')) return;
  s = s.replace(anchor, `${anchor}\n  invitedById?: string | null; invitedByName?: string | null;`);
}

function patchRegisterInviteAttribution() {
  const marker = "// POST /register";
  const idx = s.indexOf(marker);
  if (idx === -1) return;
  // After user object creation, before putUserKV, set invitedById/Name if _normInvite present
  s = s.replace(
    /const user: UserFull = \{([\s\S]*?)\};\s*\n\s*await putUserKV\(env, user\)/m,
    (m) => {
      if (m.includes('invitedById')) return m; // already
      return m.replace('};', `,\n        invitedById: null, invitedByName: null\n      };`).replace(
        'await putUserKV(env, user)',
        `try { const norm = (req as any)._normInvite as string|undefined; if (norm) { const _inv = await getInvite(env, norm); if (_inv) { const _creator = await getUserByIdKV(env, _inv.createdBy); if (_creator) { user.invitedById = _creator.id; user.invitedByName = _creator.username; } } } } catch {}
      await putUserKV(env, user)`
      );
    }
  );
}

function enrichInvitesList() {
  // GET /invites block
  s = s.replace(/if \(sub === '\/invites' && method === 'GET'\) \{([\s\S]*?)return json\(req, \{ invites \}\)\n\s*\}/m,
    (m, body) => {
      return `if (sub === '/invites' && method === 'GET') {\n      const s = await readSession(env, req)\n      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })\n      const me = await getUserByIdKV(env, s.userId)\n      if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })\n      const all = await listInvitesKV(env)\n      const visible = (me.role==='developer') ? all : all.filter(i => i.createdBy === me.id)\n      // attach creator names\n      const names = new Map();\n      try { const users = await listUsersKV(env); for (const u of users) names.set(u.id, u.username) } catch {}\n      const invites = visible.map(i => ({ ...i, createdByName: names.get(i.createdBy) || undefined }))\n      return json(req, { invites })\n    }`;
    }
  );
}

function patchInviteCreationLimits() {
  // Allow moderators to create; enforce limits
  s = s.replace(/if \(sub === '\/invites' && method === 'POST'\) \{([\s\S]*?)\n\s*return json\(req, \{ invites: created \}\)\n\s*\}/m,
    (m, inner) => {
      return `if (sub === '/invites' && method === 'POST') {\n      const s = await readSession(env, req)\n      if (!s) return json(req, { error:'unauthorized' }, { status: 401 })\n      const me = await getUserByIdKV(env, s.userId)\n      if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })\n      const body = await req.json().catch(()=> ({}))\n      const want = Math.max(1, Math.min(20, Math.floor(Number(body.count)||1)))\n      // rate limits: admin: 2 per 48h; moderator: 1 per 72h; developer: unlimited\n      let allowed = want\n      if (me.role==='admin') {\n        const since = Date.now() - 48*60*60*1000\n        const all = await listInvitesKV(env)\n        const recentMine = all.filter(i=> i.createdBy===me.id && new Date(i.createdAt).getTime()>=since).length\n        allowed = Math.max(0, Math.min(2 - recentMine, want))\n      } else if (me.role==='moderator') {\n        const since = Date.now() - 72*60*60*1000\n        const all = await listInvitesKV(env)\n        const recentMine = all.filter(i=> i.createdBy===me.id && new Date(i.createdAt).getTime()>=since).length\n        allowed = Math.max(0, Math.min(1 - recentMine, want))\n      }\n      if (allowed <= 0 && me.role!=='developer') return json(req, { error:'invite limit exceeded' }, { status: 429 })\n      const note = body.note ? String(body.note).slice(0,200) : undefined\n      const exist = new Set((await listInvitesKV(env)).map(i=>i.code))\n      const created: any[] = []\n      let attempts = 0\n      while (created.length < (me.role==='developer'? want : allowed) && attempts < want*15) {\n        const code = normalizeInvite(randomInvite(16))\n        attempts++\n        if (exist.has(code)) continue\n        const inv = { code, createdAt: new Date().toISOString(), createdBy: me.id, note, usedBy: null, usedAt: null }\n        await putInvite(env, inv as any)\n        created.push({ ...inv, createdByName: me.username })\n        exist.add(code)\n      }\n      return json(req, { invites: created })\n    }`;
    }
  );
}

ensureUserFields();
patchRegisterInviteAttribution();
enrichInvitesList();
patchInviteCreationLimits();
save();
