import React from "react";
import { useNavigate } from "react-router-dom";
import {
  createSection, listSections, createTopic,
  listAccounts, setRole, listTopics
} from "../store/forumStore";
import { Shield, PlusCircle } from "lucide-react";
import { getSession } from "../utils/session";
import { findAccountById } from "../store/forumStore";

export default function AdminPanel() {
  const nav = useNavigate();
  const ses = getSession();
  const me = ses ? findAccountById(ses.userId) : null;

  React.useEffect(() => {
    if (!me || (me.role !== "admin" && me.role !== "moderator")) {
      nav("/forum"); // нет доступа
    }
  }, [me, nav]);

  const [sections, setSections] = React.useState(listSections());
  const [accounts, setAccounts] = React.useState(listAccounts());

  const [secTitle, setSecTitle] = React.useState("");
  const [secDesc, setSecDesc] = React.useState("");

  const [topicTitle, setTopicTitle] = React.useState("");
  const [topicSection, setTopicSection] = React.useState<string>(sections[0]?.id || "");

  const createSec = () => {
    if (!secTitle.trim()) return;
    createSection(secTitle.trim(), secDesc.trim());
    setSecTitle(""); setSecDesc("");
    setSections(listSections());
  };
  const createTop = () => {
    if (!topicTitle.trim() || !topicSection) return;
    if (!me) return;
    createTopic(topicSection, topicTitle.trim(), me.id);
    setTopicTitle("");
  };
  const changeRole = (id: string, role: "admin"|"moderator"|"vip"|"user"|"newbie") => {
    setRole(id, role);
    setAccounts(listAccounts());
  };

  return (
    <main className="mx-auto max-w-5xl p-4">
      <header className="mb-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-[color:var(--accent)]" />
        <h1 className="text-2xl font-bold">Admin panel</h1>
      </header>

      {/* создание раздела */}
      <section className="rounded-2xl border p-4" style={{background:"var(--surface)",borderColor:"var(--border)"}}>
        <h2 className="mb-2 text-lg font-semibold">Создать раздел</h2>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className="input" placeholder="Название" value={secTitle} onChange={e=>setSecTitle(e.target.value)} />
          <input className="input" placeholder="Описание" value={secDesc} onChange={e=>setSecDesc(e.target.value)} />
          <button className="btn btn-primary flex items-center gap-2"
                  onClick={createSec}><PlusCircle className="h-4 w-4"/>Добавить</button>
        </div>
      </section>

      {/* создание темы */}
      <section className="mt-4 rounded-2xl border p-4" style={{background:"var(--surface)",borderColor:"var(--border)"}}>
        <h2 className="mb-2 text-lg font-semibold">Создать тему</h2>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input className="input" placeholder="Заголовок темы" value={topicTitle} onChange={e=>setTopicTitle(e.target.value)} />
          <select className="input" value={topicSection} onChange={e=>setTopicSection(e.target.value)}>
            {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <button className="btn btn-primary" onClick={createTop}>Создать</button>
        </div>
      </section>

      {/* роли */}
      <section className="mt-4 rounded-2xl border p-4" style={{background:"var(--surface)",borderColor:"var(--border)"}}>
        <h2 className="mb-2 text-lg font-semibold">Роли и доступ</h2>
        <div className="grid gap-2">
          {accounts.map(a=>(
            <div key={a.id} className="flex items-center justify-between rounded-xl border p-2"
                 style={{borderColor:"var(--border)"}}>
              <div className="text-sm"><b>{a.username}</b> • #{a.userNumber}</div>
              <div className="flex items-center gap-2">
                <select className="input" value={a.role} onChange={e=>changeRole(a.id, e.target.value as any)}>
                  <option value="admin">admin</option>
                  <option value="moderator">moderator</option>
                  <option value="vip">vip</option>
                  <option value="user">user</option>
                  <option value="newbie">newbie</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
