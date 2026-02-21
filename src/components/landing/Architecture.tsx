import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Brain, FileOutput, ArrowRight } from 'lucide-react';

const steps = [
  { id: 1, name: "Data Input", icon: <Database /> },
  { id: 2, name: "Preprocessing", icon: <Cpu /> },
  { id: 3, name: "NLP Classify", icon: <Brain /> },
  { id: 4, name: "BRD Generate", icon: <FileOutput /> },
];

export default function Architecture() {
  return (
    <section id="how-it-works" className="py-24 relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-600/10 blur-[150px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-white text-center">
          System <span className="text-brand-400">Architecture</span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-4 space-y-8 lg:space-y-0 relative max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative group z-10 w-full lg:w-48"
              >
                <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="glass-card flex flex-col items-center justify-center p-6 border border-white/10 group-hover:border-brand-400/50 transition-colors shadow-2xl relative z-20">
                  <div className="w-16 h-16 rounded-full bg-brand-900/40 text-brand-300 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white whitespace-nowrap">{step.name}</h3>
                </div>
              </motion.div>
              
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  whileInView={{ opacity: 1, width: 'auto' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 + 0.1 }}
                  className="hidden lg:flex items-center text-gray-500"
                >
                  <ArrowRight className="w-8 h-8 animate-pulse text-brand-500" />
                </motion.div>
              )}

              {/* Mobile Arrows */}
              {idx < steps.length - 1 && (
                <div className="lg:hidden text-brand-500 animate-pulse my-4">
                  <ArrowRight className="w-8 h-8 rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
