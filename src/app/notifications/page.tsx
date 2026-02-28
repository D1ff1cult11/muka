'use client'

import { cn } from '@/lib/utils'
import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { Bell, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function NotificationsPage() {
    const notifications = [
        { type: 'info', title: 'Intelligence Delivery Ready', msg: 'Your batched emails from the last 4 hours have been summarized and are ready for review.', time: '12m ago' },
        { type: 'warning', title: 'Deep Work Override', msg: 'A priority message from Elena V. was allowed through the focus shield.', time: '45m ago' },
        { type: 'success', title: 'Session Complete', msg: 'Focus session "Protocol Deployment" completed with 98% efficiency.', time: '2h ago' },
        { type: 'info', title: 'System Update', msg: 'MUKA AI model has been updated with improved classification logic.', time: '5h ago' },
    ]

    return (
        <MainLayout>
            <div className="flex flex-col gap-8 py-6 max-w-4xl">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[#8B5CF6]">
                        <Bell className="w-5 h-5 shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                        <h1 className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Intelligence Feed</h1>
                    </div>
                    <p className="text-zinc-500 text-sm">
                        System-level alerts and delivery notifications regarding your attention firewall and AI orchestration.
                    </p>
                </header>

                <div className="flex flex-col gap-4">
                    {notifications.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[#0A0A0A] border border-[#151515] p-5 rounded-2xl hover:bg-[#0E0E0E] transition-all flex gap-5"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                item.type === 'info' && "bg-[#8B5CF6]/10 text-[#8B5CF6]",
                                item.type === 'warning' && "bg-amber-500/10 text-amber-500",
                                item.type === 'success' && "bg-emerald-500/10 text-emerald-400",
                            )}>
                                {item.type === 'info' && <Info className="w-5 h-5" />}
                                {item.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                                {item.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-bold text-zinc-200">{item.title}</h3>
                                    <span className="text-[10px] font-mono text-zinc-600 font-bold">{item.time}</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.msg}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                    <button className="text-[10px] font-bold text-zinc-600 hover:text-zinc-300 font-mono tracking-widest uppercase transition-colors">
                        Clear All History
                    </button>
                </div>
            </div>
        </MainLayout>
    )
}


