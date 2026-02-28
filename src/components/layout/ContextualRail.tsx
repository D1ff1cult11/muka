'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Plus, Hash, Ghost, Zap, Bell, ShieldCheck, Filter, Archive, Search, Target, Shield, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const CONTEXT_MAP: Record<string, {
    title: string,
    sections: { label: string, items: { icon: any, label: string, badge?: string }[] }[]
}> = {
    '/home': {
        title: 'COMMAND_CENTER',
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
    const config = CONTEXT_MAP[pathname] || CONTEXT_MAP['/home']

    return (
        <aside className="w-[240px] h-screen bg-[#080808] border-r-[0.5px] border-muka-border flex flex-col shrink-0 relative z-50 select-none hidden md:flex">
            {/* Header */}
            <header className="h-[72px] flex items-center px-6 border-b-[0.5px] border-muka-border">
                <h2 className="text-[11px] font-extrabold font-sans tracking-[0.2em] text-zinc-400 uppercase">
                    {config.title}
                </h2>
            </header>

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
                                    {item.badge && (
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
