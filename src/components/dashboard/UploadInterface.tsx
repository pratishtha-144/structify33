import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateBRD } from '../../gemini';
import { UploadCloud, Mail, FileUp, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface UploadedFile {
  name: string;
  size: string;
  status: 'uploading' | 'complete';
  rawFile: File;
}

const UploadBox = ({
  title,
  icon,
  accept,
  files,
  setFiles,
}: {
  title: string;
  icon: React.ReactNode;
  accept: string;
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = Array.from(incoming).map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      status: 'uploading',
      rawFile: f,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          newFiles.find((nf) => nf.name === f.name) ? { ...f, status: 'complete' } : f
        )
      );
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <div className="flex flex-col space-y-4 w-full relative">
      <div
        className={`glass-card p-8 border-2 border-dashed transition-all duration-300 rounded-3xl flex flex-col items-center justify-center min-h-[220px] text-center
          ${isDragging ? 'border-brand-500 bg-brand-500/10 scale-105 shadow-2xl shadow-brand-500/20' : 'border-white/20 hover:border-brand-400 hover:bg-white/5'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-300 shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400 mb-4 max-w-[200px]">Drag & drop or click to choose files</p>
        <div className="text-xs font-mono text-gray-500 bg-[#0a0a10]/50 px-3 py-1 rounded-md border border-white/5">
          Supported: {accept}
        </div>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 glass border border-white/10 rounded-xl"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {file.status === 'uploading' ? (
                    <Loader2 className="w-5 h-5 text-brand-400 animate-spin flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-white truncate max-w-[150px]">{file.name}</span>
                    <span className="text-xs text-gray-500">{file.size}</span>
                  </div>
                </div>
                {file.status === 'uploading' ? (
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, ease: 'linear' }}
                    />
                  </div>
                ) : (
                  <button onClick={() => removeFile(file.name)} className="text-gray-500 hover:text-red-400 p-1 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const STATUS_STEPS = [
  'Extracting key entities & stakeholders...',
  'Mapping functional requirements...',
  'Synthesizing success metrics & risks...',
  'Finalizing and structuring BRD...',
];

export default function UploadInterface({ onGenerate }: { onGenerate: () => void }) {
  const navigate = useNavigate();
  const [transcripts, setTranscripts] = useState<UploadedFile[]>([]);
  const [emails, setEmails] = useState<UploadedFile[]>([]);
  const [docs, setDocs] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const totalFiles = transcripts.length + emails.length + docs.length;

  const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string ?? '');
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsText(file);
    });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setStatusIdx(0);

    // Animate through status messages while Gemini processes
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev < STATUS_STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);

    try {
      // Read all uploaded file contents as plain text
      const allFileObjects = [
        ...transcripts.map((f) => ({ label: 'Meeting Transcript', file: f.rawFile })),
        ...emails.map((f) => ({ label: 'Email', file: f.rawFile })),
        ...docs.map((f) => ({ label: 'Project Document', file: f.rawFile })),
      ];

      const contentParts = await Promise.all(
        allFileObjects.map(async ({ label, file }) => {
          const text = await readFileAsText(file);
          return `--- [${label}: ${file.name}] ---\n${text}`;
        })
      );

      const combinedText = contentParts.join('\n\n');
      console.log('[Structify] Combined content length:', combinedText.length, 'chars');

      // generateBRD returns plain text — store it directly
      const brdText = await generateBRD(combinedText);
      sessionStorage.setItem('brd_text', brdText);

      clearInterval(interval);
      onGenerate();
      navigate('/dashboard/view');
    } catch (err) {
      clearInterval(interval);
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[Structify] BRD generation failed:', err);
      setError(msg);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Data Ingestion Engine</h2>
        <p className="text-gray-400">Upload unstructured project data from various sources to begin intelligent BRD generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <UploadBox
          title="Meeting Transcripts"
          icon={<UploadCloud className="w-8 h-8" />}
          accept=".txt, .pdf"
          files={transcripts}
          setFiles={setTranscripts}
        />
        <UploadBox
          title="Project Emails"
          icon={<Mail className="w-8 h-8" />}
          accept=".txt, .eml"
          files={emails}
          setFiles={setEmails}
        />
        <UploadBox
          title="Existing Docs"
          icon={<FileUp className="w-8 h-8" />}
          accept=".pdf, .docx"
          files={docs}
          setFiles={setDocs}
        />
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-start space-x-3">
          <span className="text-red-400 font-bold">⚠ Error:</span>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-4 bg-white/[0.02] border border-white/5 p-12 rounded-3xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-600/20 blur-[100px] pointer-events-none rounded-full"></div>

        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              key="generate-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 flex flex-col items-center"
            >
              <button
                onClick={handleGenerate}
                disabled={totalFiles === 0}
                className={`glow-button group relative flex items-center justify-center space-x-3 bg-gradient-to-r from-brand-600 to-purple-600 outline-none text-white font-semibold text-lg px-12 py-5 rounded-2xl transition-all shadow-xl
                  ${totalFiles === 0 ? 'opacity-50 cursor-not-allowed grayscale from-gray-700 to-gray-800' : 'hover:scale-105 shadow-brand-500/30'}
                `}
              >
                <Sparkles className="w-6 h-6 text-brand-200 group-hover:text-white transition-colors animate-pulse" />
                <span>Generate Structured BRD</span>
                {totalFiles > 0 && (
                  <span className="absolute -top-3 -right-3 w-7 h-7 bg-brand-500 rounded-full text-sm flex items-center justify-center border-2 border-[#0a0a10] animate-bounce shadow-lg">
                    {totalFiles}
                  </span>
                )}
              </button>
              {totalFiles === 0 && (
                <p className="mt-4 text-sm text-gray-500 font-medium tracking-wide">
                  Upload at least 1 file to begin AI analysis
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl z-10 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-6 border border-brand-500/30 relative">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin relative z-10" />
                <div className="absolute inset-0 bg-brand-500/30 blur-xl animate-pulse rounded-full"></div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white">Analyzing Requirements...</h3>
              <p className="text-brand-300 text-sm mb-8 font-medium bg-brand-500/10 px-4 py-1.5 rounded-full border border-brand-500/20">
                {STATUS_STEPS[statusIdx]}
              </p>

              {/* Indeterminate shimmer bar (no fake % since timing is unknown) */}
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <div className="h-full w-full bg-gradient-to-r from-brand-500 via-purple-500 to-brand-400 rounded-full relative animate-[pulse_2s_ease-in-out_infinite]">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 font-mono">Processing {totalFiles} file{totalFiles > 1 ? 's' : ''} — This may take 10–30 seconds</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
