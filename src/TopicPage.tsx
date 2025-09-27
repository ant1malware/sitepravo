import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionAccount, type RemoteUser } from './store/authRemote';
import { getTopic, listPosts, createPost, updatePost, deletePost, toggleLikePost, type Topic, type Post } from './store/forumRemote';
import { ChevronLeft, Lock, Unlock, Pin, Send, Heart } from 'lucide-react';

export default function TopicPage() {
  const { id = '' } = useParams();
  const [me, setMe] = React.useState<RemoteUser | null>(null);
  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [input, setInput] = React.useState('');

  const canModerate = !!me && (me.role === 'developer' || me.role === 'admin' || me.role === 'moderator');

  React.useEffect(() => {
    (async () => {
      try { setMe(await getSessionAccount()); } catch {}
      try {
        const t = await getTopic(id);
        if (t) setTopic(t);
        const p = await listPosts(id);
        setPosts(Array.isArray(p) ? p : []);
      } catch {}
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

  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-5xl px-4 py-6">
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
              .map(p => (
                <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                  {p.pinned && <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs">Pinned</span>}
                  {p.content}
                  {(canModerate || me?.id === p.authorId) && (
                    <div className="mt-2 text-right">
                      {canModerate && <button className="btn text-xs" onClick={() => togglePinReply(p)} style={{ marginRight: 8 }}>{p.pinned ? 'Unpin' : 'Pin'}</button>}
                      <button className="btn text-xs" onClick={() => removeReply(p)}>Delete</button>
                    </div>
                  )}
                  <div className="mt-2 text-xs opacity-80 flex items-center gap-2">
                    <button className="btn text-xs" onClick={async ()=> { try { const upd = await toggleLikePost(p.id); setPosts(prev=> prev.map(x=> x.id===p.id? upd: x)); } catch {} }}>
                      <Heart size={14} /> {(p.likes||[]).length}
                    </button>
                  </div>
                </div>
              ))}
            {!topic?.locked && me && (
              <div className="flex items-start gap-2">
                <textarea className="input min-h-[90px] flex-1" placeholder="Reply" value={input} onChange={(e)=>setInput(e.target.value)} />
                <button className="btn btn-primary" onClick={send}><Send size={16} /> Send</button>
              </div>
            )}
            {topic?.locked && <div className="text-xs opacity-70">Topic is locked.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
