"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Layout,
  Server,
  Sparkles,
  Terminal,
  Zap,
  Cpu,
  GitBranch,
  FileCode2,
  Rocket,
  Clock,
  Layers,
  ArrowRight,
  Play,
  Bot,
} from "lucide-react";
import Link from "next/link";

const buildStages = [
  {
    id: "schema",
    label: "Database Schema",
    icon: Database,
    desc: "AI generates your full Prisma schema with models, relations & enums",
    status: "ready",
  },
  {
    id: "frontend",
    label: "Frontend Components",
    icon: Layout,
    desc: "Production-ready React components with Tailwind CSS styling",
    status: "ready",
  },
  {
    id: "api",
    label: "API Routes",
    icon: Server,
    desc: "Type-safe Next.js API endpoints with auth & validation",
    status: "ready",
  },
  {
    id: "deploy",
    label: "Deploy Config",
    icon: Rocket,
    desc: "Vercel deployment config, environment setup & CI/CD pipeline",
    status: "coming-soon",
  },
];

const techStack = [
  { name: "Next.js 16", icon: Layers },
  { name: "TypeScript", icon: FileCode2 },
  { name: "Prisma ORM", icon: Database },
  { name: "Tailwind CSS", icon: Layout },
  { name: "Clerk Auth", icon: GitBranch },
  { name: "Vercel", icon: Rocket },
];

const howItWorks = [
  {
    step: "01",
    title: "Validate Your Idea",
    desc: "Run your pitch through the Shadow Validator to get a viability score",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "AI Generates Code",
    desc: "Our AI engine analyzes your validated idea and generates full-stack code",
    icon: Bot,
  },
  {
    step: "03",
    title: "Review & Deploy",
    desc: "Browse the generated codebase, customize, and deploy to Vercel",
    icon: Rocket,
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BuilderPage() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ rotate: 12 }}
            className="w-11 h-11 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
          >
            <Code2 size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase">
              Code Builder
            </h1>
            <p className="text-[10px] text-[#1A1A1A]/40 font-bold uppercase tracking-[0.2em] font-mono">
              AI generates production-ready code from your idea
            </p>
          </div>
        </div>
        <div className="h-0.75 bg-[#1A1A1A] rounded-full" />
      </motion.div>

      {/* ═══ AI ENGINE STATUS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-[#0D0D0D] rounded-2xl border-2 border-[#1A1A1A] shadow-[6px_6px_0_#1A1A1A] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[10px] font-black text-white/20 font-mono uppercase tracking-widest">
                Shadow Builder Engine
              </span>
            </div>
            <Terminal size={12} className="text-[#FF6803]/40" />
          </div>

          {/* Terminal body */}
          <div className="p-5 font-mono space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#FF6803] font-bold">$</span>
              <span className="text-white/50 font-bold text-sm">
                shadow-builder --status
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400/80">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                className="w-2 h-2 bg-emerald-400 rounded-full"
              />
              <span className="text-sm font-bold">
                AI Code Engine v3.0 is online and ready
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/30">
              <Cpu size={12} />
              <span className="text-xs font-bold">
                Models loaded: GPT-4o, Claude 3.5 Sonnet, Codex
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/20">
              <span className="text-[#FF6803] font-bold">$</span>
              <span className="text-sm font-bold">
                awaiting validated idea...
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, type: "tween" }}
                className="inline-block w-2 h-4 bg-[#FF6803]/40"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ CTA: VALIDATE FIRST ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <Link href="/validator">
          <motion.div
            whileHover={{
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-4 p-5 bg-[#FF6803] rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-pointer group overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10 w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
              <Play size={20} className="text-[#FF6803] ml-0.5" />
            </div>
            <div className="relative z-10 flex-1">
              <h3 className="text-white font-black uppercase tracking-tight">
                Validate an Idea First
              </h3>
              <p className="text-white/60 text-xs font-bold mt-0.5">
                Code generation unlocks after a successful validation run
              </p>
            </div>
            <ArrowRight
              size={20}
              className="relative z-10 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
            />
          </motion.div>
        </Link>
      </motion.div>

      {/* ═══ HOW IT WORKS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Zap size={12} className="text-[#FF6803]" />
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FF6803]/10 rounded-xl flex items-center justify-center border-2 border-[#FF6803]/20">
                  <span className="text-sm font-black text-[#FF6803] font-mono">
                    {item.step}
                  </span>
                </div>
                <item.icon size={18} className="text-[#1A1A1A]/25" />
              </div>
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#1A1A1A]/40 font-bold leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ BUILD STAGES ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Layers size={12} className="text-[#FF6803]" />
          Generated Code Modules
        </h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {buildStages.map((stage) => {
            const isComing = stage.status === "coming-soon";
            return (
              <motion.div
                key={stage.id}
                variants={fadeUp}
                whileHover={!isComing ? { y: -4, x: -2 } : {}}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`relative border-2 rounded-2xl p-5 transition-all overflow-hidden ${
                  isComing
                    ? "bg-[#D9D9D9]/50 border-[#1A1A1A]/10 border-dashed opacity-60 cursor-default"
                    : "bg-white border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] cursor-pointer"
                }`}
              >
                {!isComing && hoveredStage === stage.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-linear-to-br from-[#FF6803]/3 to-transparent pointer-events-none"
                  />
                )}
                <div className="relative z-10 flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                      isComing
                        ? "bg-[#1A1A1A]/5 border-[#1A1A1A]/8"
                        : "bg-[#FF6803]/10 border-[#FF6803]/20 shadow-[2px_2px_0_#1A1A1A]"
                    }`}
                  >
                    <stage.icon
                      size={20}
                      className={
                        isComing ? "text-[#1A1A1A]/25" : "text-[#FF6803]"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`text-sm font-black uppercase tracking-tight ${
                          isComing ? "text-[#1A1A1A]/40" : "text-[#1A1A1A]"
                        }`}
                      >
                        {stage.label}
                      </h3>
                      {isComing && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1A1A]/5 rounded-md">
                          <Clock size={8} className="text-[#1A1A1A]/20" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#1A1A1A]/25 font-mono">
                            Soon
                          </span>
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] font-bold leading-relaxed ${
                        isComing ? "text-[#1A1A1A]/20" : "text-[#1A1A1A]/40"
                      }`}
                    >
                      {stage.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ═══ TECH STACK ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-4"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]/40" />
          Tech Stack We Generate
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-[#1A1A1A]/10 rounded-xl hover:border-[#1A1A1A] hover:shadow-[3px_3px_0_#1A1A1A] transition-all cursor-default"
            >
              <tech.icon size={20} className="text-[#1A1A1A]/30" />
              <span className="text-[9px] font-black uppercase tracking-wider text-[#1A1A1A]/40 font-mono text-center">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
