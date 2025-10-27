import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { lawsData } from "./laws";
import { ArrowLeft, BookOpen, Search, ListTree, Copy, Printer, Menu, Type, Plus, Minus, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { toggleFavoriteMeta } from "./favorites";
import FavStar from "./FavStar";
import ContextText from "./ContextText";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { headingToAnchor } from "./utils/lawSections";

const escapeReg = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const clamp01 = (x: number) => clamp(x, 0, 1);
const debounce = <F extends (...a: any[]) => void>(fn: F, ms = 250) => { let t: any; return (...args: Parameters<F>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
function normalizeTitle(x?: string) { return (x || "").toLowerCase().replace(/[«»"'\s]+/g, " ").trim(); }

function fixMdForLaw(src: string, title?: string) {
  let s = src.replace(/\r\n?/g, "\n");
  s = s.replace(/^\s*#\s+(.+)\s*\n/, (m, h) => (normalizeTitle(h) === normalizeTitle(title) ? "" : m));
  s = s.replace(/^(?![#>])\s*(Глава\s+\d+[^\n]*)$/gim, "## $1");
  s = s.replace(/^(?![#>])\s*(Раздел\s+\d+[^\n]*)$/gim, "## $1");
  s = s.replace(/^(?![#>])\s*((?:Статья|Ст\.?|Ст)\s+\d+(?:\.\d+)?[^\n]*)$/gim, "### $1");
  s = s.replace(/^(#{2,6})([^\s#])/gm, "$1 $2");
  s = s.replace(/^\s*(\d+)\)\s+/gm, "$1. ");
  return s;
}

type FlatToc = { id: string; text: string; level: number };
type TocNode = { id: string; text: string; level: number; children: TocNode[] };

function buildTocTree(items: FlatToc[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];
  for (const it of items) {
    const node: TocNode = { ...it, children: [] };
    while (stack.length && stack[stack.length - 1].level >= it.level) stack.pop();
    if (!stack.length) root.push(node); else stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root;
}

function addAnchorsAndToc(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  try {
    const base = (import.meta as any).env?.BASE_URL || import.meta.env.BASE_URL || "/";
    doc.querySelectorAll("img").forEach((img) => {
      const src = (img.getAttribute("src") || "").trim();
      if (/^(?:\/)?img\//.test(src)) {
        const clean = src.replace(/^\/+/, "");
        img.setAttribute("src", `${base}${clean}`);
      }
      const alt = img.getAttribute("alt") || "";
      if (!img.getAttribute("title") && alt) img.setAttribute("title", alt);
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });
  } catch {}
  doc.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  const headings = Array.from(doc.querySelectorAll("h2, h3, h4"));
  const toc: FlatToc[] = [];

  headings.forEach((h, i) => {
    const txt = h.textContent || "";
    const id = headingToAnchor(txt) || `h-${i + 1}`;
    if (id) h.id = id;
    const level = h.tagName === "H2" ? 2 : h.tagName === "H3" ? 3 : 4;
    toc.push({ id, text: txt, level });
  });

  return { html: doc.body.innerHTML, toc };
}

function highlightHtml(html: string, terms: string[]) {
  if (!terms.length) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const SKIP = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "MARK", "KBD"]);
  const re = new RegExp(`(${terms.map(escapeReg).join("|")})`, "gi");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, { acceptNode(n: Node) { const p = (n as any).parentElement?.tagName || ""; return (SKIP as any).has(p) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } } as any);
  const nodes: Text[] = [];
  while (walker.nextNode()) { const node = walker.currentNode as Text; if (re.test(node.nodeValue || "")) nodes.push(node); }
  nodes.forEach((node) => {
    const text = node.nodeValue || "";
    const frag = doc.createDocumentFragment();
    let last = 0;
    text.replace(re, (match, _g, offset) => { if (offset > last) frag.appendChild(doc.createTextNode(text.slice(last, offset))); const m = doc.createElement("mark"); m.textContent = match; frag.appendChild(m); last = offset + match.length; return match; });
    if (last < text.length) frag.appendChild(doc.createTextNode(text.slice(last)));
    node.replaceWith(frag);
  });
  return doc.body.innerHTML;
}

export default function LawPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const law = lawsData.find((l) => l.slug === slug);

  const [rawHtml, setRawHtml] = useState("");
  const [tocFlat, setTocFlat] = useState<FlatToc[]>([]);
  const [tocTree, setTocTree] = useState<TocNode[]>([]);
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fontScale, setFontScale] = useState<number>(() => Number(localStorage.getItem("law.fontScale") || 105));
  const [narrow, setNarrow] = useState<boolean>(() => localStorage.getItem("law.narrow") === "1");
  const [tocWidth, setTocWidth] = useState<number>(() => Number(localStorage.getItem("law.tocWidth") || 300));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [tocFilter, setTocFilter] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const marksRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const markIndexRef = useRef(0);
  const tocListRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartW = useRef(0);

  useEffect(() => {
    if (!law) return;
    document.title = law.title;
    const prepared = fixMdForLaw(law.content, law.title);
    const html = marked.parse(prepared, { gfm: true, breaks: true }) as string;
    const safe = (DOMPurify.sanitize(html, { USE_PROFILES: { html: true } } as any) as unknown) as string;
    const { html: withAnchors, toc } = addAnchorsAndToc(safe);
    setRawHtml(withAnchors);
    setTocFlat(toc);
    setTocTree(buildTocTree(toc));
    setActiveId("");
    setCollapsed({});
  }, [slug]);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const init = sp.get("q") || "";
    if (init) setQ(init);
  }, [location.search]);

  const syncQToUrl = useMemo(() => debounce((val: string) => {
    const sp = new URLSearchParams(location.search);
    if (val) sp.set("q", val); else sp.delete("q");
    navigate({ pathname: location.pathname, search: sp.toString() }, { replace: true });
  }, 300), [location.pathname, location.search, navigate]);
  useEffect(() => { syncQToUrl(q); }, [q, syncQToUrl]);

  useEffect(() => {
    const rootEl = containerRef.current;
    const curLaw = law;
    if (!rootEl || !curLaw) return;

      async function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;      // removed link copy button behavior
      const a = (t.closest?.("a") as HTMLAnchorElement | null) || null;
      if (a && a.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = a.getAttribute("href")!.slice(1);
        const el = rootEl!.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
        if (el) {
          try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch { el.scrollIntoView(); }
          history.replaceState(null, "", `#${id}`);
        }
      }
    }
    rootEl.addEventListener("click", onClick);
    return () => rootEl.removeEventListener("click", onClick);
  }, [rawHtml, law, location.pathname]);

  const filteredHtml = useMemo(() => {
    if (!q.trim() || !rawHtml) return rawHtml;
    const terms = q.toLowerCase().replace(/ё/g, "е").trim().split(/\s+/).filter(Boolean).filter((t) => t.length >= 2 || /\d/.test(t));
    if (!terms.length) return rawHtml;
    return highlightHtml(rawHtml, terms);
  }, [q, rawHtml]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    marksRef.current = root.querySelectorAll<HTMLElement>("mark");
    markIndexRef.current = 0;
    if (!q.trim()) return;
    const first = marksRef.current[0];
    if (first) { try { first.scrollIntoView({ behavior: "smooth", block: "center" }); } catch { first.scrollIntoView(); } }
  }, [filteredHtml, q]);

  const gotoMark = useCallback((dir: 1 | -1) => {
    const marks = marksRef.current;
    if (!marks || marks.length === 0) return;
    markIndexRef.current = (markIndexRef.current + dir + marks.length) % marks.length;
    const el = marks[markIndexRef.current];
    try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch { el.scrollIntoView(); }
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const headings = root.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]");
    if (!headings.length) return;
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target) setActiveId((visible[0].target as HTMLElement).id);
    }, { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [filteredHtml]);

  useEffect(() => {
    const savePos = debounce((y: number) => { if (!slug) return; localStorage.setItem(`law.pos.${slug}`, String(y)); }, 300);
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const docTop = window.scrollY || document.documentElement.scrollTop;
      const start = docTop + rect.top;
      const total = el.offsetHeight - window.innerHeight;
      const cur = clamp01((docTop - start) / Math.max(total, 1));
      setProgress(Math.round(cur * 100));
      savePos(window.scrollY || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [filteredHtml, slug]);

  useEffect(() => {
    if (!slug) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) { setTimeout(() => { try { (el as HTMLElement).scrollIntoView({ behavior: "instant", block: "start" as any }); } catch { (el as HTMLElement).scrollIntoView(); } }, 0); }
      return;
    }
    const saved = Number(localStorage.getItem(`law.pos.${slug}`) || 0);
    if (saved > 0) window.scrollTo({ top: saved });
  }, [slug, filteredHtml]);

  useEffect(() => { document.documentElement.style.overflow = isTocOpen || isSearchOpen ? "hidden" : ""; return () => void (document.documentElement.style.overflow = ""); }, [isTocOpen, isSearchOpen]);

  const smartBack = useCallback(() => {
    if (window.history.length > 1) { navigate(-1); return; }
    const st = location.state as any;
    if (st?.from) { navigate(st.from); return; }
    navigate("/");
  }, [navigate, location.state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as any)?.isContentEditable;
      if (!typing && (e.key === "Backspace" || (e.altKey && e.key === "ArrowLeft"))) { e.preventDefault(); smartBack(); return; }
      if (!typing && e.key === "/") { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === "Escape") { if (isSearchOpen) setIsSearchOpen(false); if (isTocOpen) setIsTocOpen(false); if (q) setQ(""); }
      if (!typing && (e.key === "Enter" || e.key === "ArrowDown")) { if (q) { e.preventDefault(); gotoMark(1); } }
      if (!typing && e.key === "ArrowUp") { if (q) { e.preventDefault(); gotoMark(-1); } }
      if (!typing && (e.key === "[" || (e.ctrlKey && e.key === "-"))) { e.preventDefault(); setFontScale((v) => clamp(v - 5, 90, 150)); }
      if (!typing && (e.key === "]" || (e.ctrlKey && e.key === "="))) { e.preventDefault(); setFontScale((v) => clamp(v + 5, 90, 150)); }
      if (!typing && e.key.toLowerCase() === "t") setIsTocOpen((v) => !v);
      if (!typing && e.key.toLowerCase() === "w") setNarrow((v) => !v);
      if (!typing && e.key.toLowerCase() === "f") { if (law) toggleFavoriteMeta("law", law.slug, { title: law.title, url: `/laws/${law.slug}` }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [smartBack, gotoMark, q, isSearchOpen, isTocOpen, law]);

  useEffect(() => { localStorage.setItem("law.fontScale", String(fontScale)); }, [fontScale]);
  useEffect(() => { localStorage.setItem("law.narrow", narrow ? "1" : "0"); }, [narrow]);
  useEffect(() => { localStorage.setItem("law.tocWidth", String(tocWidth)); }, [tocWidth]);

  if (!law) {
    return (<div className="p-4">Закон не найден. <Link to="/" className="text-blue-600 underline">На главную</Link></div>);
  }

  const copyPageLink = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const printPage = () => window.print();

  const marksTotal = marksRef.current?.length || 0;
  const marksIndexHuman = marksTotal ? markIndexRef.current + 1 : 0;

  const toggleCollapse = (id: string) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));
  const expandAll = () => setCollapsed({});
  const collapseAll = () => { const folded: Record<string, boolean> = {}; for (const n of tocTree) folded[n.id] = true; setCollapsed(folded); };

  const filterMatch = (txt: string, q: string) => txt.toLowerCase().includes(q.toLowerCase().trim());
  const filteredTocTree = useMemo(() => {
    if (!tocFilter.trim()) return tocTree;
    const dfs = (nodes: TocNode[]): TocNode[] =>
      nodes.map((n) => { const kids = dfs(n.children); if (filterMatch(n.text, tocFilter) || kids.length) return { ...n, children: kids }; return null as any; }).filter(Boolean) as TocNode[];
    return dfs(tocTree);
  }, [tocTree, tocFilter]);

  useEffect(() => {
    if (!activeId) return;
    const host = (document.getElementById('toc-list') || null) as HTMLDivElement | null;
    const container = host || tocListRef.current;
    if (!container) return;
    const active = container.querySelector(`[data-id="${CSS.escape(activeId)}"]`);
    if (!active) return;
    const r = (active as HTMLElement).getBoundingClientRect();
    const R = container.getBoundingClientRect();
    if (r.top < R.top || r.bottom > R.bottom) (active as HTMLElement).scrollIntoView({ block: "nearest" });
  }, [activeId]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStartX.current;
      const w = clamp(dx + dragStartW.current, 240, 420);
      setTocWidth(w);
    };
    const onUp = () => (draggingRef.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 print:hidden">
        <div className="relative mx-auto max-w-6xl px-4 py-3">
          <div aria-hidden className="pointer-events-none absolute inset-x-10 -top-16 h-24 rounded-[2rem] blur-2xl" style={{ background: "linear-gradient(90deg, rgba(14,165,233,.18), rgba(139,92,246,.18))" }} />
          <div className="relative flex items-center justify-between gap-3">
            <button type="button" onClick={smartBack} className="group inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1.5 text-sm text-zinc-700 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100" title="Назад">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /></span>
              <span className="hidden sm:inline">Назад</span>
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center text-center">
              <div className="flex min-w-0 flex-col items-center">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm"><BookOpen className="h-4 w-4" /></div>
                  <h1 className="truncate text-base font-bold leading-tight sm:text-lg">{law.title}</h1>
                  <Sparkles className="hidden h-5 w-5 text-indigo-400 sm:block" />
                </div>
                <ContextText />
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button className="rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 text-xs shadow-sm backdrop-blur hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60" title="Скопировать ссылку на страницу" onClick={copyPageLink}><div className="flex items-center gap-1"><Copy className="h-3.5 w-3.5" /> Ссылка</div></button>
              <button className="rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 text-xs shadow-sm backdrop-blur hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60" title="Печать" onClick={printPage}><div className="flex items-center gap-1"><Printer className="h-3.5 w-3.5" /> Печать</div></button>
              <FavStar kind="law" id={law.slug} title={law.title} url={`/laws/${law.slug}`} />
              {law.updated ? (<span className="rounded-full bg-gradient-to-r from-sky-500/10 to-indigo-500/10 px-2 py-0.5 text-[11px] text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300">Обновлено: {law.updated}</span>) : null}
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={() => setIsSearchOpen(true)} className="rounded-xl border border-zinc-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60" title="Поиск"><Search className="h-5 w-5" /></button>
              <button onClick={() => setIsTocOpen(true)} className="rounded-xl border border-zinc-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60" title="Содержание"><Menu className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-zinc-200 to-zinc-200 dark:from-zinc-800 dark:to-zinc-800"><div className="h-0.5 transition-[width] duration-150 ease-out" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)" }} /></div>
      </header>

      <div className="sticky top-[3.1rem] z-30 hidden border-b border-white/40 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50 sm:block print:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5 text-zinc-500" />
            <button className="rounded-lg border border-zinc-200/80 bg-white/70 p-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" onClick={() => setFontScale((v) => clamp(v - 5, 90, 150))} title="Меньше"><Minus className="h-3.5 w-3.5" /></button>
            <span className="tabular-nums w-12 text-center text-zinc-600 dark:text-zinc-300">{fontScale}%</span>
            <button className="rounded-lg border border-zinc-200/80 bg-white/70 p-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" onClick={() => setFontScale((v) => clamp(v + 5, 90, 150))} title="Больше"><Plus className="h-3.5 w-3.5" /></button>
          </div>

          <div className="h-5 w-px bg-zinc-200/70 dark:bg-white/10" />
          <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" onClick={() => setNarrow((v) => !v)} title={narrow ? "Сделать шире" : "Узкая колонка"}>{narrow ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}{narrow ? "Шире" : "Узко"}</button>
          <div className="h-5 w-px bg-zinc-200/70 dark:bg-white/10" />

          <div className="hidden items-center gap-2 md:flex">
            <Search className="h-4 w-4 text-zinc-500" />
            <input ref={searchInputRef} className="w-[420px] rounded-xl border border-zinc-200/80 bg-white/70 px-3 py-1.5 outline-none ring-0 backdrop-blur transition placeholder:text-zinc-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-zinc-900/60 dark:focus:border-sky-500/60 dark:focus:ring-sky-500/20" placeholder="Поиск по тексту (/ — фокус, Enter/↓ — след., ↑ — пред.)" value={q} onChange={(e) => setQ(e.target.value)} />
            {!!q && (
              <>
                <button className="rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" title="Предыдущее совпадение" onClick={() => gotoMark(-1)}>↑</button>
                <button className="rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" title="Следующее совпадение" onClick={() => gotoMark(1)}>↓</button>
                <div className="min-w-[90px] text-center text-zinc-500">{marksTotal ? `${marksIndexHuman}/${marksTotal}` : ""}</div>
                <button className="rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" title="Очистить" onClick={() => setQ("")}>Очистить</button>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-6 md:grid-cols-[var(--tocW),1fr]" style={{ ["--tocW" as any]: `${tocWidth}px` } as React.CSSProperties}>
        <aside className="relative hidden md:block print:hidden">
          <div className="absolute -right-2 top-0 z-10 hidden h-full w-4 cursor-col-resize md:block" onMouseDown={(e)=>{draggingRef.current=true; dragStartX.current=e.clientX; dragStartW.current=tocWidth;}} title="Потяни, чтобы изменить ширину" />
          <div className="sticky top-[7.6rem] rounded-2xl border border-white/60 bg-white/80 p-3 text-sm shadow-lg shadow-black/5 backdrop-blur-xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-900/60 dark:ring-white/5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold"><div className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-500 text-white"><ListTree className="h-3.5 w-3.5" /></div>Содержание</div>
              <div className="flex items-center gap-1">
                <button className="rounded-lg border border-zinc-200/80 bg-white/70 px-2 py-1 text-xs hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" onClick={expandAll} title="Развернуть всё">+ всё</button>
                <button className="rounded-lg border border-zinc-200/80 bg-white/70 px-2 py-1 text-xs hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60" onClick={collapseAll} title="Свернуть всё">− всё</button>
                {null}
              </div>
            </div>

            <div className="mb-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <input value={tocFilter} onChange={(e)=>setTocFilter(e.target.value)} placeholder="Фильтр по содержанию…" className="w-full rounded-lg border border-zinc-200/80 bg-white/70 px-2 py-1 text-xs outline-none ring-0 backdrop-blur transition placeholder:text-zinc-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-zinc-900/60 dark:focus:border-sky-500/60 dark:focus:ring-sky-500/20" />
            </div>

            {!tocFlat.length ? (
              <div className="text-xs text-zinc-500">Добавьте заголовки (##/###) в Markdown, чтобы появилось оглавление.</div>
            ) : (
              <div ref={tocListRef} id="toc-list" className="max-h-[60vh] overflow-y-auto pr-1.5">
                <TocList nodes={filteredTocTree} activeId={activeId} collapsed={collapsed} onToggle={(id)=>toggleCollapse(id)} onClick={(id)=>{const el=document.getElementById(id); if(el){ try{el.scrollIntoView({behavior:'smooth',block:'start'});}catch{el.scrollIntoView();} history.replaceState(null,"",`#${id}`); }}} />
              </div>
            )}
          </div>
        </aside>

        <section>
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-500 print:hidden">
            <Link to="/" className="group inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/60">Главная</Link>
            <span className="text-zinc-400">/</span>
            <span className="rounded-lg px-1.5 py-0.5 text-zinc-600 dark:text-zinc-300">Законы</span>
            <span className="text-zinc-400">/</span>
            <span className="rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-500/10 px-1.5 py-0.5 text-zinc-700 dark:text-zinc-200">{law.title}</span>
          </nav>

          <div className={`reading ${narrow ? "max-w-[84ch]" : "max-w-none"}`}>
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-900/60 dark:ring-white/5">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)" }} aria-hidden />
              <div className="law prose prose-zinc max-w-none list-inside px-5 py-5 md:px-7 md:py-7 dark:prose-invert" style={{ fontSize: `${fontScale}%` }} ref={containerRef} dangerouslySetInnerHTML={{ __html: filteredHtml }} />
            </div>
          </div>
        </section>
      </main>
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-sm md:hidden" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setIsTocOpen(false); }}>
          <div className="w-full max-w-md rounded-t-3xl border border-white/10 bg-white/95 p-4 shadow-xl dark:border-white/10 dark:bg-zinc-900/95">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">����������</span>
              <button onClick={() => setIsTocOpen(false)} className="rounded-full border border-zinc-200/70 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800">�������</button>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/70 px-2 py-1 text-xs shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
                <Search className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                <input value={tocFilter} onChange={(e)=>setTocFilter(e.target.value)} placeholder="����� �� ����������" className="w-full bg-transparent outline-none" />
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <TocList
                nodes={filteredTocTree}
                activeId={activeId}
                collapsed={collapsed}
                onToggle={(id)=>toggleCollapse(id)}
                onClick={(id)=>{
                  setIsTocOpen(false);
                  const el=document.getElementById(id);
                  if(el){
                    try{el.scrollIntoView({behavior:'smooth',block:'start'});}catch{el.scrollIntoView();}
                    history.replaceState(null,"",`#${id}`);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TocList({ nodes, activeId, collapsed, onToggle, onClick }: { nodes: TocNode[]; activeId: string; collapsed: Record<string, boolean>; onToggle: (id: string) => void; onClick: (id: string) => void; }) {
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className={`flex items-center gap-2 rounded-md px-2 py-1 ${activeId === n.id ? "bg-sky-500/10 text-sky-700 dark:text-sky-300" : ""}`}>
            {n.children.length ? (
              <button onClick={() => onToggle(n.id)} className="rounded border border-zinc-200/80 px-1 text-[10px] dark:border-white/10">{collapsed[n.id] ? "+" : "−"}</button>
            ) : (<span className="w-4" />)}
            <a href={`#${n.id}`} className="truncate" onClick={(e)=>{e.preventDefault(); onClick(n.id);}} data-id={n.id} title={n.text}>{n.text}</a>
          </div>
          {!!n.children.length && !collapsed[n.id] && (
            <div className="ml-4"><TocList nodes={n.children} activeId={activeId} collapsed={collapsed} onToggle={onToggle} onClick={onClick} /></div>
          )}
        </li>
      ))}
    </ul>
  );
}
