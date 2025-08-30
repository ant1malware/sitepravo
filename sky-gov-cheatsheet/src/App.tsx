import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GovCheatsheetSky from "./GovCheatsheetSky";
import RolePage from "./RolePage";
import LawPage from "./LawPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GovCheatsheetSky />} />
        <Route path="/roles/:id" element={<RolePage />} />
        <Route path="/laws/:slug" element={<LawPage />} />
      </Routes>
    </BrowserRouter>
  );
}
