"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Send,
  AlertTriangle,
  Target,
  Users,
  DollarSign,
  Lightbulb,
  ChevronDown,
  Loader2,
  Terminal,
  Hash,
  CheckCircle2,
  Circle,
  Zap,
  Shield,
} from "lucide-react";

const categories = [
  "SaaS",
  "Marketplace",
  "FinTech",
  "EdTech",
  "HealthTech",
  "AI / ML",
  "E-Commerce",
  "Social",
  "Developer Tools",
  "Other",
];

const pitchFields = [
  {
    id: "idea",
    label: "What's your startup idea?",
    placeholder:
      "An AI-powered resume builder that creates ATS-optimized resumes in 30 seconds...",
    icon: Lightbulb,
    type: "textarea" as const,
    required: true,
  },
  {
    id: "target",
    label: "Target audience",
    placeholder: "Fresh graduates & job-switching professionals aged 22-35",
    icon: Target,
    type: "input" as const,
    required: true,
  },
  {
    id: "problem",
    label: "What problem does it solve?",
    placeholder:
      "75% of resumes get rejected by ATS before a human ever reads them...",
    icon: AlertTriangle,
    type: "textarea" as const,
    required: true,
  },
  {
    id: "revenue",
    label: "Revenue model",
    placeholder: "Freemium — $9/mo Pro plan, $29/mo Enterprise",
    icon: DollarSign,
    type: "input" as const,
    required: false,
  },
  {
    id: "competitors",
    label: "Known competitors",
    placeholder: "Resumake, Novoresume, Canva Resumes",
    icon: Users,
    type: "input" as const,
    required: false,
  },
];

const terminalSteps = [
  { text: "Initializing Shadow Agent...", delay: 400 },
  { text: "Parsing pitch document...", delay: 600 },
  { text: "Scraping competitors across 12 platforms...", delay: 1200 },
  { text: "Crawling ProductHunt, G2, Capterra...", delay: 900 },
  { text: "Calculating TAM / SAM / SOM...", delay: 800 },
  { text: "Analyzing unit economics model...", delay: 700 },
  { text: "Running sentiment analysis on market fit...", delay: 1000 },
  { text: "Evaluating defensibility & moat strength...", delay: 600 },
  { text: "Generating viability verdict...", delay: 800 },
  { text: "✓ Analysis complete. Viability Score: 78/100", delay: 0 },
];

