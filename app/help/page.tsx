"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Crosshair,
  Code2,
  Package,
  MessageCircle,
  Crown,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const sections = [
  {
    emoji: "🚀",
    title: "What is Shadow Founder?",
    content: `Shadow Founder is your **AI co-founder** that helps you validate startup ideas and build MVP landing pages — all in one place.

No fluff. No bias. Just brutal, honest AI analysis of your idea's potential.

Think of it as having a seasoned VC partner + a developer, available 24/7.`,
  },
  {
    emoji: "🎯",
    title: "How to Validate an Idea",
    steps: [
      { emoji: "1️⃣", text: 'Go to the **Validator** page from the sidebar' },
      { emoji: "2️⃣", text: "Pick a **category** (SaaS, FinTech, AI/ML, etc.)" },
      { emoji: "3️⃣", text: "Fill in your **startup idea**, **target audience**, and **problem it solves**" },
      { emoji: "4️⃣", text: "Optionally add **revenue model** and **competitors**" },
      { emoji: "5️⃣", text: 'Hit **"Run Validation"** and watch the AI analyze your pitch' },
      { emoji: "✅", text: "Get a detailed **score (0-100)**, strengths, weaknesses, and actionable recommendations" },
    ],
  },
  {
    emoji: "💬",
    title: "AI Chat Follow-ups",
    content: `After your idea is validated, you can **chat with the AI** to dig deeper.

Ask things like:
- "How should I price this?"
- "Who are my biggest competitors?"
- "What's the best go-to-market strategy?"

The AI remembers your full analysis and gives contextual answers. It's like having a strategy session with a VC.`,
  },
  {
    emoji: "🏗️",
    title: "Building Your MVP",
    steps: [
      { emoji: "1️⃣", text: 'Go to the **Builder** page' },
      { emoji: "2️⃣", text: "Select one of your **validated ideas**" },
      { emoji: "3️⃣", text: 'Click **"Generate Landing Page"**' },
      { emoji: "4️⃣", text: "The AI generates a **full HTML/CSS/JS landing page** with modern design" },
      { emoji: "5️⃣", text: "Preview it live, copy the code, or **download as ZIP**" },
    ],
  },
  {
    emoji: "📦",
    title: "Assembly (Code Viewer)",
    content: `Once your MVP is generated, the **Assembly** page lets you:

- 📂 Browse all generated files in a **file tree**
- 👀 **Preview** the landing page live in your browser
- 📋 **Copy** individual file code
- 📥 **Download** everything as a **ZIP file**

It's your mini code editor — no setup needed.`,
  },
  {
    emoji: "💰",
    title: "Credits & Plans",
    content: `**Free Plan** — ₹0 forever
- ✅ Unlimited idea validations
- ✅ AI chat follow-ups
- ✅ 1 MVP build credit
- ✅ Basic code generation

**Pro Plan** — ₹1,999 one-time
- ✅ Everything in Free
- ✅ 10 MVP build credits
- ✅ Priority AI analysis
- ✅ Advanced code generation
- ✅ Premium landing pages
- ✅ Priority support

You can see your remaining credits in the **top navigation bar**.`,
  },
  {
    emoji: "📧",
    title: "Need Help or Free Credits?",
    content: `If you run out of credits or need help, go to your **Profile** page and click **"Request Free Credit"**.

This opens an email to our team with your account details pre-filled. We usually respond within 24 hours.

For bugs or issues, use the **"Report Bug"** button on error pages, or email us directly at **chandanbsd9@gmail.com**.`,
  },
  {
    emoji: "⚡",
    title: "Tips for Best Results",
    steps: [
      { emoji: "💡", text: "Be **specific** with your idea — the more detail, the better the analysis" },
      { emoji: "🎯", text: "Define a **clear target audience** — not just \"everyone\"" },
      { emoji: "😈", text: "Don't sugarcoat the **problem** — be honest about what you're solving" },
      { emoji: "💵", text: "Include a **revenue model** — even a rough one helps the AI give better advice" },
      { emoji: "🔍", text: "List **competitors** — this helps the AI assess your differentiation" },
      { emoji: "💬", text: "Use **AI chat** to explore angles you hadn't considered" },
    ],
  },
];

const AI_SUMMARY = `🤖 **Quick Summary for AI Assistants**

Shadow Founder (https://shadow-founder.vercel.app) is a SaaS tool that:

1. **Validates startup ideas** — Users submit a pitch (idea, target audience, problem, revenue model, competitors) and an AI scores it 0-100 with detailed analysis including market size, competition, revenue potential, and feasibility.

2. **Generates MVP landing pages** — Using the validated idea as context, AI generates a complete HTML/CSS/JS landing page with modern design that can be previewed, copied, or downloaded.

3. **AI Chat** — After validation, users can have follow-up conversations with the AI about their idea to get deeper strategic insights.

**Tech Stack**: Next.js, React, TypeScript, Tailwind CSS, Clerk Auth, MongoDB, Groq AI (validation), Gemini AI (code generation).

**Plans**: Free (unlimited validations, 1 build) and Pro ₹1,999 (10 builds, priority features).`;

