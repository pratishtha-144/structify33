import React, { useEffect, useState } from 'react';
import { Download, FileDown, Edit3, CheckCircle2, AlertTriangle, Loader2, FlaskConical } from 'lucide-react';

// Parse the plain-text BRD (with ## Section headers) into a key-value map
function parseBRDText(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = text.split(/^## /m);
  for (const part of parts) {
    const newlineIdx = part.indexOf('\n');
    if (newlineIdx === -1) continue;
    const header = part.substring(0, newlineIdx).trim();
    const body = part.substring(newlineIdx + 1).trim();
    if (header) sections[header] = body;
  }
  return sections;
}

// Convert bullet-point lines to an array of strings
function parseBullets(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

// Parse stakeholder lines: "Name | Role | Influence | Interest"
function parseStakeholders(text: string) {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-*•]\s*/, '').trim())
    .filter((l) => l.includes('|'))
    .map((l) => {
      const parts = l.split('|').map((p) => p.trim());
      return {
        name: parts[0] ?? '',
        role: parts[1] ?? '',
        influence: parts[2] ?? 'Medium',
        interest: parts[3] ?? 'Medium',
      };
    })
    .filter((s) => s.name && s.role);
}

const levelColor: Record<string, string> = {
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Low: 'bg-green-500/20 text-green-400',
};

const ConfidenceBadge = ({ score }: { score: number }) => (
  <div className="flex items-center space-x-1 bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded text-xs font-semibold border border-brand-500/30">
    <CheckCircle2 className="w-3 h-3" />
    <span>{score}% Confidence</span>
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start space-x-3">
        <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-brand-500 flex-shrink-0" />
        <span className="text-gray-400 leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

// Extract FR-XX or NFR-XX prefix from a line
function extractRequirements(text: string) {
  const lines = parseBullets(text);
  return lines.map((line, i) => {
    const match = line.match(/^((?:FR|NFR)-\d+)[:\s–-]+(.+?)(?:[:\s–-]+(.+))?$/i);
    if (match) {
      return { id: match[1].toUpperCase(), title: match[2].trim(), detail: match[3]?.trim() ?? '' };
    }
    return { id: `FR-${String(i + 1).padStart(2, '0')}`, title: line, detail: '' };
  });
}

export default function BRDView() {
  const [sections, setSections] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('brd_text');
    const mode   = sessionStorage.getItem('brd_mode');
    if (stored) {
      setSections(parseBRDText(stored));
    }
    setIsDemo(mode === 'demo');
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-400" />
        <p>Loading BRD...</p>
      </div>
    );
  }

  if (!sections || Object.keys(sections).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 text-center text-gray-400 space-y-4">
        <div className="text-5xl mb-2">📄</div>
        <h3 className="text-xl font-semibold text-white">No BRD Generated Yet</h3>
        <p className="text-sm max-w-sm text-gray-500">
          Upload your project documents and click "Generate Structured BRD" to see AI-generated output here.
        </p>
      </div>
    );
  }

  const execSummary   = sections['Executive Summary'] ?? '';
  const bizObj        = parseBullets(sections['Business Objectives'] ?? '');
  const stakeholders  = parseStakeholders(sections['Stakeholder Analysis'] ?? '');
  const funcReqs      = extractRequirements(sections['Functional Requirements'] ?? '');
  const nonFuncReqs   = parseBullets(sections['Non-Functional Requirements'] ?? '');
  const assumptions   = parseBullets(sections['Assumptions'] ?? '');
  const risks         = parseBullets(sections['Risks'] ?? '');
  const timeline      = parseBullets(sections['Timeline'] ?? '');
  const metrics       = parseBullets(sections['Success Metrics'] ?? '');

  // Derive a project name from the first sentence of the executive summary
  const projectName = execSummary.split(/[.\n]/)[0]?.substring(0, 60) ?? 'Generated BRD';

  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      {/* Action Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#0a0a10]/80 backdrop-blur-md py-4 px-6 rounded-2xl border border-white/10 mb-8 shadow-2xl flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white tracking-wide line-clamp-1">
            {projectName} <span className="text-brand-400">v1.0</span>
          </h2>
          {isDemo && (
            <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <FlaskConical className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold tracking-wide">Demo Mode</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white glass px-4 py-2 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Edit Mode</span>
          </button>
          <div className="h-6 w-px bg-white/10 mx-1" />
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

      <div className="space-y-10 relative z-10">

        {/* 1. Executive Summary */}
        {execSummary && (
          <section id="exec-summary" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">1. Executive Summary</h3>
              <ConfidenceBadge score={95} />
            </div>
            <p className="leading-relaxed text-gray-400 whitespace-pre-wrap">{execSummary}</p>
          </section>
        )}

        {/* 2. Business Objectives */}
        {bizObj.length > 0 && (
          <section id="biz-objectives" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">2. Business Objectives</h3>
              <ConfidenceBadge score={90} />
            </div>
            <BulletList items={bizObj} />
          </section>
        )}

        {/* 3. Stakeholder Analysis */}
        {stakeholders.length > 0 && (
          <section id="stakeholders" className="glass-card p-8 group overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">3. Stakeholder Analysis</h3>
              <ConfidenceBadge score={92} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Influence</th>
                    <th className="py-3 px-4 font-medium">Interest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stakeholders.map((s, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-medium text-white">{s.name}</td>
                      <td className="py-4 px-4 text-gray-400">{s.role}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${levelColor[s.influence] ?? 'bg-white/10 text-gray-300'}`}>
                          {s.influence}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${levelColor[s.interest] ?? 'bg-white/10 text-gray-300'}`}>
                          {s.interest}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 4. Functional Requirements */}
        {funcReqs.length > 0 && (
          <section id="func-reqs" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">4. Functional Requirements</h3>
              <ConfidenceBadge score={88} />
            </div>
            <div className="space-y-4">
              {funcReqs.map((req, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-500/30 transition-colors">
                  <span className="text-brand-400 font-mono text-sm block mb-2">{req.id}</span>
                  <p className="text-white font-medium mb-1">{req.title}</p>
                  {req.detail && <p className="text-sm text-gray-400 leading-relaxed">{req.detail}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Non-Functional Requirements */}
        {nonFuncReqs.length > 0 && (
          <section id="non-func-reqs" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">5. Non-Functional Requirements</h3>
              <ConfidenceBadge score={85} />
            </div>
            <BulletList items={nonFuncReqs} />
          </section>
        )}

        {/* 6. Assumptions */}
        {assumptions.length > 0 && (
          <section id="assumptions" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">6. Assumptions</h3>
            </div>
            <BulletList items={assumptions} />
          </section>
        )}

        {/* 7. Risks */}
        {risks.length > 0 && (
          <section id="risks" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">7. Risks</h3>
              <ConfidenceBadge score={82} />
            </div>
            <ul className="space-y-3">
              {risks.map((r, i) => (
                <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8. Timeline */}
        {timeline.length > 0 && (
          <section id="timeline" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">8. Timeline</h3>
            </div>
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xs text-brand-300 font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < timeline.length - 1 && <div className="w-px h-8 bg-brand-500/20 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{t}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Success Metrics */}
        {metrics.length > 0 && (
          <section id="traceability" className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">9. Success Metrics</h3>
              <ConfidenceBadge score={87} />
            </div>
            <ul className="space-y-3">
              {metrics.map((m, i) => (
                <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}
