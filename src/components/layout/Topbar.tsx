import React from 'react';
import { Menu, Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ isSidebarOpen, setSidebarOpen }: any) {
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-transparent border-b border-white/5 shrink-0 z-40 backdrop-blur-md">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 mr-4 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-purple-400">Project Alpha BRD</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-brand-400 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a10]"></span>
        </button>

        <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-brand-400 transition-colors">
          <Sun className="w-5 h-5" />
        </button>
        
        <div className="h-6 w-px bg-white/10 mx-2"></div>

        <button className="flex items-center space-x-3 p-1 rounded-full hover:bg-white/5 transition-colors pr-3 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner">
            JD
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
}
