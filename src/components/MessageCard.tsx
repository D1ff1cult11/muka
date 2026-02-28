'use client'

import { Message, ZoneType, useMukaStore } from '@/store/useMukaStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Lock, Clock, Check, Bell } from 'lucide-react';

interface MessageCardProps {
    message: Message;
    index: number;
    zoneType: ZoneType;
    isDragging?: boolean;
}

export function MessageCard({ message, zoneType, isDragging }: MessageCardProps) {
    const { dismissMessage, snoozeMessage } = useMukaStore();
    const isInstant = zoneType === 'instant';
    const isScheduled = zoneType === 'scheduled';
    const isBatch = zoneType === 'batch';

    const initials = message.sender ? message.sender.split(' ').map((n: string) => n[0]).join('') : 'AI';

    // Calculate time ago
    const diff = Date.now() - message.createdAt;
    const mins = Math.floor(diff / 60000);
    const timeAgo = mins < 1 ? 'Just now' : `${mins}m ago`;

    const isUrgent = isInstant && (message.title?.toLowerCase().includes('urgent') || message.content.toLowerCase().includes('need'));

    if (isBatch) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "group relative bg-[#0A0A0A] border border-[#151515] hover:border-[#BEF264]/30 rounded-2xl p-5 transition-all text-left overflow-hidden",
                    isDragging && "opacity-50 scale-95"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#BEF264]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex justify-between items-start mb-4 text-left relative z-10">
                    <div className="text-left">
                        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors text-left uppercase tracking-tight">
                            {message.title || "Weekly Digest — All Teams"}
                        </h4>
                        <p className="text-[10px] font-mono text-zinc-600 mt-1 uppercase tracking-widest text-left">
                            Suppressed Notification Cluster
                        </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#BEF264] bg-[#BEF264]/10 px-2 py-0.5 rounded border border-[#BEF264]/20">Auto</span>
                </div>

                <div className="relative h-1 w-full bg-[#111] rounded-full overflow-hidden mb-6 relative z-10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute h-full bg-[#BEF264] shadow-[0_0_10px_rgba(190,242,100,0.5)]"
                    />
                </div>

                <div className="flex justify-end relative z-10">
                    <button
                        onClick={() => dismissMessage(message.id, 'batch')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#BEF264] hover:bg-[#D9FA9E] text-black rounded-xl text-[10px] font-bold transition-all shadow-[0_0_20px_rgba(190,242,100,0.2)] active:scale-95"
                    >
                        <Lock className="w-3 h-3" />
                        ACKNOWLEDGE BUNDLE
                    </button>
                </div>
            </motion.div>
        );
    }

    if (isScheduled) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                    "group relative flex gap-4 pl-1",
                    isDragging && "opacity-50"
                )}
            >
                <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#FBBF24] bg-[#050505] shrink-0 mt-2 z-10 group-hover:scale-125 transition-transform" />
                    <div className="w-px flex-1 bg-gradient-to-b from-[#FBBF24]/30 to-[#151515]" />
                </div>

                <div className="flex-1 pb-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h4 className="text-[13px] font-bold text-zinc-300 group-hover:text-white transition-colors">
                                {message.sender}
                            </h4>
                            <span className="px-2 py-0.5 rounded border border-zinc-800 bg-[#0A0A0A] text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                                QUEUED
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 font-bold">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#151515] group-hover:border-[#FBBF24]/20 p-4 rounded-2xl transition-all">
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {message.content}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className={cn(
                "group relative bg-[#0A0A0A] border border-[#151515] p-6 rounded-2xl transition-all hover:bg-[#0E0E0E] overflow-hidden",
                isDragging ? "opacity-30 scale-95" : "hover:border-[#8B5CF6]/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
            )}
        >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#8B5CF6]/20 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full pointer-events-none group-hover:translate-x-[-20%] group-hover:translate-y-[20%]" />
            <div className="absolute inset-0 border border-transparent group-hover:border-[#8B5CF6]/20 rounded-2xl transition-all duration-500" />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#111] to-[#050505] border border-[#1A1A1A] flex items-center justify-center text-sm font-bold text-zinc-400 group-hover:border-[#8B5CF6]/60 group-hover:text-white transition-all shadow-inner">
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-zinc-200 group-hover:text-white transition-colors">
                            {message.sender}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-zinc-600" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                {timeAgo}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dismissMessage(message.id, 'instant')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-700 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all"
                        title="Acknowledge"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => snoozeMessage(message.id, 'instant')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-700 hover:text-[#FBBF24] hover:bg-[#FBBF24]/10 transition-all"
                        title="Snooze"
                    >
                        <Bell className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-[14px] leading-[1.6] text-zinc-500 group-hover:text-zinc-300 transition-colors mb-5 relative z-10">
                {message.content}
            </p>

            <div className="flex items-center justify-between relative z-10">
                {isUrgent ? (
                    <div className="inline-flex px-2.5 py-1 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                        <span className="text-[9px] font-bold text-[#8B5CF6] uppercase tracking-[0.2em]">
                            URGENT ACTION
                        </span>
                    </div>
                ) : <div />}

                <div className="flex gap-1.5 opacity-20 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="w-3 h-1 rounded-full bg-[#8B5CF6]/40" />
                    <div className="w-6 h-1 rounded-full bg-[#8B5CF6] shadow-[0_0_15px_#8B5CF6]" />
                </div>
            </div>
        </motion.div>
    );
}


