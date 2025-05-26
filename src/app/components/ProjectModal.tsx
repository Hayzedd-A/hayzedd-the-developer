"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import { Project } from "@/types/types.index";
// import {
//   XMarkIcon,
//   CalendarIcon,
//   ExternalLinkIcon,
//   CodeBracketIcon,
//   StarIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   PlayIcon,
//   PauseIcon
// } from "@heroicons/react/24/outline";
// import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  Github,
  GithubIcon,
  PauseIcon,
  PlayIcon,
  StarIcon,
  XIcon,
} from "lucide-react";
import ImageSlider from "./ImageSlider";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<{
    [key: number]: boolean;
  }>({});

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !project?.images) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, project?.images]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsAutoPlaying(false);
      setImageLoadError({});
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!project) return null;

  const images = project.images || [project.image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageLoadError((prev) => ({ ...prev, [index]: true }));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div
              className={`${currentTheme.background} rounded-2xl shadow-2xl h-full flex flex-col`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-6 border-b ${currentTheme.border}`}
              >
                <div className="flex items-center gap-3">
                  <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${currentTheme.primary} text-white`}
                    >
                      <StarIcon className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Image counter */}
                  <span
                    className={`text-sm ${currentTheme.textSecondary} px-3 py-1 rounded-lg ${currentTheme.hover}`}
                  >
                    {currentImageIndex + 1} / {images.length}
                  </span>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors duration-200`}
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6">
                  {/* Image Slider */}

                  <ImageSlider
                    autoPlayInterval={5000}
                    alt={project.title}
                    images={images}
                    showControls={true}
                  />

                  {/* Image Controls (Mobile) */}
                  {/* {images.length > 1 && (
                    <div
                      className={`p-4 rounded-lg ${currentTheme.hover} md:hidden`}
                    >
                      <h4
                        className={`font-semibold ${currentTheme.text} mb-3`}
                      >
                        Image Controls
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevImage}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover} transition-colors duration-200`}
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                          Previous
                        </button>
                        <button
                          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                          className={`px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover} transition-colors duration-200`}
                        >
                          {isAutoPlaying ? (
                            <PauseIcon className="w-4 h-4" />
                          ) : (
                            <PlayIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={handleNextImage}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover} transition-colors duration-200`}
                        >
                          Next
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )} */}

                  {/* Project Info */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                      <h3
                        className={`text-lg font-semibold ${currentTheme.text} mb-3`}
                      >
                        About This Project
                      </h3>
                      <p
                        className={`${currentTheme.textSecondary} leading-relaxed mb-6`}
                      >
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <h3
                        className={`text-lg font-semibold ${currentTheme.text} mb-3`}
                      >
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, index) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`px-3 py-1 text-sm rounded-lg ${currentTheme.primary} text-white`}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>

                      {/* Image Gallery Info */}
                      {/* {images.length > 1 && (
                        <div
                          className={`p-4 rounded-lg ${currentTheme.hover} mb-6`}
                        >
                          <h4
                            className={`font-semibold ${currentTheme.text} mb-2`}
                          >
                            Gallery Navigation
                          </h4>
                          <div
                            className={`text-sm ${currentTheme.textSecondary} space-y-1`}
                          >
                            <p>• Use arrow keys or click buttons to navigate</p>
                            <p>• Press spacebar to toggle auto-play</p>
                            <p>• Click thumbnails for quick navigation</p>
                          </div>
                        </div>
                      )} */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Project Details */}
                      <div className={`p-4 rounded-lg ${currentTheme.hover}`}>
                        <h4
                          className={`font-semibold ${currentTheme.text} mb-3`}
                        >
                          Project Details
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon
                              className={`w-4 h-4 ${currentTheme.textSecondary}`}
                            />
                            <span className={currentTheme.textSecondary}>
                              {new Date(project.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 text-center text-xs ${currentTheme.textSecondary}`}
                            >
                              📁
                            </span>
                            <span
                              className={`${currentTheme.textSecondary} capitalize`}
                            >
                              {project.category} Project
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 text-center text-xs ${currentTheme.textSecondary}`}
                            >
                              🖼️
                            </span>
                            <span className={currentTheme.textSecondary}>
                              {images.length} Image
                              {images.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {project.liveUrl && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg ${currentTheme.primary} text-white font-medium hover:opacity-90 transition-opacity duration-200`}
                            >
                              <ExternalLinkIcon className="w-5 h-5" />
                              View Live Demo
                            </Link>
                          </motion.div>
                        )}

                        {project.category === "personal" &&
                          project.githubUrl && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover} font-medium transition-colors duration-200`}
                              >
                                <GithubIcon className="w-5 h-5" />
                                View Source Code
                              </Link>
                            </motion.div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
