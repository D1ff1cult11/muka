'use client'

import { useMukaStore } from '@/store/useMukaStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Power, Timer, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DeepWorkOverlay() {
    const { isFocusModeActive, focusTimeLeft, stopFocusSession, decrementTimer } = useMukaStore()

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isFocusModeActive && focusTimeLeft > 0) {
            interval = setInterval(() => {
                decrementTimer()
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isFocusModeActive, focusTimeLeft, decrementTimer])

    if (!isFocusModeActive) return null

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-xl flex items-center justify-center p-8 select-none"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/10 blur-[120px] rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1A1A1A 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative w-full max-w-lg flex flex-col items-center text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.4)] mb-8"
                >
                    <Shield className="w-10 h-10 text-white" />
                </motion.div>

                <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-[0.2em] font-mono">Deep Work Mode</h1>
                <p className="text-zinc-500 text-sm mb-12 font-mono tracking-widest">FIREWALL PROTOCOL ACTIVE</p>

                <div className="relative mb-16">
                    <div className="text-[120px] font-bold font-mono text-white leading-none tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        {formatTime(focusTimeLeft)}
                    </div>
                    <div className="absolute -bottom-4 left-0 w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: `${(focusTimeLeft / (25 * 60)) * 100}%` }}
                            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-12">
                    <div className="bg-[#111]/50 border border-[#1A1A1A] p-4 rounded-2xl flex flex-col items-center">
                        <Zap className="w-4 h-4 text-[#8B5CF6] mb-2" />
                        <span className="text-[10px] font-mono text-zinc-500 mb-1">INTEL BLOCKED</span>
                        <span className="text-sm font-bold text-white">14 Nodes</span>
                    </div>
                    <div className="bg-[#111]/50 border border-[#1A1A1A] p-4 rounded-2xl flex flex-col items-center">
                        <Timer className="w-4 h-4 text-[#FBBF24] mb-2" />
                        <span className="text-[10px] font-mono text-zinc-500 mb-1">SESSION GOAL</span>
                        <span className="text-sm font-bold text-white">Focus Block Alpha</span>
                    </div>
                </div>

                <button
                    onClick={stopFocusSession}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all font-bold text-xs tracking-widest text-zinc-500 hover:text-red-400"
                >
                    <Power className="w-4 h-4" />
                    ABORT SESSION
                </button>
            </div>

            <button
                onClick={stopFocusSession}
                className="absolute top-8 right-8 p-3 rounded-xl bg-zinc-900/50 border border-[#1A1A1A] text-zinc-500 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </motion.div>
    )
}
