"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
  Terminal,
  Database,
  Zap,
  CheckCircle2,
  ChevronRight,
  XOctagon,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  return (
    // Base layout: Light warm gray, Space Grotesk font
    <div className="min-h-screen bg-[#E5E4E2] text-[#1A1A1A] font-sans selection:bg-[#FF6803] selection:text-white p-4 md:p-8 overflow-hidden">
      {/* 1. HERO SECTION (Main Container) */}
      <div className="relative w-full max-w-[1600px] mx-auto bg-[#D9D9D9] border-[8px] md:border-[12px] border-[#E5E4E2] rounded-3xl overflow-hidden min-h-[90vh] shadow-2xl flex flex-col mb-8 md:mb-12">
        {/* NAVBAR */}
        <nav className="relative z-50 w-full flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-6 gap-4 md:gap-0">
          <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6803] grid grid-cols-2 gap-0.5 p-0.5 rounded-sm shadow-sm">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
            Shadow Founder
          </div>

          {/* Pill Navigation */}
          <div className="hidden lg:flex items-center bg-[#C9C9C9]/60 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-sm">
            <a
              href="#mission"
              className="px-6 py-2 rounded-full text-sm font-semibold text-black/60 hover:text-black hover:bg-[#A3A3A3]/20 transition-all"
            >
              Mission
            </a>
            <a
              href="#architecture"
              className="px-6 py-2 rounded-full text-sm font-semibold text-black/60 hover:text-black hover:bg-[#A3A3A3]/20 transition-all"
            >
              Architecture
            </a>
            <a
              href="#features"
              className="px-6 py-2 rounded-full text-sm font-semibold text-black/60 hover:text-black hover:bg-[#A3A3A3]/20 transition-all"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="px-6 py-2 rounded-full text-sm font-semibold text-black/60 hover:text-black hover:bg-[#A3A3A3]/20 transition-all"
            >
              Pricing
            </a>
          </div>

          <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#FF6803] hover:shadow-lg hover:-translate-y-0.5 transition-all w-full md:w-auto">
            Login / Register
          </button>
        </nav>

        {/* HERO CONTENT */}
        <main className="relative flex-grow flex items-center justify-center overflow-hidden">
          {/* MASSIVE BACKGROUND TEXT */}
          <div className="absolute top-[10%] md:top-[20%] left-[-5%] text-white font-black text-[22vw] md:text-[12vw] leading-none tracking-tighter pointer-events-none opacity-90 drop-shadow-md z-0 select-none">
            SHADOW
          </div>
          <div className="absolute bottom-[5%] md:bottom-[10%] right-[-5%] text-white font-black text-[22vw] md:text-[12vw] leading-none tracking-tighter pointer-events-none opacity-90 drop-shadow-md z-0 select-none">
            FOUNDER
          </div>

     

          {/* FRONT CONTENT (Layer 3 - Foreground) */}
          <div className="relative z-20 w-full h-full flex flex-col md:flex-row justify-between items-start px-6 md:px-12 pt-10 pb-20 md:pb-0 pointer-events-none">
            {/* Left Content Column */}
            <div className="max-w-md pointer-events-auto">
              <p className="text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                AGENTIC AI 🧠 <span className="w-8 h-px bg-black"></span>
              </p>
              <h1 className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter uppercase mb-6 text-[#1A1A1A]">
                Building <br />
                Startup <br />
                Experiences <br />
                <span className="text-[#FF6803]">That Scale</span>
              </h1>
              <p className="text-sm font-medium max-w-sm mb-10 text-black/60 leading-relaxed bg-white/30 md:bg-transparent p-3 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none">
                We craft database architectures, agentic workflows, and Next.js
                applications that drive conversions and long-term growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-b from-[#FF8A3D] to-[#FF6803] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgba(255,104,3,0.39)] hover:translate-y-[-2px] hover:shadow-[0_6px_20px_0_rgba(255,104,3,0.5)] transition-all">
                  Get Started
                </button>
                <button className="bg-[#B3B3B3] text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#A3A3A3] hover:-translate-y-0.5 transition-all">
                  Documentation
                </button>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="flex flex-col items-start md:items-end pointer-events-auto mt-12 md:mt-0 w-full md:w-auto">
              <div className="text-left md:text-right mb-16 bg-white/40 md:bg-transparent p-5 md:p-0 rounded-2xl backdrop-blur-md md:backdrop-blur-none border border-white/20 md:border-none w-full md:w-auto">
                <h3 className="text-4xl md:text-5xl font-black flex items-center justify-start md:justify-end gap-2 text-[#1A1A1A]">
                  <ArrowUpRight size={40} className="text-[#666666]" />
                  100x{" "}
                  <span className="text-xl text-[#666666] tracking-widest mt-4">
                    SPEED
                  </span>
                </h3>
                <p className="text-xs font-medium max-w-[200px] mt-4 text-black/60 leading-relaxed text-left md:text-right">
                  Our clients see measurable deployment speed through strategic
                  AI logic and autonomous workflows.
                </p>
              </div>

              {/* Social / Tool Bar */}
              <div className="flex flex-row md:flex-col gap-4 bg-[#C9C9C9]/50 backdrop-blur-md p-3 rounded-2xl border border-white/40 md:mt-32 w-full md:w-auto justify-center shadow-lg">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center hover:bg-white hover:text-[#FF6803] hover:-translate-y-1 transition-all shadow-sm"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center hover:bg-white hover:text-[#FF6803] hover:-translate-y-1 transition-all shadow-sm"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center hover:bg-white hover:text-[#FF6803] hover:-translate-y-1 transition-all shadow-sm"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 2. INFINITE TICKER */}
      <div className="w-full max-w-[1600px] mx-auto bg-[#1A1A1A] rounded-2xl py-4 overflow-hidden flex whitespace-nowrap mb-8 md:mb-12 shadow-xl">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          className="flex gap-12 items-center text-white/80 font-bold text-sm uppercase tracking-widest"
        >
          <span>Powered by Gemini Pro</span>{" "}
          <span className="text-[#FF6803]">/</span>
          <span>Next.js Architecture</span>{" "}
          <span className="text-[#FF6803]">/</span>
          <span>MongoDB Native</span> <span className="text-[#FF6803]">/</span>
          <span>Agentic Workflows</span>{" "}
          <span className="text-[#FF6803]">/</span>
          <span>Powered by Gemini Pro</span>{" "}
          <span className="text-[#FF6803]">/</span>
          <span>Next.js Architecture</span>{" "}
          <span className="text-[#FF6803]">/</span>
          <span>MongoDB Native</span> <span className="text-[#FF6803]">/</span>
          <span>Agentic Workflows</span>
        </motion.div>
      </div>

      {/* 3. MISSION / PROBLEM STATEMENT (Boxed Cards) */}
      <section
        id="mission"
        className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12"
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="bg-[#D9D9D9] p-8 md:p-12 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden group"
        >
          <XOctagon size={40} className="text-[#FF6803] mb-6" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-[#1A1A1A]">
            The Problem
          </h2>
          <p className="text-[#1A1A1A]/70 font-medium leading-relaxed max-w-md">
            Founders default to writing code. They build complex systems for
            nonexistent problems and ignore unit economics. Emotion clouds
            judgment, leading to products no one wants.
          </p>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-[#1A1A1A] text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden group"
        >
          <CheckCircle2 size={40} className="text-[#FF6803] mb-6" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">
            Our Solution
          </h2>
          <p className="text-white/70 font-medium leading-relaxed max-w-md">
            The Shadow Founder acts as an emotionless, autonomous co-founder. It
            enforces a rigid, data-driven pipeline. If the idea passes
            validation, it acts as lead engineer and writes your MVP.
          </p>
        </motion.div>
      </section>

      {/* 4. ARCHITECTURE (Bento Grid) */}
      <section
        id="architecture"
        className="max-w-[1600px] mx-auto mb-8 md:mb-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#D9D9D9] p-8 md:p-10 rounded-3xl shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-white text-[#FF6803] flex items-center justify-center font-black text-xl rounded-xl mb-6 shadow-sm">
              1
            </div>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1A1A1A]">
              The Pitch
            </h4>
            <p className="font-medium text-[#1A1A1A]/60 text-sm leading-relaxed">
              Input your core concept. The agent strips away emotion and
              calculates your Total Addressable Market using live search
              metrics.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-[#FF6803] text-white flex items-center justify-center font-black text-xl rounded-xl mb-6 shadow-sm">
              2
            </div>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1A1A1A]">
              Validation
            </h4>
            <p className="font-medium text-[#1A1A1A]/60 text-sm leading-relaxed">
              We scrape competitors and output a strict 0-100 score. If it
              fails, we tell you why. Ignore it at your own risk.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#FF6803] text-white p-8 md:p-10 rounded-3xl shadow-xl transition-all relative overflow-hidden md:col-span-3 lg:col-span-1"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white text-[#FF6803] flex items-center justify-center font-black text-xl rounded-xl mb-6 shadow-sm">
                3
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-3">
                Assembly
              </h4>
              <p className="font-medium text-white/90 text-sm max-w-lg leading-relaxed">
                If your idea survives validation, the agent shifts from critic
                to lead engineer, generating database schemas and UI instantly.
              </p>
            </div>
            <Layers className="absolute -bottom-10 -right-10 text-white/20 w-48 h-48" />
          </motion.div>
        </div>
      </section>

      {/* 5. FEATURES SHOWCASE (Images + Text) */}
      <section
        id="features"
        className="max-w-[1600px] mx-auto bg-[#D9D9D9] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row mb-8 md:mb-12"
      >
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4 text-[#FF6803]">
            System Overview
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-[#1A1A1A]">
            Live Execution Dashboard
          </h2>
          <p className="text-[#1A1A1A]/60 font-medium mb-8 leading-relaxed max-w-md">
            Monitor your agent's thought process in real-time. Watch as it
            researches competitors, calculates server costs, and writes
            deployment scripts. Total transparency.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 font-bold text-sm text-[#1A1A1A]">
              <ChevronRight className="text-[#FF6803]" size={20} /> Real-time
              terminal streaming
            </li>
            <li className="flex items-center gap-3 font-bold text-sm text-[#1A1A1A]">
              <ChevronRight className="text-[#FF6803]" size={20} />{" "}
              Auto-generated MongoDB schemas
            </li>
            <li className="flex items-center gap-3 font-bold text-sm text-[#1A1A1A]">
              <ChevronRight className="text-[#FF6803]" size={20} /> One-click
              deployment zip files
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-1/2 bg-[#C9C9C9] relative min-h-[300px] md:min-h-[500px] flex items-center justify-center p-8">
          {/* Insert feature mockup image here */}
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            src="/dashboard-preview.png"
            alt="Dashboard Preview"
            className="w-full max-w-lg rounded-2xl shadow-2xl drop-shadow-xl"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' rx='20' fill='white' /%3E%3Crect x='40' y='40' width='520' height='320' rx='10' fill='%23F3F4F6' /%3E%3Ccircle cx='70' cy='70' r='10' fill='%23FF6803'/%3E%3Crect x='100' y='65' width='200' height='10' rx='5' fill='%23D1D5DB'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='sans-serif' font-size='20' font-weight='bold'%3E[ INSERT dashboard-preview.png ]%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="pricing" className="max-w-[1600px] mx-auto mb-8 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col h-full border border-white hover:border-[#FF6803]/30 transition-colors"
          >
            <div className="inline-block px-4 py-1 bg-[#F5F5F5] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest mb-6 rounded-md w-max">
              Hobbyist
            </div>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-[#1A1A1A]">
              Free
            </h3>
            <p className="font-medium text-[#1A1A1A]/60 mb-8 flex-grow">
              One-time credit to test the engine. No credit card required.
            </p>

            <ul className="space-y-4 mb-10 font-bold text-sm text-[#1A1A1A]">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#FF6803]" size={20} /> 1 Idea
                Validation
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#FF6803]" size={20} /> Basic
                Viability Score
              </li>
              <li className="flex items-center gap-3 text-[#1A1A1A]/30">
                <XOctagon size={20} /> No Code Generation
              </li>
            </ul>
            <button className="w-full bg-[#E5E4E2] text-[#1A1A1A] py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#D9D9D9] transition-colors">
              Start Free
            </button>
          </motion.div>

          {/* Paid Tier */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1A1A1A] p-8 md:p-12 rounded-3xl shadow-xl flex flex-col h-full relative overflow-hidden"
          >
            <div className="inline-block px-4 py-1 bg-[#FF6803] text-white font-bold text-xs uppercase tracking-widest mb-6 rounded-md w-max shadow-md">
              Founder
            </div>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-white">
              $49<span className="text-2xl text-white/50">/mo</span>
            </h3>
            <p className="font-medium text-white/60 mb-8 flex-grow">
              Unlimited validations and full code generation pipelines.
            </p>

            <ul className="space-y-4 mb-10 font-bold text-sm text-white">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#FF6803]" size={20} /> Unlimited
                Validations
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#FF6803]" size={20} /> Full
                Next.js MVP Code
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-[#FF6803]" size={20} /> Database
                Schema Exports
              </li>
            </ul>
            <button className="w-full bg-[#FF6803] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_4px_14px_0_rgba(255,104,3,0.39)] hover:shadow-[0_6px_20px_0_rgba(255,104,3,0.5)] hover:-translate-y-0.5 transition-all">
              Upgrade to Pro
            </button>
          </motion.div>
        </div>
      </section>

      {/* 7. MASSIVE FOOTER */}
      <footer className="max-w-[1600px] mx-auto bg-[#D9D9D9] text-[#1A1A1A] pt-16 md:pt-24 pb-8 px-6 md:px-16 rounded-3xl shadow-2xl flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-[#1A1A1A]/10 pb-12 md:pb-16">
          {/* CTA Side */}
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-[#1A1A1A]">
              Ready to <br />
              <span className="text-[#FF6803]">Deploy?</span>
            </h2>
            <button className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#FF6803] hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-3 w-max">
              Initialize System <ArrowUpRight size={20} />
            </button>
          </div>

          {/* Links Side */}
          <div className="grid grid-cols-2 gap-8 text-sm font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1A1A1A]/40 mb-2">Platform</h4>
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
              <h4 className="text-[#1A1A1A]/40 mb-2">Socials</h4>
              <a
                href="#"
                className="hover:text-[#FF6803] transition-colors flex items-center gap-2"
              >
                <Twitter size={16} /> Twitter
              </a>
              <a
                href="#"
                className="hover:text-[#FF6803] transition-colors flex items-center gap-2"
              >
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-widest gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF6803]"></div>© 2026
            SHADOW_FOUNDER
          </div>
          <p>ALL LOGIC. NO FEELINGS.</p>
        </div>
      </footer>
    </div>
  );
}
