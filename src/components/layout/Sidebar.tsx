import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Briefcase, Users, LayoutList, Layers, 
  HelpCircle, AlertTriangle, Calendar, Link as LinkIcon, 
  Settings, X, Database 
} from 'lucide-react';

const navItems = [
  { id: 'exec-summary', label: 'Executive Summary', icon: <FileText className="w-4 h-4" /> },
  { id: 'biz-objectives', label: 'Business Objectives', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'stakeholders', label: 'Stakeholders', icon: <Users className="w-4 h-4" /> },
  { id: 'func-reqs', label: 'Functional Reqs', icon: <LayoutList className="w-4 h-4" /> },
  { id: 'non-func-reqs', label: 'Non-Functional Reqs', icon: <Layers className="w-4 h-4" /> },
  { id: 'assumptions', label: 'Assumptions', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'risks', label: 'Risks', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
  { id: 'traceability', label: 'Traceability Matrix', icon: <LinkIcon className="w-4 h-4" /> },
];

export default function Sidebar({ isOpen, setIsOpen, brdGenerated }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-64 bg-[#0a0a10]/80 backdrop-blur-xl border-r border-white/10 flex flex-col h-full flex-shrink-0 relative z-50 text-gray-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-brand-500" />
              <span className="font-bold text-lg text-white tracking-wide">Structify</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            <div className="mb-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Document Sections
            </div>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  brdGenerated 
                    ? 'hover:bg-brand-500/10 hover:text-brand-300' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!brdGenerated) e.preventDefault();
                }}
              >
                <div className="text-gray-400 group-hover:text-brand-400 transition-colors">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-white/5">
            <a
              href="#settings"
              className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-all group"
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              <span>Settings</span>
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
