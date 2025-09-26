import React from "react";
import { useParams } from "react-router-dom";
import { findAccountByUsername, updateAccount } from "./store/forumStore";
import { Camera, Pencil, Link as LinkIcon, Globe, BadgeCheck } from "lucide-react";

export default function ProfilePage(){
  const { username="" } = useParams();
  const [user,setUser]=React.useState(()=>findAccountByUsername(username));

  React.useEffect(()=>{ setUser(findAccountByUsername(username)||null); },[username]);
  if(!user) return <main className="mx-auto max-w-5xl p-4"><div className="card p-6"><b>Профиль не найден.</b></div></main>;

  return (
    <main className="mx-auto max-w-5xl p-4">
      <div className="card overflow-hidden">
        <div style={{
          height:160,
          background: user.profile.bannerData
            ? `url(${user.profile.bannerData}) center/cover`
            : `linear-gradient(120deg, ${user.profile.accentFrom||"#22d3ee"}, ${user.profile.accentTo||"#8b5cf6"})`
        }}/>
        <div className="flex items-end gap-4 p-4">
          <div className="h-24 w-24 -mt-16 rounded-full ring-2 ring-[color:var(--bg-1)]"
               style={{background:user.profile.avatarData?`url(${user.profile.avatarData}) center/cover`:`linear-gradient(135deg, ${user.profile.accentFrom||"#22d3ee"}, ${user.profile.accentTo||"#8b5cf6"})`}}/>
          <div className="flex-1">
            <div className="text-2xl font-extrabold">{user.username}</div>
            <div className="opacity-70 text-sm">#{user.userNumber} • роль: {user.role}</div>
          </div>
          <EditButton userId={user.id} onSaved={()=>setUser(findAccountByUsername(username)||null)}/>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat n={user.posts} label="сообщений"/>
        <Stat n={user.topics} label="тем"/>
        <Stat n={user.likes} label="лайков"/>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1.2fr_.8fr]">
        <Row title="О себе"><p style={{whiteSpace:"pre-wrap"}}>{user.profile.bio||"—"}</p></Row>
        <Row title="Ссылки">
          <div className="grid gap-2 text-sm">
            {user.profile.links?.website && <a className="underline flex items-center gap-2" href={user.profile.links.website} target="_blank"><Globe size={14}/> {user.profile.links.website}</a>}
            {user.profile.links?.discord && <div className="flex items-center gap-2"><LinkIcon size={14}/> Discord: {user.profile.links.discord}</div>}
            {user.profile.links?.telegram && <div className="flex items-center gap-2"><LinkIcon size={14}/> Telegram: {user.profile.links.telegram}</div>}
            {!user.profile.links?.website && !user.profile.links?.discord && !user.profile.links?.telegram && <div>—</div>}
          </div>
        </Row>
      </div>

      <div className="mt-4 card p-4">
        <div className="mb-2 text-sm opacity-70">Подпись</div>
        <div style={{whiteSpace:"pre-wrap"}}>{user.profile.signature||"—"}</div>
      </div>
    </main>
  );
}

function Row({title,children}:{title:string;children:React.ReactNode}){
  return <div className="card p-4"><div className="mb-2 text-sm opacity-70">{title}</div>{children}</div>;
}
function Stat({n,label}:{n:number;label:string}){return <div className="card p-4 text-center"><div className="text-3xl font-extrabold">{n}</div><div className="opacity-70">{label}</div></div>}

function EditButton({userId,onSaved}:{userId:string;onSaved:()=>void}){
  const [open,setOpen]=React.useState(false);
  return <>
    <button className="btn" onClick={()=>setOpen(true)}><Pencil size={16}/>Customize</button>
    {open && <CustomizeModal userId={userId} onClose={()=>setOpen(false)} onSaved={onSaved}/>}
  </>;
}

