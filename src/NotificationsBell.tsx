import React from 'react'
import { Bell } from 'lucide-react'
import LiquidGlass from './components/LiquidGlass'

type Notif = {
  id: string
  title?: string
  text: string
  date?: string // ISO
  url?: string
}

const FEED_URL = (import.meta as any).env?.VITE_NOTIF_URL || import.meta.env.VITE_NOTIF_URL || '/api/notifications'
const SEEN_KEY = 'notif:lastSeen'

export default function NotificationsBell() {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<Notif[]>([])
  const [unread, setUnread] = React.useState<number>(0)

  async function load() {
    try {
      const r = await fetch(FEED_URL, { cache: 'no-store' })
      if (!r.ok) return
      const data = (await r.json()) as { items?: Notif[] } | Notif[]
      const list = Array.isArray(data) ? data : (data.items || [])
      list.sort((a, b) => (new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()))
      setItems(list)
      const lastSeen = localStorage.getItem(SEEN_KEY) || ''
      const idx = lastSeen ? list.findIndex(x => x.id === lastSeen) : -1
      const count = idx === -1 ? list.length : idx
      setUnread(Math.max(0, count))
    } catch {}
  }

  React.useEffect(() => { load() }, [])

  function onOpen() {
    setOpen(o => !o)
    if (!open && items.length) {
      try { localStorage.setItem(SEEN_KEY, items[0].id); setUnread(0) } catch {}
    }
  }

  return (
    <div className="relative">
      <button className="btn btn-secondary relative" onClick={onOpen} aria-label="РЈРІРµРґРѕРјР»РµРЅРёСЏ">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <LiquidGlass className="absolute right-0 mt-2 w-80 p-2 text-sm z-[80]" blur={22} tint="16 18 36" opacity={0.22} gloss={0.7} elevation={1.1} interactive={false}>
          <div className="mb-1 px-1 text-xs text-zinc-500">РЈРІРµРґРѕРјР»РµРЅРёСЏ</div>
          {!items.length ? (
            <div className="px-2 py-3 text-xs text-zinc-500">РџРѕРєР° РЅРµС‚ СѓРІРµРґРѕРјР»РµРЅРёР№</div>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id} className="rounded-lg px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <a
                    className="block"
                    href={n.url || '#'}
                    target={n.url ? '_blank' : undefined}
                    rel={n.url ? 'noreferrer' : undefined}
                  >
                    {n.title && (
                      <div className="font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{n.title}</div>
                    )}
                    <div className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">{n.text}</div>
                    {n.date && (
                      <div className="mt-1 text-[10px] text-zinc-500">{new Date(n.date).toLocaleString()}</div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
          </LiquidGlass>
        )}
      </div>
    )
  }

