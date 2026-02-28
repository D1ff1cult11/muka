'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Shield, Gauge, TrendingUp, Loader2 } from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TelemetryStats {
    timeSavedHrs: number
    blockedCount: number
    focusScore: number
    total: number
    instantCount: number
    noiseMsgs: number
    chartDays: { label: string; focus: number; noise: number }[]
    noiseSources: { label: string; pct: number }[]
    heatmap: ('hot' | 'warm' | 'cool' | 'cold')[]
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const timeRanges = ['24H', '7D', 'ALL'] as const
type TimeRange = (typeof timeRanges)[number]

const heatCell: Record<string, string> = {
    hot: 'bg-cyber-red shadow-[0_0_6px_#FF3366]',
    warm: 'bg-cyber-red/35',
    cool: 'bg-zinc-800',
    cold: 'bg-zinc-900/50',
}

const SOURCE_COLORS: Record<string, string> = {
    gmail: '#FF3366',
    google_classroom: '#FFCC00',
    classroom: '#FFCC00',
    manual: '#00FF66',
    whatsapp: '#25D366',
}

function getSourceColor(source: string): string {
    const key = source.toLowerCase().replace(/[\s-]/g, '_')
    return SOURCE_COLORS[key] ?? '#FF3366'
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TelemetryPage() {
    const [activeRange, setActiveRange] = useState<TimeRange>('7D')
    const [stats, setStats] = useState<TelemetryStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/telemetry/stats')
                if (!res.ok) throw new Error(`Server error ${res.status}`)
                const data: TelemetryStats = await res.json()
                setStats(data)
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load telemetry')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    // ── Derived sparkline paths from real chart data ────────────────────────
    // Map 7 days of focus/noise counts into SVG path coordinates
    const buildSparkPath = (values: number[], inverted = false): string => {
        if (!values.length) return 'M0,80 L100,80 V100 H0Z'
        const max = Math.max(...values, 1)
        const pts = values.map((v, i) => {
            const x = (i / (values.length - 1)) * 100
            const y = inverted
                ? 10 + ((v / max) * 70)
                : 80 - (v / max) * 70
            return `${x},${y}`
        })
        return `M${pts.join(' L')} V100 H0Z`
    }

    const chartDays = stats?.chartDays ?? []
    const focusValues = chartDays.map(d => d.focus)
    const noiseValues = chartDays.map(d => d.noise)

    // ── Focus vs Noise SVG curves from real data ────────────────────────────
    const buildLinePath = (values: number[]): string => {
        if (!values.length) return 'M0,200 L1000,200'
        const max = Math.max(...values, 1)

        // Map values to x,y coordinates
        const points = values.map((v, i) => {
            const x = (i / (values.length - 1)) * 1000
            const y = 350 - (v / max) * 300
            return { x, y }
        })

        // Generate a smooth curve using cubic beziers
        let d = `M${points[0].x},${points[0].y}`
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(0, i - 1)]
            const p1 = points[i]
            const p2 = points[i + 1]
            const p3 = points[Math.min(points.length - 1, i + 2)]

            // Catmull-Rom to Cubic Bezier conversion parameters 
            const cp1x = p1.x + (p2.x - p0.x) / 6
            const cp1y = p1.y + (p2.y - p0.y) / 6
            const cp2x = p2.x - (p3.x - p1.x) / 6
            const cp2y = p2.y - (p3.y - p1.y) / 6

            d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
        }
        return d
    }

    const focusSvgPath = buildLinePath(focusValues)
    const noiseSvgPath = buildLinePath(noiseValues)

    // ── Stat cards derived from live data ──────────────────────────────────
    const statCards = stats
        ? [
            {
                id: 'time-saved',
                label: 'Time Saved',
                description: 'Hours Muka protected for you',
                value: stats.timeSavedHrs.toFixed(1),
                unit: 'hrs',
                change: stats.timeSavedHrs > 0 ? `+${stats.timeSavedHrs.toFixed(0)}h` : '0h',
                positive: true,
                icon: Brain,
                accent: '#FF3366',
                accentCls: 'text-cyber-red',
                bgGlow: 'bg-cyber-red',
                sparkPath: buildSparkPath(noiseValues),   // noise suppressed = time saved
            },
            {
                id: 'blocked',
                label: 'Blocked',
                description: 'Low-priority msgs intercepted',
                value: stats.blockedCount.toLocaleString(),
                unit: 'msgs',
                change: stats.blockedCount > 0 ? `+${stats.blockedCount}` : '0',
                positive: true,
                icon: Shield,
                accent: '#00FF66',
                accentCls: 'text-neon-green',
                bgGlow: 'bg-neon-green',
                sparkPath: buildSparkPath(noiseValues),
            },
            {
                id: 'focus',
                label: 'Focus Score',
                description: 'Better when noise ratio is low',
                value: stats.focusScore.toString(),
                unit: '%',
                change: `${stats.focusScore >= 75 ? '+' : ''}${stats.focusScore}%`,
                positive: stats.focusScore >= 60,
                icon: Gauge,
                accent: '#FFCC00',
                accentCls: 'text-electric-amber',
                bgGlow: 'bg-electric-amber',
                sparkPath: buildSparkPath(focusValues, false),
            },
        ]
        : []

    const noiseSources = stats?.noiseSources?.length
        ? stats.noiseSources
        : [
            { label: 'Gmail', pct: 0 },
            { label: 'Classroom', pct: 0 },
            { label: 'Manual', pct: 0 },
        ]

    const heatmap = stats?.heatmap ?? Array.from({ length: 48 }, (_, i) => {
        const seed = (i * 7 + 13) % 10
        if (seed >= 8) return 'hot' as const
        if (seed >= 5) return 'warm' as const
        if (seed >= 3) return 'cool' as const
        return 'cold' as const
    })

    return (
        <div className="p-6 lg:p-10 space-y-8 min-h-full">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse shadow-[0_0_8px_#FF3366]" />
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-white uppercase leading-none">
                            Telemetry
                        </h1>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-0.5">
                            Your attention, at a glance
                        </p>
                    </div>
                </div>
                {loading && (
                    <div className="flex items-center gap-2 text-zinc-600 text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="font-mono tracking-widest uppercase">Syncing</span>
                    </div>
                )}
                {!loading && stats && (
                    <div className="flex items-center gap-2 text-neon-green text-[10px] font-black tracking-widest uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                        Live data · {stats.total} msgs tracked
                    </div>
                )}
            </motion.div>

            {error && (
                <div className="p-4 rounded-xl bg-cyber-red/10 border border-cyber-red/20 text-cyber-red text-xs font-mono">
                    ⚠ {error}
                </div>
            )}

            {/* ── Stat Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="glass-card rounded-[28px] border-subpixel p-6 h-40 animate-pulse bg-white/[0.02]" />
                    ))
                    : statCards.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                            className="glass-card rounded-[28px] border-subpixel relative overflow-hidden group cursor-default p-6 hover:border-white/15 transition-all duration-500"
                        >
                            {/* Hover glow */}
                            <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${s.bgGlow}`} />

                            {/* Icon row */}
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] ${s.accentCls}`}>
                                    <s.icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase ${s.positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
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
                            <p className="relative z-10 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{s.label}</p>
                            <p className="relative z-10 text-[10px] text-zinc-700 tracking-wide mt-0.5">{s.description}</p>

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

                {/* Focus vs Noise Chart */}
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
                                {loading ? 'Loading...' : `${stats?.total ?? 0} total messages analysed`}
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

                    {/* SVG Line Graph */}
                    <div className="relative mb-5">
                        <div className="flex items-center gap-5 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-px bg-neon-green shadow-[0_0_4px_#00FF66]" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Focus (instant)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-px bg-cyber-red shadow-[0_0_4px_#FF3366]" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Noise (batch+scheduled)</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-52 rounded-2xl bg-white/[0.01] animate-pulse" />
                        ) : (
                            <div className="h-52 rounded-2xl overflow-hidden bg-white/[0.01] relative">
                                {/* Dot grid background */}
                                <div
                                    className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
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

                                    {/* Focus Area Fill */}
                                    <motion.path
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1.2, delay: 0.4 }}
                                        d={`${focusSvgPath} V400 H0Z`}
                                        fill="url(#gFill)"
                                    />

                                    {/* Noise Area Fill */}
                                    <motion.path
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1.2, delay: 0.6 }}
                                        d={`${noiseSvgPath} V400 H0Z`}
                                        fill="url(#rFill)"
                                    />

                                    {/* Noise Curve Line */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                                        d={noiseSvgPath}
                                        fill="none"
                                        stroke="#FF3366"
                                        strokeWidth="2"
                                        strokeOpacity="0.65"
                                        className="drop-shadow-[0_0_8px_#FF3366]"
                                    />

                                    {/* Focus Curve Line */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 3, ease: 'easeInOut', delay: 0.3 }}
                                        d={focusSvgPath}
                                        fill="none"
                                        stroke="#00FF66"
                                        strokeWidth="2.5"
                                        className="drop-shadow-[0_0_12px_#00FF66]"
                                    />
                                </svg>

                                {/* Badge */}
                                {!loading && stats && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                                        className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neon-green/10 border border-neon-green/20"
                                    >
                                        <TrendingUp className="w-3 h-3 text-neon-green" />
                                        <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">
                                            {stats.focusScore >= 70 ? 'Shield winning' : 'Noise detected'}
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Noise Breakdown */}
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

                    {/* 24-hr Activity Heatmap */}
                    <div className="grid grid-cols-8 gap-1">
                        {heatmap.map((level, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.007, ease: 'backOut' }}
                                className={`rounded-sm aspect-square cursor-default hover:scale-125 transition-transform duration-150 ${heatCell[level as keyof typeof heatCell]}`}
                            />
                        ))}
                    </div>

                    {/* Heatmap Legend */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Noisy</span>
                        <div className="h-1 flex-1 mx-3 bg-gradient-to-r from-cyber-red via-cyber-red/30 to-zinc-900 rounded-full" />
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Quiet</span>
                    </div>

                    {/* Top Sources */}
                    <div className="space-y-3">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-6 rounded bg-white/[0.02] animate-pulse" />
                            ))
                            : noiseSources.map((s, i) => (
                                <div key={s.label}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold text-zinc-400 capitalize tracking-wide">{s.label}</span>
                                        <span className="text-xs font-mono font-black text-zinc-500">{s.pct}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.pct}%` }}
                                            transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(to right, ${getSourceColor(s.label)}, ${getSourceColor(s.label)}55)` }}
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
