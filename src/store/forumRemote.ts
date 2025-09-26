// Remote forum store (Cloudflare Worker API)
// Uses the same base and token as authRemote

function getApiBase(): string {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('api');
    if (fromQuery) {
      localStorage.setItem('forum:api_base', fromQuery);
      try { url.searchParams.delete('api'); history.replaceState({}, '', url.toString()); } catch {}
    }
    const stored = localStorage.getItem('forum:api_base');
    if (stored) return stored;
  } catch {}
  const env = (import.meta as any).env?.VITE_API_BASE;
  if (env) return env;
  return '';
}
const BASE: string = getApiBase();

const TOKEN_KEY = 'forum:token';
function readToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}

async function api(path: string, init: RequestInit = {}) {
  const token = readToken();
  const headers: any = { 'Content-Type': 'application/json', ...(init.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const text = await res.text(); let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text || res.statusText }; }
  if (!res.ok) throw new Error(data?.error || `${res.status} ${res.statusText}`);
  return data;
}

export type Section = { id: string; title: string; description?: string; icon?: string; createdAt: string; order: number; moderatorIds: string[]; topicCount: number; postCount: number };
export type Topic   = { id: string; sectionId: string; title: string; authorId: string; createdAt: string; updatedAt: string; pinned: boolean; locked: boolean; viewCount: number; replyCount: number; lastPostAt: string; lastPostBy: string };
export type Post    = { id: string; topicId: string; authorId: string; content: string; createdAt: string; editedAt?: string|null };

export async function listSections(): Promise<Section[]> {
  const { sections } = await api('/sections');
  return sections as Section[];
}
export async function createSection(input: { title: string; description?: string; icon?: string }): Promise<Section> {
  const { section } = await api('/sections', { method: 'POST', body: JSON.stringify(input) });
  return section as Section;
}
export async function updateSection(id: string, patch: Partial<Section>): Promise<Section> {
  const { section } = await api(`/sections/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
  return section as Section;
}
export async function deleteSection(id: string): Promise<void> {
  await api(`/sections/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function listTopics(sectionId?: string): Promise<Topic[]> {
  const qs = sectionId ? `?sectionId=${encodeURIComponent(sectionId)}` : '';
  const { topics } = await api(`/topics${qs}`);
  return topics as Topic[];
}
export async function createTopic(input: { sectionId: string; title: string; content?: string }): Promise<Topic> {
  const { topic } = await api('/topics', { method: 'POST', body: JSON.stringify(input) });
  return topic as Topic;
}
export async function updateTopic(id: string, patch: Partial<Topic>): Promise<Topic> {
  const { topic } = await api(`/topics/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
  return topic as Topic;
}
export async function moveTopic(id: string, to: string): Promise<Topic> {
  const { topic } = await api(`/topics/${id}/move`, { method: 'POST', body: JSON.stringify({ to }) });
  return topic as Topic;
}
export async function deleteTopic(id: string): Promise<void> {
  await api(`/topics/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function listPosts(topicId: string): Promise<Post[]> {
  const { posts } = await api(`/posts?topicId=${encodeURIComponent(topicId)}`);
  return posts as Post[];
}
export async function createPost(input: { topicId: string; content: string }): Promise<Post> {
  const { post } = await api('/posts', { method: 'POST', body: JSON.stringify(input) });
  return post as Post;
}
export async function listLatestPosts(limit = 8): Promise<Post[]> {
  const { posts } = await api(`/latest-posts?limit=${limit}`);
  return posts as Post[];
}