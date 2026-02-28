'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Shield, Gauge, TrendingUp } from 'lucide-react'

// ─── Static mock data ─────────────────────────────────────────────────────────

const stats = [
    {
        id: 'time-saved',
        label: 'Time Saved',
        description: 'Hours Muka protected for you',
        value: '142',
        unit: 'hrs',
        change: '+12%',
        positive: true,
        icon: Brain,
        accent: '#FF3366',       // cyber-red
        accentCls: 'text-cyber-red',
        bgGlow: 'bg-cyber-red',
        sparkPath: 'M0,80 C20,70 35,40 50,55 S75,20 100,10 V100 H0Z',
    },
    {
        id: 'blocked',
        label: 'Blocked',
        description: 'Distractions stopped cold',
        value: '8,401',
        unit: 'msgs',
        change: '+4%',
        positive: true,
        icon: Shield,
        accent: '#00FF66',       // neon-green
        accentCls: 'text-neon-green',
        bgGlow: 'bg-neon-green',
        sparkPath: 'M0,85 C15,75 30,60 50,50 S80,30 100,15 V100 H0Z',
    },
    {
        id: 'focus',
        label: 'Focus Score',
        description: 'Your consistency today',
        value: '86',
        unit: '%',
        change: '+22%',
        positive: true,
        icon: Gauge,
        accent: '#FFCC00',       // electric-amber
        accentCls: 'text-electric-amber',
        bgGlow: 'bg-electric-amber',
        sparkPath: 'M0,90 C20,80 40,65 55,60 S80,35 100,20 V100 H0Z',
    },
]

const timeRanges = ['24H', '7D', 'ALL'] as const
type TimeRange = (typeof timeRanges)[number]

const noiseSources = [
    { label: 'WhatsApp', pct: 81, color: '#FF3366' },
    { label: 'Outlook', pct: 54, color: '#FF3366' },
    { label: 'Canvas', pct: 33, color: '#FF3366' },
]

// Fixed heatmap intensities so they don't re-roll on every render
const heatmap = Array.from({ length: 48 }, (_, i) => {
    const seed = (i * 7 + 13) % 10
    if (seed >= 8) return 'hot'
    if (seed >= 5) return 'warm'
    if (seed >= 3) return 'cool'
    return 'cold'
})

