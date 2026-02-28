'use client'

import { Search, Command, Activity, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function TelemetryBar() {
    const [metrics, setMetrics] = useState({ focus: 100, queue: 14, saved: 42 })

    // Simulate ticking telemetry
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                focus: Math.min(100, Math.max(95, prev.focus + (Math.random() - 0.5))),
                saved: prev.saved + (Math.random() > 0.8 ? 1 : 0)
            }))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <nav className="h-[72px] w-full bg-void/80 backdrop-blur-2xl border-b-[0.5px] border-muka-border flex items-center justify-between px-8 shrink-0 relative z-40">
            {/* Search / Command Palette */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-cyber-red transition-colors" />
                    <input
                        type="text"
                        placeholder="GLOBAL COMMAND PALETTE"
                        className="w-full bg-surface border-[0.5px] border-muka-border focus:border-cyber-red/50 focus:bg-black rounded-xl py-2.5 pl-12 pr-12 text-[12px] font-bold tracking-[0.1em] text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded border-subpixel bg-void">
                        <Command className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-600">K</span>
                    </div>
                </div>
            </div>

            {/* Live Telemetry */}
            <div className="flex items-center gap-10 ml-8">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Focus Score</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-white leading-none">
                                {metrics.focus.toFixed(1)}%
                            </span>
                            <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metrics.focus}%` }}
                                    className="h-full bg-cyber-red shadow-[0_0_10px_#FF3366]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-muka-border" />

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Deep Queue</span>
                        <span className="text-sm font-mono font-bold text-electric-amber leading-none">
                            {metrics.queue.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="w-px h-8 bg-muka-border" />

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Focus ROI</span>
                        <span className="text-sm font-mono font-bold text-neon-green leading-none">
                            +{metrics.saved}m
                        </span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-4 py-2 bg-neon-green/5 border border-neon-green/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-[10px] font-black text-neon-green uppercase tracking-widest leading-none">Firewall Active</span>
                </div>
            </div>
        </nav>
    )
}
