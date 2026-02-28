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
        color: 'text-cyber-red',
        status: 'active',
        accent: 'bg-cyber-red',
        glow: 'shadow-[0_0_15px_rgba(255,51,102,0.3)]'
    },
    scheduled: {
        icon: <Circle className="w-2.5 h-2.5 fill-current" />,
        color: 'text-electric-amber',
        status: 'queued',
        accent: 'bg-electric-amber',
        glow: 'shadow-[0_0_15px_rgba(255,204,0,0.3)]'
    },
    batch: {
        icon: <Circle className="w-2.5 h-2.5 fill-current" />,
        color: 'text-neon-green',
        status: 'bundles',
        accent: 'bg-neon-green',
        glow: 'shadow-[0_0_15px_rgba(0,255,102,0.3)]'
    }
};

export function ZoneColumn({ id, title, messages, isLockedByDefault = false }: ZoneColumnProps) {
    const [isUnlocked, setIsUnlocked] = useState(!isLockedByDefault);
    const [isPressing, setIsPressing] = useState(false);
    const config = zoneConfig[id];

    return (
        <div className="flex flex-col h-full min-w-0 group/col relative">
            {/* Column Glow */}
            <div className={cn("absolute -top-20 inset-x-0 h-40 blur-[100px] opacity-0 group-hover/col:opacity-10 transition-opacity duration-1000 rounded-full pointer-events-none", config.accent)} />

            {/* Header */}
            <header className="mb-8 flex items-center justify-between px-2 pr-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn("flex items-center gap-3", config.color)}>
                        <div className={cn("w-1 h-5 rounded-full", config.accent, config.glow)} />
                        <h2 className="font-extrabold text-[13px] font-sans tracking-[0.1em] uppercase text-zinc-100 group-hover/col:text-white transition-colors">
                            {title}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest leading-none">
                        {messages.length.toString().padStart(2, '0')}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
                        {config.status}
                    </span>
                </div>
            </header>

            <div className="relative flex-1 px-1">
                {/* Scroll Area / Droppable */}
                <Droppable droppableId={id} isDropDisabled={isLockedByDefault && !isUnlocked}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                "flex flex-col gap-4 h-full transition-all duration-700 rounded-[32px] p-2 pb-40",
                                snapshot.isDraggingOver && "bg-white/[0.02] border border-white/5",
                                isLockedByDefault && !isUnlocked && "blur-[12px] pointer-events-none opacity-40 grayscale"
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-1 inset-y-0 z-20 flex flex-col items-center justify-center gap-6 bg-void/60 backdrop-blur-3xl rounded-[32px] border-subpixel group-hover/col:border-neon-green/20 transition-colors duration-1000"
                    >
                        <div className="relative">
                            {/* Outer Ring */}
                            <svg className="w-24 h-24 absolute -inset-4 transform -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-zinc-900"
                                />
                                {isPressing && (
                                    <motion.circle
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "linear" }}
                                        onAnimationComplete={() => setIsUnlocked(true)}
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="transparent"
                                        strokeDasharray="251.32"
                                        className="text-neon-green drop-shadow-[0_0_8px_#00FF66]"
                                    />
                                )}
                            </svg>

                            <div className="relative w-16 h-16 rounded-full bg-void border-[0.5px] border-muka-border flex items-center justify-center shadow-2xl">
                                <Lock className="w-6 h-6 text-neon-green" />
                            </div>
                        </div>

                        <div className="text-center space-y-1">
                            <p className="text-[12px] font-extrabold font-sans tracking-[0.1em] text-white uppercase">
                                Vault Locked
                            </p>
                            <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
                                Deep Work Protection Active
                            </p>
                        </div>

                        <button
                            onMouseDown={() => setIsPressing(true)}
                            onMouseUp={() => setIsPressing(false)}
                            onMouseLeave={() => setIsPressing(false)}
                            onTouchStart={() => setIsPressing(true)}
                            onTouchEnd={() => setIsPressing(false)}
                            className="relative overflow-hidden px-8 py-3 bg-surface border-subpixel hover:border-neon-green/30 text-zinc-400 hover:text-white text-[10px] font-bold rounded-xl transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]"
                        >
                            <span className="relative z-10">Hold to Override Shield</span>
                            {isPressing && (
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 2, ease: "linear" }}
                                    className="absolute inset-0 bg-neon-green/10"
                                />
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}


