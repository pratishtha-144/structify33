import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UploadInterface from '../components/dashboard/UploadInterface';
import BRDView from '../components/dashboard/BRDView';
import AskAI from '../components/dashboard/AskAI';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [brdGenerated, setBrdGenerated] = useState(false);
  const location = useLocation();

  // Show right-side AI panel only on the BRD view route
  const isBRDView = location.pathname.endsWith('/view');

  return (
    <div className="flex h-screen bg-[#030304] text-gray-100 overflow-hidden font-sans selection:bg-brand-500 selection:text-white relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 bg-brand-900/10 pointer-events-none mix-blend-screen opacity-50" />

      {/* Left sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        brdGenerated={brdGenerated}
      />

      {/* Main content column */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
        <Topbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area with optional AI panel */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* BRD / Upload area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-w-0">
            <Routes>
              <Route
                path="/"
                element={<UploadInterface onGenerate={() => setBrdGenerated(true)} />}
              />
              <Route path="/view" element={<BRDView />} />
            </Routes>
          </main>

          {/* Right-side AI Chat panel — visible on BRD view */}
          {isBRDView && (
            <div className="w-[340px] xl:w-[380px] shrink-0 flex flex-col relative z-20 overflow-hidden">
              <AskAI />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
