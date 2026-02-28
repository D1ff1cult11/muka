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

    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(Date.now());
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    const diff = now !== null ? now - message.createdAt : 0;
    const mins = Math.floor(diff / 60000);
    const timeAgo = mins < 1 ? 'JUST NOW' : `${mins}M AGO`;

    const accentColor = isInstant ? 'cyber-red' : isScheduled ? 'electric-amber' : 'neon-green';
    const accentClass = isInstant ? 'bg-cyber-red' : isScheduled ? 'bg-electric-amber' : 'bg-neon-green';
    const textAccentClass = isInstant ? 'text-cyber-red' : isScheduled ? 'text-electric-amber' : 'text-neon-green';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ y: -2 }}
            className={cn(
                "group relative glass-card p-4 rounded-[20px] transition-all duration-300 overflow-hidden",
                isDragging && "opacity-40 scale-95 shadow-none",
                !isDragging && `hover:border-${accentColor}/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]`
            )}
        >
            {/* Header Telemetry */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn("w-1 h-4 rounded-full", accentClass)} />
                    <span className="text-[11px] font-extrabold font-sans text-white uppercase tracking-tight">
                        {message.sender || 'SYSTEM_INTERCEPT'}
                    </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-widest">
                    {timeAgo}
                </span>
            </div>

            {/* Content Stage */}
            <div className="mb-4">
                <p className="text-[13px] leading-[1.6] text-zinc-400 font-light group-hover:text-zinc-200 transition-colors">
                    {message.content}
                </p>
            </div>

            {/* Action Matrix */}
            <div className="flex items-center justify-between pt-3 border-t-[0.5px] border-muka-border">
                <div className="flex items-center gap-2">
                    <div className={cn("px-2 py-0.5 rounded-[4px] border-[0.5px] text-[8px] font-black uppercase tracking-[0.2em]",
                        isInstant ? "border-cyber-red/20 text-cyber-red bg-cyber-red/5" :
                            isScheduled ? "border-electric-amber/20 text-electric-amber bg-electric-amber/5" :
                                "border-neon-green/20 text-neon-green bg-neon-green/5"
                    )}>
                        {zoneType === 'instant' ? 'PR_01' : zoneType === 'scheduled' ? 'PR_02' : 'PR_03'}
                    </div>
                    <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                        SC_{Math.floor(Math.random() * 999).toString().padStart(3, '0')}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isInstant ? (
                        <>
                            <button
                                onClick={() => dismissMessage(message.id, 'instant')}
                                className="px-3 py-1.5 bg-cyber-red hover:bg-[#FF4D7D] text-white text-[9px] font-black rounded-[6px] transition-all active:scale-95 uppercase tracking-widest shadow-lg shadow-cyber-red/20"
                            >
                                Acknowledge
                            </button>
                            <button className="px-3 py-1.5 bg-surface hover:bg-zinc-800 text-zinc-400 hover:text-white text-[9px] font-black rounded-[6px] transition-all active:scale-95 uppercase tracking-widest border-subpixel">
                                Open
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => dismissMessage(message.id, zoneType)}
                            className="p-1.5 bg-surface hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-lg transition-all border-subpixel"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Interactive Accents */}
            <div className={cn(
                "absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-current to-transparent",
                textAccentClass
            )} />
        </motion.div>
    );
}



