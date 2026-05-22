#!/usr/bin/env node
// npm i axios cheerio turndown
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

const BASE = "https://forum.amazing-online.com/forums/zakonodatelstvo.732/";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const RATE_MS = 1200;

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.remove(["script", "style"]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function norm(s = "") {
  return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
}
function hasNext($) {
  return $(".pageNav-jump--next, a.pageNav-next").length > 0;
}
function isChallenge(html) {
  // Детектор защитной страницы — НЕ обходим, просто предупреждаем
  return /R3ACTLB-PRT|cf-chl|challenge|please enable javascript/i.test(html);
}

function mapLawMeta(title) {
  const t = title.toLowerCase();
  if (t.includes("уголовный кодекс")) return { slug: "uk", abbr: "УК", notes: "Составы преступлений и наказания." };
  if (t.includes("административных правонаруш")) return { slug: "koap", abbr: "КоАП", notes: "Административные составы и штрафы." };
  if (t.includes("правила дорожного движения")) return { slug: "pdd", abbr: "ПДД", notes: "Обязанности водителей и пешеходов." };
  if (t.includes("конституция") && t.includes("нижегород")) return { slug: "constitution", abbr: "КОНСТ", notes: "Права и устройство власти." };
  if (t.includes("территор") && t.includes("ограниченным доступ")) return { slug: "fzo-tod", abbr: "ФЗоТОД", notes: "Режим охраняемых/служебных зон." };
  if (t.includes("военной службе")) return { slug: "fzo-vs", abbr: "ФЗоВС", notes: "Порядок прохождения службы." };
  if (t.includes("федеральной службе безопасности")) return { slug: "fzo-fsb", abbr: "ФЗоФСБ", notes: "Статус и полномочия ФСБ." };
  if (t.includes("трудовой кодекс")) return { slug: "tk", abbr: "ТК", notes: "Трудовые отношения." };
  if (t.includes("судебной системе")) return { slug: "fzo-sud", abbr: "ФЗоСуд", notes: "Устройство судов и судей." };
  if (t.includes("прокуратуре")) return { slug: "fzo-prok", abbr: "ФЗоПрок", notes: "Надзор, полномочия прокуратуры." };
  if (t.includes("государственной тайне")) return { slug: "state-secret", abbr: "Гостайна", notes: "Режим, допуски, ответственность." };

  // запасной
  const slug = t.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").slice(0, 80);
  const abbr = title.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 8);
  return { slug, abbr, notes: "" };
}

function toMarkdown(html) {
  let md = turndown.turndown(
    html
      // убираем «Нажмите, чтобы раскрыть…» и подобные обёртки
      .replace(/Нажмите, чтобы раскрыть[.\s\S]*?(?=<\/|$)/gi, "")
  );

  // Подчистим хвосты и приведём заголовки
  md = md
    .replace(/\n?Отредактировано:.*$/gim, "")
    .replace(/^\s*Глава\s+([^\n]+)$/gim, "## Глава $1")
    .replace(/^\s*Часть\s+([^\n]+)$/gim, "## Часть $1")
    .replace(/^\s*Статья\s+(\d+(\.\d+)?([–-]\d+)?)\s*(.*)$/gim, "### Статья $1 $4")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return md;
}

async function fetch(url) {
  const res = await axios.get(url, { headers: { "User-Agent": UA } });
  await sleep(RATE_MS);
  if (isChallenge(res.data)) {
    throw new Error(
      `Сайт вернул защитную страницу на ${url}. Не обходим — скачай HTML вручную и загрузи в проект.`
    );
  }
  return res.data;
}

async function getTopics() {
  const seen = new Set();
  const topics = [];
  for (let page = 1; ; page++) {
    const html = await fetch(page === 1 ? BASE : `${BASE}?page=${page}`);
    console.log(html.slice(0,500));
    const $ = cheerio.load(html);

    $(".structItem--thread .structItem-title a:first-child").each((_, a) => {
      const href = $(a).attr("href");
      const title = norm($(a).text());
      if (!href || !title) return;
      const url = new URL(href, "https://forum.amazing-online.com").href;
      if (seen.has(url)) return;
      seen.add(url);
      topics.push({ url, title });
    });

    if (!hasNext($)) break;
  }
  return topics;
}

async function getTopicMarkdown(url) {
  let all = "";
  for (let page = 1; ; page++) {
    const html = await fetch(page === 1 ? url : `${url}?page=${page}`);
    const $ = cheerio.load(html);
    $(".message-body .bbWrapper").each((_, el) => {
      all += ($(el).html() || "") + "\n";
    });
    if (!hasNext($)) break;
  }
  return toMarkdown(all);
}

function escapeTemplate(s) {
  return s.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

async function run() {
  const OUT_TS = path.resolve(process.cwd(), "src/laws.ts"); // <- корректный путь
  const topics = await getTopics();

  const docs = [];
  for (const t of topics) {
    console.log("Забираю:", t.title);
    const meta = mapLawMeta(t.title);
    const content = await getTopicMarkdown(t.url);
    docs.push({
      slug: meta.slug,
      abbr: meta.abbr,
      title: t.title,
      notes: meta.notes,
      updated: new Date().toISOString().slice(0, 10),
      content,
    });
  }

  const header = `export interface LawDoc { slug:string; abbr:string; title:string; notes?:string; updated?:string; content:string; }\nexport const lawsData: LawDoc[] = [\n`;
  const body = docs
    .map(
      (d) => `  {
    slug: "${d.slug}",
    abbr: "${d.abbr}",
    title: ${JSON.stringify(d.title)},
    notes: ${JSON.stringify(d.notes)},
    updated: "${d.updated}",
    content: \`
${escapeTemplate(d.content)}
\`
  }`
    )
    .join(",\n");
  const footer = `\n];\n`;

  await fs.writeFile(OUT_TS, header + body + footer, "utf8");
  console.log("Готово:", OUT_TS);
}

run().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
