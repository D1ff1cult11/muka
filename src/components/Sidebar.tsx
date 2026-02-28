'use client'

import { useMukaStore } from '@/store/useMukaStore'
import { motion } from 'framer-motion'
import {
    Home,
    Send,
    Calendar,
    Settings,
    Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Sidebar() {
    const { isFocusModeActive, toggleFocusMode } = useMukaStore()
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Send, label: 'Outbox', href: '/outbox' },
        { icon: Calendar, label: 'Schedule', href: '/schedule' },
        { icon: Settings, label: 'Settings', href: '#' },
    ]

    return (
        <aside className="w-24 h-screen border-r border-white/5 bg-muka-black/80 backdrop-blur-xl flex flex-col items-center py-10 select-none shrink-0 overflow-visible relative z-50">
            {/* Logo Part */}
            <div className="mb-14 relative group">
                <div className="absolute inset-0 bg-muka-purple/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative w-12 h-12 rounded-[18px] bg-gradient-to-br from-muka-purple to-[#6D28D9] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 group-active:scale-95">
                    <span className="text-white font-black text-2xl tracking-tighter">M</span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-6 items-center flex-1">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={i}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 cursor-pointer",
                                isActive ? "bg-[#111111] text-white shadow-inner" : "text-zinc-600 hover:text-zinc-300 hover:bg-[#0A0A0A]"
                            )}
                            title={item.label}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute -left-4 w-1 h-6 bg-[#8B5CF6] rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                />
                            )}
                            <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]")} />

                            {/* Tooltip hint */}
                            <div className="absolute left-16 px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 rounded opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap font-mono z-50">
                                {item.label}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Shield / Focus Mode Toggle */}
            <div className="mt-auto flex flex-col items-center gap-8">
                <div
                    onClick={toggleFocusMode}
                    className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-1000 relative group",
                        isFocusModeActive
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                            : "bg-white/5 border border-white/5 text-zinc-600 hover:text-zinc-100 hover:bg-white/10"
                    )}
                >
                    <Shield className={cn("w-6 h-6 transition-transform duration-700", isFocusModeActive && "scale-110 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]")} />
                    {isFocusModeActive && (
                        <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping opacity-10" />
                    )}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-100 font-bold cursor-pointer hover:bg-zinc-800 transition-all duration-500 shadow-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-muka-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-black z-10 font-heading">JD</span>
                </div>
            </div>
        </aside>
    )
}