export default function ValidatorPage() {
  const searchParams = useSearchParams();

  // Read URL params for auto-fill (from dashboard idea click)
  const initialIdea = searchParams.get("idea") || "";
  const initialTarget = searchParams.get("target") || "";
  const initialProblem = searchParams.get("problem") || "";
  const initialCategory = searchParams.get("category") || "";

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    if (initialIdea) data.idea = initialIdea;
    if (initialTarget) data.target = initialTarget;
    if (initialProblem) data.problem = initialProblem;
    return data;
  });
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalActive, setTerminalActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (!terminalActive || currentStep < 0) return;
    if (currentStep >= terminalSteps.length) {
      const t = setTimeout(() => {
        setTerminalActive(false);
        setIsSubmitting(false);
      }, 0);
      return () => clearTimeout(t);
    }

    const step = terminalSteps[currentStep];
    setTerminalLines((prev) => [...prev, step.text]);

    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    if (step.delay > 0) {
      const timer = setTimeout(() => setCurrentStep((s) => s + 1), step.delay);
      return () => clearTimeout(timer);
    }
  }, [terminalActive, currentStep]);

  const handleSubmit = () => {
    if (!formData.idea || !formData.target || !formData.problem) return;
    setIsSubmitting(true);
    setTerminalActive(true);
    setTerminalLines([]);
    setCurrentStep(0);
  };

  const filledRequired = formData.idea && formData.target && formData.problem;
  const filledCount = pitchFields.filter((f) => formData[f.id]?.trim()).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} />
          Validator
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
          The Interrogation<span className="text-[#FF6803]">.</span>
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
          Pitch your idea. We break it down with zero sugar-coating.
        </p>
      </motion.div>

      {/* ═══ WARNING BANNER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-8 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
      >
        <div className="w-8 h-8 bg-[#FF6803]/10 rounded-lg flex items-center justify-center shrink-0 border-2 border-[#FF6803]/20">
          <Shield size={14} className="text-[#FF6803]" />
        </div>
        <div>
          <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-wide">
            Brutally honest AI analysis
          </p>
          <p className="text-[11px] text-[#1A1A1A]/35 font-bold mt-0.5">
            Market viability, competition & unit economics — no sugar-coating.
          </p>
        </div>
      </motion.div>

      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="mb-6 flex items-center gap-3"
      >
        <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]/30 font-mono">
          Fields
        </span>
        <div className="flex-1 h-2.5 bg-[#1A1A1A]/5 rounded-full overflow-hidden border-2 border-[#1A1A1A]/10">
          <motion.div
            className="h-full bg-[#FF6803] rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(filledCount / pitchFields.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="text-[10px] font-black text-[#1A1A1A]/40 font-mono">
          {filledCount}/{pitchFields.length}
        </span>
      </motion.div>

      {/* ═══ CATEGORY SELECTOR ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-2 font-mono">
          <Hash size={10} />
          Category
        </label>
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between bg-white border-2 border-[#1A1A1A]/15 hover:border-[#1A1A1A] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] transition-all hover:shadow-[3px_3px_0_#1A1A1A]"
          >
            <span
              className={
                selectedCategory ? "font-bold" : "text-[#1A1A1A]/30 font-bold"
              }
            >
              {selectedCategory || "Select a category..."}
            </span>
            <ChevronDown
              size={16}
              className={`text-[#1A1A1A]/30 transition-transform ${
                categoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0_#1A1A1A] z-20 overflow-hidden"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-[#FF6803]/5 transition-colors ${
                      selectedCategory === cat
                        ? "text-[#FF6803] bg-[#FF6803]/5"
                        : "text-[#1A1A1A]/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ═══ FORM FIELDS ═══ */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
        }}
        className="space-y-5"
      >
        {pitchFields.map((field, idx) => (
          <motion.div
            key={field.id}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <label className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 bg-[#FF6803]/10 rounded-lg flex items-center justify-center border border-[#FF6803]/20">
                <span className="text-[10px] font-black text-[#FF6803] font-mono">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#1A1A1A]/50 font-mono">
                {field.label}
              </span>
              {field.required && (
                <span className="text-[#FF6803] text-xs font-black">*</span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onFocus={() => setFocusedField(field.id)}
                onBlur={() => setFocusedField(null)}
                placeholder={field.placeholder}
                rows={field.id === "idea" ? 4 : 3}
                className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 placeholder:font-normal resize-none focus:outline-none transition-all ${
                  focusedField === field.id
                    ? "border-[#FF6803] shadow-[3px_3px_0_#FF6803]"
                    : "border-[#1A1A1A]/10 hover:border-[#1A1A1A]/25"
                }`}
              />
            ) : (
              <input
                type="text"
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onFocus={() => setFocusedField(field.id)}
                onBlur={() => setFocusedField(null)}
                placeholder={field.placeholder}
                className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 placeholder:font-normal focus:outline-none transition-all ${
                  focusedField === field.id
                    ? "border-[#FF6803] shadow-[3px_3px_0_#FF6803]"
                    : "border-[#1A1A1A]/10 hover:border-[#1A1A1A]/25"
                }`}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ SUBMIT ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <motion.button
          whileHover={
            filledRequired && !isSubmitting
              ? { y: -4, x: -2, transition: { type: "spring", stiffness: 400 } }
              : {}
          }
          whileTap={filledRequired && !isSubmitting ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!filledRequired || isSubmitting}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
            filledRequired && !isSubmitting
              ? "bg-[#FF6803] text-white border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A]"
              : isSubmitting
                ? "bg-[#FF6803]/60 text-white/80 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                : "bg-[#1A1A1A]/5 text-[#1A1A1A]/25 border-[#1A1A1A]/5 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span className="font-black">Agent Analyzing...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span className="font-black">Run Validation</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* ═══ TERMINAL MOCK ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 mb-4"
      >
        <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b-2 border-[#1A1A1A]/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#1A1A1A]/10" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#1A1A1A]/10" />
              <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1A1A1A]/10" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-black text-[#1A1A1A]/20 font-mono uppercase tracking-widest">
                Shadow Agent Terminal
              </span>
            </div>
            <Terminal size={12} className="text-[#FF6803]/30" />
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalRef}
            className="p-4 font-mono text-sm min-h-45 max-h-70 overflow-y-auto bg-[#FAFAFA]/50"
          >
            {terminalLines.length === 0 && !terminalActive && (
              <div className="flex items-center gap-2 text-[#1A1A1A]/15">
                <span className="text-[#FF6803] font-bold">$</span>
                <span className="font-bold">
                  Waiting for pitch submission...
                </span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    type: "tween",
                  }}
                  className="inline-block w-2 h-4 bg-[#FF6803]/20 rounded-sm"
                />
              </div>
            )}

            {terminalLines.map((line, i) => {
              const isLast = i === terminalLines.length - 1;
              const isDone = line.startsWith("✓");
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2 py-1 ${
                    isDone ? "text-emerald-600" : "text-[#1A1A1A]/50"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500 mt-0.5 shrink-0"
                    />
                  ) : isLast && terminalActive ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-[#FF6803] mt-0.5 shrink-0"
                    />
                  ) : (
                    <Circle
                      size={14}
                      className="text-[#1A1A1A]/10 mt-0.5 shrink-0"
                    />
                  )}
                  <span className="font-bold">{line}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Terminal Footer */}
          <div className="px-4 py-2 bg-[#FAFAFA] border-t-2 border-[#1A1A1A]/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={10} className="text-[#FF6803]/30" />
              <span className="text-[9px] font-black text-[#1A1A1A]/15 uppercase tracking-widest font-mono">
                Shadow Engine v3.0
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"
              />
              <span className="text-[9px] font-black text-[#1A1A1A]/15 uppercase tracking-widest font-mono">
                Ready
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
