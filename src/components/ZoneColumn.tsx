'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MessageCard } from './MessageCard';
import { useMukaStore, Message, ZoneType } from '@/store/useMukaStore';
import { Lock, Unlock, Circle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface ZoneColumnProps {
    id: ZoneType;
    title: string;
    messages: Message[];
    isLockedByDefault?: boolean;
}

export function ZoneColumn({ id, title, messages, isLockedByDefault = false }: ZoneColumnProps) {
    const { isWindowActive } = useMukaStore();
    const isScheduledRelease = id === 'scheduled' && isWindowActive;

    // Auto-unlock scheduled if window is active
    const [isUnlocked, setIsUnlocked] = useState(!isLockedByDefault || isScheduledRelease);

    useEffect(() => {
        if (isScheduledRelease) {
            setIsUnlocked(true);
        } else if (isLockedByDefault) {
            // Keep current local state for batch override, but auto-lock scheduled if window closes?
            // For now, let's just make sure it stays reactive
            if (id === 'scheduled') setIsUnlocked(false);
        }
    }, [isScheduledRelease, isLockedByDefault, id]);

    const zoneConfig: Record<ZoneType, {
        icon: React.ReactNode,
        color: string,
        status: string,
        accent: string,
        glow: string
    }> = {
        instant: {
            icon: <Circle className="w-2.5 h-2.5 fill-current" />,
            color: 'text-[#8B5CF6]',
            status: 'active',
            accent: 'bg-[#8B5CF6]',
            glow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]'
        },
        scheduled: {
            icon: isScheduledRelease ? <Zap className="w-2.5 h-2.5 animate-pulse" /> : <Circle className="w-2.5 h-2.5 fill-current" />,
            color: isScheduledRelease ? 'text-[#8B5CF6]' : 'text-[#FBBF24]',
            status: isScheduledRelease ? 'releasing' : 'queued',
            accent: isScheduledRelease ? 'bg-[#8B5CF6]' : 'bg-[#FBBF24]',
            glow: isScheduledRelease ? 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'
        },
        batch: {
            icon: <Circle className="w-2.5 h-2.5 fill-current" />,
            color: 'text-[#BEF264]',
            status: 'batched',
            accent: 'bg-[#BEF264]',
            glow: 'shadow-[0_0_15px_rgba(190,242,100,0.3)]'
        }
    };

    const config = zoneConfig[id];

    return (
        <div className="flex flex-col h-full min-w-0">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className={cn("flex items-center gap-2", config.color)}>
                        {config.icon}
                        <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
                            {title}
                        </h2>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-600 lowercase font-mono">
                        {messages.length} {config.status}
                    </span>
                </div>

                {(isLockedByDefault || (id === 'scheduled' && !isScheduledRelease)) && (
                    <button
                        onClick={() => setIsUnlocked(!isUnlocked)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-[#111] transition-all"
                    >
                        {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                )}
            </header>

            <div className="relative flex-1">
                {/* Scroll Area / Droppable */}
                <Droppable droppableId={id} isDropDisabled={isLockedByDefault && !isUnlocked}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                "flex flex-col gap-4 h-full transition-all duration-300 rounded-2xl p-1",
                                snapshot.isDraggingOver && "bg-zinc-500/5 ring-1 ring-zinc-800"
                            )}
                        >
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => (
                                    <Draggable key={msg.id} draggableId={msg.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="outline-none"
                                            >
                                                <MessageCard
                                                    message={msg}
                                                    index={index}
                                                    zoneType={id}
                                                    isDragging={snapshot.isDragging}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </AnimatePresence>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Lock Overlay */}
                {isLockedByDefault && !isUnlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#050505]/60 backdrop-blur-sm rounded-2xl border border-[#151515]"
                    >
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-zinc-500" />
                        </div>
                        <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                            Deep Work Shield Active
                        </p>
                        <button
                            onClick={() => setIsUnlocked(true)}
                            className="px-4 py-2 bg-zinc-100 hover:bg-white text-black text-[10px] font-bold rounded-lg transition-all"
                        >
                            OVERRIDE
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

