import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const GovCheatsheetSky = React.lazy(() => import('./GovCheatsheetSky'));
const WhatsNew = React.lazy(() => import('./WhatsNew'));
const DiffPage = React.lazy(() => import('./DiffPage'));
const PrintSheet = React.lazy(() => import('./PrintSheet'));
const RolePage = React.lazy(() => import('./RolePage'));
const LawPage = React.lazy(() => import('./LawPage'));
const VuPage = React.lazy(() => import('./VuPage'));
import CommandPalette from "./CommandPalette";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "./track";
import { pushRecent } from "./recent";
const SettingsPage = React.lazy(() => import('./SettingsPage'));
const FavoritesPage = React.lazy(() => import('./FavoritesPage'));
import Sidebar from "./Sidebar";
import GlobalTopbar from "./GlobalTopbar";
import NotificationsBell from "./NotificationsBell";

// Tracks page views on route change
function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    track('page_view');
    try { pushRecent(location.pathname + location.search + location.hash, document.title || undefined); } catch {}
  }, [loc.pathname, loc.search, loc.hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CommandPalette />
      <Sidebar />
      <GlobalTopbar />
      <div className="fixed right-2 top-2 z-50"><NotificationsBell /></div>
      <RouteTracker />
      <React.Suspense fallback={<div className="p-4 text-sm text-zinc-500">Загрузка…</div>}>
        <Routes>
          <Route path="/" element={<GovCheatsheetSky />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/diff/:id" element={<DiffPage />} />
          <Route path="/print" element={<PrintSheet />} />
          <Route path="/roles/:id" element={<RolePage />} />
          <Route path="/laws/:slug" element={<LawPage />} />
          <Route path="/vu/:id" element={<VuPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
