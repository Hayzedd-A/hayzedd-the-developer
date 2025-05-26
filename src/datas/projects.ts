import { Project } from "@/types/types.index";

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
    image: "/projects/belab.png",
    images: [
      "/projects/netflix.jpg",
      "/projects/newsletter.png",
      "/projects/schoolApp.png",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://your-ecommerce.vercel.app",
    category: "personal",
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "/projects/bookStore.png",
    images: [
      "/projects/netflix.jpg",
      "/projects/newsletter.png",
      "/projects/schoolApp.png",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Socket.io",
    ],
    githubUrl: "https://github.com/yourusername/taskapp",
    liveUrl: "https://your-taskapp.vercel.app",
    category: "client",
    featured: true,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description:
      "Beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "/projects/calendar.png",
    images: [
      "/projects/netflix.jpg",
      "/projects/newsletter.png",
      "/projects/schoolApp.png",
    ],
    technologies: ["Vue.js", "TypeScript", "Chart.js", "OpenWeather API"],
    githubUrl: "https://github.com/yourusername/weather",
    liveUrl: "https://your-weather.vercel.app",
    category: "personal",
    featured: false,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    title: "Corporate Website Redesign",
    description:
      "Complete redesign and development of a corporate website with modern UI/UX, SEO optimization, and CMS integration.",
    image: "/projects/cron-manager.png",
    images: [
      "/projects/netflix.jpg",
      "/projects/newsletter.png",
      "/projects/schoolApp.png",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Strapi", "Vercel"],
    liveUrl: "https://corporate-client.com",
    category: "client",
    featured: true,
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    title: "Social Media Analytics",
    description:
      "Analytics dashboard for social media metrics with real-time data visualization and automated reporting features.",
    image: "/projects/d-dhub.png",
    images: [
      "/projects/netflix.jpg",
      "/projects/newsletter.png",
      "/projects/schoolApp.png",
    ],
    technologies: ["React", "D3.js", "Node.js", "Redis", "PostgreSQL"],
    githubUrl: "https://github.com/yourusername/analytics",
    liveUrl: "https://social-analytics.vercel.app",
    category: "personal",
    featured: false,
    createdAt: "2024-05-12",
  },
  {
    id: "6",
    title: "Restaurant Management System",
    description:
      "Complete restaurant management solution with POS system, inventory management, and customer ordering platform.",
    image: "/projects/esovew.png",
    images: [
      "/projects/netflix.jpg",
      "/projects/newsletter.png",
      "/projects/schoolApp.png",
    ],
    technologies: ["React Native", "Node.js", "MongoDB", "Express", "Stripe"],
    liveUrl: "https://restaurant-client.com",
    category: "client",
    featured: false,
    createdAt: "2024-06-18",
  },
];
