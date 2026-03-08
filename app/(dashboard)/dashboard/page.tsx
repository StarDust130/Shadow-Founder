"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  Crosshair,
  Code2,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  BarChart3,
  Sparkles,
  CheckCircle2,
  XCircle,
  Globe,
  Rocket,
  Cloud,
  Flame,
  Activity,
  Cpu,
  Layers,
  MousePointerClick,
  Loader2,
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

const comingSoon = [
  {
    title: "Live Market Scraping v2.0",
    desc: "Real-time competitor analysis with live web scraping and trend detection",
    icon: Globe,
  },
  {
    title: "One-Click Vercel Deploy",
    desc: "Deploy your generated MVP directly to Vercel with zero configuration",
    icon: Rocket,
  },
  {
    title: "Cloud Database Sync",
    desc: "Auto-provision Supabase or PlanetScale databases for your MVP",
    icon: Cloud,
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

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#22C55E" : score >= 50 ? "#FF6803" : "#EF4444";
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
      style={{ backgroundColor: color, color: "#fff" }}
    >
      {score}
    </div>
  );
}

function StatusBadge({ verdict }: { verdict: string }) {
  const isViable = verdict === "VIABLE" || verdict === "CONDITIONAL PASS";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 ${
        isViable
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
          : "bg-red-500/10 text-red-500 border-red-500/30"
      }`}
    >
      {isViable ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
      {verdict}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Builder";

  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analyses");
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data);
        }
      } catch {
        // Silently fail — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProjects = analyses.length;
  const viableCount = analyses.filter(
    (a) => a.verdict === "VIABLE" || a.verdict === "CONDITIONAL PASS",
  ).length;
  const avgScore =
    totalProjects > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.score, 0) / totalProjects,
        )
      : 0;

  const stats = [
    {
      label: "Projects",
      value: String(totalProjects),
      icon: Code2,
      color: "#FF6803",
    },
    {
      label: "Validated",
      value: String(totalProjects),
      icon: Crosshair,
      color: "#1A1A1A",
    },
    {
      label: "Viable",
      value: String(viableCount),
      icon: TrendingUp,
      color: "#22C55E",
    },
    {
      label: "Avg Score",
      value: String(avgScore),
      icon: Zap,
      color: "#FF8A3D",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} />
          Command Center
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
            Welcome Back, {firstName}
            <span className="text-[#FF6803]">.</span>
          </h1>
          <motion.div
            animate={{ rotate: [0, 14, -8, 14, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 3,
              type: "tween",
            }}
            className="text-3xl md:text-4xl origin-bottom-right hidden sm:block"
          >
            👋
          </motion.div>
        </div>
        <p className="text-sm text-[#1A1A1A]/40 font-medium mt-2">
          Overview of all your validated startup ideas and projects.
        </p>
      </motion.div>

      {/* START CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            className="relative flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[8px_8px_0_#FF6803] transition-all cursor-pointer group overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-[#FF6803]/5 via-transparent to-[#FF6803]/5"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, type: "tween" }}
            />
            <div className="relative z-10 w-12 h-12 bg-[#FF6803] rounded-xl flex items-center justify-center shrink-0 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Cpu size={22} className="text-white" />
              </motion.div>
            </div>
            <div className="relative z-10 flex-1">
              <h3 className="text-[#1A1A1A] font-black uppercase tracking-tight flex items-center gap-2">
                Start New Project
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                >
                  <Sparkles size={14} className="text-[#FF6803]" />
                </motion.span>
              </h3>
              <p className="text-[#1A1A1A]/40 text-xs font-bold mt-0.5">
                Submit your startup pitch &bull; AI validates in ~15s
              </p>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#FF6803]/10 border-2 border-[#FF6803]/20 flex items-center justify-center group-hover:bg-[#FF6803] group-hover:border-[#1A1A1A] transition-all shrink-0">
              <ArrowRight
                size={18}
                className="text-[#FF6803] group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -6, x: -2, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 md:p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-default group relative overflow-hidden"
          >
            <motion.div
              className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-10"
              style={{ backgroundColor: stat.color }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                type: "tween",
              }}
            />
            <div
              className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] transition-all"
              style={{ backgroundColor: stat.color + "18" }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <h3 className="relative z-10 text-3xl font-black tracking-tighter text-[#1A1A1A]">
              {stat.value}
            </h3>
            <p className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/30 mt-1 font-mono">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
      >
        {[
          {
            label: "Validate Idea",
            desc: "AI-powered pitch analysis",
            href: "/validator",
            icon: Crosshair,
            accent: "#FF6803",
          },
          {
            label: "Build Code",
            desc: "Generate MVP codebase",
            href: "/validator",
            icon: Code2,
            accent: "#8B5CF6",
          },
          {
            label: "View Analytics",
            desc: "Track your ideas",
            href: "/dashboard",
            icon: BarChart3,
            accent: "#22C55E",
          },
        ].map((action, i) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 p-4 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:shadow-[5px_5px_0_#1A1A1A] transition-all cursor-pointer group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                style={{ backgroundColor: action.accent + "15" }}
              >
                <action.icon size={16} style={{ color: action.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-tight">
                  {action.label}
                </p>
                <p className="text-[10px] text-[#1A1A1A]/30 font-medium">
                  {action.desc}
                </p>
              </div>
              <MousePointerClick
                size={14}
                className="text-[#1A1A1A]/10 group-hover:text-[#FF6803] transition-colors shrink-0"
              />
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* PROJECT IDEAS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono flex items-center gap-2">
            <Flame size={12} className="text-[#FF6803]" />
            Your Validated Ideas
          </h2>
          <Link href="/validator">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6803] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              New Idea <ArrowRight size={12} />
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FF6803]" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#1A1A1A]/10 rounded-2xl">
            <Sparkles size={32} className="mx-auto text-[#1A1A1A]/15 mb-3" />
            <p className="text-sm font-bold text-[#1A1A1A]/30">
              No ideas validated yet
            </p>
            <p className="text-xs text-[#1A1A1A]/20 mt-1">
              Submit your first pitch to get started
            </p>
            <Link href="/validator">
              <motion.button
                whileHover={{ y: -2 }}
                className="mt-4 px-6 py-2.5 bg-[#FF6803] text-white rounded-xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] cursor-pointer"
              >
                Validate an Idea
              </motion.button>
            </Link>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {analyses.map((idea) => (
              <Link key={idea._id} href={`/analysis/${idea._id}`}>
                <motion.div
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    x: -3,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#FF6803] transition-shadow cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-[#1A1A1A] tracking-tight truncate group-hover:text-[#FF6803] transition-colors">
                        {idea.idea.length > 40
                          ? idea.idea.slice(0, 40) + "..."
                          : idea.idea}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/25 font-mono bg-[#1A1A1A]/5 px-2 py-0.5 rounded">
                          {idea.category}
                        </span>
                        <span className="text-[9px] text-[#1A1A1A]/20 font-mono">
                          {timeAgo(idea.createdAt)}
                        </span>
                      </div>
                    </div>
                    <ScoreBadge score={idea.score} />
                  </div>
                  <p className="text-[12px] text-[#1A1A1A]/45 font-medium leading-relaxed line-clamp-2 mb-4">
                    {idea.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <StatusBadge verdict={idea.verdict} />
                    <motion.div
                      className="text-[#1A1A1A]/15 group-hover:text-[#FF6803] transition-colors"
                      whileHover={{ x: 3 }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* TECH STACK MARQUEE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-8 overflow-hidden rounded-xl border-2 border-[#1A1A1A]/10 bg-white/50 py-3"
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {[
            "Next.js 16",
            "TypeScript",
            "Tailwind CSS",
            "MongoDB",
            "Clerk Auth",
            "Framer Motion",
            "Groq AI",
            "Gemini",
            "JSZip",
            "React 19",
            "Next.js 16",
            "TypeScript",
            "Tailwind CSS",
            "MongoDB",
            "Clerk Auth",
            "Framer Motion",
            "Groq AI",
            "Gemini",
            "JSZip",
            "React 19",
          ].map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/15 font-mono flex items-center gap-2"
            >
              <Layers size={10} />
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* LIVE STATUS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
          <div className="flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
              className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 font-mono">
              Live
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 font-mono">
            All Systems Operational
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-[#FF6803]/8 px-2.5 py-1 rounded-lg border border-[#FF6803]/15">
            <Activity size={11} className="text-[#FF6803]" />
            <span className="text-[10px] font-black text-[#FF6803] font-mono hidden sm:inline">
              100%
            </span>
          </div>
        </div>
      </motion.div>

      {/* COMING SOON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]/40" />
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {comingSoon.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-[#D9D9D9]/60 border-2 border-[#1A1A1A]/10 border-dashed rounded-2xl p-5 opacity-60 hover:opacity-80 transition-all cursor-default"
            >
              <div className="w-10 h-10 bg-[#1A1A1A]/5 rounded-xl flex items-center justify-center mb-3 border-2 border-[#1A1A1A]/8">
                <item.icon size={18} className="text-[#1A1A1A]/25" />
              </div>
              <h3 className="text-sm font-black text-[#1A1A1A]/50 tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#1A1A1A]/25 font-medium leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1A1A]/5 rounded-md">
                <Clock size={8} className="text-[#1A1A1A]/20" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/25 font-mono">
                  Soon
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
