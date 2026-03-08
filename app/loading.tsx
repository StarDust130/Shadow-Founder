"use client";

import { motion } from "framer-motion";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-9999 bg-[#E5E4E2] flex flex-col items-center justify-center gap-6">
      {/* Logo with pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 bg-[#FF6803] grid grid-cols-2 gap-[3px] p-[6px] rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.12 }}
              className="bg-white rounded-sm"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Slim progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-28 h-[3px] bg-[#1A1A1A]/6 rounded-full overflow-hidden"
      >
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/3 h-full bg-[#FF6803] rounded-full"
        />
      </motion.div>
    </div>
  );
}
