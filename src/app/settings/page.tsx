'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Shield, Zap, Bell, User, Cpu } from 'lucide-react'

export default function SettingsPage() {
    const sections = [
        { icon: User, title: 'Profile', desc: 'Manage your attention identity and credentials.' },
        { icon: Shield, title: 'Attention Firewall', desc: 'Configure automatic suppression levels and priority rules.' },
        { icon: Cpu, title: 'AI Orchestration', desc: 'Customise the intelligence sorting and summarization models.' },
        { icon: bell, title: 'Delivery Windows', desc: 'Schedule when batch updates and notifications are delivered.' },
        { icon: Zap, title: 'Protocol Settings', desc: 'Advanced integration and telemetry configuration.' },
    ]

    return (
        <MainLayout>
            <div className="flex flex-col gap-8 py-6 max-w-4xl">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-zinc-400">
                        <SettingsIcon className="w-5 h-5" />
                        <h1 className="font-mono text-xs font-bold tracking-[0.3em] uppercase">System Configuration</h1>
                    </div>
                    <p className="text-zinc-500 text-sm">
                        Fine-tune the MUKA AI engine to align with your cognitive throughput and focus requirements.
                    </p>
                </header>

                <div className="flex flex-col gap-4">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-[#0A0A0A] border border-[#151515] p-6 rounded-2xl hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-[#111] flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-bold text-zinc-200">{section.title}</h3>
                                    <p className="text-xs text-zinc-600 mt-1">{section.desc}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="pt-4 border-t border-[#151515] flex justify-end gap-4">
                    <button className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-colors">DISCARD</button>
                    <button className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors">SAVE CONFIGURATION</button>
                </div>
            </div>
        </MainLayout>
    )
}

const bell = Bell; // Fix for icon naming
