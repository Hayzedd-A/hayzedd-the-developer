"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import {
  Grid3X3,
  List,
  Search,
  RotateCcw,
  Star,
  ExternalLink,
  Code,
  Palette,
  Database,
  Smartphone,
  Settings,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "design" | "mobile";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  icon: string;
  color: string;
  description: string;
  experience: string;
  projects?: number;
}

const skills: Skill[] = [
  {
    id: "1",
    name: "React",
    category: "frontend",
    level: "expert",
    icon: "⚛️",
    color: "#61DAFB",
    description: "Building modern, interactive user interfaces",
    experience: "3+ years",
    projects: 25,
  },
  {
    id: "2",
    name: "Next.js",
    category: "frontend",
    level: "advanced",
    icon: "▲",
    color: "#000000",
    description: "Full-stack React framework for production",
    experience: "2+ years",
    projects: 15,
  },
  {
    id: "3",
    name: "TypeScript",
    category: "frontend",
    level: "advanced",
    icon: "📘",
    color: "#3178C6",
    description: "Type-safe JavaScript development",
    experience: "2+ years",
    projects: 20,
  },
  {
    id: "4",
    name: "Node.js",
    category: "backend",
    level: "advanced",
    icon: "🟢",
    color: "#339933",
    description: "Server-side JavaScript runtime",
    experience: "2+ years",
    projects: 18,
  },
  {
    id: "5",
    name: "MongoDB",
    category: "database",
    level: "intermediate",
    icon: "🍃",
    color: "#47A248",
    description: "NoSQL database for modern applications",
    experience: "1+ years",
    projects: 12,
  },
  {
    id: "6",
    name: "PostgreSQL",
    category: "database",
    level: "intermediate",
    icon: "🐘",
    color: "#336791",
    description: "Advanced relational database",
    experience: "1+ years",
    projects: 8,
  },
  {
    id: "7",
    name: "Figma",
    category: "design",
    level: "advanced",
    icon: "🎨",
    color: "#F24E1E",
    description: "UI/UX design and prototyping",
    experience: "2+ years",
    projects: 30,
  },
  {
    id: "8",
    name: "Tailwind CSS",
    category: "frontend",
    level: "expert",
    icon: "💨",
    color: "#06B6D4",
    description: "Utility-first CSS framework",
    experience: "2+ years",
    projects: 22,
  },
  {
    id: "9",
    name: "GSAP",
    category: "frontend",
    level: "advanced",
    icon: "🎭",
    color: "#88CE02",
    description: "Professional-grade animation library",
    experience: "1+ years",
    projects: 10,
  },
  {
    id: "10",
    name: "React Native",
    category: "mobile",
    level: "intermediate",
    icon: "📱",
    color: "#61DAFB",
    description: "Cross-platform mobile development",
    experience: "1+ years",
    projects: 6,
  },
];

const categoryIcons = {
  frontend: <Code className="w-4 h-4" />,
  backend: <Settings className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  tools: <Settings className="w-4 h-4" />,
  design: <Palette className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
};

const levelColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-orange-500",
  expert: "bg-red-500",
};

