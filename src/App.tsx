import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GovCheatsheetSky from "./GovCheatsheetSky";
import WhatsNew from "./WhatsNew";
import DiffPage from "./DiffPage";
import PrintSheet from "./PrintSheet";
import RolePage from "./RolePage";
import LawPage from "./LawPage";
import VuPage from "./VuPage";
import CommandPalette from "./CommandPalette";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "./track";
import SettingsPage from "./SettingsPage";
import FavoritesPage from "./FavoritesPage";
import Playground from "./ui/Playground";

// Tracks page views on route change
function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    track('page_view');
  }, [loc.pathname, loc.search, loc.hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CommandPalette />
      <RouteTracker />
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
        <Route path="/ui" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  );
}
