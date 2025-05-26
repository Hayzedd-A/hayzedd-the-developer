"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./loadingSpinner";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000); // Show loading for 2 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isInitializing ? (
        <motion.div
          key="initializing"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Loading />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppInitializer;
