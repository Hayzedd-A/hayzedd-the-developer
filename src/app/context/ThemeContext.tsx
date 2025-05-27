"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  SetStateAction,
} from "react";
import { Theme } from "@/types/types.index";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  currentThemes: typeof lightThemes; // Export current theme object
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Light mode themes
const lightThemes = {
  blue: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    accent: "text-blue-600",
    gradient: "from-blue-600 to-blue-800",
    background: "bg-gray-50",
    backgroundSecondary: "bg-gray-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-blue-200",
    hover: "hover:bg-blue-50",
    ring: "ring-blue-400",
    githubVariants: ["#00132d", "#0f3460", "#1e40af", "#3b82f6", "#60a5fa"],
  },
  purple: {
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    accent: "text-purple-600",
    gradient: "from-purple-600 to-purple-800",
    background: "bg-white",
    backgroundSecondary: "bg-gray-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-purple-200",
    hover: "hover:bg-purple-50",
    ring: "ring-purple-400",
    githubVariants: ["#1b002d", "#2d1b69", "#553c9a", "#7c3aed", "#a855f7"],
  },
  green: {
    primary: "bg-green-600",
    primaryHover: "hover:bg-green-700",
    accent: "text-green-600",
    gradient: "from-green-600 to-green-800",
    background: "bg-white",
    backgroundSecondary: "bg-gray-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-green-200",
    hover: "hover:bg-green-50",
    ring: "ring-green-400",
    githubVariants: ["#032b00", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
  orange: {
    primary: "bg-orange-600",
    primaryHover: "hover:bg-orange-700",
    accent: "text-orange-600",
    gradient: "from-orange-600 to-orange-800",
    background: "bg-white",
    backgroundSecondary: "bg-gray-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-orange-200",
    hover: "hover:bg-orange-50",
    ring: "ring-orange-400",
    githubVariants: ["#290000", "#9a3412", "#c2410c", "#ea580c", "#f97316"],
  },
};

// Dark mode themes
const darkThemes = {
  blue: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    accent: "text-blue-400",
    gradient: "from-blue-600 to-blue-800",
    background: "bg-gray-900",
    backgroundSecondary: "bg-gray-800",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-blue-800",
    hover: "hover:bg-blue-900/20",
    ring: "ring-blue-500",
    githubVariants: ["#00132d", "#0f3460", "#1e40af", "#3b82f6", "#60a5fa"],
  },
  purple: {
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    accent: "text-purple-400",
    gradient: "from-purple-600 to-purple-800",
    background: "bg-gray-900",
    backgroundSecondary: "bg-gray-800",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-purple-800",
    hover: "hover:bg-purple-900/20",
    ring: "ring-purple-500",
    githubVariants: ["#1b002d", "#2d1b69", "#553c9a", "#7c3aed", "#a855f7"],
  },
  green: {
    primary: "bg-green-600",
    primaryHover: "hover:bg-green-700",
    accent: "text-green-400",
    gradient: "from-green-600 to-green-800",
    background: "bg-gray-900",
    backgroundSecondary: "bg-gray-800",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-green-800",
    hover: "hover:bg-green-900/20",
    ring: "ring-green-500",
    githubVariants: ["#032b00", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
  orange: {
    primary: "bg-orange-600",
    primaryHover: "hover:bg-orange-700",
    accent: "text-orange-400",
    gradient: "from-orange-600 to-orange-800",
    background: "bg-gray-900",
    backgroundSecondary: "bg-gray-800",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-orange-800",
    hover: "hover:bg-orange-900/20",
    ring: "ring-orange-500",
    githubVariants: ["#290000", "#9a3412", "#c2410c", "#ea580c", "#f97316"],
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("blue");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Get current theme object based on dark mode
  const currentThemes = isDarkMode ? darkThemes : lightThemes;

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme;
    const savedDarkMode =
      localStorage.getItem("portfolio-dark-mode") === "true";

    if (savedTheme && lightThemes[savedTheme]) {
      setTheme(savedTheme);
    }

    setIsDarkMode(savedDarkMode);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    localStorage.setItem("portfolio-dark-mode", isDarkMode.toString());
    console.log("switching mode", isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "white"
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "black";

    }
  }, [isDarkMode]);

  // Save theme preference and update CSS custom properties
  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);

    // Update CSS custom properties with current theme
    const root = document.documentElement;
    const themeColors = currentThemes[theme];

    root.style.setProperty("--theme-primary", themeColors.primary);
    root.style.setProperty("--theme-accent", themeColors.accent);
    root.style.setProperty("--theme-background", themeColors.background);
    root.style.setProperty("--theme-text", themeColors.text);
  }, [theme, currentThemes]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode,
        setIsDarkMode,
        isOpen,
        setIsOpen,
        currentThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Export both theme objects for direct access if needed
export { lightThemes, darkThemes };

// Export current themes (this will be the active theme object)
export const getCurrentThemes = (isDarkMode: boolean) => {
  return isDarkMode ? darkThemes : lightThemes;
};
