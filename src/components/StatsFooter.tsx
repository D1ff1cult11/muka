'use client'

import { motion } from 'framer-motion';

export function StatsFooter() {
    const stats = [
        { label: 'Focus Time Saved', value: '4.7', unit: 'hrs', color: 'text-[#BEF264]' },
        { label: 'Messages Routed', value: '1,284', color: 'text-zinc-300' },
        { label: 'Batch Queue', value: '36', color: 'text-zinc-300' },
    ];

    return (
        <footer className="mt-auto border-t border-[#151515] bg-[#050505]/50 backdrop-blur-md px-8 py-6 flex items-center justify-end gap-12 select-none">
            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase font-mono">
                        {stat.label}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className={`text-xl font-bold font-mono tracking-tight ${stat.color}`}
                        >
                            {stat.value}
                        </motion.span>
                        {stat.unit && (
                            <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono">
                                {stat.unit}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </footer>
    );
}
