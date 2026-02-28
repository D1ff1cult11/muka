'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shield, Target, Zap, AlertTriangle, Layers, Sliders } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProtocolsPage() {
    const [strictness, setStrictness] = useState(0.85)

    return (
        <div className="p-10 max-w-5xl space-y-12">
            {/* Header Stage */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">Firewall Protocols</h1>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mt-1">Neural Classification Parameters</p>
            </div>

            {/* Neural Sliders */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <Sliders className="w-4 h-4 text-cyber-red" />
                    <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">ML Configuration</h2>
                </div>

                <div className="glass-card p-10 rounded-[40px] border-subpixel space-y-12">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Strictness Threshold</h3>
                                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest mt-1">Minimum confidence score for Stream routing</p>
                            </div>
                            <span className="text-3xl font-mono font-black text-cyber-red">
                                {strictness.toFixed(2)}
                            </span>
                        </div>

                        <div className="relative h-12 flex items-center group">
                            <div className="absolute inset-x-0 h-1 bg-zinc-900 rounded-full" />
                            <motion.div
                                className="absolute h-1 bg-cyber-red rounded-full"
                                style={{ width: `${strictness * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={strictness}
                                onChange={(e) => setStrictness(parseFloat(e.target.value))}
                                className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {/* Track notches */}
                            <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
                                {[0, 0.25, 0.5, 0.75, 1].map((mark) => (
                                    <div key={mark} className="flex flex-col items-center">
                                        <div className="w-[1px] h-3 bg-zinc-800" />
                                        <span className="text-[9px] font-mono font-bold text-zinc-700 mt-2">{mark}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Draggable Knob Visual */}
                            <motion.div
                                className="absolute w-8 h-8 rounded-xl bg-white shadow-2xl flex items-center justify-center pointer-events-none border-2 border-void"
                                style={{ left: `calc(${strictness * 100}% - 16px)` }}
                            >
                                <Target className="w-4 h-4 text-cyber-red" />
                            </motion.div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Inference Latency Target</label>
                            <div className="flex gap-2">
                                {['Balanced', 'Ultra-Low', 'High-Recall'].map((mode) => (
                                    <button key={mode} className={cn(
                                        "flex-1 py-3 rounded-xl border-subpixel transition-all text-[10px] font-bold uppercase tracking-widest",
                                        mode === 'Balanced' ? "bg-white text-black" : "bg-surface text-zinc-500 hover:text-white"
                                    )}>
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Recursive Pruning</label>
                            <div className="flex items-center justify-between p-3 bg-surface border-subpixel rounded-xl">
                                <span className="text-[11px] font-bold text-zinc-400">Aggressive Cluster Pruning</span>
                                <div className="w-10 h-5 bg-cyber-red rounded-full flex items-center px-1">
                                    <div className="w-3 h-3 bg-white rounded-full shadow-lg ml-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rule Matrix */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-neon-green" />
                    <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">Bypass Rule Matrix</h2>
                </div>

                <div className="space-y-3">
                    {[
                        { label: "Always Route Dean's Domains to Stream", active: true, desc: "Bypasses all latency buffers and strictly follows PR_01 scheduling." },
                        { label: "Suppress All Integration Status Updates", active: false, desc: "Mutes low-level sync heartbeat notifications across all channels." },
                        { label: "Force MFA Verification for Vault Unlock", active: true, desc: "Adds bi-directional verification requirement to the override long-press." },
                    ].map((rule, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl border-subpixel flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-2 rounded-xl border-subpixel", rule.active ? "text-neon-green bg-neon-green/5" : "text-zinc-600 bg-surface")}>
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-extrabold text-white tracking-tight leading-none mb-2">{rule.label}</h4>
                                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{rule.desc}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-12 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer",
                                rule.active ? "bg-neon-green" : "bg-zinc-800"
                            )}>
                                <motion.div
                                    animate={{ x: rule.active ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full shadow-lg"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
