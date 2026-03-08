"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Crosshair,
  Code2,
  User,
  Zap,
  Cpu,
} from "lucide-react";
import Image from "next/image";

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
  const router = useRouter();
  const { user } = useUser();
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
            className="fixed left-4 top-1/2 -translate-y-1/2 z-60 flex flex-col gap-2 p-2.5 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isProfileAvatar =
                item.href === "/profile" && !!user?.imageUrl;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={
                      isProfileAvatar
                        ? { scale: 1.06, y: -1 }
                        : {
                            scale: 1.12,
                            rotate: [0, -8, 8, 0],
                            transition: {
                              rotate: {
                                type: "tween",
                                duration: 0.35,
                                ease: "easeInOut",
                              },
                            },
                          }
                    }
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="relative group"
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden ${
                        isActive && !isProfileAvatar
                          ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
                          : isActive && isProfileAvatar
                            ? "border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] bg-white/40"
                            : isProfileAvatar
                              ? "opacity-75 hover:opacity-100"
                              : "text-[#1A1A1A]/30 hover:text-[#1A1A1A] hover:bg-white/50"
                      }`}
                    >
                      {isProfileAvatar ? (
                        <Image
                          src={user.imageUrl!}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <item.icon size={18} />
                      )}
                    </div>
                    {/* Tooltip - instant, no animation */}
                    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap shadow-lg z-50">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1A1A1A]" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══ TOP HEADER ═══ */}
      <header className="sticky top-0 z-50 h-14 px-4 lg:pl-24 flex items-center justify-between bg-[#E5E4E2]/80 backdrop-blur-2xl border-b border-[#1A1A1A]/6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 6 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-7 h-7 bg-[#FF6803] grid grid-cols-2 gap-0.5 p-0.5 rounded-md border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] group-hover:shadow-[3px_3px_0_#FF6803] transition-shadow"
            >
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
            </motion.div>
            <span className="font-black text-sm tracking-tight text-[#1A1A1A] hidden sm:inline">
              Shadow<span className="text-[#FF6803]">.</span>
            </span>
          </Link>
          <span className="text-[#1A1A1A]/10 text-xs hidden sm:inline">/</span>
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            {currentPage}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* AI Engine Status */}
          <div className="hidden sm:flex items-center gap-2 bg-white/50 border border-[#1A1A1A]/8 rounded-lg px-3 py-1.5">
            <Cpu size={10} className="text-[#FF6803]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 font-mono">
              AI Engine
            </span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, type: "tween" }}
              className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
            />
          </div>

          {/* Status pill */}
          <div className="flex items-center gap-1.5 bg-white border-2 border-[#1A1A1A]/10 rounded-full px-3 py-1">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, type: "tween" }}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 hidden sm:inline">
              Online
            </span>
            <Zap size={10} className="text-[#FF6803] sm:hidden" />
          </div>

          {/* Mobile user avatar — click redirects to /profile */}
          <div
            className="lg:hidden cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] bg-[#FF6803] flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
            )}
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
        <nav className="fixed bottom-0 left-0 right-0 z-60 bg-white border-t-2 border-[#1A1A1A] px-3 pt-2 pb-[max(env(safe-area-inset-bottom),8px)]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isProfileAvatar =
                item.href === "/profile" && !!user?.imageUrl;
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <motion.div
                    whileHover={
                      !isProfileAvatar
                        ? {
                            y: -2,
                            rotate: [-4, 4, 0],
                            transition: {
                              rotate: {
                                type: "tween",
                                duration: 0.3,
                                ease: "easeInOut",
                              },
                            },
                          }
                        : { y: -2 }
                    }
                    whileTap={{ scale: 0.88, y: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className={`flex flex-col items-center gap-0.5 py-2 mx-1 rounded-xl transition-all ${
                      isActive && !isProfileAvatar
                        ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A]"
                        : isActive && isProfileAvatar
                          ? "border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] bg-[#1A1A1A]/5"
                          : "text-[#1A1A1A]/35"
                    }`}
                  >
                    {isProfileAvatar ? (
                      <Image
                        src={user.imageUrl!}
                        alt="Profile"
                        width={22}
                        height={22}
                        className={`w-5.5 h-5.5 rounded-md object-cover ${
                          isActive ? "" : "opacity-60"
                        }`}
                      />
                    ) : (
                      <item.icon size={18} />
                    )}
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
