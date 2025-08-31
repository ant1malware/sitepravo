import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVersionInfo, diffText } from './versioning';

export default function DiffPage() {
  const { id } = useParams();
  const v = id ? getVersionInfo(id) : null;
  const prev = v?.changelog?.[1]?.summary || '';
  const curr = v?.changelog?.[0]?.summary || '';
  const html = diffText(prev, curr);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Сравнение версий</h1>
        <Link to="/whats-new" className="btn">Что нового</Link>
      </div>
      {!v && <div>Не найдено для {id}</div>}
      {v && (
        <div className="card">
          <div className="mb-2 text-sm">{id} • {v.version}</div>
          <pre
            className="overflow-x-auto rounded-xl bg-zinc-100 p-3 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
      <style>{`
        ins{background:rgb(var(--success) / 0.2); text-decoration:none;}
        del{background:rgb(var(--danger) / 0.2); text-decoration:line-through;}
      `}</style>
    </div>
  );
}

