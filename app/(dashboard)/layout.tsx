"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, Crosshair, Code2, User, Zap } from "lucide-react";
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
                      className={`w-10 h-10 flex items-center justify-center transition-all duration-200 overflow-hidden ${
                        isActive && !isProfileAvatar
                          ? "bg-[#FF6803] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] rounded-xl"
                          : isActive && isProfileAvatar
                            ? "ring-2 ring-[#FF6803] ring-offset-2 ring-offset-transparent rounded-full shadow-[0_0_12px_rgba(255,104,3,0.25)]"
                            : isProfileAvatar
                              ? "rounded-full opacity-75 hover:opacity-100 hover:ring-2 hover:ring-[#1A1A1A]/15 hover:ring-offset-1"
                              : "text-[#1A1A1A]/30 hover:text-[#1A1A1A] hover:bg-white/50 rounded-xl"
                      }`}
                    >
                      {isProfileAvatar ? (
                        <Image
                          src={user.imageUrl!}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
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
              Shadow Founder<span className="text-[#FF6803]">.</span>
            </span>
          </Link>
          <span className="text-[#1A1A1A]/10 text-xs hidden sm:inline">/</span>
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            {currentPage}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* AI Engine Status — unified pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm border  border-[#1A1A1A]/6 rounded-full px-3.5 py-1.5 shadow-sm">
            😎
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#050505]/90 font-mono">
              BE COOL
            </span>
            <div className="w-px h-3 bg-[#1a1a1a]/8" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600/90 font-mono">
              STAY COOL
            </span>
          </div>

          {/* Mobile-only status dot */}
          <div className="sm:hidden flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[#1A1A1A]/6">
            <Zap size={10} className="text-[#FF6803]" />
          </div>

          {/* Mobile user avatar — click redirects to /profile */}
          <motion.div
            className="lg:hidden cursor-pointer relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/profile")}
          >
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={34}
                height={34}
                className="w-8.5 h-8.5 rounded-full object-cover ring-2 ring-[#1A1A1A]/10 ring-offset-1 ring-offset-[#E5E4E2] hover:ring-[#FF6803]/40 transition-all"
              />
            ) : (
              <div className="w-8.5 h-8.5 rounded-full bg-[#FF6803] flex items-center justify-center ring-2 ring-[#1A1A1A]/10 ring-offset-1 ring-offset-[#E5E4E2]">
                <User size={14} className="text-white" />
              </div>
            )}
          </motion.div>
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
        <nav className="fixed bottom-0 left-0 right-0 z-60 bg-white/80 backdrop-blur-2xl border-t border-[#1A1A1A]/8 px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isProfileAvatar =
                item.href === "/profile" && !!user?.imageUrl;
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className={`flex flex-col items-center gap-0.5 py-2 mx-0.5 rounded-2xl transition-all duration-200 ${
                      isActive && !isProfileAvatar
                        ? "bg-[#FF6803] text-white shadow-[0_2px_12px_rgba(255,104,3,0.3)]"
                        : isActive && isProfileAvatar
                          ? "bg-[#FF6803]/8"
                          : "text-[#1A1A1A]/30"
                    }`}
                  >
                    {isProfileAvatar ? (
                      <Image
                        src={user.imageUrl!}
                        alt="Profile"
                        width={22}
                        height={22}
                        className={`w-5.5 h-5.5 rounded-full object-cover transition-all ${
                          isActive
                            ? "ring-2 ring-[#FF6803] ring-offset-1"
                            : "opacity-50 grayscale-30"
                        }`}
                      />
                    ) : (
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                    )}
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider ${
                        isActive && isProfileAvatar ? "text-[#FF6803]" : ""
                      }`}
                    >
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
