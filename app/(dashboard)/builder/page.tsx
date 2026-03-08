"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Layout,
  Server,
  Sparkles,
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
  Braces,
  Cog,
  Shield,
  Terminal,
} from "lucide-react";
import Link from "next/link";

const buildStages = [
  {
    id: "schema",
    label: "Database Schema",
    icon: Database,
    desc: "AI generates your full Prisma schema with models, relations & enums",
    status: "ready",
    color: "#8B5CF6",
  },
  {
    id: "frontend",
    label: "Frontend Components",
    icon: Layout,
    desc: "Production-ready React components with Tailwind CSS styling",
    status: "ready",
    color: "#FF6803",
  },
  {
    id: "api",
    label: "API Routes",
    icon: Server,
    desc: "Type-safe Next.js API endpoints with auth & validation",
    status: "ready",
    color: "#22C55E",
  },
  {
    id: "deploy",
    label: "Deploy Config",
    icon: Rocket,
    desc: "Vercel deployment config, environment setup & CI/CD pipeline",
    status: "coming-soon",
    color: "#1A1A1A",
  },
];

const techStack = [
  { name: "Next.js 16", icon: Layers },
  { name: "TypeScript", icon: FileCode2 },
  { name: "Prisma ORM", icon: Database },
  { name: "Tailwind CSS", icon: Layout },
  { name: "Clerk Auth", icon: Shield },
  { name: "Vercel", icon: Rocket },
];

const features = [
  {
    icon: Braces,
    title: "Clean Code Output",
    desc: "TypeScript-first, production-ready codebase",
  },
  {
    icon: Shield,
    title: "Auth Built-In",
    desc: "Clerk authentication pre-configured",
  },
  {
    icon: Cog,
    title: "Auto Config",
    desc: "ESLint, Prettier, and Tailwind ready",
  },
  {
    icon: GitBranch,
    title: "Git Ready",
    desc: "Structured commits and branch strategy",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
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
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} />
          AI Builder
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
            Code Builder<span className="text-[#FF6803]">.</span>
          </h1>
        </div>
        <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
          AI generates production-ready code from your validated idea.
        </p>
      </motion.div>

      {/* ═══ ENGINE STATUS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0_#1A1A1A] p-5 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-[#FF6803]/3 via-transparent to-emerald-500/3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, type: "tween" }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] shrink-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Cpu size={18} className="text-white" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight">
                    Shadow Build Engine v3.0
                  </h3>
                  <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        type: "tween",
                      }}
                      className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                    />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest font-mono">
                      Online
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#1A1A1A]/35 font-bold mt-0.5 font-mono">
                  GPT-4o &bull; Claude 3.5 &bull; Codex &bull; Ready to generate
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-[#1A1A1A]/20" />
              <span className="text-[10px] font-bold text-[#1A1A1A]/25 font-mono">
                Awaiting validated idea
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, type: "tween" }}
                className="inline-block w-1.5 h-4 bg-[#FF6803]/30 rounded-sm"
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
              y: -6,
              x: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-4 p-5 bg-[#FF6803] rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[8px_8px_0_#1A1A1A] transition-all cursor-pointer group overflow-hidden"
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
              <p className="text-white/70 text-xs font-bold mt-0.5">
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
          {[
            {
              step: "01",
              title: "Validate Your Idea",
              desc: "Run your pitch through the Shadow Validator to get a viability score",
              icon: Sparkles,
              color: "#FF6803",
            },
            {
              step: "02",
              title: "AI Generates Code",
              desc: "Our AI engine analyzes your validated idea and generates full-stack code",
              icon: Bot,
              color: "#8B5CF6",
            },
            {
              step: "03",
              title: "Review & Deploy",
              desc: "Browse the generated codebase, customize, and deploy to Vercel",
              icon: Rocket,
              color: "#22C55E",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{
                y: -6,
                x: -3,
                transition: { duration: 0.2 },
              }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-all relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-8"
                style={{ backgroundColor: item.color }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                    style={{ backgroundColor: item.color + "15" }}
                  >
                    <span
                      className="text-sm font-black font-mono"
                      style={{ color: item.color }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <item.icon size={16} className="text-[#1A1A1A]/20" />
                </div>
                <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#1A1A1A]/40 font-bold leading-relaxed">
                  {item.desc}
                </p>
              </div>
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
                whileHover={
                  !isComing
                    ? {
                        y: -6,
                        x: -3,
                        transition: { duration: 0.2 },
                      }
                    : {}
                }
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
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10"
                    style={{ backgroundColor: stage.color }}
                  />
                )}
                <div className="relative z-10 flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                      isComing
                        ? "bg-[#1A1A1A]/5 border-[#1A1A1A]/8"
                        : "border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                    }`}
                    style={
                      !isComing
                        ? { backgroundColor: stage.color + "15" }
                        : undefined
                    }
                  >
                    <stage.icon
                      size={20}
                      className={isComing ? "text-[#1A1A1A]/25" : ""}
                      style={!isComing ? { color: stage.color } : undefined}
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
                      {!isComing && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/15">
                          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 font-mono">
                            Ready
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

      {/* ═══ FEATURES ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]" />
          What You Get
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0_#1A1A1A] hover:shadow-[5px_5px_0_#FF6803] transition-all"
            >
              <div className="w-9 h-9 bg-[#FF6803]/10 rounded-xl flex items-center justify-center mb-3 border-2 border-[#FF6803]/20">
                <feat.icon size={16} className="text-[#FF6803]" />
              </div>
              <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-tight mb-0.5">
                {feat.title}
              </h3>
              <p className="text-[10px] text-[#1A1A1A]/35 font-bold">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ TECH STACK ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Code2 size={12} className="text-[#FF6803]/40" />
          Tech Stack We Generate
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-[#1A1A1A]/10 rounded-xl hover:border-[#1A1A1A] hover:shadow-[3px_3px_0_#1A1A1A] transition-all cursor-default"
            >
              <tech.icon size={18} className="text-[#1A1A1A]/30" />
              <span className="text-[8px] font-black uppercase tracking-wider text-[#1A1A1A]/40 font-mono text-center">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
