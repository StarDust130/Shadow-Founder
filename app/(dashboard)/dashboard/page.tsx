"use client";

import { motion } from "framer-motion";
import {
  Crosshair,
  Code2,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Lock,
  BarChart3,
  Target,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const pipeline = [
  {
    step: 1,
    label: "The Pitch",
    desc: "Submit your raw startup concept",
    icon: Target,
    status: "ready" as const,
    href: "/validator",
  },
  {
    step: 2,
    label: "Interrogation",
    desc: "AI agent scrapes & analyzes market",
    icon: Crosshair,
    status: "locked" as const,
    href: "#",
  },
  {
    step: 3,
    label: "The Verdict",
    desc: "Viability score 0–100",
    icon: BarChart3,
    status: "locked" as const,
    href: "#",
  },
  {
    step: 4,
    label: "Assembly",
    desc: "Generate production-ready MVP code",
    icon: Code2,
    status: "locked" as const,
    href: "#",
  },
];

const stats = [
  { label: "Projects", value: "0", icon: Code2, color: "#FF6803" },
  { label: "Validated", value: "0", icon: Crosshair, color: "#1A1A1A" },
  { label: "Approved", value: "0", icon: TrendingUp, color: "#22C55E" },
  { label: "Generated", value: "0", icon: Zap, color: "#FF8A3D" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
          Your startup engine is idle. Launch a validation to begin.
        </p>
      </motion.div>

      {/* ═══ PIPELINE TRACKER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[6px_6px_0_#FF6803] p-5 md:p-6 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6803]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-5 flex items-center gap-2 font-mono">
            <Sparkles size={12} className="text-[#FF6803]" />
            The Pipeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pipeline.map((step, i) => {
              const isReady = step.status === "ready";
              const isLocked = step.status === "locked";
              return (
                <Link key={step.step} href={step.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={isReady ? { y: -4, scale: 1.02 } : {}}
                    whileTap={isReady ? { scale: 0.97 } : {}}
                    className={`relative p-4 rounded-xl border-2 transition-all group ${
                      isReady
                        ? "bg-[#FF6803]/10 border-[#FF6803]/40 cursor-pointer hover:border-[#FF6803] hover:shadow-[0_0_20px_rgba(255,104,3,0.15)]"
                        : "bg-white/[0.03] border-white/[0.06] cursor-default opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${
                          isReady
                            ? "bg-[#FF6803] text-white border-2 border-white/20 shadow-[0_0_12px_rgba(255,104,3,0.4)]"
                            : "bg-white/5 text-white/20 border border-white/5"
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={13} />
                        ) : (
                          <span className="font-mono">{step.step}</span>
                        )}
                      </div>
                      <h3
                        className={`text-sm font-bold flex-1 ${
                          isReady ? "text-[#FF6803]" : "text-white/40"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isReady && (
                        <ArrowRight
                          size={14}
                          className="text-[#FF6803]/30 group-hover:text-[#FF6803] group-hover:translate-x-1 transition-all"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-white/25 font-medium font-mono">
                      {step.desc}
                    </p>
                    {isReady && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#FF6803] rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF6803]/60 font-mono">
                          Ready
                        </span>
                      </div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
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
              transition: { duration: 0.2 },
            }}
            className="bg-white/40 backdrop-blur-sm border-2 border-[#1A1A1A]/8 rounded-2xl p-4 md:p-5 hover:border-[#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all cursor-default group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border-2 border-transparent group-hover:border-[#1A1A1A] group-hover:shadow-[2px_2px_0_#1A1A1A] transition-all"
              style={{ backgroundColor: stat.color + "12" }}
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

      {/* ═══ QUICK START + ACTIVITY ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3 bg-white/40 backdrop-blur-sm border-2 border-[#1A1A1A]/8 rounded-2xl p-5 md:p-6 hover:border-[#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all"
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 mb-5 font-mono">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Validate New Idea",
                desc: "Let the AI interrogate your startup concept",
                href: "/validator",
                icon: Crosshair,
                accent: true,
              },
              {
                label: "View Past Analysis",
                desc: "Review your market analysis reports",
                href: "/dashboard",
                icon: BarChart3,
                accent: false,
              },
              {
                label: "Generate MVP",
                desc: "Scaffold production-ready code",
                href: "/dashboard",
                icon: Code2,
                accent: false,
              },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                    action.accent
                      ? "bg-[#FF6803]/5 border-[#FF6803]/20 hover:border-[#FF6803] hover:shadow-[3px_3px_0_#FF6803]"
                      : "bg-white/30 border-[#1A1A1A]/5 hover:border-[#1A1A1A]/20"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      action.accent
                        ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                        : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40 border-2 border-transparent"
                    }`}
                  >
                    <action.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-bold ${
                        action.accent ? "text-[#FF6803]" : "text-[#1A1A1A]"
                      }`}
                    >
                      {action.label}
                    </h3>
                    <p className="text-[11px] text-[#1A1A1A]/35 font-medium truncate">
                      {action.desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`shrink-0 transition-all ${
                      action.accent
                        ? "text-[#FF6803]/30 group-hover:text-[#FF6803] group-hover:translate-x-1"
                        : "text-[#1A1A1A]/15 group-hover:text-[#1A1A1A]/40 group-hover:translate-x-1"
                    }`}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#FF6803] p-5 md:p-6 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6803]/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 font-mono">
                Activity Feed
              </h2>
              <Clock size={14} className="text-white/20" />
            </div>

            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <Zap size={24} className="text-[#FF6803]" />
              </div>
              <p className="text-white/60 text-sm font-bold mb-1">
                No activity yet
              </p>
              <p className="text-white/25 text-[11px] font-medium max-w-[200px]">
                Validate your first startup idea to see activity here
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/15 font-mono">
              <div className="w-1.5 h-1.5 bg-[#FF6803] rounded-full animate-pulse" />
              Engine Standing By
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ START CTA ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Link href="/validator">
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#FF6803] to-[#FF8A3D] rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-pointer group"
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
    </div>
  );
}
