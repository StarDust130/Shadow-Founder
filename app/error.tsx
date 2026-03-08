"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Mail, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorEmail = `mailto:chandanbsd9@gmail.com?subject=${encodeURIComponent("Bug Report — Shadow Founder")}&body=${encodeURIComponent(`Hi,\n\nI encountered an error while using Shadow Founder.\n\nError: ${error.message || "Unknown error"}\nDigest: ${error.digest || "N/A"}\nPage: ${typeof window !== "undefined" ? window.location.href : "Unknown"}\nTime: ${new Date().toISOString()}\n\nPlease look into this.\n\nThank you!`)}`;

  return (
    <div className="min-h-screen bg-[#E5E4E2] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-red-200"
        >
          <AlertTriangle size={36} className="text-red-500" />
        </motion.div>

        <h1 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tight mb-2">
          Oops<span className="text-[#FF6803]">!</span>
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 font-bold mb-6">
          Something broke. Don&apos;t worry — it&apos;s not you, it&apos;s us.
        </p>

        <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0_#1A1A1A] mb-6 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-2 font-mono">
            Error Details
          </p>
          <p className="text-xs font-bold text-red-600/70 break-all">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-[#1A1A1A]/20 mt-2">
              ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={reset}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF6803] text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-shadow cursor-pointer"
          >
            <RotateCcw size={14} /> Try Again
          </motion.button>

          <a href={errorEmail} className="flex-1">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-3 bg-white text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#FF6803] transition-shadow cursor-pointer"
            >
              <Mail size={14} className="text-[#FF6803]" /> Report Bug
            </motion.div>
          </a>
        </div>

        <Link href="/dashboard">
          <motion.div
            whileHover={{ y: -1 }}
            className="mt-4 flex items-center justify-center gap-2 py-2.5 text-[#1A1A1A]/40 font-bold text-xs uppercase tracking-wider hover:text-[#FF6803] transition-colors cursor-pointer"
          >
            <Home size={12} /> Back to Dashboard
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
