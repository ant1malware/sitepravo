import React from "react";

export type RetroChatProps = {
  compact?: boolean;
  collapsed?: boolean;
};

type RetroMessage = {
  id: number;
  time: string;
  author: string;
  role: "admin" | "moderator" | "vip" | "user";
  text: string;
};

const sampleMessages: RetroMessage[] = [
  {
    id: 1,
    time: "22:41:12",
    author: "skyb0t",
    role: "admin",
    text: "Сервер синхронизирован. Комната SKY активна.",
  },
  {
    id: 2,
    time: "22:41:20",
    author: "mod",
    role: "moderator",
    text: "Помните про 16-значные инвайты. Нарушения = бан.",
  },
  {
    id: 3,
    time: "22:41:48",
    author: "vip",
    role: "vip",
    text: "Если не грузится, жмите Hard Refresh (Ctrl+F5).",
  },
  {
    id: 4,
    time: "22:42:03",
    author: "echo",
    role: "user",
    text: "Читаю последние ответы в Latest. Живой чат!",
  },
];

function roleAccent(role: RetroMessage["role"]) {
  switch (role) {
    case "admin":
      return "text-amber-300";
    case "moderator":
      return "text-emerald-300";
    case "vip":
      return "text-sky-300";
    default:
      return "text-[var(--text-2)]";
  }
}

export default function RetroChat({ compact, collapsed }: RetroChatProps) {
  if (collapsed) {
    return (
      <div className="rounded-xl border border-[#1e1f2b] bg-[#090a11] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-2)]">
        chat ready — <span className="text-amber-300">/join SKY</span>
      </div>
    );
  }

  const rowPadding = compact ? "py-1" : "py-1.5";
  const fontSize = compact ? "text-[11px]" : "text-sm";

  return (
    <div className={`retro-chat font-mono ${fontSize}`}>
      <div className="overflow-hidden rounded-2xl border border-[#1e1f2b] bg-[#090a11] shadow-[0_18px_50px_-34px_rgba(0,0,0,0.85)]">
        {sampleMessages.map((msg) => (
          <div
            key={msg.id}
            className={`grid grid-cols-[72px_110px_1fr] items-center gap-3 border-b border-[#12131d] px-3 ${rowPadding}`}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-2)] opacity-60">
              {msg.time}
            </span>
            <span className={`font-semibold uppercase tracking-[0.2em] ${roleAccent(msg.role)}`}>
              {msg.author}
            </span>
            <span className="leading-tight text-[var(--text-1)]/90">{msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
