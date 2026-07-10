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

export interface ContributionDay {
  date: string;
  count: number;
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch("/api/github/repos");
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) {
      console.error("GitHub repos error:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

export async function fetchUser(): Promise<GitHubUser | null> {
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

export async function fetchTopLanguages(): Promise<string[]> {
  try {
    const res = await fetch("/api/github/languages");
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) {
      console.error("GitHub languages error:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

export async function fetchContributions(): Promise<ContributionDay[]> {
  try {
    const res = await fetch("/api/github/contributions");
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) {
      console.error("GitHub contributions error:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
}
