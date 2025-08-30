import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Search,
  BookOpen,
  Shield,
  Gavel,
  Radio,
  Building2,
  MapPin,
  ClipboardList,
  FileText,
  Users,
} from "lucide-react";

import { rolesData } from "./roles";
import { lawsData } from "./laws";

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
    className="flex items-center gap-2 rounded-xl border px-3 py-1 text-sm hover:bg-zinc-100 active:scale-[0.98]"
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
  <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-semibold leading-tight">{title}</h3>
    </div>
    <div className="prose prose-zinc max-w-none text-sm leading-relaxed">
      {children}
    </div>
    {footer && (
      <div className="mt-3 border-t pt-3 text-xs text-zinc-500">{footer}</div>
    )}
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
  <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium">
    {children}
  </span>
);

/* ================== Навигация по вкладкам ================== */
const TABS = [
  { id: "roles", label: "Роли", icon: <Users className="h-4 w-4" /> },
  { id: "templates", label: "Доклады", icon: <Radio className="h-4 w-4" /> },
  { id: "posts", label: "Посты", icon: <MapPin className="h-4 w-4" /> },
  { id: "procedures", label: "Процедуры", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "interactions", label: "Взаимодействие", icon: <Shield className="h-4 w-4" /> },
  { id: "laws", label: "Законы", icon: <BookOpen className="h-4 w-4" /> },
];

/* ================== Данные для карточек ================== */
// Шаблоны докладов (в рацию)
const radioByRole: Record<string, string[]> = {
  Охрана: [
    "Докладывает: (Фамилия). Заступил на пост (номер поста).",
    "Докладывает: (Фамилия). Продолжаю дежурство на посту (номер поста).",
    "Докладывает: (Фамилия). Покинул пост (номер поста).",
    "Докладывает: (Фамилия). Начал охранять (Должность) (Фамилия).",
    "Докладывает: (Фамилия). Продолжаю охранять (Должность) (Фамилия).",
    "Докладывает: (Фамилия). Закончил охранять (Должность) (Фамилия).",
  ],
  Адвокат: [
    "Докладывает: (Фамилия), начал оказывать юридическую помощь.",
    "Докладывает: (Фамилия), закончил оказывать юридическую помощь.",
    "Докладывает: (Фамилия), начал дежурство в комнате свиданий.",
    "Докладывает: (Фамилия), продолжаю дежурство в комнате свиданий.",
    "Докладывает: (Фамилия), закончил дежурство в комнате свиданий.",
  ],
  Инспектор: [
    "Докладывает: (Фамилия), начал контролировать собеседование (начало).",
    "Докладывает: (Фамилия), продолжаю контролировать собеседование (продолжение).",
    "Докладывает: (Фамилия), закончил контролировать собеседование (конец).",
    "Докладывает: (Фамилия), выехал на проверку постов ГАИ/УМВД.",
    "Докладывает: (Фамилия), пост: (Название поста), сотрудники: (отсутствуют/присутствуют).",
    "Докладывает: (Фамилия), закончил проверку постов ГАИ/УМВД.",
    "Докладывает: (Фамилия), начал дежурство за стойкой регистрации.",
    "Докладывает: (Фамилия), продолжаю дежурство за стойкой регистрации.",
    "Докладывает: (Фамилия), закончил дежурство за стойкой регистрации.",
  ],
  "Зам. Министра": [
    "Докладывает: (Фамилия), начал контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.",
    "Докладывает: (Фамилия), продолжил контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.",
    "Докладывает: (Фамилия), закончил контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.",
  ],
  Советник: [
    "Докладывает: (Фамилия), начал контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "Докладывает: (Фамилия), продолжил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
    "Докладывает: (Фамилия), закончил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.",
  ],
};

