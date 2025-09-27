import React from 'react';
import { Link } from 'react-router-dom';
import { getSessionAccount, type RemoteUser } from './store/authRemote';
import { listSections, listTopics, listPosts, createTopic, createPost, updateTopic, updatePost, deletePost, toggleLikePost, type Section, type Topic, type Post } from './store/forumRemote';
import { Paperclip, Pin, Lock, Unlock, Send, Heart } from 'lucide-react';

export default function QuestionsPage() {
  const [me, setMe] = React.useState<RemoteUser | null>(null);
  const [section, setSection] = React.useState<Section | null>(null);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState<Record<string, Post[]>>({});
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [attach, setAttach] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try { const u = await getSessionAccount(); setMe(u); } catch {}
      try {
        const sections = await listSections();
        const s = sections.find(s => (s.title || '').toLowerCase() === 'questions' || (s.title || '').toLowerCase() === 'вопросы');
        setSection(s || null);
        if (s) {
          const t = await listTopics(s.id);
          setTopics(t);
        }
      } catch {}
    })();
  }, []);

  async function openTopic(t: Topic) {
    setOpenId(openId === t.id ? null : t.id);
    if (!posts[t.id]) {
      try { const p = await listPosts(t.id); setPosts(prev => ({ ...prev, [t.id]: p })); } catch {}
    }
  }

  const canModerate = me && (me.role === 'admin' || me.role === 'moderator' || me.role === 'developer');

  async function submitTopic() {
    if (!me || !section) return;
    try {
      const content = body + (attach ? `\n\n![attachment](${attach})` : '');
      const t = await createTopic({ sectionId: section.id, title: title.trim(), content });
      setTopics([t, ...topics]);
      setTitle(''); setBody(''); setAttach(null);
    } catch (e) { console.error(e); }
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setAttach(String(r.result || '')); r.readAsDataURL(f);
  }

  async function postReply(topicId: string, text: string) {
    if (!me) return; if (!text.trim()) return;
    try {
      const p = await createPost({ topicId, content: text.trim() });
      setPosts(prev => ({ ...prev, [topicId]: [...(prev[topicId] || []), p] }));
    } catch {}
  }

  async function toggleLock(t: Topic) { try { const u = await updateTopic(t.id, { locked: !t.locked }); setTopics(prev => prev.map(x => x.id === t.id ? u : x)); } catch {} }
  async function togglePin(t: Topic) { try { const u = await updateTopic(t.id, { pinned: !t.pinned }); setTopics(prev => prev.map(x => x.id === t.id ? u : x)); } catch {} }

  // server-side pin/unpin (moderators only)
  async function togglePinPost(topicId: string, p: Post) {
    if (!canModerate) return;
    try {
      const upd = await updatePost(p.id, { pinned: !p.pinned });
      setPosts(prev => ({ ...prev, [topicId]: (prev[topicId] || []).map(x => x.id === p.id ? upd : x) }));
    } catch (e) { console.error(e); }
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Вопросы</h1>
          <Link to="/forum" className="btn">Назад</Link>
        </div>

        {!section && (
          <div className="card p-4 text-sm text-zinc-300">
            Раздел «Questions» не найден. Создайте раздел с названием «Questions» (или «Вопросы») в админке.
          </div>
        )}

        {me && section && (
          <div className="card p-4 mb-6">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80 mb-2">Создать тему</div>
            <input className="input mb-2" placeholder="Заголовок" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <textarea className="input min-h-[120px]" placeholder="Опишите проблему, можно приложить скрин" value={body} onChange={(e)=>setBody(e.target.value)} />
            <div className="mt-2 flex items-center gap-2">
              <label className="btn inline-flex items-center gap-2">
                <Paperclip size={16} /> Прикрепить скрин
                <input type="file" accept="image/*" hidden onChange={pickFile} />
              </label>
              {attach && <span className="text-xs opacity-80">прикреплено</span>}
              <button className="btn btn-primary ml-auto" onClick={submitTopic} disabled={!title.trim()}>Опубликовать</button>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {topics.map(t => (
            <div key={t.id} className="card p-4">
              <div className="flex items-center justify-between">
                <button className="text-left font-semibold hover:underline" onClick={() => openTopic(t)}>
                  {t.pinned && <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs">Pinned</span>}
                  {t.title}
                </button>
                {canModerate && (
                  <div className="flex gap-2">
                    <button className="btn" onClick={() => togglePin(t)} title={t.pinned ? 'Снять закрепление' : 'Закрепить'}><Pin size={16} /></button>
                    <button className="btn" onClick={() => toggleLock(t)} title={t.locked ? 'Открыть' : 'Закрыть'}>{t.locked ? <Unlock size={16} /> : <Lock size={16} />}</button>
                  </div>
                )}
              </div>
              <div className="mt-1 text-xs opacity-70">
                Replies {t.replyCount} • Views {t.viewCount} • Updated {new Date(t.updatedAt).toLocaleString()}
              </div>
              {openId === t.id && (
                <div className="mt-3 grid gap-3">
                  {(posts[t.id] || [])
                    .slice()
                    .sort((a,b) => ((b.pinned?1:0) - (a.pinned?1:0)) || (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
                    .map(p => (
                      <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                        {p.pinned && <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs">Pinned</span>}
                        {p.content}
                        <div className="mt-2 text-xs opacity-80 flex items-center gap-2">
                          <button className="btn text-xs" onClick={async ()=> { try { const upd = await toggleLikePost(p.id); setPosts(prev => ({ ...prev, [t.id]: (prev[t.id]||[]).map(x=> x.id===p.id? upd: x) })); } catch {} }}>
                            <Heart size={14} /> {(p.likes||[]).length}
                          </button>
                        </div>
                        {(canModerate || (me && me.id === p.authorId)) && (
                          <div className="mt-2 text-right">
                            {canModerate && (
                              <button className="btn text-xs" onClick={() => togglePinPost(t.id, p)} style={{ marginRight: 8 }}>{p.pinned ? 'Unpin reply' : 'Pin reply'}</button>
                            )}
                            <button className="btn text-xs" onClick={async () => { try { await deletePost(p.id); setPosts(prev => ({ ...prev, [t.id]: (prev[t.id] || []).filter(x => x.id !== p.id) })); } catch (e) { console.error(e); } }}>Delete</button>
                          </div>
                        )}
                      </div>
                    ))}
                  {!t.locked && me && (
                    <ReplyBox onSend={(text)=>postReply(t.id, text)} />
                  )}
                  {t.locked && <div className="text-xs opacity-70">Тема закрыта.</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ReplyBox({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = React.useState('');
  return (
    <div className="flex items-start gap-2">
      <textarea className="input min-h-[90px] flex-1" placeholder="Ваш ответ" value={text} onChange={(e)=>setText(e.target.value)} />
      <button className="btn btn-primary" onClick={() => { const t = text.trim(); if (!t) return; onSend(t); setText(''); }}><Send size={16} /> Отправить</button>
    </div>
  );
}
