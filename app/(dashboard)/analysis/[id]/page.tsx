"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Metric {
  label: string;
  value: string;
  trend: string;
  detail: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnalysisData {
  _id: string;
  idea: string;
  target: string;
  problem: string;
  verdict: string;
  verdictColor: string;
  score: number;
  summary: string;
  metrics: Metric[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  followUpMessages: ChatMessage[];
}

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
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Building state
  const [building, setBuilding] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/analyses/${id}`);
        if (!res.ok) throw new Error("Analysis not found");
        const analysis = await res.json();
        setData(analysis);
        setChatMessages(analysis.followUpMessages || []);
      } catch {
        setError("Could not load analysis. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/analyses/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok) throw new Error("Chat failed");
      const { response } = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleBuildMVP = async () => {
    setBuilding(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.error === "BUILD_LIMIT_REACHED") {
          alert(result.message);
        } else {
          alert(result.error || "Build failed");
        }
        setBuilding(false);
        return;
      }
      router.push(`/assembly/${result.id}`);
    } catch {
      alert("Failed to start build. Try again.");
      setBuilding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#FF6803]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-bold text-[#1A1A1A]/50">{error}</p>
        <Link
          href="/dashboard"
          className="text-[#FF6803] font-bold hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const color = scoreColor(data.score);

  return (
    <div className="max-w-5xl mx-auto">
      {/* HEADER */}
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
              <p className="text-[10px] text-[#1A1A1A]/35 font-bold font-mono uppercase tracking-[0.2em] truncate max-w-[200px]">
                {data.idea}
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

      {/* SCORE + SUMMARY */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
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

      {/* METRICS */}
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

      {/* STRENGTHS & WEAKNESSES */}
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

      {/* RECOMMENDATIONS / PIVOT ENGINE */}
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

      {/* FOLLOW-UP CHAT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mb-6"
      >
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-full flex items-center justify-between bg-white/40 border-2 border-[#1A1A1A]/10 rounded-2xl px-5 py-4 hover:border-[#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FF6803]/10 rounded-xl flex items-center justify-center border-2 border-[#FF6803]/20">
              <MessageSquare size={16} className="text-[#FF6803]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight">
                Ask Follow-up Questions
              </p>
              <p className="text-[10px] text-[#1A1A1A]/35 font-bold">
                Ask about pivots, competitors, market strategy, or anything else
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: chatOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={16} className="text-[#1A1A1A]/30 rotate-90" />
          </motion.div>
        </button>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0_#1A1A1A] overflow-hidden">
                {/* Chat Messages */}
                <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot
                        size={32}
                        className="mx-auto text-[#1A1A1A]/15 mb-3"
                      />
                      <p className="text-sm font-bold text-[#1A1A1A]/30">
                        Ask me anything about this analysis
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {[
                          "How can I pivot this idea?",
                          "Who are the main competitors?",
                          "What's the best go-to-market?",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setChatInput(q);
                            }}
                            className="px-3 py-1.5 bg-[#FF6803]/5 border border-[#FF6803]/20 rounded-lg text-xs font-bold text-[#FF6803] hover:bg-[#FF6803]/10 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 bg-[#FF6803] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#1A1A1A] text-white rounded-br-sm"
                            : "bg-[#F5F5F5] text-[#1A1A1A]/70 rounded-bl-sm border border-[#1A1A1A]/5"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 bg-[#1A1A1A] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <User size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 bg-[#FF6803] rounded-lg flex items-center justify-center shrink-0">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="bg-[#F5F5F5] rounded-2xl rounded-bl-sm px-4 py-3 border border-[#1A1A1A]/5">
                        <Loader2
                          size={16}
                          className="animate-spin text-[#FF6803]"
                        />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t-2 border-[#1A1A1A]/5 p-3 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Ask about pivots, competitors, strategy..."
                    className="flex-1 bg-[#F5F5F5] border-2 border-[#1A1A1A]/5 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6803] transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || chatLoading}
                    className="w-11 h-11 bg-[#FF6803] rounded-xl flex items-center justify-center text-white disabled:opacity-30 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuildMVP}
          disabled={building}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF8A3D] to-[#FF6803] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all disabled:opacity-60"
        >
          {building ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Building MVP...
            </>
          ) : (
            <>
              <Zap size={16} />
              Build MVP
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
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
