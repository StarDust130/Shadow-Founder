"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Pulsing logo block */}
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 bg-[#FF6803] rounded-2xl grid grid-cols-2 gap-[3px] p-[6px] border-2 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A]"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              className="bg-white rounded-sm"
            />
          ))}
        </motion.div>
      </div>

      {/* Text + progress */}
      <motion.p
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[11px] font-black tracking-[0.25em] uppercase text-[#1A1A1A]/50 font-mono mb-4"
      >
        Loading
      </motion.p>

      <div className="w-32 h-1 bg-[#1A1A1A]/8 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/3 h-full bg-[#FF6803] rounded-full"
        />
      </div>
    </div>
  );
}
