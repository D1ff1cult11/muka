'use client'

import { Search, Command, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMukaStore } from '@/store/useMukaStore'
import { cn } from '@/lib/utils'

export function TelemetryBar() {
    const { fetchFeed, searchQuery, setSearchQuery } = useMukaStore()
    const [isSyncing, setIsSyncing] = useState(false)

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
        <nav className="h-[72px] w-full bg-void/80 backdrop-blur-2xl border-b-[0.5px] border-muka-border flex items-center px-4 md:px-8 shrink-0 relative z-40">
            {/* Left Spacer */}
            <div className="flex-1 hidden md:block relative z-10"></div>

            {/* Search / Command Palette - Absolute Center */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-120px)] md:w-[600px] z-20">
                <div className="relative group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-cyber-red transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="GLOBAL COMMAND PALETTE"
                        className="w-full bg-surface border-[0.5px] border-muka-border focus:border-cyber-red/50 focus:bg-black rounded-xl py-2.5 pl-12 pr-12 text-[12px] font-bold tracking-[0.1em] text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded border-subpixel bg-void">
                        <Command className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-600">ENTER</span>
                    </div>
                </div>
            </div>

            {/* Sync & Status */}
            <div className="flex-1 flex items-center justify-end gap-3 md:gap-6 relative z-10 ml-auto">
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
