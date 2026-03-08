"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XOctagon,
  Shield,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Swords,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  X,
  Rocket,
  RefreshCw,
  Pencil,
  Clock,
  AlertTriangle,
  Crown,
  Target,
  DollarSign,
  Zap,
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

interface BigPlayer {
  name: string;
  strength: string;
  weakness: string;
}

interface AnalysisData {
  _id: string;
  idea: string;
  appName?: string;
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
  bigPlayers?: BigPlayer[];
  competitiveEdge?: string;
  failureRisks?: string[];
  founderChecklist?: string[];
  monetization?: string[];
  followUpMessages: ChatMessage[];
}

const scoreColor = (score: number) => {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#FF8A3D";
  return "#EF4444";
};

const scoreEmoji = (score: number) => {
  if (score >= 80) return "\u{1F680}";
  if (score >= 60) return "\u26A1";
  if (score >= 40) return "\u26A0\uFE0F";
  return "\u{1F534}";
};

const verdictEmoji = (verdict: string) => {
  switch (verdict) {
    case "VIABLE":
      return "\u2705";
    case "CONDITIONAL PASS":
      return "\u{1F7E1}";
    case "RISKY":
      return "\u{1F7E0}";
    case "NOT VIABLE":
      return "\u274C";
    default:
      return "\u{1F4CA}";
  }
};

function formatAIResponse(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-3">
          {listItems.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[#1A1A1A]/70"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6803] shrink-0" />
              <span
                dangerouslySetInnerHTML={{ __html: formatInlineText(item) }}
              />
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushList();
      continue;
    }

    const bulletMatch = line.match(/^[\*\-\u2022]\s+(.+)$/);
    const numberedMatch = line.match(/^\d+[\.\)]\s+(.+)$/);

    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
    } else if (numberedMatch) {
      listItems.push(numberedMatch[1]);
    } else {
      flushList();
      if (
        line.startsWith("##") ||
        (line.startsWith("**") && line.endsWith("**"))
      ) {
        const heading = line
          .replace(/^#+\s*/, "")
          .replace(/^\*\*/, "")
          .replace(/\*\*$/, "")
          .replace(/:$/, "");
        elements.push(
          <h4
            key={`h-${elements.length}`}
            className="text-sm font-bold text-[#1A1A1A] mt-4 mb-2 flex items-center gap-2"
          >
            <span className="w-1 h-4 bg-[#FF6803] rounded-full" />
            {heading}
          </h4>,
        );
      } else {
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="text-sm leading-relaxed text-[#1A1A1A]/70 my-1.5"
            dangerouslySetInnerHTML={{ __html: formatInlineText(line) }}
          />,
        );
      }
    }
  }
  flushList();
  return <div className="space-y-1">{elements}</div>;
}

