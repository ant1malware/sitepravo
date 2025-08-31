import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVersionInfo, diffText } from './versioning';
import Card from './ui/Card';
import Button from './ui/Button';

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
        <Button to="/whats-new">Что нового</Button>
      </div>
      {!v && <div>Не найдено для {id}</div>}
      {v && (
        <Card>
          <div className="mb-2 text-sm">{id} • {v.version}</div>
          <pre
            className="overflow-x-auto rounded-xl bg-zinc-100 p-3 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Card>
      )}
      <style>{`
        ins{background:#DCFCE7; text-decoration:none;}
        del{background:#FEE2E2; text-decoration:line-through;}
        @media (prefers-color-scheme: dark){
          ins{background:rgba(34,197,94,0.25);} /* emerald-500 @ 25% */
          del{background:rgba(239,68,68,0.25);} /* red-500 @ 25% */
        }
      `}</style>
    </div>
  );
}

