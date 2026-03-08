"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Crosshair, Code2, User, Zap } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Validator", href: "/validator", icon: Crosshair },
  { label: "Builder", href: "/builder", icon: Code2 },
  { label: "Profile", href: "/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentPage =
    navItems.find((item) => pathname.startsWith(item.href))?.label || "Hub";

  return (
    <div className="min-h-screen bg-[#E5E4E2] font-sans selection:bg-[#FF6803] selection:text-white">
      {/* ═══ DESKTOP FLOATING DOCK ═══ */}
      <AnimatePresence>
        {!isMobile && (
          <motion.nav
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-1.5 p-2.5 bg-white/15 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group"
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
                          : "text-[#1A1A1A]/35 hover:text-[#1A1A1A] hover:bg-white/50"
                      }`}
                    >
                      <item.icon size={20} />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1A1A1A] text-white text-[11px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#1A1A1A]" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}

            {/* Separator */}
            <div className="w-8 h-[2px] bg-white/10 rounded-full mx-auto my-1" />

            {/* User */}
            <div className="flex justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] rounded-xl",
                  },
                }}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══ TOP HEADER ═══ */}
      <header className="sticky top-0 z-50 h-14 px-4 lg:pl-24 flex items-center justify-between bg-[#E5E4E2]/80 backdrop-blur-2xl border-b border-[#1A1A1A]/[0.04]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-[#FF6803] grid grid-cols-2 gap-[2px] p-[2px] rounded-md border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] group-hover:shadow-[3px_3px_0_#FF6803] transition-shadow">
              <div className="bg-white rounded-[2px]" />
              <div className="bg-white rounded-[2px]" />
              <div className="bg-white rounded-[2px]" />
              <div className="bg-white rounded-[2px]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#1A1A1A] hidden sm:inline">
              Shadow<span className="text-[#FF6803]">.</span>
            </span>
          </Link>
          <span className="text-[#1A1A1A]/10 text-xs hidden sm:inline">/</span>
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            {currentPage}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status pill - neubrutalist */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-full px-3 py-1 shadow-[2px_2px_0_#FF6803]">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 hidden sm:inline">
              Engine Ready
            </span>
            <Zap size={10} className="text-[#FF6803] sm:hidden" />
          </div>

          {/* Mobile user */}
          <div className="lg:hidden">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-8 h-8 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] rounded-lg",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <main
        className={`p-4 md:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)] ${
          isMobile ? "pb-24" : "lg:pl-24"
        }`}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/25 backdrop-blur-2xl border-t-2 border-[#1A1A1A] px-3 pt-2 pb-[max(env(safe-area-inset-bottom),8px)]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={`flex flex-col items-center gap-0.5 py-2 mx-1 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                        : "text-[#1A1A1A]/35"
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-[8px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
