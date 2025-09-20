import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Bell, Search, CircleUserRound, Menu } from 'lucide-react';

export default function GlobalTopbar() {
  const location = useLocation();
  const hideTopbar = location.pathname.startsWith('/forum');

  if (hideTopbar) return null;

  return (
    <header className="global-topbar-shell fixed top-0 z-[70] w-full border-b border-[rgba(139,92,246,0.25)] bg-[rgba(12,13,18,0.9)]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(32,18,66,0.55)]">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-5">
          <button
            className="btn btn-secondary sm:hidden"
            onClick={() => (window as any).openMobileMenu?.()}
            aria-label="Меню"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-lg font-semibold uppercase tracking-[0.4em] text-[var(--text-2)]">
            <Sparkles className="h-6 w-6 text-[var(--accent)]" />
            <span>SKY</span>
          </div>
          <nav className="hidden items-center gap-1 text-sm font-medium text-[var(--text-2)] sm:flex">
            {[
              { to: '/forum', label: 'FORUMS' },
              { to: '/workshop', label: 'WORKSHOP' },
              { to: '/store', label: 'STORE' },
              { to: '/support', label: 'SUPPORT' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-[0.9rem] px-4 py-2 transition-all duration-[180ms] hover:bg-[rgba(139,92,246,0.18)] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-[rgba(139,92,246,0.28)] bg-[rgba(19,20,30,0.85)] p-2 text-[var(--text-2)] transition-colors duration-[180ms] hover:border-[rgba(139,92,246,0.6)] hover:text-white"
            aria-label="Сообщения"
          >
            <Mail className="h-4 w-4" />
          </button>
          <button
            className="relative rounded-full border border-[rgba(139,92,246,0.28)] bg-[rgba(19,20,30,0.85)] p-2 text-[var(--text-2)] transition-colors duration-[180ms] hover:border-[rgba(139,92,246,0.6)] hover:text-white"
            aria-label="Уведомления"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>
          <button
            className="hidden rounded-full border border-[rgba(139,92,246,0.28)] bg-[rgba(19,20,30,0.85)] p-2 text-[var(--text-2)] transition-colors duration-[180ms] hover:border-[rgba(139,92,246,0.6)] hover:text-white sm:inline-flex"
            aria-label="Поиск"
          >
            <Search className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.45)] bg-[rgba(31,21,49,0.9)] px-3 py-1.5 text-sm font-semibold text-white transition-all duration-[180ms] hover:border-[rgba(139,92,246,0.75)] hover:shadow-[0_0_22px_rgba(139,92,246,0.36)]">
            <CircleUserRound className="h-5 w-5 text-[var(--accent)]" />
            <span className="hidden sm:inline">Вы</span>
          </button>
        </div>
      </div>
    </header>
  );
}
