"use client";

import React, { Dispatch, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  Code,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Menu,
  X,
  Palette,
} from "lucide-react";
import { lightThemes, useTheme } from "@/app/context/ThemeContext";
import { Theme } from "@/types/types.index";
import TechStackModel from "./TechStackModel";
import { Moon, Sun } from "lucide-react";

const navigation = [
  { name: "Welcome", href: "/", icon: Home },
  { name: "About Me", href: "/about", icon: User },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Skills", href: "/skills", icon: Code },
  { name: "Contact", href: "/contact", icon: Mail },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/yourusername", icon: Github },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: Linkedin,
  },
  { name: "Twitter", href: "https://twitter.com/yourusername", icon: Twitter },
];
interface Sidebarprops {
  isOpen: Boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar: React.FC = () => {
    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const pathname = usePathname();
    const { currentThemes, theme, setTheme, isDarkMode, setIsDarkMode, isOpen, setIsOpen } =
    useTheme();
    const currentTheme = currentThemes[theme]

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-6 border-b ${currentTheme.border}`}>
        <h2 className={`text-xl font-bold ${currentTheme.text}`}>
          Adebayo Azeez
        </h2>
        <p className={`text-sm ${currentTheme.textSecondary}`}>
          Full Stack Developer
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? `${currentTheme.primary} text-white shadow-lg transform scale-105`
                  : `${currentTheme.text} ${currentTheme.hover} hover:shadow-md hover:transform hover:scale-102`
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3D Tech stack model */}
      <TechStackModel />

      {/* Theme Controls */}
      <div className={`flex p-4 border-t ${currentTheme.border} space-y-2`}>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex flex-1/3 items-center w-full px-4 py-3 text-sm font-medium ${currentTheme.text} rounded-lg ${currentTheme.hover} transition-all duration-200 hover:shadow-md`}
        >
          {isDarkMode ? (
            <Sun className={`w-5 h-5 mr-3 ${currentTheme.accent}`} />
          ) : (
            <Moon className={`w-5 h-5 mr-3 ${currentTheme.accent}`} />
          )}
          {/* {isDarkMode ? "Light Mode" : "Dark Mode"} */}
        </button>

        {/* Color Theme Selector */}
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`flex flex-2/3 items-center w-full px-4 py-3 text-sm font-medium ${currentTheme.text} rounded-lg ${currentTheme.hover} transition-all duration-200 hover:shadow-md`}
        >
          <Palette className={`w-5 h-5 mr-3 ${currentTheme.accent}`} />
          Color Theme
        </button>
      </div>
      {/* Theme Selector Dropdown */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-2 m-2 grid grid-cols-4 gap-2"
          >
            {(Object.keys(lightThemes) as Theme[]).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`w-8 h-8 rounded-full ${
                  lightThemes[themeOption].primary
                } transition-all duration-200 hover:scale-110 ${
                  theme === themeOption
                    ? `ring-2 ring-offset-2 ${currentTheme.ring} shadow-lg`
                    : "hover:shadow-md"
                }`}
                title={themeOption}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Links */}
      <div className={`p-4 border-t ${currentTheme.border}`}>
        <div className="flex justify-center space-x-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 ${currentTheme.textSecondary} ${currentTheme.primaryHover} hover:text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:transform hover:scale-110`}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 ${currentTheme.background} rounded-lg shadow-lg lg:hidden transition-all duration-200 hover:shadow-xl ${currentTheme.border} border`}
      >
        {isOpen ? (
          <X className={`w-6 h-6 ${currentTheme.text}`} />
        ) : (
          <Menu className={`w-6 h-6 ${currentTheme.text}`} />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ${currentTheme.background} border-r ${currentTheme.border} shadow-xl`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-40 bg-opacity-50 lg:hidden backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed inset-y-0 left-0 z-50 w-64 ${currentTheme.background} border-r ${currentTheme.border} lg:hidden shadow-2xl`}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
