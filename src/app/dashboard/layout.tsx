import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-x-hidden overflow-y-auto bg-[#0F0F0F]">
                {children}
            </div>
        </div>
    );
}