export default function SkillsPage() {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme];

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const draggablesRef = useRef<Draggable[]>([]);

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || skill.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Clean up function for draggables
  const cleanupDraggables = useCallback(() => {
    draggablesRef.current.forEach((draggable) => {
      if (draggable) {
        draggable.kill();
      }
    });
    draggablesRef.current = [];
  }, []);

  // Set ref for skill card
  const setSkillRef = useCallback(
    (skillId: string, element: HTMLDivElement | null) => {
      if (element) {
        skillRefs.current.set(skillId, element);
      } else {
        skillRefs.current.delete(skillId);
      }
    },
    []
  );

  const resetPositions = () => {
    filteredSkills.forEach((skill) => {
      const ref = skillRefs.current.get(skill.id);
      if (ref) {
        gsap.to(ref, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      }
    });
  };

  // Initialize draggables
  useEffect(() => {
    if (viewMode === "grid") {
      // Clean up existing draggables first
      cleanupDraggables();

      // Create new draggables for current filtered skills
      const newDraggables: Draggable[] = [];

      filteredSkills.forEach((skill) => {
        const ref = skillRefs.current.get(skill.id);
        if (ref) {
          const draggable = Draggable.create(ref, {
            type: "x,y",
            edgeResistance: 0.65,
            bounds: containerRef.current,
            inertia: true,
            onDragStart: () => {
              setIsDragging(true);
              gsap.to(ref, {
                scale: 1.1,
                rotation: Math.random() * 10 - 5,
                zIndex: 1000,
                duration: 0.2,
              });
            },
            onDragEnd: () => {
              setIsDragging(false);
              gsap.to(ref, {
                scale: 1,
                rotation: 0,
                zIndex: 1,
                duration: 0.3,
              });
            },
          })[0];

          if (draggable) {
            newDraggables.push(draggable);
          }
        }
      });

      draggablesRef.current = newDraggables;
    } else {
      // Clean up draggables when switching to list view
      cleanupDraggables();
    }

    return cleanupDraggables;
  }, [viewMode, filteredSkills, cleanupDraggables]);

  // Animate cards on mount and filter change
  useEffect(() => {
    // Get only the refs that exist for current filtered skills
    const validRefs = filteredSkills
      .map((skill) => skillRefs.current.get(skill.id))
      .filter((ref) => ref !== undefined) as HTMLDivElement[];

    if (validRefs.length > 0) {
      // Kill any existing animations on these elements
      gsap.killTweensOf(validRefs);

      gsap.fromTo(
        validRefs,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [filteredSkills, viewMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupDraggables();
      // Kill all GSAP animations
      gsap.killTweensOf("*");
    };
  }, [cleanupDraggables]);

  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => (
    <div
      ref={(el) => setSkillRef(skill.id, el)}
      className={`
        skill-card group relative overflow-hidden rounded-xl border-[1px] ${
          currentTheme.border
        }
        ${
          currentTheme.background
        } shadow-lg hover:shadow-xl transition-all duration-300
        ${
          viewMode === "grid"
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-pointer"
        }
        ${isDragging ? "pointer-events-none" : ""}
        ${currentTheme.hover}
      `}
      style={{
        background: `linear-gradient(135deg, ${skill.color}10, transparent)`,
        border: `1px solid ${currentTheme.primary}`,
      }}
    >
      {/* Floating effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-1000"
      />

      <div
        className={`p-6 ${
          viewMode === "list" ? "flex items-center space-x-4" : ""
        }`}
      >
        {/* Skill Icon */}
        <div
          className={`
          flex items-center justify-center rounded-lg text-2xl font-bold
          ${
            viewMode === "grid"
              ? "w-16 h-16 mb-4 mx-auto"
              : "w-12 h-12 flex-shrink-0"
          }
        `}
          style={{ backgroundColor: `${skill.color}20`, color: skill.color }}
        >
          {skill.icon}
        </div>

        <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
          {/* Header */}
          <div
            className={`${
              viewMode === "list"
                ? "flex items-center justify-between"
                : "text-center mb-4"
            }`}
          >
            <div>
              <h3 className={`text-xl font-bold ${currentTheme.text} mb-1`}>
                {skill.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={currentTheme.accent}>
                  {categoryIcons[skill.category]}
                </span>
                <span
                  className={`text-sm ${currentTheme.textSecondary} capitalize`}
                >
                  {skill.category}
                </span>
              </div>
            </div>

            {viewMode === "list" && (
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${levelColors[skill.level]}`}
                />
                <span
                  className={`text-sm font-medium capitalize ${currentTheme.text}`}
                >
                  {skill.level}
                </span>
              </div>
            )}
          </div>

          {/* Level indicator for grid view */}
          {viewMode === "grid" && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className={`w-3 h-3 rounded-full ${levelColors[skill.level]}`}
              />
              <span
                className={`text-sm font-medium capitalize ${currentTheme.text}`}
              >
                {skill.level}
              </span>
            </div>
          )}

          {/* Description */}
          <p className={`${currentTheme.textSecondary} text-sm mb-3`}>
            {skill.description}
          </p>

          {/* Stats */}
          <div
            className={`${
              viewMode === "list" ? "flex items-center gap-6" : "space-y-2"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className={`text-sm ${currentTheme.textSecondary}`}>
                {skill.experience}
              </span>
            </div>
            {skill.projects && (
              <div className="flex items-center gap-2">
                <ExternalLink className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className={`text-sm ${currentTheme.textSecondary}`}>
                  {skill.projects} projects
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div
        className="absolute inset-0 border-2 border-transparent group-hover:border-current 
                      rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-20"
        style={{ borderColor: skill.color }}
      />
    </div>
  );

  return (
    <div
      className={`min-h-screen ${currentTheme.background} transition-colors py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-4`}
          >
            My Skills
          </h1>
          <p
            className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto`}
          >
            A comprehensive overview of my technical expertise and creative
            abilities.
            {viewMode === "grid" && " Drag the cards around to explore!"}
          </p>
        </div>

        {/* Controls */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 mb-8 p-4 border-2
                        ${currentTheme.background} rounded-xl shadow-lg ${currentTheme.border}`}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`}
            />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${currentTheme.border} 
                         rounded-lg ${currentTheme.backgroundSecondary} ${currentTheme.text}
                         focus:${currentTheme.ring} focus:border-transparent transition-all duration-200`}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 ${currentTheme.border} rounded-lg
                         ${currentTheme.backgroundSecondary} ${currentTheme.text} transition-all duration-200`}
            >
              <option value="all">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="design">Design</option>
              <option value="mobile">Mobile</option>
              <option value="tools">Tools</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={`px-3 py-2 ${currentTheme.border} rounded-lg
                         ${currentTheme.backgroundSecondary} ${currentTheme.text} transition-all duration-200`}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* View Mode & Reset */}
          <div className="flex items-center gap-2">
            {viewMode === "grid" && (
              <button
                onClick={resetPositions}
                className={`p-2 ${currentTheme.textSecondary} ${currentTheme.hover} 
                           transition-colors rounded-lg`}
                title="Reset positions"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}

            <div
              className={`flex ${currentTheme.backgroundSecondary} rounded-lg p-1`}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? `${currentTheme.background} ${currentTheme.accent} shadow-sm`
                    : `${currentTheme.textSecondary} ${currentTheme.hover}`
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? `${currentTheme.background} ${currentTheme.accent} shadow-sm`
                    : `${currentTheme.textSecondary} ${currentTheme.hover}`
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Skills Count */}
        <div className="mb-6">
          <p className={currentTheme.textSecondary}>
            Showing {filteredSkills.length} of {skills.length} skills
          </p>
        </div>

        {/* Skills Container */}
        <div
          ref={containerRef}
          className={`
            ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
            ${viewMode === "grid" ? "min-h-screen" : ""}
          `}
        >
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                No skills found
              </h3>
              <p className={currentTheme.textSecondary}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className={`${currentTheme.background} rounded-xl p-6 text-center border-2 shadow-lg ${currentTheme.border} ${currentTheme.hover} transition-all duration-300`}
          >
            <div className={`text-3xl font-bold ${currentTheme.accent} mb-2`}>
              {skills.length}
            </div>
            <div className={currentTheme.textSecondary}>Total Skills</div>
          </div>

          <div
            className={`${currentTheme.background} rounded-xl p-6 text-center shadow-lg border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-300`}
          >
            <div className="text-3xl font-bold text-green-600 mb-2">
              {skills.filter((s) => s.level === "expert").length}
            </div>
            <div className={currentTheme.textSecondary}>Expert Level</div>
          </div>

          <div
            className={`${currentTheme.background} rounded-xl p-6 text-center shadow-lg border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-300`}
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {skills.reduce((acc, skill) => acc + (skill.projects || 0), 0)}
            </div>
            <div className={currentTheme.textSecondary}>Total Projects</div>
          </div>

          <div
            className={`${currentTheme.background} rounded-xl p-6 text-center shadow-lg border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-300`}
          >
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {new Set(skills.map((s) => s.category)).size}
            </div>
            <div className={currentTheme.textSecondary}>Categories</div>
          </div>
        </div>

        {/* Category Overview */}
        <div className="mt-16">
          <h2
            className={`text-3xl font-bold ${currentTheme.text} mb-8 text-center`}
          >
            Skills by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) {
                  acc[skill.category] = [];
                }
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, Skill[]>)
            ).map(([category, categorySkills]) => (
              <div
                key={category}
                className={`${currentTheme.background} rounded-xl p-6 shadow-lg hover:shadow-xl 
                           transition-all duration-300 group cursor-pointer border-2 border-dotted ${currentTheme.border}
                           ${currentTheme.hover}`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 ${currentTheme.backgroundSecondary} rounded-lg group-hover:scale-110 
                                  transition-transform duration-300`}
                  >
                    <span className={currentTheme.accent}>
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-semibold ${currentTheme.text} capitalize`}
                  >
                    {category}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={currentTheme.textSecondary}>Skills</span>
                    <span className={`font-medium ${currentTheme.text}`}>
                      {categorySkills.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={currentTheme.textSecondary}>
                      Expert Level
                    </span>
                    <span className={`font-medium ${currentTheme.text}`}>
                      {
                        categorySkills.filter((s) => s.level === "expert")
                          .length
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={currentTheme.textSecondary}>Projects</span>
                    <span className={`font-medium ${currentTheme.text}`}>
                      {categorySkills.reduce(
                        (acc, skill) => acc + (skill.projects || 0),
                        0
                      )}
                    </span>
                  </div>
                </div>

                {/* Skill preview */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {categorySkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className={`text-xs px-2 py-1 ${currentTheme.backgroundSecondary} rounded-full
                                 ${currentTheme.textSecondary}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                  {categorySkills.length > 3 && (
                    <span
                      className={`text-xs px-2 py-1 ${currentTheme.backgroundSecondary} rounded-full
                                     ${currentTheme.textSecondary} opacity-70`}
                    >
                      +{categorySkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div
            className={`bg-gradient-to-r ${currentTheme.gradient} rounded-2xl p-8 text-white shadow-2xl`}
          >
            <h2 className="text-3xl font-bold mb-4">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Ready to bring your ideas to life with these skills?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className={`px-6 py-3 bg-white ${currentTheme.accent} rounded-lg font-semibold
                                 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl
                                 transform hover:scale-105`}
              >
                View Projects
              </button>
              <button
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold
                                 hover:bg-white hover:text-gray-900 transition-all duration-300
                                 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
