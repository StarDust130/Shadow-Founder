"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative">
        {/* Main brutalist box that morphs and rotates */}
        <motion.div
          animate={{
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ["15%", "40%", "15%"],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 bg-[#FF6803] border-4 border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A]"
        />

        {/* Inner floating dot for that cool techy vibe */}
        <motion.div
          animate={{
            x: [-8, 8, -8],
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1A1A1A] rounded-full shadow-[1px_1px_0_#1A1A1A]"
        />
      </div>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 flex flex-col items-center"
      >
        <p className="text-[12px] font-bold tracking-[0.3em] uppercase text-[#1A1A1A] font-mono">
          Assembling UI
        </p>

        {/* Cool brutalist progress bar */}
        <div className="w-24 h-[3px] bg-[#1A1A1A]/10 mt-3 rounded-full overflow-hidden relative border border-[#1A1A1A]/5">
          <motion.div
            animate={{ x: ["-100%", "100%", "-100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#FF6803]"
          />
        </div>
      </motion.div>
    </div>
  );
}
