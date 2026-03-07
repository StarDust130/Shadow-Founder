"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XOctagon,
  Shield,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Swords,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const mockAnalysis = {
  idea: "AI-powered resume builder that creates ATS-optimized resumes",
  verdict: "CONDITIONAL PASS",
  verdictColor: "#FF8A3D",
  score: 72,
  summary:
    "The concept addresses a real pain point with a large addressable market. However, the competitive landscape is crowded. Differentiation through AI quality and speed could carve a niche.",
  metrics: [
    {
      label: "Market Size (TAM)",
      value: "$4.2B",
      trend: "up",
      detail: "Global resume tools market growing at 8.3% CAGR",
    },
    {
      label: "Competition",
      value: "High",
      trend: "down",
      detail: "15+ established players including Canva, Indeed",
    },
    {
      label: "Revenue Potential",
      value: "$800K",
      trend: "up",
      detail: "At 5K paying users × $13/mo average",
    },
    {
      label: "Feasibility",
      value: "High",
      trend: "up",
      detail: "LLM APIs + template engine = low complexity",
    },
  ],
  strengths: [
    "Clear pain point — 75% ATS rejection rate is quantifiable",
    "Low CAC through SEO and content marketing",
    "High potential for viral sharing and word-of-mouth",
  ],
  weaknesses: [
    "Crowded market with well-funded incumbents",
    "Low switching costs for users",
    "Dependent on third-party LLM API pricing",
  ],
  recommendations: [
    "Focus on a vertical niche (e.g., tech roles only) to start",
    "Build a free tier with premium ATS scoring analytics",
    "Integrate directly with job boards for distribution",
  ],
};

const scoreColor = (score: number) => {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#FF8A3D";
  return "#EF4444";
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const data = mockAnalysis;
  const color = scoreColor(data.score);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/35 hover:text-[#FF6803] transition-colors mb-4 font-mono"
        >
          <ArrowLeft size={12} />
          Back to Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 bg-[#1A1A1A] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[3px_3px_0_#FF6803]">
              <BarChart3 size={20} className="text-[#FF6803]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase">
                VC Verdict
              </h1>
              <p className="text-[10px] text-[#1A1A1A]/35 font-bold font-mono uppercase tracking-[0.2em]">
                Analysis #{id}
              </p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="px-5 py-2 rounded-xl font-black text-sm uppercase tracking-wider border-2 shadow-[3px_3px_0]"
            style={{
              color: data.verdictColor,
              borderColor: "#1A1A1A",
              backgroundColor: data.verdictColor + "10",
              boxShadow: `3px 3px 0 ${data.verdictColor}`,
            }}
          >
            {data.verdict}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ SCORE + SUMMARY ═══ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {/* Score Ring */}
        <motion.div
          variants={fadeUp}
          className="bg-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center justify-center text-white relative overflow-hidden border-2 border-[#1A1A1A] shadow-[4px_4px_0_#FF6803]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6803]/5 to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="7"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={color}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 42 * (1 - data.score / 100),
                  }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-4xl font-black font-mono"
                  style={{ color }}
                >
                  {data.score}
                </span>
              </div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 font-mono">
              Viability Score
            </p>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          variants={fadeUp}
          className="md:col-span-3 bg-white/40 backdrop-blur-sm border-2 border-[#1A1A1A]/8 rounded-2xl p-5 md:p-6 hover:border-[#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#FF6803]" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/35 font-mono">
              AI Summary
            </h3>
          </div>
          <p className="text-sm md:text-base font-medium text-[#1A1A1A]/65 leading-relaxed">
            {data.summary}
          </p>
          <div className="mt-4 px-4 py-3 bg-[#1A1A1A]/[0.04] rounded-xl border-2 border-[#1A1A1A]/5">
            <p className="text-xs font-bold text-[#1A1A1A]/45 italic font-mono">
              &quot;{data.idea}&quot;
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ METRICS ═══ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        {data.metrics.map((metric) => (
          <motion.div
            key={metric.label}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="bg-white/40 backdrop-blur-sm border-2 border-[#1A1A1A]/8 rounded-2xl p-4 cursor-default hover:border-[#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/35 font-mono">
                {metric.label}
              </span>
              {metric.trend === "up" ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
            </div>
            <h4 className="text-xl font-black tracking-tight text-[#1A1A1A] mb-1">
              {metric.value}
            </h4>
            <p className="text-[10px] text-[#1A1A1A]/35 font-medium leading-relaxed">
              {metric.detail}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ STRENGTHS & WEAKNESSES ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-5 hover:shadow-[4px_4px_0_#22C55E] hover:border-emerald-500 transition-all"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
              <CheckCircle2 size={14} className="text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-emerald-700">
              Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {data.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]/55"
              >
                <Shield
                  size={14}
                  className="text-emerald-500 mt-0.5 shrink-0"
                />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-red-500/5 border-2 border-red-500/20 rounded-2xl p-5 hover:shadow-[4px_4px_0_#EF4444] hover:border-red-500 transition-all"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
              <XOctagon size={14} className="text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-red-600">
              Fatal Flaws
            </h3>
          </div>
          <ul className="space-y-3">
            {data.weaknesses.map((w, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]/55"
              >
                <Swords size={14} className="text-red-400 mt-0.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ═══ RECOMMENDATIONS / PIVOT ENGINE ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1A1A1A] text-white rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden border-2 border-[#1A1A1A] shadow-[4px_4px_0_#FF6803]"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6803]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#FF6803] rounded-lg flex items-center justify-center border-2 border-white/20">
              <Lightbulb size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">
                Pivot Engine
              </h3>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest font-mono">
                Recommendations
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm font-medium text-white/65"
              >
                <span className="w-7 h-7 min-w-7 bg-[#FF6803] rounded-lg flex items-center justify-center text-xs font-black text-white border border-white/20">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ═══ CTA ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link href={`/assembly/${id}`} className="flex-1">
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF8A3D] to-[#FF6803] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all"
          >
            <Zap size={16} />
            Proceed to Assembly
            <ArrowRight size={16} />
          </motion.button>
        </Link>
        <Link href="/validator">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/50 border-2 border-[#1A1A1A]/10 text-[#1A1A1A] py-4 px-6 rounded-xl font-bold text-sm hover:border-[#1A1A1A] hover:shadow-[3px_3px_0_#1A1A1A] transition-all"
          >
            Re-validate
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
