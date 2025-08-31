import React from 'react';
import { Search, BookOpen, Users, Shield, X, Settings, Star } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { rolesData } from './roles';
import { lawsData } from './laws';
import { vuDocs } from './vu';

type Row = { kind: 'role' | 'law' | 'vu' | 'page'; id: string; title: string; subtitle?: string; url: string };

function baseUrl(path: string) {
  const b = (import.meta as any).env?.BASE_URL || import.meta.env.BASE_URL || '/';
  return `${b.replace(/\/$/, '')}${path}`;
}

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const [flt, setFlt] = React.useState<'all'|'role'|'law'|'vu'>(()=> (localStorage.getItem('cp_filter') as any) || 'all');
  React.useEffect(()=>{ try{ localStorage.setItem('cp_filter', flt);}catch{} }, [flt]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(true); setQ(''); setIdx(0); }
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const rows: Row[] = React.useMemo(() => {
    const list: Row[] = [];
    // Utility pages
    list.push({ kind: 'page', id: 'favorites', title: 'Избранное', subtitle: 'Страница', url: baseUrl('/favorites') });
    list.push({ kind: 'page', id: 'settings', title: 'Настройки', subtitle: 'Страница', url: baseUrl('/settings') });
    for (const r of rolesData) list.push({ kind: 'role', id: r.id, title: r.role, subtitle: 'Роль', url: baseUrl(`/roles/${r.id}`) });
    for (const l of lawsData) list.push({ kind: 'law', id: l.slug, title: l.title, subtitle: 'Закон', url: baseUrl(`/laws/${l.slug}`) });
    for (const v of vuDocs) list.push({ kind: 'vu', id: v.id, title: v.title, subtitle: 'ВУ', url: baseUrl(`/vu/${v.id}`) });
    const qq = q.trim().toLowerCase();
    if (!qq) return list.slice(0, 20);
    const pool = flt==='all' ? list : list.filter(r=>r.kind===flt);
    return pool
      .map((r) => ({ r, score: simpleScore(`${r.title} ${r.subtitle || ''}`.toLowerCase(), qq) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.r);
  }, [q, flt]);

  function simpleScore(hay: string, needle: string) {
    const terms = needle.split(/\s+/).filter(Boolean);
    return terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
  }

  function go(to: string) {
    setOpen(false);
    window.location.href = to;
  }

  function onKeyList(e: React.KeyboardEvent) {
    if (!rows.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, rows.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); go(rows[idx].url); }
  }

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur hover:bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
        onClick={() => setOpen(true)}
        title="Поиск (Ctrl/Cmd + K)"
        aria-label="Открыть поиск"
      >
        <Search className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
        <span className="hidden sm:inline">Поиск</span>
        <kbd className="ml-1 hidden sm:inline-flex items-center whitespace-nowrap font-mono rounded-md border border-zinc-400 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-900 shadow">{navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl K'}</kbd>
      </button>

      {!open ? null : (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Командная палитра">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-softLg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <div className="mb-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <Input
                autoFocus
                value={q}
                onChange={(e) => { setQ(e.target.value); setIdx(0); }}
                onKeyDown={onKeyList}
                placeholder="Роли, законы, уставы..."
                className="border-zinc-200 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
              <Button className="text-zinc-600 dark:text-zinc-300" onClick={() => setOpen(false)} aria-label="Закрыть поиск"><X className="h-4 w-4" /></Button>
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
              {!rows.length && (<div className="p-3 text-sm text-zinc-500 dark:text-zinc-400">Ничего не найдено</div>)}
              {rows.map((r, i) => (
                <button
                  key={`${r.kind}:${r.id}`}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800 ${i === idx ? 'bg-indigo-50 ring-1 ring-indigo-500/30 dark:bg-indigo-900/30' : ''}`}
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
                  <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">{r.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
