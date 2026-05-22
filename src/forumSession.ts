import * as React from "react";

export type ForumSession = {
  userId: string;
  remember?: boolean;
  lastLogin: string;
};

export const FORUM_SESSION_STORAGE_KEY = "forum:session";

/** Прочитать текущую сессию из storage */
export function readForumSession(): ForumSession | null {
  try {
    const raw =
      sessionStorage.getItem(FORUM_SESSION_STORAGE_KEY) ??
      localStorage.getItem(FORUM_SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ForumSession) : null;
  } catch {
    return null;
  }
}

/** Записать сессию и оповестить слушателей */
export function writeForumSession(s: ForumSession) {
  try {
    const target = s.remember ? localStorage : sessionStorage;
    target.setItem(FORUM_SESSION_STORAGE_KEY, JSON.stringify(s));
    dispatchForumSessionEvent();
  } catch {}
}

/** Очистить сессию и оповестить слушателей */
export function clearForumSession() {
  try {
    localStorage.removeItem(FORUM_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(FORUM_SESSION_STORAGE_KEY);
    dispatchForumSessionEvent();
  } catch {}
}

/** Событие для всех вкладок/компонентов — допускает аргумент (store иногда передаёт) */
export function dispatchForumSessionEvent(_?: any) {
  try {
    window.dispatchEvent(new Event("forum:session"));
  } catch {}
}

/** Хук-слушатель изменений сессии (используется в Sidebar/MobileMenu) */
export function useForumSessionWatcher() {
  const readNow = () => {
    try {
      const raw =
        sessionStorage.getItem(FORUM_SESSION_STORAGE_KEY) ??
        localStorage.getItem(FORUM_SESSION_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ForumSession) : null;
    } catch {
      return null;
    }
  };

  const [s, setS] = React.useState<ForumSession | null>(readNow());

  React.useEffect(() => {
    const on = () => setS(readNow());
    window.addEventListener("storage", on);
    window.addEventListener("forum:session", on as any);
    window.addEventListener("forum:changed", on as any);
    return () => {
      window.removeEventListener("storage", on);
      window.removeEventListener("forum:session", on as any);
      window.removeEventListener("forum:changed", on as any);
    };
  }, []);

  return s;
}
