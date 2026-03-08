"use client";

import { motion } from "framer-motion";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-9999 bg-[#E5E4E2] flex flex-col items-center justify-center gap-5">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-12 h-12 bg-[#FF6803] grid grid-cols-2 gap-0.5 p-1 rounded-xl">
          <div className="bg-white rounded-sm" />
          <div className="bg-white rounded-sm" />
          <div className="bg-white rounded-sm" />
          <div className="bg-white rounded-sm" />
        </div>
      </motion.div>

      {/* Minimal progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-32 h-1 bg-[#1A1A1A]/6 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-[#FF6803]/60 rounded-full"
        />
      </motion.div>
    </div>
  );
}
