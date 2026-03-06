"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#D1D1D1] p-2 md:p-4 lg:p-6 font-sans selection:bg-[#FF6803] selection:text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* 3D Animated Background Typography */}
      <main
        className="absolute inset-0 w-full h-full flex overflow-hidden pointer-events-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="absolute inset-0 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0"
          style={{
            transform: "translateZ(-300px) scale(1.25)",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.h1
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="text-[20vw] font-black text-[#D8D8D8] leading-[0.75] tracking-tighter select-none"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.06)" }}
          >
            SHADOW
          </motion.h1>
          <motion.h1
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="text-[20vw] font-black text-[#D8D8D8] leading-[0.75] tracking-tighter select-none ml-[10vw]"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.06)" }}
          >
            FOUNDER
          </motion.h1>
        </div>
      </main>

      {/* Floating Animated Shapes */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] w-64 h-64 bg-gradient-to-br from-[#FF8A3D]/20 to-[#FF6803]/0 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 40, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-gradient-to-bl from-white/40 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <Link
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-[#1A1A1A] font-bold text-sm bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white hover:bg-white transition-colors shadow-sm"
      >
        <ArrowLeft size={16} /> Home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
        className="relative z-20 w-full max-w-md flex flex-col items-center"
      >
        <div className="flex items-center gap-3 mb-4">
        
          <div className="flex gap-1 leading-none">
            <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#1A1A1A] uppercase">
              Shadow
            </span>
            <span className="font-bold animate-pulse text-xl md:text-2xl tracking-tighter text-[#FF6803] uppercase">
              Founder
            </span>
          </div>
        </div>

        {/* The Auth Container */}
        <div className="w-full flex justify-center">{children}</div>
      </motion.div>
    </div>
  );
}
