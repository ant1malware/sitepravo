// Meta graph for related content
import { rolesData } from './roles';
import { interactionsData } from './interactions';

export type Dept = 'охрана' | 'юридический' | 'админ' | 'неизвестно';

export type MetaItemType = 'role' | 'procedure' | 'template';

export interface MetaItem {
  id: string;            // stable id, e.g. role:guard
  type: MetaItemType;
  title: string;
  tags: string[];
  dept?: Dept;
  level?: number;
  // optional description used for tooltips
  description?: string;
}

export const meta: MetaItem[] = [];

// ---- Roles → Meta
for (const r of rolesData as any[]) {
  const deptGuess: Dept | undefined = Array.isArray(r.dept)
    ? (r.dept.includes('ЮД') ? 'юридический' : r.dept.includes('ДВД') || r.dept.includes('охрана') ? 'охрана' : r.dept.includes('АДМ') ? 'админ' : undefined)
    : undefined;
  meta.push({
    id: `role:${r.id}`,
    type: 'role',
    title: r.role,
    tags: [r.role.split(' ')[0].toLowerCase(), ...(r.duties?.slice(0, 3) || []).map((d: string) => d.split(' ')[0].toLowerCase())],
    dept: deptGuess || 'неизвестно',
    level: parseInt(String(r.role).match(/\((\d+)\)/)?.[1] || '0', 10),
    description: (r.duties?.[0] as string | undefined) || undefined,
  });
}

// ---- Procedures (use interactions as близкий аналог)
for (const p of interactionsData as any[]) {
  meta.push({
    id: `procedure:${p.id}`,
    type: 'procedure',
    title: p.role,
    tags: [p.role.split(' ')[0].toLowerCase(), ...(p.tips?.slice(0, 3) || []).map((t: string) => t.split(' ')[0].toLowerCase())],
    dept: 'админ',
    description: (p.tips?.[0] as string | undefined) || undefined,
  });
}

// Templates are provided by callers via computed ids (tpl:<slug>)

export function findById(id: string) {
  return meta.find((m) => m.id === id);
}

export interface RelatedResult {
  procedures: MetaItem[];
  templates: MetaItem[]; // kept for API symmetry; currently empty until explicit templates are added
  roles: MetaItem[];
}

function textScore(hay: string, needle: string) {
  hay = hay.toLowerCase();
  needle = needle.toLowerCase();
  if (hay.includes(needle)) return 2;
  // partial word overlap
  const a = new Set(hay.split(/[^\p{L}\p{N}]+/u).filter(Boolean));
  const b = new Set(needle.split(/[^\p{L}\p{N}]+/u).filter(Boolean));
  let c = 0; for (const w of b) if (a.has(w)) c++;
  return c > 0 ? 1 : 0;
}

export function relatedFor(item: MetaItem, limit = 6): RelatedResult {
  const sameDept = (x?: Dept) => (item.dept && x) ? (item.dept === x) : true;
  const itemTags = new Set((item.tags || []).map((t) => t.toLowerCase()));

  function score(other: MetaItem): number {
    if (other.id === item.id) return -1;
    let s = 0;
    if (sameDept(other.dept)) s += 2;
    const shared = (other.tags || []).reduce((acc, t) => acc + (itemTags.has(String(t).toLowerCase()) ? 1 : 0), 0);
    s += Math.min(shared, 3);
    s += textScore(other.title, item.title);
    return s;
  }

  const scored = meta
    .filter((m) => m.type !== item.type) // prefer cross-type
    .map((m) => ({ m, s: score(m) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit * 2)
    .map((x) => x.m);

  const out: RelatedResult = { procedures: [], templates: [], roles: [] };
  for (const m of scored) {
    if (m.type === 'procedure' && out.procedures.length < limit) out.procedures.push(m);
    else if (m.type === 'template' && out.templates.length < limit) out.templates.push(m);
    else if (m.type === 'role' && out.roles.length < limit) out.roles.push(m);
  }
  return out;
}

export function slugify(t: string) {
  return String(t)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

