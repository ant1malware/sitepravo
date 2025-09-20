import React from "react";

export type RetroChatProps = {
  compact?: boolean;
  collapsed?: boolean;
};

const sampleMessages = [
  { id: 1, author: "mod", text: "Модерация включена." },
  { id: 2, author: "sky", text: "Новые токены в index.css." },
  { id: 3, author: "vip", text: "Смотрю на последнюю сборку." },
];

export default function RetroChat({ compact, collapsed }: RetroChatProps) {
  if (collapsed) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--text-2)]">
        Ретро-чат готов к запуску. <span className="text-[var(--accent)]">/ready</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 ${compact ? "text-xs" : "text-sm"}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold">Retro feed</span>
        <span className="text-[var(--text-2)]">LIVE</span>
      </div>
      <div className="space-y-2">
        {sampleMessages.map((msg) => (
          <div key={msg.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
            <div className="text-[var(--text-2)]">@{msg.author}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
