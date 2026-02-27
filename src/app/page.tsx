
import Link from "next/link";
import { ArrowRight, Shield, Zap, Inbox, Target, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-slate-50 font-sans selection:bg-orange-500/30 overflow-x-hidden relative">

      {/* --- Abstract Fluid Background (Hero) --- */}
      <div className="absolute top-0 left-0 w-full h-[150vh] overflow-hidden pointer-events-none z-0">
        {/* Top left deep red / orange */}
        <div className="absolute top-[-10%] left-[0%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-red-600/40 to-orange-500/40 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Top right blue */}
        <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-[100%] bg-blue-600/30 blur-[130px] mix-blend-screen" />
        {/* Center glowing orb (Orange/Yellow) */}
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[30vw] max-w-[700px] max-h-[500px] rounded-[100%] bg-gradient-to-r from-orange-400/50 to-amber-500/30 blur-[120px] mix-blend-screen" />
        {/* Sharp core glow behind text */}
        <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full bg-rose-500/40 blur-[90px] mix-blend-plus-lighter" />
      </div>

      {/* --- Navbar --- */}
      <nav className="relative z-50 w-full pt-6 px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-white" />
          <span className="text-xl font-bold tracking-tight text-white">muka</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide uppercase text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Platform</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="#benefits" className="hover:text-white transition-colors">Benefits</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-wide uppercase hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full flex flex-col items-center">

        {/* --- Hero Section --- */}
        <section className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-48 lg:pt-48 flex flex-col min-h-screen">

          <div className="relative z-20 w-full flex flex-col">
            {/* The giant staggered text */}
            <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[140px] leading-[0.85] font-medium tracking-tighter text-white mix-blend-plus-lighter relative">
              <div className="ml-[0%] md:ml-[10%]">protect</div>
              <div className="ml-[30%] md:ml-[50%] text-white/90">your</div>
              <div className="ml-[10%] md:ml-[25%] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">focus</div>
            </h1>

            {/* Floating text left */}
            <div className="absolute top-[40%] left-0 w-48 text-xs text-slate-300 leading-relaxed font-light hidden md:block">
              We intercept fragmented campus communications, empowering you with absolute concentration everywhere.
            </div>

            {/* Floating stats left */}
            <div className="absolute top-[70%] left-[5%] md:left-[10%] flex flex-col gap-1">
              <span className="text-3xl font-light tracking-tight text-white">+14.2k</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">hours of deep work saved</span>
              <div className="w-12 h-[1px] bg-white/20 mt-2 transform rotate-[-45deg] origin-top-left absolute top-0 -left-16" />
            </div>

            {/* Floating stats right */}
            <div className="absolute top-[25%] right-[5%] md:right-[15%] flex flex-col items-end gap-1 text-right">
              <span className="text-3xl font-light tracking-tight text-white">+8,500</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">students use muka</span>
              <div className="w-12 h-[1px] bg-white/20 mt-2 transform rotate-[45deg] origin-top-right absolute top-0 -right-16" />
            </div>

            {/* Floating CTAs Bottom Center */}
            <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2 flex items-center gap-4 mt-20">
              <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-slate-300">
                Cancel the noise
              </div>
              <Link href="/signup" className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 text-black text-xs font-bold shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all flex items-center gap-2">
                Try Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* --- Trusted Integrations Strip --- */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 border-y border-white/5 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
          {/* Abstract logo representation for conceptual tools */}
          <div className="flex items-center gap-3 text-xl font-bold tracking-tighter"><Layers className="w-6 h-6" /> Canvas</div>
          <div className="flex items-center gap-3 text-xl font-bold tracking-tighter"><Inbox className="w-6 h-6" /> Outlook</div>
          <div className="flex items-center gap-3 text-xl font-bold tracking-tighter"><Zap className="w-6 h-6" /> WhatsApp</div>
          <div className="flex items-center gap-3 text-xl font-bold tracking-tighter"><Target className="w-6 h-6" /> Notion</div>
        </section>

        {/* --- Quote / Motivation Section --- */}
        <section className="w-full max-w-4xl mx-auto px-6 py-32 text-center flex flex-col items-center">
          <QuoteIcon />
          <p className="text-2xl md:text-4xl font-light leading-snug text-white/90 mt-8 mb-6">
            &quot;The key is in not spending time, but in investing it.&quot;
          </p>
          <p className="text-sm text-slate-400 tracking-widest uppercase font-semibold">Stephen R. Covey</p>

          <div className="mt-16 max-w-2xl mx-auto">
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Muka is your algorithmic shield. Every time your phone buzzes with a generic club poster, your focus shatters. We read, organize, and silence the junk, giving you your attention back.
            </p>
          </div>
        </section>

        {/* --- Our Benefits (The 3 Zones) --- */}
        <section id="benefits" className="w-full max-w-7xl mx-auto px-6 py-24 mb-32">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-center mb-16">Our Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Instant Zone */}
            <div className="group flex flex-col p-8 rounded-[2rem] bg-[#0A0A0C] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden h-[400px]">
              <div className="absolute top-0 right-0 p-8 z-20">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <div className="mt-auto relative z-20">
                <h3 className="text-2xl font-medium mb-3 text-white">Instant Routing</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  Muka continuously monitors incoming messages via zero-shot NLP to identify emergencies or immediate deadlines, escalating them instantly past the shield.
                </p>
              </div>
              {/* Internal glowing orb */}
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-red-600/10 blur-[80px] group-hover:bg-red-600/20 transition-all duration-700" />
            </div>

            {/* Card 2: Visual Centerpiece (Scheduled/Abstract) */}
            <div className="group flex flex-col p-8 rounded-[2rem] bg-[#0A0A0C] border border-white/5 overflow-hidden relative h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0C] z-10" />
              {/* Massive abstract fluid in the center card */}
              <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-orange-500/30 to-rose-600/30 rounded-full blur-[40px] group-hover:blur-[60px] group-hover:scale-110 transition-all duration-1000 animate-pulse" />

              <div className="relative z-20 text-center mt-auto pb-4">
                <h3 className="text-2xl font-medium mb-3 text-white">AI Classification</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  Expertise in contextual understanding categorizes noise into Scheduled and Batch zones, keeping your cognitive bandwidth pristine.
                </p>
              </div>
            </div>

            {/* Card 3: Batch Zone */}
            <div className="group flex flex-col p-8 rounded-[2rem] bg-[#0A0A0C] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden h-[400px]">
              <div className="absolute top-0 right-0 p-8 z-20">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <div className="mt-auto relative z-20">
                <h3 className="text-2xl font-medium mb-3 text-white">Batch Locking</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  We lock away low-priority casual chats and campus blasts into a low-energy consumption queue for when you are actually free.
                </p>
              </div>
              {/* Internal glowing orb */}
              <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700" />
            </div>

          </div>
        </section>

        {/* --- How It Works --- */}
        <section id="how-it-works" className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-white/5 flex flex-col gap-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">How it works</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Connect your fragmented communication channels once, and let the AI build your personal state of focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[28%] left-[15%] right-[15%] h-[1px] bg-white/10" />

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center font-serif text-2xl relative z-10 mb-6 shadow-xl">
                1
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Connect Inputs</h4>
              <p className="text-sm text-slate-400 leading-relaxed px-4">Sync your unversity email, Canvas LMS, and WhatsApp groups into a single standardized ingestion layer.</p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#111] border border-orange-500/30 text-orange-400 flex items-center justify-center font-serif text-2xl relative z-10 mb-6 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                2
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Zero-Shot Routine</h4>
              <p className="text-sm text-slate-400 leading-relaxed px-4">Our AI classification engine evaluates urgency. Emergencies ping you. Casual chatter is batched safely away.</p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center font-serif text-2xl relative z-10 mb-6 shadow-xl">
                3
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Enter Deep Work</h4>
              <p className="text-sm text-slate-400 leading-relaxed px-4">Close the dashboard and work. Muka acts as your personal Firewall, tracking the hours of focus you save.</p>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="relative z-10 w-full border-t border-white/5 py-12 mt-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-bold text-slate-500">muka.</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            protecting your data with utmost tech
          </p>
        </div>
      </footer>

    </div>
  );
}

function QuoteIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500/50 mb-4">
      <path d="M10 11H6C6 8.23858 8.23858 6 11 6V4C7.13401 4 4 7.13401 4 11V19H11V11ZM20 11H16C16 8.23858 18.23858 6 21 6V4C17.134 4 14 7.13401 14 11V19H21V11Z" fill="currentColor" />
    </svg>
  );
}
