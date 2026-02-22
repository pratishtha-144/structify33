import { Download, FileDown, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BRDViewProps {
  content: string;
}

export default function BRDView({ content }: BRDViewProps) {
  const navigate = useNavigate();

  // Split the raw AI text into paragraphs for clean rendering
  const paragraphs = content
    ? content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      {/* Action Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#0a0a10]/80 backdrop-blur-md py-4 px-6 rounded-2xl border border-white/10 mb-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Generated BRD <span className="text-brand-400">v1.0</span>
        </h2>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white glass px-4 py-2 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>New BRD</span>
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

      {/* BRD Content */}
      {!content ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <p className="text-gray-400 text-lg">No BRD generated yet.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl text-white font-medium transition-colors"
          >
            Go to Upload
          </button>
        </div>
      ) : (
        <div className="glass-card p-8 space-y-6 relative z-10">
          {paragraphs.map((para, idx) => {
            // Detect markdown heading patterns like "## Section" or "**Section**"
            const headingMatch = para.match(/^#{1,3}\s+(.+)$/);
            const boldLineMatch = para.match(/^\*\*(.+)\*\*$/);

            if (headingMatch) {
              return (
                <h3
                  key={idx}
                  className="text-xl font-bold text-white mt-8 first:mt-0 border-b border-white/10 pb-3"
                >
                  {headingMatch[1]}
                </h3>
              );
            }

            if (boldLineMatch) {
              return (
                <h4 key={idx} className="text-lg font-semibold text-brand-300">
                  {boldLineMatch[1]}
                </h4>
              );
            }

            // Bullet list block
            if (para.includes('\n') && para.split('\n').every((l) => l.match(/^[-*•]\s/))) {
              return (
                <ul key={idx} className="space-y-2 pl-2">
                  {para.split('\n').map((line, lIdx) => (
                    <li key={lIdx} className="flex items-start text-gray-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-500 mr-3 flex-shrink-0"></span>
                      <span>{line.replace(/^[-*•]\s/, '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            // Inline bullet line
            if (para.match(/^[-*•]\s/)) {
              return (
                <div key={idx} className="flex items-start text-gray-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-500 mr-3 flex-shrink-0"></span>
                  <span>{para.replace(/^[-*•]\s/, '')}</span>
                </div>
              );
            }

            // Regular paragraph
            return (
              <p key={idx} className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                {para}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
