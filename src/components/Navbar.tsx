import { Search, Bell, Settings } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-40 w-full flex items-center justify-between px-8 py-4 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1A1A1A]">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 group-focus-within:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all" />
                    <input
                        type="text"
                        placeholder="Search commands, messages, or files (Cmd+K)"
                        className="w-full bg-[#111111] hover:bg-[#151515] focus:bg-[#0A0A0A] border border-[#222222] focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-8">
                <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-lg hover:bg-[#1A1A1A]">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-lg hover:bg-[#1A1A1A]">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="h-8 w-px bg-[#222222] mx-2" />

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Commander</p>
                        <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">Active</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-900 to-[#111] border border-emerald-500/50 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-md" />
                        <span className="text-xs font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] relative z-10">C</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
