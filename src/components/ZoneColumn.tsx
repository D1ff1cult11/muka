import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MessageCard } from './MessageCard';
import { Message, ZoneType } from '@/store/useMukaStore';
import { Lock, Unlock, Circle, Calendar, Inbox } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

interface ZoneColumnProps {
    id: ZoneType;
    title: string;
    messages: Message[];
    isLockedByDefault?: boolean;
}

const zoneConfig: Record<ZoneType, { icon: React.ReactNode, color: string, tier: string, status: string, borderClass: string }> = {
    instant: { icon: <Circle className="w-3 h-3 text-red-500 fill-red-500" />, color: 'text-red-500', tier: 'TIER 1', status: 'active', borderClass: 'border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' },
    scheduled: { icon: <Calendar className="w-4 h-4 text-yellow-500" />, color: 'text-yellow-500', tier: 'TIER 2', status: 'queued', borderClass: 'border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]' },
    batch: { icon: <Inbox className="w-4 h-4 text-emerald-500" />, color: 'text-emerald-500', tier: 'TIER 3', status: 'suppressed', borderClass: 'border-emerald-500/20' }
};

export function ZoneColumn({ id, title, messages, isLockedByDefault = false }: ZoneColumnProps) {
    const [isUnlocked, setIsUnlocked] = useState(!isLockedByDefault);
    const config = zoneConfig[id];

    return (
        <div className={cn("relative flex min-h-[600px] flex-col rounded-xl border bg-[#0A0A0A] p-4 transition-all", config.borderClass)}>
            <div className="mb-6 flex items-center justify-between border-b border-[#222222] pb-4">
                <div className="flex items-center gap-3">
                    {config.icon}
                    <h2 className={cn("font-mono text-xs text-md font-bold tracking-widest uppercase", config.color)}>
                        {title}
                    </h2>
                    <span className="bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded tracking-wider leading-none">
                        {config.tier}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-500">
                        {messages.length} {config.status}
                    </span>
                    {isLockedByDefault && (
                        <button
                            onClick={() => setIsUnlocked(!isUnlocked)}
                            className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                            title={isUnlocked ? "Lock Zone" : "Unlock Zone"}
                        >
                            {isUnlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                        </button>
                    )}
                </div>
            </div>

            {isLockedByDefault && !isUnlocked && (
                <div className="absolute inset-0 z-10 mx-4 mb-4 mt-16 flex flex-col items-center justify-center rounded-lg border border-emerald-900/30 bg-black/60 backdrop-blur-md">
                    <Lock className="mb-2 h-8 w-8 text-emerald-500/50" />
                    <p className="text-sm font-mono text-emerald-500/70">DEEP WORK ZONE LOCKED</p>
                    <button
                        onClick={() => setIsUnlocked(true)}
                        className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-950/30 px-4 py-2 text-xs font-bold text-emerald-400 transition-colors hover:bg-emerald-900/50 hover:text-emerald-300"
                    >
                        OVERRIDE LOCK
                    </button>
                </div>
            )}

            <Droppable droppableId={id} isDropDisabled={isLockedByDefault && !isUnlocked}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                            "flex flex-1 flex-col gap-4 rounded-lg transition-colors border-2",
                            snapshot.isDraggingOver ? "border-dashed border-zinc-800 bg-[#0F0F0F]" : "border-transparent"
                        )}
                    >
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <Draggable key={msg.id} draggableId={msg.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                            }}
                                        >
                                            <MessageCard message={msg} index={index} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </AnimatePresence>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
