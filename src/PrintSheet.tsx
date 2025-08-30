import React, { useEffect, useMemo } from 'react';
import { rolesData } from './roles';
import { useSearchParams, Link } from 'react-router-dom';

export default function PrintSheet() {
  const [params] = useSearchParams();
  const roleId = params.get('role') || '';
  const role = useMemo(() => rolesData.find((r:any)=>r.id===roleId), [roleId]);

  useEffect(() => {
    document.title = 'Памятка на смену';
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6 print:p-0">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-xl font-bold">Памятка на смену</h1>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={()=>window.print()}>Печать / PDF</button>
          <Link to="/" className="btn">Назад</Link>
        </div>
      </div>

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        {role ? (
          <>
            <h2>{role.role} <small>• {role.salary}</small></h2>
            <h3>Обязанности</h3>
            <ul>
              {role.duties.map((d:string,i:number)=>(<li key={i}>{d}</li>))}
            </ul>
            {Array.isArray((role as any).promotion) && (
              <>
                <h3>Чек-лист (повышение)</h3>
                <ol>
                  {((role as any).promotion as string[]).map((p,i)=>(<li key={i}>{p}</li>))}
                </ol>
              </>
            )}
          </>
        ) : (
          <p>Роль не выбрана. Передайте ?role=ID в адресной строке.</p>
        )}
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

