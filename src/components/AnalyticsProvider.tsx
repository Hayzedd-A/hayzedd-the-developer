"use client";

import React, { createContext, useContext, useState, useEffect, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Settings } from 'lucide-react';
import { analytics } from '@/lib/analytics-tracker';
import { githubService } from '@/app/services/github';
import { GitHubLanguageStats, GitHubRepo, GitHubUser } from '@/types/types.index';
interface GitHubStatsData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  languages: GitHubLanguageStats;
  topRepos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  contributions: any[];
}

interface AnalyticsContextType {
  isEnabled: boolean;
  hasConsented: boolean;
  enableAnalytics: () => void;
  disableAnalytics: () => void;
  showConsentBanner: boolean;
  hideConsentBanner: () => void;
  gitError: string | null;
  gitLoading: boolean;
  // setGitLoading: () => void;
  gitHubData: GitHubStatsData
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalyticsConsent = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsConsent must be used within AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gitError, setGitError] = useState<string| null>("");
  const [gitLoading, setGitLoading] = useState(true)
  const [gitHubData, setGithubData] = useState<GitHubStatsData>({
    user: null,
    repos: [],
    languages: {},
    topRepos: [],
    totalStars: 0,
    totalForks: 0,
    contributions: [],
  });

  useEffect(() => {
    // Check for existing consent
    const consent = localStorage.getItem("analytics-consent");
    const consentDate = localStorage.getItem("analytics-consent-date");

    if (consent === "true" && consentDate) {
      // Check if consent is still valid (e.g., within 1 year)
      const consentTime = new Date(consentDate).getTime();
      const oneYear = 365 * 24 * 60 * 60 * 1000;

      if (Date.now() - consentTime < oneYear) {
        setIsEnabled(true);
        setHasConsented(true);
        analytics.init();
      } else {
        // Consent expired, show banner again
        setShowConsentBanner(true);
      }
    } else if (consent === "false") {
      setHasConsented(true);
      setIsEnabled(false);
    } else {
      // No consent given, show banner
      setShowConsentBanner(true);
    }
  }, []);

    useEffect(() => {
      const fetchGitHubData = async () => {
        try {
          setGitLoading(true);
          setGitError(null);
  
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
  
          setGithubData({
            user,
            repos,
            languages,
            topRepos,
            totalStars,
            totalForks,
            contributions,
          });
        } catch (err) {
          setGitError("Failed to fetch GitHub data");
          console.error("GitHub data fetch error:", err);
        } finally {
          setGitLoading(false);
        }
      };
  
      fetchGitHubData();
    }, []);

  const enableAnalytics = () => {
    setIsEnabled(true);
    setHasConsented(true);
    setShowConsentBanner(false);
    localStorage.setItem("analytics-consent", "true");
    localStorage.setItem("analytics-consent-date", new Date().toISOString());
    analytics.init();
  };

  const disableAnalytics = () => {
    setIsEnabled(false);
    setHasConsented(true);
    setShowConsentBanner(false);
    localStorage.setItem("analytics-consent", "false");
    localStorage.setItem("analytics-consent-date", new Date().toISOString());
  };

  const hideConsentBanner = () => {
    setShowConsentBanner(false);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        isEnabled,
        hasConsented,
        enableAnalytics,
        disableAnalytics,
        showConsentBanner,
        hideConsentBanner,
        gitError,
        gitHubData,
        gitLoading,
        
      }}
    >
      {children}

      {/* Consent Banner */}
      <AnimatePresence>
        {showConsentBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Privacy & Analytics
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    I use privacy-friendly analytics to understand how visitors
                    interact with my site. This helps me improve the user
                    experience. No personal data is collected or shared with
                    third parties.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={enableAnalytics}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Accept Analytics
                    </button>
                    <button
                      onClick={disableAnalytics}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </button>
                  </div>
                </div>
                <button
                  onClick={hideConsentBanner}
                  className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analytics Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    What data do I collect?
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Page views and navigation patterns</li>
                    <li>• Device type and browser information</li>
                    <li>• General location (country/city)</li>
                    <li>• Time spent on pages</li>
                    <li>• Click interactions and form submissions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    What I don't collect:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Personal identifying information</li>
                    <li>• IP addresses (anonymized)</li>
                    <li>• Form content or personal messages</li>
                    <li>• Cross-site tracking</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        enableAnalytics();
                        setShowSettings(false);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        disableAnalytics();
                        setShowSettings(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Settings Toggle (always visible after consent) */}
      {hasConsented && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 right-4 p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 z-40"
          title="Analytics Settings"
        >
          <Shield className="w-5 h-5" />
        </motion.button>
      )}
    </AnalyticsContext.Provider>
  );
};

