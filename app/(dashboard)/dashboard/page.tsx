"use client";

import { motion } from "framer-motion";
import {
  Crosshair,
  Code2,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  BarChart3,
  Target,
  Plus,
  Sparkles,
  CheckCircle2,
  XCircle,
  Globe,
  Rocket,
  Cloud,
  Eye,
} from "lucide-react";
import Link from "next/link";

const pastIdeas = [
  {
    id: 1,
    title: "AI Resume Builder",
    pitch:
      "An AI-powered resume builder that creates ATS-optimized resumes in 30 seconds for job seekers.",
    score: 82,
    status: "Viable" as const,
    category: "SaaS",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Crypto Pet Insurance",
    pitch:
      "Blockchain-based pet insurance platform that uses smart contracts for instant claim payouts.",
    score: 23,
    status: "Saturated" as const,
    category: "FinTech",
    date: "5 days ago",
  },
  {
    id: 3,
    title: "Developer Meme Generator",
    pitch:
      "AI that generates context-aware programming memes from your GitHub commit messages.",
    score: 61,
    status: "Viable" as const,
    category: "Developer Tools",
    date: "1 week ago",
  },
  {
    id: 4,
    title: "Smart Grocery List",
    pitch:
      "ML-powered meal planner that auto-generates optimized grocery lists based on dietary needs.",
    score: 45,
    status: "Saturated" as const,
    category: "HealthTech",
    date: "2 weeks ago",
  },
  {
    id: 5,
    title: "Code Review Copilot",
    pitch:
      "AI agent that performs deep code reviews with security analysis and performance suggestions.",
    score: 91,
    status: "Viable" as const,
    category: "AI / ML",
    date: "3 weeks ago",
  },
  {
    id: 6,
    title: "Freelancer CRM Lite",
    pitch:
      "Minimalist CRM for solo freelancers to manage invoices, contracts, and client comms in one place.",
    score: 73,
    status: "Viable" as const,
    category: "SaaS",
    date: "1 month ago",
  },
];

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

const stats = [
  { label: "Projects", value: "6", icon: Code2, color: "#FF6803" },
  { label: "Validated", value: "6", icon: Crosshair, color: "#1A1A1A" },
  { label: "Viable", value: "4", icon: TrendingUp, color: "#22C55E" },
  { label: "Avg Score", value: "62", icon: Zap, color: "#FF8A3D" },
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

function StatusBadge({ status }: { status: "Viable" | "Saturated" }) {
  const isViable = status === "Viable";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 ${
        isViable
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
          : "bg-red-500/10 text-red-500 border-red-500/30"
      }`}
    >
      {isViable ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
      {status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} />
          Command Center
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
          Welcome Back
          <span className="text-[#FF6803]">.</span>
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 font-medium mt-2">
          Overview of all your validated startup ideas and projects.
        </p>
      </motion.div>

      {/* ═══ STATS ═══ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{
              y: -6,
              x: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
            className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 md:p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-default group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] transition-all"
              style={{ backgroundColor: stat.color + "18" }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-[#1A1A1A]">
              {stat.value}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/30 mt-1 font-mono">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ PAST IDEAS — BENTO GRID ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono flex items-center gap-2">
            <Eye size={12} className="text-[#FF6803]" />
            Past Projects
          </h2>
          <Link href="/validator">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6803] hover:text-[#1A1A1A] transition-colors"
            >
              New Idea <ArrowRight size={12} />
            </motion.button>
          </Link>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {pastIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              variants={fadeUp}
              whileHover={{
                y: -6,
                x: -3,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#FF6803] transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-[#1A1A1A] tracking-tight truncate group-hover:text-[#FF6803] transition-colors">
                    {idea.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/25 font-mono">
                      {idea.category}
                    </span>
                    <span className="text-[#1A1A1A]/10">•</span>
                    <span className="text-[9px] font-medium text-[#1A1A1A]/25">
                      {idea.date}
                    </span>
                  </div>
                </div>
                <ScoreBadge score={idea.score} />
              </div>

              <p className="text-[12px] text-[#1A1A1A]/45 font-medium leading-relaxed line-clamp-2 mb-4">
                {idea.pitch}
              </p>

              <div className="flex items-center justify-between">
                <StatusBadge status={idea.status} />
                <motion.div
                  className="text-[#1A1A1A]/15 group-hover:text-[#FF6803] transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══ START CTA ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Link href="/validator">
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-4 p-5 bg-linear-to-r from-[#FF6803] to-[#FF8A3D] rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
              <Plus size={22} className="text-[#FF6803]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black uppercase tracking-tight">
                Start New Project
              </h3>
              <p className="text-white/60 text-xs font-medium mt-0.5">
                Submit your startup pitch &bull; AI validates in ~15s
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
            />
          </motion.div>
        </Link>
      </motion.div>

      {/* ═══ COMING SOON ═══ */}
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
              className="bg-[#D9D9D9]/60 border-2 border-[#1A1A1A]/10 border-dashed rounded-2xl p-5 opacity-60 hover:opacity-80 transition-opacity cursor-default"
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
