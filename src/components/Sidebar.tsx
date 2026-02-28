'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMukaStore } from '@/store/useMukaStore'
import { motion } from 'framer-motion'
import {
    Home,
    Calendar,
    BarChart2,
    Settings,
    Shield,
    Archive,
    Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
    const { isFocusModeActive, toggleFocusMode } = useMukaStore()
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Archive, label: 'Archive', href: '/archive' },
        { icon: Calendar, label: 'Schedule', href: '/schedule' },
        { icon: Bell, label: 'Notifications', href: '/notifications' },
        { icon: BarChart2, label: 'Analytics', href: '/analytics' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ]

    return (
        <aside className="w-20 h-screen border-r border-[#151515] bg-[#050505] flex flex-col items-center py-8 select-none shrink-0 overflow-visible relative z-50">
            {/* Logo Part */}
            <div className="mb-12">
                <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-xl">M</span>
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-6 items-center flex-1">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href
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
                            <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all")} />

                            {/* Tooltip hint */}
                            <div className="absolute left-16 px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 rounded opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap font-mono z-50">
                                {item.label}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Shield / Focus Mode Toggle */}
            <div className="mt-auto flex flex-col items-center gap-6">
                <div
                    onClick={toggleFocusMode}
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 relative group",
                        isFocusModeActive
                            ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-[#111] border border-zinc-800 text-zinc-600 hover:border-zinc-500"
                    )}
                >
                    <Shield className={cn("w-5 h-5 transition-transform", isFocusModeActive && "scale-110")} />
                    {isFocusModeActive && (
                        <div className="absolute inset-0 rounded-full border border-emerald-500/60 animate-ping opacity-20" />
                    )}
                </div>

                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <span className="text-[10px] font-bold">JD</span>
                </div>
            </div>
        </aside>
    )
}
