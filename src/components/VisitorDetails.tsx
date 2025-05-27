"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Clock,
  Monitor,
  Smartphone,
  Eye,
  MousePointer,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Activity,
  BarChart3,
  ArrowLeft,
  User,
  Tablet,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface VisitorData {
  visitorId: string;
  stats: {
    totalSessions: number;
    totalPageViews: number;
    totalEvents: number;
    totalFormSubmissions: number;
    totalErrors: number;
    totalDuration: number;
    averageSessionDuration: number;
    bounceRate: number;
    firstVisit: string;
    lastVisit: string;
    isReturningVisitor: boolean;
    countries: string[];
    devices: string[];
    browsers: string[];
    operatingSystems: string[];
    sources: string[];
    campaigns: string[];
  };
  sessions: any[];
  pageViews: any[];
  events: any[];
  formSubmissions: any[];
  errors: any[];
  performanceMetrics: any[];
  analytics: {
    pageStats: any[];
    eventStats: any[];
    performanceStats: any[];
  };
}

interface VisitorDetailsProps {
  visitorId: string;
  onClose: () => void;
}

const VisitorDetails: React.FC<VisitorDetailsProps> = ({
  visitorId,
  onClose,
}) => {
  // const visitorId = params.visitorId as string;

  const [data, setData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchVisitorData();
  }, [visitorId, dateRange]);

  const fetchVisitorData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append("startDate", dateRange.startDate);
      if (dateRange.endDate) params.append("endDate", dateRange.endDate);

      const response = await fetch(
        `/api/analytics/visitors/${visitorId}?${params}`
      );
      if (!response.ok) throw new Error("Failed to fetch visitor data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden"
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden"
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Error Loading Visitor Data
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error || "Visitor not found"}
                </p>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Analytics
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "sessions", label: "Sessions", icon: Activity },
    { id: "pageviews", label: "Page Views", icon: Eye },
    { id: "events", label: "Events", icon: MousePointer },
    { id: "forms", label: "Forms", icon: FileText },
    { id: "errors", label: "Errors", icon: AlertTriangle },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ top: "0", left: "0" }}
        className="min-h-screen min-w-screen fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-auto"
      >
        <div className=" bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Visitor Details
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />

                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors duration-200 hover:bg-green-50 dark:hover:bg-green-900/20`}
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Visitor ID */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Visitor ID:
                  </span>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                    {visitorId}
                  </code>
                  {data.stats.isReturningVisitor && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                      Returning Visitor
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.stats.totalSessions}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Page Views
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.stats.totalPageViews}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg. Session Duration
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatDuration(data.stats.averageSessionDuration)}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bounce Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.stats.bounceRate.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Visitor Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Visit Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        First Visit
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(data.stats.firstVisit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Visit
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(data.stats.lastVisit)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technology
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Devices
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.stats.devices.map((device, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {getDeviceIcon(device)}
                          <span>{device}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Browsers
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.stats.browsers.map((browser, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                        >
                          {browser}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Operating Systems
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.stats.operatingSystems.map((os, index) => (
                        <span
                          key={index}
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs"
                        >
                          {os}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location & Traffic
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Countries
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.stats.countries.map((country, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{country}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.stats.sources.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Traffic Sources
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {data.stats.sources.map((source, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.stats.campaigns.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Campaigns
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {data.stats.campaigns.map((campaign, index) => (
                          <span
                            key={index}
                            className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded text-xs"
                          >
                            {campaign}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Page Statistics */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Page Statistics
                        </h4>
                        <div className="space-y-3">
                          {data.analytics.pageStats
                            .slice(0, 5)
                            .map((page, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {page.page}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {page.views} views •{" "}
                                    {formatDuration(page.averageDuration)} avg
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {page.maxScrollDepth}% scroll
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {page.bounceRate.toFixed(1)}% bounce
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Event Statistics */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Event Statistics
                        </h4>
                        <div className="space-y-3">
                          {data.analytics.eventStats
                            .slice(0, 5)
                            .map((event, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {event.category} - {event.action}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {event.count} events
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {event.totalValue || 0}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Performance Overview */}
                    {data.analytics.performanceStats.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Performance Overview
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {data.analytics.performanceStats
                            .slice(0, 6)
                            .map((metric, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {metric.metricName}
                                </p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {metric.averageValue.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {metric.count} measurements
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sessions Tab */}
                {activeTab === "sessions" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Session History ({data.sessions.length} sessions)
                    </h4>
                    <div className="space-y-4">
                      {data.sessions.map((session, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getDeviceIcon(session.device.type)}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {session.device.browser} on{" "}
                                  {session.device.os}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(session.firstVisit)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {formatDuration(session.totalDuration)}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {session.pageViews} pages
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Location
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.location?.city},{" "}
                                {session.location?.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Screen
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.screen.width}x{session.screen.height}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Language
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.language}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Source
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.source || "Direct"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Views Tab */}
                {activeTab === "pageviews" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Page View History ({data.pageViews.length} views)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Page
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Scroll Depth
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {data.pageViews.map((view, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {view.page}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {view.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {view.duration
                                  ? formatDuration(view.duration)
                                  : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {view.scrollDepth
                                  ? `${view.scrollDepth}%`
                                  : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(view.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Events Tab */}
                {activeTab === "events" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Event History ({data.events.length} events)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Action
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Label
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Page
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {data.events.map((event, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                  {event.eventType}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {event.eventCategory}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {event.eventAction}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {event.eventLabel || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {event.eventValue || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {event.page}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(event.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Forms Tab */}
                {activeTab === "forms" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Form Submissions ({data.formSubmissions.length}{" "}
                      submissions)
                    </h4>
                    {data.formSubmissions.length > 0 ? (
                      <div className="space-y-4">
                        {data.formSubmissions.map((submission, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {submission.formName}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {submission.page}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    submission.success
                                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  }`}
                                >
                                  {submission.success ? "Success" : "Failed"}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(submission.timestamp)}
                                </span>
                              </div>
                            </div>
                            {submission.fields &&
                              submission.fields.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Fields:
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {submission.fields.map(
                                      (field: string, fieldIndex: string) => (
                                        <span
                                          key={fieldIndex}
                                          className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs"
                                        >
                                          {field}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            {submission.errors &&
                              submission.errors.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm text-red-600 dark:text-red-400">
                                    Errors:
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {submission.errors.map(
                                      (error: string, errorIndex: number) => (
                                        <span
                                          key={errorIndex}
                                          className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs"
                                        >
                                          {error}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            {submission.completionTime && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Completion time:{" "}
                                {formatDuration(submission.completionTime)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No form submissions found
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Errors Tab */}
                {activeTab === "errors" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Error Events ({data.errors.length} errors)
                    </h4>
                    {data.errors.length > 0 ? (
                      <div className="space-y-4">
                        {data.errors.map((error, index) => (
                          <div
                            key={index}
                            className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      error.severity === "critical"
                                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                        : error.severity === "high"
                                        ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                                        : error.severity === "medium"
                                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    }`}
                                  >
                                    {error.severity}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {error.errorType}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                                  {error.errorMessage}
                                </p>
                                {error.page && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Page: {error.page}
                                  </p>
                                )}
                                {error.userAction && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    User Action: {error.userAction}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(error.timestamp)}
                              </span>
                            </div>
                            {error.errorStack && (
                              <details className="mt-3">
                                <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                                  Stack Trace
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto text-gray-800 dark:text-gray-200">
                                  {error.errorStack}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No errors found
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Performance Metrics ({data.performanceMetrics.length}{" "}
                      measurements)
                    </h4>

                    {data.analytics.performanceStats.length > 0 ? (
                      <div className="space-y-6">
                        {/* Performance Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data.analytics.performanceStats.map(
                            (metric, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {metric.metricName}
                                  </h5>
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      metric.metricType === "web-vitals"
                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                        : metric.metricType === "navigation"
                                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                        : metric.metricType === "resource"
                                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    }`}
                                  >
                                    {metric.metricType}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Average:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {metric.averageValue.toFixed(2)}ms
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Min:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {metric.minValue.toFixed(2)}ms
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Max:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {metric.maxValue.toFixed(2)}ms
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Count:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {metric.count}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        {/* Performance Timeline */}
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Performance Timeline
                          </h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Metric
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Value
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Page
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Timestamp
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                {data.performanceMetrics.map(
                                  (metric, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {metric.metricName}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            metric.metricType === "web-vitals"
                                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                              : metric.metricType ===
                                                "navigation"
                                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                              : metric.metricType === "resource"
                                              ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                          }`}
                                        >
                                          {metric.metricType}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {metric.value.toFixed(2)}ms
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {metric.page}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(metric.timestamp)}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No performance metrics found
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default VisitorDetails;
