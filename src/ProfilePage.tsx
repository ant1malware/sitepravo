import React from "react";
import { useParams, Link } from "react-router-dom";
import { findAccountByUsername } from "../store/forumStore";
import { Crown } from "lucide-react";

export default function ProfilePage() {
  const { username = "" } = useParams();
  const acc = findAccountByUsername(username);

  if (!acc) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-xl font-bold">Профиль не найден</h1>
        <p className="opacity-70">Пользователь «{username}» не существует.</p>
        <Link to="/forum" className="underline">Вернуться на форум</Link>
      </main>
    );
  }

  const isAdmin = acc.role === "admin";

  return (
    <main className="mx-auto max-w-5xl p-4">
      {/* шапка профиля */}
      <div className="relative overflow-hidden rounded-2xl border p-4"
           style={{background:"var(--surface)",borderColor:"var(--border)"}}>
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-600" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {acc.username} {isAdmin && <Crown className="inline h-5 w-5 text-yellow-400" />}
            </h1>
            <div className="text-sm opacity-80">
              Пользователь №{acc.userNumber} • Роль: {acc.role}
            </div>
            <div className="text-sm opacity-70">
              Зарегистрирован: {new Date(acc.createdAt).toLocaleDateString("ru-RU")}
            </div>
          </div>
        </div>
      </div>

      {/* статистика */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat n={acc.posts} label="сообщений"/>
        <Stat n={acc.topics} label="тем"/>
        <Stat n={acc.likes} label="лайков"/>
      </div>
    </main>
  );
}

function Stat({n,label}:{n:number,label:string}) {
  return (
    <div className="rounded-2xl border p-4 text-center"
         style={{background:"var(--surface)",borderColor:"var(--border)"}}>
      <div className="text-3xl font-extrabold">{n}</div>
      <div className="opacity-70">{label}</div>
    </div>
  );
}