export default function HelpPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(AI_SUMMARY.replace(/\*\*/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#E5E4E2] font-sans selection:bg-[#FF6803] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 px-4 md:px-8 flex items-center justify-between bg-[#E5E4E2]/80 backdrop-blur-2xl border-b border-[#1A1A1A]/6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 6 }}
              className="w-7 h-7 bg-[#FF6803] grid grid-cols-2 gap-0.5 p-0.5 rounded-md border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] group-hover:shadow-[3px_3px_0_#FF6803] transition-shadow"
            >
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
            </motion.div>
            <span className="font-black text-sm tracking-tight text-[#1A1A1A]">
              Shadow Founder<span className="text-[#FF6803]">.</span>
            </span>
          </Link>
          <span className="text-[#1A1A1A]/10 text-xs">/</span>
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            Help
          </span>
        </div>
        <Link href="/dashboard">
          <motion.div
            whileHover={{ x: -2 }}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 hover:text-[#FF6803] transition-colors cursor-pointer"
          >
            <ArrowLeft size={12} /> Dashboard
          </motion.div>
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
            <Zap size={10} /> Guide
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
            How it Works<span className="text-[#FF6803]">.</span>
          </h1>
          <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
            Everything you need to know about Shadow Founder, explained simply.
          </p>
        </motion.div>

        {/* Quick Nav */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {[
            { icon: Crosshair, label: "Validate", color: "#FF6803" },
            { icon: MessageCircle, label: "Chat", color: "#8B5CF6" },
            { icon: Code2, label: "Build", color: "#22C55E" },
            { icon: Package, label: "Assembly", color: "#3B82F6" },
            { icon: Crown, label: "Plans", color: "#F59E0B" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-[#1A1A1A]/8 rounded-full text-[9px] font-black uppercase tracking-wider text-[#1A1A1A]/40"
            >
              <item.icon size={10} style={{ color: item.color }} />
              {item.label}
            </div>
          ))}
        </motion.div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#FF6803] transition-all cursor-pointer group text-left"
              >
                <span className="text-xl">{section.emoji}</span>
                <span className="flex-1 text-sm font-black text-[#1A1A1A] uppercase tracking-tight">
                  {section.title}
                </span>
                <motion.div
                  animate={{ rotate: expandedSection === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-[#1A1A1A]/30 group-hover:text-[#FF6803] transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedSection === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-3 ml-4 border-l-2 border-[#FF6803]/20">
                      {"content" in section && section.content && (
                        <div className="text-xs text-[#1A1A1A]/60 font-bold leading-relaxed whitespace-pre-line">
                          {section.content.split("**").map((part, j) =>
                            j % 2 === 1 ? (
                              <span key={j} className="text-[#1A1A1A] font-black">
                                {part}
                              </span>
                            ) : (
                              <span key={j}>{part}</span>
                            ),
                          )}
                        </div>
                      )}
                      {"steps" in section && section.steps && (
                        <div className="space-y-2.5">
                          {section.steps.map((step, j) => (
                            <div
                              key={j}
                              className="flex items-start gap-2.5 text-xs text-[#1A1A1A]/60 font-bold"
                            >
                              <span className="text-sm shrink-0">{step.emoji}</span>
                              <span className="leading-relaxed">
                                {step.text.split("**").map((part, k) =>
                                  k % 2 === 1 ? (
                                    <span key={k} className="text-[#1A1A1A] font-black">
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={k}>{part}</span>
                                  ),
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* AI Summary Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-8"
        >
          <motion.button
            onClick={() => setShowAiSummary(!showAiSummary)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-linear-to-r from-[#FF8A3D] to-[#FF6803] text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] hover:shadow-[5px_5px_0_#1A1A1A] transition-shadow cursor-pointer"
          >
            <Sparkles size={14} />
            {showAiSummary ? "Hide" : "Show"} AI-Friendly Summary
            <span className="text-white/60 text-[9px]">(for ChatGPT, Gemini, Claude)</span>
          </motion.button>

          <AnimatePresence>
            {showAiSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] p-5 relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1A1A1A]/25 font-mono flex items-center gap-1.5">
                      🤖 AI Context Summary
                    </p>
                    <motion.button
                      onClick={handleCopySummary}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/30 hover:text-[#FF6803] transition-colors cursor-pointer"
                    >
                      {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                      {copied ? "Copied!" : "Copy"}
                    </motion.button>
                  </div>
                  <div className="text-xs text-[#1A1A1A]/60 font-bold leading-relaxed whitespace-pre-line">
                    {AI_SUMMARY.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <span key={i} className="text-[#1A1A1A] font-black">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[9px] text-[#1A1A1A]/20 font-bold">
                    <ExternalLink size={9} />
                    Copy this and paste it into ChatGPT, Gemini, or Claude to give them context about Shadow Founder
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-[#1A1A1A]/6">
          <p className="text-[10px] font-bold text-[#1A1A1A]/20 uppercase tracking-widest">
            Built with 🧡 by Shadow Founder Team
          </p>
        </div>
      </div>
    </div>
  );
}
