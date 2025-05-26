"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface AnalyticsStats {
  overview: {
    totalVisitors: number;
    totalSessions: number;
    totalPageViews: number;
    uniqueVisitors: number;
    returningVisitors: number;
    newVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  topPages: Array<{
    page: string;
    views: number;
    uniqueVisitors: number;
  }>;
  deviceTypes: Array<{
    _id: string;
    count: number;
  }>;
  browsers: Array<{
    _id: string;
    count: number;
  }>;
  countries: Array<{
    _id: string;
    count: number;
  }>;
  dailyVisitors: Array<{
    date: string;
    visitors: number;
    uniqueVisitors: number;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/stats?period=${period}`);

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600 / 1000);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m `;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Visitors",
      value: formatNumber(stats.overview.totalVisitors),
      icon: Users,
      color: "blue",
    },
    {
      title: "Page Views",
      value: formatNumber(stats.overview.totalPageViews),
      icon: Eye,
      color: "green",
    },
    {
      title: "Avg. Session Duration",
      value: formatDuration(stats.overview.avgSessionDuration),
      icon: Clock,
      color: "purple",
    },
    {
      title: "Bounce Rate",
      value: `${stats.overview.bounceRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Analytics Dashboard
          </h1>

          {/* Period Selector */}
          <div className="flex space-x-2">
            {["1d", "7d", "30d", "90d"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {p === "1d"
                  ? "Today"
                  : p === "7d"
                  ? "7 Days"
                  : p === "30d"
                  ? "30 Days"
                  : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {card.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/20`}
                    >
                      <IconComponent
                        className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`}
                      />
                    </div>
                  </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Pages
            </h3>
            <div className="space-y-3">
              {stats.topPages.slice(0, 5).map((page, index) => (
                <div
                  key={page.page}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {page.page}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatNumber(page.uniqueVisitors)} unique visitors
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatNumber(page.views)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Device Types */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Device Types
            </h3>
            <div className="space-y-3">
              {stats.deviceTypes.map((device, index) => {
                const total = stats.deviceTypes.reduce(
                  (sum, d) => sum + d.count,
                  0
                );
                const percentage = ((device.count / total) * 100).toFixed(1);
                const IconComponent =
                  device._id === "mobile" ? Smartphone : Monitor;

                return (
                  <div
                    key={device._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {device._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(device.count)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Browsers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Browsers
            </h3>
            <div className="space-y-3">
              {stats.browsers.slice(0, 5).map((browser, index) => {
                const total = stats.browsers.reduce(
                  (sum, b) => sum + b.count,
                  0
                );
                const percentage = ((browser.count / total) * 100).toFixed(1);

                return (
                  <div
                    key={browser._id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {browser._id}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(browser.count)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {stats.countries.slice(0, 5).map((country, index) => {
                const total = stats.countries.reduce(
                  (sum, c) => sum + c.count,
                  0
                );
                const percentage = ((country.count / total) * 100).toFixed(1);

                return (
                  <div
                    key={country._id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {country._id || "Unknown"}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(country.count)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Daily Visitors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Daily Visitors
          </h3>
          <div className="h-64 flex items-end space-x-2">
            {stats.dailyVisitors.map((day, index) => {
              const maxVisitors = Math.max(
                ...stats.dailyVisitors.map((d) => d.visitors)
              );
              const height = (day.visitors / maxVisitors) * 100;

              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                    title={`${day.date}: ${day.visitors} visitors`}
                  />
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">
                    {day.visitors}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              New vs Returning
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-900 dark:text-white">
                  New Visitors
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {formatNumber(stats.overview.newVisitors)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-900 dark:text-white">
                  Returning
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatNumber(stats.overview.returningVisitors)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Sessions
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-900 dark:text-white">
                  Total Sessions
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.overview.totalSessions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-900 dark:text-white">
                  Pages/Session
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(
                    stats.overview.totalPageViews / stats.overview.totalSessions
                  ).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Engagement
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-900 dark:text-white">
                  Bounce Rate
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {stats.overview.bounceRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-900 dark:text-white">
                  Avg. Duration
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {formatDuration(stats.overview.avgSessionDuration)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
