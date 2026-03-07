"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  FileCode,
  FolderTree,
  Copy,
  Check,
  Download,
  ArrowLeft,
  ChevronRight,
  Terminal,
  Database,
  Layout,
  Server,
  Sparkles,
  Package,
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const mockFiles = [
  {
    name: "app/",
    type: "folder" as const,
    children: [
      {
        name: "layout.tsx",
        type: "file" as const,
        lang: "TypeScript",
        icon: Layout,
        lines: 45,
        code: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI — ATS-Optimized Resumes",
  description: "Build perfect resumes in 30 seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
      },
      {
        name: "page.tsx",
        type: "file" as const,
        lang: "TypeScript",
        icon: FileCode,
        lines: 82,
        code: `export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">
        ResumeAI
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        ATS-optimized resumes in 30 seconds
      </p>
      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
        Get Started Free
      </button>
    </main>
  );
}`,
      },
    ],
  },
  {
    name: "prisma/",
    type: "folder" as const,
    children: [
      {
        name: "schema.prisma",
        type: "file" as const,
        lang: "Prisma",
        icon: Database,
        lines: 38,
        code: `generator client {
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
  resumes   Resume[]
  createdAt DateTime @default(now())
}

model Resume {
  id        String   @id @default(cuid())
  title     String
  content   Json
  score     Int?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}`,
      },
    ],
  },
  {
    name: "api/",
    type: "folder" as const,
    children: [
      {
        name: "generate/route.ts",
        type: "file" as const,
        lang: "TypeScript",
        icon: Server,
        lines: 24,
        code: `import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { jobDescription, experience } = await req.json();

  // TODO: Call LLM API for resume generation
  const resume = {
    sections: {
      summary: "Generated summary...",
      experience: [],
      skills: [],
    },
    atsScore: 85,
  };

  return NextResponse.json(resume);
}`,
      },
    ],
  },
];

type FileItem = {
  name: string;
  type: "file" | "folder";
  lang?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  lines?: number;
  code?: string;
  children?: FileItem[];
};

const techStack = [
  { name: "Next.js 14", color: "border-[#1A1A1A]" },
  { name: "TypeScript", color: "border-blue-500" },
  { name: "Prisma", color: "border-emerald-500" },
  { name: "Tailwind CSS", color: "border-cyan-500" },
  { name: "PostgreSQL", color: "border-indigo-500" },
];