const heatCell: Record<string, string> = {
    hot: 'bg-cyber-red shadow-[0_0_6px_#FF3366]',
    warm: 'bg-cyber-red/35',
    cool: 'bg-zinc-800',
    cold: 'bg-zinc-900/50',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TelemetryPage() {
    const [activeRange, setActiveRange] = useState<TimeRange>('24H')

    return (
        <div className="p-6 lg:p-10 space-y-8 min-h-full">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse shadow-[0_0_8px_#FF3366]" />
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-white uppercase leading-none">
                        Telemetry
                    </h1>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-0.5">
                        Your attention, at a glance
                    </p>
                </div>
            </motion.div>

            {/* ── Stat Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                        className="glass-card rounded-[28px] border-subpixel relative overflow-hidden group cursor-default p-6 hover:border-white/15 transition-all duration-500"
                    >
                        {/* Hover glow */}
                        <div
                            className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${s.bgGlow}`}
                        />

                        {/* Icon row */}
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] ${s.accentCls}`}>
                                <s.icon className="w-4 h-4" />
                            </div>
                            <span
                                className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase ${s.positive
                                        ? 'text-emerald-400 bg-emerald-500/10'
                                        : 'text-red-400 bg-red-500/10'
                                    }`}
                            >
                                {s.change}
                            </span>
                        </div>

                        {/* Number */}
                        <div className="relative z-10 mb-1">
                            <span className="text-[2.6rem] font-mono font-black text-white leading-none">
                                {s.value}
                            </span>
                            <span className={`text-xs font-bold ml-1.5 ${s.accentCls} uppercase tracking-widest`}>
                                {s.unit}
                            </span>
                        </div>

                        {/* Label */}
                        <p className="relative z-10 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                            {s.label}
                        </p>
                        <p className="relative z-10 text-[10px] text-zinc-700 tracking-wide mt-0.5">
                            {s.description}
                        </p>

                        {/* Sparkline area */}
                        <div className="absolute inset-x-0 bottom-0 h-14 opacity-25 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id={`sg-${s.id}`} x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor={s.accent} stopOpacity="0.5" />
                                        <stop offset="100%" stopColor={s.accent} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 2, delay: 0.3 + i * 0.2, ease: 'easeInOut' }}
                                    d={s.sparkPath}
                                    fill={`url(#sg-${s.id})`}
                                    stroke={s.accent}
                                    strokeWidth="1.5"
                                    strokeOpacity="0.6"
                                />
                            </svg>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Chart + Noise Breakdown ─────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="lg:col-span-2 glass-card rounded-[36px] border-subpixel p-7 relative overflow-hidden"
                >
                    {/* Chart top bar */}
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div>
                            <h2 className="text-sm font-extrabold text-white uppercase tracking-tight leading-none">
                                Focus vs. Noise
                            </h2>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                                Last {activeRange}
                            </p>
                        </div>

                        {/* Range pills */}
                        <div className="flex gap-1.5">
                            {timeRanges.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveRange(t)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${activeRange === t
                                            ? 'bg-cyber-red/15 border-cyber-red/40 text-cyber-red'
                                            : 'border-white/5 text-zinc-500 hover:text-white hover:bg-white/[0.03]'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inline legend — clean and compact */}
                    <div className="flex items-center gap-5 mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-px bg-neon-green shadow-[0_0_4px_#00FF66]" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Focus</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-px bg-cyber-red shadow-[0_0_4px_#FF3366]" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Noise</span>
                        </div>
                    </div>

                    {/* SVG chart */}
                    <div className="relative h-52 rounded-2xl overflow-hidden bg-white/[0.01]">
                        {/* Dot grid */}
                        <div
                            className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                        {/* Bottom fade */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent z-10 pointer-events-none" />

                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gFill" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#00FF66" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="#00FF66" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="rFill" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#FF3366" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#FF3366" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Green fill */}
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.4 }}
                                d="M0,310 C200,270 400,210 600,195 S850,170 1000,150 V400 H0Z"
                                fill="url(#gFill)"
                            />
                            {/* Red fill */}
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.6 }}
                                d="M0,370 C150,345 350,330 550,310 S800,300 1000,290 V400 H0Z"
                                fill="url(#rFill)"
                            />

                            {/* Noise line (pink) */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2.5, ease: 'easeInOut' }}
                                d="M0,370 C150,345 350,330 550,310 S800,300 1000,290"
                                fill="none"
                                stroke="#FF3366"
                                strokeWidth="2"
                                strokeOpacity="0.65"
                                className="drop-shadow-[0_0_8px_#FF3366]"
                            />
                            {/* Focus line (green) */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 3, ease: 'easeInOut', delay: 0.3 }}
                                d="M0,310 C200,270 400,210 600,195 S850,170 1000,150"
                                fill="none"
                                stroke="#00FF66"
                                strokeWidth="2.5"
                                className="drop-shadow-[0_0_12px_#00FF66]"
                            />
                        </svg>

                        {/* "Your shield is winning" badge — bottom-right corner, unobtrusive */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3 }}
                            className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neon-green/10 border border-neon-green/20"
                        >
                            <TrendingUp className="w-3 h-3 text-neon-green" />
                            <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">Shield winning</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Noise breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="glass-card rounded-[36px] border-subpixel p-7 flex flex-col gap-6 relative overflow-hidden"
                >
                    <div>
                        <h2 className="text-sm font-extrabold text-white uppercase tracking-tight leading-none">
                            Noise Sources
                        </h2>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                            Where distractions came from
                        </p>
                    </div>

                    {/* Heatmap grid — smaller, tighter */}
                    <div className="grid grid-cols-8 gap-1">
                        {heatmap.map((level, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.007, ease: 'backOut' }}
                                className={`rounded-sm aspect-square cursor-default hover:scale-125 transition-transform duration-150 ${heatCell[level]}`}
                            />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Noisy</span>
                        <div className="h-1 flex-1 mx-3 bg-gradient-to-r from-cyber-red via-cyber-red/30 to-zinc-900 rounded-full" />
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Quiet</span>
                    </div>

                    {/* Top sources */}
                    <div className="space-y-3">
                        {noiseSources.map((s, i) => (
                            <div key={s.label}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{s.label}</span>
                                    <span className="text-xs font-mono font-black text-zinc-500">{s.pct}%</span>
                                </div>
                                <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.pct}%` }}
                                        transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(to right, ${s.color}, ${s.color}55)` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

        </div>
    )
}
