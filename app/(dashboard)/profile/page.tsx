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
} from "lucide-react";

interface UserPlan {
  plan: "free" | "pro";
  buildsUsed: number;
  maxBuilds: number;
}

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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const UPI_ID = "9302903537-2@ybl";
const UPI_AMOUNT = "1999";
const UPI_NAME = "ShadowFounder";

export default function ProfilePage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Builder";

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6803] mb-2 flex items-center gap-1.5 font-mono">
          <Zap size={10} /> Account
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-[0.9]">
          Profile<span className="text-[#FF6803]">.</span>
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 font-bold mt-2">
          Account settings & subscription management.
        </p>
      </motion.div>

      {/* WELCOME CARD */}
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

      {/* CREDIT BALANCE + UPGRADE */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        {/* Credit Balance */}
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
              MVP Build Credits
            </h2>
          </div>
          {loading ? (
            <Loader2 size={24} className="animate-spin text-[#FF6803] my-4" />
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
            whileTap={{ scale: 0.99 }}
            className="bg-emerald-500 border-2 border-[#1A1A1A] rounded-2xl p-6 shadow-[6px_6px_0_#1A1A1A] transition-all relative overflow-hidden"
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
                Unlimited MVP builds, priority AI analysis, and advanced code
                generation.
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
                <Sparkles size={14} /> Upgrade Now <ArrowRight size={14} />
              </motion.button>
              <div className="mt-4 flex items-center justify-center gap-1">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono">
                  ₹1,999 one-time via UPI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* QUICK STATS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
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

      {/* CLERK USER PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0_#1A1A1A] overflow-hidden mb-8"
      >
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
      </motion.div>

      {/* COMING SOON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4"
      >
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/25 mb-4 font-mono flex items-center gap-2">
          <Sparkles size={12} className="text-[#FF6803]/40" /> Coming Soon
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

      {/* UPI UPGRADE MODAL */}
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
              className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[8px_8px_0_#1A1A1A] p-6 max-w-md w-full relative"
            >
              <button
                onClick={() => !upgrading && setShowUpgradeModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1A1A1A]/5 transition-colors"
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
                  Pay ₹1,999 via UPI to unlock unlimited builds
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
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF6803] text-white font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
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
                      {upgrading ? "Activating..." : "I've Paid — Activate Pro"}
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
