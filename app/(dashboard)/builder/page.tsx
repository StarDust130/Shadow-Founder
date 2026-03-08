"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface AnalysisSummary {
  _id: string;
  idea: string;
  category: string;
  score: number;
  verdict: string;
  verdictColor: string;
  summary: string;
  createdAt: string;
}

const buildStages = [
  {
    id: "schema",
    label: "Database Schema",
    icon: Database,
    desc: "AI generates your full database schema with models & relations",
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
  { name: "MongoDB", icon: Database },
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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#22C55E" : score >= 50 ? "#FF6803" : "#EF4444";
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
      style={{ backgroundColor: color, color: "#fff" }}
    >
      {score}
    </div>
  );
}

export default function BuilderPage() {
  const router = useRouter();
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/analyses");
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleBuild = async (analysisId: string) => {
    setBuildingId(analysisId);
    setBuildError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBuildError(data.error || "Build failed");
        setBuildingId(null);
        return;
      }
      router.push(`/assembly/${data.id}`);
    } catch {
      setBuildError("Network error. Please try again.");
      setBuildingId(null);
    }
  };

  const viableIdeas = analyses.filter(
    (a) => a.verdict === "VIABLE" || a.verdict === "CONDITIONAL PASS",
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} /> AI Builder
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

      {/* ENGINE STATUS */}
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
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu size={18} className="text-white" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight">
                    Shadow Build Engine
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
                  Gemini 2.0 Flash &bull; Full-Stack Generation &bull; Ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-[#1A1A1A]/20" />
              <span className="text-[10px] font-bold text-[#1A1A1A]/25 font-mono">
                {viableIdeas.length > 0
                  ? `${viableIdeas.length} viable idea${viableIdeas.length > 1 ? "s" : ""} ready`
                  : "Awaiting validated idea"}
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

      {/* VIABLE IDEAS — BUILD SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]" />
          {viableIdeas.length > 0 ? "Ready to Build" : "Your Validated Ideas"}
        </h2>

        {buildError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 bg-red-500/10 border-2 border-red-500/20 rounded-xl px-4 py-3"
          >
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-xs font-bold text-red-600">{buildError}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FF6803]" />
          </div>
        ) : analyses.length === 0 ? (
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
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {analyses.map((idea) => {
              const isViable =
                idea.verdict === "VIABLE" ||
                idea.verdict === "CONDITIONAL PASS";
              const isBuilding = buildingId === idea._id;
              return (
                <motion.div
                  key={idea._id}
                  variants={fadeUp}
                  whileHover={
                    !isBuilding
                      ? { y: -4, x: -2, transition: { duration: 0.2 } }
                      : {}
                  }
                  className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-all relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={idea.score} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-[#1A1A1A] tracking-tight truncate">
                        {idea.idea.length > 60
                          ? idea.idea.slice(0, 60) + "..."
                          : idea.idea}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/25 font-mono bg-[#1A1A1A]/5 px-2 py-0.5 rounded">
                          {idea.category}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest font-mono px-2 py-0.5 rounded ${isViable ? "text-emerald-600 bg-emerald-500/10" : "text-red-500 bg-red-500/10"}`}
                        >
                          {idea.verdict}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/analysis/${idea._id}`}>
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#1A1A1A]/40 hover:text-[#FF6803] border-2 border-[#1A1A1A]/10 rounded-xl hover:border-[#FF6803]/30 transition-all cursor-pointer"
                        >
                          View
                        </motion.button>
                      </Link>
                      {isViable && (
                        <motion.button
                          onClick={() => handleBuild(idea._id)}
                          disabled={isBuilding}
                          whileHover={!isBuilding ? { y: -2 } : {}}
                          whileTap={!isBuilding ? { scale: 0.95 } : {}}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6803] text-white text-[10px] font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] hover:shadow-[3px_3px_0_#1A1A1A] transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {isBuilding ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />{" "}
                              Building...
                            </>
                          ) : (
                            <>
                              <Code2 size={12} /> Build MVP
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* HOW IT WORKS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Zap size={12} className="text-[#FF6803]" /> How It Works
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
              desc: "Gemini AI analyzes your validated idea and generates full-stack code",
              icon: Bot,
              color: "#8B5CF6",
            },
            {
              step: "03",
              title: "Review & Download",
              desc: "Browse the generated codebase, review files, and download as ZIP",
              icon: Rocket,
              color: "#22C55E",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -6, x: -3, transition: { duration: 0.2 } }}
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

      {/* BUILD STAGES */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Layers size={12} className="text-[#FF6803]" /> Generated Code Modules
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
                    ? { y: -6, x: -3, transition: { duration: 0.2 } }
                    : {}
                }
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`relative border-2 rounded-2xl p-5 transition-all overflow-hidden ${isComing ? "bg-[#D9D9D9]/50 border-[#1A1A1A]/10 border-dashed opacity-60 cursor-default" : "bg-white border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] cursor-pointer"}`}
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
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${isComing ? "bg-[#1A1A1A]/5 border-[#1A1A1A]/8" : "border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"}`}
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
                        className={`text-sm font-black uppercase tracking-tight ${isComing ? "text-[#1A1A1A]/40" : "text-[#1A1A1A]"}`}
                      >
                        {stage.label}
                      </h3>
                      {isComing ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1A1A]/5 rounded-md">
                          <Clock size={8} className="text-[#1A1A1A]/20" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#1A1A1A]/25 font-mono">
                            Soon
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/15">
                          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 font-mono">
                            Ready
                          </span>
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] font-bold leading-relaxed ${isComing ? "text-[#1A1A1A]/20" : "text-[#1A1A1A]/40"}`}
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

      {/* FEATURES */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]" /> What You Get
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

      {/* TECH STACK */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Code2 size={12} className="text-[#FF6803]/40" /> Tech Stack We
          Generate
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
