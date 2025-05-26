"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme, themes } from "@/app/context/ThemeContext";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [pathname]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const loadingVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="lg:ml-[16rem]">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 ${themes[theme].background} flex items-center justify-center z-50`}
          >
            <div className="text-center">
              {/* Mini loading animation for page transitions */}
              <motion.div
                className={`w-12 h-12 border-3 border-transparent ${themes[theme].primary} border-t-3 rounded-full mx-auto mb-4`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p
                className={`text-sm ${themes[theme].textSecondary}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading page...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
