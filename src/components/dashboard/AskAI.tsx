import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

const messagesList = [
  { id: 1, sender: 'bot', text: 'Hi! I am your Structify AI Assistant. How can I help you refine or understand this BRD?' },
];

export default function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(messagesList);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputValue }]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: Date.now(), sender: 'bot', text: "I've analyzed the Business Objectives and suggested additions based on best practices. Would you like me to update the BRD directly?" }
      ]);
    }, 1500);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen 
              ? 'bg-white/10 text-white rotate-90 border border-white/20' 
              : 'bg-gradient-to-tr from-brand-600 to-purple-600 hover:scale-110 text-white shadow-brand-500/50'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 group-hover:animate-pulse" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-32 right-8 w-[400px] h-[500px] glass-card border-brand-500/20 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a10]/50 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Ask Structify AI</h3>
                  <p className="text-xs text-brand-300 font-medium tracking-wide">BRD Analysis Engine</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-brand-400" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-sm' 
                      : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm'
                    }
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-[#0a0a10]/50 border-t border-white/10 shrink-0">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full p-1 pl-4 hover:border-brand-500/50 transition-colors focus-within:border-brand-500/50">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about this BRD..."
                  className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 placeholder-gray-500 py-2"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
