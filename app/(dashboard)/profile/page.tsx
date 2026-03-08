"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  X,
  Loader2,
  QrCode,
  Smartphone,
  Mail,
  Moon,
  Users,
  Plug,
  CreditCard,
  Settings,
  Star,
  Check,
} from "lucide-react";

interface UserPlan {
  plan: "free" | "pro";
  buildsUsed: number;
  maxBuilds: number;
}

const comingSoonFeatures = [
  {
    title: "Dark Mode",
    desc: "Switch to a sleek dark theme for comfortable night sessions",
    icon: Moon,
  },
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
    icon: Users,
  },
  {
    title: "Integrations",
    desc: "Connect with GitHub, Slack, Notion and more",
    icon: Plug,
  },
  {
    title: "Git Ready Export",
    desc: "One-click push generated code to a GitHub repo",
    icon: GitBranch,
  },
  {
    title: "Priority Support",
    desc: "Get dedicated support from the Shadow Founder team",
    icon: Star,
  },
];

const tabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "account", label: "Account", icon: Settings },
  { id: "billing", label: "Plan & Billing", icon: CreditCard },
  { id: "coming-soon", label: "Coming Soon", icon: Sparkles },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const UPI_ID = "9302903537-2@ybl";
const UPI_AMOUNT = "1999";
const UPI_NAME = "ShadowFounder";

const FREE_FEATURES = [
  "Unlimited idea validations",
  "1 MVP build credit",
  "AI chat follow-ups",
  "Basic code generation",
  "Community support",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited MVP builds",
  "Priority AI analysis",
  "Advanced code generation",
  "Premium landing pages",
  "Priority support",
  "Early access to new features",
];

