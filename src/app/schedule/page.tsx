'use client'

import { cn } from '@/lib/utils'
import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

export default function SchedulePage() {
    return (
        <MainLayout>
            <div className="flex flex-col gap-8 py-6">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[#FBBF24]">
                        <CalendarIcon className="w-5 h-5" />
                        <h1 className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Attention Schedule</h1>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500 text-sm max-w-2xl">
                            Plan your focus blocks and schedule intelligence delivery windows.
                        </p>
                        <div className="flex items-center gap-4 bg-[#111] p-1 rounded-xl border border-[#151515]">
                            <button className="p-2 hover:bg-[#1A1A1A] rounded-lg text-zinc-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                            <span className="text-xs font-bold px-2">FEBRUARY 2026</span>
                            <button className="p-2 hover:bg-[#1A1A1A] rounded-lg text-zinc-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-7 gap-px bg-[#151515] border border-[#151515] rounded-2xl overflow-hidden">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                        <div key={day} className="bg-[#050505] p-4 text-center">
                            <span className="text-[10px] font-mono font-bold text-zinc-600">{day}</span>
                        </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="bg-[#0A0A0A] p-4 min-h-[140px] relative group hover:bg-[#0E0E0E] transition-colors">
                            <span className={cn(
                                "text-[10px] font-mono",
                                i === 27 ? "text-[#FBBF24] font-bold" : "text-zinc-700"
                            )}>
                                {(i % 31) + 1}
                            </span>
                            {i === 27 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-2 p-2 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/20"
                                >
                                    <p className="text-[9px] font-bold text-[#FBBF24] leading-tight">DEEP WORK BLOCK</p>
                                    <p className="text-[8px] text-zinc-500 mt-1">14:00 - 16:00</p>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}

