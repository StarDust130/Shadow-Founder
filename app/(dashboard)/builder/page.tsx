"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Database,
  Layout,
  Server,
  Copy,
  Check,
  Sparkles,
  FileCode2,
  Terminal,
  ChevronRight,
} from "lucide-react";

const tabs = [
  { id: "schema", label: "Database Schema", icon: Database },
  { id: "frontend", label: "Frontend Component", icon: Layout },
  { id: "api", label: "API Route", icon: Server },
];

const codeSnippets: Record<
  string,
  { filename: string; language: string; code: string }
> = {
  schema: {
    filename: "prisma/schema.prisma",
    language: "prisma",
    code: `// Shadow Founder — Generated Schema
// Auto-generated MVP database schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  plan      Plan     @default(FREE)
  credits   Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  projects  Project[]
  analyses  Analysis[]
}

model Project {
  id          String   @id @default(cuid())
  title       String
  pitch       String   @db.Text
  category    String
  status      Status   @default(PENDING)
  score       Int?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  analysis    Analysis?
  codeOutput  CodeOutput?
}

model Analysis {
  id           String   @id @default(cuid())
  projectId    String   @unique
  project      Project  @relation(fields: [projectId], references: [id])
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  tam          String?
  sam          String?
  competitors  Json?
  strengths    Json?
  weaknesses   Json?
  verdict      String?  @db.Text
  createdAt    DateTime @default(now())
}

model CodeOutput {
  id         String   @id @default(cuid())
  projectId  String   @unique
  project    Project  @relation(fields: [projectId], references: [id])
  schema     String?  @db.Text
  frontend   String?  @db.Text
  api        String?  @db.Text
  createdAt  DateTime @default(now())
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

enum Status {
  PENDING
  VIABLE
  SATURATED
  FAILED
}`,
  },
  frontend: {
    filename: "components/landing-hero.tsx",
    language: "tsx",
    code: `// Shadow Founder — Generated Component
// Production-ready landing page hero

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center
      justify-center overflow-hidden bg-neutral-50">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(
        rgba(0,0,0,0.03)_1px,transparent_1px),
        linear-gradient(90deg,rgba(0,0,0,0.03)_1px,
        transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6
        text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4
            py-2 bg-orange-500/10 border-2 border-orange-500/30
            rounded-full mb-8">
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600
              uppercase tracking-wider">
              AI-Powered Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black
            tracking-tighter text-neutral-900 leading-[0.9]
            mb-6">
            Build Your
            <br />
            <span className="text-orange-500">MVP</span> Fast
            <span className="text-orange-500">.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg text-neutral-500 max-w-2xl
            mx-auto mb-10 font-medium">
            Validate startup ideas with AI, get market
            analysis, and generate production-ready code
            in minutes.
          </p>

          {/* CTA */}
          <Link href="/dashboard">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8
                py-4 bg-orange-500 text-white font-bold
                rounded-xl border-2 border-neutral-900
                shadow-[4px_4px_0_#1a1a1a]
                hover:shadow-[6px_6px_0_#1a1a1a]
                transition-shadow text-sm uppercase
                tracking-wider"
            >
              Get Started
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}`,
  },
  api: {
    filename: "app/api/validate/route.ts",
    language: "typescript",
    code: `// Shadow Founder — Generated API Route
// Startup validation endpoint with AI analysis

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface ValidationRequest {
  idea: string;
  target: string;
  problem: string;
  revenue?: string;
  competitors?: string;
  category: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: ValidationRequest = await req.json();

    // Validate required fields
    if (!body.idea || !body.target || !body.problem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: body.idea.slice(0, 60),
        pitch: body.idea,
        category: body.category,
        userId: userId,
      },
    });

    // TODO: Call AI model for analysis
    const score = Math.floor(Math.random() * 100);
    const status = score >= 50 ? "VIABLE" : "SATURATED";

    // Update project with results
    await prisma.project.update({
      where: { id: project.id },
      data: { score, status },
    });

    // Deduct credit
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });

    return NextResponse.json({
      projectId: project.id,
      score,
      status,
      message: "Validation complete",
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}`,
  },
};

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState("schema");
  const [copied, setCopied] = useState(false);

  const currentCode = codeSnippets[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting using spans
  const highlightCode = (code: string) => {
    return code.split("\n").map((line, i) => {
      // Comments
      if (line.trimStart().startsWith("//")) {
        return (
          <span key={i} className="text-emerald-400/60">
            {line}
          </span>
        );
      }

      // Keywords
      const parts: React.ReactNode[] = [];
      const keywords =
        /\b(import|export|from|const|let|var|function|return|async|await|try|catch|if|else|new|default|interface|enum|model|generator|datasource|type|extends|implements|class|throw)\b/g;
      const strings = /("[^"]*"|'[^']*'|`[^`]*`)/g;
      const decorators = /(@\w+)/g;
      const types =
        /\b(String|Int|Boolean|DateTime|Json|User|Project|Analysis|CodeOutput|Plan|Status|NextRequest|NextResponse)\b/g;

      let lastIndex = 0;
      const allMatches: {
        start: number;
        end: number;
        type: string;
        text: string;
      }[] = [];

      // Collect all matches
      let m;
      while ((m = keywords.exec(line)) !== null)
        allMatches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: "keyword",
          text: m[0],
        });
      keywords.lastIndex = 0;

      while ((m = strings.exec(line)) !== null)
        allMatches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: "string",
          text: m[0],
        });
      strings.lastIndex = 0;

      while ((m = decorators.exec(line)) !== null)
        allMatches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: "decorator",
          text: m[0],
        });
      decorators.lastIndex = 0;

      while ((m = types.exec(line)) !== null)
        allMatches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: "type",
          text: m[0],
        });
      types.lastIndex = 0;

      // Sort by position, filter overlapping
      allMatches.sort((a, b) => a.start - b.start);
      const filtered: typeof allMatches = [];
      let maxEnd = -1;
      for (const match of allMatches) {
        if (match.start >= maxEnd) {
          filtered.push(match);
          maxEnd = match.end;
        }
      }

      if (filtered.length === 0) {
        return (
          <span key={i} className="text-white/70">
            {line}
          </span>
        );
      }

      for (const match of filtered) {
        if (match.start > lastIndex) {
          parts.push(
            <span key={`${i}-t-${lastIndex}`} className="text-white/70">
              {line.slice(lastIndex, match.start)}
            </span>,
          );
        }
        const colorClass =
          match.type === "keyword"
            ? "text-purple-400"
            : match.type === "string"
              ? "text-amber-300"
              : match.type === "decorator"
                ? "text-yellow-400"
                : "text-sky-400";

        parts.push(
          <span key={`${i}-m-${match.start}`} className={colorClass}>
            {match.text}
          </span>,
        );
        lastIndex = match.end;
      }
      if (lastIndex < line.length) {
        parts.push(
          <span key={`${i}-e`} className="text-white/70">
            {line.slice(lastIndex)}
          </span>,
        );
      }

      return <span key={i}>{parts}</span>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ rotate: 12 }}
            className="w-11 h-11 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
          >
            <Code2 size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase">
              Code Builder
            </h1>
            <p className="text-[10px] text-[#1A1A1A]/40 font-bold uppercase tracking-[0.2em] font-mono">
              Generated MVP code for your startup
            </p>
          </div>
        </div>
        <div className="h-[3px] bg-[#1A1A1A] rounded-full" />
      </motion.div>

      {/* ═══ TAB SWITCHER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-2 mb-6"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -3, x: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all border-2 flex-1 justify-center sm:justify-start ${
                isActive
                  ? "bg-[#FF6803] text-white border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A]"
                  : "bg-white text-[#1A1A1A]/50 border-[#1A1A1A]/10 hover:border-[#1A1A1A] hover:shadow-[3px_3px_0_#1A1A1A] hover:text-[#1A1A1A]"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">
                {tab.label.split(" ")[0]}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ═══ CODE EDITOR ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <div className="bg-[#0D0D0D] rounded-2xl border-2 border-[#1A1A1A] shadow-[8px_8px_0_#1A1A1A] overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161616] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1">
                  <FileCode2 size={12} className="text-[#FF6803]" />
                  <span className="text-[11px] font-mono font-bold text-white/50">
                    {currentCode.filename}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy size={12} className="text-white/40" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Copy
                    </span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Code Content */}
            <div className="p-5 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono">
                <code>
                  {highlightCode(currentCode.code).map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-right mr-4 text-white/10 select-none text-xs shrink-0">
                        {i + 1}
                      </span>
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-white/15 uppercase tracking-widest font-mono">
                  {currentCode.language}
                </span>
                <span className="text-white/5">|</span>
                <span className="text-[9px] font-bold text-white/15 font-mono">
                  {currentCode.code.split("\n").length} lines
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} className="text-[#FF6803]/40" />
                <span className="text-[9px] font-bold text-white/15 uppercase tracking-widest font-mono">
                  AI Generated
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ═══ INFO CARDS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 mb-4"
      >
        {[
          {
            title: "Production Ready",
            desc: "Code follows Next.js 16 best practices with App Router",
            icon: Terminal,
          },
          {
            title: "Type Safe",
            desc: "Full TypeScript with strict mode enabled",
            icon: Code2,
          },
          {
            title: "Copy & Deploy",
            desc: "Paste into your project and deploy to Vercel instantly",
            icon: ChevronRight,
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            whileHover={{ y: -4, x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#FF6803] transition-shadow cursor-default"
          >
            <card.icon size={16} className="text-[#FF6803] mb-2" />
            <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-tight mb-1">
              {card.title}
            </h3>
            <p className="text-[11px] text-[#1A1A1A]/40 font-medium">
              {card.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
