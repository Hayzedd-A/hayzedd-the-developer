import {
  GitHubUser,
  GitHubRepo,
  GitHubLanguageStats,
} from "@/types/types.index";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_USERNAME = "hayzedd-a"; // Replace with your actual GitHub username

class GitHubService {
  private async fetchWithErrorHandling(url: string) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Uncomment and add your GitHub token for higher rate limits
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("GitHub API fetch error:", error);
      throw error;
    }
  }

  async getUserProfile(): Promise<GitHubUser> {
    return this.fetchWithErrorHandling(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`
    );
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    const repos = await this.fetchWithErrorHandling(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );
    return repos.filter(
      (repo: GitHubRepo) => !repo.name.includes(GITHUB_USERNAME)
    );
  }

  async getLanguageStats(): Promise<GitHubLanguageStats> {
    const repos = await this.getUserRepos();
    const languageStats: GitHubLanguageStats = {};

    // Get language data for each repo (limited to avoid rate limits)
    const topRepos = repos.slice(0, 20); // Limit to top 20 repos

    for (const repo of topRepos) {
      try {
        const languages = await this.fetchWithErrorHandling(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/languages`
        );

        Object.entries(languages).forEach(([language, bytes]) => {
          languageStats[language] =
            (languageStats[language] || 0) + (bytes as number);
        });
      } catch (error) {
        // Skip repos that can't be accessed
        console.warn(`Could not fetch languages for ${repo.name}`);
      }
    }

    return languageStats;
  }

  async getContributionData(): Promise<any> {
    // GitHub's contribution graph requires GraphQL API with authentication
    // For demo purposes, we'll generate realistic mock data
    return this.generateRealisticContributionData();
  }

  private generateRealisticContributionData() {
    const contributions = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // More realistic contribution pattern
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = this.isHoliday(date);

      let baseChance = isWeekend ? 0.3 : 0.7;
      if (isHoliday) baseChance *= 0.2;

      const hasContribution = Math.random() < baseChance;
      const count = hasContribution ? Math.floor(Math.random() * 8) + 1 : 0;
      const level =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

      contributions.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      });
    }

    return contributions;
  }

  private isHoliday(date: Date): boolean {
    const month = date.getMonth();
    const day = date.getDate();

    // Simple holiday detection (Christmas, New Year, etc.)
    return (
      (month === 11 && day >= 24 && day <= 26) || // Christmas
      (month === 0 && day === 1) || // New Year
      (month === 6 && day === 4)
    ); // July 4th
  }

  async getTopRepositories(limit: number = 6): Promise<GitHubRepo[]> {
    const repos = await this.getUserRepos();
    return repos
      .filter((repo) => !repo.fork) // Exclude forked repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  }

  async getRecentActivity(): Promise<any[]> {
    try {
      const events = await this.fetchWithErrorHandling(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=10`
      );
      return events;
    } catch (error) {
      return [];
    }
  }
}

export const githubService = new GitHubService();
export { GITHUB_USERNAME };
