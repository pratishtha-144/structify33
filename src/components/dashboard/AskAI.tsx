import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Zap, RefreshCw, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  injected?: boolean;   // true when a BRD section was modified
}

// ─── Demo Intelligence Engine ─────────────────────────────────────────────────
interface Rule {
  keywords: string[];
  response: string;
  inject?: { section: string; text: string };
}

const RULES: Rule[] = [
  {
    keywords: ['stakeholder', 'stakeholders', 'who is involved', 'team'],
    response:
      '📋 **Stakeholder Analysis**\n\nKey stakeholders identified in this BRD:\n• **Project Manager** — High Influence, High Interest\n• **Development Team** — High Influence, Medium Interest\n• **Business Clients** — Medium Influence, High Interest\n• **End Users** — Low Influence, High Interest\n\nWould you like me to add more stakeholder roles?',
  },
  {
    keywords: ['scalability', 'scale', 'concurrent', 'add scalability', 'performance load'],
    response:
      '⚡ **Scalability Requirement Added**\n\nI\'ve injected the following into Non-Functional Requirements:\n\n_"The system must support high scalability and handle a minimum of 10,000 concurrent users with sub-200ms response times under peak load."_\n\nThis aligns with industry-standard SLAs for enterprise platforms.',
    inject: {
      section: 'Non-Functional Requirements',
      text: 'The system must support high scalability and handle a minimum of 10,000 concurrent users with sub-200ms response times under peak load.',
    },
  },
  {
    keywords: ['login', 'authentication', 'auth', 'add login', 'sign in', 'secure login'],
    response:
      '🔐 **Functional Requirement Added**\n\nI\'ve injected into Functional Requirements:\n\n_"Users must be able to securely log in using email and password with support for OAuth 2.0 (Google, GitHub) and two-factor authentication (2FA)."_\n\nSecurity best practices applied.',
    inject: {
      section: 'Functional Requirements',
      text: 'FR-AUTH: Users must be able to securely log in using email and password with support for OAuth 2.0 (Google, GitHub) and two-factor authentication (2FA).',
    },
  },
  {
    keywords: ['objective', 'objectives', 'goal', 'goals', 'business objective'],
    response:
      '🎯 **Business Objectives Summary**\n\nThe primary business objectives identified in this BRD are:\n\n• Improve operational efficiency and reduce manual processes by 40%\n• Deliver a scalable platform that supports business growth\n• Reduce time-to-market for new features by 30%\n• Achieve 99.9% system uptime SLA\n\nWould you like me to quantify any of these objectives further?',
  },
  {
    keywords: ['timeline', 'schedule', 'deadline', 'phases', 'milestones', 'delivery'],
    response:
      '📅 **Project Timeline Estimate**\n\nBased on the scope of this BRD, here is the recommended timeline:\n\n• **Phase 1 – Discovery & Design**: 2–3 weeks\n• **Phase 2 – Core Development**: 6–8 weeks\n• **Phase 3 – Integration & Testing**: 3–4 weeks\n• **Phase 4 – UAT & Go-Live**: 2 weeks\n\n**Total estimated duration: 3–4 months**\n\nWould you like me to add sprint breakdowns?',
  },
  {
    keywords: ['risk', 'risks', 'mitigation', 'issue', 'issues', 'concern'],
    response:
      '⚠️ **Risk Assessment**\n\nTop risks identified based on the BRD content:\n\n• **Technical complexity** — Mitigate with modular architecture\n• **Scope creep** — Mitigate with strict change control process\n• **Third-party dependency failures** — Mitigate with fallback integrations\n• **Data security breach** — Mitigate with encryption and audits\n\nRisk probability matrix available on request.',
  },
  {
    keywords: ['assumption', 'assumptions', 'constraint', 'constraints'],
    response:
      '📌 **Assumptions & Constraints**\n\nKey assumptions documented:\n\n• The client will provide timely feedback within 48 hours of each review cycle.\n• All third-party APIs used are stable and documented.\n• The development team has at least 2 senior engineers available full-time.\n• Infrastructure will be cloud-based (AWS or GCP).\n\nWould you like me to add more constraints?',
  },
  {
    keywords: ['functional requirement', 'feature', 'functionality', 'add feature'],
    response:
      '✅ **Functional Requirements Analysis**\n\nThis BRD contains well-defined functional requirements. Here are some AI-suggested additions:\n\n• **FR-DASH**: Users must have access to a real-time analytics dashboard.\n• **FR-NOTIF**: The system must send email/SMS notifications for key events.\n• **FR-EXPORT**: Users must be able to export reports in PDF and CSV formats.\n• **FR-AUDIT**: The system must log all user actions for audit purposes.\n\nWould you like me to inject any of these?',
  },
  {
    keywords: ['summary', 'executive summary', 'overview', 'describe the brd', 'what is this'],
    response:
      '📄 **BRD Executive Summary**\n\nThis Business Requirements Document outlines the scope, objectives, and technical requirements for the proposed system. It defines:\n\n• **8 structured sections** covering all aspects of the project\n• **Stakeholder roles** and their influence/interest matrix\n• **Functional & Non-Functional** requirements with priority levels\n• **Timeline estimates** and risk mitigation strategies\n\nConfidence Score: **94%** — Ready for stakeholder review.',
  },
  {
    keywords: ['improve', 'enhance', 'suggestion', 'suggest', 'recommend', 'optimize'],
    response:
      '💡 **AI Improvement Suggestions**\n\nAfter analyzing this BRD, I recommend the following enhancements:\n\n1. Add quantitative KPIs to each Business Objective\n2. Define acceptance criteria for each Functional Requirement\n3. Include a RACI matrix in the Stakeholder section\n4. Add a Data Flow Diagram reference\n5. Define rollback procedures in the Risk section\n\nType "add [feature]" to inject any of these automatically.',
  },
];

