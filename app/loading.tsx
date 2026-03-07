"use client";

import { motion } from "framer-motion";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#E3E3E3] flex flex-col items-center justify-center gap-6 selection:bg-[#FF6803] selection:text-white">
      {/* Pulsing logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.15, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255,104,3,0.4)",
              "0 0 0 30px rgba(255,104,3,0)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-2xl"
        />
        <div className="w-16 h-16 bg-[#FF6803] grid grid-cols-2 gap-[3px] p-[4px] rounded-2xl shadow-lg">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
              className="bg-white rounded-md"
            />
          ))}
        </div>
      </motion.div>

      {/* App name with blink effect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.h1
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A] uppercase"
        >
          Shadow Founder
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#FF6803] to-transparent"
        />
      </motion.div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              delay: i * 0.15,
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
            className="w-2 h-2 rounded-full bg-[#FF6803]"
          />
        ))}
      </div>
    </div>
  );
}