export default function ProfilePage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Builder";

  const [activeTab, setActiveTab] = useState("overview");
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [viableCount, setViableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, analysesRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/analyses"),
        ]);
        if (userRes.ok) {
          const data = await userRes.json();
          setUserPlan(data);
        }
        if (analysesRes.ok) {
          const analyses = await analysesRes.json();
          setTotalIdeas(analyses.length);
          setViableCount(
            analyses.filter(
              (a: { verdict: string }) =>
                a.verdict === "VIABLE" || a.verdict === "CONDITIONAL PASS",
            ).length,
          );
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpgradeClick = useCallback(async () => {
    setShowUpgradeModal(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${UPI_AMOUNT}&cu=INR&tn=ShadowFounder+Pro+Upgrade`;
      const dataUrl = await QRCode.toDataURL(upiUri, {
        width: 280,
        margin: 2,
        color: { dark: "#1A1A1A", light: "#FFFFFF" },
      });
      setQrDataUrl(dataUrl);
    } catch {
      // QR generation failed
    }
  }, []);

  const handleConfirmPayment = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserPlan(data);
        setUpgraded(true);
        setTimeout(() => {
          setShowUpgradeModal(false);
          setUpgraded(false);
        }, 2000);
      }
    } catch {
      // silent
    } finally {
      setUpgrading(false);
    }
  };

  const plan = userPlan?.plan || "free";
  const isPro = plan === "pro";
  const buildsUsed = userPlan?.buildsUsed ?? 0;
  const maxBuilds = userPlan?.maxBuilds ?? 1;
  const buildsRemaining = Math.max(0, maxBuilds - buildsUsed);
  const memberYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${UPI_AMOUNT}&cu=INR&tn=ShadowFounder+Pro+Upgrade`;

  const creditRequestEmail = `mailto:chandanbsd9@gmail.com?subject=${encodeURIComponent("Free Build Credit Request — Shadow Founder")}&body=${encodeURIComponent(`Hi Shadow Founder Team,\n\nI'd like to request a free build credit for my account.\n\nName: ${user?.fullName || firstName}\nEmail: ${user?.primaryEmailAddress?.emailAddress || ""}\nUser ID: ${user?.id || ""}\n\nThank you!`)}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} /> Account
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
              Profile<span className="text-[#FF6803]">.</span>
            </h1>
            <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
              Account settings & subscription management.
            </p>
          </div>
          <a href={creditRequestEmail}>
            <motion.button
              whileHover={{ y: -2, x: -1 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#FF6803] text-[#1A1A1A] font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <Mail size={13} className="text-[#FF6803]" />
              Request Free Credit
            </motion.button>
          </a>
        </div>
      </motion.div>

      {/* MOBILE REQUEST CREDIT BUTTON */}
      <a href={creditRequestEmail} className="sm:hidden block mb-4">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] text-[#1A1A1A] font-black text-[10px] uppercase tracking-wider cursor-pointer"
        >
          <Mail size={13} className="text-[#FF6803]" />
          Request Free Credit
        </motion.div>
      </a>

      {/* WELCOME CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
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
            <div
              className={`hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 border ${isPro ? "bg-[#FF6803]/8 border-[#FF6803]/15" : "bg-emerald-500/8 border-emerald-500/15"}`}
            >
              {isPro ? (
                <Crown size={12} className="text-[#FF6803]" />
              ) : (
                <Shield size={12} className="text-emerald-500" />
              )}
              <span
                className={`text-[9px] font-black uppercase tracking-widest font-mono ${isPro ? "text-[#FF6803]" : "text-emerald-600"}`}
              >
                {isPro ? "Pro Plan" : "Free Plan"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-6"
      >
        <div className="flex gap-1 bg-white/60 backdrop-blur-sm border border-[#1A1A1A]/8 rounded-xl p-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                  : "text-[#1A1A1A]/35 hover:text-[#1A1A1A]/60 hover:bg-white/80"
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* CREDIT BALANCE + UPGRADE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Credit Balance */}
              <motion.div
                whileHover={{ y: -4, x: -2 }}
                className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#FF6803] transition-shadow cursor-default"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-[#FF6803]/10 rounded-xl flex items-center justify-center border-2 border-[#FF6803]/30">
                    <Coins size={16} className="text-[#FF6803]" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono">
                    MVP Build Credits
                  </h2>
                </div>
                {loading ? (
                  <Loader2
                    size={24}
                    className="animate-spin text-[#FF6803] my-4"
                  />
                ) : (
                  <>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-5xl font-black text-[#1A1A1A] tracking-tighter">
                        {buildsRemaining}
                      </span>
                      <span className="text-2xl font-black text-[#1A1A1A]/20 tracking-tighter">
                        / {isPro ? "∞" : maxBuilds}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1A1A1A]/35 font-bold">
                      {isPro
                        ? "Unlimited builds on Pro plan"
                        : `${buildsUsed} of ${maxBuilds} build credits used`}
                    </p>
                    <div className="mt-4 flex items-center gap-2 bg-[#FF6803]/5 rounded-lg px-3 py-2 border border-[#FF6803]/15">
                      <Zap size={12} className="text-[#FF6803]" />
                      <span className="text-[10px] font-black text-[#FF6803]/70 font-mono">
                        {isPro
                          ? "Unlimited validations + builds"
                          : "Unlimited validations • 1 MVP build"}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Upgrade / Pro Status */}
              {isPro ? (
                <motion.div
                  whileHover={{ y: -4, x: -2 }}
                  className="bg-emerald-500 border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#1A1A1A] transition-all relative overflow-hidden cursor-default"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                        <Crown size={16} className="text-emerald-500" />
                      </div>
                      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 font-mono">
                        Your Plan
                      </h2>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight mb-1">
                      Pro Active
                    </h3>
                    <p className="text-[11px] text-white/60 font-bold mb-4">
                      You have unlimited access to all features.
                    </p>
                    <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2">
                      <CheckCircle2 size={14} className="text-white" />
                      <span className="text-[10px] font-black text-white/80 font-mono">
                        All features unlocked
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ y: -4, x: -2 }}
                  className="bg-[#FF6803] border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#1A1A1A] hover:shadow-[8px_8px_0_#1A1A1A] transition-all relative overflow-hidden cursor-default"
                >
                  <motion.div
                    className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      type: "tween",
                    }}
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
                      Unlimited MVP builds, priority AI analysis, and advanced
                      code generation.
                    </p>
                    <motion.button
                      onClick={handleUpgradeClick}
                      whileHover={{
                        y: -3,
                        x: -2,
                        transition: { type: "spring", stiffness: 400 },
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#FF6803] font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-shadow cursor-pointer"
                    >
                      <Sparkles size={14} /> Upgrade Now{" "}
                      <ArrowRight size={14} />
                    </motion.button>
                    <div className="mt-4 flex items-center justify-center gap-1">
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono">
                        ₹1,999 one-time via UPI
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Total Ideas",
                  value: loading ? "—" : String(totalIdeas),
                  icon: Layers,
                  color: "#FF6803",
                },
                {
                  label: "Viable",
                  value: loading ? "—" : String(viableCount),
                  icon: Sparkles,
                  color: "#22C55E",
                },
                {
                  label: "Builds Used",
                  value: loading ? "—" : String(buildsUsed),
                  icon: Zap,
                  color: "#FF8A3D",
                },
                {
                  label: "Member Since",
                  value: String(memberYear),
                  icon: Clock,
                  color: "#1A1A1A",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
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
            </div>
          </motion.div>
        )}

        {/* ═══ ACCOUNT TAB ═══ */}
        {activeTab === "account" && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0_#1A1A1A] overflow-hidden">
              <div className="px-5 py-4 border-b-2 border-[#1A1A1A]/5 bg-[#FAFAFA]">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-mono flex items-center gap-2">
                  <User size={12} className="text-[#FF6803]" /> Account Settings
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
            </div>
          </motion.div>
        )}

        {/* ═══ PLAN & BILLING TAB ═══ */}
        {activeTab === "billing" && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Free Plan Card */}
              <motion.div
                whileHover={{ y: -4, x: -2 }}
                className={`bg-white border-2 rounded-2xl p-6 transition-all ${
                  !isPro
                    ? "border-[#1A1A1A] shadow-[6px_6px_0_#1A1A1A]"
                    : "border-[#1A1A1A]/15 shadow-[4px_4px_0_#1A1A1A]/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border-2 border-emerald-500/20">
                    <Shield size={16} className="text-emerald-500" />
                  </div>
                  {!isPro && (
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                      Current
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">
                  Free Plan
                </h3>
                <div className="flex items-baseline gap-1 mt-1 mb-4">
                  <span className="text-3xl font-black text-[#1A1A1A]">
                    ₹0
                  </span>
                  <span className="text-sm font-bold text-[#1A1A1A]/25">
                    forever
                  </span>
                </div>
                <div className="space-y-2.5">
                  {FREE_FEATURES.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]/50"
                    >
                      <Check
                        size={14}
                        className="text-emerald-500 shrink-0"
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Pro Plan Card */}
              <motion.div
                whileHover={{ y: -4, x: -2 }}
                className={`border-2 rounded-2xl p-6 transition-all relative overflow-hidden ${
                  isPro
                    ? "bg-emerald-500 border-[#1A1A1A] shadow-[6px_6px_0_#1A1A1A]"
                    : "bg-[#FF6803] border-[#1A1A1A] shadow-[6px_6px_0_#1A1A1A]"
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    type: "tween",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]">
                      <Crown
                        size={16}
                        className={
                          isPro ? "text-emerald-500" : "text-[#FF6803]"
                        }
                      />
                    </div>
                    {isPro && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/80 bg-white/20 px-2 py-0.5 rounded-md font-mono">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    Pro Plan
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1 mb-4">
                    <span className="text-3xl font-black text-white">
                      ₹1,999
                    </span>
                    <span className="text-sm font-bold text-white/40">
                      one-time
                    </span>
                  </div>
                  <div className="space-y-2.5 mb-5">
                    {PRO_FEATURES.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs font-bold text-white/70"
                      >
                        <Check
                          size={14}
                          className="text-white shrink-0"
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                  {!isPro && (
                    <motion.button
                      onClick={handleUpgradeClick}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#FF6803] font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-shadow cursor-pointer"
                    >
                      <Sparkles size={14} /> Upgrade to Pro
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border-2 border-[#1A1A1A]/10 rounded-2xl p-5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-3 font-mono flex items-center gap-2">
                <CreditCard size={12} className="text-[#FF6803]/40" /> Payment
                Info
              </h3>
              <p className="text-xs text-[#1A1A1A]/35 font-bold">
                All payments are processed via UPI (Unified Payments Interface).
                One-time payment, no recurring charges. Your Pro access is
                activated instantly after payment confirmation.
              </p>
            </div>
          </motion.div>
        )}

        {/* ═══ COMING SOON TAB ═══ */}
        {activeTab === "coming-soon" && (
          <motion.div
            key="coming-soon"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
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
        )}
      </AnimatePresence>

      {/* UPI UPGRADE MODAL — with Plan Details Gate */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !upgrading && setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[8px_8px_0_#1A1A1A] p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => !upgrading && setShowUpgradeModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer"
              >
                <X size={18} className="text-[#1A1A1A]/40" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-[#FF6803] rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
                  <Crown size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight">
                  Upgrade to Pro
                </h3>
                <p className="text-xs text-[#1A1A1A]/40 font-bold mt-1">
                  One-time payment • Lifetime access
                </p>
              </div>

              {upgraded ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2
                    size={48}
                    className="text-emerald-500 mx-auto mb-3"
                  />
                  <p className="text-lg font-black text-emerald-600 uppercase">
                    Upgraded!
                  </p>
                  <p className="text-xs text-[#1A1A1A]/40 mt-1">
                    Welcome to Pro, {firstName}!
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* What You Get */}
                  <div className="bg-[#FAFAFA] rounded-xl border-2 border-[#1A1A1A]/8 p-4 mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1A1A1A]/30 font-mono mb-3 flex items-center gap-1.5">
                      <Star size={10} className="text-[#FF6803]" /> What you
                      unlock
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Unlimited MVP Builds",
                        "Priority AI Analysis",
                        "Advanced Code Gen",
                        "Premium Landing Pages",
                        "Priority Support",
                        "Early Feature Access",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1A1A]/50"
                        >
                          <Check
                            size={12}
                            className="text-emerald-500 shrink-0"
                          />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-baseline gap-1 bg-[#FF6803]/5 rounded-xl px-5 py-2.5 border border-[#FF6803]/15">
                      <span className="text-3xl font-black text-[#FF6803]">
                        ₹1,999
                      </span>
                      <span className="text-sm font-bold text-[#1A1A1A]/25">
                        one-time
                      </span>
                    </div>
                  </div>

                  {/* QR Code for desktop */}
                  <div className="hidden sm:block">
                    <div className="bg-[#FAFAFA] rounded-xl border-2 border-[#1A1A1A]/10 p-4 mb-4">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <QrCode size={14} className="text-[#1A1A1A]/30" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/30 font-mono">
                          Scan with any UPI app
                        </span>
                      </div>
                      <div className="flex justify-center">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt="UPI QR Code"
                            className="w-56 h-56 rounded-lg"
                          />
                        ) : (
                          <div className="w-56 h-56 flex items-center justify-center">
                            <Loader2
                              size={24}
                              className="animate-spin text-[#FF6803]"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-center text-[9px] text-[#1A1A1A]/25 font-mono mt-3">
                        UPI ID: {UPI_ID}
                      </p>
                    </div>
                  </div>

                  {/* UPI Deep link for mobile */}
                  <div className="sm:hidden mb-4">
                    <a
                      href={upiUri}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF6803] text-white font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] cursor-pointer"
                    >
                      <Smartphone size={16} /> Pay ₹1,999 with UPI
                    </a>
                    <p className="text-center text-[9px] text-[#1A1A1A]/25 font-mono mt-2">
                      Opens your UPI app directly
                    </p>
                  </div>

                  <div className="border-t-2 border-[#1A1A1A]/5 pt-4">
                    <p className="text-[10px] text-[#1A1A1A]/30 font-bold text-center mb-3">
                      After completing payment, click below to activate Pro
                    </p>
                    <motion.button
                      onClick={handleConfirmPayment}
                      disabled={upgrading}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:shadow-[4px_4px_0_#1A1A1A] transition-shadow disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {upgrading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {upgrading
                        ? "Activating..."
                        : "I've Paid — Activate Pro"}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
