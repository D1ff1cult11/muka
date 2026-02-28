import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { StatsFooter } from '@/components/StatsFooter';

export default function DashboardPage() {
    return (
        <>
            <Navbar />

            <main className="flex-1 px-8 pb-32">
                <Dashboard />
            </main>

            <div className="fixed bottom-0 right-0 left-20 z-30">
                <StatsFooter />
            </div>
        </>
    );
}

