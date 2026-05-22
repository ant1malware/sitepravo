import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { lawsData } from './laws';
import { escapeHtml, escRe, termsFrom, normalizeQuery } from './utils/strings';
import { getAllLawSections, findArticleAnchor as resolveLawAnchor, normalizeLawText } from './utils/lawSections';

const DIRECT_LAW_HINTS: Array<[RegExp, string]> = [
  [new RegExp('(^|\\\s)(?:uk|\\u0443\\u043a|\\u0443\\u0433\\u043e\\u043b\\u043e\\u0432[\\s\\S]*?)\\b','i'), 'uk'],
  [new RegExp('(^|\\\s)(?:koap|\\u043a\\u043e\\u0430\\u043f|\\u0430\\u0434\\u043c\\u0438\\u043d[\\s\\S]*?)\\b','i'), 'koap'],
  [new RegExp('(^|\\\s)(?:upk|\\u0443\\u043f\\u043a|\\u0443\\u0433\\u043e\\u043b\\u043e\\u0432\\u043d\\u043e[\\s\\S]*?\\u043f\\u0440\\u043e\\u0446[\\s\\S]*?)\\b','i'), 'upk'],
  [new RegExp('(^|\\\s)(?:tk|\\u0442\\u043a|\\u0442\\u0440\\u0443\\u0434\\u043e[\\s\\S]*?)\\b','i'), 'tk'],
  [new RegExp('(^|\\\s)(?:gk|\\u0433\\u043a|\\u0433\\u0440\\u0430\\u0436\\u0434[\\s\\S]*?)\\b','i'), 'gk'],
];

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
  const navigate = useNavigate();

  const lawSections = React.useMemo(() => getAllLawSections(), []);
  const lawBySlug = React.useMemo(() => {
    const map = new Map<string, typeof lawsData[number]>();
    lawsData.forEach((law) => map.set(law.slug, law));
    return map;
  }, []);

  React.useEffect(() => {
    (async () => {
      await ensureFlex();
      const { Document } = (window as any).FlexSearch;
      const index = new Document({
        cache: true,
        tokenize: 'forward',
        document: { id: 'id', index: [{ field: 'abbr' }, { field: 'title' }, { field: 'text' }], store: ['slug', 'title', 'excerpt', 'abbr', 'kind'] }
      });

      const docs: any[] = [];
      lawSections.forEach((sec, idx) => {
        const law = lawBySlug.get(sec.lawSlug);
        const path = sec.anchor ? `${sec.lawSlug}#${sec.anchor}` : sec.lawSlug;
        docs.push({
          id: `section:${path}:${idx}`,
          slug: path,
          title: sec.head ? `${law?.title || sec.lawTitle} — ${sec.head}` : law?.title || sec.lawTitle,
          abbr: (law as any)?.abbr,
          text: `${sec.head}\n${sec.fullText}\n${law?.title || ''}`,
          excerpt: sec.fullText || sec.head || law?.notes || '',
          kind: 'section'
        });
      });

      lawsData.forEach((law) => {
        docs.push({
          id: `law:${law.slug}`,
          slug: law.slug,
          title: law.title,
          abbr: (law as any).abbr,
          text: `${law.title}\n${law.content}`,
          excerpt: law.notes || '',
          kind: 'law'
        });
      });

      const docMap = new Map<string, any>();
      docs.forEach((d) => { index.add(d); docMap.set(d.id, d); });
      (window as any).__LAW_INDEX2__ = index;
      (window as any).__LAW_DOCS2__ = docs;
      (window as any).__LAW_DOC_MAP2__ = docMap;
      setReady(true);
    })();
  }, [lawSections, lawBySlug]);

  // moved to utils/strings

  // moved to utils/strings

  function highlight(text: string, q: string) {
    let out = escapeHtml(text);
    const terms = termsFrom(q);
    if (!terms.length) return out;
    // Подсвечиваем только слова длиной >=2 или числа; собираем общий регекс
    const re = new RegExp(`(${terms.map(escRe).join('|')})`, 'gi');
    return out.replace(re, '<mark>$1</mark>');
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

  // Прямой переход по запросам вида: "ук 105", "коап 12.8", "ст 105 ук", "глава 1 ук"
  function directJumpUrl(input: string): string | null {
    const normalized = normalizeLawText(input).replace(/\s+/g, ' ').trim();
    if (!normalized) return null;

    let slug: string | null = null;
    for (const [pattern, code] of DIRECT_LAW_HINTS) {
      if (pattern.test(input) || pattern.test(normalized)) {
        slug = code;
        break;
      }
    }

    if (!slug) {
      const numGuess = normalized.match(/\d+(?:\.\d+)?/);
      if (numGuess) {
        const number = numGuess[0];
        const hits = lawSections.filter((sec) => {
          const headNorm = normalizeLawText(sec.head);
          return headNorm.includes(`������ ${number}`) || headNorm.includes(`����� ${number}`);
        });
        const unique = Array.from(new Set(hits.map((sec) => sec.lawSlug)));
        if (unique.length === 1) slug = unique[0];
      }
    }

    if (!slug) return null;

    let kind: 'article' | 'chapter' = 'article';
    if (normalized.includes('�����') || normalized.includes('������')) kind = 'chapter';

    const numMatch = normalized.match(/\d+(?:\.\d+)?/);
    if (!numMatch) return `/laws/${slug}`;
    const number = numMatch[0];
    const anchor = resolveLawAnchor(slug, number, kind, normalizeLawText);
    return anchor ? `/laws/${slug}#${anchor}` : `/laws/${slug}`;
  }
  // Автопереход при распознавании запроса
  React.useEffect(() => {
    const t = setTimeout(() => {
      const dj = directJumpUrl(q);
      if (dj) {
        const url = dj.includes('#') ? dj.replace('#', `?q=${encodeURIComponent(q)}#`) : `${dj}?q=${encodeURIComponent(q)}`;
        navigate(url);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q, navigate]);


  async function doSearch(s: string) {
    const idx = (window as any).__LAW_INDEX2__;
    const docMap = (window as any).__LAW_DOC_MAP2__ as Map<string, any>;
    if (!idx || !docMap) return;

    const directUrl = directJumpUrl(s);
    if (directUrl) {
      const clean = directUrl.replace(/^\/laws\//, '');
      const [slugPart = '', anchorPart = ''] = clean.split('#');
      const law = lawBySlug.get(slugPart);
      let title = law?.title || '������ ����������';
      if (anchorPart) {
        const sec = lawSections.find((section) => section.lawSlug === slugPart && section.anchor === anchorPart);
        if (sec?.head) title = `${law?.title || sec.lawTitle} � ${sec.head}`;
      }
      setResults([{ url: directUrl, title, excerpt: s }]);
      return;
    }

    const found = idx.search(normalizeQuery(s), { enrich: true, limit: 30 }) as any[];
    const ids = new Set<string>();
    const rows: any[] = [];

    for (const block of found) {
      for (const r of block.result) {
        if (ids.has(r.id)) continue;
        ids.add(r.id);
        const d = docMap.get(r.id);
        if (!d) continue;
        const ex = d.excerpt || d.title;
        const sn = snippet(d.text || ex, q);
        rows.push({ url: `/laws/${d.slug}`, title: d.title, excerpt: sn, abbr: d.abbr, kind: d.kind });
      }
    }

    rows.sort((a, b) => {
      if (a.kind === b.kind) return 0;
      if (a.kind === 'section') return -1;
      if (b.kind === 'section') return 1;
      return 0;
    });

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
        <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>{ if(e.key=='Enter'){ const dj = directJumpUrl(q); if (dj) { const url = dj.includes('#') ? dj.replace('#', `?q=${encodeURIComponent(q)}#`) : `${dj}?q=${encodeURIComponent(q)}`; navigate(url); } } }} placeholder="Поиск по всем законам (статьи, названия, аббревиатуры)…" className="w-full rounded-xl border border-zinc-200 px-3 py-1.5 text-sm focus:outline-none focus:ring dark:border-zinc-700 dark:bg-zinc-900/50" />
      </div>
      {!!results.length && (
        <div className="mt-3 grid gap-2">
          {results.map((r,i)=> (
            <Link
              key={i}
              to={r.url.includes('#') ? r.url.replace('#', `?q=${encodeURIComponent(q)}#`) : `${r.url}?q=${encodeURIComponent(q)}`}
              className="block rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
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








