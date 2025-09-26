import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Copy,
  Search,
  BookOpen,
  Shield,
  Radio,
  Building2,
  MapPin,
  ClipboardList,
  FileText,
  Users,
  MessageSquare,
  Bug,
  Lightbulb,
  AlertCircle,
  Send,
  Settings,
 ListChecks, Home as HomeIcon } from "lucide-react";
import SimpleChat from "./components/SimpleChat";

import { rolesData } from "./roles";
import { lawsData } from "./laws";
import { vuDocs } from "./vu";
import { lectures, type LectureSection } from "./lectures";
import LawSearch from "./LawSearch";
import { interactionsData } from "./interactions";
// Resolve asset path with Vite base (for GitHub Pages)
const assetPath = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`;
import { iconForRoleName } from "./roleIcons";
import RelatedBlock from "./RelatedBlock";

import VoteWidget from "./VoteWidget";
import { isRecentlyUpdated } from "./versioning";
import ContextText from "./ContextText";
import ImportantRecordingBlock from "./components/ImportantRecordingBlock";


function safeGet(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string) {
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  } catch {}
}


// Keeps main tab state in sync with URL (?tab=... and #...)
const VALID_TABS_SET = new Set<string>();
function pickTabFromLocationAll(loc: Location, fallback: string) {
  const params = new URLSearchParams(loc.search || '');
  const q = (params.get('tab') || '').toLowerCase();
  const h = (loc.hash || '').replace(/^#/, '').toLowerCase();
  const id = (q || h || fallback).toLowerCase();
  return VALID_TABS_SET.has(id) ? id : fallback;
}
const TabSync: React.FC<{ current: string; onTab: (id: string) => void }> = ({ current, onTab }) => {
  const loc = useLocation();
  React.useEffect(() => {
    const next = pickTabFromLocationAll(loc as any, current);
    if (next !== current) onTab(next);
  }, [loc.search, loc.hash]);
  React.useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', current);
    url.hash = current;
    const next = url.pathname + url.search + url.hash;
    const cur  = window.location.pathname + window.location.search + window.location.hash;
    if (next !== cur) history.replaceState(null, '', next);
  }, [current]);
  return null;
};


const APPLY_FORUM: Record<string, string> = {
  guard: "https://forum.amazing-online.com/forums/mladshij-sostav/create-thread",
  lawyer: "https://forum.amazing-online.com/forums/mladshij-sostav/create-thread",
  inspector: "https://forum.amazing-online.com/forums/otchetnaya-deyatelnost-inspektorov/create-thread",
  advisor: "https://forum.amazing-online.com/forums/otchetnaya-deyatelnost-inspektorov/create-thread",
};

function buildApplyUrl(roleId: string, roleName: string) {
  const base = APPLY_FORUM[roleId];
  if (!base) return null;
  const url = new URL(base);
  url.searchParams.set("title", `Заявление на ${roleName}`);
  url.searchParams.set("message", `Ник: \nРоль: ${roleName}\nПричина: `);
  return url.toString();
}

/* ================= FlexSearch (CDN) ================= */
declare global {
  interface Window {
    FlexSearch: any;
  }
}
function loadFlex() {
  return new Promise<void>((resolve, reject) => {
    if (window.FlexSearch) return resolve();
    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/npm/flexsearch@0.7.31/dist/flexsearch.bundle.js";
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
}
function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/* ================== UI мини-компоненты ================== */
const CopyBtn = ({ text }: { text: string }) => (
  <button
    onClick={() => navigator.clipboard.writeText(text)}
    className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-800"
    title="Скопировать"
  >
    <Copy className="h-4 w-4" /> Копировать
  </button>
);

const Card: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, children, footer }) => (
  <div className="card shadow-softLg glass">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-semibold leading-tight">{title}</h3>
    </div>
    <div className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">
      {children}
    </div>
    {footer && (
      <div className="mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{footer}</div>)}
  </div>
);

const Source = ({ href, label }: { href: string; label?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1 underline decoration-dotted hover:no-underline"
  >
    {label || href}
  </a>
);
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none align-middle">
    {children}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-600/60" />
    <h2 className="shrink-0 rounded-full border border-zinc-200/60 bg-zinc-100/70 px-3 py-1 text-sm font-semibold tracking-wide shadow-sm backdrop-blur dark:border-zinc-700/60 dark:bg-zinc-800/60">
      {children}
    </h2>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-600/60" />
  </div>
);


// Simple accordion for VU docs
const VUAccordion: React.FC = () => {
  const [open, setOpen] = useState<Set<string>>(() => new Set(vuDocs.length ? [vuDocs[0].id] : []));
  const toggle = (id: string) => setOpen(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div className="grid gap-4">
      {vuDocs.map(doc => (
        <Card
          key={doc.id}
          title={
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>{doc.title}</span>
              </div>
              <button className="btn" onClick={() => toggle(doc.id)}>{open.has(doc.id) ? 'Свернуть' : 'Открыть'}</button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500">{doc.updated ? `Обновлено: ${doc.updated}` : ''}</div>
              {doc.source && <span className="text-xs">Источник: <Source href={doc.source} /></span>}
            </div>
          }
        >
          {open.has(doc.id) && (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed rounded-xl border border-zinc-200 bg-white p-3 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
              {doc.text || 'Текст ещё не добавлен.'}
            </pre>
          )}
        </Card>
      ))}
    </div>
  );
};

const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest?.('#fb-pop') && !t.closest?.('#fb-btn')) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div className="relative">
      <button id="fb-btn" className="btn" onClick={() => setOpen(v=>!v)}>
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Фидбек</span>
      </button>
      {open && (
        <div id="fb-pop" className="absolute right-0 z-30 mt-2 w-72 card p-3 text-sm bg-white dark:bg-zinc-900 shadow-softLg">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4" />
            Поделитесь обратной связью
          </div>
          <ul className="mb-2 ml-4 list-disc space-y-1">
            <li className="flex items-center gap-2"><Bug className="h-3.5 w-3.5" /> Баг интерфейса</li>
            <li className="flex items-center gap-2"><Lightbulb className="h-3.5 w-3.5" /> Идея по улучшению</li>
            <li className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Ошибка/опечатка в тексте</li>
          </ul>
          <a
            className="btn w-full justify-center no-underline"
            href="https://t.me/pasha_bolshoi"
            target="_blank"
            rel="noreferrer"
          >
            <Send className="h-4 w-4" /> Написать в Telegram
          </a>
          <div className="mt-2 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={safeGet('telemetry_disabled') === '1'}
                onChange={(e) => safeSet('telemetry_disabled', e.currentTarget.checked ? '1' : '0')}
              />
              Отключить анонимную телеметрию
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

// Upload feature disabled: provide tiny stubs to satisfy TS
const canUploadExternally = () => false;
async function uploadImage(_file: File): Promise<string> { return ""; }
async function fileToDataUrl(_file: File): Promise<string> { return ""; }

// Enhanced checklist with per-criterion screenshot uploads and saved links (compact UI)
const PromoChecklist: React.FC<{ roleId: string; dept: string; items: string[] }> = ({ roleId, dept, items }) => {
  const storageKey = useMemo(() => `promo:${roleId}:${encodeURIComponent(dept)}`, [roleId, dept]);
  const shotsKey = useMemo(() => `promo:shots:${roleId}:${encodeURIComponent(dept)}`, [roleId, dept]);

  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      const raw = safeGet(storageKey);
      const arr = raw ? (JSON.parse(raw) as number[]) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  const [shots, setShots] = useState<Record<number, string[]>>(() => {
    try {
      const raw = safeGet(shotsKey);
      return raw ? (JSON.parse(raw) as Record<number, string[]>) : {};
    } catch { return {}; }
  });

  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string | undefined>>({});

  useEffect(() => {
    try { safeSet(storageKey, JSON.stringify([...checked])); } catch {}
  }, [checked, storageKey]);

  useEffect(() => {
    try {
      if (Object.keys(shots).length) safeSet(shotsKey, JSON.stringify(shots));
      else safeRemove(shotsKey);
    } catch {}
  }, [shots, shotsKey]);

  function toggle(i: number) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  async function onUpload(i: number, files: FileList | null) {
    if (!files || !files.length) return;
    const MAX = 20; // максимальная группа
    const selected = Array.from(files).slice(0, MAX);
    const useExternal = canUploadExternally();
    setUploading(prev => ({ ...prev, [i]: true }));
    setErrors(prev => ({ ...prev, [i]: undefined }));
    for (const f of selected) {
      let url: string | null = null;
      try {
        url = useExternal ? await uploadImage(f) : await fileToDataUrl(f);
      } catch (e: any) {
        try { url = await fileToDataUrl(f); setErrors(prev => ({ ...prev, [i]: 'Ошибка внешней загрузки, сохранено локально' })); } catch {}
      }
      if (!url) continue;
      setShots(prev => {
        const cur = prev[i] || [];
        const next = [...cur, url];
        return { ...prev, [i]: next.slice(0, MAX) };
      });
    }
    setUploading(prev => ({ ...prev, [i]: false }));
  }

  function clearShots(i: number) {
    setShots(prev => { const n = { ...prev }; delete n[i]; return n; });
  }

  function removeOne(i: number, idx: number) {
    setShots(prev => {
      const arr = (prev[i] || []).slice();
      arr.splice(idx, 1);
      const next = { ...prev } as Record<number, string[]>;
      if (arr.length) next[i] = arr; else delete next[i];
      return next;
    });
  }

  return (
    <ol className="ml-4 list-decimal space-y-2">
      {items.map((p, i) => (
        <li key={i} className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-0.5 h-4 w-4" checked={checked.has(i)} onChange={() => toggle(i)} />
            <span className={checked.has(i) ? "opacity-60 line-through" : undefined}>{p}</span>
          </div>
          {false && (<div className="ml-6 rounded-lg border border-zinc-200/70 bg-white/60 p-2 text-xs shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50">
            <div className="flex flex-wrap items-center gap-1">
              <label className="btn px-2 py-1" title={uploading[i] ? 'Загрузка…' : 'Загрузить файлы'}>
                
                <input disabled={!!uploading[i]} type="file" accept="image/*" multiple className="hidden" onChange={(e)=>{ onUpload(i, e.currentTarget.files); e.currentTarget.value=''; }} />
              </label>
              
            </div>
            {!!(shots[i]?.length) && (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {shots[i].map((url, idx) => (
                  <div key={idx} className="group relative shrink-0 overflow-hidden rounded-md border border-zinc-200/70 dark:border-zinc-800/70">
                    <a href={url} target="_blank" rel="noreferrer" className="block">
                      <img src={url} alt="Скриншот" className="h-16 w-24 object-cover" />
                    </a>
                    <div className="absolute inset-x-0 bottom-0 hidden items-center justify-between gap-1 bg-gradient-to-t from-black/50 to-transparent p-1 text-[10px] text-white group-hover:flex">
                      <button className="rounded bg-white/20 px-1 py-0.5" onClick={()=>navigator.clipboard.writeText(url)}>Копировать</button>
                      <button className="rounded bg-white/20 px-1 py-0.5" onClick={()=>removeOne(i, idx)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!!errors[i] && (<div className="mt-1 text-[11px] text-amber-600">{errors[i]}</div>)}
          </div>)}
        </li>
      ))}
    </ol>
  );
};


/* --------- Вкладка "Проверки" --------- */

type WeekDay =
  | 'Понедельник' | 'Вторник' | 'Среда'
  | 'Четверг' | 'Пятница' | 'Суббота' | 'Воскресенье';

type ScheduleItem = { day: WeekDay; label: string; href?: string };
type LawLink = { label: string; href?: string };
type LawGroup = { title: string; items: LawLink[] };

type DeptBlock = {
  id: 'dvd' | 'dz' | 'dvs';
  title: string;
  emoji: string;
  schedule: ScheduleItem[];
  laws: LawGroup[];
  notes: LawLink[];
};

const CHECKS_DATA: DeptBlock[] = [
  {
    id: 'dvd',
    title: 'ДВД — департамент внутренних дел',
    emoji: '👮🏻‍♂️',
    schedule: [
      { day: 'Понедельник', label: 'Плановая проверка УМВД', href: 'https://forum.amazing-online.com/forums/patrulno-postovaja-sluzhba.742/' },
      { day: 'Среда',       label: 'Плановая проверка ГАИ',  href: 'https://forum.amazing-online.com/forums/dorozhno-patrulnaja-sluzhba.741/' },
      { day: 'Четверг',     label: 'Плановая проверка УФСИН', href: 'https://forum.amazing-online.com/forums/federalnaja-sluzhba-ispolnenija-nakazanij.735/' },
    ],
    laws: [
      {
        title: 'УМВД',
        items: [
          { label: 'Внутренний устав', href: 'https://forum.amazing-online.com/threads/vnutrennij-ustav-organov-vnutrennix-del.1027775/' },
          { label: 'Уголовный кодекс', href: 'https://forum.amazing-online.com/threads/ugolovnyj-kodeks.1027637/' },
          { label: 'Федеральное постановление', href: 'https://forum.amazing-online.com/threads/federalnoe-postanovlenie.1027639/' },
        ],
      },
      {
        title: 'ГАИ',
        items: [
          { label: 'Внутренний устав', href: 'https://forum.amazing-online.com/threads/vnutrennij-ustav-organov-vnutrennix-del.1027775/' },
          { label: 'Уголовный кодекс', href: 'https://forum.amazing-online.com/threads/ugolovnyj-kodeks.1027637/' },
          { label: 'КоАП', href: 'https://forum.amazing-online.com/threads/kodeks-ob-administrativnyx-pravonarushenijax.1027635/' },
          { label: 'Федеральное постановление', href: 'https://forum.amazing-online.com/threads/federalnoe-postanovlenie.1027639/' },
        ],
      },
      {
        title: 'УФСИН',
        items: [
          { label: 'Внутренний устав', href: 'https://forum.amazing-online.com/threads/vnutrennij-ustav.1027763/' },
          { label: 'Уголовно-исполнительный кодекс', href: 'https://forum.amazing-online.com/threads/ugolovno-ispolnitelnyj-kodeks.1027769/' },
          { label: 'Федеральное постановление', href: 'https://forum.amazing-online.com/threads/federalnoe-postanovlenie.1027639/' },
        ],
      },
    ],
    notes: [
      { label: 'Плановую проверку проводит Начальник департамента или его Заместитель'},
      { label: 'Внеплановая проверка — по договоренности с Губернатором/Вице-губернатором'},
    ],
  },

  {
    id: 'dz',
    title: 'ДЗ — департамент здравоохранения',
    emoji: '👨‍⚕️',
    schedule: [
      { day: 'Пятница', label: 'Плановая проверка ЕСС' },
    ],
    laws: [
      { title: 'Нормативные документы', items: [
        { label: 'Внутренний Устав', href: 'https://forum.amazing-online.com/threads/vnutrennij-ustav.1027799/' },
        { label: 'Федеральное Постановление', href: 'https://forum.amazing-online.com/threads/federalnoe-postanovlenie.1027639/' },
        { label: 'Боевой Устав (для МЧС)', href: 'https://forum.amazing-online.com/threads/boevoj-ustav-mchs.1027801/' },
      ]},
    ],
    notes: [
      { label: 'Плановую проверку проводит Начальник департамента или его Заместитель'},
      { label: 'Внеплановая — только после согласования с Губернатором/Вице-губернатором' },
    ],
  },

  {
    id: 'dvs',
    title: 'ДВС — департамент вооруженных сил',
    emoji: '🎖️',
    schedule: [
      { day: 'Вторник', label: 'Плановая проверка Воинской части №20115' },
    ],
    laws: [
      { title: 'Нормативные документы', items: [
        { label: 'Внутренний Устав', href: 'https://forum.amazing-online.com/threads/vnutrennij-ustav.1027808/' },
        { label: 'Федеральное Постановление', href: 'https://forum.amazing-online.com/threads/federalnoe-postanovlenie.1027639/' },
      ]},
    ],
    notes: [
      { label: 'Плановую проверку проводит Начальник департамента или его Заместитель'},
      { label: 'Внеплановая — только после согласования с Губернатором/Вице-губернатором',},
    ],
  },
];

const ChecksSection: React.FC = () => {
  return (
    <section id="checks" className="space-y-4">
      <h1 className="text-xl font-bold">Проверки</h1>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CHECKS_DATA.map(dep => (
          <article key={dep.id} className="card flex flex-col gap-3">
            <header className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold">{dep.emoji} {dep.title}</h2>
            </header>

            {/* График */}
            <section>
              <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">График плановых проверок</div>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                {dep.schedule.map((s, i) => (
                  <li key={i} className="text-zinc-700 dark:text-zinc-200">
                    <span className="font-medium">{s.day}</span>{' — '}
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted hover:no-underline text-[var(--accent-600,inherit)]"
                      >
                        {s.label}
                      </a>
                    ) : (
                      <span>{s.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Законодательная база */}
            <section>
              <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Законодательная база</div>
              <div className="grid gap-2">
                {dep.laws.map((g, gi) => (
                  <div key={gi} className="rounded-lg border border-zinc-200/60 p-2 text-sm dark:border-zinc-800/60">
                    <div className="mb-1 font-medium text-zinc-800 dark:text-zinc-100">{g.title}</div>
                    <ul className="ml-4 list-disc space-y-1">
                      {g.items.map((l, li) => (
                        <li key={li} className="text-zinc-700 dark:text-zinc-200">
                          {l.href
                            ? <a href={l.href} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:no-underline">{l.label}</a>
                            : <span>{l.label}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Важная информация */}
            <section>
              <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Важная информация</div>
              <ul className="ml-4 list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
                {dep.notes.map((n, i) => (
                  <li key={i}>
                    {n.href
                      ? <a href={n.href} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:no-underline">{n.label}</a>
                      : <span>{n.label}</span>}
                  </li>
                ))}
              </ul>
            </section>
          </article>
        ))}
      </div>

      <footer className="text-xs text-zinc-500 dark:text-zinc-400">
        Внеплановые проверки проводятся только по согласованию с Губернатором/Вице-губернатором
        в соответствующей теме «Заявления на проведение внеплановой проверки». 
      </footer>
    </section>
  );
};



/* ================== Навигация по вкладкам ================== */
const TABS = [
  { id: "roles", label: "Роли", icon: <Users className="h-4 w-4" /> },
  { id: "checks", label: "Проверки", icon: <ListChecks className="h-4 w-4" /> },
  { id: "templates", label: "Доклады", icon: <Radio className="h-4 w-4" /> },
  { id: "posts", label: "Посты", icon: <MapPin className="h-4 w-4" /> },
  { id: "procedures", label: "Процедуры", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "interactions", label: "Взаимодействие", icon: <Shield className="h-4 w-4" /> },
  { id: "lectures", label: "Лекции", icon: <FileText className="h-4 w-4" /> },
  { id: "vu", label: "ВУ", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "laws", label: "Законы", icon: <BookOpen className="h-4 w-4" /> },
];
VALID_TABS_SET.clear(); TABS.forEach(t => VALID_TABS_SET.add(t.id));

/* ================== Данные для карточек (пример) ================== */
const radioByRole: Record<string, string[]> = {
  Охрана: [
    "/r Докладывает: (Фамилия). Заступил на пост (номер поста).",
    "/r Докладывает: (Фамилия). Продолжаю дежурство на посту (номер поста).",
    "/r Докладывает: (Фамилия). Покинул пост (номер поста).",
  ],
  "Начальник охраны": [
    "/r Докладывает: (Фамилия). Заступил на пост (номер поста).",
    "/r Докладывает: (Фамилия). Продолжаю дежурство на посту (номер поста).",
    "/r Докладывает: (Фамилия). Покинул пост (номер поста).",
    "/r Докладывает: (Фамилия). Начал охранять (Должность) (Фамилия).",
    "/r Докладывает: (Фамилия). Продолжаю охранять (Должность) (Фамилия).",
    "/r Докладывает: (Фамилия). Закончил охранять (Должность) (Фамилия).",

  ],
  Адвокат: [
    "/d [ПР/УФСИН] Адвокат *Фамилия*. На связь.",
    "/d [ПР/УФСИН] Адвокат *Фамилия*. Разрешите прибыть для оказания юридической помощи заключенным ИК?",
    "/d [ПР/УФСИН] Адвокат *Фамилия*. Прибыл на КПП-1, пропустите на территорию ИК.",
    "/r Докладывает: (Фамилия), начал дежурство в комнате свиданий.",
    "/r Докладывает: (Фамилия), продолжаю дежурство в комнате свиданий.",
    "/r Докладывает: (Фамилия), закончил дежурство в комнате свиданий.",
  ],
  Инспектор: [
    "/r Докладывает (Фамилия). Выехал на проведение ревизии (орган)",
    "/r Докладывает (Фамилия). Прибыл для проведения ревизии (орган)",
    "/r Докладывает (Фамилия). Закончил проведение ревизии (орган). Итог: x/x.",
    "/r Докладывает (Фамилия). Начал дежурство за стойкой регистрации.",
    "/r Докладывает (Фамилия). Продолжаю дежурство за стойкой регистрации.",
    "/r Докладывает (Фамилия). Закончил дежурство за стойкой регистрации.",
    "/r Докладывает (фамилия). Выехал на проверку постов (орган)",
    "/r Докладывает (фамилия). Прибыл на пост (название посат). Сотрудники присутствуют/отсутствуют.",
  ],
  Советник: [
    "/r Докладывает (фамилия). Начал дежурство (место). ",
    "/r Докладывает (фамилия). Продолжил дежурство (место).",
    "/r Докладывает (фамилия). Закончил дежурство (место).",
    "/r Докладывает (Фамилия). Начал контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "/r Докладывает (Фамилия). Продолжил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "/r Докладывает (Фамилия). Закончил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "/r Докладывает (фамилия). Выехал на помощь проведения плановой/внеплановой проверки (орган).",
    "/r Докладывает (фамилия). Начал оказывать помощь на проведении плановой/внеплановой проверки (орган).",
    "/r Докладывает (фамилия). Начал проверку жетона x-x-x.",
    "/r Докладывает (фамилия). Закончил проверку жетона x-x-x. Итог: x/x.",
    "/r Докладывает (фамилия). Закончил оказывать помощь на плановой/внеплановой проверке (орган).",
  ],
  "Зам. Министра": [
    "/r Докладывает (фамилия). Начал прослушивать рацию (орган).",
    "/r Докладывает (фамилия). Продолжаю прослушивать рацию (орган).",
    "/r Докладывает (фамилия). Закончил прослушивать рацию (орган).",
    "/r Докладывает (Фамилия). Начал контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "/r Докладывает (Фамилия). Продолжил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "/r Докладывает (Фамилия). Закончил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "/r Докладывает (Фамилия). Начал контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.",
    "/r Докладывает (Фамилия). Продолжил контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.",
    "/r Докладывает (Фамилия). Закончил контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.",
  ],
};


// === Процедуры: поддержка ===
type PriceRow = { name: string; price: string };

const PriceTable: React.FC<{ rows: PriceRow[] }> = ({ rows }) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-left text-xs text-zinc-500">
        <th className="py-1 pr-2 font-medium">Наименование</th>
        <th className="py-1 pr-2 font-medium">Цена</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
          <td className="py-2 pr-2">{r.name}</td>
          <td className="py-2 pr-2 whitespace-nowrap font-semibold">{r.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const WORKDAY = [
  { label: "Понедельник - пятница", time: "10:00 ‒ 18:00" },
  { label: "Суббота - воскресенье", time: "10:00 ‒ 15:00" },
] as const;

const WORKDAYSS = [
  { label: "Понедельник - пятница", time: "10:00 ‒ 20:00" },
  { label: "Суббота - воскресенье", time: "10:00 ‒ 19:00" },
] as const;

const WORKDAYMVD = [
  { label: "Понедельник - пятница", time: "10:00 ‒ 20:00" },
  { label: "Суббота - воскресенье", time: "10:00 ‒ 19:00" },
] as const;

const WORKDAYFS = [
  { label: "Понедельник - Воскресенье", time: "08:00 ‒ 22:00" },
] as const;

const WORKDAYFSB = [
  { label: "Понедельник - Воскресенье", time: "08:00 ‒ 22:00" },
] as const;

const WORKDAYVC = [
  { label: "Понедельник - Пятница", time: "10:00 ‒ 21:00" },
  { label: "Суббота - воскресенье", time: "10:00 ‒ 19:00" },
] as const;

const WORKDAY_BREAK = "Перерыв: 13:00 ‒ 14:00";

const EXPUNGE_PRICES: PriceRow[] = [
  { name: "гражданам, проживающим до 5 лет в области",         price: "50.000 руб." },
  { name: "гражданам, проживающим от 5 до 10 лет в области",   price: "75.000 руб." },
  { name: "гражданам, проживающим от 10 до 15 лет в области",  price: "100.000 руб." },
  { name: "гражданам, проживающим от 15 до 20 лет в области",  price: "150.000 руб." },
  { name: "гражданам, проживающим от 20 до 25 лет в области",  price: "200.000 руб." },
  { name: "гражданам, проживающим более 25 лет в области",     price: "250.000 руб." },
];
const EXPUNE_PRICES: PriceRow[] = [
  { name: "Лицензия на полеты",         price: "15.000 руб." },
  { name: "Лицензия на бизнес",   price: "150.000 руб." },
  { name: "Лицензия на оружие",  price: "30.000 руб." },
];
type PostItem = { code: string; img: string; where?: string };

const postsData: PostItem[] = [
  { code: "A1-A2", where: "Вход в здание Правительства", img: "/img/a1.png" },
  { code: "B1-B2", where: "Холл здания Правительства", img: "/img/b1.png" },
  { code: "C1-C2", where: "Задний вход, парковка", img: "/img/c1.png" },
  { code: "D1-D2", where: "Ворота на парковку", img: "/img/d1.png" },
  { code: "E1-E2", where: "Возле кабинета Губернатора", img: "/img/e1.png" },
];

const postsDPS: PostItem[] = [
  { code: 'ТЦ "Анашан"', where: "ТЦ «Анашан», КАД, 1 км, 1", img: "/img/1.png" },
  { code: "Дорога «Южный ‒ порт»", where: "Дорога «Южный ‒ порт», д. Гарель, 44", img: "/img/2.png" },
  { code: "Рыжевск", where: "КАД, 7-й км (район Рыжевска)", img: "/img/3.png" },
  { code: "стадион г. Арзамаса", where: "Стадион Арзамаса / УФСБ, ул. Карла Маркса, 61", img: "/img/4.png" },
];


const postsPPS: PostItem[] = [
  { code: "ВА", where: "ВА ‒ вокзал Арзамаса (ул. Мира, 3)",                     img: "/img/5.png" },
  { code: "ВЧ", where: "ВЧ ‒ КПП-1 воинской части (пгт. Батырево)",               img: "/img/6.png" },
  { code: "ЦР", where: "ЦР ‒ центральный рынок (Батырево, ул. Ворошилова, 18)",   img: "/img/7.png" },
  { code: "ВЮ", where: "ВЮ ‒ вокзал г. Южный (ул. Заводская, 7)",                 img: "/img/8.png" },
  { code: "ЕСС", where: "ЕСС ‒ напротив здания ЕСС (ул. Алексеевская, 12)",        img: "/img/9.png" },
  { code: "ПР", where: "ПР ‒ здание Правительства (пгт. Батырево, ул. Ленина, 1)",img: "/img/10.png" },
  { code: "ХЕСС", where: "ХЕСС ‒ внутри ЕСС (ул. Дорогобужская, 1)",                img: "/img/11.png" },
  { code: "КПЗ", where: "КПЗ ‒ внутри УМВД (Ленинский б-р, 17)",                   img: "/img/12.png" },
  { code: "ВК", where: "ВК ‒ внутри военкомата (пгт. Батырево, ул. Ленина, 4)",   img: "/img/13.png" },
];
const postsESS: PostItem[] = [
  { code: "Б-4", img: "/img/B4.png" },
  { code: "Б-2", img: "/img/B2.png" },
  { code: "Б-1", img: "/img/B11.png" },
  { code: "Б-3", img: "/img/B3.png" },
  { code: "Ю-2", img: "/img/U2.png" },
  { code: "Ю-1", img: "/img/U1.png" },
];

const PostsGrid: React.FC<{ items: PostItem[] }> = ({ items }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {items.map((p) => (
      <article
        key={p.code}
        className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/70 dark:bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60"
      >
        <div className="relative">
          <img
            src={assetPath(p.img)}
            alt={p.where ? `${p.code} — ${p.where}` : p.code}
            className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetPath('/img/noimg.png'); }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
          <span className="absolute left-2 top-2 rounded-full border border-zinc-200/60 bg-white/90 px-2 py-0.5 text-[11px] font-semibold tracking-wide shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/90">
            {p.code}
          </span>
        </div>

        {/* описание показываем только если есть where */}
        {p.where && (
          <div className="p-3">
            <div className="min-h-[2.25rem] text-xs leading-snug text-zinc-600 dark:text-zinc-400">
              {p.where}
            </div>
          </div>
        )}
      </article>
    ))}
  </div>
);



/* ================== Умный поиск по законам ================== */
const SmartLawSearch: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await loadFlex();
      const { Document } = window.FlexSearch;
      const index = new Document({
        cache: true,
        tokenize: "forward",
        document: {
          id: "id",
          index: [{ field: "title" }, { field: "abbr" }, { field: "text" }],
          store: ["slug", "title", "excerpt"],
        },
      });

      const docs: any[] = [];
      lawsData.forEach((law) => {
        const parts = law.content.split(/\n(?=##\s+)/g);
        if (parts.length === 1) {
          docs.push({
            id: `${law.slug}`,
            slug: `${law.slug}`,
            title: law.title,
            abbr: law.abbr,
            text: law.content,
            excerpt: law.notes || "",
          });
        } else {
          parts.forEach((md) => {
            const header = md.match(/^##\s+(.+)$/m)?.[1] || law.title;
            const id = slugify(header);
            docs.push({
              id: `${law.slug}#${id}`,
              slug: `${law.slug}#${id}`,
              title: `${law.title} ‒ ${header}`,
              abbr: law.abbr,
              text: md,
              excerpt: header,
            });
          });
        }
      });

      docs.forEach((d) => index.add(d));
      (window as any).__LAW_INDEX__ = index;
      (window as any).__LAW_DOCS__ = docs;
      setReady(true);
    })();
  }, []);

  function normalizeQuery(s: string) {
    let out = s.trim().toLowerCase();
    out = out
      .replace(/\bу\s*к\b/g, "ук")
      .replace(/\bко\s*ап\b/g, "коап")
      .replace(/\s+/g, " ");
    return out;
  }

  function tryDirectJump(s: string): string | null {
    const m = s.match(/(?:ст\.?|статья)?\s*(\d{1,3})\s*(ук|коап)/i);
    if (!m) return null;
    const [, num, code] = m;
    const law =
      code.toLowerCase() === "ук"
        ? lawsData.find((l) => l.slug === "uk")
        : lawsData.find((l) => l.slug === "koap");
    if (!law) return null;
    const re = new RegExp(`^###\\s*Статья\\s*${num}\\b`, "mi");
    const sec = law.content.split(/\n(?=###\s+)/g).find((s) => re.test(s));
    if (!sec) return `/laws/${law.slug}`;
    const header = sec.match(/^###\s*(.+)$/m)?.[1] || `Статья ${num}`;
    const id = slugify(header);
    return `/laws/${law.slug}#${id}`;
  }

  // Fallback simple search if FlexSearch returns nothing
  function simpleSearch(q: string, docs: any[]) {
    const qq = q.trim().toLowerCase();
    if (!qq) return [] as any[];
    const terms = qq.split(' ').filter(Boolean);
    const rows: any[] = [];
    for (const d of docs) {
      const hay = `${d.title} ${d.abbr || ''} ${d.text}`.toLowerCase();
      const score = terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
      if (score > 0) rows.push({ url: `/laws/${d.slug}`, title: d.title, excerpt: d.excerpt || d.title, _score: score });
    }
    return rows.sort((a,b)=>b._score-a._score).slice(0,20);
  }

  async function doSearch(s: string) {
    const idx = (window as any).__LAW_INDEX__;
    const docs = (window as any).__LAW_DOCS__ as any[];
    if (!idx || !docs) return;

    const direct = tryDirectJump(s);
    if (direct) {
      setResults([{ url: direct, title: "Перейти к статье", excerpt: s.toUpperCase() }]);
      return;
    }

    const qn = normalizeQuery(s);
    let rows: any[] = [];
    try {
      const found = idx.search(qn, { enrich: true, limit: 20 }) as any[];
      const ids = new Set<string>();
      for (const block of found) {
        for (const r of block.result) {
          if (ids.has(r.id)) continue;
          ids.add(r.id);
          const doc = docs.find((d) => d.id === r.id);
          if (!doc) continue;
          rows.push({ url: `/laws/${doc.slug}`, title: doc.title, excerpt: doc.excerpt || doc.title });
        }
      }
    } catch {}
    if (!rows.length) rows = simpleSearch(qn, docs);
    setResults(rows);
  }

  useEffect(() => {
    if (!ready) return;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => doSearch(q), 120);
    return () => clearTimeout(t);
  }, [q, ready]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 text-xs text-zinc-600">
        Примеры: <code>ук 105</code>, <code>ст 12 коап</code>, <code>обязанности водителя</code>
      </div>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по всем законам (фразы, статьи, номера)…"
          className="w-full rounded-xl border border-zinc-200 px-3 py-1.5 text-sm focus:outline-none focus:ring dark:border-zinc-700 dark:bg-zinc-900/50"
        />
      </div>

      {!!results.length && (
        <div className="mt-3 grid gap-2">
          {results.map((r, i) => (
            <Link key={i} to={r.url} className="block rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{r.excerpt}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================== Умный поиск по лекциям ================== */
const SmartLectureSearch: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await loadFlex();
      const { Document } = window.FlexSearch;
      const index = new Document({
        cache: true,
        tokenize: "forward",
        document: {
          id: "id",
          index: [{ field: "title" }, { field: "text" }],
          store: ["id", "slug", "title", "excerpt"],
        },
      });

      const docs = lectures.map((sec) => ({
        id: sec.id,
        slug: `#lec-${sec.id}`,
        title: sec.title,
        text: sec.text,
        excerpt: sec.title,
      }));

      docs.forEach((d) => index.add(d));
      (window as any).__LECT_INDEX__ = index;
      (window as any).__LECT_DOCS__ = docs;
      setReady(true);
    })();
  }, []);

  function normalizeQuery(s: string) {
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }

  async function doSearch(s: string) {
    const idx = (window as any).__LECT_INDEX__;
    const docs = (window as any).__LECT_DOCS__ as any[];
    if (!idx || !docs) return;

    let rows: any[] = [];
    try {
      const found = idx.search(normalizeQuery(s), { enrich: true, limit: 30 }) as any[];
      const ids = new Set<string>();
      for (const block of found) {
        for (const r of block.result) {
          if (ids.has(r.id)) continue;
          ids.add(r.id);
          const doc = docs.find((d) => d.id === r.id);
          if (!doc) continue;
          rows.push({ url: `/#lec-${doc.id}`, title: doc.title, excerpt: doc.excerpt });
        }
      }
    } catch {}
    if (!rows.length) {
      const qq = normalizeQuery(s);
      const terms = qq.split(' ').filter(Boolean);
      rows = docs
        .map((d:any) => {
          const hay = `${d.title} ${d.text}`.toLowerCase();
          const score = terms.reduce((acc,t)=>acc+(hay.includes(t)?1:0),0);
          return score>0 ? { url: `/#lec-${d.id}`, title: d.title, excerpt: d.excerpt, _score: score } : null;
        })
        .filter(Boolean) as any[];
      rows.sort((a:any,b:any)=>b._score-a._score);
      rows = rows.slice(0, 30);
    }
    setResults(rows);
  }

  useEffect(() => {
    if (!ready) return;
    if (!q.trim()) return setResults([]);
    const t = setTimeout(() => doSearch(q), 120);
    return () => clearTimeout(t);
  }, [q, ready]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 text-xs text-zinc-600">
        Поиск по лекциям: попробуй <code>субординация</code>, <code>рация</code>, <code>отчёт</code> …
      </div>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Искать заголовки и текст лекций…"
          className="w-full rounded-xl border border-zinc-200 px-3 py-1.5 text-sm focus:outline-none focus:ring dark:border-zinc-700 dark:bg-zinc-900/50"
        />
      </div>

      {!!results.length && (
        <div className="mt-3 grid gap-2">
          {results.map((r, i) => (
            <a key={i} href={r.url} className="block rounded-xl border p-3 hover:bg-zinc-50">
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-zinc-500">{r.excerpt}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};


/* ================== Страница ================== */
export default function GovCheatsheetSky() {
  const [mainTab, setMainTab] = useState<string>(() => {
    const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
    const q = (url?.searchParams.get("tab") || "").toLowerCase();
    const h = (url?.hash || "").replace(/^#/, "").toLowerCase();
    return (q || h || TABS[0].id);
  });                // главное меню
  const [rolesTab, setRolesTab] = useState<"roles" | "promotion">("roles");  // под-вкладки в "Роли"
  type DeptTab = "Все" | "ДЗ" | "ДВД" | "ДВС" | "ЮД";
  const [deptTab, setDeptTab] = useState<DeptTab>("Все");
  const DEPTS: DeptTab[] = ["Все", "ДЗ", "ДВД", "ДВС", "ЮД"];

  // чип-фильтры для карточек законов
  const chips = ["Все", "УК", "КоАП", "ПДД", "ФП", "ФЗоП", "ФЗоТОД", "ФЗоВС", "ФЗоФСБ", "УПК", "КАС", "Гостайна", "ФЗоВВ"];
  const [chip, setChip] = useState<string>("Все");
  const cardLaws = useMemo(
    () => lawsData.filter((l) => chip === "Все" || l.abbr.toLowerCase() === chip.toLowerCase()),
    [chip]
  );

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <TabSync current={mainTab} onTab={setMainTab} />
      <header className="gov-tabs-in-header sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6" />
            <div>
              <div className="text-lg font-bold leading-tight">Правительство ‒ Памятка (SKY)</div>
              <ContextText />
            </div>
          </div>

          <nav className="flex w-full gap-2 overflow-x-auto md:w-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setMainTab(t.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${
                  mainTab === t.id
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100"
                    : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:ml-auto">
            <Link to="/whats-new" className="btn">Что нового</Link>
            <Link to="/favorites" className="btn"><span className="inline-block h-4 w-4">★</span> Избранное</Link>
            <Link to="/settings" className="btn"><Settings className="h-4 w-4" /> Настройки</Link>
            <FeedbackButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* ===== РАЗДЕЛ "РОЛИ" (виден только когда выбрана главная вкладка "Роли") ===== */}
        {mainTab === "roles" && (
          <>
            {/* Заголовок + под-вкладки + департаменты */}
            <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-bold">Роли</h2>

              <div className="flex flex-wrap gap-2">
                {/* под-вкладки Роли/Повышение */}
              <div className="hidden inline-flex rounded-full border border-zinc-200 bg-white/70 p-0.5 text-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/50"> 
                  <button
                    onClick={() => setRolesTab("roles")}
                      className={"px-3 py-1 rounded-full transition " + (rolesTab === "roles" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}
                  >
                    Роли
                  </button>
                  <button
                    onClick={() => setRolesTab("promotion")}
                      className={"px-3 py-1 rounded-full transition " + (rolesTab === "promotion" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}
                  >
                    Повышение
                  </button>
                </div>

                {/* вкладки департаментов */}
                <div className="hidden inline-flex rounded-full border border-zinc-200 bg-white/70 p-0.5 text-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/50"> 
                  {DEPTS.map((d) => ( 
                    <button 
                      key={d} 
                      onClick={() => setDeptTab(d)} 
                      className={"px-3 py-1 rounded-full transition " + (deptTab === d ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800")} 
                    > 
                      {d} 
                    </button> 
                  ))} 
                </div> 
              </div>
            </div>
            
            <ImportantRecordingBlock /> 

            {/* Фильтр по департаментам под блоком "Важно" */}
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="inline-flex rounded-full border border-zinc-200 bg-white/70 p-0.5 text-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/50">
                {DEPTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDeptTab(d)}
                    className={"px-3 py-1 rounded-full transition " + (deptTab === d ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800")}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            
            {false && (
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rolesData
                  .filter((r) => {
                    if (deptTab === "Все") return true;
                    const d = (r as any).dept;
                    return Array.isArray(d) ? d.includes(deptTab) : d === deptTab;
                  })
                  .map((r) => (
                      <Card key={r.id}
                        title={
                          <div className="flex items-center gap-2">
                            {iconForRoleName(r.role)}
                            <span>{r.role}</span>
                            <Badge><span className="opacity-70">Зарплата:</span> {r.salary}</Badge>
                            {(() => { const v = isRecentlyUpdated(`role:${r.id}`); return v.recent ? <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-800" title={`Обновлено ${v.date}`}>обновлено</span> : null; })()}
                          </div>
                        }
                        footer={<div>Источник: <Source href={r.source || "#"} /></div>}
                      >
                        <ul className="ml-4 list-disc">
                          {r.duties.map((d: string, i: number) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                        <RelatedBlock itemId={`role:${r.id}`} itemType="role" />
                        <VoteWidget cardId={`role:${r.id}`} />
                      </Card>
                  ))}

                {false && (<Card
                  title={<div className="flex items-center gap-2"><FileText className="h-4 w-4" /> График, критерии, структура</div>}
                  footer={<div>Инфо-раздел: <Source href="https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/" /></div>}
                >
                  <ul className="ml-4 list-disc">
                    <li>Рабочие дни: пн–пт 10:00–18:00; сб–вс 10:00–15:00; перерыв 13:00–14:00</li>
                    <li>Критерии: 8+ лет стажа, 75+ законопослушности, юр-образование</li>
                    <li>Отделы: ДВД (МВД), ДВС (ВЧ), ДЗ (ЕСС), ЮД (юридический)</li>
                  </ul>
                </Card>)}
              </section>
            )}

            {/* Вкладка "Повышение" */}
            {true && (
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rolesData
                  .filter((r) => {
                    if (deptTab === "Все") return true;
                    const d = (r as any).dept;
                    return Array.isArray(d) ? d.includes(deptTab) : d === deptTab;
                  })
                  .map((r) => {
                    const promo: string[] =
                      (r as any).promotionByDept && deptTab !== "Все"
                        ? (r as any).promotionByDept?.[deptTab] ?? []
                        : (r as any).promotion ?? [];

                    const isAll = deptTab === "Все";
                    const excludedTop = ['advisor','deputy-minister','minister','admin-chief','vice-governor','governor'];
                    if (isAll && excludedTop.includes((r as any).id)) return null;

                    return (
                      <Card
                        key={r.id}
                        title={
                          <div className="flex items-center gap-2">
                            {iconForRoleName(r.role)}
                            <span>{r.role}</span>
                            <Badge><span className="opacity-70">Зарплата:</span> {r.salary}</Badge>
                          </div>
                        }
                        footer={<div>Источник: <Source href={(r as any).sourcePromotion || r.source || "#"} /></div>}
                      >
                        {promo.length ? (
                          <PromoChecklist roleId={r.id} dept={deptTab} items={promo} />
                        ) : (
                          <p>Критерии повышения для этой роли пока не добавлены.</p>
                        )}
                      </Card>
                    );
                  })}
              </section>
            )}
          </>
        )}

        {mainTab === "checks" && (
          <ChecksSection />
        )}

        {/* ДОКЛАДЫ */}
        {mainTab === "templates" && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(radioByRole).map(([title, lines]) => (
              <Card
                key={title}
                title={
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4" />
                    Доклады ‒ {title}
                  </div>
                }
              >
                <div className="flex flex-col gap-2">
                  {lines.map((t, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2">
                      <div className="text-sm">{t}</div>
                      <CopyBtn text={t} />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </section>
        )}

        {/* ПОСТЫ */}
    {mainTab === "posts" && (
      <section className="mt-6 grid gap-6">
        <div>
          <SectionTitle>Стационарные посты</SectionTitle>
          <div className="mt-3"><PostsGrid items={postsData} /></div>
        </div>

        <div>
          <SectionTitle>Посты ДПС</SectionTitle>
          <div className="mt-3"><PostsGrid items={postsDPS} /></div>
        </div>

        <div>
          <SectionTitle>Посты ППС</SectionTitle>
          <div className="mt-3"><PostsGrid items={postsPPS} /></div>
        </div>
        <div>
          <SectionTitle>Посты ЕСС</SectionTitle>
          <div className="mt-3"><PostsGrid items={postsESS} /></div>
        </div>
      </section>
    )}


{mainTab === "procedures" && (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {/* Рабочий день Правительства */}
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Рабочий день Правительства
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 text-xs text-zinc-500">График работы:</div>
          <ul className="ml-4 list-disc">
            {WORKDAY.map((w, i) => (
              <li key={i}>
                <b>{w.label}</b>: {w.time}
              </li>
            ))}
          </ul>
          <div className="mt-1 text-xs opacity-80">{WORKDAY_BREAK}</div>
        </div>
      </div>
    </Card>

    {/* Снятие судимостей — прайс */}
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Снятие судимостей ‒ прайс
        </div>
      }
    >
      <PriceTable rows={EXPUNGE_PRICES} />
    </Card>
        <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Лицензии ‒ прайс
        </div>
      }
    >
      <PriceTable rows={EXPUNE_PRICES} />
    </Card>
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Рабочий день ЕСС
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 text-xs text-zinc-500">График работы:</div>
          <ul className="ml-4 list-disc">
            {WORKDAYSS.map((w, i) => (
              <li key={i}>
                <b>{w.label}</b>: {w.time}
              </li>
            ))}
          </ul>
          <div className="mt-1 text-xs opacity-80">{WORKDAY_BREAK}</div>
        </div>
      </div>
    </Card>
        <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Рабочий день УМВД
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 text-xs text-zinc-500">График работы:</div>
          <ul className="ml-4 list-disc">
            {WORKDAYMVD.map((w, i) => (
              <li key={i}>
                <b>{w.label}</b>: {w.time}
              </li>
            ))}
          </ul>
          <div className="mt-1 text-xs opacity-80">{WORKDAY_BREAK}</div>
        </div>
      </div>
    </Card>
<Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Рабочий день УФСИН
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 text-xs text-zinc-500">График работы:</div>
          <ul className="ml-4 list-disc">
            { WORKDAYFS.map((w, i) => (
              <li key={i}>
                <b>{w.label}</b>: {w.time}
              </li>
            ))}
          </ul>
          <div className="mt-1 text-xs opacity-80">{WORKDAY_BREAK}</div>
        </div>
      </div>
    </Card>
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Рабочий день ФСБ
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 text-xs text-zinc-500">График работы:</div>
          <ul className="ml-4 list-disc">
            { WORKDAYFSB.map((w, i) => (
              <li key={i}>
                <b>{w.label}</b>: {w.time}
              </li>
            ))}
          </ul>
          <div className="mt-1 text-xs opacity-80">{WORKDAY_BREAK}</div>
        </div>
      </div>
    </Card>
        <Card
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Рабочий день ВЧ
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 text-xs text-zinc-500">График работы:</div>
          <ul className="ml-4 list-disc">
            { WORKDAYVC.map((w, i) => (
              <li key={i}>
                <b>{w.label}</b>: {w.time}
              </li>
            ))}
          </ul>
          <div className="mt-1 text-xs opacity-80">{WORKDAY_BREAK}</div>
        </div>
      </div>
    </Card>
  </section>
)}



        {/* ВЗАИМОДЕЙСТВИЕ */}
        {mainTab === "interactions" && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interactionsData.map((card) => (
              <Card
                key={card.id}
                title={
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {card.role}
                  </div>
                }
                footer={
                  card.source ? (
                    <div className="text-xs">
                      Источник: <Source href={card.source} />
                    </div>
                  ) : undefined
                }
              >
                 <ul className="ml-4 list-disc">
                   {card.tips.map((t, i) => (
                     <li key={i}>{t}</li>
                   ))}
                 </ul>
                <RelatedBlock itemId={`procedure:${card.id}`} itemType="procedure" />
                <VoteWidget cardId={`procedure:${card.id}`} />
              </Card>
            ))}
          </section>
        )}


        {mainTab === "lectures" && (
          <section className="grid gap-4">
            {/* Поиск по лекциям отключён по запросу */}

            {/* ОДНА КОЛОНКА ВСЕГДА ‒ на всю ширину контейнера */}
            <div className="grid grid-cols-1 gap-4">
              {lectures.map((sec) => (
                <Card
                  key={sec.id}
                  title={
                    // делаем заголовок полноширинным, центрируем и усиливаем жирность
                    <div id={`lec-${sec.id}`} className="w-full scroll-mt-24">
                      <div className="flex items-center justify-center gap-2 text-center font-bold">
                        <FileText className="h-4 w-4" />
                        <span>{sec.title}</span>
                      </div>
                    </div>
                  }
                  footer={
                    <div className="flex justify-between text-xs text-zinc-500">
                      <div>{sec.updated ? `Актуально: ${sec.updated}` : ""}</div>
                      {sec.source && <>Источник: <Source href={sec.source} /></>}
                    </div>
                  }
                >
                  {/* чтобы текст был обычным и широким */}
                  <div className="not-prose whitespace-pre-wrap text-sm leading-relaxed">{sec.text}</div>
                </Card>
              ))}
            </div>
          </section>
        )}




        {/* ===== ВУ (Внутренний устав Правительства) ===== */}
        {mainTab === "vu" && (
          <section className="grid gap-4">
            {/* Grid of VU documents, like laws */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vuDocs.map((d) => (
                <Link to={`/vu/${d.id}`} key={d.id} className="block">
                  <Card
                    title={<div className="flex items-center gap-2"><Shield className="h-4 w-4" /> {d.title}</div>}
                    footer={<div className="text-xs text-zinc-500">{d.updated ? `Обновлено: ${d.updated}` : ""} {d.source && <> • Источник: <Source href={d.source} /></>}</div>}
                  >
                    <p className="text-sm line-clamp-2">{(d.text || '').split('\n').find(Boolean) || 'Текст ещё не добавлен.'}</p>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="hidden">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Внутренний устав Правительства
                </div>
              }
              footer={
                <div>
                  Источник:{" "}
                  <Source href="https://forum.amazing-online.com/threads/vnutrennij-ustav.1027735/" />
                </div>
              }
            >
              {/* ВАЖНО: <pre className="whitespace-pre-wrap"> ‒ сохраняет все номера, отступы и переносы */}
              <pre className="whitespace-pre-wrap text-sm leading-relaxed rounded-xl border border-zinc-200 bg-white p-3 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
                {vuDocs[0]?.text}
              </pre>
            </Card>
            </div>
          </section>
        )}

        {/* ЗАКОНЫ */}
        {mainTab === "laws" && (
          <section className="grid gap-4">
            {/* умный глобальный поиск */}
            <LawSearch />

            {/* чип-фильтры карточек */}
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setChip(c)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    chip === c
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* карточки законов */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cardLaws.map((law) => (
                <Link to={`/laws/${law.slug}`} key={law.slug} className="block">
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {law.title}
                      </div>
                    }
                    footer={<div>{law.updated ? `Актуально: ${law.updated}` : ""}</div>}
                  >
                    <p className="text-sm">{law.notes || "Открыть →"}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ПОДВАЛ */}
        <div className="mt-8 grid gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          <div>Создатель: Pavel_Bolshoy. • Скачать подсказку: https://imgur.com/a/oJr8UKV •</div>
        </div>
      </main>
    </div>
  );
}
