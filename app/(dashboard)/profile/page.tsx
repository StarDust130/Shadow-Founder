"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserProfile } from "@clerk/nextjs";
import { User, Coins, ArrowRight, Sparkles, Crown, Zap } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ rotate: -8 }}
            className="w-11 h-11 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
          >
            <User size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase">
              Profile
            </h1>
            <p className="text-[10px] text-[#1A1A1A]/40 font-bold uppercase tracking-[0.2em] font-mono">
              Account settings & subscription
            </p>
          </div>
        </div>
        <div className="h-[3px] bg-[#1A1A1A] rounded-full" />
      </motion.div>

      {/* ═══ CREDIT BALANCE + UPGRADE ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        {/* Credit Balance Card */}
        <motion.div
          whileHover={{ y: -4, x: -2 }}
          whileTap={{ scale: 0.99 }}
          className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#FF6803] transition-shadow"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#FF6803]/10 rounded-xl flex items-center justify-center border-2 border-[#FF6803]/30">
              <Coins size={16} className="text-[#FF6803]" />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono">
              Credit Balance
            </h2>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-5xl font-black text-[#1A1A1A] tracking-tighter">
              1
            </span>
            <span className="text-2xl font-black text-[#1A1A1A]/20 tracking-tighter">
              / 1
            </span>
          </div>

          <p className="text-[11px] text-[#1A1A1A]/35 font-medium">
            Credits remaining on your current plan
          </p>

          <div className="mt-4 flex items-center gap-2 bg-[#FF6803]/5 rounded-lg px-3 py-2 border border-[#FF6803]/15">
            <Zap size={12} className="text-[#FF6803]" />
            <span className="text-[10px] font-bold text-[#FF6803]/70 font-mono">
              1 credit = 1 full validation cycle
            </span>
          </div>
        </motion.div>

        {/* Upgrade Plan Card */}
        <motion.div
          whileHover={{ y: -4, x: -2 }}
          whileTap={{ scale: 0.99 }}
          className="bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#FF6803] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6803]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-white/20 shadow-[0_0_15px_rgba(255,104,3,0.3)]">
                <Crown size={16} className="text-white" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 font-mono">
                Upgrade Plan
              </h2>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mb-1">
              Go <span className="text-[#FF6803]">Pro</span>
            </h3>
            <p className="text-[11px] text-white/30 font-medium mb-5">
              Unlimited validations, priority AI analysis, and advanced code
              generation.
            </p>

            <motion.button
              whileHover={{
                y: -3,
                x: -2,
                transition: { type: "spring", stiffness: 400 },
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-[#FF8A3D] to-[#FF6803] text-white font-black text-sm uppercase tracking-wider rounded-xl border-2 border-white/20 shadow-[0_0_20px_rgba(255,104,3,0.25)] hover:shadow-[0_0_30px_rgba(255,104,3,0.4)] transition-shadow"
            >
              <Sparkles size={14} />
              Upgrade Now
              <ArrowRight size={14} />
            </motion.button>

            <div className="mt-4 flex items-center justify-center gap-1">
              <span className="text-[9px] font-bold text-white/15 uppercase tracking-widest font-mono">
                Starting at $9/mo
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ CLERK USER PROFILE ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0_#1A1A1A] overflow-hidden mb-4"
      >
        <div className="px-5 py-4 border-b-2 border-[#1A1A1A]/5 bg-[#FAFAFA]">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono flex items-center gap-2">
            <User size={12} className="text-[#FF6803]" />
            Account Settings
          </h2>
        </div>
        <div className="p-2 sm:p-4 [&_.cl-rootBox]:w-full [&_.cl-card]:shadow-none [&_.cl-card]:border-0 [&_.cl-navbar]:border-r-0 [&_.cl-profileSection]:border-0">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                navbar: "border-r-0",
                pageScrollBox: "p-0",
                profileSection: "border-0",
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
