"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  X as XIcon,
  ChevronDown,
  MousePointer2,
  Layers,
  CheckCircle2,
  XOctagon,
} from "lucide-react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Universal redirect logic for all buttons
  const routeToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    // Outer Canvas
    <div className="min-h-screen bg-[#D1D1D1] p-2 md:p-6 lg:p-8 font-sans selection:bg-[#FF6803] selection:text-white flex flex-col items-center">
    
      {/* INNER FRAME - The Main App Window */}
      <div className="relative w-full max-w-[1800px] bg-[#E3E3E3] rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-white/50">
        {/* STATIC PERSISTENT NAVIGATION */}
        <nav className="sticky top-0 z-[100] w-full px-6 md:px-10 py-4 flex justify-between items-center bg-[#E3E3E3]/90 backdrop-blur-xl border-b border-white/50 rounded-t-[2rem] md:rounded-t-[3rem]">
          <div className="font-bold text-xl md:text-2xl tracking-tight flex items-center gap-2 text-[#1A1A1A]">
            <div className="w-6 h-6 bg-[#FF6803] grid grid-cols-2 gap-[2px] p-[2px] rounded-sm shadow-sm">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
            Shadow Founder
          </div>

          <div className="hidden lg:flex items-center bg-[#C7C7C7]/40 backdrop-blur-md rounded-lg p-1 border border-white/40">
            <a
              href="#mission"
              className="px-5 py-2 rounded-md text-sm font-semibold text-[#1A1A1A] bg-white/60 shadow-sm hover:bg-white transition-colors"
            >
              Home
            </a>
            <a
              href="#architecture"
              className="px-5 py-2 rounded-md text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/40 transition-colors flex items-center gap-1"
            >
              Architecture <ChevronDown size={14} />
            </a>
            <a
              href="#features"
              className="px-5 py-2 rounded-md text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/40 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="px-5 py-2 rounded-md text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/40 transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="hidden lg:flex">
            <button
              onClick={routeToDashboard}
              className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#FF6803] hover:shadow-[0_10px_20px_rgba(255,104,3,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Login / Register
            </button>
          </div>

          <button className="lg:hidden p-2 text-[#1A1A1A]" onClick={toggleMenu}>
            {isMobileMenuOpen ? <XIcon size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* MOBILE MENU WITH SPRING ANIMATION */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute top-[72px] left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl z-[90] flex flex-col gap-2 border border-black/10 lg:hidden"
            >
              {["Mission", "Architecture", "Features", "Pricing"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={toggleMenu}
                    className="text-xl font-black text-[#1A1A1A] border-b border-black/5 py-4 uppercase tracking-tighter hover:text-[#FF6803] transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
              <button
                onClick={routeToDashboard}
                className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl text-sm font-bold mt-4 hover:bg-[#FF6803] transition-colors w-full"
              >
                Login / Register
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* 1. HERO SECTION */}
        <main className="relative w-full min-h-[85vh] flex overflow-hidden pt-8 md:pt-16">
          {/* MASSIVE BACKGROUND TEXT (Hidden on Mobile, Kinetic on PC) */}
          <div className="absolute inset-0 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0">
            <motion.h1
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-[18vw] font-black text-white leading-[0.75] tracking-tighter opacity-[0.85] select-none"
            >
              SHADOW
            </motion.h1>
            <motion.h1
              animate={{ y: [15, -15, 15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-[18vw] font-black text-white leading-[0.75] tracking-tighter opacity-[0.85] select-none ml-[10vw]"
            >
              FOUNDER
            </motion.h1>
          </div>

          {/* FOREGROUND LAYOUT */}
          <div className="absolute inset-0 z-20 px-6 md:px-12 lg:px-16 pt-8 pb-12 flex flex-col lg:flex-row justify-between pointer-events-none">
            {/* LEFT COLUMN: Staggered Typography */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between h-full pointer-events-auto z-30">
              <div>
                <span className="text-[#1A1A1A]/50 font-mono text-xs font-bold tracking-widest block mb-6">
                  AGENTIC AI FOUNDER 🧠
                </span>
                <div className="flex flex-col text-[3.5rem] md:text-6xl xl:text-7xl font-black text-[#1A1A1A] leading-[0.85] tracking-tighter uppercase">
                  <span className="ml-0 md:ml-16">BUILDING</span>
                  <span>STARTUP</span>
                  <span className="ml-0 md:ml-12">PIPELINES</span>
                  <span className="text-[#FF6803] mt-2 drop-shadow-sm">
                    THAT SCALE
                  </span>
                </div>
              </div>

              <div className="mt-12 lg:mt-0">
                <p className="text-[#1A1A1A]/70 text-sm md:text-base font-medium max-w-sm leading-relaxed mb-8">
                  We craft database architectures, agentic workflows, and
                  applications that drive conversions and long-term growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={routeToDashboard}
                    className="bg-gradient-to-b from-[#FF8A3D] to-[#FF6803] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(255,104,3,0.3)] hover:-translate-y-1 transition-transform"
                  >
                    Deploy Engine
                  </button>
                  <button
                    onClick={routeToDashboard}
                    className="bg-white/60 backdrop-blur-sm text-[#1A1A1A] border border-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-white transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Stats Block */}
            <div className="hidden lg:flex w-1/3 flex-col justify-between items-end h-full pointer-events-auto z-30 relative">
              <div className="flex items-start gap-2 text-right mt-12 bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <ArrowUpRight size={32} className="text-[#FF6803] mt-2" />
                <div>
                  <h2 className="text-6xl font-black text-[#1A1A1A] tracking-tighter leading-none">
                    100x{" "}
                    <span className="text-xl font-bold tracking-widest uppercase block mt-2 text-[#1A1A1A]/40">
                      Deploy Speed
                    </span>
                  </h2>
                  <p className="text-[#1A1A1A]/70 text-sm font-medium max-w-[200px] mt-4 leading-relaxed">
                    Our clients see measurable brand growth through strategic
                    logic and digital thinking.
                  </p>
                </div>
              </div>

              <div className="text-right pb-12">
                <p className="text-[#1A1A1A]/70 text-sm font-medium max-w-[250px] leading-relaxed">
                  From the first spark of an idea to worldwide recognition — we
                  partner with brands.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Center Scroll Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30">
            <MousePointer2
              size={20}
              className="text-[#1A1A1A]/40 animate-bounce"
            />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A]/40">
              Scroll to explore
            </span>
          </div>
        </main>

        {/* 2. INFINITE TICKER (Light Theme) */}
        <div className="w-full border-y border-black/5 bg-[#D1D1D1]/30 py-4 overflow-hidden flex whitespace-nowrap mb-16">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
            className="flex gap-12 items-center text-[#1A1A1A]/50 font-bold text-sm uppercase tracking-widest"
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="hover:text-[#FF6803] transition-colors">
                  Powered by Gemini Pro
                </span>{" "}
                <span className="text-[#FF6803]">•</span>
                <span className="hover:text-[#FF6803] transition-colors">
                  Next.js Architecture
                </span>{" "}
                <span className="text-[#FF6803]">•</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* 3. MISSION SECTION */}
        <section id="mission" className="px-6 md:px-16 mb-20 scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#D1D1D1]/50 p-10 md:p-14 rounded-[2rem] border border-white/50 relative overflow-hidden group">
              <XOctagon
                size={40}
                className="text-[#FF6803] mb-8 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-[#1A1A1A]">
                The Flaw
              </h2>
              <p className="text-[#1A1A1A]/70 text-lg font-medium max-w-md leading-relaxed">
                Founders default to writing code. They build complex systems for
                nonexistent problems and ignore unit economics. Emotion clouds
                judgment.
              </p>
            </div>
            <div className="bg-[#1A1A1A] text-white p-10 md:p-14 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              <CheckCircle2
                size={40}
                className="text-[#FF6803] mb-8 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                The Fix
              </h2>
              <p className="text-white/70 text-lg font-medium max-w-md leading-relaxed">
                The Shadow Founder acts as an emotionless, autonomous
                co-founder. It enforces a rigid, data-driven pipeline to
                assemble your MVP.
              </p>
            </div>
          </div>
        </section>

        {/* 4. ARCHITECTURE / BENTO GRID */}
        <section id="architecture" className="px-6 md:px-16 mb-20 scroll-mt-32">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-10 text-center">
            Execution Flow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 p-10 rounded-[2rem] border border-white shadow-sm">
              <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md">
                1
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1A1A1A]">
                Validation
              </h4>
              <p className="text-[#1A1A1A]/70 font-medium leading-relaxed">
                Input your core concept. The agent strips away emotion and
                calculates TAM.
              </p>
            </div>
            <div className="bg-white/60 p-10 rounded-[2rem] border border-white shadow-sm">
              <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md">
                2
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1A1A1A]">
                Assembly
              </h4>
              <p className="text-[#1A1A1A]/70 font-medium leading-relaxed">
                If it passes, the agent shifts to lead engineer, generating
                schemas instantly.
              </p>
            </div>
            <div className="md:col-span-3 lg:col-span-1 bg-gradient-to-br from-[#FF8A3D] to-[#FF6803] p-10 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white text-[#FF6803] rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md">
                  3
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tighter mb-3">
                  Deployment
                </h4>
                <p className="text-white/90 font-medium leading-relaxed">
                  One-click edge deployment. Receive your production-ready
                  Next.js application.
                </p>
              </div>
              <Layers className="absolute -bottom-10 -right-10 w-48 h-48 text-black/10" />
            </div>
          </div>
        </section>

        {/* 5. PRICING */}
        <section id="pricing" className="px-6 md:px-16 mb-24 scroll-mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#D1D1D1]/40 p-10 md:p-12 rounded-[2rem] border border-white/50 flex flex-col">
              <div className="bg-white/60 text-[#1A1A1A] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full w-max mb-6 border border-white">
                Hobbyist
              </div>
              <h3 className="text-5xl font-black tracking-tighter text-[#1A1A1A] mb-4">
                Free
              </h3>
              <p className="text-[#1A1A1A]/60 font-medium mb-8 flex-grow">
                One-time credit to test the engine mechanics.
              </p>
              <button
                onClick={routeToDashboard}
                className="w-full bg-white text-[#1A1A1A] py-4 rounded-xl font-bold uppercase tracking-widest border border-white/60 hover:shadow-md transition-shadow"
              >
                Start Free
              </button>
            </div>
            <div className="bg-[#1A1A1A] p-10 md:p-12 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6803]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-[#FF6803] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full w-max mb-6 shadow-md relative z-10">
                Founder
              </div>
              <h3 className="text-5xl font-black tracking-tighter text-white mb-4 relative z-10">
                $49<span className="text-xl text-white/40">/mo</span>
              </h3>
              <p className="text-white/60 font-medium mb-8 flex-grow relative z-10">
                Unlimited validations and full Next.js generation pipelines.
              </p>
              <button
                onClick={routeToDashboard}
                className="relative z-10 w-full bg-[#FF6803] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_10px_20px_rgba(255,104,3,0.3)] hover:-translate-y-0.5 transition-transform"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </section>

        {/* 6. KINETIC FOOTER */}
        <footer className="w-full bg-[#D1D1D1]/20 border-t border-black/5 flex flex-col pt-12">
          <div className="w-full overflow-hidden border-b border-black/5 pb-12 mb-12">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 15, repeat: Infinity }}
              className="flex whitespace-nowrap"
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center text-[5rem] md:text-[8rem] font-black uppercase tracking-tighter text-[#1A1A1A] px-4"
                >
                  READY TO <span className="text-[#FF6803] ml-4">DEPLOY?</span>{" "}
                  <span className="mx-8 text-[#1A1A1A]/20">•</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="px-6 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <button
              onClick={routeToDashboard}
              className="bg-[#1A1A1A] text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#FF6803] transition-colors flex items-center gap-3 w-full md:w-auto justify-center shadow-xl"
            >
              Initialize System <ArrowUpRight size={20} />
            </button>

            <div className="flex gap-12 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/60 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/30 mb-2">Platform</span>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Engine
                </a>
                <a
                  href="#pricing"
                  className="hover:text-[#FF6803] transition-colors"
                >
                  Pricing
                </a>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Docs
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/30 mb-2">Legal</span>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-16 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 pb-8 pt-8 border-t border-black/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6803] rounded-full animate-pulse"></div>
              © 2026 SHADOW_FOUNDER
            </div>
            <span className="mt-4 md:mt-0">ALL LOGIC. NO FEELINGS.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
