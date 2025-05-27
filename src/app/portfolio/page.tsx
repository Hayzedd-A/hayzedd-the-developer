"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import { projects } from "@/datas/projects";
import { Project, Theme } from "@/types/types.index";
import Image from "next/image";
import Link from "next/link";
import ProjectModal from "@/app/components/ProjectModal";
import {
  CalendarIcon,
  CodeSquareIcon,
  ExternalLinkIcon,
  EyeIcon,
  FolderIcon,
  GithubIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

type ProjectCategory = "all" | "personal" | "client";

const Portfolio = () => {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme];
  const [activeTab, setActiveTab] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter projects based on active tab
  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return projects;
    return projects.filter((project) => project.category === activeTab);
  }, [activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    const personalProjects = projects.filter((p) => p.category === "personal");
    const clientProjects = projects.filter((p) => p.category === "client");
    const featuredProjects = projects.filter((p) => p.featured);

    return {
      total: projects.length,
      personal: personalProjects.length,
      client: clientProjects.length,
      featured: featuredProjects.length,
    };
  }, []);

  const tabs = [
    { id: "all", label: "All Projects", icon: FolderIcon, count: stats.total },
    {
      id: "personal",
      label: "Personal",
      icon: UserIcon,
      count: stats.personal,
    },
    { id: "client", label: "Client Work", icon: StarIcon, count: stats.client },
  ];

  const statsCards = [
    {
      label: "Total Projects",
      value: stats.total,
      icon: FolderIcon,
      color: "blue",
    },
    {
      label: "Personal Projects",
      value: stats.personal,
      icon: UserIcon,
      color: "green",
    },
    {
      label: "Client Projects",
      value: stats.client,
      icon: StarIcon,
      color: "purple",
    },
    {
      label: "Featured",
      value: stats.featured,
      icon: StarIcon,
      color: "orange",
    },
  ];

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.background} transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-4`}
          >
            My Portfolio
          </h1>
          <p
            className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}
          >
            A collection of projects I've worked on, showcasing my skills in
            full-stack development, UI/UX design, and modern web technologies.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${currentTheme.background} border ${currentTheme.border} rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${currentTheme.primary} mb-3`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${currentTheme.text} mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${currentTheme.textSecondary}`}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProjectCategory)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? `${currentTheme.primary} text-white shadow-lg`
                    : `${currentTheme.background} ${currentTheme.text} border ${currentTheme.border} ${currentTheme.hover}`
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : `${currentTheme.primary} text-white`
                  }`}
                >
                  {tab.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                theme={theme}
                onProjectClick={handleProjectClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FolderIcon
              className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`}
            />
            <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
              No projects found
            </h3>
            <p className={`${currentTheme.textSecondary}`}>
              No projects match the current filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  index: number;
  theme: Theme;
  onProjectClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  theme,
  onProjectClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
    const { currentThemes } = useTheme();
    const currentTheme = currentThemes[theme]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`${currentTheme.background} border ${currentTheme.border} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
      onClick={() => onProjectClick(project)}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${currentTheme.primary} text-white`}
            >
              <StarIcon className="w-3 h-3 mr-1" />
              Featured
            </span>
          </div>
        )}

        {/* Quick Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-3 right-3 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {project.category === "personal" && project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors duration-200"
                >
                  <GithubIcon className="w-4 h-4" />
                </Link>
              )}
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors duration-200"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Details Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg"
              >
                <span className={`text-sm font-medium ${currentTheme.text}`}>
                  Click to view details
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3
            className={`text-xl font-semibold ${currentTheme.text} group-hover:${currentTheme.accent} transition-colors duration-200`}
          >
            {project.title}
          </h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${currentTheme.border} ${currentTheme.textSecondary} capitalize`}
          >
            {project.category}
          </span>
        </div>

        <p
          className={`${currentTheme.textSecondary} text-sm mb-4 line-clamp-3`}
        >
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 text-xs rounded-md ${currentTheme.hover} ${currentTheme.textSecondary}`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span
              className={`px-2 py-1 text-xs rounded-md ${currentTheme.textSecondary}`}
            >
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {project.category === "personal" && project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 ${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors duration-200`}
              >
                <CodeSquareIcon className="w-4 h-4" />
              </Link>
            )}
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 ${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors duration-200`}
              >
                <EyeIcon className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;
