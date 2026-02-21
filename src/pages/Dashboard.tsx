import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UploadInterface from '../components/dashboard/UploadInterface';
import BRDView from '../components/dashboard/BRDView';
import AskAI from '../components/dashboard/AskAI';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [brdGenerated, setBrdGenerated] = useState(false);

  return (
    <div className="flex h-screen bg-[#030304] text-gray-100 overflow-hidden font-sans selection:bg-brand-500 selection:text-white relative">
      <div className="absolute inset-0 z-0 bg-brand-900/10 pointer-events-none mix-blend-screen opacity-50"></div>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
        brdGenerated={brdGenerated} 
      />
      
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        <Topbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Routes>
            <Route path="/" element={<UploadInterface onGenerate={() => setBrdGenerated(true)} />} />
            <Route path="/view" element={<BRDView />} />
          </Routes>
        </main>
      </div>
      
      {/* AI Chat Assistant Floating Button or Panel */}
      {brdGenerated && <AskAI />}
    </div>
  );
}
