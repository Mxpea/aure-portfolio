export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=30&sort=updated&direction=desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch repos");
    const data = await res.json();
    // Filter out forks and sort by created_at descending
    return data
      .filter((repo: GitHubRepo) => !repo.fork)
      .sort((a: GitHubRepo, b: GitHubRepo) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 8); // Limit to 8 repos
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Fetch contribution data from GitHub (approximate using events)
export interface ContributionDay {
  date: string;
  count: number;
}

export async function fetchGitHubContributions(username: string): Promise<ContributionDay[]> {
  try {
    // Use GitHub events API to get recent activity
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) throw new Error("Failed to fetch events");
    const events = await res.json();

    // Count contributions by date
    const contributions: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 365 days with 0
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      contributions[dateStr] = 0;
    }

    // Count events by date
    events.forEach((event: { type: string; created_at: string }) => {
      if (
        event.type === "PushEvent" ||
        event.type === "CreateEvent" ||
        event.type === "PullRequestEvent" ||
        event.type === "IssuesEvent"
      ) {
        const dateStr = event.created_at.split("T")[0];
        if (contributions[dateStr] !== undefined) {
          contributions[dateStr]++;
        }
      }
    });

    // Convert to array
    return Object.entries(contributions)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
}
