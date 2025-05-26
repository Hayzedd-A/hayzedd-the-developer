"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import { themes } from "@/app/context/ThemeContext";
import { GitHubLanguageStats, Theme } from "@/types/types.index";
import { JSX } from "react";

interface LanguageChartProps {
  languages: GitHubLanguageStats;
  theme: Theme;
}

const LanguageChart: React.FC<LanguageChartProps> = ({ languages, theme }) => {
  // Language colors mapping
  const languageColors: { [key: string]: string } = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    SCSS: "#c6538c",
    Vue: "#4FC08D",
    React: "#61DAFB",
    Angular: "#DD0031",
    Shell: "#89e051",
    PowerShell: "#012456",
    Dockerfile: "#384d54",
    YAML: "#cb171e",
    JSON: "#292929",
    Markdown: "#083fa1",
  };

  // Calculate total bytes and sort languages
  const totalBytes = Object.values(languages).reduce(
    (sum, bytes) => sum + bytes,
    0
  );
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Show top 8 languages

  if (sortedLanguages.length === 0) {
    return (
      <div className={`text-center py-8 ${themes[theme].textSecondary}`}>
        No language data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Bars */}
      <div className="space-y-3">
        {sortedLanguages.map(([language, bytes], index) => {
          const percentage = (bytes / totalBytes) * 100;
          const color = languageColors[language] || "#6b7280";

          return (
            <motion.div
              key={language}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className={themes[theme].text}>{language}</span>
                </div>
                <span className={themes[theme].textSecondary}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div
                className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pie Chart Representation */}
      <div className="flex items-center justify-center mt-6">
        <div className="relative w-32 h-32">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {
              sortedLanguages.reduce(
                (acc, [language, bytes], index) => {
                  const percentage = (bytes / totalBytes) * 100;
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = `${
                    (percentage / 100) * circumference
                  } ${circumference}`;
                  const strokeDashoffset = -acc.offset;
                  const color = languageColors[language] || "#6b7280";

                  acc.offset += (percentage / 100) * circumference;
                  acc.elements.push(
                    <motion.circle
                      key={language}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  );

                  return acc;
                },
                { offset: 0, elements: [] as JSX.Element[] }
              ).elements
            }
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {sortedLanguages.map(([language, bytes]) => {
          const percentage = (bytes / totalBytes) * 100;
          const color = languageColors[language] || "#6b7280";

          return (
            <div key={language} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className={`${themes[theme].textSecondary} truncate`}>
                {language} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageChart;
