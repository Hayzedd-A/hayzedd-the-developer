"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
} from "lucide-react";

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
  const currentTheme = currentThemes[theme];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<{
    [key: number]: boolean;
  }>({});

  // Image preview modal states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  // Close preview on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    if (isPreviewOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isPreviewOpen]);

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

  // Preview modal functions
  const openPreview = () => {
    setIsPreviewOpen(true);
    setPreviewScale(1);
    setPreviewPosition({ x: 0, y: 0 });
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewScale(1);
    setPreviewPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setPreviewScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setPreviewScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setPreviewScale(1);
    setPreviewPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewScale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - previewPosition.x,
        y: e.clientY - previewPosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && previewScale > 1) {
      setPreviewPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
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
    <>
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
              className="relative w-full h-full cursor-pointer"
              onClick={openPreview}
            >
              {!imageLoadError[currentImageIndex] ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={`${alt} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(currentImageIndex)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                  <span className={`text-sm ${currentTheme.textSecondary}`}>
                    Image not available
                  </span>
                </div>
              )}

              {/* Click to preview overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg text-sm font-medium">
                  Click to preview
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {showControls && images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 backdrop-blur-sm z-10"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 backdrop-blur-sm z-10"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>

              {/* Auto-play Control */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 backdrop-blur-sm z-10"
              >
                {isAutoPlaying ? (
                  <PauseIcon className="w-4 h-4" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
              </button>

              {/* Progress Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-sm rounded-lg backdrop-blur-sm z-10">
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

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closePreview}
          >
            {/* Modal Content */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm z-20"
              >
                <XIcon className="w-6 h-6" />
              </button>

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
                  disabled={previewScale >= 3}
                >
                  <ZoomInIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
                  disabled={previewScale <= 0.5}
                >
                  <ZoomOutIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  <RotateCcwIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation in Preview */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm z-20"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm z-20"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
              {/* Image Counter in Preview */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-white/10 text-white text-sm rounded-lg backdrop-blur-sm z-20">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Zoom Level Indicator */}
              <div className="absolute bottom-4 right-4 px-3 py-2 bg-white/10 text-white text-sm rounded-lg backdrop-blur-sm z-20">
                {Math.round(previewScale * 100)}%
              </div>

              {/* Preview Image */}
              <motion.div
                className="relative cursor-grab active:cursor-grabbing flex items-center justify-center"
                style={{
                  transform: `scale(${previewScale}) translate(${
                    previewPosition.x / previewScale
                  }px, ${previewPosition.y / previewScale}px)`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                animate={{
                  scale: previewScale,
                  x: previewPosition.x,
                  y: previewPosition.y,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {!imageLoadError[currentImageIndex] ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${alt} - Preview ${currentImageIndex + 1}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-auto max-w-[95vw] max-h-[95vh] object-contain select-none"
                    priority
                    onError={() => handleImageError(currentImageIndex)}
                    style={{
                      width: "auto",
                      height: "auto",
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-96 h-64 bg-gray-700 rounded-lg">
                    <span className="text-white text-lg">
                      Image not available
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Instructions */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg">
                <div className="flex flex-col gap-1">
                  <span>Scroll to zoom • Drag to pan • ESC to close</span>
                  {images.length > 1 && <span>← → to navigate</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageSlider;

