'use client'

import { Search, Command, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMukaStore } from '@/store/useMukaStore'
import { cn } from '@/lib/utils'

export function TelemetryBar() {
    const { energySaved, focusScore, scheduled, batch, fetchFeed } = useMukaStore()
    const [inputValue, setInputValue] = useState('')
    const [isIngesting, setIsIngesting] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    const totalQueue = scheduled.length + batch.length

    const handleIngest = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim() && !isIngesting) {
            setIsIngesting(true)
            try {
                const res = await fetch('/api/ingest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputValue, source: 'manual' }),
                })

                if (res.ok) {
                    setInputValue('')
                    await fetchFeed()
                }
            } catch (error) {
                console.error('Ingestion failed:', error)
            } finally {
                setIsIngesting(false)
            }
        }
    }

    const triggerSync = async () => {
        setIsSyncing(true)
        try {
            await fetch('/api/ingest/google', { method: 'POST' })
            await fetchFeed(true)
        } catch (error) {
            console.error('Failed to sync:', error)
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <nav className="h-[72px] w-full bg-void/80 backdrop-blur-2xl border-b-[0.5px] border-muka-border flex items-center justify-between px-8 shrink-0 relative z-40">
            {/* Search / Command Palette */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-cyber-red transition-colors" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleIngest}
                        disabled={isIngesting}
                        placeholder={isIngesting ? "CLASSIFYING..." : "GLOBAL COMMAND PALETTE"}
                        className="w-full bg-surface border-[0.5px] border-muka-border focus:border-cyber-red/50 focus:bg-black rounded-xl py-2.5 pl-12 pr-12 text-[12px] font-bold tracking-[0.1em] text-zinc-200 placeholder-zinc-600 outline-none transition-all disabled:opacity-50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded border-subpixel bg-void">
                        <Command className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-600">ENTER</span>
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
                                {focusScore.toFixed(1)}%
                            </span>
                            <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${focusScore}%` }}
                                    className="h-full bg-cyber-red shadow-[0_0_10px_#FF3366]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-muka-border" />

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Deep Queue</span>
                        <span className="text-sm font-mono font-bold text-electric-amber leading-none">
                            {totalQueue.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="w-px h-8 bg-muka-border" />

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Focus ROI</span>
                        <span className="text-sm font-mono font-bold text-neon-green leading-none">
                            +{Math.round(energySaved / 60)}m
                        </span>
                    </div>
                </div>

                {/* Sync Button */}
                <button
                    onClick={triggerSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border-subpixel bg-surface hover:bg-zinc-900 transition-colors text-[10px] font-black text-zinc-400 hover:text-white disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-3 h-3", isSyncing && "animate-spin text-cyber-red")} />
                    {isSyncing ? "SYNCING..." : "SYNC"}
                </button>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-4 py-2 bg-neon-green/5 border border-neon-green/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-[10px] font-black text-neon-green uppercase tracking-widest leading-none">Firewall Active</span>
                </div>
            </div>
        </nav>
    )
}
