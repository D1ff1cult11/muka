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
            const newItems: any[] = await res.json();

            if (newItems.length === 0) return;

            const newInstant = [...get().instant];
            const newScheduled = [...get().scheduled];
            const newBatch = [...get().batch];

            newItems.forEach(item => {
                const msg: Message = {
                    id: item.id,
                    title: item.title,
                    content: item.snippet,
                    sender: item.source === 'gmail' ? 'Gmail' : 'Classroom',
                    type: item.label.toLowerCase() as ZoneType,
                    createdAt: new Date(item.timestamp).getTime(),
                };

                if (msg.type === 'instant') newInstant.unshift(msg);
                else if (msg.type === 'scheduled') newScheduled.unshift(msg);
                else newBatch.unshift(msg);
            });

            set({
                instant: newInstant,
                scheduled: newScheduled,
                batch: newBatch,
            });
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
                energySaved: newEnergySaved,
                focusScore: newFocusScore
            });

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
}));
