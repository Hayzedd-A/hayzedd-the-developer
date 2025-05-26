"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import { themes } from "@/app/context/ThemeContext";
import { GitHubContribution, Theme } from "@/types/types.index";
import { useState } from "react";

interface ContributionGraphProps {
  contributions: GitHubContribution[];
  theme: Theme;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  contributions,
  theme,
}) => {
  const [hoveredDay, setHoveredDay] = useState<GitHubContribution | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Group contributions by week
  const weeks: GitHubContribution[][] = [];
  let currentWeek: GitHubContribution[] = [];

  contributions.forEach((contribution, index) => {
    const date = new Date(contribution.date);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }

    currentWeek.push(contribution);

    if (index === contributions.length - 1) {
      weeks.push(currentWeek);
    }
  });

  // Calculate stats
  const totalContributions = contributions.reduce(
    (sum, day) => sum + day.count,
    0
  );
  const maxContributions = Math.max(...contributions.map((day) => day.count));
  const streakDays = calculateStreak(contributions);
  // const currentColor = theme; // blue | green | purple | orange

  const levelColors =
    themes[theme].githubVariants || themes.blue.githubVariants;

  const handleMouseEnter = (
    contribution: GitHubContribution,
    event: React.MouseEvent
  ) => {
    setHoveredDay(contribution);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`text-center p-3 rounded-lg ${themes[theme].hover}`}>
          <div className={`text-lg font-bold ${themes[theme].text}`}>
            {totalContributions.toLocaleString()}
          </div>
          <div className={`text-xs ${themes[theme].textSecondary}`}>
            Total Contributions
          </div>
        </div>
        <div className={`text-center p-3 rounded-lg ${themes[theme].hover}`}>
          <div className={`text-lg font-bold ${themes[theme].text}`}>
            {maxContributions}
          </div>
          <div className={`text-xs ${themes[theme].textSecondary}`}>
            Best Day
          </div>
        </div>
        <div className={`text-center p-3 rounded-lg ${themes[theme].hover}`}>
          <div className={`text-lg font-bold ${themes[theme].text}`}>
            {streakDays}
          </div>
          <div className={`text-xs ${themes[theme].textSecondary}`}>
            Current Streak
          </div>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="relative">
        <div className="text-xs text-gray-500 mb-2">
          {contributions.length > 0 && (
            <>
              {new Date(contributions[0].date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(
                contributions[contributions.length - 1].date
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="inline-flex gap-1 min-w-full">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const contribution = week.find(
                    (c) => new Date(c.date).getDay() === dayIndex
                  );
                  const isEmpty = !contribution;

                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: (weekIndex * 7 + dayIndex) * 0.001,
                      }}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${
                        isEmpty
                          ? "opacity-30"
                          : `hover:ring-2 hover:ring-offset-1 ${themes[theme].ring}`
                      }`}
                      style={{
                        backgroundColor: String(isEmpty
                          ? levelColors[0]
                          : levelColors[
                              contribution.level as keyof typeof levelColors
                            ]),
                      }}
                      onMouseEnter={(e) =>
                        contribution && handleMouseEnter(contribution, e)
                      }
                      onMouseLeave={handleMouseLeave}
                      whileHover={{ scale: 1.2 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Month Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>

        {/* Day Labels */}
        <div className="absolute -left-8 top-0 flex flex-col justify-between h-full text-xs text-gray-500 py-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          {Object.entries(levelColors).map(([level, color]) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
          }}
        >
          <div className="font-medium">
            {hoveredDay.count} contribution
            {hoveredDay.count !== 1 ? "s" : ""}
          </div>
          <div className="text-xs opacity-75">
            {new Date(hoveredDay.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate current streak
function calculateStreak(contributions: GitHubContribution[]): number {
  let streak = 0;
  const today = new Date();

  for (let i = contributions.length - 1; i >= 0; i--) {
    const contribution = contributions[i];
    const date = new Date(contribution.date);
    const daysDiff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak && contribution.count > 0) {
      streak++;
    } else if (daysDiff === streak && contribution.count === 0) {
      break;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
}

export default ContributionGraph;
