const PREFIX = 'forum:read:'; // forum:read:<userId>:<topicId>

export function markTopicRead(userId: string, topicId: string, lastPostAt?: string) {
  if (!userId || !topicId) return;
  try {
    const key = `${PREFIX}${userId}:${topicId}`;
    const stamp = lastPostAt || new Date().toISOString();
    localStorage.setItem(key, stamp);
  } catch {}
}

export function getTopicReadAt(userId: string, topicId: string): string | null {
  if (!userId || !topicId) return null;
  try {
    return localStorage.getItem(`${PREFIX}${userId}:${topicId}`);
  } catch {
    return null;
  }
}

export function isTopicUnread(userId: string | undefined | null, topic: { id: string; updatedAt?: string; lastPostAt?: string }): boolean {
  if (!userId) return false;
  const updated = new Date(topic.lastPostAt || topic.updatedAt || 0).getTime();
  if (!updated) return false;
  const readIso = getTopicReadAt(userId, topic.id);
  if (!readIso) return true;
  const readTs = new Date(readIso).getTime();
  if (!Number.isFinite(readTs)) return true;
  return updated > readTs;
}

