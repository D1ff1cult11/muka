'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MessageCard } from './MessageCard';
import { Message, ZoneType } from '@/store/useMukaStore';
import { Lock, Unlock, Circle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface ZoneColumnProps {
    id: ZoneType;
    title: string;
    messages: Message[];
    isLockedByDefault?: boolean;
}

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
        icon: <Circle className="w-2.5 h-2.5 fill-current" />,
        color: 'text-[#FBBF24]',
        status: 'queued',
        accent: 'bg-[#FBBF24]',
        glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'
    },
    batch: {
        icon: <Circle className="w-2.5 h-2.5 fill-current" />,
        color: 'text-[#BEF264]',
        status: 'bundles',
        accent: 'bg-[#BEF264]',
        glow: 'shadow-[0_0_15px_rgba(190,242,100,0.3)]'
    }
};

export function ZoneColumn({ id, title, messages, isLockedByDefault = false }: ZoneColumnProps) {
    const [isUnlocked, setIsUnlocked] = useState(!isLockedByDefault);
    const config = zoneConfig[id];

    return (
        <div className="flex flex-col h-full min-w-0 group/col relative">
            {/* Column Glow */}
            <div className={cn("absolute -top-20 inset-x-0 h-40 blur-[100px] opacity-0 group-hover/col:opacity-20 transition-opacity duration-1000 rounded-full pointer-events-none", config.accent)} />

            {/* Header */}
            <header className="mb-8 flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className={cn("flex items-center gap-3", config.color)}>
                        <div className={cn("w-1.5 h-6 rounded-full", config.accent, config.glow)} />
                        <h2 className="font-black text-[12px] font-mono tracking-[0.3em] uppercase text-zinc-100 group-hover/col:text-white transition-colors">
                            {title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-[10px] font-black text-zinc-600 lowercase font-mono tracking-widest">
                            {messages.length} {config.status}
                        </span>
                    </div>
                </div>

                {isLockedByDefault && (
                    <button
                        onClick={() => setIsUnlocked(!isUnlocked)}
                        className={cn(
                            "p-2 rounded-xl transition-all duration-500",
                            isUnlocked
                                ? "bg-white/5 text-zinc-400 hover:text-white"
                                : "bg-muka-lime/10 text-muka-lime hover:bg-muka-lime/20"
                        )}
                    >
                        {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                )}
            </header>

            <div className="relative flex-1 px-1">
                {/* Scroll Area / Droppable */}
                <Droppable droppableId={id} isDropDisabled={isLockedByDefault && !isUnlocked}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                "flex flex-col gap-5 h-full transition-all duration-700 rounded-3xl p-1 pb-40",
                                snapshot.isDraggingOver && "bg-white/[0.02] ring-1 ring-white/5 backdrop-blur-3xl"
                            )}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
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
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-1 inset-y-0 z-20 flex flex-col items-center justify-center gap-6 bg-muka-black/40 rounded-[32px] border border-white/5 group-hover/col:border-muka-lime/20 transition-colors duration-1000"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-muka-lime/20 blur-2xl animate-pulse rounded-full" />
                            <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl">
                                <Lock className="w-6 h-6 text-muka-lime" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] font-black font-mono tracking-[0.3em] text-white uppercase mb-1">
                                Vault Locked
                            </p>
                            <p className="text-[9px] font-bold font-mono tracking-widest text-zinc-600 uppercase">
                                Deep Work Protection Active
                            </p>
                        </div>
                        <button
                            onClick={() => setIsUnlocked(true)}
                            className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-[10px] font-black rounded-xl transition-all shadow-xl active:scale-95 uppercase tracking-widest"
                        >
                            OVERRIDE SHIELD
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

