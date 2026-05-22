import React from 'react';
import { findById, relatedFor, type MetaItemType, type MetaItem } from './meta';

function Section({ title, items }: { title: string; items: MetaItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-2 text-xs">
      <div className="mb-1 font-semibold opacity-70">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 6).map((i) => (
          <span
            key={i.id}
            title={i.description || i.title}
            className="inline-flex max-w-[14rem] items-center gap-1 truncate rounded-full border px-2 py-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <span className="truncate">{i.title}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RelatedBlock({ itemId, itemType }: { itemId: string; itemType: MetaItemType }) {
  const item = findById(itemId);
  if (!item) return <div className="mt-2 text-xs italic opacity-60">Пока без связей</div>;
  const rel = relatedFor(item);
  const count = rel.procedures.length + rel.templates.length + rel.roles.length;
  return (
    <div className="mt-3 rounded-xl border border-zinc-200 p-2 dark:border-zinc-800">
      <div className="mb-1 text-xs font-semibold">Связано с этим: {count}</div>
      <Section title="Процедуры" items={rel.procedures} />
      <Section title="Шаблоны" items={rel.templates} />
      <Section title="Роли" items={rel.roles} />
      {!count && <div className="text-xs opacity-60">Пока без связей</div>}
    </div>
  );
}

