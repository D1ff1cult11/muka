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
    isFocusModeActive: boolean;
    toggleFocusMode: () => void;
    moveMessage: (messageId: string, sourceZone: ZoneType, destinationZone: ZoneType, destinationIndex: number) => void;
}

const initialInstant: Message[] = [
    { id: 'msg-1', sender: 'Elena V.', content: 'The new protocol deployment is ready for review. Need your sign-off before EOD.', type: 'instant', createdAt: Date.now() },
    { id: 'msg-2', sender: 'Marcus T.', content: 'Synced the telemetry data — latency dropped 34% after the last patch.', type: 'instant', createdAt: Date.now() },
];

const initialScheduled: Message[] = [
    { id: 'msg-3', sender: 'Board meeting', content: 'Q4 Protocol Performance Review', type: 'scheduled', createdAt: Date.now() },
    { id: 'msg-4', sender: 'Engineering', content: 'Sprint Retrospective & Demo', type: 'scheduled', createdAt: Date.now() },
];

const initialBatch: Message[] = [
    { id: 'msg-5', title: 'Weekly Digest — All Teams', content: 'Newsletter: Top 10 JS Tricks', type: 'batch', createdAt: Date.now() },
    { id: 'msg-6', title: 'Compliance Report Bundle', content: 'Steam Sale alert', type: 'batch', createdAt: Date.now() },
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
