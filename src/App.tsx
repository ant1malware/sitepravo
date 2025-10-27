import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const GovCheatsheetSky = React.lazy(() => import('./GovCheatsheetSky'));
const WhatsNew = React.lazy(() => import('./WhatsNew'));
const DiffPage = React.lazy(() => import('./DiffPage'));
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
const TopicPage = React.lazy(() => import('./TopicPage2'));
const TagPage = React.lazy(() => import('./TagPage'));
const QuestionsPage = React.lazy(() => import('./QuestionsPage'));
const AdminPanel = React.lazy(() => import('./AdminPanel3'));
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
import MobileMenu from "./MobileMenu";
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

// Buddy (Chebzik) disabled for all

export default function App() {
  return (
    <div className="min-h-dvh w-full">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <CommandPalette />
        <Sidebar />
        <GlobalTopbar />
        <MobileMenu />
        <ClosureNotice />
        {/* Buddy and notifications removed by request */}
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
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/forum/feeds" element={<ForumFeedsPage />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </div>
  );
}





const ForumFeedsPage = React.lazy(() => import('./ForumFeedsPage'));