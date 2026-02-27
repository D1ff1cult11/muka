import { Message, ZoneType } from '@/store/useMukaStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Zap } from 'lucide-react';

interface MessageCardProps {
    message: Message;
    index: number;
}

const zoneColors: Record<ZoneType, string> = {
    instant: 'border-[#222222] hover:border-red-900/50 bg-[#161616] text-zinc-100 hover:shadow-[0_0_15px_-3px_rgba(239,68,68,0.1)]',
    scheduled: 'border-[#222222] hover:border-yellow-900/50 bg-[#161616] text-zinc-100 hover:shadow-[0_0_10px_-3px_rgba(234,179,8,0.1)]',
    batch: 'border-[#222222] hover:border-emerald-900/50 bg-[#161616] text-zinc-100 hover:shadow-[0_0_10px_-3px_rgba(16,185,129,0.1)]'
};

const handleColors: Record<ZoneType, string> = {
    instant: 'bg-red-500',
    scheduled: 'bg-yellow-500',
    batch: 'bg-emerald-500'
};

export function MessageCard({ message, index: _index }: MessageCardProps) {
    const isInstant = message.type === 'instant';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'group relative flex flex-col gap-3 rounded-lg border p-4 backdrop-blur-md transition-all',
                zoneColors[message.type]
            )}
        >
            <div className="flex items-start gap-4">
                {/* Drag Handle Indicator */}
                <div className={cn("mt-1.5 h-full w-1 rounded-full", handleColors[message.type])} />

                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-relaxed tracking-wide">
                        {message.content}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            {/* Micro-Action Button Cluster for Instant Zone */}
            {isInstant && (
                <div className="mt-2 flex gap-2 pl-5">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-900/40 px-3 py-1.5 text-xs font-semibold text-red-200 transition-colors hover:bg-red-800/60 hover:text-white border border-red-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        ACKNOWLEDGE
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-100 transition-colors hover:bg-red-500/40 hover:text-white border border-red-500/50">
                        <Zap className="h-3.5 w-3.5" />
                        EXECUTE
                    </button>
                </div>
            )}

            {/* High-tension pulse effect for instant messages */}
            {isInstant && (
                <div className="absolute inset-0 -z-10 rounded-lg bg-red-500/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100 animate-pulse" />
            )}
        </motion.div>
    );
}
