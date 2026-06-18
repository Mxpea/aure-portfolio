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

export async function fetchTopLanguages(username: string, limit = 2): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch repos");
    const repos = await res.json();

    const counts: Record<string, number> = {};
    repos.forEach((repo: { language: string | null }) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([lang]) => lang);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

// Fetch contribution data from GitHub GraphQL API (accurate)
export interface ContributionDay {
  date: string;
  count: number;
}

export async function fetchGitHubContributions(username: string): Promise<ContributionDay[]> {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  // If token available, use GraphQL API for accurate data
  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }`,
        }),
        next: { revalidate: 1800 },
      });

      if (!res.ok) throw new Error("GraphQL request failed");
      const data = await res.json();
      const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

      if (weeks) {
        const days: ContributionDay[] = [];
        weeks.forEach((week: { contributionDays: { date: string; contributionCount: number }[] }) => {
          week.contributionDays.forEach((day) => {
            days.push({ date: day.date, count: day.contributionCount });
          });
        });
        return days;
      }
    } catch (error) {
      console.error("GraphQL contribution fetch failed, falling back to events:", error);
    }
  }

  // Fallback: use events API (limited, approximate)
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) throw new Error("Failed to fetch events");
    const events = await res.json();

    const contributions: Record<string, number> = {};
    const now = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      contributions[date.toISOString().split("T")[0]] = 0;
    }

    events.forEach((event: { type: string; created_at: string }) => {
      if (["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type)) {
        const dateStr = event.created_at.split("T")[0];
        if (contributions[dateStr] !== undefined) contributions[dateStr]++;
      }
    });

    return Object.entries(contributions)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
}