function formatInlineText(text: string): string {
  let result = text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-[#1A1A1A]">$1</strong>',
  );
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  result = result.replace(
    /`(.+?)`/g,
    '<code class="bg-[#FF6803]/10 text-[#FF6803] px-1.5 py-0.5 rounded text-xs font-mono">$1</code>',
  );
  return result;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BUILD_GIFS = [
  "https://media.tenor.com/KeqbuC5yrgUAAAAm/deal-with-it-trailblazer.webp",
  "https://media.tenor.com/hYkRcm80JFwAAAAj/foxy-foxplushy.gif",
  "https://media.tenor.com/KOQYL00kmYEAAAAm/happy-holidays.webp",
  "https://media.tenor.com/v-eI1P9681IAAAAm/goose-dance.webp",
];

const buildWaitTexts = [
  "Crunching the data...",
  "Analyzing market signals...",
  "Generating your MVP...",
  "Almost there, hang tight!",
  "Assembling the code...",
];

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [building, setBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [buildElapsed, setBuildElapsed] = useState(0);
  const [buildGif, setBuildGif] = useState(BUILD_GIFS[0]);
  const [buildWaitText, setBuildWaitText] = useState(buildWaitTexts[0]);

  const {
    messages: chatMessages,
    sendMessage,
    status: chatStatus,
    setMessages,
  } = useChat({
    transport: new TextStreamChatTransport({
      api: `/api/analyses/${id}/chat`,
    }),
  });

  const chatLoading = chatStatus === "submitted" || chatStatus === "streaming";
  const chatWaiting = chatStatus === "submitted"; // waiting for first token
  const [chatInput, setChatInput] = useState("");

  const buildSteps = [
    { emoji: "\u{1F9E0}", text: "Analyzing your idea architecture..." },
    { emoji: "\u{1F4DD}", text: "Generating database schemas..." },
    { emoji: "\u26A1", text: "Building API routes & endpoints..." },
    { emoji: "\u{1F3A8}", text: "Crafting frontend components..." },
    { emoji: "\u{1F527}", text: "Setting up TypeScript config..." },
    { emoji: "\u{1F4E6}", text: "Bundling Next.js project..." },
    { emoji: "\u2705", text: "Finalizing your MVP codebase..." },
  ];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Timer for build loading
  useEffect(() => {
    if (!building) { setBuildElapsed(0); return; }
    const timer = setInterval(() => setBuildElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [building]);

  // GIF & text rotation for build loading
  useEffect(() => {
    if (!building) return;
    const rotator = setInterval(() => {
      setBuildGif(BUILD_GIFS[Math.floor(Math.random() * BUILD_GIFS.length)]);
      setBuildWaitText(buildWaitTexts[Math.floor(Math.random() * buildWaitTexts.length)]);
    }, 5000);
    return () => clearInterval(rotator);
  }, [building]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/analyses/${id}`);
        if (!res.ok) throw new Error("Analysis not found");
        const analysis = await res.json();
        setData(analysis);
        // Load existing chat history into useChat
        if (analysis.followUpMessages?.length > 0) {
          setMessages(
            analysis.followUpMessages.map((msg: ChatMessage, i: number) => ({
              id: `hist-${i}`,
              role: msg.role,
              parts: [{ type: "text" as const, text: msg.content }],
            })),
          );
        }
      } catch {
        setError("Could not load analysis. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id, setMessages]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(
        () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [chatMessages, chatLoading, chatOpen]);

  // Send chat message
  const sendChatMessage = () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    sendMessage({ text: msg });
  };

  const handleBuildMVP = async () => {
    setBuilding(true);
    setBuildStep(0);
    setBuildError(null);

    const stepInterval = setInterval(() => {
      setBuildStep((prev) => (prev < 6 ? prev + 1 : prev));
    }, 3000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id }),
      });
      const result = await res.json();
      clearInterval(stepInterval);
      if (!res.ok) {
        if (result.error === "BUILD_LIMIT_REACHED") {
          setBuildError(
            result.message ||
              "Free plan allows only 1 MVP build. Upgrade to Pro for unlimited builds.",
          );
        } else {
          setBuildError(result.error || "Build failed. Please try again.");
        }
        setBuilding(false);
        return;
      }
      setBuildStep(6);
      setTimeout(() => router.push(`/assembly/${result.id}`), 800);
    } catch {
      clearInterval(stepInterval);
      setBuildError(
        "Network error. Please check your connection and try again.",
      );
      setBuilding(false);
    }
  };

  const isIllegal = data && data.score === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#FF6803]" />
          <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-wider">
            Loading analysis...
          </span>
        </div>
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

  // Illegal / unethical idea — show warning-only UI
  if (isIllegal) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/35 hover:text-[#FF6803] transition-colors mb-4 font-mono"
          >
            <ArrowLeft size={12} /> Back to Hub
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-red-50 border-2 border-red-400 rounded-2xl p-8 md:p-10 shadow-[6px_6px_0_#EF4444] text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-5"
          >
            {"\u{1F6A8}"}
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-black text-red-600 uppercase tracking-tight mb-3">
            Idea Rejected
          </h1>
          <div className="w-20 h-1 bg-red-400 rounded-full mx-auto mb-5" />
          <p className="text-sm md:text-base text-red-700/80 font-bold leading-relaxed mb-2">
            This idea has been flagged as{" "}
            <span className="text-red-600 font-black">
              illegal, unethical, or harmful
            </span>
            .
          </p>
          <p className="text-sm text-red-500/70 font-medium leading-relaxed mb-6">
            Shadow Founder AI does not support ideas that involve illegal
            activities, fraud, exploitation, or anything that could cause harm
            to people. Your idea scored{" "}
            <span className="font-black">0/100</span>.
          </p>
          <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-8 text-left">
            <p className="text-xs font-black text-red-600 uppercase tracking-wider mb-2">
              Why was this rejected?
            </p>
            <p className="text-sm text-red-600/80 font-medium">
              {data.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/validator">
              <motion.button
                whileHover={{ y: -3, boxShadow: "5px 5px 0 #1A1A1A" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 px-8 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:bg-[#FF6803] transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Try a Different Idea
              </motion.button>
            </Link>
          </div>

          <p className="text-[10px] text-red-400 font-bold mt-6 uppercase tracking-widest">
            Build MVP is disabled for flagged ideas
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`max-w-5xl mx-auto transition-all duration-300 ${chatOpen ? "lg:mr-107.5" : ""}`}
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/35 hover:text-[#FF6803] transition-colors mb-4 font-mono"
          >
            <ArrowLeft size={12} /> Back to Hub
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
                <BarChart3 size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {renaming ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!renameValue.trim()) return;
                        try {
                          const res = await fetch(`/api/analyses/${id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ appName: renameValue.trim() }),
                          });
                          if (res.ok) {
                            setData((prev) => prev ? { ...prev, appName: renameValue.trim() } : prev);
                          }
                        } catch { /* silent */ }
                        setRenaming(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        maxLength={50}
                        autoFocus
                        className="text-lg md:text-xl font-black tracking-tighter text-[#1A1A1A] uppercase bg-white border-2 border-[#FF6803] rounded-lg px-2 py-1 w-48 outline-none"
                      />
                      <button type="submit" className="text-[#FF6803] hover:text-[#1A1A1A] cursor-pointer"><CheckCircle2 size={16} /></button>
                      <button type="button" onClick={() => setRenaming(false)} className="text-[#1A1A1A]/30 hover:text-[#1A1A1A] cursor-pointer"><X size={16} /></button>
                    </form>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase">
                        {data.appName || verdictEmoji(data.verdict) + " VC Verdict"}
                      </h1>
                      <button
                        onClick={() => { setRenameValue(data.appName || ""); setRenaming(true); }}
                        className="text-[#1A1A1A]/20 hover:text-[#FF6803] transition-colors cursor-pointer"
                        title="Rename app"
                      >
                        <Pencil size={14} />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-[#1A1A1A]/35 font-bold font-mono uppercase tracking-[0.2em] truncate max-w-70">
                  {data.idea}
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="px-5 py-2 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
              style={{
                color: data.verdictColor,
                backgroundColor: data.verdictColor + "15",
              }}
            >
              {data.verdict}
            </motion.div>
          </div>
        </motion.div>

        {/* STICKY ACTION BAR */}
        <div className="sticky top-14 z-40 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-[#E5E4E2]/90 backdrop-blur-xl border-b-2 border-[#1A1A1A]/10 mb-6">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <motion.button
              whileHover={{
                y: -3,
                x: -1,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuildMVP}
              disabled={building}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FF6803] text-white py-2.5 px-5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[5px_5px_0_#1A1A1A] transition-all disabled:opacity-60 cursor-pointer"
            >
              {building ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Building...
                </>
              ) : (
                <>
                  <Rocket size={14} /> Build MVP
                </>
              )}
            </motion.button>

            <Link href="/validator" className="flex-1 sm:flex-none">
              <motion.button
                whileHover={{
                  y: -3,
                  x: -1,
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#1A1A1A] py-2.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[5px_5px_0_#1A1A1A] transition-all cursor-pointer"
              >
                <RefreshCw size={14} /> Pivot
              </motion.button>
            </Link>

            <motion.button
              whileHover={{
                y: -3,
                x: -1,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setChatOpen(!chatOpen)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] transition-all cursor-pointer  ${
                chatOpen
                  ? "bg-[#FF6803] text-white shadow-[3px_3px_0_#FF6803]"
                  : "bg-white text-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[5px_5px_0_#FF6803]"
              }`}
            >
              <MessageSquare size={14} />
              <span className="cursor-pointer">Chat</span>
              {chatMessages.length > 0 && (
                <span className="w-5 h-5 bg-[#FF6803]/20 rounded-full text-[10px] font-black flex items-center justify-center text-[#FF6803]">
                  {chatMessages.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* SCORE + SUMMARY */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{
              y: -6,
              x: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-shadow"
          >
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-28 h-28 mb-3">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#E5E4E2"
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
                      strokeDashoffset:
                        2 * Math.PI * 42 * (1 - data.score / 100),
                    }}
                    transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl">{scoreEmoji(data.score)}</span>
                  <span
                    className="text-3xl font-black font-mono"
                    style={{ color }}
                  >
                    {data.score}
                  </span>
                </div>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/30 font-mono">
                Viability Score
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{
              y: -6,
              x: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            className="md:col-span-3 bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 md:p-6 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#FF6803]/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                <Sparkles size={14} className="text-[#FF6803]" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/35 font-mono">
                AI Summary
              </h3>
            </div>
            <p className="text-sm md:text-base font-medium text-[#1A1A1A]/65 leading-relaxed">
              {data.summary}
            </p>
            <div className="mt-4 px-4 py-3 bg-[#FF6803]/5 rounded-xl border-2 border-[#FF6803]/20">
              <p className="text-xs font-medium text-[#1A1A1A]/50 italic">
                {"\u{1F4A1}"} &quot;{data.idea}&quot;
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
          {data.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              whileHover={{ y: -6, x: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-default group relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#FF6803] opacity-5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  type: "tween",
                }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/35 font-mono">
                  {metric.label}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                  style={{
                    backgroundColor:
                      metric.trend === "up" ? "#22C55E15" : "#EF444415",
                  }}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp size={12} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                </div>
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
            whileHover={{
              y: -6,
              x: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#22C55E] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                {"\u{1F4AA}"} Strengths
              </h3>
            </div>
            <ul className="space-y-3">
              {data.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]/60"
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
            whileHover={{
              y: -6,
              x: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#EF4444] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                <XOctagon size={16} className="text-red-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                {"\u26A0\uFE0F"} Challenges
              </h3>
            </div>
            <ul className="space-y-3">
              {data.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]/60"
                >
                  <Swords size={14} className="text-red-400 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* BIG PLAYERS / COMPETITORS */}
        {data.bigPlayers && data.bigPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            whileHover={{ y: -6, x: -3, transition: { type: "spring", stiffness: 400, damping: 15 } }}
            className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 md:p-6 mb-6 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-[#FF6803]/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                <Crown size={16} className="text-[#FF6803]" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                  {"\u{1F3C6}"} Competitive Landscape
                </h3>
                <p className="text-[9px] text-[#1A1A1A]/30 font-bold uppercase tracking-widest font-mono">
                  {data.bigPlayers.length} Competitors Identified
                </p>
              </div>
            </div>

            {/* Competitive Edge Banner */}
            {data.competitiveEdge && (
              <div className="mb-4 p-3 bg-[#FF6803]/5 rounded-xl border-2 border-[#FF6803]/30">
                <div className="flex items-start gap-2">
                  <Zap size={14} className="text-[#FF6803] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#FF6803] mb-0.5">Your Competitive Edge</p>
                    <p className="text-xs font-medium text-[#1A1A1A]/70">{data.competitiveEdge}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.bigPlayers.map((player, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-4 bg-[#FAFAFA] rounded-xl border-2 border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#FF6803]">
                      {player.name.charAt(0)}
                    </div>
                    <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight">{player.name}</h4>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-1">
                    <p className="text-[11px] font-bold flex items-start gap-1.5">
                      <span className="w-4 h-4 min-w-4 bg-emerald-100 rounded flex items-center justify-center text-[8px] text-emerald-600 mt-0.5">+</span>
                      <span className="text-emerald-600">{player.strength}</span>
                    </p>
                    <p className="text-[11px] font-bold flex items-start gap-1.5">
                      <span className="w-4 h-4 min-w-4 bg-red-100 rounded flex items-center justify-center text-[8px] text-red-500 mt-0.5">-</span>
                      <span className="text-red-500">{player.weakness}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAILURE RISKS & MONETIZATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {data.failureRisks && data.failureRisks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.46 }}
              whileHover={{ y: -6, x: -3, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#EF4444] transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                  {"\u{1F4A3}"} Why This Could Fail
                </h3>
              </div>
              <ul className="space-y-3">
                {data.failureRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]/60">
                    <span className="w-6 h-6 min-w-6 bg-red-100 rounded-lg flex items-center justify-center text-[10px] font-black text-red-500 border border-red-200 mt-0.5">
                      {i + 1}
                    </span>
                    {risk}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {data.monetization && data.monetization.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.48 }}
              whileHover={{ y: -6, x: -3, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#22C55E] transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                  <DollarSign size={16} className="text-emerald-500" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                  {"\u{1F4B0}"} Monetization Plays
                </h3>
              </div>
              <ul className="space-y-3">
                {data.monetization.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]/60">
                    <span className="w-6 h-6 min-w-6 bg-emerald-100 rounded-lg flex items-center justify-center text-[10px] font-black text-emerald-600 border border-emerald-200 mt-0.5">
                      {"\u20B9"}
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* FOUNDER CHECKLIST */}
        {data.founderChecklist && data.founderChecklist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.49 }}
            whileHover={{ y: -6, x: -3, transition: { type: "spring", stiffness: 400, damping: 15 } }}
            className="bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-2xl p-5 md:p-6 mb-6 shadow-[4px_4px_0_#FF6803] relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-white/20 shadow-[2px_2px_0_#FF8A3D]">
                  <Target size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">
                    {"\u2705"} Founder Checklist
                  </h3>
                  <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest font-mono">
                    Do This Before Building
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {data.founderChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/70">
                    <span className="w-7 h-7 min-w-7 bg-[#FF6803]/20 rounded-lg flex items-center justify-center text-xs font-black text-[#FF6803] border border-[#FF6803]/30">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* PIVOT ENGINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{
            y: -6,
            x: -3,
            transition: { type: "spring", stiffness: 400, damping: 15 },
          }}
          className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 md:p-6 mb-6 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-shadow relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-[#FF6803]/15 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                <Lightbulb size={16} className="text-[#FF6803]" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                  {"\u{1F504}"} Pivot Engine
                </h3>
                <p className="text-[9px] text-[#1A1A1A]/30 font-bold uppercase tracking-widest font-mono">
                  Recommendations
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {data.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm font-medium text-[#1A1A1A]/65"
                >
                  <span className="w-7 h-7 min-w-7 bg-[#FF6803] rounded-lg flex items-center justify-center text-xs font-black text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* SLIDE-OUT CHAT PANEL */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setChatOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 lg:w-105 bg-white z-50 border-l-2 border-[#1A1A1A] shadow-[-4px_0_0_#1A1A1A] flex flex-col"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#1A1A1A] bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-tight">
                      Shadow AI
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] text-[#1A1A1A]/30 font-medium">
                        Streaming · Shadow AI
                      </p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center hover:bg-red-500 transition-colors border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] cursor-pointer"
                >
                  <X size={14} className="text-white" />
                </motion.button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#FF6803]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
                      <Bot size={28} className="text-[#FF6803]" />
                    </div>
                    <p className="text-sm font-black text-[#1A1A1A]/50 mb-1 uppercase">
                      Start a conversation {"\u{1F4AC}"}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/25 mb-4">
                      Ask anything about your startup analysis
                    </p>
                    <div className="flex flex-col gap-2">
                      {[
                        ["\u{1F504}", "How can I pivot this idea?"],
                        ["\u{1F3AF}", "Who are the main competitors?"],
                        ["\u{1F680}", "What's the best go-to-market?"],
                        ["\u{1F4B0}", "How to improve revenue model?"],
                      ].map(([emoji, q]) => (
                        <motion.button
                          key={q}
                          whileHover={{ y: -2, x: -1 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setChatInput(q)}
                          className="px-4 py-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl text-xs font-bold text-[#1A1A1A]/60 shadow-[2px_2px_0_#1A1A1A] hover:shadow-[3px_3px_0_#FF6803] hover:text-[#FF6803] transition-all text-left cursor-pointer"
                        >
                          {emoji} {q}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg) => {
                  const textContent =
                    msg.parts
                      ?.filter(
                        (p): p is { type: "text"; text: string } =>
                          p.type === "text",
                      )
                      .map((p) => p.text)
                      .join("") || "";
                  if (!textContent && msg.role === "assistant") return null;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 bg-[#FF6803] rounded-lg flex items-center justify-center shrink-0 mt-0.5 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                          <Bot size={13} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed border-2 ${
                          msg.role === "user"
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] rounded-br-sm shadow-[2px_2px_0_#FF6803]"
                            : "bg-white border-[#1A1A1A] rounded-bl-sm shadow-[2px_2px_0_#1A1A1A]"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          formatAIResponse(textContent)
                        ) : (
                          <p className="whitespace-pre-wrap">{textContent}</p>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 bg-[#1A1A1A] rounded-lg flex items-center justify-center shrink-0 mt-0.5 border-2 border-[#1A1A1A]">
                          <User size={13} className="text-white" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {chatWaiting &&
                  chatMessages[chatMessages.length - 1]?.role !==
                    "assistant" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5"
                    >
                      <div className="w-7 h-7 bg-[#FF6803] rounded-lg flex items-center justify-center shrink-0 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-[#FF6803] rounded-full"
                          />
                          <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-xs font-bold text-[#1A1A1A]/40"
                          >
                            Thinking...
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input — padded for mobile bottom nav */}
              <div
                className={`border-t-2 border-[#1A1A1A] p-4 bg-white ${isMobile ? "pb-[calc(env(safe-area-inset-bottom,0px)+5rem)]" : ""}`}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Ask about your startup..."
                    className="flex-1 bg-[#F5F5F5] border-2 border-[#1A1A1A] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none focus:border-[#FF6803] focus:shadow-[3px_3px_0_#FF6803] transition-all shadow-[2px_2px_0_#1A1A1A]"
                  />
                  <motion.button
                    whileHover={{ y: -2, x: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || chatLoading}
                    className="w-12 h-12 bg-[#FF6803] rounded-xl flex items-center justify-center text-white disabled:opacity-30 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN BUILD LOADING */}
      <AnimatePresence>
        {building && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-white flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8 px-6 max-w-md w-full">
              {/* GIF */}
              <motion.div
                key={buildGif}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildGif}
                  alt="Building..."
                  className="w-24 h-24 object-contain rounded-2xl"
                />
              </motion.div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tight mb-2">
                  Building Your MVP
                </h2>
                <p className="text-sm text-[#1A1A1A]/40 font-bold mb-3">
                  {buildWaitText}
                </p>
                <div className="inline-flex items-center gap-2 bg-[#FAFAFA] rounded-full px-4 py-1.5 border border-[#1A1A1A]/8">
                  <Clock size={12} className="text-[#FF6803]" />
                  <span className="text-[11px] font-black text-[#1A1A1A]/50 font-mono tracking-wider">
                    {buildElapsed >= 60 ? `${Math.floor(buildElapsed / 60)}m ${buildElapsed % 60}s` : `${buildElapsed}s`}
                  </span>
                </div>
              </div>

              {/* Progress steps */}
              <div className="w-full space-y-2">
                {buildSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: i <= buildStep ? 1 : 0.3,
                      x: 0,
                    }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                      i < buildStep
                        ? "bg-emerald-50 border-emerald-500/30"
                        : i === buildStep
                          ? "bg-white border-[#FF6803] shadow-[3px_3px_0_#FF6803]"
                          : "bg-white/50 border-[#1A1A1A]/10"
                    }`}
                  >
                    <span className="text-lg">
                      {i < buildStep ? "\u2705" : step.emoji}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        i < buildStep
                          ? "text-emerald-600"
                          : i === buildStep
                            ? "text-[#1A1A1A]"
                            : "text-[#1A1A1A]/30"
                      }`}
                    >
                      {step.text}
                    </span>
                    {i === buildStep && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="ml-auto"
                      >
                        <Loader2 size={14} className="text-[#FF6803]" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1A1A1A]/5 rounded-full h-2 border border-[#1A1A1A]/10 overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF6803] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${Math.min(((buildStep + 1) / buildSteps.length) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BUILD ERROR TOAST */}
      <AnimatePresence>
        {buildError && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-101 max-w-md w-[calc(100%-2rem)]"
          >
            <div className="bg-white border-2 border-red-500 rounded-2xl p-4 shadow-[4px_4px_0_#EF4444] flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 border-2 border-red-500/20">
                <XOctagon size={14} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-red-600 uppercase mb-0.5">
                  Build Failed
                </p>
                <p className="text-xs text-[#1A1A1A]/60 font-medium">
                  {buildError}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBuildError(null)}
                className="text-[#1A1A1A]/30 hover:text-[#1A1A1A] shrink-0 cursor-pointer"
              >
                <X size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
