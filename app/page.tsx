"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  Menu,
  X as XIcon,
  MousePointer2,
  Layers,
  CheckCircle2,
  XOctagon,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Rocket,
  Globe,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="bg-white/60 backdrop-blur-sm border border-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer group"
      >
        <span className="text-sm md:text-base font-bold text-[#1A1A1A] pr-4 group-hover:text-[#FF6803] transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-8 h-8 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center group-hover:bg-[#FF6803]/10 transition-colors"
        >
          {isOpen ? (
            <Minus size={16} className="text-[#FF6803]" />
          ) : (
            <Plus size={16} className="text-[#1A1A1A]/50" />
          )}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-[#1A1A1A]/60 font-medium leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Universal redirect logic for all buttons
  const routeToDashboard = () => {
    window.location.href = isSignedIn ? "/dashboard" : "/sign-up";
  };

  return (
    // Outer Canvas
    <div className="min-h-screen bg-[#D1D1D1] p-4 md:p-6 lg:p-8 font-sans selection:bg-[#FF6803] selection:text-white flex flex-col items-center scroll-smooth">
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-linear-to-r from-[#FF6803] via-[#FF8C42] to-[#FF6803] origin-left z-[100]"
      />

      {/* BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[99] w-12 h-12 md:w-14 md:h-14 bg-[#1A1A1A] hover:bg-[#FF6803] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_8px_25px_rgba(255,104,3,0.4)] hover:-translate-y-1 transition-all cursor-pointer group"
            aria-label="Back to top"
          >
            <ArrowUp size={20} className="group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* GLOBAL ANIMATED BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating gradient orbs */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[#FF6803]/[0.04] blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 30, 0],
            y: [0, 50, -80, 0],
            scale: [1, 0.8, 1.15, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full bg-[#4D96FF]/[0.04] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 40, -60, 0], y: [0, -40, 60, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] left-[20%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-[#6BCB77]/[0.03] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 50, 0], y: [0, 70, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] left-[60%] w-[180px] h-[180px] md:w-[350px] md:h-[350px] rounded-full bg-[#C084FC]/[0.03] blur-[100px]"
        />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ rotate: 360, y: [0, -20, 0] }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-[15%] right-[15%] w-16 h-16 md:w-24 md:h-24 border-2 border-[#FF6803]/[0.08] rounded-2xl"
        />
        <motion.div
          animate={{ rotate: -360, x: [0, 15, 0] }}
          transition={{
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-[45%] left-[8%] w-12 h-12 md:w-20 md:h-20 border-2 border-[#1A1A1A]/[0.05] rounded-full"
        />
        <motion.div
          animate={{ rotate: 180, y: [0, 25, 0] }}
          transition={{
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-[25%] right-[10%] w-10 h-10 md:w-16 md:h-16 border-2 border-[#FF6803]/[0.06]"
        />
        <motion.div
          animate={{ rotate: -180, x: [0, -20, 0] }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            x: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-[70%] left-[35%] w-8 h-8 md:w-14 md:h-14 border-2 border-[#4D96FF]/[0.06] rounded-xl"
        />

        {/* Small floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30 - i * 10, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            className="absolute rounded-full bg-[#FF6803]"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              top: `${15 + i * 14}%`,
              left: `${10 + i * 15}%`,
              opacity: 0.15,
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #1A1A1A 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* INNER FRAME - The Main App Window */}
      <div className="relative z-10 w-full max-w-[1800px] bg-[#E3E3E3] rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-white/50">
        {/* INNER ANIMATED BG ELEMENTS */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
          {/* Slow-moving gradient blobs inside the frame */}
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
              scale: [1, 1.3, 0.85, 1],
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[5%] right-[10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#FF6803]/15 blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -70, 40, 0],
              y: [0, 60, -90, 0],
              scale: [1, 0.9, 1.2, 1],
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[35%] left-[5%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-[#4D96FF]/10 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 50, -30, 0], y: [0, -50, 70, 0] }}
            transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[15%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-[#6BCB77]/10 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -40, 60, 0], y: [0, 80, -40, 0] }}
            transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[65%] left-[40%] w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full bg-[#C084FC]/10 blur-[100px]"
          />

          {/* Floating geometric outlines */}
          <motion.div
            animate={{ rotate: 360, y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-[20%] right-[20%] w-20 h-20 md:w-32 md:h-32 border-2 border-[#FF6803]/20 rounded-3xl"
          />
          <motion.div
            animate={{ rotate: -360, y: [0, 20, 0] }}
            transition={{
              rotate: { duration: 50, repeat: Infinity, ease: "linear" },
              y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-[50%] left-[6%] w-14 h-14 md:w-24 md:h-24 border-2 border-[#1A1A1A]/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: 180, x: [0, -20, 0], y: [0, 25, 0] }}
            transition={{
              rotate: { duration: 70, repeat: Infinity, ease: "linear" },
              x: { duration: 9, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute bottom-[30%] right-[8%] w-10 h-10 md:w-20 md:h-20 border-2 border-[#4D96FF]/15 rotate-45"
          />
          <motion.div
            animate={{ rotate: -90, y: [0, -15, 0] }}
            transition={{
              rotate: { duration: 55, repeat: Infinity, ease: "linear" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-[75%] left-[25%] w-8 h-8 md:w-16 md:h-16 border-2 border-[#FF6803]/15 rounded-xl"
          />

          {/* Floating sparkle dots */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`inner-dot-${i}`}
              animate={{
                y: [0, -(20 + i * 8), 0],
                x: [0, i % 2 === 0 ? 12 : -12, 0],
                opacity: [0.08, 0.25, 0.08],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 6 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
              className="absolute rounded-full bg-[#FF6803]"
              style={{
                width: 5 + (i % 4) * 3,
                height: 5 + (i % 4) * 3,
                top: `${8 + i * 9}%`,
                left: `${5 + i * 9}%`,
                opacity: 0.3,
              }}
            />
          ))}

          {/* Subtle grid dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #1A1A1A 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* STATIC PERSISTENT NAVIGATION */}
        <nav className="sticky top-0 z-[100] w-full px-6 md:px-10 py-4 flex justify-between items-center bg-[#E3E3E3]/90 backdrop-blur-xl border-b border-white/50 rounded-t-[2rem] md:rounded-t-[3rem]">
          <div className="font-bold text-xl md:text-2xl tracking-tight flex items-center gap-2 text-[#1A1A1A]">
            <div className="w-6 h-6 bg-[#FF6803] grid grid-cols-2 gap-[2px] p-[2px] rounded-sm shadow-sm">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
            Shadow Founder
          </div>

          <div className="hidden lg:flex items-center bg-[#C7C7C7]/40 backdrop-blur-md rounded-3xl  p-1 border border-white/40">
            <a
              href="#mission"
              className="px-5 py-2 rounded-3xl text-sm font-semibold text-[#1A1A1A] bg-white/60 shadow-sm hover:bg-white transition-colors"
            >
              Mission
            </a>
            <a
              href="#architecture"
              className="px-5 py-2 rounded-3xl text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/40 transition-colors flex items-center gap-1"
            >
              Architecture
            </a>
            <a
              href="#features"
              className="px-5 py-2 rounded-3xl text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/40 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="px-5 py-2 rounded-3xl text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/40 transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="hidden lg:flex">
            <button
              onClick={routeToDashboard}
              className="bg-[#1A1A1A] text-white px-8 py-3 rounded-3xl text-sm font-bold hover:bg-[#FF6803] hover:shadow-[0_10px_20px_rgba(255,104,3,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {isSignedIn ? "Dashboard" : "Login / Register"}
            </button>
          </div>

          <button className="lg:hidden p-2 text-[#1A1A1A]" onClick={toggleMenu}>
            {isMobileMenuOpen ? <XIcon size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* MOBILE MENU WITH SPRING ANIMATION */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute top-[72px] left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl z-[90] flex flex-col gap-2 border border-black/10 lg:hidden"
            >
              {["Mission", "Architecture", "Features", "Pricing"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={toggleMenu}
                    className="text-xl font-black text-[#1A1A1A] border-b border-black/5 py-4 uppercase tracking-tighter hover:text-[#FF6803] transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
              <button
                onClick={routeToDashboard}
                className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl text-sm font-bold mt-4 hover:bg-[#FF6803] transition-colors w-full"
              >
                {isSignedIn ? "Dashboard" : "Login / Register"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* 1. HERO SECTION */}
        <main className="relative w-full min-h-[auto] md:min-h-[85vh] flex overflow-hidden pt-6 md:pt-16">
          {/* Hero section animated accents */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.12, 0.25, 0.12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[50%] w-40 h-40 md:w-72 md:h-72 rounded-full bg-[#FF6803] blur-[80px] pointer-events-none z-0"
          />
          {/* Floating rotating orange square — bottom right */}
          <motion.div
            animate={{ y: [0, -40, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[5%] w-8 h-8 md:w-14 md:h-14 border-2 border-[#FF6803]/25 rounded-lg pointer-events-none z-0"
          />
          {/* Spinning blue square — left side */}
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[3%] w-6 h-6 md:w-10 md:h-10 border-2 border-[#4D96FF]/20 rounded-md pointer-events-none z-0"
          />
          {/* Pulsing orange ring — top right */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[8%] right-[12%] w-10 h-10 md:w-20 md:h-20 border-[3px] border-[#FF6803]/30 rounded-full pointer-events-none z-0"
          />
          {/* Drifting green circle — mid left */}
          <motion.div
            animate={{ y: [0, -25, 0], x: [0, 18, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[55%] left-[12%] w-4 h-4 md:w-7 md:h-7 bg-[#6BCB77]/30 rounded-full pointer-events-none z-0"
          />
          {/* Floating purple diamond — center right */}
          <motion.div
            animate={{
              rotate: [45, 135, 225, 315, 405],
              y: [0, -30, 10, -20, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] right-[25%] w-5 h-5 md:w-9 md:h-9 border-2 border-[#C084FC]/25 pointer-events-none z-0"
          />
          {/* Bouncing orange dot — top left area */}
          <motion.div
            animate={{
              y: [0, -35, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[20%] w-3 h-3 md:w-5 md:h-5 bg-[#FF6803] rounded-full pointer-events-none z-0"
          />
          {/* Large slow rotating dashed circle — center */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-[30%] left-[40%] w-24 h-24 md:w-44 md:h-44 border-2 border-dashed border-[#FF6803]/15 rounded-full pointer-events-none z-0"
          />
          {/* Tiny blue dot cluster */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute top-[70%] right-[30%] w-2.5 h-2.5 md:w-4 md:h-4 bg-[#4D96FF]/40 rounded-full pointer-events-none z-0"
          />
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[68%] right-[28%] w-2 h-2 md:w-3 md:h-3 bg-[#4D96FF]/35 rounded-full pointer-events-none z-0"
          />
          {/* Slow floating cross/plus — right mid */}
          <motion.div
            animate={{ rotate: [0, 180, 360], y: [0, -20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[45%] right-[8%] pointer-events-none z-0"
          >
            <div className="relative w-6 h-6 md:w-10 md:h-10">
              <div className="absolute top-1/2 left-0 w-full h-[2px] md:h-[3px] bg-[#FF6803]/25 -translate-y-1/2 rounded-full" />
              <div className="absolute top-0 left-1/2 w-[2px] md:w-[3px] h-full bg-[#FF6803]/25 -translate-x-1/2 rounded-full" />
            </div>
          </motion.div>
          {/* Purple glow blob — bottom left */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[5%] left-[25%] w-32 h-32 md:w-52 md:h-52 rounded-full bg-[#C084FC] blur-[70px] pointer-events-none z-0"
          />
          {/* MASSIVE BACKGROUND TEXT (Hidden on Mobile, Kinetic on PC) */}
          <div className="absolute inset-0 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0">
            <motion.h1
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-[18vw] font-black text-white leading-[0.75] tracking-tighter opacity-[0.85] select-none"
            >
              SHADOW
            </motion.h1>
            <motion.h1
              animate={{ y: [15, -15, 15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-[18vw] font-black text-white leading-[0.75] tracking-tighter opacity-[0.85] select-none ml-[10vw]"
            >
              FOUNDER
            </motion.h1>
          </div>

          {/* FOREGROUND LAYOUT */}
          <div className="relative lg:absolute inset-0 z-20 px-6 md:px-12 lg:px-16 pt-4 md:pt-8 pb-8 md:pb-12 flex flex-col lg:flex-row justify-between pointer-events-none">
            {/* LEFT COLUMN: Staggered Typography */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between h-full pointer-events-auto z-30">
              <div>
                <span className="text-[#1A1A1A]/50 font-mono text-xs font-bold tracking-widest block mb-3 md:mb-6">
                  AGENTIC AI FOUNDER 🧠
                </span>
                <div className="flex flex-col text-[2.5rem] sm:text-[3.5rem] md:text-6xl xl:text-7xl font-black text-[#1A1A1A] leading-[0.85] tracking-tighter uppercase">
                  <span className="ml-0 md:ml-16">BUILDING</span>
                  <span>STARTUP</span>
                  <span className="ml-0 md:ml-12">PIPELINES</span>
                  <span className="text-[#FF6803] mt-2 drop-shadow-sm">
                    THAT SCALE
                  </span>
                </div>
              </div>

              <div className="mt-6 lg:mt-0">
                <p className="text-[#1A1A1A]/70 text-sm md:text-base font-medium max-w-sm leading-relaxed mb-4 md:mb-8">
                  We craft database architectures, agentic workflows, and
                  applications that drive conversions and long-term growth.
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={routeToDashboard}
                    className="bg-gradient-to-b from-[#FF8A3D] to-[#FF6803] text-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(255,104,3,0.3)] hover:-translate-y-1 transition-transform w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Get Started
                  </button>
                  <Link href="/help">
                    <button className="bg-white/60 cursor-pointer backdrop-blur-sm text-[#1A1A1A] border border-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm hover:bg-white transition-colors w-full md:w-auto flex items-center justify-center gap-2 ">
                      {" "}
                      Know More
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Stats Block */}
            <div className="hidden lg:flex w-1/3 flex-col justify-between items-end h-full pointer-events-auto z-30 relative">
              <div className="flex items-start gap-2 text-right mt-12 bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <ArrowUpRight size={32} className="text-[#FF6803] mt-2" />
                <div>
                  <h2 className="text-6xl font-black text-[#1A1A1A] tracking-tighter leading-none">
                    100x{" "}
                    <span className="text-xl font-bold tracking-widest uppercase block mt-2 text-[#1A1A1A]/40">
                      Deploy Speed
                    </span>
                  </h2>
                  <p className="text-[#1A1A1A]/70 text-sm font-medium max-w-[200px] mt-4 leading-relaxed">
                    Our clients see measurable brand growth through strategic
                    logic and digital thinking.
                  </p>
                </div>
              </div>

              <div className="text-right pb-12">
                <p className="text-[#1A1A1A]/70 text-sm font-medium max-w-[250px] leading-relaxed">
                  From the first spark of an idea to worldwide recognition — we
                  partner with brands.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Center Scroll Indicator */}
          <div className="absolute bottom-1 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30">
            <MousePointer2
              size={20}
              className="text-[#1A1A1A]/40 animate-bounce"
            />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A]/40">
              Scroll to explore
            </span>
          </div>
        </main>

        {/* 2. INFINITE TICKER (Light Theme) */}
        <div className="w-full border-y border-black/5 bg-[#D1D1D1]/30 py-4 overflow-hidden flex whitespace-nowrap mb-16">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
            className="flex gap-12 items-center text-[#1A1A1A]/50 font-bold text-sm uppercase tracking-widest"
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="hover:text-[#FF6803] transition-colors">
                  Powered by Shadow AI
                </span>{" "}
                <span className="text-[#FF6803]">•</span>
                <span className="hover:text-[#FF6803] transition-colors">
                  Next.js Architecture
                </span>{" "}
                <span className="text-[#FF6803]">•</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* 3. MISSION SECTION */}
        <section
          id="mission"
          className="px-6 md:px-16 mb-20 scroll-mt-32 relative"
        >
          {/* Mission floating decorations */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.15, 1] }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-8 -left-4 w-20 h-20 md:w-28 md:h-28 border-2 border-dashed border-[#FF6803]/25 rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 -right-3 w-6 h-6 md:w-10 md:h-10 bg-[#FF6803]/20 rounded-full blur-sm pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-[30%] w-32 h-32 md:w-48 md:h-48 bg-[#4D96FF]/10 rounded-full blur-[60px] pointer-events-none"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#D1D1D1]/50 p-10 md:p-14 rounded-[2rem] border border-white/50 relative overflow-hidden group">
              <XOctagon
                size={40}
                className="text-[#FF6803] mb-8 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-[#1A1A1A]">
                The Flaw
              </h2>
              <p className="text-[#1A1A1A]/70 text-lg font-medium max-w-md leading-relaxed">
                Founders default to writing code. They build complex systems for
                nonexistent problems and ignore unit economics. Emotion clouds
                judgment.
              </p>
            </div>
            <div className="bg-[#1A1A1A] text-white p-10 md:p-14 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              <CheckCircle2
                size={40}
                className="text-[#FF6803] mb-8 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                The Fix
              </h2>
              <p className="text-white/70 text-lg font-medium max-w-md leading-relaxed">
                The Shadow Founder acts as an emotionless, autonomous
                co-founder. It enforces a rigid, data-driven pipeline to
                assemble your MVP.
              </p>
            </div>
          </div>
        </section>

        {/* 4. ARCHITECTURE / BENTO GRID */}
        <section
          id="architecture"
          className="px-6 md:px-16 mb-20 scroll-mt-32 relative"
        >
          {/* Architecture bg accents */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 right-[10%] w-24 h-24 md:w-40 md:h-40 border-2 border-[#4D96FF]/20 rounded-2xl pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-[5%] w-12 h-12 md:w-20 md:h-20 bg-[#6BCB77]/20 rounded-full blur-md pointer-events-none"
          />
          <motion.div
            animate={{ rotate: 360, x: [0, 15, 0] }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-1/2 right-[3%] w-8 h-8 md:w-12 md:h-12 border-2 border-[#FF6803]/20 rounded-md pointer-events-none"
          />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-10 text-center">
            Execution Flow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 p-10 rounded-[2rem] border border-white shadow-sm">
              <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md">
                1
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1A1A1A]">
                Validation
              </h4>
              <p className="text-[#1A1A1A]/70 font-medium leading-relaxed">
                Input your core concept. The agent strips away emotion and
                calculates TAM.
              </p>
            </div>
            <div className="bg-white/60 p-10 rounded-[2rem] border border-white shadow-sm">
              <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md">
                2
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1A1A1A]">
                Assembly
              </h4>
              <p className="text-[#1A1A1A]/70 font-medium leading-relaxed">
                If it passes, the agent shifts to lead engineer, generating
                schemas instantly.
              </p>
            </div>
            <div className="md:col-span-3 lg:col-span-1 bg-gradient-to-br from-[#FF8A3D] to-[#FF6803] p-10 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white text-[#FF6803] rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md">
                  3
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tighter mb-3">
                  Deployment
                </h4>
                <p className="text-white/90 font-medium leading-relaxed">
                  One-click edge deployment. Receive your production-ready
                  Next.js application.
                </p>
              </div>
              <Layers className="absolute -bottom-10 -right-10 w-48 h-48 text-black/10" />
            </div>
          </div>
        </section>

        {/* 5. FEATURES */}
        <section
          id="features"
          className="px-6 md:px-16 mb-20 scroll-mt-32 relative"
        >
          {/* Section bg accent */}
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF6803]/[0.03] rounded-full blur-3xl pointer-events-none"
          />
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF6803] mb-3 block"
            >
              What You Get
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]"
            >
              Core Features
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Instant Validation",
                desc: "Get a brutally honest 0-100 score with TAM analysis, competition mapping, and revenue feasibility in seconds.",
                color: "#FF6803",
              },
              {
                icon: Cpu,
                title: "AI Code Generation",
                desc: "One-click MVP generation. Complete codebase with stunning landing page, components, and configs — ready to ship.",
                color: "#4D96FF",
              },
              {
                icon: Shield,
                title: "Risk Analysis",
                desc: "Failure risks, competitor strengths & weaknesses, and a founder checklist so you never miss a critical step.",
                color: "#6BCB77",
              },
              {
                icon: BarChart3,
                title: "Deep Metrics",
                desc: "Scalability score, user acquisition difficulty, MVP build time, India market fit — all data-backed insights.",
                color: "#C084FC",
              },
              {
                icon: Rocket,
                title: "MVP in Minutes",
                desc: "Download a complete ZIP with preview.html, pages, layouts, and config. Extract, customize, and deploy.",
                color: "#FF6B6B",
              },
              {
                icon: Globe,
                title: "India-First",
                desc: "All pricing in ₹, Indian competitor analysis, UPI references, tier-wise city insights. Built for the Indian founder.",
                color: "#FFD93D",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-[1.5rem] border border-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-[color:var(--glow)]/[0.04] group-hover:to-transparent transition-all duration-500 rounded-[1.5rem]"
                  style={{ "--glow": feature.color } as React.CSSProperties}
                />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-md transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon size={22} className="text-white" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2 text-[#1A1A1A]">
                    {feature.title}
                  </h4>
                  <p className="text-[#1A1A1A]/60 text-sm font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                {/* Corner accent */}
                <motion.div
                  className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.06]"
                  style={{ backgroundColor: feature.color }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. STATS / SOCIAL PROOF */}
        <section className="px-6 md:px-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1A1A1A] rounded-[2rem] p-10 md:p-16 relative overflow-hidden"
          >
            {/* Animated accent circles in bg */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#FF6803]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.05, 0.02] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#4D96FF]"
            />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF6803] mb-3 block">
                  Traction
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  Numbers Don&apos;t Lie
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    value: "500+",
                    label: "Ideas Validated",
                    accent: "#FF6803",
                  },
                  { value: "200+", label: "MVPs Generated", accent: "#6BCB77" },
                  {
                    value: "20s",
                    label: "Avg Analysis Time",
                    accent: "#4D96FF",
                  },
                  { value: "99%", label: "Accuracy Rate", accent: "#C084FC" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="text-center p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] transition-all cursor-default"
                  >
                    <motion.p
                      className="text-4xl md:text-5xl font-black tracking-tighter mb-2"
                      style={{ color: stat.accent }}
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.2 + i * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 7. FAQ */}
        <section id="faq" className="px-6 md:px-16 mb-20 scroll-mt-32">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF6803] mb-3 block"
              >
                Got Questions?
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]"
              >
                FAQ
              </motion.h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: "How does the AI validation work?",
                  a: "You submit your startup idea with target audience, problem, revenue model, and competitors. Our AI analyzes it against real market data, calculates TAM, competition level, feasibility and gives you a brutally honest 0-100 viability score with detailed insights.",
                },
                {
                  q: "What do I get when I build an MVP?",
                  a: "A complete downloadable ZIP containing a stunning preview landing page (12 unique sections), Next.js project files, package.json, layouts, components, and configuration — all tailored to your specific idea and category.",
                },
                {
                  q: "Is this really free to use?",
                  a: "Yes! The free plan gives you 1 MVP build credit. You can validate unlimited ideas and chat with the AI strategist. Upgrade to Pro for 10 builds or Enterprise for unlimited.",
                },
                {
                  q: "How accurate is the analysis?",
                  a: "Our AI uses advanced models (LLaMA 3.3 70B) trained on startup data. It evaluates 8+ metrics including TAM, competition, revenue potential, India market fit, scalability, and user acquisition difficulty. It's designed to be honest, not encouraging.",
                },
                {
                  q: "Can I customize the generated code?",
                  a: "Absolutely. The generated code is yours to keep. Download the ZIP, open it in VS Code, and customize everything — the landing page, components, styles, and logic. Pro users get inline code editing in the browser.",
                },
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* 8. PRICING */}
        <section
          id="pricing"
          className="px-6 md:px-16 mb-24 scroll-mt-32 relative"
        >
          {/* Pricing bg accents */}
          <motion.div
            animate={{ rotate: 360, y: [0, -20, 0] }}
            transition={{
              rotate: { duration: 45, repeat: Infinity, ease: "linear" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-6 left-[8%] w-16 h-16 md:w-24 md:h-24 border-2 border-dashed border-[#FF6803]/25 rounded-xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[5%] w-32 h-32 md:w-48 md:h-48 bg-[#C084FC]/15 rounded-full blur-[60px] pointer-events-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#D1D1D1]/40 p-10 md:p-12 rounded-[2rem] border border-white/50 flex flex-col">
              <div className="bg-white/60 text-[#1A1A1A] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full w-max mb-6 border border-white">
                Hobbyist
              </div>
              <h3 className="text-5xl font-black tracking-tighter text-[#1A1A1A] mb-4">
                Free
              </h3>
              <p className="text-[#1A1A1A]/60 font-medium mb-8 flex-grow">
                One-time credit to test the engine mechanics.
              </p>
              <button
                onClick={routeToDashboard}
                className="w-full bg-white text-[#1A1A1A] py-4 rounded-xl font-bold uppercase tracking-widest border border-white/60 hover:shadow-md transition-shadow cursor-pointer"
              >
                Start Free
              </button>
            </div>
            <div className="bg-[#1A1A1A] p-10 md:p-12 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6803]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-[#FF6803] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full w-max mb-6 shadow-md relative z-10">
                Founder
              </div>
              <h3 className="text-5xl font-black tracking-tighter text-white mb-4 relative z-10">
                ₹ 1,999<span className="text-xl text-white/40">/mo</span>
              </h3>
              <p className="text-white/60 font-medium mb-8 flex-grow relative z-10">
                Unlimited validations and full Next.js generation pipelines.
              </p>
              <Link href="/profile">
                <button className="relative z-10 w-full bg-[#FF6803] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_10px_20px_rgba(255,104,3,0.3)] hover:-translate-y-0.5 transition-transform cursor-pointer">
                  Upgrade to Pro
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA BANNER */}
        <section className="px-6 md:px-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#1A1A1A] rounded-[2rem] p-10 md:p-16 text-center overflow-hidden"
          >
            {/* CTA bg accents */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.08, 0.15, 0.08] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-[20%] w-64 h-64 bg-[#FF6803] rounded-full blur-[80px]"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-0 right-[15%] w-48 h-48 bg-[#4D96FF] rounded-full blur-[70px]"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF6803] mb-4 relative z-10"
            >
              Stop Dreaming. Start Validating.
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-6 relative z-10"
            >
              Your Idea Deserves
              <br />
              <span className="text-[#FF6803]">The Truth</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 font-medium max-w-lg mx-auto mb-8 relative z-10"
            >
              Join founders who validate before they build. Get AI-powered
              analysis, instant MVP generation, and brutally honest feedback —
              all in one place.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={routeToDashboard}
              className="relative z-10 bg-[#FF6803] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(255,104,3,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,104,3,0.5)] transition-all cursor-pointer"
            >
              {isSignedIn ? "Go to Dashboard" : "Get Started Free"} →
            </motion.button>
          </motion.div>
        </section>

        {/* 10. KINETIC FOOTER */}
        <footer className="w-full bg-[#D1D1D1]/20 border-t border-black/5 flex flex-col pt-12 relative overflow-hidden">
          {/* Footer floating accents */}
          <motion.div
            animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[15%] w-40 h-40 md:w-56 md:h-56 bg-[#FF6803]/10 rounded-full blur-[60px] pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[30%] left-[10%] w-12 h-12 md:w-20 md:h-20 border-2 border-[#1A1A1A]/15 rounded-full pointer-events-none"
          />
          <div className="w-full overflow-hidden border-b border-black/5 pb-12 mb-12">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 15, repeat: Infinity }}
              className="flex whitespace-nowrap"
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center text-[5rem] md:text-[8rem] font-black uppercase tracking-tighter text-[#1A1A1A] px-4"
                >
                  READY TO <span className="text-[#FF6803] ml-4">DEPLOY?</span>{" "}
                  <span className="mx-8 text-[#1A1A1A]/20">•</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="px-6 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <button
              onClick={routeToDashboard}
              className="bg-[#1A1A1A] text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#FF6803] transition-colors flex items-center gap-3 w-full md:w-auto justify-center shadow-xl cursor-pointer"
            >
              Initialize System <ArrowUpRight size={20} />
            </button>

            <div className="flex gap-12 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/60 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/30 mb-2">Platform</span>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Engine
                </a>
                <a
                  href="#pricing"
                  className="hover:text-[#FF6803] transition-colors"
                >
                  Pricing
                </a>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Docs
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/30 mb-2">Legal</span>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-[#FF6803] transition-colors">
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-16 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 pb-8 pt-8 border-t border-black/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6803] rounded-full animate-pulse"></div>
              © 2026 SHADOW_FOUNDER
            </div>
            <span className="mt-4 md:mt-0">ALL LOGIC. NO FEELINGS.</span>
          </div>
          <div className="text-center py-8 border-t border-[#1A1A1A]/6">
            <p className="text-[10px] font-bold text-[#000000]/90 uppercase tracking-widest">
              Built with <span className="animate-pulse">💓</span> by Shadow
              Founder Team
            </p>
            <p className="text-[10px] font-bold text-[#000000]/90 uppercase tracking-widest">
              Create by{" "}
              <Link
                href={"https://csyadav.vercel.app/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6803] hover:underline"
              >
                ChandraShekhar
              </Link>
              ✌️
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
