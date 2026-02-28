'use client'

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useMukaStore, ZoneType } from '@/store/useMukaStore';
import { ZoneColumn } from './ZoneColumn';
import { useEffect, useState } from 'react';

export function Dashboard() {
    const { instant, scheduled, batch, moveMessage, fetchFeed, isFocusModeActive } = useMukaStore();

    // Hydration fix for DragDropContext (avoids SSR mismatch)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));

        // Initial fetch
        fetchFeed();

        // 30s Polling
        const interval = setInterval(() => {
            fetchFeed();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchFeed]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        if (isFocusModeActive) return; // Prevent moves during focus

        moveMessage(
            draggableId,
            source.droppableId as ZoneType,
            destination.droppableId as ZoneType,
            destination.index
        );
    };

    if (!mounted) {
        return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Loading Data...</div>;
    }

    return (
        <div className="w-full h-full py-6">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
                    <ZoneColumn id="instant" title="Instant" messages={instant} isLockedByDefault={isFocusModeActive} />
                    <ZoneColumn id="scheduled" title="Scheduled" messages={scheduled} />
                    <ZoneColumn id="batch" title="Batch" messages={batch} isLockedByDefault={true} />
                </div>
            </DragDropContext>
        </div>
    );
}
