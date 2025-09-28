import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { listTopics, listSections, type Topic, type Section } from './store/forumRemote';
import ForumSubnav from './ForumSubnav';

export default function TagPage() {
  const { tag = '' } = useParams();
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [sections, setSections] = React.useState<Section[]>([]);
  React.useEffect(() => { (async () => { try { setTopics(await listTopics()); setSections(await listSections()); } catch {} })(); }, []);
  const re = new RegExp(`\\[${(tag||'').replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\]`, 'i');
  const rows = topics.filter(t => re.test(String(t.title||'')));
  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ForumSubnav />
        <nav className="mb-3 text-sm opacity-80">
          <Link to="/forum" className="hover:underline">Форум</Link>
          <span className="mx-2">/</span>
          <span>Тег {tag}</span>
        </nav>
        <div className="card p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400/80">Темы с тегом [{tag}]</div>
          <div className="grid gap-2">
            {rows.map(t => {
              const sec = sections.find(s => s.id === t.sectionId);
              return (
                <Link key={t.id} to={`/forum/topic/${t.id}`} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06]">
                  <div className="text-xs opacity-70">{sec?.title || 'Раздел'}</div>
                  <div className="font-semibold truncate">{t.title}</div>
                </Link>
              );
            })}
            {!rows.length && (<div className="text-sm opacity-70">Ничего не найдено.</div>)}
          </div>
        </div>
      </div>
    </main>
  );
}

