// src/favorites.ts
export type FavKind = 'role' | 'law' | 'vu' | 'lawsec';

export type FavMeta = {
  title?: string;
  url?: string;
};

export type FavListItem = {
  kind: FavKind;
  id: string;
  title?: string;
  url?: string;
};

const FAV_PREFIX = 'fav:';
const META_PREFIX = 'fav:item:';

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function favKey(kind: FavKind, id: string) {
  return `${FAV_PREFIX}${kind}:${id}`;
}

function metaKey(kind: FavKind, id: string) {
  return `${META_PREFIX}${kind}:${id}`;
}

function notifyChange() {
  try {
    window.dispatchEvent(new CustomEvent('favorites:change'));
  } catch {}
}

/** Проверка: в избранном ли элемент */
export function isFavorite(kind: FavKind, id: string): boolean {
  if (!hasLocalStorage()) return false;
  try {
    return !!localStorage.getItem(favKey(kind, id));
  } catch {
    return false;
  }
}

/**
 * Тоггл избранного с метаданными.
 * Если элемента не было — добавляет и сохраняет meta.
 * Если был — удаляет и сам элемент, и meta.
 * Возвращает новое состояние (true = в избранном).
 */
export function toggleFavoriteMeta(
  kind: FavKind,
  id: string,
  meta?: FavMeta
): boolean {
  if (!hasLocalStorage()) return false;

  const fk = favKey(kind, id);
  const mk = metaKey(kind, id);

  try {
    const existed = !!localStorage.getItem(fk);
    if (existed) {
      localStorage.removeItem(fk);
      localStorage.removeItem(mk);
      notifyChange();
      return false;
    } else {
      localStorage.setItem(fk, '1');
      if (meta && (meta.title || meta.url)) {
        localStorage.setItem(mk, JSON.stringify(meta));
      }
      notifyChange();
      return true;
    }
  } catch {
    return false;
  }
}

/** Простой тоггл без метаданных (если где-то ещё используется) */
export function toggleFavorite(kind: FavKind, id: string): boolean {
  if (!hasLocalStorage()) return false;
  const fk = favKey(kind, id);
  try {
    if (localStorage.getItem(fk)) {
      localStorage.removeItem(fk);
      localStorage.removeItem(metaKey(kind, id));
      notifyChange();
      return false;
    } else {
      localStorage.setItem(fk, '1');
      notifyChange();
      return true;
    }
  } catch {
    return false;
  }
}

/** Получить все избранные (с метаданными, если есть) */
export function listFavoritesMeta(kind?: FavKind): FavListItem[] {
  const out: FavListItem[] = [];
  if (!hasLocalStorage()) return out;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      const m = /^fav:(role|law|vu|lawsec):(.+)$/.exec(k);
      if (!m) continue;

      const curKind = m[1] as FavKind;
      const id = m[2];
      if (kind && curKind !== kind) continue;

      let meta: FavMeta | null = null;
      try {
        const raw = localStorage.getItem(metaKey(curKind, id));
        meta = raw ? (JSON.parse(raw) as FavMeta) : null;
      } catch {
        meta = null;
      }

      out.push({ kind: curKind, id, title: meta?.title, url: meta?.url });
    }
  } catch {
    // ignore
  }
  // Sort by kind, then title
  return out.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    return (a.title || a.id).localeCompare(b.title || b.id);
  });
}

/** Совместимый алиас под старый импорт в FavoritesPage.tsx */
export function listFavorites(kind?: FavKind): FavListItem[] {
  return listFavoritesMeta(kind);
}

/** Совместимая «удалялка» под старый импорт */
export function removeFavorite(kind: FavKind, id: string): void {
  if (isFavorite(kind, id)) {
    toggleFavoriteMeta(kind, id);
  }
}

// Utils for other modules
export function isFavKey(k: string): boolean {
  return k.startsWith(FAV_PREFIX) || k.startsWith(META_PREFIX);
}
