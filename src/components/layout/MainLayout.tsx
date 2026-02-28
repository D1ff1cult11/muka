'use client'

import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { StatsFooter } from '@/components/StatsFooter'
import { DeepWorkOverlay } from '@/components/DeepWorkOverlay'

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#0A0A0A] text-zinc-100">
            <DeepWorkOverlay />
            {/* Fixed Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 relative">
                <Navbar />

                <main className="flex-1 px-8 pb-32 overflow-y-auto custom-scrollbar">
                    {children}
                </main>

                <div className="fixed bottom-0 right-0 left-20 z-30 pointer-events-none">
                    <div className="pointer-events-auto">
                        <StatsFooter />
                    </div>
                </div>
            </div>
        </div>
    )
}
