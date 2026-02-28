import { MasterRail } from "@/components/layout/MasterRail";
import { ContextualRail } from "@/components/layout/ContextualRail";
import { TelemetryBar } from "@/components/layout/TelemetryBar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-void font-sans antialiased">
            {/* Primary Rail */}
            <MasterRail />

            {/* Secondary Rail */}
            <ContextualRail />

            {/* Stage */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                <TelemetryBar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
