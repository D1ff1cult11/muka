'use client'

import { useMukaStore } from '@/store/useMukaStore'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export function TelemetryTaskbar() {
    const energySaved = useMukaStore(state => state.energySaved)

    return (
        <header className="sticky top-0 z-50 w-full border-b-subpixel bg-[#0A0A0A]/80 backdrop-blur-2xl">
            <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                <div className="flex items-center gap-2 relative">
                    <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span className="text-xl font-extrabold tracking-widest text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        MUKA <span className="text-zinc-500 font-light">FIREWALL</span>
                    </span>
                    <div className="absolute -inset-4 bg-red-500/10 blur-xl -z-10 rounded-full" />
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block text-xs font-heading font-bold text-zinc-500 uppercase tracking-widest">
                        Mental Energy Saved
                    </span>
                    <div className="flex items-center justify-center rounded-md bg-[#111] px-4 py-1.5 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] border border-[#222] font-heading relative overflow-hidden group hover:border-[#333] transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={energySaved}
                                initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                                className="text-2xl font-black font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] block min-w-[2.5rem] text-center"
                            >
                                {energySaved}
                            </motion.span>
                        </AnimatePresence>
                        <span className="ml-1 text-xs text-zinc-600 font-heading font-bold">pts</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
