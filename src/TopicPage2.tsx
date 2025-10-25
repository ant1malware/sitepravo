import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Pin, Quote as QuoteIcon, Edit2, X } from 'lucide-react';
import { getSessionAccount, type RemoteUser, listPublicMembers } from './store/authRemote';
import {
  getTopic,
  listTopics,
  listPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  listSections,
  type Topic,
  type Post,
} from './store/forumRemote';
import MarkdownEditor from './components/MarkdownEditor';
import ReactionBar from './components/ReactionBar';
import { setPageMeta, setOgTags } from './utils/seo';

export default function TopicPage2() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = React.useState<RemoteUser | null>(null);
  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [allTopics, setAllTopics] = React.useState<Topic[]>([]);
  const [sectionTitle, setSectionTitle] = React.useState<string>('');
  const [input, setInput] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [memberMap, setMemberMap] = React.useState<Record<string, string>>({});
  const canModerate = !!me && (me.role === 'developer' || me.role === 'admin' || me.role === 'moderator');

  React.useEffect(() => {
    (async () => {
      try {
        const u = await getSessionAccount();
        setMe(u);
        if (!u) { try { navigate('/forum', { replace: true }); } catch {} }
      } catch {}
      try {
        const t = await getTopic(id);
        if (t) { setTopic(t); try { setPageMeta(t.title, t.title); } catch {} }
        const p = await listPosts(id);
        setPosts(Array.isArray(p) ? p : []);
      } catch {}
      try { const ts = await listTopics(); setAllTopics(Array.isArray(ts) ? ts : []); } catch {}
      try {
        const rows: any = await listPublicMembers();
        const map: Record<string, string> = {};
        for (const m of rows || []) map[(m as any).id] = (m as any).username;
        setMemberMap(map);
      } catch {}
    })();
  }, [id]);

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
          const sec = (secs || []).find(s => s.id === topic.sectionId);
          if (sec) setSectionTitle(sec.title || '');
        }
      } catch {}
    })();
  }, [topic?.id, topic?.sectionId, topic?.title]);

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

  const sortedPosts = posts.slice().sort((a,b) => ((b.pinned?1:0) - (a.pinned?1:0)) || (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  const relatedList = React.useMemo(() => {
    if (!topic) return [] as Topic[];
    const q = (topic.title || '').toLowerCase();
    return allTopics.filter(t => t.id !== topic.id && (t.title || '').toLowerCase().includes(q.split(' ').slice(0,2).join(' '))).slice(0,5);
  }, [allTopics, topic?.id, topic?.title]);

  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/forum" className="btn flex items-center gap-2"><ChevronLeft size={16} /> Назад</Link>
            <div className="text-sm opacity-70">{sectionTitle || 'Тема'}</div>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-1 text-xs opacity-70">{sectionTitle}</div>
          <h1 className="text-xl font-bold text-white">{topic?.title || '...'}</h1>
        </div>

        <div className="mt-4 grid gap-3">
          {sortedPosts.map((p) => {
            const mine = !!me && me.id === p.authorId;
            const isEditing = editingId === p.id;
            return (
              <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                <div className="mb-1 text-xs text-zinc-300/90">
                  {(() => {
                    const uname = memberMap[p.authorId] || (p.authorId === me?.id ? me?.username : '');
                    return uname ? (
                      <Link to={`/forum/profile/${uname}`} className="font-semibold text-white hover:underline">{uname}</Link>
                    ) : (
                      <span className="opacity-80">Участник</span>
                    );
                  })()}
                  <span className="opacity-70"> · {new Date(p.createdAt).toLocaleString()}</span>
                </div>
                {p.pinned && <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs">Pinned</span>}
                {!isEditing ? (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap">{p.content}</div>
                ) : (
                  <MarkdownEditor value={editValue} onChange={setEditValue} onSubmit={async (text) => {
                    setEditValue(text);
                    setPosts(prev => prev.map(x => x.id === p.id ? { ...x, content: text, editedAt: new Date().toISOString() } : x));
                    setEditingId(null);
                    try { await updatePost(p.id, { content: text }); } catch {}
                  }} submitLabel="Save" />
                )}
                {!isEditing && (
                  <div className="mt-2 flex items-center gap-2">
                    <button className="btn text-xs" title="Цитировать" onClick={() => setInput(prev => prev + `\n\n> ${p.content}\n\n`)}><QuoteIcon size={14} /> Quote</button>
                    <button className="btn text-xs" onClick={async ()=> { try { const upd = await toggleLikePost(p.id); setPosts(prev=> prev.map(x=> x.id===p.id? upd: x)); } catch {} }}>❤ {(p.likes||[]).length}</button>
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
            );
          })}

          {!topic?.locked && me && (
            <MarkdownEditor value={input} onChange={setInput} onSubmit={() => send()} placeholder="Reply in Markdown..." submitLabel="Send" draftKey={topic ? `forum:draft:${topic.id}` : undefined} />
          )}
          {topic?.locked && <div className="text-xs opacity-70">Topic is locked.</div>}
        </div>

        {relatedList.length > 0 && (
          <div className="card mt-4 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400/80">Похожие темы</div>
            <div className="grid gap-2">
              {relatedList.map(t => (
                <Link key={t.id} to={`/forum/topic/${t.id}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06]">
                  <div className="min-w-0 truncate font-medium">{t.title}</div>
                  <div className="ml-2 shrink-0 text-xs opacity-70">ответов {t.replyCount}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
