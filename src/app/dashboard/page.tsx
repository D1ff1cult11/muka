import { TelemetryTaskbar } from '@/components/TelemetryTaskbar';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';

export default function DashboardPage() {
    return (
        <main className="min-h-screen font-sans selection:bg-emerald-500/30">
            <Navbar />
            <div className="px-8 pb-8">
                <TelemetryTaskbar />
                <Dashboard />
            </div>
        </main>
    );
}
