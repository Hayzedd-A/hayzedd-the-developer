"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  ArrowUpDown,
  Calendar,
  Activity,
  RefreshCw,
  Download,
  TrendingUp,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import VisitorDetails from "./VisitorDetails";

interface VisitorListItem {
  id: string;
  visitorId: string;
  sessionId: string;
  location: {
    country: string;
    city: string;
  };
  device: {
    type: string;
    browser: string;
    os: string;
    isMobile: boolean;
  };
  firstVisit: string;
  lastActivity: string;
  pageViews: number;
  totalDuration: number;
  sessionDuration: number;
  isReturningVisitor: boolean;
  source: string;
  medium: string;
  bounced: boolean;
  totalInteractions?: number;
  lastInteraction?: string;
}

interface VisitorListResponse {
  success: boolean;
  data: {
    visitors: VisitorListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      sortBy: string;
      sortOrder: string;
      dateFrom?: string;
      dateTo?: string;
      country?: string;
      device?: string;
      isReturning?: string;
    };
  };
}

const VisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState("")

  // Filter and pagination state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    sortBy: "lastActivity",
    sortOrder: "desc",
    dateFrom: "",
    dateTo: "",
    country: "",
    device: "",
    isReturning: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/analytics/visitors?${queryParams}`);
      const data: VisitorListResponse = await response.json();

      if (data.success) {
        setVisitors(data.data.visitors);
        setPagination(data.data.pagination);
      } else {
        setError("Failed to fetch visitors");
      }
    } catch (err) {
      setError("An error occurred while fetching visitors");
      console.error("Error fetching visitors:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const handleVisitorDetails = (id: string) => {
    console.log(id)
    setSelectedVisitor(id);
    setModalOpen(true)
  }
  const handleSort = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getDeviceIcon = (device: VisitorListItem["device"]) => {
    if (device.isMobile) return <Smartphone className="w-4 h-4" />;
    if (device.type.toLowerCase().includes("tablet"))
      return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.location.country
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      visitor.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.device.browser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading visitors...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchVisitors}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Visitors",
      value: formatNumber(pagination.totalCount),
      icon: Users,
      color: "blue",
    },
    {
      title: "Returning Visitors",
      value: formatNumber(visitors.filter((v) => v.isReturningVisitor).length),
      icon: Activity,
      color: "green",
    },
    {
      title: "Mobile Visitors",
      value: formatNumber(visitors.filter((v) => v.device.isMobile).length),
      icon: Smartphone,
      color: "purple",
    },
    {
      title: "Bounced Sessions",
      value: formatNumber(visitors.filter((v) => v.bounced).length),
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Visitors
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track and analyze your website visitors
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                disabled={loading}
                
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              >
                <ArrowLeft
                  className={`w-4 h-4 `}
                />
                <Link href="/admin/analytics">Back to Dashboard</Link>
              </button>
              <button
                onClick={fetchVisitors}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>

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

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange("limit", e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by country"
                    value={filters.country}
                    onChange={(e) =>
                      handleFilterChange("country", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device Type
                  </label>
                  <select
                    value={filters.device}
                    onChange={(e) =>
                      handleFilterChange("device", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">All Devices</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visitor Type
                  </label>
                  <select
                    value={filters.isReturning}
                    onChange={(e) =>
                      handleFilterChange("isReturning", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">All Visitors</option>
                    <option value="true">Returning</option>
                    <option value="false">New</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Visitors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-3 text-lg">Loading visitors...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 text-lg mb-2">
                  Error loading visitors
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {error}
                </p>
                <button
                  onClick={fetchVisitors}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("visitorId")}
                          className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span>Visitor</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("location.country")}
                          className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span>Location</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Device
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("pageViews")}
                          className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span>Page Views</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("totalDuration")}
                          className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span>Duration</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("lastActivity")}
                          className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span>Last Activity</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Status
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredVisitors.map((visitor, index) => (
                      <motion.tr
                        key={visitor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                visitor.isReturningVisitor
                                  ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                  : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {visitor.visitorId.substring(0, 8)}...
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {visitor.source}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {visitor.location.country}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {visitor.location.city}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(visitor.device)}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {visitor.device.type}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {visitor.device.browser}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {visitor.pageViews}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDuration(visitor.sessionDuration)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {formatDate(visitor.lastActivity)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {visitor.isReturningVisitor ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                Returning
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                                New
                              </span>
                            )}
                            {visitor.bounced && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                                Bounced
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={()=>handleVisitorDetails(visitor.visitorId)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {(pagination.currentPage - 1) * filters.limit + 1}{" "}
                      to{" "}
                      {Math.min(
                        pagination.currentPage * filters.limit,
                        pagination.totalCount
                      )}{" "}
                      of {pagination.totalCount} visitors
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrev}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pagination.hasPrev
                            ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                            : "opacity-50 cursor-not-allowed text-gray-400"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  pagination.currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNext}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pagination.hasNext
                            ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                            : "opacity-50 cursor-not-allowed text-gray-400"
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Empty State */}
        {!loading && !error && filteredVisitors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No visitors found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchTerm || Object.values(filters).some((v) => v)
                ? "Try adjusting your search or filters"
                : "No visitors have been recorded yet"}
            </p>
          </motion.div>
        )}

        {/* Additional Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Top Countries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {Array.from(
                visitors.reduce((acc, visitor) => {
                  const country = visitor.location.country;
                  acc.set(country, (acc.get(country) || 0) + 1);
                  return acc;
                }, new Map<string, number>())
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([country, count]) => {
                  const percentage = ((count / visitors.length) * 100).toFixed(
                    1
                  );
                  return (
                    <div
                      key={country}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {country || "Unknown"}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(count)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Device Types
            </h3>
            <div className="space-y-3">
              {Array.from(
                visitors.reduce((acc, visitor) => {
                  const deviceType = visitor.device.type;
                  acc.set(deviceType, (acc.get(deviceType) || 0) + 1);
                  return acc;
                }, new Map<string, number>())
              )
                .sort(([, a], [, b]) => b - a)
                .map(([deviceType, count]) => {
                  const percentage = ((count / visitors.length) * 100).toFixed(
                    1
                  );
                  const IconComponent =
                    deviceType === "mobile"
                      ? Smartphone
                      : deviceType === "tablet"
                      ? Tablet
                      : Monitor;
                  return (
                    <div
                      key={deviceType}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <IconComponent className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {deviceType}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(count)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Visitor Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Visitor Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Page Views
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {visitors.length > 0
                    ? (
                        visitors.reduce((sum, v) => sum + v.pageViews, 0) /
                        visitors.length
                      ).toFixed(1)
                    : "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Session Duration
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {visitors.length > 0
                    ? formatDuration(
                        Math.round(
                          visitors.reduce(
                            (sum, v) => sum + v.sessionDuration,
                            0
                          ) / visitors.length
                        )
                      )
                    : "0m"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Bounce Rate
                </span>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {visitors.length > 0
                    ? (
                        (visitors.filter((v) => v.bounced).length /
                          visitors.length) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Return Rate
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {visitors.length > 0
                    ? (
                        (visitors.filter((v) => v.isReturningVisitor).length /
                          visitors.length) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        {modalOpen && 
        <VisitorDetails onClose={() => {setModalOpen(false)}} visitorId={selectedVisitor} />
        }
      </div>
    </div>
  );
};

export default VisitorsPage;

