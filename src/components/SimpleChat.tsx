import React from 'react';

type ChatMessage = {
  id: string;
  author: string;
  text: string;
  ts: number;
  edited?: boolean;
};

type Props = {
  room?: string;
  allowAdminEdit?: boolean;
};

// Lightweight chat: localStorage + BroadcastChannel; optional WS via VITE_CHAT_WS
export default function SimpleChat({ room = 'global', allowAdminEdit = true }: Props) {
  const KEY = React.useMemo(() => `chat:${room}`, [room]);
  const bcRef = React.useRef<BroadcastChannel | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch { return []; }
  });
  const [input, setInput] = React.useState('');
  const [name, setName] = React.useState<string>(() => {
    try { return localStorage.getItem('chat:name') || `Guest${Math.floor(Math.random()*900+100)}`; } catch { return 'Guest'; }
  });
  const isAdmin = React.useMemo(() => {
    try { return localStorage.getItem('chat:admin') === '1' || name.toLowerCase() === 'admin'; } catch { return name.toLowerCase() === 'admin'; }
  }, [name]);

  React.useEffect(() => { try { localStorage.setItem('chat:name', name); } catch {} }, [name]);
  React.useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(messages)); } catch {}
    try { bcRef.current?.postMessage({ type: 'sync', payload: messages }); } catch {}
  }, [messages, KEY]);

  React.useEffect(() => {
    try {
      const bc = new BroadcastChannel(`bc:${KEY}`);
      bcRef.current = bc;
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'sync' && Array.isArray(ev.data.payload)) {
          setMessages(ev.data.payload as ChatMessage[]);
        }
      };
      return () => bc.close();
    } catch { /* ignore */ }
  }, [KEY]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = { id: crypto.randomUUID(), author: isAdmin ? 'Admin' : name, text, ts: Date.now() };
    setMessages((arr) => [...arr, msg].slice(-200));
    setInput('');
  }
  function del(id: string) { if (!isAdmin || !allowAdminEdit) return; setMessages((arr) => arr.filter((m) => m.id !== id)); }
  function edit(id: string) {
    if (!isAdmin || !allowAdminEdit) return;
    const current = messages.find((m) => m.id === id); if (!current) return;
    const next = prompt('Изменить сообщение:', current.text)?.trim(); if (!next) return;
    setMessages((arr) => arr.map((m) => (m.id === id ? { ...m, text: next, edited: true } : m)));
  }

  return (
    <div className="rounded-2xl border border-[color:var(--card-border)] bg-[var(--surface)] p-3 text-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="font-medium">Общий чат</div>
        <div className="flex items-center gap-2">
          <input
            className="w-32 rounded-md border border-[color:var(--card-border)] bg-transparent px-2 py-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            title="Ваше имя в чате"
          />
          <button
            className="btn !px-2 !py-1"
            onClick={() => { try { localStorage.setItem('chat:admin', '1'); setName('Admin'); } catch { setName('Admin'); } }}
            title="Подписаться как Admin"
          >Admin</button>
        </div>
      </div>
      <div className="max-h-72 overflow-auto rounded-lg border border-[color:var(--card-border)] bg-white/5 p-2 dark:bg-black/20">
        {messages.length === 0 && <div className="opacity-70">Пока сообщений нет. Напишите первым!</div>}
        <ul className="space-y-1">
          {messages.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs opacity-70">{new Date(m.ts).toLocaleString()} · <b>{m.author}</b>{m.edited ? ' (изменено)' : ''}</div>
                <div>{m.text}</div>
              </div>
              {isAdmin && (
                <div className="shrink-0">
                  <button className="btn !px-2 !py-0.5" onClick={() => edit(m.id)}>Ред.</button>
                  <button className="btn !px-2 !py-0.5" onClick={() => del(m.id)}>Удал.</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <form
        className="mt-2 flex items-center gap-2"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <input
          className="flex-1 rounded-md border border-[color:var(--card-border)] bg-transparent px-2 py-1"
          placeholder="Сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Отправить</button>
      </form>
    </div>
  );
}

