export function formatRelativeDate(input?: string | null): string {
  if (!input) return "—";
  const ts = new Date(input).getTime();
  if (!Number.isFinite(ts)) return "—";
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 60) return "минуту назад";
  if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))} мин назад`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ч назад`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} дн назад`;
  return new Date(ts).toLocaleDateString();
}

export function formatDateTime(input?: string | null): string {
  if (!input) return "—";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}