export default function AssemblyPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(
    mockFiles[0].children![0],
  );
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(mockFiles.map((f) => f.name)),
  );

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const copyCode = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const allFiles = mockFiles.reduce((acc, folder) => {
    return acc + (folder.children?.length || 0);
  }, 0);

  const totalLines = mockFiles.reduce((acc, folder) => {
    return (
      acc + (folder.children?.reduce((sum, f) => sum + (f.lines || 0), 0) || 0)
    );
  }, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#FF6803] transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to HQ
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="w-12 h-12 bg-[#FF6803] border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] flex items-center justify-center"
              >
                <Code2 size={24} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase">
                  The Vault
                </h1>
                <p className="text-xs text-[#1A1A1A]/40 font-mono">
                  PROJECT #{id} — GENERATED MVP
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2, boxShadow: "6px 6px 0 #1A1A1A" }}
            whileTap={{ y: 0, boxShadow: "2px 2px 0 #1A1A1A" }}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 border-2 border-[#1A1A1A] shadow-[4px_4px_0_#FF6803] text-sm font-black uppercase tracking-wide hover:bg-[#FF6803] transition-colors"
          >
            <Download size={16} />
            Export All
          </motion.button>
        </div>
      </motion.div>

      {/* ===== STATS BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: "Files", value: allFiles, icon: Layers },
          { label: "Lines", value: totalLines, icon: Code2 },
          { label: "Modules", value: mockFiles.length, icon: Package },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] p-3 flex items-center gap-3"
          >
            <stat.icon size={18} className="text-[#FF6803]" />
            <div>
              <p className="text-xl font-black text-[#1A1A1A]">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== TECH STACK ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {techStack.map((tech, i) => (
          <motion.span
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`px-3 py-1.5 bg-white border-2 ${tech.color} text-xs font-black uppercase tracking-wider text-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] hover:shadow-[3px_3px_0_#FF6803] hover:-translate-y-0.5 transition-all cursor-default`}
          >
            {tech.name}
          </motion.span>
        ))}
      </motion.div>

      {/* ===== IDE LAYOUT ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[6px_6px_0_#FF6803] overflow-hidden"
      >
        {/* IDE Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b-2 border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E04B4B]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#E5A829]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#23B339]" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11px] font-mono font-bold text-white/30 uppercase tracking-wider">
              shadow-vault
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#FF6803]/60 bg-[#FF6803]/10 px-2 py-0.5 border border-[#FF6803]/20">
              AI Generated
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px] max-h-[70vh]">
          {/* File Tree */}
          <div className="w-full md:w-56 lg:w-64 border-b-2 md:border-b-0 md:border-r-2 border-[#2A2A2A] bg-[#161616] overflow-y-auto p-3 max-h-[200px] md:max-h-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6803]/40 px-2 mb-3 block">
              Explorer
            </span>
            {mockFiles.map((folder) => (
              <div key={folder.name} className="mb-1">
                <button
                  onClick={() => toggleFolder(folder.name)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 transition-colors text-white/50 hover:text-white/70 group"
                >
                  <ChevronRight
                    size={12}
                    className={`transition-transform ${
                      expandedFolders.has(folder.name) ? "rotate-90" : ""
                    }`}
                  />
                  <FolderTree
                    size={14}
                    className="text-[#FF6803] group-hover:text-[#FF8A3D]"
                  />
                  <span className="text-xs font-mono font-bold">
                    {folder.name}
                  </span>
                </button>
                <AnimatePresence>
                  {expandedFolders.has(folder.name) && folder.children && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {folder.children.map((file) => (
                        <button
                          key={file.name}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full flex items-center gap-1.5 pl-8 pr-2 py-1.5 transition-all text-xs font-mono ${
                            selectedFile?.name === file.name
                              ? "bg-[#FF6803]/15 text-[#FF6803] border-l-2 border-[#FF6803]"
                              : "text-white/40 hover:bg-white/5 hover:text-white/60"
                          }`}
                        >
                          {file.icon && (
                            <file.icon size={13} className="shrink-0" />
                          )}
                          <span className="truncate">{file.name}</span>
                          <span className="ml-auto text-[9px] text-white/15">
                            {file.lines}L
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedFile ? (
              <>
                {/* File Tab */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E1E1E] border-b-2 border-[#2A2A2A]">
                  <div className="flex items-center gap-2">
                    <FileCode size={14} className="text-[#FF6803]" />
                    <span className="text-xs font-mono font-bold text-white/70">
                      {selectedFile.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#FF6803] bg-[#FF6803]/10 px-2 py-0.5 border border-[#FF6803]/20">
                      {selectedFile.lang}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      copyCode(selectedFile.code || "", selectedFile.name)
                    }
                    className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 border transition-all ${
                      copiedFile === selectedFile.name
                        ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                        : "text-white/40 border-white/10 hover:text-white/70 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    {copiedFile === selectedFile.name ? (
                      <>
                        <Check size={12} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
                {/* Code Block */}
                <div className="flex-1 overflow-auto p-4">
                  <pre className="text-sm font-mono text-white/80 leading-relaxed whitespace-pre">
                    {selectedFile.code?.split("\n").map((line, i) => (
                      <div
                        key={i}
                        className="flex hover:bg-[#FF6803]/5 transition-colors"
                      >
                        <span className="w-10 text-right pr-4 text-white/15 select-none text-xs leading-relaxed font-bold">
                          {i + 1}
                        </span>
                        <code>{line}</code>
                      </div>
                    ))}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
                <Code2 size={32} className="text-[#FF6803]/30" />
                <span className="text-sm font-mono font-bold uppercase tracking-wider">
                  Select a file to preview
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== SETUP TERMINAL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] p-5 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={16} className="text-[#FF6803]" />
          <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
            Quick Deploy
          </h3>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-[#1A1A1A]/30 bg-[#E5E4E2] px-2 py-0.5 border border-[#1A1A1A]/10">
            <Zap size={10} />3 commands
          </div>
        </div>
        <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] p-4 font-mono text-sm space-y-2 overflow-x-auto">
          {[
            "npx create-next-app@latest my-mvp --typescript --tailwind",
            "cd my-mvp && npx prisma init",
            "npm run dev",
          ].map((cmd, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-white/70"
            >
              <span className="text-[#FF6803] font-bold">$</span>{" "}
              <span className="text-white/80">{cmd}</span>
            </motion.p>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#1A1A1A]/30 uppercase tracking-wider">
          <Sparkles size={12} className="text-[#FF6803]/50" />
          <span>Paste files into your project to launch</span>
        </div>
      </motion.div>

      {/* ===== CTA ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 mb-8 bg-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[6px_6px_0_#FF6803] p-6 text-center"
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
          Need Changes?
        </p>
        <p className="text-white font-black text-lg uppercase tracking-tight mb-4">
          Re-run the pipeline with new parameters
        </p>
        <Link href="/validator">
          <motion.button
            whileHover={{ y: -2, boxShadow: "6px 6px 0 #FF6803" }}
            whileTap={{ y: 0, boxShadow: "2px 2px 0 #FF6803" }}
            className="bg-[#FF6803] text-white px-8 py-3 border-2 border-white/20 shadow-[4px_4px_0_#FF8A3D] font-black uppercase tracking-wide text-sm hover:bg-[#FF8A3D] transition-colors"
          >
            Back to Interrogation
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
