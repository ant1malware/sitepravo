export const FEED_TYPES = [
  'latest',
  'hot',
  'new',
  'following',
  'unanswered',
  'unread',
  'questions',
] as const;
export type FeedType = (typeof FEED_TYPES)[number];
const KEY = 'forum:default_feed';

export function isFeedType(value: unknown): value is FeedType {
  return typeof value === 'string' && (FEED_TYPES as readonly string[]).includes(value);
}

export function getDefaultFeed(): FeedType {
  try {
    const raw = localStorage.getItem(KEY);
    if (isFeedType(raw)) return raw;
  } catch {}
  return 'latest';
}

export function setDefaultFeed(feed: FeedType) {
  if (!isFeedType(feed)) return;
  try {
    localStorage.setItem(KEY, feed);
  } catch {}
}
