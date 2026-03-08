"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Sparkles,
  Package,
  Layers,
  Zap,
  Loader2,
  Eye,
  Crown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BuildFile {
  path: string;
  content: string;
  lang: string;
  lines: number;
}

interface BuildData {
  _id: string;
  ideaTitle: string;
  techStack: string[];
  files: BuildFile[];
  status: string;
}

interface FolderNode {
  name: string;
  type: "folder";
  children: (FolderNode | FileNode)[];
}

interface FileNode {
  name: string;
  type: "file";
  file: BuildFile;
}

function buildFileTree(files: BuildFile[]): (FolderNode | FileNode)[] {
  const root: (FolderNode | FileNode)[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        current.push({ name: part, type: "file", file });
      } else {
        let folder = current.find(
          (n) => n.type === "folder" && n.name === part,
        ) as FolderNode | undefined;
        if (!folder) {
          folder = { name: part, type: "folder", children: [] };
          current.push(folder);
        }
        current = folder.children;
      }
    }
  }

  return root;
}

const LOADING_GIFS = [
  "https://media.tenor.com/KeqbuC5yrgUAAAAm/deal-with-it-trailblazer.webp",
  "https://media.tenor.com/hYkRcm80JFwAAAAj/foxy-foxplushy.gif",
  "https://media.tenor.com/KOQYL00kmYEAAAAm/happy-holidays.webp",
  "https://media.tenor.com/v-eI1P9681IAAAAm/goose-dance.webp",
];

const waitTexts = [
  "Unpacking your vault...",
  "Polishing the code...",
  "Assembling the pieces...",
  "Almost there, hang tight!",
  "Loading your masterpiece...",
];

