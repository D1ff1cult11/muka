'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { Archive as ArchiveIcon, Search, Filter } from 'lucide-react'

export default function ArchivePage() {
    return (
        <MainLayout>
            <div className="flex flex-col gap-8 py-6">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[#BEF264]">
                        <ArchiveIcon className="w-5 h-5" />
                        <h1 className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Intelligence Archive</h1>
                    </div>
                    <p className="text-zinc-500 text-sm max-w-2xl">
                        All processed intelligence, bundles, and historical focus sessions are indexed here for retrieval.
                    </p>
                </header>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Search archive..."
                            className="w-full bg-[#0A0A0A] border border-[#151515] rounded-xl py-2.5 pl-12 pr-4 text-sm text-zinc-200 focus:border-[#BEF264]/30 outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border border-[#151515] rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all">
                        <Filter className="w-4 h-4" />
                        FILTER
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-[#0A0A0A] border border-[#151515] p-6 rounded-2xl hover:border-[#BEF264]/20 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#BEF264]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <span className="text-[10px] font-mono text-[#BEF264] bg-[#BEF264]/10 px-2 py-0.5 rounded border border-[#BEF264]/20">BUNDLE</span>
                                <span className="text-[10px] font-mono text-zinc-600 uppercase">Feb 2{i}, 2026</span>
                            </div>
                            <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white mb-2 relative z-10">Q4 Team Performance Review {i}</h3>
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed relative z-10">
                                Comprehensive analysis of sprint metrics and engineering throughput during the last cycle...
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
