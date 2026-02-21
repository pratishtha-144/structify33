import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center space-x-2">
        <Database className="w-8 h-8 text-brand-400" />
        <span className="text-2xl font-bold tracking-tight text-white">Structify</span>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Login
        </Link>
        <Link to="/login">
          <button className="hidden md:block glow-button bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium px-5 py-2 rounded-full transition-all">
            Get Started
          </button>
        </Link>
      </div>
    </motion.nav>
  );
}
