import React from 'react';
import { Search, BookOpen, Users, Shield, X, Settings, Star } from 'lucide-react';
import { rolesData } from './roles';
import { lawsData } from './laws';
import { vuDocs } from './vu';
import { getRecents } from './recent';
import { isFeatureOn } from './uiSettings';
import LiquidGlass from './components/LiquidGlass';
import { useStyleMode } from './useStyleMode';

type Row = { kind: 'role' | 'law' | 'vu' | 'page' | 'recent'; id: string; title: string; subtitle?: string; url: string };

function baseUrl(path: string) {
  const b = (import.meta as any).env?.BASE_URL || import.meta.env.BASE_URL || '/';
  return `${b.replace(/\/$/, '')}${path}`;
}

export default function CommandPalette() {
  const enabled = isFeatureOn('cmd_palette', true);
  if (!enabled) return null;

  const [styleMode] = useStyleMode();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const [flt, setFlt] = React.useState<'all'|'role'|'law'|'vu'>(()=> (localStorage.getItem('cp_filter') as any) || 'all');
  React.useEffect(()=>{ try{ localStorage.setItem('cp_filter', flt);}catch{} }, [flt]);

  
  const [workshopId, setWorkshopId] = React.useState<string | null>(null);
  React.useEffect(() => { (async () => { try { const mod = await import('./store/forumRemote'); const secs = await mod.listSections(); const ws = secs.find((s:any)=> String(s.title||'').toLowerCase()==='workshop'); setWorkshopId(ws?.id || null); } catch {} })(); }, []);

  const baseRows: Row[] = React.useMemo(() => {
    const list: Row[] = [];
    list.push({ kind: 'page', id: 'forum', title: 'Форум', subtitle: 'Навигация', url: baseUrl('/forum') });
    list.push({ kind: 'page', id: 'favorites', title: 'Избранное', subtitle: 'Страница', url: baseUrl('/favorites') });
    list.push({ kind: 'page', id: 'settings', title: 'Настройки', subtitle: 'Страница', url: baseUrl('/settings') });
    for (const r of rolesData) list.push({ kind: 'role', id: r.id, title: r.role, subtitle: 'Раздел', url: baseUrl(`/roles/${r.id}`) });
    for (const l of lawsData) list.push({ kind: 'law', id: l.slug, title: l.title, subtitle: 'Закон', url: baseUrl(`/laws/${l.slug}`) });
    for (const v of vuDocs) list.push({ kind: 'vu', id: v.id, title: v.title, subtitle: 'ВУ', url: baseUrl(`/vu/${v.id}`) });
    const qq = q.trim().toLowerCase();
    if (qq) list.push(...indexLawMatches(qq).slice(0, 60));
    if (!qq) return list.slice(0, 20);
    const pool = flt==='all' ? list : list.filter(r=>r.kind===flt);
    return pool
      .map((r) => ({ r, score: simpleScore(`${r.title} ${r.subtitle || ''}`.toLowerCase(), qq) + (((r as any).__boost) || 0) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.r);
  }, [q, flt]);

  // Recent disabled from UI but keep dataset as a safety net
  const rows = baseRows;

  function simpleScore(hay: string, needle: string) {
    const terms = needle.split(/\s+/).filter(Boolean);
    return terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
  }

  function indexLawMatches(qq: string): Row[] {
    const out: Row[] = [];
    const slugify = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-').slice(0, 80);
    for (const l of lawsData) {
      const text = (l.content || '').replace(/\r\n?/g, '\n');
      const lines = text.split('\n');
      let curHead = '';
      let curId = '';
      const added = new Set<string>();
      for (const raw of lines) {
        const s = raw.trim();
        const m = /^(#{2,6})\s*(.+)$/.exec(s);
        if (m) {
          curHead = m[2].trim();
          curId = slugify(curHead) || '';
          const headL = curHead.toLowerCase();
          if (curId && headL.includes(qq)) {
            const key = `${l.slug}#${curId}`;
            if (!added.has(key)) {
              const row: Row = { kind: 'law', id: key, title: `${l.title} — ${curHead}`, subtitle: 'Заголовок', url: baseUrl(`/laws/${l.slug}?q=${encodeURIComponent(qq)}#${curId}`) };
              (row as any).__boost = headL.startsWith(qq) ? 8 : 6;
              out.push(row); added.add(key);
            }
          }
          continue;
        }
        if (s && s.toLowerCase().includes(qq)) {
          const key = curId ? `${l.slug}#${curId}` : l.slug;
          if (!added.has(key)) {
            const snippet = s.length > 140 ? s.slice(0, 137) + '…' : s;
            const title = curId ? `${l.title} — ${curHead}` : l.title;
            const url = curId ? baseUrl(`/laws/${l.slug}?q=${encodeURIComponent(qq)}#${curId}`) : baseUrl(`/laws/${l.slug}?q=${encodeURIComponent(qq)}`);
            const row: Row = { kind: 'law', id: key, title, subtitle: snippet || 'Контекст', url };
            (row as any).__boost = 5;
            out.push(row); added.add(key);
          }
        }
      }
    }
    const seen = new Set<string>();
    return out.filter(r => (seen.has(r.id) ? false : (seen.add(r.id), true)));
  }

  function go(to: string) {
    setOpen(false);
    try { window.location.href = to; } catch { location.assign(to); }
  }

  function onKeyList(e: React.KeyboardEvent) {
    if (!rows.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, rows.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); go(rows[idx].url); }
  }

  const Panel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    if (styleMode === 'liquid') {
      return (
        <LiquidGlass className="w-full max-w-2xl p-3 text-white" blur={26} tint="16 18 34" opacity={0.24} gloss={0.7} elevation={1.2} interactive={false}>
          {children}
        </LiquidGlass>
      );
    }
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-softLg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
        {children}
      </div>
    );
  };

  return (
    <>
      {!open ? null : (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Поиск">
          <Panel>
            <div className="mb-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => { setQ(e.target.value); setIdx(0); }}
                onKeyDown={onKeyList}
                placeholder="Поиск: закон, роль, ВУ..."
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
              <button className="btn text-zinc-600 dark:text-zinc-300" onClick={() => setOpen(false)} aria-label="Закрыть"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-2 flex items-center gap-2">
              {([
                {k:'all', label:'Все'},
                {k:'role', label:'Роли'},
                {k:'law', label:'Законы'},
                {k:'vu', label:'ВУ'},
              ] as any[]).map((c)=> (
                <button key={c.k} onClick={()=>{ setFlt(c.k); setIdx(0); }} className={`chip ${flt===c.k? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-white dark:bg-zinc-900'}`}>{c.label}</button>
              ))}
            </div>
            <div className="max-h-80 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
              {!rows.length && (
                <div className="p-3 text-sm text-zinc-500 dark:text-zinc-400">Ничего не найдено</div>
              )}
              {rows.map((r, i) => (
                <button
                  key={`${r.kind}:${r.id}`}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800 ${i === idx ? 'bg-indigo-500/15 dark:bg-indigo-500/20' : ''}`}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => go(r.url)}
                >
                  <span className="inline-flex items-center gap-2">
                    {r.kind === 'law' && <BookOpen className="h-4 w-4" />}
                    {r.kind === 'role' && <Users className="h-4 w-4" />}
                    {r.kind === 'vu' && <Shield className="h-4 w-4" />}
                    {r.kind === 'page' && (r.id === 'settings' ? <Settings className="h-4 w-4" /> : <Star className="h-4 w-4" />)}
                    <span className="font-medium">{r.title}</span>
                  </span>
                  {r.subtitle && (
                    <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">{r.subtitle}</span>
                  )}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}


