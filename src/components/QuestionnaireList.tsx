"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  ExternalLink, 
  ChevronRight, 
  X,
  RefreshCw,
  Clock
} from "lucide-react";

interface QuestionnaireItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectDescription: string;
  serviceType: string[];
  stage: string;
  budget: string;
  timeline: string;
  createdAt: string;
  [key: string]: any;
}

const QuestionnaireList: React.FC = () => {
  const [submissions, setSubmissions] = useState<QuestionnaireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<QuestionnaireItem | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/questionary");
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      } else {
        setError("Failed to fetch submissions");
      }
    } catch (err) {
      setError("An error occurred while fetching submissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(
    (s) =>
      (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (s.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (s.projectDescription?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="text-green-500" />
            Questionnaire Submissions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all project inquiries from the landing page.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all w-64 text-gray-900 dark:text-white"
            />
          </div>
          <button 
            onClick={fetchSubmissions}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSubmissions.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-green-500 transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                {item.email}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-1">
                  {item.serviceType?.slice(0, 2).map((type, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-medium uppercase tracking-wider">
                      {type}
                    </span>
                  ))}
                  {item.serviceType?.length > 2 && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-medium">
                      +{item.serviceType.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 italic">
                "{item.projectDescription}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-sm font-medium text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                View Details
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredSubmissions.length === 0 && !loading && (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No submissions found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or check back later.</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedItem.name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(selectedItem.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Contact Info */}
                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <a href={`mailto:${selectedItem.email}`} className="text-sm font-medium text-gray-900 dark:text-white hover:underline">{selectedItem.email}</a>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Phone / WhatsApp</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedItem.phone}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Project Details */}
                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Project Overview</h4>
                  <div className="space-y-4">
                    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-500 mb-2">Description</p>
                      <p className="text-gray-900 dark:text-white leading-relaxed">{selectedItem.projectDescription}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Services Needed</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.serviceType?.map((t: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Current Stage</p>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          {selectedItem.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Tech & Options */}
                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Tech & Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.platforms?.map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.technologies?.map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 mb-2">Key Features</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.keyFeatures?.map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Budget & Timeline */}
                <section className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expected Users</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white uppercase">{selectedItem.expectedUsers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Budget</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-500">{selectedItem.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Timeline</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-500">{selectedItem.timeline}</p>
                    </div>
                  </div>
                </section>
                
                {/* Additional info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Needs Help With</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.helpWith?.map((t: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium tracking-wide border border-gray-200 dark:border-gray-700 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ongoing Support</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.ongoingSupport}</p>
                  </div>
                </section>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionnaireList;
