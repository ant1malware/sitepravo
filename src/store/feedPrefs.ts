export type FeedType = 'hot' | 'new' | 'questions';
const KEY = 'forum:default_feed';

export function getDefaultFeed(): FeedType {
  try { const v = localStorage.getItem(KEY) as FeedType | null; if (v === 'hot' || v === 'new' || v === 'questions') return v; } catch {}
  return 'hot';
}
export function setDefaultFeed(feed: FeedType) {
  try { localStorage.setItem(KEY, feed); } catch {}
}
