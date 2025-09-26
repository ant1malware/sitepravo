const fs = require('fs');
const path = 'cloudflare/notifications-worker/src/worker.ts';
let s = fs.readFileSync(path, 'utf8');

function save() { fs.writeFileSync(path, s, 'utf8'); }

function ensureUserFullFields() {
  const anchor = 'userNumber: number; role: Role; createdAt: string;';
  if (s.includes('bannedUntil') || s.includes('mutedUntil')) return;
  s = s.replace(anchor, `${anchor}\n  // moderation flags\n  bannedUntil?: string | null;\n  mutedUntil?: string | null;`);
}

function addDefaultsInUserCreation() {
  // in /register user creation
  s = s.replace(/const user: UserFull = \{([\s\S]*?)\}/m, (m) => {
    if (m.includes('bannedUntil')) return m;
    return m.replace(/\}\s*$/, ",\n        bannedUntil: null, mutedUntil: null\n      }" );
  });
  // in bootstrap Pavel creation
  s = s.replace(/const u: UserFull = \{([\s\S]*?)\}/m, (m) => {
    if (m.includes('bannedUntil')) return m;
    return m.replace(/\}\s*$/, ",\n        bannedUntil: null, mutedUntil: null\n      }" );
  });
}

function addLoginBanCheck() {
  const marker = 'const u = await getUserByIdKV(env, id)';
  if (!s.includes(marker)) return;
  const injectAfter = 'const ok = (await pbkdf2(String(password), u.salt)) === u.passwordHash';
  if (s.includes("error:'banned'")) return;
  s = s.replace(injectAfter, `${injectAfter}\n      const banUntil = u.bannedUntil ? Date.parse(u.bannedUntil as any) : 0;\n      if (banUntil && banUntil > Date.now()) return json(req, { error:'banned' }, { status: 403 })`);
}

function addMuteChecks() {
  // in createTopic
  s = s.replace(/if \(!me\) return json\(req, \{ error:'unauthorized' \}, \{ status: 401 \} \)\n\s*const body = await req.json\(\)\.catch\(\(\)=> \(\{\}\)\)/m,
    (m)=> {
      if (m.includes('mutedUntil')) return m;
      return m.replace(/const body[\s\S]*/, `const mu = (me.mutedUntil ? Date.parse(me.mutedUntil as any) : 0);\n      if (mu && mu > Date.now()) return json(req, { error:'muted' }, { status: 403 })\n      const body = await req.json().catch(()=> ({}))`);
    }
  );
  // in createPost
  s = s.replace(/if \(!me\) return json\(req, \{ error:'unauthorized' \}, \{ status: 401 \} \)\n\s*const body = await req.json\(\)\.catch\(\(\)=> \(\{\}\)\)/m,
    (m, idx) => {
      // The first occurrence (topics) already handled; allow second as posts
      return m.includes('mutedUntil') ? m : m.replace(/const body[\s\S]*/, `const mu = (me.mutedUntil ? Date.parse(me.mutedUntil as any) : 0);\n      if (mu && mu > Date.now()) return json(req, { error:'muted' }, { status: 403 })\n      const body = await req.json().catch(()=> ({}))`);
    }
  );
}

function restrictDeleteTopicToAdmins() {
  s = s.replace(/if \(!me\) return json\(req, \{ error:'unauthorized' \}, \{ status: 401 \} \)\n\s*const id = m\[1\]/m,
    (m)=> `${m}\n        if (!(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })`
  );
}

function allowModeratorsListUsers() {
  s = s.replace(/if \(!me \|\| \!\(me\.role==='admin'\|\|me\.role==='developer'\)\) return json\(req, \{ error:'forbidden' \}, \{ status: 403 \} \)/,
    `if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })`
  );
}

