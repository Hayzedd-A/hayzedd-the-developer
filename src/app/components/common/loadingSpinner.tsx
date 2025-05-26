"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";

const Loading: React.FC = () => {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme]

  return (
    <div
      className={`fixed inset-0 ${currentTheme.background} flex items-center justify-center z-50`}
    >
      <div className="text-center">
        {/* Main loading animation */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <motion.div
            className={`w-20 h-20 border-4 ${currentTheme.border} rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner spinning element */}
          <motion.div
            className={`absolute inset-2 w-16 h-16 border-4 border-transparent ${currentTheme.primary} border-t-4 rounded-full`}
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Center dot */}
          <motion.div
            className={`absolute inset-6 w-8 h-8 ${currentTheme.primary} rounded-full`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
            Loading
          </h2>
          <motion.div
            className="flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 ${currentTheme.primary} rounded-full`}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
          <p className={`text-sm ${currentTheme.textSecondary} mt-4`}>
            Preparing your experience...
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className={`mt-8 w-64 h-1 ${currentTheme.border} rounded-full overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className={`h-full ${currentTheme.primary} rounded-full`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
