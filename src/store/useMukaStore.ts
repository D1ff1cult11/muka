import { create } from 'zustand';

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
    isWindowActive: boolean;
    toggleFocusMode: () => void;
    moveMessage: (messageId: string, sourceZone: ZoneType, destinationZone: ZoneType, destinationIndex: number) => void;
    fetchFeed: () => Promise<void>;
    dismissMessage: (messageId: string, zone: ZoneType) => void;
    snoozeMessage: (messageId: string, zone: ZoneType) => void;
}

export const useMukaStore = create<MukaState>((set, get) => ({
    instant: [],
    scheduled: [],
    batch: [],
    energySaved: 0,
    focusScore: 100,
    isFocusModeActive: true,
    isWindowActive: false,
    toggleFocusMode: () => set((state) => ({ isFocusModeActive: !state.isFocusModeActive })),

    fetchFeed: async () => {
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
                    instant: (data.instant || []).map((n: any) => ({
                        id: n.id, title: n.sender, content: n.raw_text, sender: n.sender, type: 'instant', createdAt: new Date(n.created_at).getTime()
                    })),
                    scheduled: (data.scheduled || []).map((n: any) => ({
                        id: n.id, title: n.sender, content: n.raw_text, sender: n.sender, type: 'scheduled', createdAt: new Date(n.created_at).getTime()
                    })),
                    batch: (data.batch || []).map((n: any) => ({
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
                            sender: item.source.charAt(0).toUpperCase() + item.source.slice(1),
                            type: item.label.toLowerCase() as ZoneType,
                            createdAt: new Date(item.timestamp).getTime(),
                        };

                        if ([...newInstant, ...newScheduled, ...newBatch].some(m => m.id === msg.id)) return;

                        if (msg.type === 'instant') newInstant.unshift(msg);
                        else if (msg.type === 'scheduled') newScheduled.unshift(msg);
                        else newBatch.unshift(msg);
                    });

                    set({ instant: newInstant, scheduled: newScheduled, batch: newBatch });
                }
            }

            // Sync current stats to DB
            // Telemetry has been removed per user instructions
        } catch (error) {
            console.error('Unified Fetch/Sync Error:', error);
        }
    },

    dismissMessage: async (messageId, zone) => {
        const list = [...get()[zone]];
        const index = list.findIndex(m => m.id === messageId);
        if (index !== -1) {
            list.splice(index, 1);
            set({ [zone]: list });

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
}));