function addModerationEndpoints() {
  if (s.includes('/ban') && s.includes('/mute')) return; // simple guard
  const baseMarker = '\n    // GET /invites (admin/dev)';
  const idx = s.indexOf(baseMarker);
  if (idx === -1) return;
  const block = `
    // POST /users/:id/ban (admin/dev)
    {
      const mBan = sub.match(^/users/([^/]+)/ban$);
    }
  `;
  // We'll inject full endpoints before invites section with real code
  const endpoints = `
    // POST /users/:id/ban (admin/dev)
    {
      const mm = sub.match(/^\\/users\\/([^/]+)\\/ban$/)
      if (mm && method === 'POST') {
        const sss = await readSession(env, req)
        if (!sss) return json(req, { error:'unauthorized' }, { status: 401 })
        const me = await getUserByIdKV(env, sss.userId)
        if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
        const id = mm[1]
        const u = await getUserByIdKV(env, id)
        if (!u) return json(req, { error:'not found' }, { status: 404 })
        const body = await req.json().catch(()=> ({}))
        let until: string | null = null
        if (typeof body.until === 'string' && body.until) until = body.until
        else if (typeof body.days === 'number' && isFinite(body.days)) until = new Date(Date.now() + Math.max(1, Math.floor(body.days)) * 86400000).toISOString()
        else until = new Date(Date.now() + 7 * 86400000).toISOString()
        u.bannedUntil = until
        await putUserKV(env, u)
        const { passwordHash: _1, salt: _2, ...pub } = u
        return json(req, { user: pub })
      }
    }
    // POST /users/:id/unban (admin/dev)
    {
      const mm = sub.match(/^\\/users\\/([^/]+)\\/unban$/)
      if (mm && method === 'POST') {
        const sss = await readSession(env, req)
        if (!sss) return json(req, { error:'unauthorized' }, { status: 401 })
        const me = await getUserByIdKV(env, sss.userId)
        if (!me || !(me.role==='admin'||me.role==='developer')) return json(req, { error:'forbidden' }, { status: 403 })
        const id = mm[1]
        const u = await getUserByIdKV(env, id)
        if (!u) return json(req, { error:'not found' }, { status: 404 })
        u.bannedUntil = null
        await putUserKV(env, u)
        const { passwordHash: _1, salt: _2, ...pub } = u
        return json(req, { user: pub })
      }
    }
    // POST /users/:id/mute (admin/dev/moderator)
    {
      const mm = sub.match(/^\\/users\\/([^/]+)\\/mute$/)
      if (mm && method === 'POST') {
        const sss = await readSession(env, req)
        if (!sss) return json(req, { error:'unauthorized' }, { status: 401 })
        const me = await getUserByIdKV(env, sss.userId)
        if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })
        const id = mm[1]
        const u = await getUserByIdKV(env, id)
        if (!u) return json(req, { error:'not found' }, { status: 404 })
        const body = await req.json().catch(()=> ({}))
        let until: string | null = null
        if (typeof body.until === 'string' && body.until) until = body.until
        else if (typeof body.minutes === 'number' && isFinite(body.minutes)) until = new Date(Date.now() + Math.max(1, Math.floor(body.minutes)) * 60000).toISOString()
        else until = new Date(Date.now() + 60 * 60000).toISOString()
        u.mutedUntil = until
        await putUserKV(env, u)
        const { passwordHash: _1, salt: _2, ...pub } = u
        return json(req, { user: pub })
      }
    }
    // POST /users/:id/unmute (admin/dev/moderator)
    {
      const mm = sub.match(/^\\/users\\/([^/]+)\\/unmute$/)
      if (mm && method === 'POST') {
        const sss = await readSession(env, req)
        if (!sss) return json(req, { error:'unauthorized' }, { status: 401 })
        const me = await getUserByIdKV(env, sss.userId)
        if (!me || !((me.role==='admin'||me.role==='developer'||me.role==='moderator'))) return json(req, { error:'forbidden' }, { status: 403 })
        const id = mm[1]
        const u = await getUserByIdKV(env, id)
        if (!u) return json(req, { error:'not found' }, { status: 404 })
        u.mutedUntil = null
        await putUserKV(env, u)
        const { passwordHash: _1, salt: _2, ...pub } = u
        return json(req, { user: pub })
      }
    }
`;
  s = s.replace(baseMarker, `${endpoints}\n${baseMarker}`);
}

ensureUserFullFields();
addDefaultsInUserCreation();
addLoginBanCheck();
addMuteChecks();
restrictDeleteTopicToAdmins();
allowModeratorsListUsers();
addModerationEndpoints();

save();
console.log('worker.ts modified');
