'use client'

import { motion } from 'framer-motion'
import { Search, Filter, ArrowUpDown, MoreHorizontal, ExternalLink } from 'lucide-react'

const MOCK_DATA = [
    { id: '01', time: '10:42:15', source: 'GMAIL', text: 'URGENT: Semester Registration Deadline', class: 'High-Priority', confidence: 0.98 },
    { id: '02', time: '10:38:02', source: 'WHATSAPP', text: 'Lecture hall changed for CS301', class: 'Instant', confidence: 0.94 },
    { id: '03', time: '10:30:44', source: 'CANVAS', text: 'New announcement in Physics II', class: 'Scheduled', confidence: 0.89 },
    { id: '04', time: '09:15:21', source: 'SYSTEM', text: 'Kernel shielding optimized successfully', class: 'Batch', confidence: 1.00 },
    { id: '05', time: '08:44:12', source: 'GMAIL', text: 'Promotional: Buy new university hoodies!', class: 'Spam', confidence: 0.99 },
]

export default function LedgerPage() {
    return (
        <div className="p-10 space-y-8">
            {/* Header Stage */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">The Ledger</h1>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mt-1">Deterministic Relational Archive</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface border-subpixel rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest">
                        <Filter className="w-3.5 h-3.5" />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyber-red text-white rounded-xl text-[10px] font-black hover:bg-cyber-red/80 transition-all uppercase tracking-widest shadow-lg shadow-cyber-red/20">
                        Manual Backup
                    </button>
                </div>
            </div>

            {/* Semantic Search Area */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                    type="text"
                    placeholder="COMPLEX SEMANTIC SEARCH EX: 'Find all emails from the Dean regarding financial aid in the last 48 hours'"
                    className="w-full bg-[#080808] border-[0.5px] border-muka-border focus:border-cyber-red/40 rounded-2xl py-5 pl-14 pr-6 text-sm font-medium text-white placeholder-zinc-700 outline-none transition-all shadow-2xl"
                />
            </div>

            {/* Data Table */}
            <div className="glass-card rounded-3xl overflow-hidden border-subpixel">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-[0.5px] border-muka-border bg-white/[0.01]">
                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Timestamp</th>
                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Source</th>
                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Intercepted Payload</th>
                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Classification</th>
                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Confidence</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-[0.5px] divide-muka-border">
                        {MOCK_DATA.map((row) => (
                            <tr key={row.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-5">
                                    <span className="text-[12px] font-mono font-bold text-zinc-400 group-hover:text-white transition-colors">
                                        {row.time}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-[9px] font-black text-white tracking-widest uppercase">
                                        {row.source}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors line-clamp-1 max-w-sm font-sans">
                                        {row.text}
                                    </p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${row.class === 'Instant' ? 'bg-cyber-red' :
                                                row.class === 'Scheduled' ? 'bg-electric-amber' :
                                                    row.class === 'Batch' ? 'bg-neon-green' : 'bg-zinc-700'
                                            }`} />
                                        <span className="text-[11px] font-bold text-zinc-400 capitalize">{row.class}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <span className="text-[12px] font-mono font-black text-neon-green">
                                        {(row.confidence * 100).toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer Stats */}
            <div className="flex items-center justify-between pb-10">
                <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                    Showing 01 - 05 of 14,202 Intercepts
                </span>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-surface border-subpixel rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">Previous</button>
                    <button className="px-4 py-2 bg-surface border-subpixel rounded-lg text-xs font-bold text-white transition-all">Next</button>
                </div>
            </div>
        </div>
    )
}
