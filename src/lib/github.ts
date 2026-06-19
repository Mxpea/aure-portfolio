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
    const res = await fetch("/api/github/repos");
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) {
      console.error("GitHub repos error:", data);
      return [];
    }
    return data
      .filter((repo: GitHubRepo) => !repo.fork)
      .sort((a: GitHubRepo, b: GitHubRepo) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 8);
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch("/api/github/user");
    const data = await res.json();
    if (!res.ok || !data?.login) {
      console.error("GitHub user error:", data);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchTopLanguages(username: string, limit = 2): Promise<string[]> {
  try {
    const res = await fetch("/api/github/languages");
    if (!res.ok) throw new Error("Failed to fetch languages");
    return await res.json();
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

export interface ContributionDay {
  date: string;
  count: number;
}

export async function fetchGitHubContributions(username: string): Promise<ContributionDay[]> {
  try {
    const res = await fetch("/api/github/contributions");
    if (!res.ok) throw new Error("Failed to fetch contributions");
    return await res.json();
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
}
