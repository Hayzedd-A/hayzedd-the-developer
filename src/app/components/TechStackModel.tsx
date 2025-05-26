"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/app/context/ThemeContext";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Tech stack data with icons (using CSS for icons, you can replace with actual icon libraries)
const techStack = [
  {
    name: "React",
    icon: "⚛️",
    color: "#61DAFB",
    description: "Frontend Library",
  },
  {
    name: "Next.js",
    icon: "▲",
    color: "#000000",
    description: "React Framework",
  },
  {
    name: "Express.js",
    icon: "🚀",
    color: "#000000",
    description: "Backend Framework",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    color: "#47A248",
    description: "NoSQL Database",
  },
  {
    name: "MySQL",
    icon: "🐬",
    color: "#4479A1",
    description: "SQL Database",
  },
  {
    name: "Tailwind",
    icon: "🎨",
    color: "#06B6D4",
    description: "CSS Framework",
  },
];

const TechStackModel: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFace, setCurrentFace] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
    const { currentThemes, theme } = useTheme();
    const currentTheme = currentThemes[theme]

  useEffect(() => {
    const cube = cubeRef.current;
    const container = containerRef.current;

    if (!cube || !container) return;

    // Initial setup
    gsap.set(cube, {
      transformStyle: "preserve-3d",
      rotationX: -15,
      rotationY: 15,
    });

    // Auto rotation when not hovered
    const autoRotation = gsap.to(cube, {
      rotationY: "+=360",
      duration: 20,
      repeat: -1,
      ease: "none",
      paused: true,
    });

    // Start auto rotation
    if (!isHovered) {
      autoRotation.play();
    }

    // Scroll-triggered rotation
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (!isHovered) {
          gsap.set(cube, {
            rotationY: self.progress * 360,
            rotationX: -15 + self.progress * 30,
          });
        }
      },
    });

    // Hover effects
    const handleMouseEnter = () => {
      setIsHovered(true);
      autoRotation.pause();
      gsap.to(cube, {
        scale: 1.1,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      autoRotation.play();
      gsap.to(cube, {
        scale: 1,
        rotationX: -15,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    // Click to rotate to next face
    const handleClick = () => {
      const nextFace = (currentFace + 1) % 6;
      setCurrentFace(nextFace);

      gsap.to(cube, {
        rotationY: nextFace * 60,
        rotationX: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      scrollTrigger.kill();
      autoRotation.kill();
    };
  }, [currentFace, isHovered]);

  return (
    <div className="flex flex-col items-center max-w-2xs justify-center p-8">
      {/* <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold mb-4 ${currentTheme.text}`}>
          My Tech Stack
        </h2>
        <p className={`text-lg ${currentTheme.textSecondary} mb-2`}>
          Interactive 3D showcase of technologies I work with
        </p>
        <p className={`text-sm ${currentTheme.textSecondary}`}>
          Scroll, hover, or click to explore
        </p>
      </div> */}

      <div
        ref={containerRef}
        className="relative cursor-pointer scale-75"
        style={{ perspective: "2000px" }}
      >
        <div
          ref={cubeRef}
          className="relative w-28 h-32"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cube faces */}
          {techStack.map((tech, index) => {
            const rotations = [
              "rotateY(0deg)", // front
              "rotateY(60deg)", // right
              "rotateY(120deg)", // back-right
              "rotateY(180deg)", // back
              "rotateY(240deg)", // back-left
              "rotateY(300deg)", // left
            ];

            return (
              <div
                key={tech.name}
                className={`absolute inset-0 w-38 h-38 ${currentTheme.background} border-2 ${currentTheme.border} rounded-lg shadow-xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl`}
                style={{
                  transform: `${rotations[index]} translateZ(132px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  className="text-5xl mb-4 transition-transform duration-300 hover:scale-110"
                  style={{ color: tech.color }}
                >
                  {tech.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>
                  {tech.name}
                </h3>
                <p
                  className={`text-sm ${currentTheme.textSecondary} text-center px-4`}
                >
                  {tech.description}
                </p>
                <div
                  className={`mt-4 w-16 h-1 rounded-full ${currentTheme.primary} opacity-60`}
                />
              </div>
            );
          })}
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${currentTheme.primary} rounded-full opacity-30 animate-pulse`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Tech stack indicators */}
      <div className="flex space-x-2 mt-8">
        {techStack.map((tech, index) => (
          <button
            key={tech.name}
            onClick={() => {
              setCurrentFace(index);
              gsap.to(cubeRef.current, {
                rotationY: index * 60,
                rotationX: 0,
                duration: 1,
                ease: "power2.inOut",
              });
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentFace === index
                ? currentTheme.primary
                : `${currentTheme.border} border-2`
            } hover:scale-125`}
            title={tech.name}
          />
        ))}
      </div>

      {/* Current tech info */}
      <div
        className={`mt-6 text-center p-4 rounded-lg ${currentTheme.background} ${currentTheme.border} border`}
      >
        <h4 className={`text-xl font-semibold ${currentTheme.text}`}>
          {techStack[currentFace].name}
        </h4>
        <p className={`${currentTheme.textSecondary} mt-1`}>
          {techStack[currentFace].description}
        </p>
      </div>
    </div>
  );
};

export default TechStackModel;
