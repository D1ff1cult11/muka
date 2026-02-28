'use client'

import { motion } from 'framer-motion'
import { Home, FileText, Activity, ShieldAlert, Settings, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useMukaStore } from '@/store/useMukaStore'

const NAV_ITEMS = [
    { icon: Home, path: '/home', label: 'Dashboard' },
    { icon: FileText, path: '/ledger', label: 'Ledger' },
    { icon: Activity, path: '/telemetry', label: 'Telemetry' },
    { icon: ShieldAlert, path: '/protocols', label: 'Firewall Protocols' },
    { icon: Settings, path: '/settings', label: 'Controller Settings' },
]

export function MasterRail() {
    const { isFocusModeActive, toggleFocusMode } = useMukaStore()
    const pathname = usePathname()
    const router = useRouter()

    return (
        <aside className="w-[72px] h-screen bg-void border-r-[0.5px] border-muka-border flex flex-col items-center py-6 shrink-0 relative z-[60] select-none">
            {/* Logo */}
            <div className="mb-10 relative group cursor-pointer" onClick={() => router.push('/home')}>
                <div className="absolute inset-0 bg-cyber-red/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative w-12 h-12 rounded-[16px] bg-gradient-to-br from-cyber-red to-[#C2185B] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
                    <span className="text-white font-black text-2xl tracking-tighter">M</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-6 items-center flex-1 w-full">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path
                    return (
                        <div
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={cn(
                                "group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 cursor-pointer",
                                isActive ? "bg-surface text-white" : "text-zinc-600 hover:text-zinc-200 hover:bg-surface"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-[-1px] w-[3px] h-8 bg-cyber-red rounded-r-full shadow-[0_0_15px_#FF3366] z-20"
                                />
                            )}

                            <item.icon className={cn(
                                "w-[22px] h-[22px] transition-all duration-500",
                                isActive ? "drop-shadow-[0_0_5px_rgba(255,51,102,0.4)]" : "group-hover:scale-110"
                            )} />

                            {/* Tooltip */}
                            <div className="absolute left-[80px] px-3 py-2 glass-card text-[10px] text-white font-bold tracking-[0.2em] uppercase whitespace-nowrap opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none z-[100]">
                                {item.label}
                            </div>
                        </div>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col items-center gap-6">
                <div
                    onClick={toggleFocusMode}
                    className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-700 relative group",
                        isFocusModeActive
                            ? "bg-cyber-red/10 border border-cyber-red/30 text-cyber-red shadow-[0_0_20px_rgba(255,51,102,0.1)]"
                            : "bg-surface border border-white/5 text-zinc-600 hover:text-zinc-100 hover:bg-zinc-800"
                    )}
                    title={isFocusModeActive ? "Deactivate Shield" : "Activate Focus Shield"}
                >
                    <Shield className={cn("w-5 h-5 transition-transform duration-500", isFocusModeActive && "scale-110 drop-shadow-[0_0_8px_rgba(255,51,102,0.5)]")} />
                    {isFocusModeActive && (
                        <div className="absolute inset-0 rounded-2xl border border-cyber-red/40 animate-ping opacity-10" />
                    )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 overflow-hidden border-subpixel group cursor-pointer">
                    <img
                        src="https://avatar.vercel.sh/muka?size=100"
                        alt="User"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
            </div>
        </aside>
    )
}
