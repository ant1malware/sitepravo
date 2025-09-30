import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const GovCheatsheetSky = React.lazy(() => import('./GovCheatsheetSky'));
const WhatsNew = React.lazy(() => import('./WhatsNew'));
const DiffPage = React.lazy(() => import('./DiffPage'));
const LiquidGlassShowcase = React.lazy(() => import('./LiquidGlassShowcase'));
const PrintSheet = React.lazy(() => import('./PrintSheet'));
const RolePage = React.lazy(() => import('./RolePage'));
const LawPage = React.lazy(() => import('./LawPage'));
const VuPage = React.lazy(() => import('./VuPage'));
// Beta playground removed
const HomePage = React.lazy(() => import('./HomePage'));
const ForumPage = React.lazy(() => import('./ForumPage'));
// Dev seed removed
const ProfilePage = React.lazy(() => import('./ProfilePage'));
const MembersPage = React.lazy(() => import('./ForumMembers'));
const SectionPage = React.lazy(() => import('./SectionPage'));
const TopicPage = React.lazy(() => import('./TopicPage'));
const TagPage = React.lazy(() => import('./TagPage'));
const QuestionsPage = React.lazy(() => import('./QuestionsPage'));
const AdminPanel = React.lazy(() => import('./AdminPanel3'));
const BuddyPlayground = React.lazy(() => import('./BuddyPlayground'));
const ForumFeedsPage = React.lazy(() => import('./ForumFeedsPage'));
import RecorderPage from './RecorderPage';
import AboutPage from './AboutPage';
import CommandPalette from "./CommandPalette";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "./track";
import { getSessionAccount as getSessionRemote } from './store/authRemote';
import { recordLastActive } from './utils/lastActive';
import { pushRecent } from "./recent";
const SettingsPage = React.lazy(() => import('./SettingsPage'));
const FavoritesPage = React.lazy(() => import('./FavoritesPage'));
import Sidebar from "./Sidebar";
import GlobalTopbar from "./GlobalTopbar";
import NotificationsBell from "./NotificationsBell";
import MobileMenu from "./MobileMenu";
import { useStyleMode } from './useStyleMode';
import Buddy from './components/Buddy';
import { getBuddyEnabled } from './uiSettings';
import ClosureNotice from './components/ClosureNotice';

// Tracks page views on route change
function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    track('page_view');
    try { pushRecent(location.pathname + location.search + location.hash, document.title || undefined); } catch {}
    // Touch last-active for the current session user
    (async () => {
      try { const me = await getSessionRemote(); if (me) recordLastActive(me.id); } catch {}
    })();
  }, [loc.pathname, loc.search, loc.hash]);
  return null;
}

// Renders Buddy on all routes except the playground
function BuddyGate() {
  const loc = useLocation();
  if ((loc.pathname || '').startsWith('/buddy')) return null;
  try { if (!getBuddyEnabled()) return null; } catch {}
  return <Buddy />;
}

export default function App() {
  const [styleMode] = useStyleMode();
  return (
  <div className={(styleMode === 'liquid') ? "min-h-dvh w-full" : "min-h-dvh w-full"}>
    {(styleMode === 'liquid') && (
      // background layers only for Liquid/Beta
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(800px 540px at 8% 0%, rgba(90,110,180,.10), transparent 60%),'
              + 'radial-gradient(900px 560px at 85% 10%, rgba(160,110,200,.08), transparent 65%),'
              + 'linear-gradient(180deg, rgba(0,0,0,.60), rgba(0,0,0,.88))'
        }} />
        <div className="absolute inset-0" style={{
          opacity: 0.015,
          backgroundSize: '32px 32px',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.7) 1px, transparent 1px)'
        }} />
      </div>
    )}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CommandPalette />
      <Sidebar />
      <GlobalTopbar />
      <MobileMenu />
      <ClosureNotice />
      <BuddyGate />
      {/* Offset notifications button below topbar on small screens; keep under full-screen overlays */}
      <div className="fixed right-2 top-14 z-[60] sm:top-2"><NotificationsBell /></div>
      <RouteTracker />
      <React.Suspense fallback={<div className="p-4 text-sm text-zinc-300">Р—Р°РіСЂСѓР·РєР°вЂ¦</div>}>
        <Routes>
          <Route path="/" element={<GovCheatsheetSky />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/forum/*" element={<ForumPage />} />
          <Route path="/forum/section/:id" element={<SectionPage />} />
          <Route path="/forum/topic/:id" element={<TopicPage />} />
          <Route path="/forum/questions" element={<QuestionsPage />} />
          <Route path="/forum/members" element={<MembersPage />} />
          <Route path="/forum/profile/:username" element={<ProfilePage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/forum/tag/:tag" element={<TagPage />} />
          <Route path="/forum/admin" element={<AdminPanel />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/diff/:id" element={<DiffPage />} />
          <Route path="/print" element={<PrintSheet />} />
          <Route path="/roles/:id" element={<RolePage />} />
          <Route path="/laws/:slug" element={<LawPage />} />
          <Route path="/vu/:id" element={<VuPage />} />
          <Route path="/recorders/:id" element={<RecorderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/style/liquid" element={<LiquidGlassShowcase />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/buddy" element={<BuddyPlayground />} />
          <Route path="/forum/feeds" element={<ForumFeedsPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </div>
);
}






