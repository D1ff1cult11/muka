import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatsFooter } from '@/components/StatsFooter';

export default function DashboardPage() {
    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 relative">
                <Navbar />

                <main className="flex-1 overflow-y-auto px-8 pb-32">
                    <Dashboard />
                </main>

                <div className="fixed bottom-0 right-0 left-20 z-30">
                    <StatsFooter />
                </div>
            </div>
        </div>
    );
}

