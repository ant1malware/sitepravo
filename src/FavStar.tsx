// src/FavStar.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { isFavorite, toggleFavoriteMeta, type FavKind } from './favorites';

export default function FavStar({
  kind,
  id,
  title,
  url,
  size = 'md',
}: {
  kind: FavKind;
  id: string;
  title?: string;
  url?: string;
  size?: 'sm' | 'md';
}) {
  const [active, setActive] = React.useState<boolean>(() => isFavorite(kind, id));
  React.useEffect(() => { setActive(isFavorite(kind, id)); }, [kind, id]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    const v = toggleFavoriteMeta(kind, id, { title, url });
    setActive(v);
  }

  const dims = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const iconDims = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      onClick={onClick}
      title={active ? 'В избранном' : 'В закладки'}
      aria-label={active ? 'Удалить из избранного' : 'Добавить в избранное'}
      className={`fav-star-btn ${dims} ${active ? 'is-active' : ''}`}
    >
      <Star className={`fav-star-icon ${iconDims}`} />
    </button>
  );
}
