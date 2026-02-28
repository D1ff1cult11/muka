import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { NotificationRow } from '@/types/database';
import { toast } from 'sonner';

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
    historyInstant: Message[];
    historyScheduled: Message[];
    historyBatch: Message[];
    energySaved: number;
    focusScore: number;
    isFocusModeActive: boolean;
    isWindowActive: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    focusTimeLeft: number; // in seconds
    focusDuration: number; // initial duration in seconds
    toggleFocusMode: () => void;
    startFocusSession: (durationMinutes: number) => void;
    stopFocusSession: () => void;
    decrementTimer: () => void;
    moveMessage: (messageId: string, sourceZone: ZoneType, destinationZone: ZoneType, destinationIndex: number) => void;
    fetchFeed: (manual?: boolean) => Promise<void>;
    dismissMessage: (messageId: string, zone: ZoneType) => void;
    snoozeMessage: (messageId: string, zone: ZoneType) => void;
    subscribeToNotifications: (userId: string) => () => void;
}

export const useMukaStore = create<MukaState>((set, get) => ({
    instant: [],
    scheduled: [],
    batch: [],
    historyInstant: [],
    historyScheduled: [],
    historyBatch: [],
    energySaved: 0,
    focusScore: 100,
    isFocusModeActive: false,
    isWindowActive: false,
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    focusTimeLeft: 0,
    focusDuration: 25 * 60, // Default 25 mins

    toggleFocusMode: () => {
        const active = !get().isFocusModeActive;
        set({
            isFocusModeActive: active,
            focusTimeLeft: active ? get().focusDuration : 0
        });
    },

    startFocusSession: (durationMinutes) => {
        const durationSeconds = durationMinutes * 60;
        set({
            isFocusModeActive: true,
            focusDuration: durationSeconds,
            focusTimeLeft: durationSeconds
        });
        toast('Focus Mode Engaged', {
            description: 'Shield active. Deep work session started.',
        });
    },

    stopFocusSession: () => {
        set({ isFocusModeActive: false, focusTimeLeft: 0 });
        toast('Focus Mode Disabled', {
            description: 'Shield deactivated. Standard routing resumed.',
        });
    },

    decrementTimer: () => set((state) => ({
        focusTimeLeft: Math.max(0, state.focusTimeLeft - 1),
        isFocusModeActive: state.focusTimeLeft > 1 ? state.isFocusModeActive : false
    })),

    fetchFeed: async (manual = false) => {
        const { instant, scheduled, batch } = get();
        const cachedIds = [...instant, ...scheduled, ...batch].map(m => m.id);

        try {
            // 1. Fetch Preferences (to check release windows)
            const prefRes = await fetch('/api/preferences');
            let windows: Array<{ time: string, active: boolean }> = [];
            if (prefRes.ok) {
                const { data } = await prefRes.json();
                windows = data.delivery_schedule.windows || [];
            }

            // 2. Load existing notifications from DB first
            const initRes = await fetch('/api/ingest');
            if (initRes.ok) {
                const { data } = await initRes.json();

                // MUKA LOGIC: Filter scheduled items based on active windows
                const now = new Date();
                const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                const isWindowActive = windows.some(w => w.active && w.time === currentTimeStr);

                set({
                    isWindowActive,
                    instant: (data.instant || []).map((n: { id: string, sender: string, raw_text: string, created_at: string }) => ({
                        id: n.id, title: n.sender, content: n.raw_text, sender: n.sender, type: 'instant', createdAt: new Date(n.created_at).getTime()
                    })),
                    scheduled: (data.scheduled || []).map((n: { id: string, sender: string, raw_text: string, created_at: string }) => ({
                        id: n.id, title: n.sender, content: n.raw_text, sender: n.sender, type: 'scheduled', createdAt: new Date(n.created_at).getTime()
                    })),
                    batch: (data.batch || []).map((n: { id: string, sender: string, raw_text: string, created_at: string }) => ({
                        id: n.id, title: n.sender, content: n.raw_text, sender: n.sender, type: 'batch', createdAt: new Date(n.created_at).getTime()
                    })),
                });
            }

            // 3. Fetch new external items (Gmail/Classroom)
            const res = await fetch('/api/feed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cachedIds }),
            });

            if (res.ok) {
                const newItems: Array<{
                    id: string;
                    title?: string;
                    snippet: string;
                    source: string;
                    sender?: string;
                    label: string;
                    timestamp: string | number;
                }> = await res.json();

                if (newItems.length > 0) {
                    const currentState = get();
                    const newInstant = [...currentState.instant];
                    const newScheduled = [...currentState.scheduled];
                    const newBatch = [...currentState.batch];

                    newItems.forEach(item => {
                        const msg: Message = {
                            id: item.id,
                            title: item.title,
                            content: item.snippet,
                            sender: item.sender || (item.source.charAt(0).toUpperCase() + item.source.slice(1)),
                            type: item.label.toLowerCase() as ZoneType,
                            createdAt: new Date(item.timestamp).getTime(),
                        };

                        if ([...newInstant, ...newScheduled, ...newBatch].some(m => m.id === msg.id)) return;

                        if (msg.type === 'instant') newInstant.unshift(msg);
                        else if (msg.type === 'scheduled') newScheduled.unshift(msg);
                        else newBatch.unshift(msg);
                    });

                    set({ instant: newInstant, scheduled: newScheduled, batch: newBatch });
                    if (manual) {
                        toast.success(`Synched ${newItems.length} new signals`);
                    }
                } else if (manual) {
                    toast('Sync Complete', { description: 'All signals are up to date.' });
                }
            } else if (manual) {
                toast.error('Sync failed', { description: 'Failed to authenticate or reach services.' });
            }

            // Sync current stats to DB
            // Telemetry has been removed per user instructions
        } catch (error) {
            console.error('Unified Fetch/Sync Error:', error);
            if (manual) toast.error('Sync error encountered');
        }
    },

    dismissMessage: async (messageId, zone) => {
        const list = [...get()[zone]];
        const index = list.findIndex(m => m.id === messageId);
        if (index !== -1) {
            const removedMsg = list.splice(index, 1)[0];

            // Add to history state
            const historyKey = zone === 'instant' ? 'historyInstant' : zone === 'scheduled' ? 'historyScheduled' : 'historyBatch';
            const currentHistory = [...get()[historyKey]];
            set({
                [zone]: list,
                [historyKey]: [removedMsg, ...currentHistory].slice(0, 50) // Keep last 50 for performance
            });

            toast.success('Signal Acknowledged', { style: { color: zone === 'instant' ? '#FF3366' : '#00FF66' } });
            // Persist to backend
            fetch(`/api/notifications/${messageId}`, {
                method: 'PATCH',
                body: JSON.stringify({ action: 'dismiss' })
            }).catch(console.error);
        }
    },

    snoozeMessage: async (messageId, zone) => {
        const sourceList = [...get()[zone]];
        const scheduledList = [...get().scheduled];

        const index = sourceList.findIndex(m => m.id === messageId);
        if (index !== -1) {
            const [msg] = sourceList.splice(index, 1);
            msg.type = 'scheduled';
            scheduledList.unshift(msg);
            set({ [zone]: sourceList, scheduled: scheduledList });

            // Persist to backend
            const until = new Date();
            until.setHours(until.getHours() + 4); // Default 4hr snooze
            toast('Signal Snoozed', { description: 'Moved to Schedule for later.' });
            fetch(`/api/notifications/${messageId}`, {
                method: 'PATCH',
                body: JSON.stringify({ action: 'snooze', until: until.toISOString() })
            }).catch(console.error);
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

            const newFocusScore = Math.max(0, Math.min(100, state.focusScore + (destinationZone === 'instant' ? -5 : 2)));

            set({
                [sourceZone]: sourceList,
                [destinationZone]: destinationList,
                energySaved: newEnergySaved,
                focusScore: newFocusScore
            });

            toast(`Reclassified to ${destinationZone.toUpperCase()}`);

            // Persist Zone Override to Learning Layer
            fetch(`/api/notifications/${messageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'move',
                    destinationZone,
                    originalZone: sourceZone,
                    rawText: movedMessage.content,
                    confidence: 1.0 // Manual correction is 100% confidence
                }),
            }).catch(console.error);

            // Trigger telemetry sync on change
            // Telemetry has been removed per user instructions
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
                        sender: newItem.sender || (newItem.source === 'gmail' ? 'Gmail' : (newItem.source === 'classroom' ? 'Classroom' : 'Muka')),
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

}));
