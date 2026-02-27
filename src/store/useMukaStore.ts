import { create } from 'zustand';

export type ZoneType = 'instant' | 'scheduled' | 'batch';

export interface Message {
    id: string;
    content: string;
    type: ZoneType;
    createdAt: number;
}

interface MukaState {
    instant: Message[];
    scheduled: Message[];
    batch: Message[];
    energySaved: number;
    isFocusModeActive: boolean;
    toggleFocusMode: () => void;
    moveMessage: (messageId: string, sourceZone: ZoneType, destinationZone: ZoneType, destinationIndex: number) => void;
}

const initialInstant: Message[] = [
    { id: 'msg-1', content: 'URGENT: Server CPU at 98%', type: 'instant', createdAt: Date.now() },
    { id: 'msg-2', content: 'CEO pinged you on Slack', type: 'instant', createdAt: Date.now() },
];

const initialScheduled: Message[] = [
    { id: 'msg-3', content: 'Q3 Board Meeting Sync', type: 'scheduled', createdAt: Date.now() },
    { id: 'msg-4', content: 'Review candidate #439', type: 'scheduled', createdAt: Date.now() },
];

const initialBatch: Message[] = [
    { id: 'msg-5', content: 'Newsletter: Top 10 JS Tricks', type: 'batch', createdAt: Date.now() },
    { id: 'msg-6', content: 'Steam Sale alert', type: 'batch', createdAt: Date.now() },
    { id: 'msg-7', content: 'Weekly screen time report', type: 'batch', createdAt: Date.now() },
];

export const useMukaStore = create<MukaState>((set, get) => ({
    instant: initialInstant,
    scheduled: initialScheduled,
    batch: initialBatch,
    energySaved: 0,
    isFocusModeActive: true,
    toggleFocusMode: () => set((state) => ({ isFocusModeActive: !state.isFocusModeActive })),
    moveMessage: async (messageId, sourceZone, destinationZone, destinationIndex) => {
        const state = get();
        const sourceList = [...state[sourceZone]];
        const destinationList = sourceZone === destinationZone ? sourceList : [...state[destinationZone]];

        const messageIndex = sourceList.findIndex((m) => m.id === messageId);
        if (messageIndex === -1) return;

        const [movedMessage] = sourceList.splice(messageIndex, 1);

        // Update the message type if it moved to a different zone
        const updatedMessage = { ...movedMessage, type: destinationZone };

        if (sourceZone === destinationZone) {
            sourceList.splice(destinationIndex, 0, updatedMessage);
            set({ [sourceZone]: sourceList });
        } else {
            destinationList.splice(destinationIndex, 0, updatedMessage);

            let newEnergySaved = state.energySaved;

            // Moving to batch acts as saving energy
            if (destinationZone === 'batch') {
                newEnergySaved += 15;
            } else if (sourceZone === 'batch') {
                newEnergySaved -= 15;
            }

            set({
                [sourceZone]: sourceList,
                [destinationZone]: destinationList,
                energySaved: newEnergySaved,
            });

            // Fire async feedback
            try {
                fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageId, sourceZone, destinationZone }),
                }).catch(() => {
                    // Silent catch for dummy endpoint
                });
            } catch (_e) {
                // Ignore errors
            }
        }
    },
}));
