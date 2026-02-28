'use client'

import { motion } from 'framer-motion'
import { Activity, Brain, Shield, Zap, TrendingUp, BarChart3 } from 'lucide-react'

export default function TelemetryPage() {
    return (
        <div className="p-10 space-y-10">
            {/* Header Stage */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">Telemetry Engine</h1>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mt-1">Quantitative Attention Analysis</p>
            </div>

            {/* Top Metric Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Cognitive Yield', value: '142.5', unit: 'HRS', change: '+12%', icon: Brain, color: 'text-cyber-red' },
                    { label: 'Spam Intercepted', value: '8,401', unit: 'PKTS', change: '+4.2%', icon: Shield, color: 'text-neon-green' },
                    { label: 'Focus Volatility', value: '0.14', unit: 'STD', change: '-22%', icon: Activity, color: 'text-electric-amber' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 rounded-[32px] border-subpixel relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-widest">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-mono font-black text-white">{stat.value}</span>
                                <span className="text-xs font-mono font-bold text-zinc-600 tracking-widest">{stat.unit}</span>
                            </div>
                        </div>
                        {/* Interactive Sparkline Placeholder */}
                        <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: i * 0.2 }}
                                    d="M0,50 Q25,30 50,60 T100,20 V100 H0 Z"
                                    fill="url(#gradient)"
                                    className={stat.color === 'text-cyber-red' ? 'fill-cyber-red/20' : stat.color === 'text-neon-green' ? 'fill-neon-green/20' : 'fill-electric-amber/20'}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Analysis Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-[40px] border-subpixel min-h-[400px] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Attention Saved Over Time</h3>
                            <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest mt-1">Aggregated Focus Savings [T-24H]</p>
                        </div>
                        <div className="flex gap-2">
                            {['1H', '24H', '7D', 'ALL'].map((t) => (
                                <button key={t} className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-subpixel hover:bg-surface transition-all text-zinc-500 hover:text-white">
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Mesh Graph Placeholder */}
                    <div className="absolute inset-0 top-24 m-8 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/10 via-void to-neon-green/5" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-void to-transparent" />

                        <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 400" preserveAspectRatio="none">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                                d="M0,350 Q100,320 200,360 T400,300 T600,340 T800,280 T1000,320"
                                fill="none"
                                stroke="#FF3366"
                                strokeWidth="3"
                                className="drop-shadow-[0_0_15px_#FF3366]"
                            />
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                                d="M0,380 Q150,340 300,380 T500,320 T700,360 T900,300 T1000,350"
                                fill="none"
                                stroke="#00FF66"
                                strokeWidth="2"
                                strokeOpacity="0.5"
                                className="drop-shadow-[0_0_10px_#00FF66]"
                            />
                        </svg>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[40px] border-subpixel flex flex-col relative overflow-hidden">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-tight mb-8">Entropy by Source</h3>

                    {/* Heatmap Placeholder */}
                    <div className="flex-1 grid grid-cols-6 grid-rows-8 gap-1.5 h-full">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.01 }}
                                className={`rounded-[3px] transition-all cursor-pointer ${Math.random() > 0.8 ? 'bg-cyber-red shadow-[0_0_8px_#FF3366]' :
                                        Math.random() > 0.6 ? 'bg-cyber-red/40' :
                                            Math.random() > 0.4 ? 'bg-zinc-800' :
                                                'bg-zinc-900/40'
                                    } hover:scale-125 hover:z-10`}
                            />
                        ))}
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">High Heat</span>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Muted</span>
                        </div>
                        <div className="h-1.5 w-full bg-gradient-to-r from-cyber-red via-cyber-red/40 to-zinc-900 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
