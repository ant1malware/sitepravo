import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionAccount, type RemoteUser } from './store/authRemote';
import { getTopic, listTopics, listPosts, createPost, updatePost, deletePost, toggleLikePost, listSections, type Topic, type Post } from './store/forumRemote';
import { ChevronLeft, Pin, Quote as QuoteIcon, Edit2, X } from 'lucide-react';
import MarkdownEditor from './components/MarkdownEditor';
import ReactionBar from './components/ReactionBar';
import { setPageMeta, setOgTags } from './utils/seo';
import FavStar from './FavStar';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function TopicPage() {
  const { id = '' } = useParams();
  const [me, setMe] = React.useState<RemoteUser | null>(null);
  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [allTopics, setAllTopics] = React.useState<Topic[]>([]);
  const [sectionTitle, setSectionTitle] = React.useState<string>('');
  const [input, setInput] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [toc, setToc] = React.useState<{ id: string; text: string; level: number }[]>([]);
  const [lightbox, setLightbox] = React.useState<string | null>(null);

  const canModerate = !!me && (me.role === 'developer' || me.role === 'admin' || me.role === 'moderator');

  React.useEffect(() => {
    (async () => {
      try { setMe(await getSessionAccount()); } catch {}
      try {
        const t = await getTopic(id);
        if (t) { setTopic(t); try { setPageMeta(`${t.title} — Тема`, t.title); } catch {} }
        const p = await listPosts(id);
        setPosts(Array.isArray(p) ? p : []);
      } catch {}
      try { const ts = await listTopics(); setAllTopics(Array.isArray(ts) ? ts : []); } catch {}
    })();
  }, [id]);

  async function send() {
    const text = input.trim(); if (!text || !me || !topic || topic.locked) return;
    try {
      const p = await createPost({ topicId: topic.id, content: text });
      setPosts(prev => [...prev, p]);
      setInput('');
    } catch {}
  }

  async function togglePinReply(p: Post) { if (!canModerate) return; try { const upd = await updatePost(p.id, { pinned: !p.pinned }); setPosts(prev => prev.map(x => x.id === p.id ? upd : x)); } catch {} }
  async function removeReply(p: Post) { try { await deletePost(p.id); setPosts(prev => prev.filter(x => x.id !== p.id)); } catch {} }

  // Schema.org JSON-LD for forum topic
  React.useEffect(() => {
    if (!topic) return;
    try {
      const schema = { '@context': 'https://schema.org', '@type': 'DiscussionForumPosting', headline: topic.title, datePublished: topic.createdAt, dateModified: topic.updatedAt };
      setPageMeta(undefined, topic.title, schema as any);
    } catch {}
  }, [topic?.id]);

  // Set OG/canonical and resolve section title
  React.useEffect(() => {
    (async () => {
      try {
        if (topic?.id) {
          const url = `${window.location.origin}/forum/topic/${topic.id}`;
          setOgTags({ title: topic.title, description: topic.title, url, canonical: url });
        }
      } catch {}
      try {
        if (topic?.sectionId) {
          const secs = await listSections();
          const sec = (secs||[]).find(s => s.id === topic.sectionId);
          if (sec) setSectionTitle(sec.title || '');
        }
      } catch {}
    })();
      try {
        if (topic?.title) {
          const c = document.createElement('canvas'); c.width = 1200; c.height = 630; const ctx = c.getContext('2d');
          if (ctx) {
            const grd = ctx.createLinearGradient(0,0,1200,630); grd.addColorStop(0,'#8b5cf6'); grd.addColorStop(1,'#22d3ee'); ctx.fillStyle = grd; ctx.fillRect(0,0,1200,630);
            ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(24,24,1152,582);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 56px Inter, system-ui, sans-serif'; ctx.textBaseline = 'top';
            const text = topic.title.slice(0,90); const lines = []; let cur='';
            for (const w of text.split(' ')) { const t = (cur ? cur + ' ' : '') + w; if (ctx.measureText(t).width > 1080) { lines.push(cur); cur = w; } else { cur = t; } }
            if (cur) lines.push(cur);
            let y = 120; for (const ln of lines) { ctx.fillText(ln, 60, y); y += 70; }
            ctx.font = 'bold 24px Inter, system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.fillText(sectionTitle || 'SKY', 60, 60);
            const data = c.toDataURL('image/png');
            const url = `${window.location.origin}/forum/topic/${topic.id}`;
            setOgTags({ title: topic.title, description: topic.title, url, image: data, canonical: url });
          }
        }
      } catch {}  }, [topic?.id, topic?.sectionId, topic?.title]);

  // compute ToC for first post
  React.useEffect(() => {
    const first = posts[0]?.content || '';
    const lines = first.split(/\r?\n/);
    const out: { id: string; text: string; level: number }[] = [];
    const slug = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-').slice(0,80);
    for (const ln of lines) {
      const m = /^(#{2,3})\s+(.+)$/.exec(ln.trim());
      if (m) out.push({ id: slug(m[2]), text: m[2], level: m[1].length });
    }
    setToc(out);
  }, [posts.length]);

  // save/restore scroll per-topic
  React.useEffect(() => {
    const key = `topic:scroll:${id}`;
    try { const y = Number(localStorage.getItem(key)||''); if (y) window.scrollTo(0, y); } catch {}
    const on = () => { try { localStorage.setItem(key, String(window.scrollY||0)); } catch {} };
    window.addEventListener('beforeunload', on);
  
  // hotkey: r to focus reply editor
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'r') {
        const box = document.querySelector('#reply-editor textarea') as HTMLTextAreaElement | null;
        if (box) { e.preventDefault(); box.focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return () => { on(); window.removeEventListener('beforeunload', on); };
  }, [id]);

  function renderMd(src: string): string {
    try { return DOMPurify.sanitize(marked.parse(src || '') as string); } catch { return src; }
  }

  // related topics in same section by Jaccard similarity
  function scoreRelated(a: Topic, b: Topic): number {
    const A = new Set(String(a.title||'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    const B = new Set(String(b.title||'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    if (!A.size || !B.size) return 0;
    let inter = 0; for (const w of B) if (A.has(w)) inter++;
    const union = A.size + B.size - inter;
    return union ? inter/union : 0;
  }
  const relatedList = React.useMemo(() => {
    if (!topic) return [] as Topic[];
  
  // hotkey: r to focus reply editor
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'r') {
        const box = document.querySelector('#reply-editor textarea') as HTMLTextAreaElement | null;
        if (box) { e.preventDefault(); box.focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (allTopics||[])
      .filter(t => t.id !== topic.id && t.sectionId === topic.sectionId)
      .map(t => ({ t, s: scoreRelated(topic, t) }))
      .filter(x => x.s > 0)
      .sort((a,b) => b.s - a.s)
      .slice(0, 5)
      .map(x => x.t);
  }, [allTopics, topic?.id, topic?.sectionId, topic?.title]);


  // hotkey: r to focus reply editor
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'r') {
        const box = document.querySelector('#reply-editor textarea') as HTMLTextAreaElement | null;
        if (box) { e.preventDefault(); box.focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="mb-2 text-sm opacity-80 truncate">
          <Link to="/forum" className="hover:underline">Форум</Link>
          <span className="mx-2">/</span>
          {topic?.sectionId ? <Link to={`/forum/section/${topic.sectionId}`} className="hover:underline">{sectionTitle || 'Раздел'}</Link> : <span>Раздел</span>}
          <span className="mx-2">/</span>
          <span className="font-semibold">{topic?.title || '...'}</span>
        </nav>
        <div className="mb-4 flex items-center gap-3">
          <Link to="/forum" className="btn flex items-center gap-2"><ChevronLeft size={16} /> Back</Link>
          <div className="text-sm opacity-70">Topic</div>
          <div className="font-semibold truncate">{topic?.title || '...'}</div>
          <div className="ml-auto text-xs opacity-70">Replies {topic?.replyCount ?? 0} • Views {topic?.viewCount ?? 0}</div>
        </div>

        <div className="card p-4">
          <div className="grid gap-3">
            {posts
              .slice()
              .sort((a,b)=> ((b.pinned?1:0)-(a.pinned?1:0)) || new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
              .map(p => {
                const mine = !!me && me.id === p.authorId;
                const isEditing = editingId === p.id;
              
  // hotkey: r to focus reply editor
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'r') {
        const box = document.querySelector('#reply-editor textarea') as HTMLTextAreaElement | null;
        if (box) { e.preventDefault(); box.focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
                <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                  {p.pinned && <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs">Pinned</span>}
                  {!isEditing ? (
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap">{p.content}</div>
                  ) : (
                    <MarkdownEditor value={editValue} onChange={setEditValue} onSubmit={async (text) => {
                      setEditValue(text);
                      // optimistic update
                      setPosts(prev => prev.map(x => x.id === p.id ? { ...x, content: text, editedAt: new Date().toISOString() } : x));
                      setEditingId(null);
                      try { await updatePost(p.id, { content: text }); } catch { /* ignore, optimistic */ }
                    }} submitLabel="Save" />
                  )}
                  {!isEditing && (
                    <div className="mt-2 flex items-center gap-2">
                      <button className="btn text-xs" title="Цитировать" onClick={() => setInput(prev => prev + `\n\n> ${p.content}\n\n`)}><QuoteIcon size={14} /> Quote</button>
                      <button className="btn text-xs" onClick={async ()=> { try { const upd = await toggleLikePost(p.id); setPosts(prev=> prev.map(x=> x.id===p.id? upd: x)); } catch {} }}>?? {(p.likes||[]).length}</button>
                      {mine && <button className="btn text-xs" onClick={() => { setEditingId(p.id); setEditValue(p.content); }} title="Edit"><Edit2 size={14} /> Edit</button>}
                    </div>
                  )}
                  {isEditing && (
                    <div className="mt-2 flex items-center justify-end"><button className="btn" onClick={() => setEditingId(null)}><X size={14} /> Cancel</button></div>
                  )}
                  <ReactionBar postId={p.id} currentUserId={me?.id} onPostUpdated={async ()=>{ try { const upd = await listPosts(id); setPosts(Array.isArray(upd)? upd: []);} catch {} }} />
                  {(canModerate || me?.id === p.authorId) && (
                    <div className="mt-2 text-right">
                      {canModerate && <button className="btn text-xs" onClick={() => togglePinReply(p)} style={{ marginRight: 8 }}>{p.pinned ? 'Unpin' : 'Pin'}</button>}
                      <button className="btn text-xs" onClick={() => removeReply(p)}>Delete</button>
                    </div>
                  )}
                </div>
              );})}
            {!topic?.locked && me && (
              <MarkdownEditor value={input} onChange={setInput} onSubmit={() => send()} placeholder="Reply in Markdown..." submitLabel="Send" draftKey={topic ? `forum:draft:${topic.id}` : undefined} />
            )}
            {topic?.locked && <div className="text-xs opacity-70">Topic is locked.</div>}
          </div>
        </div>

                {toc.length > 0 && (
          <div className="card mt-4 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400/80">Оглавление</div>
            <ul className="text-sm leading-relaxed">
              {toc.map(h => (
                <li key={h.id} className={h.level===3? 'ml-3' : ''}><a href={`#${h.id}`} className="hover:underline">{h.text}</a></li>
              ))}
            </ul>
          </div>
        )}{relatedList.length > 0 && (
          <div className="card mt-4 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400/80">Похожие темы</div>
            <div className="grid gap-2">
              {relatedList.map(t => (
                <Link key={t.id} to={`/forum/topic/${t.id}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06]">
                  <div className="min-w-0 truncate font-medium">{t.title}</div>
                  <div className="ml-2 shrink-0 text-xs opacity-70">Ответов {t.replyCount}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
              {lightbox && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4" onClick={()=>setLightbox(null)}>
            <img src={lightbox} alt="preview" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg" />
          </div>
        )}      </div>\n    </main>
  );
}






