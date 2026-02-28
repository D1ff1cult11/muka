'use client'

import Link from "next/link";
import { ArrowRight, Shield, Zap, Inbox, Target, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-void text-zinc-100 font-sans selection:bg-cyber-red/30 overflow-x-hidden relative">

      {/* --- Premium Aura Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyber-red/15 blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-neon-green/10 blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-neon-green/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-void/40" />
      </div>

      {/* --- Global Grid Overlay with Fade --- */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_80%,transparent_100%)] opacity-30" />
      </div>

      {/* --- Navbar --- */}
      <nav className="relative z-50 w-full pt-10 px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-red via-cyber-red to-[#C2185B] flex items-center justify-center shadow-[0_0_30px_rgba(255,51,102,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <span className="text-white font-black text-2xl tracking-tighter">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">muka</span>
            <span className="text-[10px] font-bold tracking-[0.4em] text-cyber-red uppercase mt-0.5">Attention Firewall</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 font-heading">
          <Link href="#features" className="hover:text-white transition-all hover:tracking-[0.4em] duration-300">Platform</Link>
          <Link href="#how-it-works" className="hover:text-white transition-all hover:tracking-[0.4em] duration-300">Process</Link>
          <Link href="#benefits" className="hover:text-white transition-all hover:tracking-[0.4em] duration-300">The Shield</Link>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-heading">
            Auth
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full flex flex-col items-center">

        {/* --- Hero Section --- */}
        <section className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-48 lg:pt-40 flex flex-col min-h-screen justify-center items-center overflow-visible">

          <div className="relative z-20 w-full flex flex-col text-center">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#111111]/80 border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl mb-10 mx-auto"
            >
              <div className="w-2 h-2 rounded-full bg-cyber-red animate-ping shadow-[0_0_15px_#FF3366]" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "linear" }}
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-300"
              >
                System Active — V2.4 ALPHA
              </motion.span>
            </motion.div>

            {/* The giant staggered text */}
            <motion.h1
              className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[150px] leading-[0.85] font-extrabold tracking-tighter text-white relative uppercase"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 mb-2"
              >
                Protect
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-zinc-700/80 mb-2"
              >
                Your
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="relative inline-block"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyber-red via-cyber-red to-neon-green">Focus</span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="absolute -bottom-4 left-0 h-1 md:h-2 bg-gradient-to-r from-cyber-red to-neon-green rounded-full"
                />
              </motion.div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-16 max-w-2xl mx-auto space-y-10"
            >
              <div className="flex flex-wrap justify-center gap-x-2">
                {"Fragmented university communication intercepted. Escalate what matters. Batch everything else into the void.".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                    className={cn(
                      "text-sm md:text-lg leading-relaxed uppercase tracking-[0.15em]",
                      word === "Escalate" || word === "matters." ? "text-white font-medium" : "text-zinc-500 font-light"
                    )}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                <Link href="/signup" className="group relative px-10 py-5 rounded-[20px] bg-cyber-red text-white text-xs font-bold shadow-[0_0_40px_rgba(255,51,102,0.3)] hover:shadow-[0_0_60px_rgba(255,51,102,0.5)] hover:scale-[1.02] transition-all flex items-center gap-4 uppercase tracking-[0.2em] active:scale-95 overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Start Protection</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <div className="group px-10 py-5 rounded-[20px] bg-[#111111]/80 border border-white/5 backdrop-blur-2xl text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] hover:bg-[#151515] hover:border-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-3 shadow-2xl">
                  <span className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-neon-green group-hover:shadow-[0_0_10px_#00FF66] transition-all duration-300" />
                  Live Demo
                </div>
              </div>
            </motion.div>

            {/* Floating stats decorative */}
            <div className="absolute top-[10%] left-[5%] md:left-[2%] hidden lg:flex flex-col gap-2 items-start text-left">
              <span className="text-5xl font-extrabold tracking-tighter text-white">+14k</span>
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-bold">Neurons Saved</span>
            </div>

            <div className="absolute bottom-[20%] right-[5%] md:right-[2%] hidden lg:flex flex-col gap-2 items-end text-right">
              <span className="text-5xl font-extrabold tracking-tighter text-neon-green">AI-Locked</span>
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-bold">Absolute Sovereignty</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-zinc-600 uppercase">Scroll to Access</span>
            <div className="w-px h-16 bg-gradient-to-b from-cyber-red to-transparent" />
          </motion.div>
        </section>

        {/* --- Trusted Integrations Strip --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 border-y border-white/5 flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-700 bg-white/[0.01]">
          {[
            { name: "Canvas", icon: Layers, color: "text-cyber-red" },
            { name: "Outlook", icon: Inbox, color: "text-neon-green" },
            { name: "G-Mail", icon: Zap, color: "text-cyber-red" },
            { name: "WhatsApp", icon: Target, color: "text-neon-green" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase group cursor-default">
              <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-125 transition-transform duration-500`} />
              <span className="group-hover:text-white transition-colors">{item.name}</span>
            </div>
          ))}
        </section>

        {/* --- The Shield Zones (Features) --- */}
        <section id="benefits" className="w-full max-w-7xl mx-auto px-6 py-48">
          <div className="flex flex-col items-center mb-32">
            <span className="text-cyber-red text-xs font-bold tracking-[0.6em] uppercase mb-4">Core Architecture</span>
            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-center uppercase mb-10">The Shield</h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyber-red to-neon-green rounded-full shadow-[0_0_20px_#FF3366]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Card 1: Instant Zone */}
            <motion.div
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative bg-[#080808] p-12 rounded-[40px] border-subpixel overflow-hidden h-[500px] flex flex-col shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-12 z-20">
                <div className="w-16 h-16 rounded-3xl bg-cyber-red/10 border border-cyber-red/20 flex items-center justify-center text-cyber-red group-hover:bg-cyber-red group-hover:text-white transition-all duration-500 shadow-xl">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
              </div>
              <div className="mt-auto relative z-20">
                <h3 className="text-3xl font-extrabold mb-6 text-white uppercase tracking-tight">Stream</h3>
                <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-light uppercase tracking-[0.05em]">
                  Emergencies and immediate deadlines bypass the shield. <span className="text-zinc-300 font-medium">Your AI gatekeeper</span> ensures you only break focus for absolute priority.
                </p>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-[100%] h-[100%] rounded-full bg-cyber-red/10 blur-[100px] group-hover:blur-[120px] transition-all duration-1000" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyber-red to-transparent opacity-30" />
            </motion.div>

            {/* Card 2: Timeline */}
            <motion.div
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative bg-[#080808] p-12 rounded-[40px] border-subpixel overflow-hidden h-[500px] flex flex-col shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-12 z-20">
                <div className="w-16 h-16 rounded-3xl bg-electric-amber/10 border border-electric-amber/20 flex items-center justify-center text-electric-amber group-hover:bg-electric-amber group-hover:text-black transition-all duration-500 shadow-xl">
                  <Inbox className="w-8 h-8 fill-current" />
                </div>
              </div>
              <div className="mt-auto relative z-20 text-right">
                <h3 className="text-3xl font-extrabold mb-6 text-white uppercase tracking-tight">Timeline</h3>
                <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-light uppercase tracking-[0.05em]">
                  Non-urgent messages are queued for <span className="text-zinc-300 font-medium">scheduled delivery.</span> Protect your deep work blocks without losing track of your day.
                </p>
              </div>
              <div className="absolute top-[30%] left-[-10%] w-[120%] h-[120%] rounded-full bg-neon-green/5 blur-[100px] group-hover:bg-neon-green/10 transition-all duration-1000" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-neon-green/30 to-transparent" />
            </motion.div>

            {/* Card 3: Vault */}
            <motion.div
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative bg-[#080808] p-12 rounded-[40px] border-subpixel overflow-hidden h-[500px] flex flex-col shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-12 z-20">
                <div className="w-16 h-16 rounded-3xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green group-hover:bg-neon-green group-hover:text-black transition-all duration-500 shadow-xl">
                  <Shield className="w-8 h-8 fill-current" />
                </div>
              </div>
              <div className="mt-auto relative z-20">
                <h3 className="text-3xl font-extrabold mb-6 text-white uppercase tracking-tight">Vault</h3>
                <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-light uppercase tracking-[0.05em]">
                  Campus blasts and casual chatter locked away. <span className="text-zinc-300 font-medium">Low-priority noise</span> is suppressed until you explicitly decide to unlock.
                </p>
              </div>
              <div className="absolute bottom-[-20%] left-[-20%] w-[100%] h-[100%] rounded-full bg-neon-green/10 blur-[100px] group-hover:blur-[120px] transition-all duration-1000" />
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-neon-green to-transparent opacity-30" />
            </motion.div>

          </div>
        </section>

        {/* --- Motivation Section --- */}
        <section className="w-full max-w-6xl mx-auto px-6 py-48 text-center flex flex-col items-center relative">
          <div className="absolute inset-0 bg-cyber-red/5 blur-[160px] rounded-full pointer-events-none" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <QuoteIcon />
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-extrabold leading-[0.9] text-white uppercase mt-16 mb-12 tracking-tighter max-w-4xl">
            Investing your focus is the highest ROI.
          </h2>
          <p className="text-xs text-cyber-red tracking-[1em] uppercase font-bold mb-20 animate-pulse">Alchemical Focus Technology</p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[48px] backdrop-blur-3xl hover:bg-white/[0.04] transition-colors">
              <span className="text-neon-green text-xs font-bold tracking-widest uppercase mb-4 block">// Algorithm</span>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light uppercase tracking-wider">
                Muka is your algorithmic firewall. Every club poster shards your concentration. We <span className="text-white font-medium">ingest, classify, and silence</span> the chaos.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[48px] backdrop-blur-3xl hover:bg-white/[0.04] transition-colors">
              <span className="text-cyber-red text-xs font-bold tracking-widest uppercase mb-4 block">// Sovereignty</span>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light uppercase tracking-wider">
                The modern student is a product of noise. Take back control of your <span className="text-white font-medium">cognitive bandwidth</span> with agentic interception.
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-10 w-full border-t border-white/5 py-32 bg-void">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-20">
            <div className="flex flex-col gap-8 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-zinc-500" />
                </div>
                <span className="text-2xl font-extrabold text-white uppercase tracking-[0.4em]">muka.</span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm font-light uppercase tracking-widest">
                The shield for the modern intellectual. Intercepting the noise since 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Control</span>
                <div className="flex flex-col gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <Link href="#" className="hover:text-cyber-red transition-colors">Shield</Link>
                  <Link href="#" className="hover:text-cyber-red transition-colors">Vault</Link>
                  <Link href="#" className="hover:text-cyber-red transition-colors">Stream</Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Company</span>
                <div className="flex flex-col gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <Link href="#" className="hover:text-neon-green transition-colors">Labs</Link>
                  <Link href="#" className="hover:text-neon-green transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-neon-green transition-colors">Auth</Link>
                </div>
              </div>
              <div className="flex flex-col gap-6 flex-grow-0 min-w-[200px]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 leading-relaxed">
                  Advanced Agentic Research Layer
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  &copy; 2026 MUKA SHIELD LABS <br /> ALL RIGHTS RESERVED
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}

function QuoteIcon() {
  return (
    <div className="w-16 h-16 rounded-full bg-cyber-red/10 flex items-center justify-center text-cyber-red animate-bounce">
      <Sparkles className="w-8 h-8" />
    </div>
  );
}
