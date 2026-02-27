'use client'

import { useMukaStore } from '@/store/useMukaStore'
import { motion } from 'framer-motion'
import { Shield, FileText, Mail, MessageCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
    const { isFocusModeActive, toggleFocusMode } = useMukaStore()

    return (
        <aside className="w-64 h-screen border-r border-[#1a1a1a] bg-[#0A0A0A] flex flex-col pt-6 pb-6 select-none shrink-0 overflow-y-auto">
            {/* SECTION: Focus Control */}
            <div className="px-6 mb-8 mt-2">
                <h3 className="text-[10px] font-bold tracking-widest text-[#666666] uppercase mb-4 font-mono">
                    Focus Control
                </h3>

                <div className={cn(
                    "rounded-xl p-4 transition-all duration-500 relative overflow-hidden group",
                    isFocusModeActive
                        ? "bg-gradient-to-br from-emerald-950/40 to-[#1A1A1A] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        : "bg-[#1A1A1A] border border-[#2A2A2A]"
                )}>
                    {isFocusModeActive && (
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-50 blur-xl pointer-events-none" />
                    )}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-zinc-300" />
                            <span className="text-sm font-semibold text-zinc-200">Focus Mode</span>
                        </div>

                        {/* Custom Toggle Switch */}
                        <div
                            className={cn(
                                "w-10 h-5 rounded-full relative cursor-pointer flex items-center p-0.5 border transition-colors",
                                isFocusModeActive ? "bg-white border-white" : "bg-[#2A2A2A] border-[#3A3A3A]"
                            )}
                            onClick={toggleFocusMode}
                        >
                            <motion.div
                                className={cn(
                                    "w-4 h-4 rounded-full shadow-sm bg-black",
                                )}
                                layout
                                animate={{
                                    x: isFocusModeActive ? 18 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 relative z-10 mt-1">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-500",
                            isFocusModeActive ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" : "bg-zinc-600"
                        )} />
                        <span className={cn("text-[10px] font-bold tracking-wider uppercase font-mono transition-colors", isFocusModeActive ? "text-emerald-500/70" : "text-zinc-600")}>
                            {isFocusModeActive ? "Shielding Active" : "Shielding Paused"}
                        </span>
                    </div>
                </div>
            </div>

            {/* SECTION: Sources */}
            <div className="px-6 mb-auto">
                <h3 className="text-[10px] font-bold tracking-widest text-[#666666] uppercase mb-4 font-mono">
                    Sources
                </h3>

                <div className="flex flex-col gap-2">
                    {/* Webmail */}
                    <div className="group flex items-center justify-between bg-gradient-to-r from-[#1A1A1A] to-[#151515] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-xl px-4 py-3 cursor-pointer transition-all hover:bg-[#202020]">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">Webmail</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>

                    {/* WhatsApp */}
                    <div className="group flex items-center justify-between bg-gradient-to-r from-[#1A1A1A] to-[#151515] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-xl px-4 py-3 cursor-pointer transition-all hover:bg-[#202020]">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">WhatsApp</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>

                    {/* Slack */}
                    <div className="group flex items-center justify-between bg-gradient-to-r from-[#1A1A1A] to-[#151515] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-xl px-4 py-3 cursor-pointer transition-all hover:bg-[#202020]">
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">Slack</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 mt-8">
                <button className="flex items-center gap-2 w-full bg-[#151515] border border-[#2A2A2A] hover:bg-[#202020] transition-colors rounded-xl px-4 py-3 text-zinc-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-semibold">Correction Log</span>
                </button>
            </div>
        </aside>
    )
}
