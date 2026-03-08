"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Send,
  AlertTriangle,
  Target,
  Users,
  DollarSign,
  Lightbulb,
  ChevronDown,
  Loader2,
  Hash,
  CheckCircle2,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

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
    placeholder: "Freemium \u2014 $9/mo Pro plan, $29/mo Enterprise",
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

const analysisSteps = [
  { text: "Initializing Shadow Agent", emoji: "\u{1F916}", delay: 600 },
  { text: "Parsing your pitch", emoji: "\u{1F4DD}", delay: 800 },
  { text: "Scanning competitor landscape", emoji: "\u{1F50D}", delay: 1200 },
  {
    text: "Calculating market size (TAM/SAM/SOM)",
    emoji: "\u{1F4CA}",
    delay: 1000,
  },
  { text: "Analyzing unit economics", emoji: "\u{1F4B0}", delay: 900 },
  { text: "Evaluating market fit", emoji: "\u{1F3AF}", delay: 800 },
  {
    text: "Assessing defensibility & moat",
    emoji: "\u{1F6E1}\uFE0F",
    delay: 700,
  },
  { text: "Generating viability verdict", emoji: "\u26A1", delay: 1000 },
];

export default function ValidatorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
  const [analysisPhase, setAnalysisPhase] = useState(-1);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Full-screen analysis animation
  useEffect(() => {
    if (!showFullScreenLoader || analysisPhase < 0) return;
    if (analysisPhase >= analysisSteps.length) return;

    const step = analysisSteps[analysisPhase];
    if (step.delay > 0) {
      const timer = setTimeout(
        () => setAnalysisPhase((s) => s + 1),
        step.delay,
      );
      return () => clearTimeout(timer);
    }
  }, [showFullScreenLoader, analysisPhase]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.idea || !formData.target || !formData.problem) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setShowFullScreenLoader(true);
    setAnalysisPhase(0);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: formData.idea,
          target: formData.target,
          problem: formData.problem,
          revenue: formData.revenue || "",
          competitors: formData.competitors || "",
          category: selectedCategory || "Other",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Validation failed");
      }

      const data = await res.json();
      setAnalysisPhase(analysisSteps.length);
      // Brief pause to show completion
      setTimeout(() => {
        router.push(`/analysis/${data.id}`);
      }, 800);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setIsSubmitting(false);
      setShowFullScreenLoader(false);
      setAnalysisPhase(-1);
    }
  };

  const filledRequired = formData.idea && formData.target && formData.problem;
  const filledCount = pitchFields.filter((f) => formData[f.id]?.trim()).length;

  // Full screen loading overlay
  if (showFullScreenLoader) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-100 bg-[#E5E4E2] flex items-center justify-center"
      >
        <div className="max-w-md w-full mx-auto px-6">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center mb-10"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-linear-to-br from-[#FF6803] to-[#FF8A3D] rounded-2xl grid grid-cols-2 gap-[3px] p-[7px] shadow-xl border-2 border-[#1A1A1A] mb-4"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="bg-white rounded-sm"
                />
              ))}
            </motion.div>
            <h2 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tight text-center">
              Analyzing Your Idea
            </h2>
            <p className="text-sm text-[#1A1A1A]/40 font-medium mt-1 text-center">
              Our AI is evaluating your startup potential
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="space-y-3">
            {analysisSteps.map((step, i) => {
              const isActive = i === analysisPhase;
              const isComplete = i < analysisPhase;
              const isPending = i > analysisPhase;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isPending ? 0.3 : 1,
                    x: 0,
                  }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white shadow-md border border-[#FF6803]/20"
                      : isComplete
                        ? "bg-white/50"
                        : "bg-transparent"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 size={20} className="text-[#FF6803]" />
                      </motion.div>
                    ) : (
                      <span className="text-lg">{step.emoji}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isActive
                        ? "text-[#1A1A1A]"
                        : isComplete
                          ? "text-[#1A1A1A]/50"
                          : "text-[#1A1A1A]/25"
                    }`}
                  >
                    {step.text}
                  </span>
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-auto"
                    >
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6803]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6803]/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6803]/25" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Completion state */}
          {analysisPhase >= analysisSteps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-3"
              >
                {"\u{1F389}"}
              </motion.div>
              <p className="text-sm font-black text-emerald-600 uppercase tracking-wide">
                Analysis Complete!
              </p>
              <p className="text-xs text-[#1A1A1A]/40 mt-1">
                Redirecting to your results...
              </p>
            </motion.div>
          )}

          {/* Progress bar */}
          <div className="mt-8 h-1.5 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-[#FF6803] to-[#FF8A3D] rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${Math.min(((analysisPhase + 1) / analysisSteps.length) * 100, 100)}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" ref={formRef}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} /> Validator
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
          The Interrogation<span className="text-[#FF6803]">.</span>
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
          Pitch your idea. We break it down with zero sugar-coating.
        </p>
      </motion.div>

      {/* WARNING BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 mb-8 border border-[#1A1A1A]/10"
      >
        <div className="w-8 h-8 bg-[#FF6803]/10 rounded-lg flex items-center justify-center shrink-0">
          <Shield size={14} className="text-[#FF6803]" />
        </div>
        <div>
          <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-wide">
            Brutally honest AI analysis
          </p>
          <p className="text-[11px] text-[#1A1A1A]/35 font-bold mt-0.5">
            Market viability, competition & unit economics {"\u2014"} no
            sugar-coating.
          </p>
        </div>
      </motion.div>

      {/* PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="mb-6 flex items-center gap-3"
      >
        <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]/30 font-mono">
          Fields
        </span>
        <div className="flex-1 h-2.5 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#FF6803] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(filledCount / pitchFields.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="text-[10px] font-black text-[#1A1A1A]/40 font-mono">
          {filledCount}/{pitchFields.length}
        </span>
      </motion.div>

      {/* CATEGORY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-2 font-mono">
          <Hash size={10} /> Category
        </label>
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between bg-white/70 backdrop-blur-sm border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] transition-all cursor-pointer"
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
              className={`text-[#1A1A1A]/30 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#1A1A1A]/15 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-[#FF6803]/5 transition-colors cursor-pointer ${
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

      {/* FORM FIELDS */}
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
                className={`w-full bg-white/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 placeholder:font-normal resize-none focus:outline-none transition-all ${
                  focusedField === field.id
                    ? "border-[#FF6803] shadow-[0_0_0_3px_rgba(255,104,3,0.1)]"
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
                className={`w-full bg-white/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 placeholder:font-normal focus:outline-none transition-all ${
                  focusedField === field.id
                    ? "border-[#FF6803] shadow-[0_0_0_3px_rgba(255,104,3,0.1)]"
                    : "border-[#1A1A1A]/10 hover:border-[#1A1A1A]/25"
                }`}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* SUBMIT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 mb-8"
      >
        <motion.button
          whileHover={
            filledRequired && !isSubmitting
              ? { y: -3, transition: { type: "spring", stiffness: 400 } }
              : {}
          }
          whileTap={filledRequired && !isSubmitting ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!filledRequired || isSubmitting}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all border ${
            filledRequired && !isSubmitting
              ? "bg-linear-to-r from-[#FF8A3D] to-[#FF6803] text-white border-[#FF6803]/30 shadow-lg hover:shadow-xl cursor-pointer"
              : "bg-[#1A1A1A]/5 text-[#1A1A1A]/25 border-[#1A1A1A]/5 cursor-not-allowed"
          }`}
        >
          <Send size={16} />
          <span className="font-black">Run Validation</span>
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>

      {/* ERROR */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-8 px-4 py-3 bg-red-50 border border-red-300 rounded-xl"
        >
          <p className="text-sm font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={14} /> {submitError}
          </p>
        </motion.div>
      )}
    </div>
  );
}
