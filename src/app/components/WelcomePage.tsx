"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import { useTheme, themes } from "@/app/context/ThemeContext";
import Link from "next/link";

export default function WelcomePage() {
  const { theme } = useTheme();

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

  return (
    <div
      className={`min-h-screen ${themes[theme].background} overflow-hidden flex items-center justify-center p-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col-reverse xl:flex-row gap-8 lg:gap-12 items-center"
        >
          {/* Left Side - Introduction Text */}
          <motion.div variants={itemVariants} className="space-y-6 lg:pr-8">
            {/* Greeting */}
            <motion.div variants={itemVariants}>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${themes[theme].primary} text-white mb-4`}
              >
                👋 Welcome to my portfolio
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${themes[theme].text} leading-tight`}
            >
              Hi, I'm{" "}
              <span className={`${themes[theme].accent} relative`}>
                Azeez
                <motion.div
                  className={`absolute -bottom-2 left-0 h-1 ${themes[theme].primary} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={itemVariants}
              className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${themes[theme].textSecondary}`}
            >
              Full Stack Web Developer
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className={`text-lg ${themes[theme].textSecondary} leading-relaxed max-w-2xl`}
            >
              I'm a passionate full stack developer with expertise in modern web
              technologies. I create beautiful, responsive, and user-friendly
              applications using React, Next.js, Node.js, and more. I love
              turning complex problems into simple, elegant solutions.
            </motion.p>

            {/* Key Skills */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className={`text-lg font-semibold ${themes[theme].text}`}>
                What I do:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Frontend Development",
                  "Backend Development",
                  "Database Design",
                  "API Integration",
                  "SEO Optimization",
                  "Performance Optimization",
                ].map((skill, index) => (
                  <motion.div
                    key={skill}
                    variants={itemVariants}
                    className={`flex items-center space-x-2 ${themes[theme].textSecondary}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${themes[theme].primary}`}
                    />
                    <span>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 ${themes[theme].primary} text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <span>Chat Me</span>
                  <MessageSquare className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center space-x-2 px-6 py-3 border-2 ${themes[theme].border} ${themes[theme].text} rounded-lg font-semibold ${themes[theme].hover} transition-all duration-300`}
              >
                <Download className="w-5 h-5" />
                <Link href="https://my-cv-web-developer.vercel.app/" target="_blank">
                  Download CV
                </Link>
              </motion.button>
            </motion.div>

            {/* Social Links */}
            {/* <motion.div variants={itemVariants} className="flex space-x-4 pt-4">
              {[
                {
                  icon: Github,
                  href: "https://github.com/yourusername",
                  label: "GitHub",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/in/yourusername",
                  label: "LinkedIn",
                },
                {
                  icon: Mail,
                  href: "mailto:your.email@example.com",
                  label: "Email",
                },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${themes[theme].background} border ${themes[theme].border} rounded-lg ${themes[theme].textSecondary} ${themes[theme].primaryHover} hover:text-white transition-all duration-300 shadow-md hover:shadow-lg`}
                  title={label}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </motion.div> */}
          </motion.div>

          {/* Right Side - Profile Picture */}
          <motion.div
            variants={imageVariants}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Background decoration */}
              <motion.div
                className={`absolute -inset-4 bg-gradient-to-r ${themes[theme].gradient} rounded-full opacity-20 blur-2xl`}
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
                className={`relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 ${themes[theme].border} shadow-2xl`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Placeholder for your image */}
                <div
                  className={`w-full h-full bg-gradient-to-br ${themes[theme].gradient} flex items-center justify-center`}
                >
                  {/* Replace this div with your actual image */}
                  <img
                    src="/profile.png" // Replace with your actual image path
                    alt="Adebayo Azeez - Full Stack Developer"
                    className="w-full h-full object-cover"
                  />
                  {/* If you don't have an image yet, you can use this placeholder */}
                  {/* <div className="text-white text-6xl font-bold">YN</div> */}
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className={`absolute top-10 -right-6 w-20 h-20 ${themes[theme].primary} rounded-lg opacity-80 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
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
                className={`absolute bottom-10 -left-6 w-16 h-16 ${themes[theme].primary} rounded-full opacity-80 flex items-center justify-center text-white text-xl font-bold shadow-lg`}
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
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
