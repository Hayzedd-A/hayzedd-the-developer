"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
// import { 
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   PlayIcon,
//   PauseIcon
// } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  alt: string;
  className?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  autoPlayInterval?: number;
  height?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  alt,
  className = "",
  showThumbnails = true,
  showControls = true,
  autoPlayInterval = 3000,
  height = "h-64 md:h-96",
}) => {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme]
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<{
    [key: number]: boolean;
  }>({});

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, autoPlayInterval]);

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

  if (images.length === 0) {
    return (
      <div
        className={`${height} ${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl`}
      >
        <span className={`text-sm ${currentTheme.textSecondary}`}>
          No images available
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Image Display */}
      <div
        className={`relative ${height} rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            {!imageLoadError[currentImageIndex] ? (
              <Image
                src={images[currentImageIndex]}
                alt={`${alt} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(currentImageIndex)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                <span className={`text-sm ${currentTheme.textSecondary}`}>
                  Image not available
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>

            {/* Auto-play Control */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
            >
              {isAutoPlaying ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-sm rounded-lg backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? `border-current ${currentTheme.accent}`
                    : `border-transparent hover:border-gray-300 dark:hover:border-gray-600`
                }`}
              >
                {!imageLoadError[index] ? (
                  <Image
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                    <span className="text-xs text-gray-400">N/A</span>
                  </div>
                )}
                {index === currentImageIndex && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;

