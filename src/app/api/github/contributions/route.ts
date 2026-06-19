import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

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
            user(login: "Mxpea") {
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
      });

      if (res.ok) {
        const data = await res.json();
        const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
        if (weeks) {
          const days: { date: string; count: number }[] = [];
          weeks.forEach((week: { contributionDays: { date: string; contributionCount: number }[] }) => {
            week.contributionDays.forEach((day) => {
              days.push({ date: day.date, count: day.contributionCount });
            });
          });
          return NextResponse.json(days);
        }
      }
    } catch {
      // fall through to events API
    }
  }

  // Fallback: events API
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token) headers.Authorization = `bearer ${token}`;

    const res = await fetch(
      "https://api.github.com/users/Mxpea/events/public?per_page=100",
      { headers }
    );

    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }

    const events = (await res.json()) as { type: string; created_at: string }[];
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

    return NextResponse.json(
      Object.entries(contributions)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
