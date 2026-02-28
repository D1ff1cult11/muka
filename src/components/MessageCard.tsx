'use client'

import { Message, ZoneType, useMukaStore } from '@/store/useMukaStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Lock, Clock, Check, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

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

    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(Date.now());
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Calculate time ago
    const diff = now !== null ? now - message.createdAt : 0;
    const mins = Math.floor(diff / 60000);
    const timeAgo = now === null ? 'Just now' : (mins < 1 ? 'Just now' : `${mins}m ago`);

    const isUrgent = isInstant && (message.title?.toLowerCase().includes('urgent') || message.content.toLowerCase().includes('need'));

    if (isBatch) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                    "group relative glass-card p-6 rounded-[24px] transition-all duration-500 text-left overflow-hidden",
                    isDragging && "opacity-50 scale-95"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-muka-lime/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-muka-lime/20 to-transparent" />

                <div className="flex justify-between items-start mb-4 text-left relative z-10">
                    <div className="text-left">
                        <h4 className="text-[14px] font-bold text-zinc-100 group-hover:text-white transition-colors text-left uppercase tracking-tight">
                            {message.title || "Weekly Digest — All Teams"}
                        </h4>
                        <p className="text-[10px] font-mono font-bold text-zinc-600 mt-1 uppercase tracking-widest text-left">
                            Suppressed Cluster
                        </p>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-muka-lime bg-muka-lime/10 px-2 py-0.5 rounded-full border border-muka-lime/20">AUTO</span>
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-muka-lime hover:bg-[#D9FA9E] text-black rounded-xl text-[10px] font-extrabold transition-all shadow-xl active:scale-95 uppercase tracking-wider"
                    >
                        <Lock className="w-3.5 h-3.5" />
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
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-muka-amber bg-muka-black shrink-0 mt-2 z-10 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                    <div className="w-px flex-1 bg-gradient-to-b from-muka-amber/30 to-transparent" />
                </div>

                <div className="flex-1 pb-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h4 className="text-[13px] font-bold text-zinc-200 group-hover:text-white transition-colors tracking-tight">
                                {message.sender}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-[8px] font-black text-zinc-500 uppercase tracking-widest font-mono">
                                QUEUED
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 font-bold">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="glass-card p-4 rounded-[20px] transition-all duration-300 group-hover:border-muka-amber/20 group-hover:glow-amber">
                        <p className="text-xs text-zinc-400 group-hover:text-zinc-200 line-clamp-2 leading-relaxed font-medium">
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
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={cn(
                "group relative glass-card p-6 rounded-[24px] transition-all duration-500 overflow-hidden",
                isDragging ? "opacity-30 scale-95" : "hover:border-muka-purple/40 hover:glow-purple"
            )}
        >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-muka-purple/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-1000 rounded-full pointer-events-none group-hover:translate-x-[-10%] group-hover:translate-y-[10%]" />
            <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-sm font-bold text-zinc-400 group-hover:border-muka-purple/60 group-hover:text-white transition-all shadow-xl">
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                            {message.sender}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-zinc-600" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
                                {timeAgo}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dismissMessage(message.id, 'instant')}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-muka-purple hover:bg-muka-purple/10 border border-transparent hover:border-muka-purple/20 transition-all active:scale-90"
                        title="Acknowledge"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => snoozeMessage(message.id, 'instant')}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-muka-amber hover:bg-muka-amber/10 border border-transparent hover:border-muka-amber/20 transition-all active:scale-90"
                        title="Snooze"
                    >
                        <Bell className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-[14px] leading-[1.6] text-zinc-400 group-hover:text-zinc-200 transition-colors mb-5 relative z-10 font-medium">
                {message.content}
            </p>

            <div className="flex items-center justify-between relative z-10">
                {isUrgent ? (
                    <div className="inline-flex px-3 py-1 rounded-full bg-muka-purple/10 border border-muka-purple/20">
                        <span className="text-[9px] font-bold text-muka-purple uppercase tracking-[0.2em] font-mono">
                            URGENT ACTION
                        </span>
                    </div>
                ) : <div />}

                <div className="flex gap-2 opacity-20 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                    <div className="w-4 h-1 rounded-full bg-muka-purple/30" />
                    <div className="w-8 h-1 rounded-full bg-muka-purple shadow-[0_0_15px_#8B5CF6]" />
                </div>
            </div>
        </motion.div>
    );
}


