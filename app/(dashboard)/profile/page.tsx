"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserProfile, useUser } from "@clerk/nextjs";
import {
  User,
  Coins,
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  Shield,
  Bell,
  Webhook,
  Key,
  Clock,
  BarChart3,
  Globe,
  Palette,
  Download,
  GitBranch,
  Layers,
} from "lucide-react";

const comingSoonFeatures = [
  {
    title: "API Keys",
    desc: "Generate API keys for programmatic access to Shadow AI",
    icon: Key,
  },
  {
    title: "Webhooks",
    desc: "Get real-time notifications when validations complete",
    icon: Webhook,
  },
  {
    title: "Notifications",
    desc: "Email & push alerts for project updates and new features",
    icon: Bell,
  },
  {
    title: "Usage Analytics",
    desc: "Detailed breakdown of your validation history and trends",
    icon: BarChart3,
  },
  {
    title: "Custom Domains",
    desc: "Deploy generated MVPs under your own domain name",
    icon: Globe,
  },
  {
    title: "Theme Editor",
    desc: "Customize the look and feel of your generated projects",
    icon: Palette,
  },
  {
    title: "Export Data",
    desc: "Download all your validation reports as PDF or CSV",
    icon: Download,
  },
  {
    title: "Team Access",
    desc: "Invite co-founders and team members to collaborate",
    icon: GitBranch,
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ProfilePage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Builder";

  return (
    <div className="max-w-4xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} />
          Account
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
          Profile<span className="text-[#FF6803]">.</span>
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
          Account settings & subscription management.
        </p>
      </motion.div>

      {/* ═══ WELCOME CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] p-5 relative overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#FF6803]/5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, type: "tween" }}
          />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FF6803] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
              <span className="text-2xl font-black text-white">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1A1A] uppercase tracking-tight">
                Hey, {firstName}
                <span className="text-[#FF6803]">!</span>
              </h2>
              <p className="text-xs font-bold text-[#1A1A1A]/30">
                {user?.primaryEmailAddress?.emailAddress ||
                  "Manage your account below"}
              </p>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/8 rounded-lg px-3 py-1.5 border border-emerald-500/15">
              <Shield size={12} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 font-mono">
                Free Plan
              </span>
            </div>
          </div>
        </div>
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
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono">
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

          <p className="text-[11px] text-[#1A1A1A]/35 font-bold">
            Credits remaining on your current plan
          </p>

          <div className="mt-4 flex items-center gap-2 bg-[#FF6803]/5 rounded-lg px-3 py-2 border border-[#FF6803]/15">
            <Zap size={12} className="text-[#FF6803]" />
            <span className="text-[10px] font-black text-[#FF6803]/70 font-mono">
              1 credit = 1 full validation cycle
            </span>
          </div>
        </motion.div>

        {/* Upgrade Plan Card */}
        <motion.div
          whileHover={{ y: -4, x: -2 }}
          whileTap={{ scale: 0.99 }}
          className="bg-[#FF6803] border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#1A1A1A] transition-all relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, type: "tween" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                <Crown size={16} className="text-[#FF6803]" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 font-mono">
                Upgrade Plan
              </h2>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mb-1">
              Go Pro
            </h3>
            <p className="text-[11px] text-white/60 font-bold mb-5">
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#FF6803] font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-shadow"
            >
              <Sparkles size={14} />
              Upgrade Now
              <ArrowRight size={14} />
            </motion.button>

            <div className="mt-4 flex items-center justify-center gap-1">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono">
                Starting at $9/mo
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ QUICK STATS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {[
          { label: "Total Ideas", value: "6", icon: Layers, color: "#FF6803" },
          {
            label: "Viable",
            value: "4",
            icon: Sparkles,
            color: "#22C55E",
          },
          {
            label: "Credits Used",
            value: "5",
            icon: Zap,
            color: "#FF8A3D",
          },
          {
            label: "Member Since",
            value: "2026",
            icon: Clock,
            color: "#1A1A1A",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ y: -4, x: -2 }}
            className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0_#1A1A1A] hover:shadow-[5px_5px_0_#FF6803] transition-all cursor-default"
          >
            <stat.icon
              size={16}
              style={{ color: stat.color }}
              className="mb-2"
            />
            <h3 className="text-2xl font-black tracking-tighter text-[#1A1A1A]">
              {stat.value}
            </h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]/25 font-mono mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ CLERK USER PROFILE ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0_#1A1A1A] overflow-hidden mb-8"
      >
        <div className="px-5 py-4 border-b-2 border-[#1A1A1A]/5 bg-[#FAFAFA]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono flex items-center gap-2">
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

      {/* ═══ COMING SOON FEATURES ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]/40" />
          Coming Soon
        </h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
        >
          {comingSoonFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="bg-[#D9D9D9]/50 border-2 border-[#1A1A1A]/10 border-dashed rounded-xl p-4 opacity-60 hover:opacity-80 transition-all cursor-default"
            >
              <div className="w-9 h-9 bg-[#1A1A1A]/5 rounded-lg flex items-center justify-center mb-3 border border-[#1A1A1A]/8">
                <feature.icon size={16} className="text-[#1A1A1A]/25" />
              </div>
              <h3 className="text-xs font-black text-[#1A1A1A]/50 uppercase tracking-tight mb-1">
                {feature.title}
              </h3>
              <p className="text-[10px] text-[#1A1A1A]/25 font-bold leading-relaxed">
                {feature.desc}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1A1A]/5 rounded-md">
                <Clock size={8} className="text-[#1A1A1A]/20" />
                <span className="text-[7px] font-black uppercase tracking-widest text-[#1A1A1A]/25 font-mono">
                  Soon
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
