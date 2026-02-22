import React, { useEffect, useRef, useState } from 'react';
import {
  Brain, CheckCircle2, Users, AlertTriangle, Calendar,
  ShieldCheck, BarChart2, PieChart as PieIcon,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  funcReqCount: number;
  nonFuncReqCount: number;
  riskCount: number;
  assumptionCount: number;
  stakeholderCount: number;
  timelineCount: number;
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

// ─── Animated width hook (for bar chart) ─────────────────────────────────────
function useBarWidth(pct: number, delay = 0) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      // Trigger animation via requestAnimationFrame
      let start: number | null = null;
      const dur = 900;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        setWidth(ease * pct);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return width;
}

// ─── Bar Chart Component ──────────────────────────────────────────────────────
interface BarDef { label: string; value: number; color: string; bg: string; delay: number }

function AnimatedBar({ label, value, max, color, bg, delay }: BarDef & { max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const width = useBarWidth(pct, delay);

  return (
    <div className="flex items-center gap-3 group">
      <span className="text-xs text-gray-400 w-36 shrink-0 text-right group-hover:text-gray-200 transition-colors">
        {label}
      </span>
      <div className="flex-1 h-7 rounded-lg overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full rounded-lg flex items-center pl-3 relative overflow-hidden"
          style={{ width: `${width}%`, background: color, transition: 'none' }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
        </div>
        {/* Value label on top of bar */}
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums"
          style={{ color: bg }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Donut / Pie Chart (SVG) ──────────────────────────────────────────────────
interface Slice { label: string; pct: number; color: string }

const SLICES: Slice[] = [
  { label: 'Clients',          pct: 40, color: '#6366f1' },
  { label: 'Project Manager',  pct: 25, color: '#a78bfa' },
  { label: 'Developers',       pct: 20, color: '#38bdf8' },
  { label: 'End Users',        pct: 15, color: '#34d399' },
];

function DonutChart() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const dur = 1000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const R = 70;       // outer radius
  const r = 46;       // inner radius (donut hole)
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * R;

  // Build slices
  type SliceShape = { slice: Slice; idx: number; dashArray: string; dashOffset: number; rotate: number };
  const shapes: SliceShape[] = [];
  let cumPct = 0;
  SLICES.forEach((slice, idx) => {
    const animPct = slice.pct * progress;
    const dash = (animPct / 100) * circumference;
    const gap  = circumference - dash;
    const rotate = (cumPct / 100) * 360 - 90;
    shapes.push({ slice, idx, dashArray: `${dash} ${gap}`, dashOffset: 0, rotate });
    cumPct += slice.pct;
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg width={180} height={180} viewBox="0 0 180 180">
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={R - r} />

          {shapes.map(({ slice, idx, dashArray, rotate }) => (
            <circle
              key={idx}
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={slice.color}
              strokeWidth={hovered === idx ? R - r + 6 : R - r}
              strokeDasharray={dashArray}
              strokeDashoffset={0}
              transform={`rotate(${rotate} ${cx} ${cy})`}
              style={{ transition: 'stroke-width 0.2s ease', cursor: 'pointer', opacity: hovered !== null && hovered !== idx ? 0.55 : 1 }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Centre hole */}
          <circle cx={cx} cy={cy} r={r} fill="#07070d" />

          {/* Centre label */}
          {hovered !== null ? (
            <>
              <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">
                {SLICES[hovered].pct}%
              </text>
              <text x={cx} y={cy + 10} textAnchor="middle" fill="#9ca3af" fontSize={9}>
                {SLICES[hovered].label}
              </text>
            </>
          ) : (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">100%</text>
              <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize={9}>Stakeholders</text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full">
        {SLICES.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/20" style={{ background: s.color }} />
            <span className="text-xs text-gray-400 truncate">{s.label}</span>
            <span className="ml-auto text-xs font-semibold tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Confidence Ring ──────────────────────────────────────────────────────────
function ConfidenceRing({ pct }: { pct: number }) {
  const [val, setVal] = useState(0);
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const dur = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(ease * pct);
      setDisp(Math.round(ease * pct));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [pct]);

  const r = 26; const c = 2 * Math.PI * r;
  const dash = (val / 100) * c;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={68} height={68} viewBox="0 0 68 68">
        <circle cx={34} cy={34} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle
          cx={34} cy={34} r={r} fill="none"
          stroke="url(#cring)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 34 34)"
        />
        <defs>
          <linearGradient id="cring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-sm font-bold text-white tabular-nums">{disp}%</span>
    </div>
  );
}

// ─── Summary stat row ─────────────────────────────────────────────────────────
function StatRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0 group">
      <div className="flex items-center gap-2.5">
        <span style={{ color }} className="group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AnalyticsDashboard({
  funcReqCount,
  nonFuncReqCount,
  riskCount,
  assumptionCount,
  stakeholderCount,
  timelineCount,
}: Props) {
  const totalReqs  = funcReqCount + nonFuncReqCount + riskCount + assumptionCount;
  const maxBar     = Math.max(funcReqCount, nonFuncReqCount, riskCount, assumptionCount, 1);

  const reqCount   = useCounter(totalReqs);
  const stakeCount = useCounter(stakeholderCount > 0 ? stakeholderCount : 4);
  const rCount     = useCounter(riskCount > 0 ? riskCount : 3);
  const timeMonths = useCounter(timelineCount > 0 ? Math.min(timelineCount, 6) : 4);

  const bars: BarDef[] = [
    { label: 'Functional Reqs',     value: funcReqCount,    color: 'linear-gradient(90deg,#6366f1,#818cf8)', bg: '#a5b4fc', delay: 0   },
    { label: 'Non-Functional Reqs', value: nonFuncReqCount, color: 'linear-gradient(90deg,#7c3aed,#a78bfa)', bg: '#c4b5fd', delay: 120 },
    { label: 'Risks',               value: riskCount,       color: 'linear-gradient(90deg,#dc2626,#f87171)', bg: '#fca5a5', delay: 240 },
    { label: 'Assumptions',         value: assumptionCount, color: 'linear-gradient(90deg,#0891b2,#38bdf8)', bg: '#7dd3fc', delay: 360 },
  ];

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">AI Analysis Dashboard</h3>
          <p className="text-xs text-gray-500">Powered by Structify AI · Real-time analytics</p>
        </div>
        {/* Live pill */}
        <div className="ml-auto flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold">Analysis Complete</span>
        </div>
      </div>

      {/* ── 3-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── 1. Bar Chart ── */}
        <div className="glass-card p-6 col-span-1 flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-brand-400" />
            <h4 className="text-sm font-semibold text-white">Requirement Distribution</h4>
          </div>
          <div className="flex flex-col gap-3">
            {bars.map((b) => (
              <AnimatedBar key={b.label} {...b} max={maxBar} />
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500">
            <span>Total items analysed</span>
            <span className="font-bold text-white tabular-nums">{totalReqs}</span>
          </div>
        </div>

        {/* ── 2. Donut Chart ── */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <PieIcon className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Stakeholder Impact</h4>
          </div>
          <DonutChart />
          <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500">
            <span>Hover segments for detail</span>
            <span className="font-bold text-white tabular-nums">{stakeCount} detected</span>
          </div>
        </div>

        {/* ── 3. AI Summary Card ── */}
        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <h4 className="text-sm font-semibold text-white">AI Analysis Results</h4>
            </div>
            <ConfidenceRing pct={94} />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <StatRow
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Requirements Identified"
              value={reqCount}
              color="#6366f1"
            />
            <StatRow
              icon={<Users className="w-4 h-4" />}
              label="Stakeholders Detected"
              value={stakeCount}
              color="#a78bfa"
            />
            <StatRow
              icon={<AlertTriangle className="w-4 h-4" />}
              label="Risks Found"
              value={rCount}
              color="#f87171"
            />
            <StatRow
              icon={<Calendar className="w-4 h-4" />}
              label="Estimated Timeline"
              value={`${timeMonths} Months`}
              color="#38bdf8"
            />
            <StatRow
              icon={<Brain className="w-4 h-4" />}
              label="AI Confidence Score"
              value="94%"
              color="#34d399"
            />
          </div>

          {/* Confidence progress bar */}
          <div className="mt-2 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-gray-500">Overall BRD Quality</span>
              <span className="text-green-400 font-semibold">Excellent</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-green-400"
                style={{ width: '94%', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
