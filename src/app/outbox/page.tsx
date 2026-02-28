'use client'

import { useEffect, useState } from 'react';
import { useMukaStore } from '@/store/useMukaStore';
import {
    Send,
    Trash2,
    RefreshCcw,
    CheckCircle2,
    Clock,
    Filter,
    ArrowLeftRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HandledMessage {
    id: string;
    sender: string;
    raw_text: string;
    source: string;
    zone: string;
    is_dismissed: boolean;
    is_snoozed: boolean;
    updated_at: string;
}

export default function OutboxPage() {
    const [messages, setMessages] = useState<HandledMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'dismissed' | 'snoozed'>('all');

    const fetchOutbox = async () => {
        try {
            const res = await fetch('/api/outbox');
            if (res.ok) {
                const { data } = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch outbox:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutbox();
    }, []);

    const filteredMessages = messages.filter(m => {
        const matchesSearch = m.raw_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.sender.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'dismissed' && m.is_dismissed) ||
            (filter === 'snoozed' && m.is_snoozed);
        return matchesSearch && matchesFilter;
    });

    const handleRestore = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'restore' })
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
            }
        } catch (e) {
            console.error('Restore failed:', e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this from archive?')) return;
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete' })
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
            }
        } catch (e) {
            console.error('Delete failed:', e);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
                            <Send className="w-5 h-5 text-[#8B5CF6]" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono italic">Outbox</h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">
                        History of your managed interactions and automated sorting logs.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#8B5CF6] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find handled notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0A0A0A] border border-[#1A1A1A] focus:border-[#8B5CF6]/50 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-300 outline-none w-64 transition-all"
                        />
                    </div>

                    <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-1">
                        {(['all', 'dismissed', 'snoozed'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                                    filter === f ? "bg-[#111] text-white shadow-inner" : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />
                        <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.2em]">Synchronizing Archive...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="border border-dashed border-[#1A1A1A] rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center mb-6 border border-[#1A1A1A]">
                            <Filter className="w-8 h-8 text-zinc-800" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-300 mb-2 uppercase font-mono italic tracking-tight">Silence is golden</h3>
                        <p className="text-zinc-600 text-sm max-w-xs font-medium">No notifications have been processed in this view yet. Your outbox fills as you clear your dashboard.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 gap-1"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredMessages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#0A0A0A]/50 border border-[#151515] hover:border-[#8B5CF6]/30 hover:bg-[#0D0D0E] transition-all rounded-2xl"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                                            msg.is_dismissed
                                                ? "bg-zinc-900 border-zinc-800 text-zinc-600 group-hover:border-emerald-500/50 group-hover:text-emerald-500"
                                                : "bg-[#FBBF24]/5 border-[#FBBF24]/10 text-[#FBBF24]"
                                        )}>
                                            {msg.is_dismissed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>

                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center gap-3 mb-1 justify-start">
                                                <span className="text-[13px] font-bold text-zinc-200 truncate uppercase font-mono">{msg.sender}</span>
                                                <span className="px-2 py-0.5 rounded border border-[#1A1A1A] bg-black text-[8px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
                                                    {msg.source}
                                                </span>
                                                {msg.is_snoozed && (
                                                    <span className="text-[8px] font-bold text-[#FBBF24] uppercase tracking-widest flex items-center gap-1 bg-[#FBBF24]/5 px-1.5 py-0.5 rounded border border-[#FBBF24]/10 font-mono">
                                                        <Clock className="w-2.5 h-2.5" /> SNOOZED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-300 transition-colors text-left font-medium">
                                                {msg.raw_text}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-4 md:mt-0 pl-14 md:pl-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-mono font-bold text-zinc-700 uppercase tracking-widest">Processed On</p>
                                            <p className="text-[11px] font-mono text-zinc-500">{new Date(msg.updated_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="h-8 w-px bg-[#1A1A1A] hidden sm:block" />

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleRestore(msg.id)}
                                                className="p-2 text-zinc-700 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                title="Restore to Inbox"
                                            >
                                                <RefreshCcw className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Permanently Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Bottom Insight */}
            {!loading && filteredMessages.length > 0 && (
                <div className="mt-12 p-6 rounded-3xl border border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-between overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <ArrowLeftRight className="w-5 h-5 text-[#8B5CF6]" />
                        <p className="text-xs font-medium text-zinc-400">
                            You have optimized <span className="text-white font-bold">{messages.length} interactions</span> through the firewall this week.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
