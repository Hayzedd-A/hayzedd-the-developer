"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import { themes } from "@/app/context/ThemeContext";
import { githubService, GITHUB_USERNAME } from "@/app/services/github";
import { GitHubUser, GitHubRepo, GitHubLanguageStats } from "@/types/types.index";
// import {
//   StarIcon,
//   EyeIcon,
//   CodeBracketIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   LinkIcon,
//   MapPinIcon,
//   BuildingOfficeIcon
// } from "@heroicons/react/24/outline";
// import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import ContributionGraph from "./ContributionGraph";
import LanguageChart from "./LanguageStat";
import LoadingSpinner from "./common/loadingSpinner";
import { Building, CalendarIcon, CodeSquareIcon, ExternalLinkIcon, GithubIcon, MapPinIcon, StarIcon, User2Icon } from "lucide-react";

interface GitHubStatsData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  languages: GitHubLanguageStats;
  topRepos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  contributions: any[];
}

const GitHubStats = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<GitHubStatsData>({
    user: null,
    repos: [],
    languages: {},
    topRepos: [],
    totalStars: 0,
    totalForks: 0,
    contributions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "repos" | "activity">(
    "overview"
  );

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [user, repos, languages, topRepos, contributions] =
          await Promise.all([
            githubService.getUserProfile(),
            githubService.getUserRepos(),
            githubService.getLanguageStats(),
            githubService.getTopRepositories(6),
            githubService.getContributionData(),
          ]);

        const totalStars = repos.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        );
        const totalForks = repos.reduce(
          (sum, repo) => sum + repo.forks_count,
          0
        );

        setData({
          user,
          repos,
          languages,
          topRepos,
          totalStars,
          totalForks,
          contributions,
        });
      } catch (err) {
        setError("Failed to fetch GitHub data");
        console.error("GitHub data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

if (loading) {
  return (
    <div
      className={`${themes[theme].background} rounded-2xl p-8 border ${themes[theme].border}`}
    >
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        {/* Compact loading spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`w-12 h-12 border-3 ${themes[theme].border} rounded-full animate-spin`}
          />
          {/* Inner spinning element */}
          <div
            className={`absolute inset-1 w-10 h-10 border-3 border-transparent ${themes[theme].primary} border-t-3 rounded-full animate-spin`}
            style={{
              animationDirection: "reverse",
              animationDuration: "0.75s",
            }}
          />
          {/* Center dot */}
          <div
            className={`absolute inset-3 w-6 h-6 ${themes[theme].primary} rounded-full animate-pulse`}
          />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <p className={`text-sm font-medium ${themes[theme].text}`}>
            Loading GitHub Stats
          </p>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 ${themes[theme].primary} rounded-full animate-bounce`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


  if (error || !data.user) {
    return (
      <div
        className={`${themes[theme].background} rounded-2xl p-8 border ${themes[theme].border}`}
      >
        <div className="text-center">
          <GithubIcon
            className={`w-16 h-16 ${themes[theme].textSecondary} mx-auto mb-4`}
          />
          <h3 className={`text-xl font-semibold ${themes[theme].text} mb-2`}>
            Unable to load GitHub stats
          </h3>
          <p className={`${themes[theme].textSecondary}`}>
            {error || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Public Repos",
      value: data.user.public_repos,
      icon: CodeSquareIcon,
      color: "blue",
    },
    {
      label: "Total Stars",
      value: data.totalStars,
      icon: StarIcon,
      color: "yellow",
    },
    {
      label: "Followers",
      value: data.user.followers,
      icon: User2Icon,
      color: "green",
    },
    {
      label: "Total Forks",
      value: data.totalForks,
      icon: CodeSquareIcon,
      color: "purple",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "repos", label: "Top Repositories" },
    { id: "activity", label: "Contribution Graph" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${themes[theme].background} rounded-2xl border ${themes[theme].border} overflow-hidden`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${themes[theme].border}`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={data.user.avatar_url}
              alt={data.user.name || data.user.login}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-xl font-bold ${themes[theme].text}`}>
                {data.user.name || data.user.login}
              </h3>
              <Link
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 ${themes[theme].textSecondary} hover:${themes[theme].accent} transition-colors duration-200`}
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </Link>
            </div>
            <p className={`${themes[theme].textSecondary} text-sm mb-2`}>
              @{data.user.login}
            </p>
            {data.user.bio && (
              <p className={`${themes[theme].text} text-sm mb-2`}>
                {data.user.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {data.user.location && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-3 h-3" />
                  {data.user.location}
                </span>
              )}
              {data.user.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {data.user.company}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                Joined{" "}
                {new Date(data.user.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`text-center p-4 rounded-lg ${themes[theme].hover}`}
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${themes[theme].primary} mb-2`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`text-lg font-bold ${themes[theme].text}`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className={`text-xs ${themes[theme].textSecondary}`}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${themes[theme].border}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? `${themes[theme].accent} border-b-2 border-current`
                : `${themes[theme].textSecondary} hover:${themes[theme].text}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Languages Chart */}
              <div>
                <h4
                  className={`text-lg font-semibold ${themes[theme].text} mb-4`}
                >
                  Most Used Languages
                </h4>
                <LanguageChart languages={data.languages} theme={theme} />
              </div>

              {/* Recent Activity */}
              <div>
                <h4
                  className={`text-lg font-semibold ${themes[theme].text} mb-4`}
                >
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {data.repos.slice(0, 3).map((repo) => (
                    <div
                      key={repo.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${themes[theme].hover}`}
                    >
                      <div className="flex-1">
                        <h5 className={`font-medium ${themes[theme].text}`}>
                          {repo.name}
                        </h5>
                        <p
                          className={`text-sm ${themes[theme].textSecondary} truncate`}
                        >
                          {repo.description || "No description available"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3" />
                          {repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "repos" && (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-4">
                {data.topRepos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${themes[theme].border} ${themes[theme].hover} transition-colors duration-200`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-semibold ${themes[theme].accent} hover:underline`}
                        >
                          {repo.name}
                        </Link>
                        <p
                          className={`text-sm ${themes[theme].textSecondary} mt-1`}
                        >
                          {repo.description || "No description available"}
                        </p>
                      </div>
                      <Link
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1 ${themes[theme].textSecondary} hover:${themes[theme].accent} transition-colors duration-200`}
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <CodeSquareIcon className="w-3 h-3" />
                        {repo.forks_count}
                      </span>
                      <span className="text-xs">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.topics.slice(0, 5).map((topic) => (
                          <span
                            key={topic}
                            className={`px-2 py-1 text-xs rounded-full ${themes[theme].primary} text-white`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ContributionGraph
                contributions={data.contributions}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GitHubStats;

