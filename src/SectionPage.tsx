import React from "react";
import { Link, useParams } from "react-router-dom";
import { listSections, listTopics, createTopic } from "./store/forumRemote";
import { ChevronLeft, ShoppingBag, Plus } from "lucide-react";
import ForumSubnav from "./ForumSubnav";
import MarkdownEditor from './components/MarkdownEditor';
import FavStar from './FavStar';
import { t } from './utils/i18n';

export default function SectionPage() {
  const { id = "" } = useParams();
  const [section, setSection] = React.useState<any | null>(null);
  const [topics, setTopics] = React.useState<any[]>([]);
  const [newTitle, setNewTitle] = React.useState("");
  const [newBody, setNewBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState<'all'|'wip'|'review'|'done'>('all');
  const [tag, setTag] = React.useState<string>('all');
  const [show, setShow] = React.useState<number>(20);
  const [sort, setSort] = React.useState<'updated' | 'created' | 'replies'>('updated');

  const reload = React.useCallback(async () => {
    try {
      const [sections, t] = await Promise.all([
        listSections(),
        listTopics(id),
      ]);
      setSection(sections.find((s: any) => s.id === id) || null);
      setTopics(Array.isArray(t) ? t : []);
    } catch {
      setSection(null);
      setTopics([]);
    }
  }, [id]);

  React.useEffect(() => { reload(); }, [reload]);

  const isWorkshop = (section?.title || "").toLowerCase() === "workshop";

  // collect tags from [Tag] in titles (exclude Workshop statuses)
  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    for (const t of topics) {
      const matches = String(t.title || '').match(/\[(.+?)\]/g) || [];
      for (const raw of matches) {
        const v = raw.replace(/[\[\]]/g, '');
        if (!['wip', 'review', 'done'].includes(v.toLowerCase())) set.add(v);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [topics]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setBusy(true);
    try {
      await createTopic({ sectionId: id, title, content: isWorkshop ? newBody : undefined as any });
      setNewTitle(""); setNewBody("");
      reload();
    } catch (err: any) {
      alert(err?.message || "Failed to create topic");
    } finally { setBusy(false); }
  };

  function statusOf(title: string): 'wip'|'review'|'done'|'none' {
    const t = (title||'').toLowerCase();
    if (t.startsWith('[wip]')) return 'wip';
    if (t.startsWith('[review]')) return 'review';
    if (t.startsWith('[done]')) return 'done';
    return 'none';
  }

  const byStatus = topics.filter(t => status==='all' ? true : statusOf(t.title) === status);
  const byTag = byStatus.filter(t => tag==='all' ? true : new RegExp(`\\[${tag.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\]`, 'i').test(String(t.title||'')));
  const sorted = React.useMemo(() => {
    const arr = [...byTag];
    return arr.sort((a, b) => {
      if (sort === 'replies') {
        return (b.replyCount ?? 0) - (a.replyCount ?? 0);
      }
      const key = sort === 'created' ? 'createdAt' : 'updatedAt';
      return new Date(b[key] || b.createdAt || 0).getTime() - new Date(a[key] || a.createdAt || 0).getTime();
    });
  }, [byTag, sort]);
  const shown = sorted.slice(0, show);

  const statusSummary = React.useMemo(() => {
    const summary = { total: topics.length, wip: 0, review: 0, done: 0 };
    if (!isWorkshop) return summary;
    for (const item of topics) {
      const st = statusOf(item.title);
      if (st === 'wip') summary.wip += 1;
      else if (st === 'review') summary.review += 1;
      else if (st === 'done') summary.done += 1;
    }
    return summary;
  }, [topics, isWorkshop]);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 620px at 18% -12%, rgba(59,130,246,0.18), transparent 65%), radial-gradient(1200px 760px at 92% 0%, rgba(236,72,153,0.16), transparent 68%), #0d0d12",
        color: "#f8fafc",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ForumSubnav />
        <nav className="mb-3 text-sm opacity-80">
          <Link to="/forum" className="hover:underline">{t('Форум','Forum')}</Link>
          <span className="mx-2">/</span>
          <span>{section?.title || '...'}</span>
        </nav>
        <div className="mb-5 flex items-center gap-3">
          <Link to="/forum" className="btn flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Link>
          <div className="text-sm opacity-70">Section</div>
          <div className="font-semibold">{section?.title || "..."}</div>
        </div>

        {isWorkshop && (
          <div className="card mb-4 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <ShoppingBag size={16} /> Workshop: рекомендации
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-emerald-200/80">
                <span>Проектов {statusSummary.total}</span>
                <span>[WIP] {statusSummary.wip}</span>
                <span>[Review] {statusSummary.review}</span>
                <span>[Done] {statusSummary.done}</span>
              </div>
            </div>
            <div className="mt-2 text-sm opacity-70">
              Добавляйте префиксы статуса в заголовок: [WIP], [Review], [Done].
              Пишите краткое описание, технологический стек и прогресс — будет проще ревьюить.
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <button className={`tab ${status==='all'?'tab-active':''}`} onClick={()=>{ setStatus('all'); setShow(20); }}>All</button>
              <button className={`tab ${status==='wip'?'tab-active':''}`} onClick={()=>{ setStatus('wip'); setShow(20); }}>[WIP]</button>
              <button className={`tab ${status==='review'?'tab-active':''}`} onClick={()=>{ setStatus('review'); setShow(20); }}>[Review]</button>
              <button className={`tab ${status==='done'?'tab-active':''}`} onClick={()=>{ setStatus('done'); setShow(20); }}>[Done]</button>
              <div className="ml-auto flex items-center gap-2">
                <span className="opacity-60">Сортировка</span>
                <button className={`tab ${sort==='updated'?'tab-active':''}`} onClick={()=>{ setSort('updated'); setShow(20); }}>Обновление</button>
                <button className={`tab ${sort==='created'?'tab-active':''}`} onClick={()=>{ setSort('created'); setShow(20); }}>Создание</button>
                <button className={`tab ${sort==='replies'?'tab-active':''}`} onClick={()=>{ setSort('replies'); setShow(20); }}>Ответы</button>
              </div>
            </div>
          </div>
        )}

        {/* New topic */}
        <form onSubmit={submit} className="card mb-4 grid gap-2 p-4">
          <input className="input" placeholder={isWorkshop ? "[WIP] Короткий заголовок проекта" : "Topic title"} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} disabled={busy} />
          {isWorkshop && (
            <MarkdownEditor value={newBody} onChange={setNewBody} placeholder="Описание проекта..." projectTemplate draftKey={section ? `forum:draft:new:${section.id}` : undefined} />
          )}
          <button className="btn btn-primary flex items-center gap-2" disabled={busy}>
            <Plus size={16} /> {isWorkshop ? "Создать проект" : "Создать тему"}
          </button>
        </form>

        {/* Topics */}
        <div className="grid gap-3">
          {!isWorkshop && (
            <div className="card flex flex-wrap items-center gap-2 p-2 text-xs">
              <span className="opacity-70">{t('Теги','Tags')}:</span>
              <button className={`tab ${tag==='all'?'tab-active':''}`} onClick={()=>{ setTag('all'); setShow(20); }}>All</button>
              {allTags.map(x => (
                <button key={x} className={`tab ${tag===x?'tab-active':''}`} onClick={()=>{ setTag(x); setShow(20); }}>{`[${x}]`}</button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="opacity-60">Сортировка</span>
                <button className={`tab ${sort==='updated'?'tab-active':''}`} onClick={()=>{ setSort('updated'); setShow(20); }}>Обновление</button>
                <button className={`tab ${sort==='created'?'tab-active':''}`} onClick={()=>{ setSort('created'); setShow(20); }}>Создание</button>
                <button className={`tab ${sort==='replies'?'tab-active':''}`} onClick={()=>{ setSort('replies'); setShow(20); }}>Ответы</button>
              </div>
            </div>
          )}
          {shown.map((t) => (
            <Link key={t.id} to={`/forum/topic/${t.id}`} className={`card p-4 ${isWorkshop ? "grid grid-cols-[1fr_auto] items-center" : ""}`}>
              <div className="min-w-0">
                <div className="font-semibold truncate">
                  {isWorkshop && statusOf(t.title) !== 'none' && (
                    <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs">{`[${statusOf(t.title).toUpperCase()}]`}</span>
                  )}
                  {t.title}
                </div>
                <div className="mt-1 text-xs opacity-70">replies: {t.replyCount} • views: {t.viewCount}</div>
              </div>
              {isWorkshop && (
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">Проект</div>
              )}
              <FavStar kind="topic" id={t.id} title={t.title} url={`/forum/topic/${t.id}`} size="sm" />
            </Link>
          ))}
          {!shown.length && (
            <div className="card p-4 text-sm opacity-70">No topics yet.</div>
          )}
          {byTag.length > show && (
            <button className="btn" onClick={()=> setShow(show + 20)}>{t('Показать ещё','Show more')}</button>
          )}
        </div>
      </div>
    </main>
  );
}
