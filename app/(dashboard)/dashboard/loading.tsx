"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="w-20 h-2.5 bg-[#1A1A1A]/8 mb-3 animate-pulse" />
        <div className="w-48 h-8 bg-[#1A1A1A]/10 border-2 border-[#1A1A1A]/5 animate-pulse" />
        <div className="w-64 h-2.5 bg-[#1A1A1A]/5 mt-3 animate-pulse" />
      </div>

      {/* Pipeline skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[6px_6px_0_#FF6803] p-6 mb-8"
      >
        <div className="w-32 h-4 bg-white/10 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4">
              <div className="w-8 h-8 bg-white/10 mb-3 animate-pulse" />
              <div className="w-20 h-3 bg-white/8 mb-2 animate-pulse" />
              <div className="w-14 h-2 bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border-2 border-[#1A1A1A]/10 shadow-[3px_3px_0_#1A1A1A]/10 p-4"
          >
            <div className="w-8 h-8 bg-[#FF6803]/10 mb-3 animate-pulse" />
            <div className="w-12 h-6 bg-[#1A1A1A]/10 mb-2 animate-pulse" />
            <div className="w-16 h-2 bg-[#1A1A1A]/5 animate-pulse" />
          </motion.div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border-2 border-[#1A1A1A]/10 p-5">
          <div className="w-28 h-4 bg-[#1A1A1A]/10 mb-5 animate-pulse" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 bg-[#E5E4E2]/50 border-2 border-[#1A1A1A]/5 animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] p-5 animate-pulse min-h-[250px]" />
      </div>
    </div>
  );
}
