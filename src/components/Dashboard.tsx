'use client'

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useMukaStore, ZoneType } from '@/store/useMukaStore';
import { ZoneColumn } from './ZoneColumn';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function Dashboard() {
    const { instant, scheduled, batch, moveMessage, fetchFeed, fetchStats, subscribeToNotifications } = useMukaStore();
    const [userId, setUserId] = useState<string | null>(null);

    // Hydration fix for DragDropContext (avoids SSR mismatch)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const supabase = createClient();

        // 1. Get user
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUserId(user.id);
                // 2. Initial fetch
                fetchFeed();
                fetchStats();
            }
        });

        // 3. 30s Polling fallback (mostly for external APIs)
        const interval = setInterval(() => {
            fetchFeed();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchFeed, mounted]);

    useEffect(() => {
        if (!userId) return;

        // 4. Subscribe to real-time DB changes
        const unsubscribe = subscribeToNotifications(userId);
        return () => unsubscribe();
    }, [userId, subscribeToNotifications]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        moveMessage(
            draggableId,
            source.droppableId as ZoneType,
            destination.droppableId as ZoneType,
            destination.index
        );
    };

    if (!mounted) {
        return <div className="min-h-screen bg-void text-zinc-600 flex items-center justify-center font-mono text-[10px] tracking-[0.4em] uppercase">Initializing_Neural_Shield...</div>;
    }

    return (
        <div className="relative w-full h-full py-10 px-6 lg:px-10 overflow-hidden">
            {/* Background Auras */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-red/5 blur-[160px] rounded-full animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-green/5 blur-[160px] rounded-full animate-pulse-slow pointer-events-none" />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 h-full items-start relative z-10 max-w-[1800px] mx-auto">
                    <ZoneColumn id="instant" title="STREAM" messages={instant} />
                    <ZoneColumn id="scheduled" title="TIMELINE" messages={scheduled} />
                    <ZoneColumn id="batch" title="VAULT" messages={batch} isLockedByDefault={true} />
                </div>
            </DragDropContext>
        </div>
    );
}
