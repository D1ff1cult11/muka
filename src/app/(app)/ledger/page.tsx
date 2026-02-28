'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Mail, BookOpen, MessageCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ZoneType = 'instant' | 'scheduled' | 'batch';

export interface NotificationRow {
    id: string;
    raw_text: string;
    title: string | null;
    source: string;
    zone: ZoneType;
    created_at: string;
}

export default function LedgerPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [messages, setMessages] = useState<NotificationRow[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchMessages() {
            // Using "notifications" table as requested by the real DB,
            // while fulfilling the prompt's intent for the "messages" integration.
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (data && !error) {
                setMessages(data as NotificationRow[]);
            }
        }
        fetchMessages();
    }, [supabase]);

    const filteredMessages = messages.filter((msg) => {
        const matchFilter = activeFilter === 'All' || msg.source.toLowerCase() === activeFilter.toLowerCase();
        const matchSearch = searchQuery === '' ||
            msg.raw_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (msg.title && msg.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchFilter && matchSearch;
    });

    const getSourceIcon = (source: string) => {
        const norm = source.toLowerCase();
        if (norm === 'gmail') return <Mail className="w-4 h-4 text-zinc-400" />;
        if (norm === 'classroom') return <BookOpen className="w-4 h-4 text-zinc-400" />;
        if (norm === 'whatsapp') return <MessageCircle className="w-4 h-4 text-zinc-400" />;
        return <Shield className="w-4 h-4 text-zinc-400" />;
    };

    const getZoneColor = (zone: string) => {
        if (zone === 'instant') return 'bg-cyber-red shadow-[0_0_8px_rgba(255,42,85,0.6)]'; // Stream (Red)
        if (zone === 'scheduled') return 'bg-electric-amber shadow-[0_0_8px_rgba(255,183,35,0.6)]'; // Timeline (Yellow/Amber)
        if (zone === 'batch') return 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]'; // Vault (Green)
        return 'bg-zinc-500';
    };

    const getZoneLabel = (zone: string) => {
        if (zone === 'instant') return 'Stream';
        if (zone === 'scheduled') return 'Timeline';
        if (zone === 'batch') return 'Vault';
        return 'Unknown';
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const handleCorrection = async (id: string, newZone: ZoneType) => {
        // Optimistic update
        setMessages(messages.map(m => m.id === id ? { ...m, zone: newZone } : m));
        setExpandedId(null);

        // Update DB
        await supabase.from('notifications').update({ zone: newZone }).eq('id', id);

        // Optionally log to feedback API
        fetch('/api/feedback', {
            method: 'POST',
            body: JSON.stringify({ messageId: id, correctedZone: newZone }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(() => { });
    };

    const filters = ['All', 'Gmail', 'Classroom', 'WhatsApp'];

    return (
        <div className="min-h-screen bg-neutral-950 p-6 md:p-12 font-sans overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-10 mt-8">

                {/* 1. The Universal Search Bar */}
                <div className="relative group mx-auto w-full max-w-2xl">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="w-6 h-6 text-zinc-500 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search emails, assignments, or campus chats..."
                        className="w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 focus:border-neutral-600 rounded-full py-5 pl-16 pr-8 text-lg font-medium text-white placeholder-zinc-500 outline-none transition-all shadow-xl hover:shadow-2xl hover:bg-neutral-900"
                    />
                </div>

                {/* 2. The Source Filters */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all ${activeFilter === filter
                                    ? 'bg-neutral-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-neutral-700'
                                    : 'bg-neutral-900/50 text-zinc-500 hover:text-zinc-300 hover:bg-neutral-800/80 border border-transparent'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* 3. The Smart Feed */}
                <div className="space-y-4 max-w-2xl mx-auto pb-20">
                    <AnimatePresence>
                        {filteredMessages.map((msg) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={msg.id}
                                className="bg-neutral-900/40 border border-neutral-800/50 rounded-3xl p-5 hover:bg-neutral-900/80 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-neutral-800/50 rounded-2xl shrink-0">
                                        {getSourceIcon(msg.source)}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                {msg.source}
                                            </span>
                                            <span className="text-xs font-medium text-zinc-600">
                                                {formatTime(msg.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-[15px] leading-relaxed text-zinc-300 line-clamp-2">
                                            {msg.title && <span className="font-semibold text-white mr-2">{msg.title}</span>}
                                            {msg.raw_text}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center h-full pt-1 shrink-0">
                                        <div className={`w-2.5 h-2.5 rounded-full ${getZoneColor(msg.zone)}`} title={getZoneLabel(msg.zone)} />
                                    </div>
                                </div>

                                {/* 4. The Correction Interaction */}
                                <AnimatePresence>
                                    {expandedId === msg.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-6 pb-2 border-t border-neutral-800/50 mt-5">
                                                <p className="text-sm font-medium text-zinc-400 mb-4 text-center">
                                                    Did we sort this wrong?
                                                </p>
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCorrection(msg.id, 'instant'); }}
                                                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-cyber-red/20 text-xs font-bold text-zinc-300 hover:text-cyber-red transition-all border border-neutral-700 hover:border-cyber-red/50 uppercase tracking-wider"
                                                    >
                                                        Stream
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCorrection(msg.id, 'scheduled'); }}
                                                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-electric-amber/20 text-xs font-bold text-zinc-300 hover:text-electric-amber transition-all border border-neutral-700 hover:border-electric-amber/50 uppercase tracking-wider"
                                                    >
                                                        Timeline
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCorrection(msg.id, 'batch'); }}
                                                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neon-green/20 text-xs font-bold text-zinc-300 hover:text-neon-green transition-all border border-neutral-700 hover:border-neon-green/50 uppercase tracking-wider"
                                                    >
                                                        Vault
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {messages.length > 0 && filteredMessages.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-zinc-500 font-medium">No results found for your search.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
