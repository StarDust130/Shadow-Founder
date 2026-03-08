"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="w-16 h-2 bg-[#FF6803]/15 rounded-full mb-3 animate-pulse" />
        <div className="w-56 h-7 bg-[#1A1A1A]/8 rounded-xl animate-pulse" />
        <div className="w-72 h-2 bg-[#1A1A1A]/5 rounded-full mt-3 animate-pulse" />
      </div>

      {/* Status bar skeleton */}
      <div className="bg-white border-2 border-[#1A1A1A]/8 rounded-xl p-3 mb-8 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400/30 rounded-full" />
          <div className="w-32 h-2 bg-[#1A1A1A]/6 rounded-full" />
          <div className="flex-1" />
          <div className="w-12 h-2 bg-[#FF6803]/10 rounded-full" />
        </div>
      </div>

      {/* CTA skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white border-2 border-[#1A1A1A]/8 rounded-2xl p-5 mb-8 animate-pulse"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF6803]/10 rounded-xl" />
          <div className="flex-1">
            <div className="w-36 h-4 bg-[#1A1A1A]/8 rounded-lg mb-2" />
            <div className="w-48 h-2 bg-[#1A1A1A]/4 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="bg-white border-2 border-[#1A1A1A]/8 rounded-2xl p-4 animate-pulse"
          >
            <div className="w-8 h-8 bg-[#FF6803]/8 rounded-xl mb-3" />
            <div className="w-10 h-5 bg-[#1A1A1A]/8 rounded-lg mb-2" />
            <div className="w-14 h-1.5 bg-[#1A1A1A]/4 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="bg-white border-2 border-[#1A1A1A]/8 rounded-2xl p-4 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1A1A1A]/5 rounded-xl" />
              <div className="flex-1">
                <div className="w-20 h-3 bg-[#1A1A1A]/8 rounded-lg mb-1.5" />
                <div className="w-28 h-1.5 bg-[#1A1A1A]/4 rounded-full" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