// Посты A1–E2
const postsData = [
  { code: "A1-A2", where: "Вход в здание Правительства", img: "/img/a1.png" },
  { code: "B1-B2", where: "Холл здания Правительства", img: "/img/b1.png" },
  { code: "C1-C2", where: "Задний вход, парковка", img: "/img/c1.png" },
  { code: "D1-D2", where: "Ворота на парковку", img: "/img/d1.png" },
  { code: "E1-E2", where: "Возле кабинета Губернатора", img: "/img/e1.png" },
];

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
              title: `${law.title} — ${header}`,
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
    const sec = law.content
      .split(/\n(?=###\s+)/g)
      .find((s) => re.test(s));
    if (!sec) return `/laws/${law.slug}`;
    const header = sec.match(/^###\s*(.+)$/m)?.[1] || `Статья ${num}`;
    const id = slugify(header);
    return `/laws/${law.slug}#${id}`;
  }

  async function doSearch(s: string) {
    const idx = (window as any).__LAW_INDEX__;
    const docs = (window as any).__LAW_DOCS__ as any[];
    if (!idx || !docs) return;

    const direct = tryDirectJump(s);
    if (direct) {
      setResults([
        { url: direct, title: "Перейти к статье", excerpt: s.toUpperCase() },
      ]);
      return;
    }

    const qn = normalizeQuery(s);
    const found = idx.search(qn, { enrich: true, limit: 20 }) as any[];
    const ids = new Set<string>();
    const rows: any[] = [];
    for (const block of found) {
      for (const r of block.result) {
        if (ids.has(r.id)) continue;
        ids.add(r.id);
        const doc = docs.find((d) => d.id === r.id);
        if (!doc) continue;
        rows.push({
          url: `/laws/${doc.slug}`,
          title: doc.title,
          excerpt: doc.excerpt || doc.title,
        });
      }
    }
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
    <div className="rounded-2xl border bg-white/80 p-3">
      <div className="mb-2 text-xs text-zinc-600">
        Примеры: <code>ук 105</code>, <code>ст 12 коап</code>,{" "}
        <code>обязанности водителя</code>
      </div>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по всем законам (фразы, статьи, номера)…"
          className="w-full rounded-xl border px-3 py-1.5 text-sm focus:outline-none focus:ring"
        />
      </div>

      {!!results.length && (
        <div className="mt-3 grid gap-2">
          {results.map((r, i) => (
            <Link
              key={i}
              to={r.url}
              className="block rounded-xl border p-3 hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-zinc-500">
                {r.excerpt}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================== Страница ================== */
export default function GovCheatsheetSky() {
  const [tab, setTab] = useState<string>(TABS[0].id);

  // чип-фильтры для карточек законов
  const chips = ["Все", "УК", "КоАП", "ПДД", "ФП", "ФЗоП", "ФЗоТОД", "ФЗоВС", "ФЗоФСБ", "УПК", "КАС", "Гостайна", "ФЗоПрок", "ФЗоСуд"];
  const [chip, setChip] = useState<string>("Все");
  const cardLaws = useMemo(
    () => lawsData.filter((l) => chip === "Все" || l.abbr.toLowerCase() === chip.toLowerCase()),
    [chip]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6" />
            <div>
              <div className="text-lg font-bold leading-tight">Правительство — Памятка (SKY)</div>
              <div className="text-xs text-zinc-500">Локальные тексты • быстрый поиск • мобильный UI</div>
            </div>
          </div>
          <nav className="flex w-full gap-2 overflow-x-auto md:w-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${
                  tab === t.id ? "bg-zinc-900 text-white" : "bg-white hover:bg-zinc-50"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* РОЛИ */}
        {tab === "roles" && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rolesData.map((r) => (
              <Link key={r.id} to={`/roles/${r.id}`} className="block">
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4" />
                      <span>{r.role}</span>
                      <Badge>{r.salary}</Badge>
                    </div>
                  }
                  footer={<div>Источник: <Source href={r.source || "#"} /></div>}
                >
                  <ul className="ml-4 list-disc">
                    {r.duties.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </Card>
              </Link>
            ))}

            <Card
              title={
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  График, критерии, структура
                </div>
              }
              footer={
                <div>
                  Инфо-раздел:{" "}
                  <Source href="https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/" />
                </div>
              }
            >
              <ul className="ml-4 list-disc">
                <li>Рабочие дни: пн–пт 10:00–18:00; сб–вс 10:00–15:00; перерыв 13:00–14:00</li>
                <li>Критерии: 8+ лет стажа, 75+ законопослушности, юр-образование</li>
                <li>Отделы: ДВД (МВД), ДВС (ВЧ), ДЗ (ЕСС), СО (охрана)</li>
              </ul>
            </Card>
          </section>
        )}

        {/* ДОКЛАДЫ */}
        {tab === "templates" && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(radioByRole).map(([title, lines]) => (
              <Card
                key={title}
                title={
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4" />
                    Доклады — {title}
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
        {tab === "posts" && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {postsData.map((p) => (
              <div
                key={p.code}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white p-4 text-center shadow-sm"
              >
                <div className="text-2xl font-extrabold">{p.code}</div>
                <div className="text-xs text-zinc-500">{p.where}</div>
              </div>
            ))}
          </section>
        )}

        {/* ПРОЦЕДУРЫ (пример) */}
        {tab === "procedures" && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Выдача лицензий
                </div>
              }
            >
              <ol className="ml-4 list-decimal">
                <li>Попросить паспорт гражданина ((/pass)).</li>
                <li>Оформить лицензию, проверить данные и подпись.</li>
                <li>Вернуть паспорт вместе с лицензией.</li>
              </ol>
            </Card>
          </section>
        )}

        {/* ВЗАИМОДЕЙСТВИЕ */}
        {tab === "interactions" && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Связь и субординация
                </div>
              }
            >
              <ul className="ml-4 list-disc">
                <li>Всегда представляться: должность/звание + фамилия.</li>
                <li>Запрещены оффтоп и помехи в служебной рации.</li>
                <li>Соблюдать регламент общения и дисциплину.</li>
              </ul>
            </Card>
          </section>
        )}

        {/* ЗАКОНЫ */}
        {tab === "laws" && (
          <section className="grid gap-4">
            {/* умный глобальный поиск */}
            <SmartLawSearch />

            {/* чип-фильтры карточек */}
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setChip(c)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    chip === c ? "bg-zinc-900 text-white" : "bg-white hover:bg-zinc-50"
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
        <div className="mt-8 grid gap-3 rounded-2xl border bg-white/70 p-4 text-xs text-zinc-500">
          <div>UI для ПК и телефонов • тексты локально • офлайн не нужен.</div>
        </div>
      </main>
    </div>
  );
}