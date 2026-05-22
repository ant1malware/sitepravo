import React from 'react';
import { Search, Filter, Flame, Clock, HelpCircle, ChevronDown } from 'lucide-react';
import { listSections, listTopics, listPosts, type Section, type Topic, type Post } from '../store/forumRemote';

export type ForumSearchResult = { kind: 'topic'; topic: Topic; section?: Section } | { kind: 'post'; post: Post; topic?: Topic; section?: Section };

function normalize(s: string) { return (s || '').toLowerCase().normalize('NFKD'); }

export default function ForumSearch() {
  const [q, setQ] = React.useState('');
  const [sections, setSections] = React.useState<Section[]>([]);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [postsByTopic, setPostsByTopic] = React.useState<Record<string, Post[]>>({});
  const [inPosts, setInPosts] = React.useState(false);
  const [filter, setFilter] = React.useState<'any'|'24h'|'7d'|'30d'>('any');
  const [onlyUnanswered, setOnlyUnanswered] = React.useState(false);
  const [sort, setSort] = React.useState<'relevance'|'newest'|'popular'>('relevance');
  const [open, setOpen] = React.useState(false);

  // Load sections and topics once
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [s, t] = await Promise.all([listSections(), listTopics()]);
        if (!alive) return;
        setSections(Array.isArray(s) ? s : []);
        setTopics(Array.isArray(t) ? t : []);
      } catch {
        if (!alive) return;
        setSections([]); setTopics([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Lazy-load posts when toggled
  React.useEffect(() => {
    if (!inPosts) return;
    let stop = false;
    (async () => {
      for (const t of topics) {
        if (stop) break;
        if (postsByTopic[t.id]) continue;
        try { const arr = await listPosts(t.id); setPostsByTopic(prev => ({ ...prev, [t.id]: arr })); } catch {}
      }
    })();
    return () => { stop = true; };
  }, [inPosts, topics.length]);

  const results = React.useMemo<ForumSearchResult[]>(() => {
    const out: ForumSearchResult[] = [];
    const needle = normalize(q).trim();
    if (!needle) return out;
    const withinRange = (iso?: string) => {
      if (!iso || filter === 'any') return true;
      const ms = Date.now() - new Date(iso).getTime();
      const day = 24*60*60*1000;
      if (filter === '24h') return ms <= day;
      if (filter === '7d') return ms <= 7*day;
      if (filter === '30d') return ms <= 30*day;
      return true;
    };

    for (const t of topics) {
      if (onlyUnanswered && t.replyCount > 0) continue;
      if (!withinRange(t.updatedAt)) continue;
      const hay = normalize(t.title || '');
      if (hay.includes(needle)) {
        out.push({ kind: 'topic', topic: t, section: sections.find(s => s.id === t.sectionId) });
      }
      if (inPosts) {
        const arr = postsByTopic[t.id] || [];
        for (const p of arr) {
          if (!withinRange(p.createdAt)) continue;
          if (normalize(p.content).includes(needle)) out.push({ kind: 'post', post: p, topic: t, section: sections.find(s => s.id === t.sectionId) });
        }
      }
    }

    const score = (r: ForumSearchResult) => {
      if (sort === 'newest') {
        const d = r.kind === 'topic' ? r.topic.updatedAt : r.post.createdAt;
        return new Date(d).getTime();
      }
      if (sort === 'popular') {
        if (r.kind === 'topic') return (r.topic.replyCount || 0) * 10 + (r.topic.viewCount || 0);
        return (r.topic?.replyCount || 0) * 10 + (r.topic?.viewCount || 0);
      }
      // relevance heuristic: topics before posts
      return r.kind === 'topic' ? 2 : 1;
    };

    return out.sort((a,b) => score(b) - score(a)).slice(0, 50);
  }, [q, topics, postsByTopic, sections, inPosts, filter, onlyUnanswered, sort]);

  return (
    <div className="card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
          <input id="forum-search-input" className="input pl-8" placeholder="Поиск по темам и постам" value={q} onChange={(e)=>setQ(e.target.value)} onFocus={()=>setOpen(true)} />
        </div>
        <button className="btn" onClick={()=>setOpen(v=>!v)}><Filter className="h-4 w-4" /> Фильтры <ChevronDown size={14} /></button>
      </div>
      {open && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <label className="btn"><input type="checkbox" className="mr-2" checked={inPosts} onChange={(e)=>setInPosts(e.target.checked)} /> Искать в постах</label>
          <label className="btn"><input type="checkbox" className="mr-2" checked={onlyUnanswered} onChange={(e)=>setOnlyUnanswered(e.target.checked)} /> Без ответов</label>
          <div className="flex items-center gap-1">
            <span className="opacity-70">Период:</span>
            {(['any','24h','7d','30d'] as const).map(id => (
              <button key={id} className={`tab ${filter===id?'tab-active':''}`} onClick={()=>setFilter(id)}>{id==='any'?'За всё время':id}</button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="opacity-70">Сортировка:</span>
            {(['relevance','newest','popular'] as const).map(id => (
              <button key={id} className={`tab ${sort===id?'tab-active':''}`} onClick={()=>setSort(id)}>{id==='relevance'?'релевантность':id==='newest'?'новые':'популярное'}</button>
            ))}
          </div>
        </div>
      )}
      {!!q.trim() && (
        <div className="mt-3 grid gap-2">
          {results.length === 0 && (
            <div className="rounded-xl border p-3 text-sm opacity-70" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
              Ничего не найдено. Попробуйте изменить запрос или фильтры.
            </div>
          )}
          {results.map((r, i) => (
            <a key={i}
               href={r.kind==='topic' ? `/forum/topic/${r.topic.id}` : `/forum/topic/${r.topic?.id || ''}`}
               className="block rounded-xl border p-3 hover:bg-white/5"
               style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <div className="text-xs opacity-70 mb-0.5">
                {r.section?.title || 'Раздел'} {r.kind==='post' ? '• Пост' : '• Тема'}
              </div>
              <div className="font-semibold truncate">
                {r.kind==='topic' ? r.topic.title : (r.topic?.title || '...')}
              </div>
              {r.kind==='post' && (
                <div className="mt-1 line-clamp-2 text-sm opacity-80">{r.post.content}</div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