export default function AssemblyPage() {
  const params = useParams();
  const id = params.id as string;

  const [build, setBuild] = useState<BuildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<BuildFile | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [downloading, setDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [currentGif, setCurrentGif] = useState(0);
  const [currentWaitText, setCurrentWaitText] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const res = await fetch(`/api/builds/${id}`);
        if (!res.ok) throw new Error("Build not found");
        const data = await res.json();
        setBuild(data);
        if (data.files?.length > 0) {
          const preview = data.files.find((f: BuildFile) => f.path === "preview.html");
          if (preview) {
            setSelectedFile(preview);
            setViewMode("preview");
          } else {
            setSelectedFile(data.files[0]);
          }
        }
        // Expand all top-level folders
        const tree = buildFileTree(data.files || []);
        setExpandedFolders(
          new Set(tree.filter((n) => n.type === "folder").map((n) => n.name)),
        );
      } catch {
        setError("Could not load build. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuild();
  }, [id]);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    const gifInterval = setInterval(() => {
      setCurrentGif((g) => (g + 1) % LOADING_GIFS.length);
      setCurrentWaitText((t) => (t + 1) % waitTexts.length);
    }, 3000);
    return () => clearInterval(gifInterval);
  }, [loading]);

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

  const downloadZip = useCallback(async () => {
    if (!build) return;
    setDownloading(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const file of build.files) {
        zip.file(file.path, file.content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${
        build.ideaTitle
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 30) || "mvp"
      }-project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to create zip. Try copying files individually.");
    } finally {
      setDownloading(false);
    }
  }, [build]);

  if (loading) {
    const mins = Math.floor(elapsedTime / 60);
    const secs = elapsedTime % 60;
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6 p-8 max-w-sm text-center">
          <div className="w-32 h-32 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOADING_GIFS[currentGif]}
              alt="Loading"
              className="w-28 h-28 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide mb-1">
              {waitTexts[currentWaitText]}
            </p>
            <p className="text-xs text-[#1A1A1A]/40 font-mono font-bold">
              {mins > 0
                ? `${mins}m ${secs.toString().padStart(2, "0")}s`
                : `${secs}s`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-[#FF6803]" />
            <span className="text-[11px] font-bold text-[#1A1A1A]/50">
              Opening the vault...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !build) {
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

  const fileTree = buildFileTree(build.files);
  const allFiles = build.files.length;
  const totalLines = build.files.reduce((sum, f) => sum + (f.lines || 0), 0);

  // Find preview.html for iframe preview
  const previewFile = build.files.find((f) => f.path === "preview.html");

  const renderTreeNode = (node: FolderNode | FileNode, depth = 0) => {
    if (node.type === "folder") {
      return (
        <div key={node.name}>
          <button
            onClick={() => toggleFolder(node.name)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 transition-colors text-white/50 hover:text-white/70 group cursor-pointer"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <ChevronRight
              size={12}
              className={`transition-transform ${expandedFolders.has(node.name) ? "rotate-90" : ""}`}
            />
            <FolderTree
              size={14}
              className="text-[#FF6803] group-hover:text-[#FF8A3D]"
            />
            <span className="text-xs font-mono font-bold">{node.name}/</span>
          </button>
          <AnimatePresence>
            {expandedFolders.has(node.name) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {node.children.map((child) => renderTreeNode(child, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <button
        key={node.file.path}
        onClick={() => setSelectedFile(node.file)}
        className={`w-full flex items-center gap-1.5 pr-2 py-1.5 transition-all text-xs font-mono cursor-pointer ${
          selectedFile?.path === node.file.path
            ? "bg-[#FF6803]/15 text-[#FF6803] border-l-2 border-[#FF6803]"
            : "text-white/40 hover:bg-white/5 hover:text-white/60"
        }`}
        style={{ paddingLeft: `${24 + depth * 16}px` }}
      >
        <FileCode size={13} className="shrink-0" />
        <span className="truncate">{node.name}</span>
        <span className="ml-auto text-[9px] text-white/15">
          {node.file.lines}L
        </span>
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
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
                <p className="text-xs text-[#1A1A1A]/40 font-mono truncate max-w-[300px]">
                  {build.ideaTitle}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ y: -2, boxShadow: "6px 6px 0 #1A1A1A" }}
            whileTap={{ y: 0, boxShadow: "2px 2px 0 #1A1A1A" }}
            onClick={downloadZip}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 border-2 border-[#1A1A1A] shadow-[4px_4px_0_#FF6803] text-sm font-black uppercase tracking-wide hover:bg-[#FF6803] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {downloading ? "Zipping..." : "Download ZIP"}
          </motion.button>
        </div>
      </motion.div>

      {/* UPGRADE BANNER */}
      <Link href="/profile">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          whileHover={{ y: -4, x: -2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="mb-6 bg-linear-to-r from-[#FF6803] to-[#FF8A3D] border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[4px_4px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] transition-all cursor-pointer relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] shrink-0">
              <Crown size={18} className="text-[#FF6803]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                Want Real Production Code?
              </h3>
              <p className="text-[11px] text-white/70 font-bold mt-0.5">
                Upgrade now for production-ready codebases, premium designs & priority AI generation
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-white text-[#FF6803] px-3 py-2 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] font-black text-[10px] uppercase tracking-wider shrink-0 group-hover:shadow-[3px_3px_0_#1A1A1A] transition-shadow">
              <Crown size={12} /> Upgrade Now
            </div>
            <ArrowRight size={18} className="text-white/50 sm:hidden shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </Link>

      {/* STATS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: "Files", value: allFiles, icon: Layers },
          { label: "Lines", value: totalLines, icon: Code2 },
          { label: "Modules", value: build.techStack.length, icon: Package },
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

      {/* TECH STACK */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {build.techStack.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="px-3 py-1.5 bg-white border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-wider text-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] hover:shadow-[3px_3px_0_#FF6803] hover:-translate-y-0.5 transition-all cursor-default"
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>

      {/* IDE LAYOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[6px_6px_0_#FF6803] overflow-hidden"
      >
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
            <button
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1.5 border transition-all rounded cursor-pointer ${
                viewMode === "code"
                  ? "text-[#FF6803] border-[#FF6803]/40 bg-[#FF6803]/10"
                  : "text-white/30 border-white/10 hover:text-white/50"
              }`}
            >
              <Code2 size={12} /> Code
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1.5 border transition-all rounded cursor-pointer ${
                viewMode === "preview"
                  ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
                  : "text-white/30 border-white/10 hover:text-white/50"
              }`}
            >
              <Eye size={12} /> Preview
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px] max-h-[70vh]">
          {viewMode === "code" ? (
            <>
              {/* File Tree */}
              <div className="w-full md:w-56 lg:w-64 border-b-2 md:border-b-0 md:border-r-2 border-[#2A2A2A] bg-[#161616] overflow-y-auto p-3 max-h-[200px] md:max-h-none">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6803]/40 px-2 mb-3 block">
                  Explorer
                </span>
                {fileTree.map((node) => renderTreeNode(node))}
              </div>

              {/* Code Viewer */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {selectedFile ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E1E1E] border-b-2 border-[#2A2A2A]">
                      <div className="flex items-center gap-2">
                        <FileCode size={14} className="text-[#FF6803]" />
                        <span className="text-xs font-mono font-bold text-white/70">
                          {selectedFile.path}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#FF6803] bg-[#FF6803]/10 px-2 py-0.5 border border-[#FF6803]/20">
                          {selectedFile.lang}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyCode(selectedFile.content, selectedFile.path)
                        }
                        className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 border transition-all cursor-pointer ${
                          copiedFile === selectedFile.path
                            ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                            : "text-white/40 border-white/10 hover:text-white/70 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        {copiedFile === selectedFile.path ? (
                          <>
                            <Check size={12} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy
                          </>
                        )}
                      </motion.button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <pre className="text-sm font-mono text-white/80 leading-relaxed whitespace-pre">
                        {selectedFile.content?.split("\n").map((line, i) => (
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
            </>
          ) : (
            /* Live Preview via iframe */
            <div className="flex-1 min-h-[500px] bg-white">
              {previewFile ? (
                <iframe
                  srcDoc={previewFile.content}
                  title="Landing Page Preview"
                  className="w-full h-full min-h-[500px] border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] text-[#1A1A1A]/30 gap-4 p-8">
                  <Eye size={40} className="text-[#FF6803]/30" />
                  <p className="text-sm font-black uppercase tracking-wider text-center">
                    Preview not available
                  </p>
                  <p className="text-xs text-center max-w-sm">
                    This build doesn&apos;t include a preview file. Try rebuilding your MVP from the Code Builder to generate a live landing page preview.
                  </p>
                  <Link href="/builder">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#FF6803] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-all cursor-pointer"
                    >
                      <Sparkles size={14} /> Rebuild MVP
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* SETUP TERMINAL */}
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
            "# Copy generated files into your project",
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
          <span>Download the ZIP and extract into your project</span>
        </div>
      </motion.div>

      {/* CTA */}
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
            className="bg-[#FF6803] text-white px-8 py-3 border-2 border-white/20 shadow-[4px_4px_0_#FF8A3D] font-black uppercase tracking-wide text-sm hover:bg-[#FF8A3D] transition-colors cursor-pointer"
          >
            Back to Interrogation
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
