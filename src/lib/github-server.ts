import { GITHUB_USERNAME, GITHUB_API_BASE } from "./config";

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

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "aure-portfolio",
  };
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) headers.Authorization = `bearer ${token}`;
  return headers;
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

async function postGraphQL<T>(query: string): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}/graphql`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const data = await fetchAPI<GitHubRepo[]>(
    `/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated&direction=desc`
  );
  return data
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);
}

export async function fetchUser(): Promise<GitHubUser> {
  return fetchAPI<GitHubUser>(`/users/${GITHUB_USERNAME}`);
}

export async function fetchTopLanguages(limit = 2): Promise<string[]> {
  const repos = await fetchAPI<GitHubRepo[]>(
    `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
  );
  const counts: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([lang]) => lang);
}

export async function fetchContributions(): Promise<ContributionDay[]> {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (token) {
    try {
      const data = await postGraphQL<{
        data?: {
          user?: {
            contributionsCollection?: {
              contributionCalendar?: {
                weeks?: { contributionDays: { date: string; contributionCount: number }[] }[];
              };
            };
          };
        };
      }>(`{
        user(login: "${GITHUB_USERNAME}") {
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
      }`);

      const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
      if (weeks) {
        const days: ContributionDay[] = [];
        weeks.forEach((week) => {
          week.contributionDays.forEach((day) => {
            days.push({ date: day.date, count: day.contributionCount });
          });
        });
        return days;
      }
    } catch {
      // fall through to events API
    }
  }

  // Fallback: events API
  const events = await fetchAPI<{ type: string; created_at: string }[]>(
    `/users/${GITHUB_USERNAME}/events/public?per_page=100`
  );

  const contributions: Record<string, number> = {};
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    contributions[date.toISOString().split("T")[0]] = 0;
  }

  events.forEach((event) => {
    if (["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type)) {
      const dateStr = event.created_at.split("T")[0];
      if (contributions[dateStr] !== undefined) contributions[dateStr]++;
    }
  });

  return Object.entries(contributions)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
