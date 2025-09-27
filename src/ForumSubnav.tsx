import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, PanelsTopLeft, ShoppingBag, ChevronDown } from "lucide-react";
import { listSections } from "./store/forumRemote";

export default function ForumSubnav() {
  const loc = useLocation();
  const [workshopId, setWorkshopId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sections = await listSections();
        const ws = (sections || []).find((s: any) => String(s.title || "").toLowerCase() === "workshop");
        if (alive) setWorkshopId(ws?.id || null);
      } catch {
        if (alive) setWorkshopId(null);
      }
    })();
    return () => { alive = false; };
  }, []);

  const isMembers = loc.pathname.includes("/forum/members");
  const isWorkshop = workshopId ? loc.pathname.startsWith(`/forum/section/${workshopId}`) : false;
  const isForums = !isMembers && !isWorkshop; // default to Forums when others inactive

  const Btn = ({ to, active, icon, children, disabled }: { to: string; active?: boolean; icon: React.ReactNode; children: React.ReactNode; disabled?: boolean; }) => (
    disabled ? (
      <span
        className={`btn inline-flex items-center gap-2 ${active ? "btn-primary" : ""}`}
        title="Workshop section is not created yet"
        aria-disabled
      >
        {icon} {children}
      </span>
    ) : (
      <Link
        to={to}
        className={`btn inline-flex items-center gap-2 ${active ? "btn-primary" : ""}`}
      >
        {icon} {children}
      </Link>
    )
  );

  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onDoc = () => setMenuOpen(false);
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button className={`btn inline-flex items-center gap-2 ${isForums ? 'btn-primary' : ''}`} onClick={() => setMenuOpen(v => !v)}>
          <PanelsTopLeft size={16} /> Forums <ChevronDown size={14} />
        </button>
        {menuOpen && (
          <div className="absolute left-0 z-20 mt-1 w-56 rounded-xl border border-white/10 bg-[color:var(--surface)] p-1 shadow-lg">
            <Link className="block rounded-lg px-3 py-2 hover:bg-white/5" to="/forum" onClick={() => setMenuOpen(false)}>Главная</Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-white/5" to="/forum/questions" onClick={() => setMenuOpen(false)}>Вопросы</Link>
          </div>
        )}
      </div>
      <Btn to="/forum/members" active={isMembers} icon={<Users size={16} />}>Members</Btn>
      <Btn
        to={workshopId ? `/forum/section/${workshopId}` : "/forum"}
        active={isWorkshop}
        icon={<ShoppingBag size={16} />}
        disabled={!workshopId}
      >
        Workshop
      </Btn>
    </div>
  );
}
