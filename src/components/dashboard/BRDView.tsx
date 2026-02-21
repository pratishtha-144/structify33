import React from 'react';
import { Download, FileDown, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';

const confidenceBadge = (score: number) => (
  <div className="flex items-center space-x-1 bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded text-xs font-semibold border border-brand-500/30">
    <CheckCircle2 className="w-3 h-3" />
    <span>{score}% Confidence</span>
  </div>
);

const SourceLink = ({ text }: { text: string }) => (
  <span className="inline-flex items-center text-[10px] text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded ml-2 cursor-pointer hover:bg-brand-400/20 transition-colors">
    [Source: {text}]
  </span>
);

export default function BRDView() {
  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      {/* Action Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#0a0a10]/80 backdrop-blur-md py-4 px-6 rounded-2xl border border-white/10 mb-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white tracking-wide">Project Alpha <span className="text-brand-400">v1.2</span></h2>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white glass px-4 py-2 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Edit Mode</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          
          <button className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 px-4 py-2 rounded-lg transition-colors">
            <FileDown className="w-4 h-4" />
            <span>DOCX</span>
          </button>
          <button className="flex items-center space-x-2 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-brand-500/20">
            <Download className="w-4 h-4" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      <div className="space-y-12 text-gray-300 relative z-10">
        
        {/* Exec Summary */}
        <section id="exec-summary" className="glass-card p-8 group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">1. Executive Summary</h3>
            {confidenceBadge(94)}
          </div>
          <p className="leading-relaxed text-gray-400">
            Project Alpha aims to overhaul the current monolithic application architecture into a scalable, microservices-based system. This transformation will reduce system downtime by 40%, improve deployment frequency, and enable independent scaling of critical business domains. The initial phase targets the user authentication and payment processing modules.
            <SourceLink text="Kickoff_April_24.txt" />
          </p>
        </section>

        {/* Business Objectives */}
        <section id="biz-objectives" className="glass-card p-8 group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">2. Business Objectives</h3>
            {confidenceBadge(88)}
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-500 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Reduce Deployment Time:</strong> Decrease average deployment time from 4 hours to under 30 minutes.
                <SourceLink text="CTO_Email.eml" />
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-500 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Improve System Reliability:</strong> Achieve 99.99% uptime for core services.
              </div>
            </li>
          </ul>
        </section>

        {/* Stakeholders */}
        <section id="stakeholders" className="glass-card p-8 group overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">3. Stakeholders</h3>
            {confidenceBadge(98)}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-4 px-4 font-medium">Name</th>
                  <th className="py-4 px-4 font-medium">Role</th>
                  <th className="py-4 px-4 font-medium">Influence</th>
                  <th className="py-4 px-4 font-medium">Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">Sarah Jenkins</td>
                  <td className="py-4 px-4">Chief Technology Officer</td>
                  <td className="py-4 px-4"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">High</span></td>
                  <td className="py-4 px-4"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">High</span></td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">David Chen</td>
                  <td className="py-4 px-4">Lead Architect</td>
                  <td className="py-4 px-4"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">High</span></td>
                  <td className="py-4 px-4"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Medium</span></td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">Emily Ross</td>
                  <td className="py-4 px-4">Product Manager</td>
                  <td className="py-4 px-4"><span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Medium</span></td>
                  <td className="py-4 px-4"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">High</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Functional Requirements */}
        <section id="func-reqs" className="glass-card p-8 group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">4. Functional Requirements</h3>
            {confidenceBadge(91)}
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-brand-400 font-mono text-sm">FR-01</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-semibold">Contains Unclear Ambiguity</span>
              </div>
              <p className="text-white font-medium mb-2">User Authentication Service Migration</p>
              <p className="text-sm text-gray-400">The system shall authenticate users via OAuth 2.0 and support existing basic auth tokens during the transitional phase. <SourceLink text="Req_Doc_v2.docx" /></p>
              <div className="mt-3 text-xs text-yellow-200/70 flex items-center bg-yellow-500/10 p-2 rounded">
                <AlertTriangle className="w-3 h-3 mr-2" />
                AI Note: Duration of "transitional phase" is not specified in source documents.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-brand-400 font-mono text-sm">FR-02</span>
              </div>
              <p className="text-white font-medium mb-2">Payment Gateway Integration</p>
              <p className="text-sm text-gray-400">The new payment microservice must integrate with Stripe API v3 and ensure idempotency for all transaction requests. <SourceLink text="Stripe_Meeting_Notes.txt" /></p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
