export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: "personal" | "client" | "other";
  featured: boolean;
  createdAt: string;
}

export interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  total_commits: number;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  email: string;
  blog: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  fork: boolean;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
}

export interface GitHubLanguageStats {
  [language: string]: number;
}

export interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export type Theme = "blue" | "purple" | "green" | "orange";
export type ViewMode = "grid" | "list";
