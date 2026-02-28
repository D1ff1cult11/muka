'use client'

import Link from "next/link";
import { ArrowRight, Shield, Zap, Inbox, Target, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-muka-black text-zinc-100 font-sans selection:bg-muka-purple/30 overflow-x-hidden relative">

      {/* --- Premium Aura Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-muka-purple/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-muka-lime/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-muka-amber/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* --- Global Grid Overlay --- */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* --- Navbar --- */}
      <nav className="relative z-50 w-full pt-8 px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muka-purple to-[#6D28D9] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <span className="text-white font-black text-xl tracking-tighter">M</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase font-mono">muka</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 font-mono">
          <Link href="#features" className="hover:text-white transition-colors">Platform</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">Process</Link>
          <Link href="#benefits" className="hover:text-white transition-colors">The Shield</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-mono">
            Auth
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
          >
            Deploy Shield
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full flex flex-col items-center">

        {/* --- Hero Section --- */}
        <section className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-48 lg:pt-48 flex flex-col min-h-[90vh] justify-center">

          <div className="relative z-20 w-full flex flex-col text-center">
            {/* The giant staggered text */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[160px] leading-[0.8] font-black tracking-tighter text-white mix-blend-plus-lighter relative uppercase font-mono italic"
            >
              <div className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">Protect</div>
              <div className="text-zinc-600">Your</div>
              <div className="bg-clip-text text-transparent bg-gradient-to-br from-muka-purple to-muka-lime">Focus</div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-12 max-w-xl mx-auto space-y-8"
            >
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium uppercase tracking-[0.1em]">
                Fragmented university communication intercepted. Escalate what matters. Batch everything else.
              </p>

              <div className="flex items-center justify-center gap-6">
                <Link href="/signup" className="px-8 py-4 rounded-2xl bg-muka-purple text-white text-[11px] font-black shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all flex items-center gap-3 uppercase tracking-widest active:scale-95">
                  Start Protection <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl text-[11px] font-black text-zinc-400 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer">
                  Live Demo
                </div>
              </div>
            </motion.div>

            {/* Floating stats decorative */}
            <div className="absolute top-[10%] left-[5%] md:left-[10%] hidden lg:flex flex-col gap-1 items-start text-left">
              <span className="text-4xl font-black tracking-tighter text-white font-mono italic">+14k</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black font-mono">Hours Saved</span>
            </div>

            <div className="absolute bottom-[10%] right-[5%] md:right-[10%] hidden lg:flex flex-col gap-1 items-end text-right">
              <span className="text-4xl font-black tracking-tighter text-muka-lime font-mono italic">AI-Locked</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black font-mono">Absolute Privacy</span>
            </div>
          </div>
        </section>

        {/* --- Trusted Integrations Strip --- */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20 border-y border-white/5 flex flex-wrap justify-center gap-16 md:gap-32 opacity-40 hover:opacity-100 transition-opacity duration-1000">
          <div className="flex items-center gap-3 text-sm font-black tracking-[0.3em] uppercase font-mono"><Layers className="w-5 h-5 text-muka-purple" /> Canvas</div>
          <div className="flex items-center gap-3 text-sm font-black tracking-[0.3em] uppercase font-mono"><Inbox className="w-5 h-5 text-muka-lime" /> Outlook</div>
          <div className="flex items-center gap-3 text-sm font-black tracking-[0.3em] uppercase font-mono"><Zap className="w-5 h-5 text-muka-amber" /> G-Mail</div>
          <div className="flex items-center gap-3 text-sm font-black tracking-[0.3em] uppercase font-mono"><Target className="w-5 h-5 text-muka-purple" /> WhatsApp</div>
        </section>

        {/* --- The Shield Zones (Features) --- */}
        <section id="benefits" className="w-full max-w-7xl mx-auto px-6 py-40">
          <div className="flex flex-col items-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-center uppercase font-mono italic italic mb-4">The Shield</h2>
            <div className="w-20 h-1 bg-muka-purple rounded-full glow-purple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Card 1: Instant Zone */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative glass-card p-10 rounded-[32px] border border-white/5 overflow-hidden h-[450px] flex flex-col"
            >
              <div className="absolute top-0 right-0 p-10 z-20">
                <div className="w-12 h-12 rounded-2xl bg-muka-purple/10 border border-muka-purple/20 flex items-center justify-center text-muka-purple group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
              </div>
              <div className="mt-auto relative z-20">
                <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight font-mono">Stream</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-semibold uppercase tracking-wide">
                  Emergencies and immediate deadlines bypass the shield. Your AI gatekeeper ensures you only break focus for absolute priority.
                </p>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-muka-purple/10 blur-[80px] group-hover:bg-muka-purple/20 transition-all duration-1000" />
            </motion.div>

            {/* Card 2: Timeline */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative glass-card p-10 rounded-[32px] border border-white/5 overflow-hidden h-[450px] flex flex-col"
            >
              <div className="absolute top-0 right-0 p-10 z-20">
                <div className="w-12 h-12 rounded-2xl bg-muka-amber/10 border border-muka-amber/20 flex items-center justify-center text-muka-amber group-hover:scale-110 transition-transform">
                  <Inbox className="w-6 h-6 fill-current" />
                </div>
              </div>
              <div className="mt-auto relative z-20 text-right">
                <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight font-mono">Timeline</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-semibold uppercase tracking-wide">
                  Non-urgent messages are queued for scheduled delivery. Protect your deep work blocks without losing track of your day.
                </p>
              </div>
              <div className="absolute top-[30%] left-[-10%] w-[100%] h-[100%] rounded-full bg-muka-amber/5 blur-[80px] group-hover:bg-muka-amber/15 transition-all duration-1000" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-muka-amber/30 to-transparent" />
            </motion.div>

            {/* Card 3: Vault */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative glass-card p-10 rounded-[32px] border border-white/5 overflow-hidden h-[450px] flex flex-col"
            >
              <div className="absolute top-0 right-0 p-10 z-20">
                <div className="w-12 h-12 rounded-2xl bg-muka-lime/10 border border-muka-lime/20 flex items-center justify-center text-muka-lime group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 fill-current" />
                </div>
              </div>
              <div className="mt-auto relative z-20">
                <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight font-mono">Vault</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-semibold uppercase tracking-wide">
                  Campus blasts and casual chatter locked away. Low-priority noise is suppressed until you explicitly decide to unlock the vault.
                </p>
              </div>
              <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-muka-lime/10 blur-[80px] group-hover:bg-muka-lime/20 transition-all duration-1000" />
            </motion.div>

          </div>
        </section>

        {/* --- Motivation Section --- */}
        <section className="w-full max-w-4xl mx-auto px-6 py-40 text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-muka-purple/5 blur-[120px] rounded-full pointer-events-none" />
          <QuoteIcon />
          <h2 className="text-3xl md:text-5xl font-black leading-[0.9] text-white uppercase font-mono italic mt-12 mb-8 tracking-tighter">
            Investing your focus is the highest ROI.
          </h2>
          <p className="text-[10px] text-muka-purple tracking-[0.5em] uppercase font-black font-mono">Alchemical Shield Technology</p>

          <div className="mt-20 max-w-2xl mx-auto glass-card p-10 rounded-[40px] border border-white/5">
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-medium uppercase tracking-wider">
              Muka is your algorithmic firewall. Every club poster shards your concentration. We ingest, classify, and silence the chaos.
            </p>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="relative z-10 w-full border-t border-white/5 py-20 bg-muka-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
              <Shield className="w-4 h-4 text-zinc-500" />
            </div>
            <span className="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] font-mono">muka.</span>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 font-mono">
              Advanced Agentic Research Layer
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 font-mono">
              &copy; 2026 MUKA SHIELD LABS
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

function QuoteIcon() {
  return (
    <div className="w-16 h-16 rounded-full bg-muka-purple/10 flex items-center justify-center text-muka-purple animate-bounce">
      <Sparkles className="w-8 h-8" />
    </div>
  );
}