function getDemoResponse(input: string): { text: string; inject?: { section: string; text: string } } {
  const lower = input.toLowerCase().trim();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return { text: rule.response, inject: rule.inject };
    }
  }
  return {
    text: '🤖 **Structify AI Analysis**\n\nI\'ve analyzed your BRD content and I\'m ready to help you:\n\n• **Ask about stakeholders** — "Who are the stakeholders?"\n• **Add requirements** — "Add scalability" or "Add login"\n• **Review objectives** — "What are the business objectives?"\n• **Check timeline** — "What is the timeline?"\n• **Get suggestions** — "How can I improve this BRD?"\n\nWhat would you like to refine?',
  };
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end space-x-2">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shrink-0">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-400"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === 'user';

  // Convert **bold** markers to styled spans
  const renderText = (text: string) =>
    text.split('\n').map((line, li) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={li} className={li > 0 ? 'mt-1' : ''}>
          {parts.map((part, pi) =>
            pi % 2 === 1 ? (
              <strong key={pi} className="text-white font-semibold">
                {part}
              </strong>
            ) : (
              <span key={pi}>{part}</span>
            )
          )}
        </p>
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shrink-0 mb-1">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}

      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-brand-600 to-purple-600 text-white rounded-tr-sm shadow-lg shadow-brand-500/20'
            : `bg-white/[0.06] border border-white/10 text-gray-300 rounded-tl-sm ${
                msg.injected ? 'border-green-500/30 bg-green-500/5' : ''
              }`
        }`}
      >
        {isUser ? (
          <p>{msg.text}</p>
        ) : (
          <div className="space-y-0.5">{renderText(msg.text)}</div>
        )}
        {msg.injected && (
          <div className="mt-2 flex items-center space-x-1 text-green-400 text-xs font-medium">
            <Zap className="w-3 h-3" />
            <span>BRD Updated</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Suggestion Chips ─────────────────────────────────────────────────────────
const CHIPS = [
  'Who are the stakeholders?',
  'Add scalability',
  'Add login feature',
  'What is the timeline?',
  'Improve the BRD',
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: 'ai',
      text: '👋 Hi! I\'m **Structify AI**, your BRD analysis assistant.\n\nI can help you:\n• Analyze and improve requirements\n• Add new functional/non-functional requirements\n• Review stakeholders, risks, and timelines\n\nTry asking me something or use a suggestion below!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdRef = useRef(1); // stable incrementing ID, avoids Date.now() in render

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Show scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Inject text into sessionStorage BRD and fire event
  const injectIntoBRD = (section: string, text: string) => {
    const stored = sessionStorage.getItem('brd_text') ?? '';
    const sectionHeader = `## ${section}`;
    if (stored.includes(sectionHeader)) {
      // Append after the section header
      const updated = stored.replace(
        new RegExp(`(## ${section}[^\\n]*\\n)`),
        `$1- ${text}\n`
      );
      sessionStorage.setItem('brd_text', updated);
    } else {
      // Append as a new section
      sessionStorage.setItem('brd_text', stored + `\n\n${sectionHeader}\n- ${text}`);
    }
    // Fire custom event so BRDView can re-render
    window.dispatchEvent(new CustomEvent('brd_updated'));
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userId = ++msgIdRef.current;
    const userMsg: Message = { id: userId, sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const { text: responseText, inject } = getDemoResponse(trimmed);

    // Simulate AI thinking time (800–1800ms depending on response length)
    const delay = 800 + Math.min(responseText.length * 2, 1000);

    setTimeout(() => {
      if (inject) injectIntoBRD(inject.section, inject.text);

      const aiId = ++msgIdRef.current;
      const aiMsg: Message = {
        id: aiId,
        sender: 'ai',
        text: responseText,
        injected: !!inject,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Chat cleared! How can I help you with your BRD?',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-[#07070d] border-l border-white/[0.07]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0 bg-[#0a0a14]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {/* Online pulse */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0a0a14]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm tracking-wide">Structify AI</h3>
            <p className="text-[10px] text-green-400 font-medium">● BRD Analysis Engine • Live</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-28 right-6 w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shadow-lg z-10"
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Suggestion Chips ── */}
      <div className="px-4 pb-2 shrink-0 overflow-x-auto">
        <div className="flex space-x-2 pb-1" style={{ minWidth: 'max-content' }}>
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              disabled={isTyping}
              className="text-[11px] font-medium text-brand-300 border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/15 hover:border-brand-500/60 px-3 py-1.5 rounded-full transition-all whitespace-nowrap disabled:opacity-40"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/[0.06]">
        <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-brand-500/50 focus-within:bg-white/[0.06] transition-all shadow-inner">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your BRD…"
            disabled={isTyping}
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-600 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shrink-0 hover:opacity-90 disabled:opacity-30 transition-all shadow-md shadow-brand-500/30 active:scale-95"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-600 mt-1.5 text-center">
          Demo mode · Powered by Structify AI Engine
        </p>
      </div>
    </div>
  );
}
