import React from 'react';

export type ForumSession = {
  userId: string;
  remember: boolean;
  lastLogin: string;
};

export const FORUM_SESSION_STORAGE_KEY = 'forum:auth:session';
export const FORUM_SESSION_EVENT = 'forum:session-change';

function parseSession(raw: string | null): ForumSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const userId = typeof parsed.userId === 'string' ? parsed.userId : '';
    if (!userId) return null;
    const remember = Boolean((parsed as any).remember);
    const lastLogin = typeof parsed.lastLogin === 'string' && parsed.lastLogin
      ? parsed.lastLogin
      : new Date().toISOString();
    return { userId, remember, lastLogin };
  } catch {
    return null;
  }
}

export function readForumSession(): ForumSession | null {
  if (typeof window === 'undefined') return null;
  const localRaw = window.localStorage.getItem(FORUM_SESSION_STORAGE_KEY);
  const sessionRaw = window.sessionStorage.getItem(FORUM_SESSION_STORAGE_KEY);
  return parseSession(localRaw) ?? parseSession(sessionRaw);
}

export function dispatchForumSessionEvent(session: ForumSession | null) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent(FORUM_SESSION_EVENT, {
        detail: { session },
      }),
    );
  } catch {
    // noop
  }
}

export function useForumSessionWatcher(): ForumSession | null {
  const [session, setSession] = React.useState<ForumSession | null>(() => {
    try {
      return readForumSession();
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const update = () => {
      try {
        setSession(readForumSession());
      } catch {
        setSession(null);
      }
    };

    window.addEventListener('storage', update);
    window.addEventListener(FORUM_SESSION_EVENT, update as EventListener);

    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener(FORUM_SESSION_EVENT, update as EventListener);
    };
  }, []);

  return session;
}