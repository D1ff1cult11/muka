'use client'

import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Bell,
    Zap,
    Info,
    Save,
    AlertCircle,
    ChevronRight,
    Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DeliveryWindow {
    id: string;
    time: string;
    label: string;
    active: boolean;
}

export default function SchedulePage() {
    const [windows, setWindows] = useState<DeliveryWindow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTime, setNewTime] = useState('12:00');
    const [newLabel, setNewLabel] = useState('');

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const res = await fetch('/api/preferences');
                if (res.ok) {
                    const { data } = await res.json();
                    setWindows(data.delivery_schedule.windows || []);
                }
            } catch (e) {
                console.error('Fetch prefs failed:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchPrefs();
    }, []);

    const toggleWindow = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
        setHasUnsavedChanges(true);
    };

    const addWindow = () => {
        if (!newTime) return;
        const newEntry: DeliveryWindow = {
            id: Math.random().toString(36).substr(2, 9),
            time: newTime,
            label: newLabel || 'Custom Window',
            active: true
        };

        setWindows(prev => {
            const updated = [...prev, newEntry].sort((a, b) => a.time.localeCompare(b.time));
            return updated;
        });

        setHasUnsavedChanges(true);
        setIsModalOpen(false);
        setNewLabel('');
    };

    const removeWindow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setWindows(prev => prev.filter(w => w.id !== id));
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delivery_schedule: { windows } })
            });

            if (res.ok) {
                setHasUnsavedChanges(false);
            }
        } catch (e) {
            console.error('Save failed:', e);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-8 h-8 border-2 border-[#FBBF24]/20 border-t-[#FBBF24] rounded-full animate-spin" />
                <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.2em]">Synchronizing Schedules...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12 pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
                            <Calendar className="w-5 h-5 text-[#8B5CF6]" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono italic">Release Orchestrator</h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">Configure when your non-critical communications bypass the firewall.</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges || isSaving}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                        hasUnsavedChanges
                            ? "bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                            : "bg-[#0A0A0A] text-zinc-600 cursor-not-allowed border border-[#1A1A1A]"
                    )}
                >
                    {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Syncing...' : 'Save Configuration'}
                </motion.button>
            </div>

            {/* Core Explainer Card */}
            <div className="p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-[#151515] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 z-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Clock className="w-24 h-24 text-white" />
                </div>

                <div className="relative z-20 max-w-2xl">
                    <div className="flex items-center gap-2 text-[#8B5CF6] mb-4 text-[10px] font-bold tracking-[0.3em] uppercase">
                        <Zap className="w-3 h-3" /> System Logic
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">How Scheduling Works</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        Communications classified as <span className="text-white font-bold italic underline decoration-[#8B5CF6]">Scheduled</span> are held in a secure queue.
                        They are only released to your dashboard during these active windows to ensure your focus periods remain uninterrupted.
                        Critical <span className="text-red-500 font-bold">Instant</span> notifications always bypass this layer.
                    </p>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-[#1A1A1A]">
                        <Info className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                        <p className="text-[11px] text-zinc-500 leading-tight font-medium">
                            Release times are synchronized with your local device time.
                            If no windows are active, notifications accumulate in the <span className="text-white font-mono">batch</span> queue.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-[#8B5CF6]/5 blur-[60px] rounded-full pointer-events-none" />
            </div>

            {/* Delivery Windows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <AnimatePresence>
                    {windows.map((w, i) => (
                        <motion.div
                            key={w.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => toggleWindow(w.id)}
                            className={cn(
                                "group relative p-6 rounded-3xl border transition-all cursor-pointer overflow-hidden",
                                w.active
                                    ? "bg-[#0D0D0E] border-[#8B5CF6]/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                                    : "bg-transparent border-[#151515] hover:border-zinc-800"
                            )}
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                        w.active ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "bg-[#0A0A0A] text-zinc-600 border border-zinc-900"
                                    )}>
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={cn("text-lg font-bold transition-colors", w.active ? "text-white" : "text-zinc-600")}>
                                            {w.time}
                                        </h3>
                                        <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest uppercase">
                                            {w.label}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                                        w.active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-900 text-zinc-700 border border-zinc-800"
                                    )}>
                                        {w.active ? 'ACTIVE' : 'MUTED'}
                                    </div>
                                    <button
                                        onClick={(e) => removeWindow(w.id, e)}
                                        className="p-1 px-2 rounded-lg bg-red-500/0 hover:bg-red-500/10 text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Active Visual Indicator */}
                            {w.active && (
                                <motion.div
                                    layoutId={`active-${w.id}`}
                                    className="absolute bottom-0 left-0 h-1 bg-[#8B5CF6] w-full shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Window Button */}
                {!isModalOpen ? (
                    <motion.button
                        layoutId="modal"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center p-8 rounded-3xl border border-dashed border-[#1A1A1A] hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/5 group transition-all"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center group-hover:bg-[#8B5CF6]/10 group-hover:border-[#8B5CF6]/30 transition-all">
                                <span className="text-xl text-zinc-600 group-hover:text-[#8B5CF6]">+</span>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Register New Window</span>
                        </div>
                    </motion.button>
                ) : (
                    <motion.div
                        layoutId="modal"
                        className="p-6 rounded-3xl border border-[#8B5CF6]/30 bg-[#0D0D0E] shadow-[0_0_40px_rgba(139,92,246,0.1)] flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-[#8B5CF6] uppercase tracking-widest">New Delivery Node</span>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-600 hover:text-white transition-colors">×</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">Window Time (Local)</p>
                                <input
                                    type="time"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="w-full bg-black border border-[#1A1A1A] rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-[#8B5CF6]/50 transition-all"
                                />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">Node Identifier</p>
                                <input
                                    type="text"
                                    placeholder="e.g. Study Break"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="w-full bg-black border border-[#1A1A1A] rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-zinc-800"
                                />
                            </div>
                            <button
                                onClick={addWindow}
                                className="w-full py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:brightness-110 transition-all"
                            >
                                Activate Node
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Smart Optimization Status */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-[#0A0A0A] border border-[#151515] rounded-[3rem] relative overflow-hidden">
                <div className="w-32 h-32 shrink-0 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#8B5CF6]/10 blur-[30px] rounded-full animate-pulse" />
                    <Play className="w-12 h-12 text-[#8B5CF6] drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-emerald-400 mb-3">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold tracking-widest uppercase font-mono">Optimizer Active</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Attention Flow Control</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">
                        By batching notifications into {windows.filter(w => w.active).length} slots, you prevent focus fragmentation and preserve deep work state.
                    </p>
                    <div className="flex items-center gap-6 justify-center md:justify-start">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Resilience Index</span>
                            <span className="text-lg font-mono font-bold text-white">94/100</span>
                        </div>
                        <div className="w-px h-6 bg-[#1A1A1A]" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Time Recovery</span>
                            <span className="text-lg font-mono font-bold text-emerald-400">+1.2hr/day</span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block absolute right-[-20px] top-[-20px] opacity-5 pointer-events-none">
                    <ChevronRight className="w-48 h-48 text-white rotate-12" />
                </div>
            </div>
        </div>
    );
}
