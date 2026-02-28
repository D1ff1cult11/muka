'use client'

import { usePathname } from 'next/navigation'
import { Plus, Hash, Ghost, Zap, Bell, ShieldCheck, Archive, Search, Target, Shield, Settings, CheckCircle2 } from 'lucide-react'
import { useMukaStore } from '@/store/useMukaStore'

import React from 'react';

const CONTEXT_MAP: Record<string, {
    title: string,
    sections: { label: string, items: { icon: React.ElementType, label: string, badge?: string }[] }[]
}> = {
    '/home': {
        title: '',
        sections: [
            {
                label: 'FILTERS',
                items: [
                    { icon: Zap, label: 'Real-time Stream', badge: 'Active' },
                    { icon: Bell, label: 'Scheduled Feed' },
                    { icon: Ghost, label: 'Suppressed Items' },
                ]
            },
            {
                label: 'CHANNELS',
                items: [
                    { icon: Hash, label: 'global-intercept' },
                    { icon: Hash, label: 'emergency-bypass' },
                    { icon: Hash, label: 'cluster-logs' },
                ]
            },
            {
                label: 'ARCHIVE',
                items: [
                    { icon: Archive, label: 'SENTINEL_DUMP' },
                    { icon: Archive, label: 'PR_01_LOGS' },
                ]
            }
        ]
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
                baseConfig.sections[0], // Keep FILTERS
                {
                    label: 'INSTANT_HISTORY',
                    items: historyInstant.length > 0
                        ? historyInstant.map(m => ({ icon: CheckCircle2, label: m.title || m.content.substring(0, 20) + '...', badge: '' }))
                        : [{ icon: Ghost, label: 'No recent activity' }]
                },
                {
                    label: 'TIMELINE_HISTORY',
                    items: historyScheduled.length > 0
                        ? historyScheduled.map(m => ({ icon: CheckCircle2, label: m.title || m.content.substring(0, 20) + '...', badge: '' }))
                        : [{ icon: Ghost, label: 'No recent activity' }]
                },
                {
                    label: 'VAULT_HISTORY',
                    items: historyBatch.length > 0
                        ? historyBatch.map(m => ({ icon: CheckCircle2, label: m.title || m.content.substring(0, 20) + '...', badge: '' }))
                        : [{ icon: Ghost, label: 'No recent activity' }]
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
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {config.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="px-3 flex items-center justify-between group">
                            <span className="text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase">
                                {section.label}
                            </span>
                            <Plus className="w-3 h-3 text-zinc-600 transition-opacity cursor-pointer hover:text-white" />
                        </div>

                        <div className="space-y-[2px]">
                            {section.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface group cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200" />
                                        <span className="text-[13px] font-medium text-zinc-400 group-hover:text-zinc-200 truncate">
                                            {item.label}
                                        </span>
                                    </div>
                                    {item.badge && item.badge !== '' && (
                                        <span className="text-[9px] font-bold text-cyber-red bg-cyber-red/10 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
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
