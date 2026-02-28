'use client'

import { motion } from 'framer-motion';
import { useMukaStore } from '@/store/useMukaStore';

export function StatsFooter() {
    const { energySaved, focusScore, batch } = useMukaStore();

    const stats = [
        { label: 'Focus Points', value: Math.floor(energySaved / 60), unit: 'm', color: 'text-[#BEF264]' },
        { label: 'Focus Score', value: focusScore, unit: '%', color: 'text-white' },
        { label: 'Deep Queue', value: batch.length, color: 'text-zinc-500' },
    ];

    return (
        <footer className="mt-auto border-t border-white/5 bg-muka-black/60 backdrop-blur-2xl px-12 py-8 flex items-center justify-end gap-16 select-none relative z-50">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-start gap-1.5 group cursor-default">
                    <span className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase font-mono group-hover:text-zinc-300 transition-colors">
                        {stat.label}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                        <motion.span
                            key={stat.value}
                            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            className={`text-2xl font-black font-mono tracking-tighter ${stat.color} drop-shadow-sm`}
                        >
                            {stat.value}
                        </motion.span>
                        {stat.unit && (
                            <span className="text-[10px] font-black text-zinc-600 uppercase font-mono tracking-widest">
                                {stat.unit}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </footer>
    );
}
