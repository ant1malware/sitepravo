const fs = require('fs');
const file = 'src/store/forumRemote.ts';
let s = fs.readFileSync(file, 'utf8');

// Remove stray brace after BASE
s = s.replace(/\n}\nexport async function deleteSection/, '\nexport async function deleteSection');

// Insert TOKEN_KEY/readToken/api if missing
if (!s.includes('async function api(')) {
  const inject = `
const TOKEN_KEY = "forum:token";
function readToken(): string | null { try { return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY); } catch { return null; } }

async function api(path: string, init: RequestInit = {}) {
  const token = readToken();
  const headers: any = { "Content-Type": "application/json", ...(init.headers || {}) };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(BASE + path, { ...init, headers });
  const text = await res.text(); let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text || res.statusText }; }
  if (!res.ok) throw new Error(data?.error || (res.status + ' ' + res.statusText));
  return data;
}
`;
  s = s.replace(/const BASE: string = getApiBase\(\);\n?/, (m)=> m + inject);
}

// Insert types if missing
if (!s.includes('export type Section')) {
  const types = `
export type Section = { id: string; title: string; description?: string; icon?: string; createdAt: string; order: number; moderatorIds: string[]; topicCount: number; postCount: number };
export type Topic = { id: string; sectionId: string; title: string; authorId: string; createdAt: string; updatedAt: string; pinned: boolean; locked: boolean; viewCount: number; replyCount: number; lastPostAt: string; lastPostBy: string };
export type Post = { id: string; topicId: string; authorId: string; content: string; createdAt: string; editedAt?: string|null };
`;
  s = s.replace(/async function api\([\s\S]*?\)\n\}/, (m)=> m + types);
}

// Insert listSections/create/update if missing
if (!s.includes('export async function listSections')) {
  const functions = `
export async function listSections(): Promise<Section[]> { const { sections } = await api('/sections'); return sections as Section[] }
export async function createSection(input: { title: string; description?: string; icon?: string }): Promise<Section> { const { section } = await api('/sections', { method: 'POST', body: JSON.stringify(input) }); return section as Section }
export async function updateSection(id: string, patch: Partial<Section>): Promise<Section> { const { section } = await api('/sections/' + id, { method: 'PATCH', body: JSON.stringify(patch) }); return section as Section }
`;
  s = s.replace(/export async function deleteSection/, functions + 'export async function deleteSection');
}

fs.writeFileSync(file, s, 'utf8');
console.log('forumRemote.ts patched incrementally');
