'use client'

import { Search, Bell, Command, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMukaStore } from '@/store/useMukaStore';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [inputValue, setInputValue] = useState('');
    const [isIngesting, setIsIngesting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const { fetchFeed } = useMukaStore();

    const handleIngest = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim() && !isIngesting) {
            setIsIngesting(true);
            try {
                const res = await fetch('/api/ingest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputValue, source: 'manual' }),
                });

                if (res.ok) {
                    setInputValue('');
                    // Refresh the feed immediately to show the new sorted notification
                    await fetchFeed();
                }
            } catch (error) {
                console.error('Ingestion failed:', error);
            } finally {
                setIsIngesting(false);
            }
        }
    };

    const triggerSync = async () => {
        setIsSyncing(true);
        try {
            await fetch('/api/ingest/google', { method: 'POST' });
        } catch (error) {
            console.error('Failed to sync:', error);
        } finally {
            setIsSyncing(false);
        }
    };


    return (
        <nav className="sticky top-0 z-40 w-full flex items-center justify-between px-8 py-5 bg-[#050505]/80 backdrop-blur-2xl border-b-subpixel">
            <div className="flex items-center gap-8 flex-1">
                <div className="text-xs font-extrabold font-sans tracking-[0.3em] uppercase text-zinc-500">
                    MUKA <span className="text-[#8B5CF6]">AI</span>
                </div>

                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#8B5CF6] transition-colors" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleIngest}
                            disabled={isIngesting}
                            placeholder={isIngesting ? "Classifying with AI..." : "Unified Input — type raw text to sort instantly..."}
                            className="w-full bg-[#0A0A0A] border-subpixel group-hover:border-white/20 focus:border-[#8B5CF6]/50 focus:bg-black rounded-xl py-2.5 pl-12 pr-12 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all disabled:opacity-50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border-subpixel bg-[#1A1A1A]">
                            <Command className="w-2.5 h-2.5 text-zinc-500" />
                            <span className="text-xs font-mono text-zinc-500">ENTER</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 ml-8">
                <button
                    onClick={triggerSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-subpixel bg-[#111] hover:bg-[#1A1A1A] transition-colors text-xs font-bold font-sans text-zinc-400 hover:text-white disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin text-[#8B5CF6]")} />
                    {isSyncing ? "SYNCING..." : "SYNC INTEGRATIONS"}
                </button>

                <div className="relative group cursor-pointer p-1">
                    <Bell className="w-5 h-5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border-2 border-black shadow-[0_0_10px_rgba(139,92,246,0.6)] animate-pulse" />
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-[#1A1A1A]">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                        JD
                    </div>
                </div>
            </div>
        </nav>
    );
}
