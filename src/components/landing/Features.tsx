import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BrainCircuit, FileText, Users, Target, Link as LinkIcon, Edit3 } from 'lucide-react';

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
    title: "Automatic Extraction",
    description: "Extract essential requirements, priorities, and decisions automatically from unstructured notes."
  },
  {
    icon: <FileText className="w-8 h-8 text-purple-400" />,
    title: "Structured BRD Gen",
    description: "Generate comprehensive, structured Business Requirement Documents in seconds, not weeks."
  },
  {
    icon: <Users className="w-8 h-8 text-green-400" />,
    title: "Stakeholder ID",
    description: "Automatically identify key stakeholders, their roles, influence, and interest levels."
  },
  {
    icon: <Target className="w-8 h-8 text-red-400" />,
    title: "Success Metrics",
    description: "Detect and structure success metrics and KPIs for tracking project objectives."
  },
  {
    icon: <LinkIcon className="w-8 h-8 text-yellow-400" />,
    title: "Source Traceability",
    description: "Maintain a complete traceability matrix linked directly back to the original source text."
  },
  {
    icon: <Edit3 className="w-8 h-8 text-pink-400" />,
    title: "Natural Language Edit",
    description: "Refine and iterate on your BRDs using intuitive, conversational AI commands."
  }
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-brand-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Everything You Need to Build <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-purple-400">Better BRDs</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Unleash the power of AI to transform messy conversations into structured, professional requirement documents that align your entire team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="group relative glass-card p-8 rounded-3xl transition-all duration-300 hover:bg-white/[0.08]"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a27] border border-white/5 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 ease-out">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
