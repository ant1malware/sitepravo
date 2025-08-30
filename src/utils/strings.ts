export function slugify(t: string) {
  return String(t)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export function escapeHtml(s: string) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as any)[c]);
}

export function escRe(s: string) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeQuery(s: string) {
  let out = String(s).trim().toLowerCase();
  // Нормализация популярных сокращений (пример)
  out = out
    .replace(/\bст\.?\s*/g, 'статья ')
    .replace(/\bук\b/g, 'уголовный кодекс')
    .replace(/\bкоап\b/g, 'коап')
    .replace(/\s+/g, ' ');
  return out;
}

export function termsFrom(s: string) {
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ').split(' ').filter(Boolean);
}

