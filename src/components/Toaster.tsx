'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-[#111111]/90 group-[.toaster]:text-zinc-100 group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_0_30px_rgba(0,0,0,0.8)] group-[.toaster]:backdrop-blur-2xl rounded-2xl",
                    description: "group-[.toast]:text-zinc-400",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    success: "group-[.toaster]:border-neon-green/30 group-[.toaster]:text-neon-green",
                    error: "group-[.toaster]:border-cyber-red/30 group-[.toaster]:text-cyber-red",
                    warning: "group-[.toaster]:border-electric-amber/30 group-[.toaster]:text-electric-amber",
                },
            }}
        />
    );
}
