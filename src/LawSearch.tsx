import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Input from './ui/Input';
import { lawsData } from './laws';
import { slugify, escapeHtml, escRe, termsFrom, normalizeQuery } from './utils/strings';

function ensureFlex(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).FlexSearch) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/flexsearch@0.7.31/dist/flexsearch.bundle.js';
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
}

// moved to utils/strings

export default function LawSearch() {
  const [ready, setReady] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      await ensureFlex();
      const { Document } = (window as any).FlexSearch;
      const index = new Document({
        cache: true,
        tokenize: 'forward',
        document: { id: 'id', index: [{ field: 'abbr' }, { field: 'title' }, { field: 'text' }], store: ['slug', 'title', 'excerpt', 'abbr'] }
      });

      const docs: any[] = [];
      lawsData.forEach((law) => {
        const parts = law.content.split(/\n(?=##\s+)/g);
        if (parts.length === 1) {
          docs.push({ id: law.slug, slug: law.slug, title: law.title, abbr: (law as any).abbr, text: law.content, excerpt: law.notes || '' });
        } else {
          parts.forEach((md) => {
            const header = md.match(/^##\s+(.+)$/m)?.[1] || law.title;
            const id = slugify(header);
            docs.push({ id: `${law.slug}#${id}`, slug: `${law.slug}#${id}`, title: `${law.title} — ${header}`, abbr: (law as any).abbr, text: md, excerpt: header });
          });
        }
      });
      docs.forEach((d) => index.add(d));
      (window as any).__LAW_INDEX2__ = index;
      (window as any).__LAW_DOCS2__ = docs;
      setReady(true);
    })();
  }, []);

  // moved to utils/strings

  // moved to utils/strings

  function highlight(text: string, q: string) {
    let out = escapeHtml(text);
    const terms = termsFrom(q);
    for (const t of terms) out = out.replace(new RegExp(`(${escRe(t)})`, 'gi'), '<mark>$1</mark>');
    return out;
  }

  function snippet(text: string, q: string, len = 140) {
    const src = text.replace(/\s+/g,' ').trim();
    if (!q.trim()) return escapeHtml(src.slice(0, len)) + (src.length>len?'…':'');
    const terms = termsFrom(q);
    let pos = -1;
    for (const t of terms) {
      const p = src.toLowerCase().indexOf(t.toLowerCase());
      if (p !== -1 && (pos === -1 || p < pos)) pos = p;
    }
    const start = Math.max(0, pos>30?pos-30:0);
    const end = Math.min(src.length, start + len);
    const chunk = (start>0?'…':'') + src.slice(start, end) + (end<src.length?'…':'');
    return highlight(chunk, q);
  }

  function directJump(s: string): string | null {
    const str = s.toLowerCase().replace(/\s+/g,' ').trim();
    const m = str.match(/(?:ст\.?\s*)?(\d{1,3}(?:\.\d+)?)(?:\s*ст\.?\s*)?\s*(ук|коап)/i) || str.match(/(ук|коап)\s*(\d{1,3}(?:\.\d+)?)/i);
    if (!m) return null;
    const code = (m[1]==='ук' || m[2]==='ук') ? 'uk' : 'koap';
    const num = m[1]==='ук' || m[1]==='коап' ? m[2] : m[1];
    const law = lawsData.find(l => l.slug === code);
    if (!law) return null;
    const re = new RegExp(`^###\\s*Статья\\s*${num}\\b`, 'mi');
    const sec = law.content.split(/\n(?=###\s+)/g).find(s2 => re.test(s2));
    if (!sec) return `/laws/${law.slug}`;
    const header = sec.match(/^###\s*(.+)$/m)?.[1] || `Статья ${num}`;
    const id = slugify(header);
    return `/laws/${law.slug}#${id}`;
  }

  async function doSearch(s: string) {
    const idx = (window as any).__LAW_INDEX2__;
    const docs = (window as any).__LAW_DOCS2__ as any[];
    if (!idx || !docs) return;

    const dj = directJump(s);
    if (dj) { setResults([{ url: dj, title: 'Прямой переход', excerpt: s.toUpperCase() }]); return; }

    const found = idx.search(normalizeQuery(s), { enrich: true, limit: 30 }) as any[];
    const ids = new Set<string>();
    const rows: any[] = [];
    for (const block of found) {
      for (const r of block.result) {
        if (ids.has(r.id)) continue; ids.add(r.id);
        const d = docs.find(x => x.id === r.id); if (!d) continue;
        const ex = d.excerpt || d.title;
        const sn = snippet(d.text || ex, q);
        rows.push({ url: `/laws/${d.slug}`, title: d.title, excerpt: sn, abbr: d.abbr });
      }
    }
    setResults(rows);
  }

  React.useEffect(() => {
    if (!ready) return; if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(()=>doSearch(q), 120); return ()=>clearTimeout(t);
  }, [q, ready]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 text-xs text-zinc-600">Примеры: <code>ук 105</code>, <code>коап 12.8</code>, <code>дорожные знаки</code></div>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Поиск по всем законам (статьи, названия, аббревиатуры)…" className="border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900/50" />
      </div>
      {!!results.length && (
        <div className="mt-3 grid gap-2">
          {results.map((r,i)=> (
            <Link key={i} to={r.url} className="block rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold" dangerouslySetInnerHTML={{ __html: highlight(r.title, q) }} />
                {r.abbr && <span className="rounded-full border px-2 py-0.5 text-[10px]">{r.abbr}</span>}
              </div>
              <div className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: highlight(r.excerpt || '', q) }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
