"use client";

import React, { useState, useEffect } from "react";
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
  Globe,
  Zap,
  Target,
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
  sessions: Array<{
    _id: string;
    sessionId: string;
    visitorId: string;
    deviceFingerprint: string;
    ipAddress: string;
    userAgent: string;
    location: {
      country: string;
      region: string;
      city: string;
      timezone: string;
      org: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    device: {
      type: string;
      browser: string;
      browserVersion: string;
      os: string;
      osVersion: string;
      isMobile: boolean;
      isTablet: boolean;
      isDesktop: boolean;
    };
    screen: {
      width: number;
      height: number;
      colorDepth: number;
    };
    language: string;
    timezone: string;
    pageViews: number;
    totalDuration: number;
    isReturningVisitor: boolean;
    source: string | null;
    medium: string | null;
    campaign: string | null;
    bounced: boolean;
    firstVisit: string;
    lastActivity: string;
  }>;
  pageViews: Array<{
    _id: string;
    sessionId: string;
    visitorId: string;
    page: string;
    title: string;
    referrer: string;
    duration?: number;
    scrollDepth?: number;
    timestamp: string;
  }>;
  events: Array<{
    _id: string;
    sessionId: string;
    visitorId: string;
    eventType: string;
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
    eventValue?: number;
    page: string;
    metadata?: any;
    timestamp: string;
  }>;
  formSubmissions: any[];
  errors: any[];
  performanceMetrics: any[];
  analytics: {
    pageStats: Array<{
      page: string;
      views: number;
      totalDuration: number;
      averageDuration: number;
      maxScrollDepth: number;
      bounces: number;
      bounceRate: number;
    }>;
    eventStats: Array<{
      category: string;
      action: string;
      count: number;
      labels: string[];
      totalValue: number;
    }>;
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

  const formatShortDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString();
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

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "interaction":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "engagement":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "navigation":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        />
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        />
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
                <button
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Analytics
                </button>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-auto"
      >
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
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
                    className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Visitor ID */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last seen: {formatDate(data.stats.lastVisit)}
                  </div>
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
                      Total Events
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.stats.totalEvents}
                    </p>
                  </div>
                  <MousePointer className="w-8 h-8 text-purple-500" />
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
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Visitor Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Visit Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        First Visit
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatShortDate(data.stats.firstVisit)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(data.stats.firstVisit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Visit
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatShortDate(data.stats.lastVisit)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(data.stats.lastVisit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Time Spent
                      </p>
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        {formatDuration(data.stats.totalDuration)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Technology
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Devices
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.stats.devices.map((device, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {getDeviceIcon(device)}
                          <span className="capitalize">{device}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Browsers
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.stats.browsers.map((browser, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                        >
                          {browser}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Operating Systems
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.stats.operatingSystems.map((os, index) => (
                        <span
                          key={index}
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                        >
                          {os}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Location & Traffic
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Countries
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.stats.countries.map((country, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{country}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.stats.sources.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Traffic Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.stats.sources.map((source, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Direct Traffic
                      </p>
                      <p className="text-xs text-gray-500">
                        No referrer information
                      </p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bounce Rate
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {data.stats.bounceRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          Page Statistics
                        </h4>
                        <div className="space-y-3">
                          {data.analytics.pageStats.map((page, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {page.page}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {page.views} views
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDuration(page.averageDuration)} avg
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {page.bounceRate.toFixed(1)}% bounce
                                </p>
                                <p className="text-xs text-gray-500">
                                  {page.maxScrollDepth}% scroll
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Event Statistics */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          Event Statistics
                        </h4>
                        <div className="space-y-3">
                          {data.analytics.eventStats.map((event, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {event.category} - {event.action}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {event.count} events
                                  </span>
                                  {event.labels.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {event.labels.slice(0, 3).map((label, labelIndex) => (
                                        <span
                                          key={labelIndex}
                                          className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                                        >
                                          {label}
                                        </span>
                                      ))}
                                      {event.labels.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                          +{event.labels.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
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
                  </div>
                )}

                {/* Sessions Tab */}
                {activeTab === "sessions" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Session History ({data.sessions.length} sessions)
                    </h4>
                    <div className="space-y-4">
                      {data.sessions.map((session, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {getDeviceIcon(session.device.type)}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {session.device.browser} {session.device.browserVersion} on{" "}
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Location
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.location?.city}, {session.location?.country}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.location?.org}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Screen Resolution
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.screen.width}x{session.screen.height}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.screen.colorDepth}-bit color
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Language & Timezone
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.language}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.timezone}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Session Info
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.source || "Direct"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.bounced ? "Bounced" : "Engaged"}
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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
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
                              Referrer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {data.pageViews.map((view, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {view.page}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                {view.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {view.duration ? formatDuration(view.duration) : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {view.referrer || "Direct"}
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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <MousePointer className="w-5 h-5 mr-2" />
                      Event History ({data.events.length} events)
                    </h4>
                    <div className="space-y-3">
                      {data.events.map((event, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.eventType)}`}>
                                {event.eventType}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {event.eventCategory} - {event.eventAction}
                                </p>
                                {event.eventLabel && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {event.eventLabel}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatTime(event.timestamp)}
                              </p>
                              {event.eventValue && (
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Value: {event.eventValue}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Page: {event.page}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(event.timestamp)}
                            </span>
                          </div>
                          {event.metadata && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                Event Metadata
                              </summary>
                              <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Forms Tab */}
                {activeTab === "forms" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Form Submissions ({data.formSubmissions.length} submissions)
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
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          No form submissions found
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          This visitor hasn't submitted any forms yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Errors Tab */}
                {activeTab === "errors" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
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
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(error.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          No errors found
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          This visitor hasn't encountered any errors. Great!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Performance Metrics ({data.performanceMetrics.length} measurements)
                    </h4>

                    {data.performanceMetrics.length > 0 ? (
                      <div className="space-y-6">
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
                              {data.performanceMetrics.map((metric, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {metric.metricName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
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
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          No performance metrics found
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Performance tracking data is not available for this visitor.
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