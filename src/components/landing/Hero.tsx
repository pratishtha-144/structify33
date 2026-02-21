import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-4 pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-brand-500/30 text-brand-300 font-medium text-sm mb-12 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
          <span>Introducing Structify AI 2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white selection:text-white"
        >
          Turn Scattered Conversations into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-brand-400 to-purple-500 pb-2 inline-block">
            Structured BRDs
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12 font-light leading-relaxed"
        >
          Structify intelligently extracts requirements, stakeholder decisions, and timelines from emails, meetings, and chats — and generates professional Business Requirement Documents instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link to="/dashboard">
            <button className="glow-button flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-medium text-lg px-8 py-4 rounded-full shadow-lg shadow-brand-500/30 transition-all transform hover:scale-105">
              <span>Start Generating</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <a href="#demo">
            <button className="flex items-center justify-center space-x-2 glass border border-white/10 hover:border-white/20 text-white font-medium text-lg px-8 py-4 rounded-full transition-all hover:bg-white/5 disabled:opacity-50">
              <Play className="w-5 h-5 text-gray-300" />
              <span>See Demo</span>
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