function CustomizeModal({userId,onClose,onSaved}:{userId:string;onClose:()=>void;onSaved:()=>void}){
  const current = findAccountByUsername(findAccountByUsername as any) // заглушка TS
  const user = (()=>{ const u = (window as any).__acc || null; return u; })();
  // проще: прочитаем заново через DOM нельзя — используем апдейт напрямую:
  const u = findAccountByUsername((document.location.pathname.split("/").pop()||"").toString())!;
  const [avatar,setAvatar]=React.useState<string|undefined>(u.profile.avatarData);
  const [banner,setBanner]=React.useState<string|undefined>(u.profile.bannerData);
  const [bio,setBio]=React.useState(u.profile.bio||"");
  const [signature,setSignature]=React.useState(u.profile.signature||"");
  const [website,setWebsite]=React.useState(u.profile.links?.website||"");
  const [discord,setDiscord]=React.useState(u.profile.links?.discord||"");
  const [telegram,setTelegram]=React.useState(u.profile.links?.telegram||"");
  const [from,setFrom]=React.useState(u.profile.accentFrom||"#22d3ee");
  const [to,setTo]=React.useState(u.profile.accentTo||"#8b5cf6");
  const [badges,setBadges]=React.useState<string[]>(u.profile.badges||[]);

  const pick=(cb:(s:string)=>void)=>(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>cb(String(r.result)); r.readAsDataURL(f);
  };
  const save=()=>{
    updateAccount(userId, { profile:{
      avatarData:avatar, bannerData:banner, bio, signature,
      links:{ website, discord, telegram }, accentFrom:from, accentTo:to, badges
    }} as any);
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4">
      <div className="card w-[min(760px,96vw)] p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Customize profile</div>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="card p-3">
            <div className="text-sm opacity-70 mb-2">Аватар</div>
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded-full" style={{background: avatar?`url(${avatar}) center/cover`:`linear-gradient(135deg, ${from}, ${to})`}}/>
              <label className="btn"><Camera size={16}/> <input type="file" accept="image/*" hidden onChange={pick(setAvatar)}/>Загрузить</label>
            </div>
          </div>

          <div className="card p-3">
            <div className="text-sm opacity-70 mb-2">Баннер</div>
            <div className="h-20 w-full rounded-lg" style={{background: banner?`url(${banner}) center/cover`:`linear-gradient(120deg, ${from}, ${to})`}}/>
            <div className="mt-2"><label className="btn"><Camera size={16}/> <input type="file" accept="image/*" hidden onChange={pick(setBanner)}/>Загрузить</label></div>
          </div>

          <div className="card p-3">
            <div className="text-sm opacity-70 mb-2">Акцент-цвета</div>
            <div className="flex items-center gap-3">
              <input type="color" value={from} onChange={e=>setFrom(e.target.value)}/>
              <input type="color" value={to} onChange={e=>setTo(e.target.value)}/>
            </div>
          </div>

          <div className="card p-3">
            <div className="text-sm opacity-70 mb-2">Бейджи (до 3)</div>
            <div className="flex flex-wrap gap-2">
              {["Founder","Early","Contributor","VIP","Designer"].map(b=>{
                const active=badges.includes(b);
                return <button key={b} className="btn" onClick={()=>setBadges(active?badges.filter(x=>x!==b):(badges.length<3?[...badges,b]:badges))}>
                  <BadgeCheck size={16}/> {active?"✓ ":""}{b}
                </button>;
              })}
            </div>
          </div>

          <div className="card p-3 sm:col-span-2">
            <div className="text-sm opacity-70 mb-2">О себе</div>
            <textarea className="input" style={{minHeight:90}} value={bio} onChange={e=>setBio(e.target.value)} placeholder="bio…"/>
          </div>

          <div className="card p-3 sm:col-span-2">
            <div className="text-sm opacity-70 mb-2">Подпись</div>
            <textarea className="input" style={{minHeight:70}} value={signature} onChange={e=>setSignature(e.target.value)} placeholder="signature…"/>
          </div>

          <div className="card p-3 sm:col-span-2">
            <div className="text-sm opacity-70 mb-2">Ссылки</div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input className="input" placeholder="https://site" value={website} onChange={e=>setWebsite(e.target.value)}/>
              <input className="input" placeholder="discord username" value={discord} onChange={e=>setDiscord(e.target.value)}/>
              <input className="input" placeholder="@telegram" value={telegram} onChange={e=>setTelegram(e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" onClick={save}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
