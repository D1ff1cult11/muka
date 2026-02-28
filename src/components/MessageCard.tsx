'use client'

import { Message, ZoneType, useMukaStore } from '@/store/useMukaStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Mail, BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect, memo } from 'react';

interface MessageCardProps {
    message: Message;
    index: number;
    zoneType: ZoneType;
    isDragging?: boolean;
}

export const MessageCard = memo(function MessageCard({ message, zoneType, isDragging }: MessageCardProps) {
    const { dismissMessage } = useMukaStore();
    const isInstant = zoneType === 'instant';
    const isScheduled = zoneType === 'scheduled';
    const isBatch = zoneType === 'batch';

    const [now, setNow] = useState<number>(() => Date.now());
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    const diff = now - message.createdAt;
    const mins = Math.floor(diff / 60000);
    const timeAgo = mins < 1 ? 'JUST NOW' : `${mins}M AGO`;

    const accentColor = isInstant ? 'cyber-red' : isScheduled ? 'electric-amber' : 'neon-green';
    const textAccentClass = isInstant ? 'text-cyber-red' : isScheduled ? 'text-electric-amber' : 'text-neon-green';

    // Parse logic for the raw text returned from API
    const parseContent = (raw: string) => {
        let displayTitle = message.title || 'System Notification';
        let displayBody = raw;
        let pType = message.sender?.toLowerCase().includes('classroom') ? 'classroom' : 'gmail';

        if (raw.startsWith('[GMAIL]')) {
            const parts = raw.split('\n\n');
            displayTitle = parts[0].replace('[GMAIL] ', '');
            displayBody = parts.slice(1).join('\n\n');
            pType = 'gmail';
        } else if (raw.startsWith('[CLASSROOM]')) {
            const parts = raw.split('\n\n');
            displayTitle = parts[0].replace('[CLASSROOM] ', '');
            displayBody = parts.slice(1).join('\n\n');
            pType = 'classroom';
        } else if (raw.startsWith('Subject: ')) {
            const parts = raw.split('\n\n');
            displayTitle = parts[0].replace('Subject: ', '');
            displayBody = parts.slice(1).join('\n\n');
            pType = 'gmail';
        } else if (raw.startsWith('Assignment: ')) {
            const parts = raw.split('\n\n');
            const firstPart = parts[0].split('\nDue: ');
            displayTitle = firstPart[0].replace('Assignment: ', '');
            displayBody = parts.slice(1).join('\n\n');
            pType = 'classroom';
        } else if (raw.startsWith('Announcement: ')) {
            const parts = raw.split('\n\nLink: ');
            displayTitle = 'New Announcement';
            displayBody = parts[0].replace('Announcement: ', '');
            pType = 'classroom';
        }

        return { displayTitle, displayBody, pType };
    };

    const { displayTitle, displayBody, pType } = parseContent(message.content || '');
    const Icon = pType === 'classroom' ? BookOpen : Mail;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ y: -2 }}
            onClick={(e) => {
                if (!isDragging) {
                    setIsExpanded(!isExpanded);
                }
            }}
            className={cn(
                "group relative bg-[#111111]/60 backdrop-blur-2xl border border-white/5 p-5 rounded-[24px] transition-all duration-400 overflow-hidden text-left cursor-pointer",
                isDragging && "opacity-50 scale-95 shadow-none border-white/10",
                !isDragging && `hover:border-${accentColor}/40 hover:bg-[#151515]/80 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)]`
            )}
        >
            {/* Hover Glimmer / Lightning Effect */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-[24px] overflow-hidden mix-blend-screen",
                isInstant ? "bg-[radial-gradient(ellipse_at_top,_rgba(255,51,102,0.15),_transparent_70%)]" :
                    isScheduled ? "bg-[radial-gradient(ellipse_at_top,_rgba(255,204,0,0.15),_transparent_70%)]" :
                        "bg-[radial-gradient(ellipse_at_top,_rgba(0,255,102,0.15),_transparent_70%)]"
            )}>
                <div className={cn(
                    "absolute top-0 left-0 w-full h-[1px] shadow-[0_0_20px_2px]",
                    isInstant ? "bg-cyber-red shadow-cyber-red/50" :
                        isScheduled ? "bg-electric-amber shadow-electric-amber/50" :
                            "bg-neon-green shadow-neon-green/50"
                )} />
            </div>

            {/* Header Telemetry */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={cn("flex items-center justify-center w-5 h-5 rounded-md", isInstant ? "bg-cyber-red/10 text-cyber-red" : isScheduled ? "bg-electric-amber/10 text-electric-amber" : "bg-neon-green/10 text-neon-green")}>
                        <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-medium font-sans text-zinc-300 truncate max-w-[160px]" title={message.sender || 'System'}>
                        {message.sender || 'System'}
                    </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-widest bg-white/5 px-2 py-1 rounded-md whitespace-nowrap">
                    {timeAgo}
                </span>
            </div>

            {/* Content Stage */}
            <div className="mb-5 mt-2 relative z-10">
                <h3 className={cn("text-[15px] font-black tracking-tight leading-[1.3] mb-1.5 transition-colors",
                    !isExpanded && "line-clamp-1",
                    isInstant ? "group-hover:text-cyber-red text-zinc-100" :
                        isScheduled ? "group-hover:text-electric-amber text-zinc-100" :
                            "group-hover:text-neon-green text-zinc-100"
                )}>
                    {displayTitle}
                </h3>
                <motion.div
                    layout="position"
                    className={cn(
                        "text-[15px] leading-[1.6] font-medium transition-colors cursor-pointer",
                        isExpanded ? "text-white" : "text-zinc-300 group-hover:text-white"
                    )}
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                >
                    {message.bluf || displayBody.split(' ').slice(0, 10).join(' ') + '...'}
                </motion.div>

                {/* Expand Hint */}
                <AnimatePresence>
                    {!isExpanded && displayBody.length > 80 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronDown className="w-3 h-3" /> Click to read full context
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Expanded Raw Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                                <p className="text-[12px] leading-[1.6] text-zinc-400 font-normal whitespace-pre-wrap">
                                    {displayBody}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Matrix */}
            <div className="flex items-center justify-between pt-3 border-t-[0.5px] border-white/5">
                <div className="flex items-center gap-2">
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border-[0.5px] text-[8px] font-black uppercase tracking-[0.2em]",
                        isInstant ? "border-cyber-red/20 text-cyber-red bg-cyber-red/5" :
                            isScheduled ? "border-electric-amber/20 text-electric-amber bg-electric-amber/5" :
                                "border-neon-green/20 text-neon-green bg-neon-green/5"
                    )}>
                        <Sparkles className="w-2.5 h-2.5" />
                        {zoneType === 'instant' ? 'AI_INSTANT' : zoneType === 'scheduled' ? 'AI_TIMELINE' : 'AI_VAULT'}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
                    {isInstant ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); dismissMessage(message.id, 'instant'); }}
                            className="px-3 py-1.5 bg-cyber-red hover:bg-[#FF4D7D] text-white text-[9px] font-black rounded-[6px] transition-all active:scale-95 uppercase tracking-widest shadow-lg shadow-cyber-red/20"
                        >
                            Acknowledge
                        </button>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); dismissMessage(message.id, zoneType); }}
                            className="p-1.5 bg-surface hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-[6px] transition-all border-subpixel group/btn z-20"
                        >
                            <Check className={cn("w-3.5 h-3.5", isScheduled ? "group-hover/btn:text-electric-amber" : "group-hover/btn:text-neon-green")} />
                        </button>
                    )}
                </div>
            </div>

            {/* Interactive Accents */}
            <div className={cn(
                "absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-current to-transparent",
                textAccentClass
            )} />
        </motion.div>
    );
});



