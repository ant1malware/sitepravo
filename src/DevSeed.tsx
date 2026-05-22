import React from 'react';
import { Link } from 'react-router-dom';
import { getSessionAccount } from './store/authRemote';
import { seedForum } from './tools/seedForum';

export default function DevSeed() {
  const [me, setMe] = React.useState<any>(null);
  const [done, setDone] = React.useState<boolean>(() => { try { return localStorage.getItem('seed:done') === '1'; } catch { return false; } });
  const [log, setLog] = React.useState<string>('');
  React.useEffect(() => { (async () => { try { setMe(await getSessionAccount()); } catch {} })(); }, []);
  const can = !!me && me.role === 'developer';
  async function run() {
    try {
      setLog('Seeding...');
      const res = await seedForum();
      setLog(`Sections: +${res.createdSections}; Topics: +${res.createdTopics}`);
      try { localStorage.setItem('seed:done', '1'); setDone(true); } catch {}
    } catch (e: any) { setLog(e?.message || 'Failed'); }
  }
  if (!can) return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card p-6 text-sm text-zinc-300">Only developers can access this page.</div>
      </div>
    </main>
  );
  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card p-6">
          <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400/80">Maintenance</div>
          <h1 className="text-xl font-semibold">Forum Seed</h1>
          <p className="mt-1 text-sm opacity-80">Creates baseline sections and topics. Safe to re-run; skips existing.</p>
          <div className="mt-4 flex items-center gap-2">
            {!done ? (
              <button className="btn btn-primary" onClick={run}>Seed forum</button>
            ) : (
              <span className="text-sm opacity-80">Already seeded (seed:done)</span>
            )}
            <Link to="/forum" className="btn">Back to forum</Link>
          </div>
          {log && <div className="mt-3 rounded-lg border p-2 text-sm opacity-80" style={{ borderColor: 'var(--border)' }}>{log}</div>}
        </div>
      </div>
    </main>
  );
}
