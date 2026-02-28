'use client'

import { usePathname } from 'next/navigation'
import { Plus, Hash, Ghost, Zap, Bell, ShieldCheck, Archive, Search, Target, Shield, Settings, CheckCircle2 } from 'lucide-react'
import { useMukaStore, ZoneType } from '@/store/useMukaStore'
import { cn } from '@/lib/utils'
import { MessageCard } from '@/components/MessageCard'

import React from 'react';

const CONTEXT_MAP: Record<string, {
    title: string,
    sections: { label: string, colorClassTitle?: string, items: { icon: React.ElementType, label: string, badge?: string, message?: any, zone?: any, colorClass?: string }[] }[]
}> = {
    '/home': {
        title: '',
        sections: []
    },
    '/ledger': {
        title: 'THE_LEDGER',
        sections: [
            {
                label: 'SEARCH FILTERS',
                items: [
                    { icon: Search, label: 'Semantic Search', badge: 'Vector' },
                    { icon: Target, label: 'Strict Filter' },
                ]
            },
            {
                label: 'SOURCES',
                items: [
                    { icon: Hash, label: 'all-logs' },
                    { icon: Hash, label: 'gmail-intercepts' },
                    { icon: Hash, label: 'lms-data' },
                ]
            }
        ]
    },
    '/protocols': {
        title: 'FIREWALL_PROTOCOLS',
        sections: [
            {
                label: 'ACTIVE RULES',
                items: [
                    { icon: Shield, label: 'PR_01_STRICT' },
                    { icon: Shield, label: 'PR_02_BALANCED' },
                    { icon: ShieldCheck, label: 'GLOBAL_BYPASS' },
                ]
            },
            {
                label: 'INFERENCE',
                items: [
                    { icon: Zap, label: 'LATENCY_BUFFER' },
                    { icon: Settings, label: 'PRUNING_CONFIG' },
                ]
            }
        ]
    },
    '/telemetry': {
        title: 'TELEMETRY_ENGINE',
        sections: [
            {
                label: 'REAL-TIME',
                items: [
                    { icon: Zap, label: 'NEURON_SAVED' },
                    { icon: Bell, label: 'SYNC_HEARTBEAT' },
                ]
            }
        ]
    },
    '/settings': {
        title: 'CONTROLLER_SETTINGS',
        sections: [
            {
                label: 'INTEGRATIONS',
                items: [
                    { icon: Hash, label: 'google-workspace' },
                    { icon: Hash, label: 'canvas-lms' },
                    { icon: Hash, label: 'whatsapp-api' },
                ]
            }
        ]
    }
}

export function ContextualRail() {
    const pathname = usePathname()
    const { historyInstant, historyScheduled, historyBatch } = useMukaStore()

    // Dynamically build the configuration for /home to inject history
    const baseConfig = CONTEXT_MAP[pathname] || CONTEXT_MAP['/home'];

    let config = baseConfig;
    if (pathname === '/home') {
        config = {
            ...baseConfig,
            sections: [
                {
                    label: 'INSTANT_HISTORY',
                    colorClassTitle: 'text-cyber-red',
                    items: historyInstant.length > 0
                        ? historyInstant.map(m => ({ icon: CheckCircle2, label: m.title || m.content.substring(0, 20) + '...', badge: '', message: m, zone: 'instant', colorClass: 'text-cyber-red/70 group-hover:text-cyber-red' }))
                        : [{ icon: Ghost, label: 'No recent activity', colorClass: 'text-white/40' }]
                },
                {
                    label: 'TIMELINE_HISTORY',
                    colorClassTitle: 'text-electric-amber',
                    items: historyScheduled.length > 0
                        ? historyScheduled.map(m => ({ icon: CheckCircle2, label: m.title || m.content.substring(0, 20) + '...', badge: '', message: m, zone: 'scheduled', colorClass: 'text-electric-amber/70 group-hover:text-electric-amber' }))
                        : [{ icon: Ghost, label: 'No recent activity', colorClass: 'text-white/40' }]
                },
                {
                    label: 'VAULT_HISTORY',
                    colorClassTitle: 'text-neon-green',
                    items: historyBatch.length > 0
                        ? historyBatch.map(m => ({ icon: CheckCircle2, label: m.title || m.content.substring(0, 20) + '...', badge: '', message: m, zone: 'batch', colorClass: 'text-neon-green/70 group-hover:text-neon-green' }))
                        : [{ icon: Ghost, label: 'No recent activity', colorClass: 'text-white/40' }]
                }
            ]
        };
    }

    return (
        <aside className="w-[240px] h-screen bg-[#080808] border-r-[0.5px] border-muka-border flex flex-col shrink-0 relative z-50 select-none hidden md:flex">
            {/* Header */}
            {config.title && (
                <header className="h-[72px] flex items-center px-6 border-b-[0.5px] border-muka-border">
                    <h2 className="text-[11px] font-extrabold font-sans tracking-[0.2em] text-zinc-400 uppercase">
                        {config.title}
                    </h2>
                </header>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-5">
                {config.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="px-3 flex items-center justify-between group">
                            <span className={cn("text-[10px] font-bold tracking-[0.2em] uppercase", section.colorClassTitle || "text-zinc-600")}>
                                {section.label}
                            </span>
                            <Plus className={cn("w-3 h-3 transition-opacity cursor-pointer hover:text-white", section.colorClassTitle || "text-zinc-600")} />
                        </div>

                        <div className="space-y-[2px]">
                            {section.items.map((item, i) => (
                                item.message ? (
                                    <div key={i} className="mb-2">
                                        <MessageCard
                                            message={item.message}
                                            zoneType={item.zone as ZoneType}
                                            index={i}
                                            isDragging={false}
                                            isHistory={true}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface group transition-colors relative pointer-events-none"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden pr-8">
                                            <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", item.colorClass || "text-zinc-500")} />
                                            <span className={cn("text-[13px] font-medium truncate transition-colors", item.colorClass || "text-zinc-400")}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Status */}
            <footer className="p-4 border-t-[0.5px] border-muka-border bg-surface/[0.5]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-30" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-zinc-200">System Sovereign</p>
                        <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest">Latency: 14ms</p>
                    </div>
                </div>
            </footer>
        </aside>
    )
}
