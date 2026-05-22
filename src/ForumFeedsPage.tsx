import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ForumSubnav from './ForumSubnav';
import ForumSearch from './components/ForumSearch';
import { listTopics, type Topic } from './store/forumRemote';
import { type FeedType, getDefaultFeed } from './store/feedPrefs';
import { setPageMeta } from './utils/seo';

export default function ForumFeedsPage() {
  const loc = useLocation();
  const feedParam = (new URLSearchParams(loc.search || '')).get('feed') as FeedType | null;
  const [feed, setFeed] = React.useState<FeedType>(feedParam || getDefaultFeed());
  const [topics, setTopics] = React.useState<Topic[]>([]);

  React.useEffect(() => { try { setPageMeta('Ленты — Форум', 'Горячее, новое и вопросы форума'); } catch {} }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => { try { const t = await listTopics(); if (alive) setTopics(t || []); } catch { if (alive) setTopics([]); } })();
    return () => { alive = false; };
  }, []);

  React.useEffect(() => {
    if (!feedParam) return;
    setFeed(feedParam);
  }, [feedParam]);

  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ForumSubnav />
        <div className="mb-4 flex items-center gap-2">
          <button className={`tab ${feed==='hot'?'tab-active':''}`} onClick={() => setFeed('hot')}>Горячее</button>
          <button className={`tab ${feed==='new'?'tab-active':''}`} onClick={() => setFeed('new')}>Новое</button>
          <Link className="tab" to="/forum/questions">Вопросы</Link>
        </div>
        <ForumSearch />
        <div className="mt-4">
          <FeedList feed={feed} topics={topics} />
        </div>
      </div>
    </main>
  );
}

function FeedList({ feed, topics }: { feed: FeedType; topics: Topic[] }) {
  const items = React.useMemo(() => {
    const arr = (topics || []).slice();
    if (feed === 'new') return arr.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
    return arr
      .map(t => ({ t, s: (t.replyCount||0)*2 + (t.viewCount||0)*0.1 - Math.max(0,(Date.now()-new Date(t.updatedAt).getTime())/3600000)*0.02 }))
      .sort((a,b)=> b.s - a.s)
      .slice(0, 20)
      .map(x => x.t);
  }, [feed, topics]);
  if (items.length === 0) return (<div className="card p-4 text-sm opacity-70">Лента пуста.</div>);
  return (
    <div className="grid gap-3">
      {items.map(t => (
        <a key={t.id} href={`/forum/topic/${t.id}`} className="block rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="font-semibold truncate">{t.title}</div>
          <div className="mt-1 text-xs opacity-70">Ответов {t.replyCount} • Просмотры {t.viewCount} • Обновлено {new Date(t.updatedAt).toLocaleString()}</div>
        </a>
      ))}
    </div>
  );
}
