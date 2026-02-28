import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { NotificationRow } from '@/types/database';

export type ZoneType = 'instant' | 'scheduled' | 'batch';

export interface Message {
    id: string;
    title?: string;
    content: string;
    sender?: string;
    type: ZoneType;
    createdAt: number;
}

interface MukaState {
    instant: Message[];
    scheduled: Message[];
    batch: Message[];
    energySaved: number;
    focusScore: number;
    isFocusModeActive: boolean;
    toggleFocusMode: () => void;
    moveMessage: (messageId: string, sourceZone: ZoneType, destinationZone: ZoneType, destinationIndex: number) => void;
    fetchFeed: () => Promise<void>;
    dismissMessage: (messageId: string, zone: ZoneType) => void;
    snoozeMessage: (messageId: string, zone: ZoneType) => void;
    subscribeToNotifications: (userId: string) => () => void;
    fetchStats: () => Promise<void>;
    updateStats: () => Promise<void>;
    sessionStartTime: string;
}

export const useMukaStore = create<MukaState>((set, get) => ({
    instant: [],
    scheduled: [],
    batch: [],
    energySaved: 0,
    focusScore: 100,
    isFocusModeActive: true,
    sessionStartTime: new Date().toISOString(),
    toggleFocusMode: () => set((state) => ({ isFocusModeActive: !state.isFocusModeActive })),

    fetchFeed: async () => {
        const { instant, scheduled, batch } = get();
        const cachedIds = [...instant, ...scheduled, ...batch].map(m => m.id);

        try {
            const res = await fetch('/api/feed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cachedIds }),
            });

            if (!res.ok) return;
            const newItems: Array<{
                id: string;
                title?: string;
                snippet: string;
                source: string;
                label: string;
                timestamp: string | number;
            }> = await res.json();

            if (newItems.length === 0) return;

            const inst: Message[] = [];
            const sched: Message[] = [];
            const bat: Message[] = [];

            newItems.forEach(item => {
                const msg: Message = {
                    id: item.id,
                    title: item.title,
                    content: item.snippet,
                    sender: item.source === 'gmail' ? 'Gmail' : (item.source === 'classroom' ? 'Classroom' : 'Muka'),
                    type: item.label.toLowerCase() as ZoneType,
                    createdAt: new Date(item.timestamp).getTime(),
                };

                if (msg.type === 'instant') inst.push(msg);
                else if (msg.type === 'scheduled') sched.push(msg);
                else bat.push(msg);
            });

            set({
                instant: inst,
                scheduled: sched,
                batch: bat,
            });

            // Trigger telemetry update since we have new counts
            get().updateStats();
        } catch (error) {
            console.error('Failed to fetch feed:', error);
        }
    },

    dismissMessage: (messageId, zone) => {
        const list = [...get()[zone]];
        const index = list.findIndex(m => m.id === messageId);
        if (index !== -1) {
            list.splice(index, 1);
            set({ [zone]: list });
            get().updateStats();
        }
    },

    snoozeMessage: (messageId, zone) => {
        const sourceList = [...get()[zone]];
        const scheduledList = [...get().scheduled];

        const index = sourceList.findIndex(m => m.id === messageId);
        if (index !== -1) {
            const [msg] = sourceList.splice(index, 1);
            msg.type = 'scheduled';
            scheduledList.unshift(msg);
            set({ [zone]: sourceList, scheduled: scheduledList });
        }
    },

    moveMessage: async (messageId, sourceZone, destinationZone, destinationIndex) => {
        const state = get();
        const sourceList = [...state[sourceZone]];
        const destinationList = sourceZone === destinationZone ? sourceList : [...state[destinationZone]];

        const messageIndex = sourceList.findIndex((m) => m.id === messageId);
        if (messageIndex === -1) return;

        const [movedMessage] = sourceList.splice(messageIndex, 1);
        const updatedMessage = { ...movedMessage, type: destinationZone };

        if (sourceZone === destinationZone) {
            sourceList.splice(destinationIndex, 0, updatedMessage);
            set({ [sourceZone]: sourceList });
        } else {
            destinationList.splice(destinationIndex, 0, updatedMessage);

            let newEnergySaved = state.energySaved;
            if (destinationZone === 'batch') newEnergySaved += 15;
            else if (sourceZone === 'batch') newEnergySaved -= 15;

            // Simple focus score heuristic
            const newFocusScore = Math.max(0, Math.min(100, state.focusScore + (destinationZone === 'instant' ? -5 : 2)));

            set({
                [sourceZone]: sourceList,
                [destinationZone]: destinationList,
            });

            get().updateStats();

            // Log correction to learning layer
            fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId,
                    originalZone: sourceZone,
                    correctedZone: destinationZone
                }),
            }).catch(() => { });
        }
    },

    subscribeToNotifications: (userId) => {
        const supabase = createClient();

        const channel = supabase
            .channel('realtime_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newItem = payload.new as NotificationRow;

                    const msg: Message = {
                        id: newItem.id,
                        title: newItem.title ?? 'New Notification',
                        content: newItem.raw_text,
                        sender: newItem.source === 'gmail' ? 'Gmail' : (newItem.source === 'classroom' ? 'Classroom' : 'Muka'),
                        type: newItem.zone,
                        createdAt: new Date(newItem.created_at).getTime(),
                    };

                    set((state) => {
                        // Avoid duplicates
                        const allIds = [...state.instant, ...state.scheduled, ...state.batch].map(m => m.id);
                        if (allIds.includes(msg.id)) return state;

                        if (msg.type === 'instant') return { instant: [msg, ...state.instant] };
                        if (msg.type === 'scheduled') return { scheduled: [msg, ...state.scheduled] };
                        return { batch: [msg, ...state.batch] };
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },

    fetchStats: async () => {
        try {
            const res = await fetch('/api/telemetry');
            const { data } = await res.json();
            if (data?.latest) {
                set({
                    energySaved: data.latest.time_saved_seconds,
                    focusScore: data.latest.focus_score
                });
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    },

    updateStats: async () => {
        const { instant, scheduled, batch, sessionStartTime } = get();
        try {
            await fetch('/api/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_start: sessionStartTime,
                    total_ingested: instant.length + scheduled.length + batch.length,
                    instant_count: instant.length,
                    scheduled_count: scheduled.length,
                    batch_count: batch.length,
                })
            });
            // Immediately refresh stats to show computed server-side values
            get().fetchStats();
        } catch (err) {
            console.error('Failed to update stats:', err);
        }
    }
}));
