'use client'

import { motion } from 'framer-motion'
import { Link2, Globe, Mail, MessageSquare, Book, HardDrive, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const INTEGRATIONS = [
    { name: 'Google Workspace', status: 'Connected', icon: Mail, color: 'text-blue-400', lastSync: '2m ago' },
    { name: 'WhatsApp API', status: 'Syncing', icon: MessageSquare, color: 'text-emerald-400', lastSync: 'Active' },
    { name: 'Canvas LMS', status: 'Disconnected', icon: Book, color: 'text-red-400', lastSync: 'N/A' },
    { name: 'University Mail', status: 'Connected', icon: Globe, color: 'text-purple-400', lastSync: '14m ago' },
    { name: 'Notion API', status: 'Connected', icon: HardDrive, color: 'text-zinc-400', lastSync: '1h ago' },
]

export default function SettingsPage() {
    return (
        <div className="p-10 max-w-6xl space-y-12">
            {/* Header Stage */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">Integration Hub</h1>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mt-1">External Awareness Controllers</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-surface border-subpixel rounded-xl text-[10px] font-black text-white hover:bg-zinc-800 transition-all uppercase tracking-[0.2em]">
                    <Link2 className="w-4 h-4" />
                    Add New Controller
                </button>
            </div>

            {/* Connection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INTEGRATIONS.map((app, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-6 rounded-[24px] border-subpixel group hover:bg-white/[0.03] transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]", app.color)}>
                                    <app.icon className="w-6 h-6" />
                                </div>
                                {app.status === 'Syncing' && (
                                    <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                                )}
                            </div>

                            <h3 className="text-[15px] font-extrabold text-white tracking-tight mb-1">{app.name}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                                    app.status === 'Connected' ? "text-emerald-500 bg-emerald-500" :
                                        app.status === 'Syncing' ? "text-emerald-400 bg-emerald-400" :
                                            "text-zinc-600 bg-zinc-600 shadow-none"
                                )} />
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    app.status === 'Connected' ? "text-emerald-500" :
                                        app.status === 'Syncing' ? "text-emerald-400" :
                                            "text-zinc-600"
                                )}>
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Last Poll</span>
                                <span className="text-[10px] font-mono font-bold text-zinc-400">{app.lastSync}</span>
                            </div>
                        </div>

                        {/* Connection Switch (Visual only) */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all">
                            {app.status === 'Disconnected' ? (
                                <button className="w-full py-2.5 bg-white text-black text-[10px] font-black rounded-xl uppercase tracking-widest">
                                    Authorize Controller
                                </button>
                            ) : (
                                <button className="w-full py-2.5 bg-surface border-subpixel text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Revoke Access
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Security Warning */}
            <div className="p-8 bg-cyber-red/5 border border-cyber-red/20 rounded-[32px] flex items-start gap-6">
                <div className="p-3 bg-cyber-red/10 rounded-2xl text-cyber-red">
                    <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-[15px] font-extrabold text-white tracking-tight mb-2 uppercase">Deep Sync Security Note</h4>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-2xl">
                        MUKA utilizes end-to-end pgvector encryption for all intercepted payloads. Revoking a controller will immediately purge all semi-permanent cache associated with that stream to prevent memory residue.
                    </p>
                </div>
            </div>
        </div>
    )
}
