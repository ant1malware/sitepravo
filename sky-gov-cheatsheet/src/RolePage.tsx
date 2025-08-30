import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Gavel, ExternalLink } from 'lucide-react';
import { rolesData } from './roles';

const Card: React.FC<{ title: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, children, footer }) => (
  <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-semibold leading-tight">{title}</h3>
    </div>
    <div className="prose prose-zinc max-w-none text-sm leading-relaxed">{children}</div>
    {footer && <div className="mt-3 border-t pt-3 text-xs text-zinc-500">{footer}</div>}
  </div>
);

const Source = ({ href, label }: { href: string; label?: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-dotted hover:no-underline">
    {label || href} <ExternalLink className="h-3.5 w-3.5" />
  </a>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium">{children}</span>
);

export default function RolePage() {
  const { id } = useParams();
  const role = rolesData.find(r => r.id === id);

  if (!role) {
    return (
      <div className="p-4">
        Роль не найдена.{' '}
        <Link to="/" className="text-blue-600 underline">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Link>
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            <h1 className="text-lg font-bold leading-tight">{role.role}</h1>
            <Badge>{role.salary}</Badge>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Card title="Обязанности" footer={<div>Источник: <Source href={role.source} /></div>}>
          <ul className="ml-4 list-disc">
            {role.duties.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
}
