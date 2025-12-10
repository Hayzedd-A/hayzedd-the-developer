"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  MessageSquare,
  Code,
  Palette,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";

export default function WelcomePage() {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const services = [
    {
      icon: <Code className="w-5 h-5" />,
      title: "Custom Web Development",
      description: "Tailored solutions for your business needs"
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Brand Identity & Design",
      description: "Creating memorable digital experiences"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Performance Optimization",
      description: "Lightning-fast websites that convert"
    }
  ];

  const benefits = [
    "Increase online visibility by 300%",
    "Boost conversion rates significantly",
    "Mobile-first responsive design",
    "SEO optimized for search engines"
  ];

  return (
    <div
      className={`min-h-screen ${currentTheme.background} overflow-hidden flex items-center justify-center p-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col-reverse xl:flex-row gap-8 lg:gap-12 items-center"
        >
          {/* Left Side - Business-Focused Content */}
          <motion.div variants={itemVariants} className="space-y-6 lg:pr-8">
            {/* Business Badge */}
            <motion.div variants={itemVariants}>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${currentTheme.primary} text-white mb-4`}
              >
                Transform Your Ideas into Reality
              </span>
            </motion.div>

            {/* Main Value Proposition */}
            <motion.h1
              variants={itemVariants}
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${currentTheme.text} leading-tight`}
            >
              I Build{" "}
              <span className={`${currentTheme.accent} relative`}>
                Websites
                <motion.div
                  className={`absolute -bottom-2 left-0 h-1 ${currentTheme.primary} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>{" "}
              That Grow Your Business
            </motion.h1>

            {/* Professional Subtitle */}
            <motion.h2
              variants={itemVariants}
              className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${currentTheme.textSecondary}`}
            >
              Full Stack Web Developer & Digital Solutions Expert
            </motion.h2>

            {/* Client-Focused Description */}
            <motion.p
              variants={itemVariants}
              className={`text-lg ${currentTheme.textSecondary} leading-relaxed max-w-2xl`}
            >
              I help businesses establish a powerful online presence with custom web solutions 
              that drive results. From stunning websites to complex web applications, I deliver 
              digital experiences that engage your customers and accelerate your growth.
            </motion.p>

            {/* Key Services */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className={`text-lg font-semibold ${currentTheme.text} flex items-center gap-2`}>
                <Users className="w-5 h-5" />
                What I Deliver For Your Business:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    variants={itemVariants}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${currentTheme.hover} transition-all duration-300`}
                  >
                    <div className={`${currentTheme.primary} text-white p-2 rounded-lg`}>
                      {service.icon}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${currentTheme.text}`}>
                        {service.title}
                      </h4>
                      <p className={`text-sm ${currentTheme.textSecondary}`}>
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Business Benefits */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className={`text-lg font-semibold ${currentTheme.text} flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                Results You Can Expect:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    variants={itemVariants}
                    className={`flex items-center space-x-2 ${currentTheme.textSecondary}`}
                  >
                    <CheckCircle className={`w-4 h-4 ${currentTheme.primary}`} />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center space-x-2 px-8 py-4 ${currentTheme.primary} text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <span>Start Your Project</span>
                  <MessageSquare className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center space-x-2 px-8 py-4 border-2 ${currentTheme.border} ${currentTheme.text} rounded-lg font-semibold ${currentTheme.hover} transition-all duration-300`}
              >
                <Download className="w-5 h-5" />
                <Link
                  href="/portfolio"
                  target="_blank"
                >
                  View Portfolio
                </Link>
              </motion.button>
            </motion.div>
           
          </motion.div>

          {/* Right Side - Enhanced Profile with Tech Elements */}
          <motion.div
            variants={imageVariants}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Background decoration */}
              <motion.div
                className={`absolute -inset-4 bg-gradient-to-r ${currentTheme.gradient} rounded-full opacity-20 blur-2xl`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Profile image container */}
              <motion.div
                className={`relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 ${currentTheme.border} shadow-2xl`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}
                >
                  <img
                    src="/profile.png"
                    alt="Adebayo Azeez - Web Developer & Digital Solutions Expert"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Tech Stack Floating Elements */}
              <motion.div
                className={`absolute top-10 -right-6 w-20 h-20 ${currentTheme.primary} rounded-lg opacity-90 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⚛️
              </motion.div>

              <motion.div
                className={`absolute bottom-10 -left-6 w-16 h-16 ${currentTheme.primary} rounded-full opacity-90 flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                🚀
              </motion.div>

              {/* Additional floating elements for web development */}
              <motion.div
                className={`absolute top-1/2 -left-8 w-12 h-12 ${currentTheme.primary} rounded-lg opacity-80 flex items-center justify-center text-white text-lg font-bold shadow-lg`}
                animate={{
                  x: [0, -5, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                💻
              </motion.div>

              <motion.div
                className={`absolute top-20 right-10 w-14 h-14 ${currentTheme.primary} rounded-full opacity-80 flex items-center justify-center text-white text-lg font-bold shadow-lg`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                🎨
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}