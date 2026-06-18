import { NextResponse } from "next/server";
import { cachedFetch, cachedPost } from "@/lib/cache";

export async function GET() {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (token) {
    try {
      const data = await cachedPost(
        "https://api.github.com/graphql",
        {
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
        },
        1800000 // 30 min
      ) as { data?: { user?: { contributionsCollection?: { contributionCalendar?: { weeks?: { contributionDays: { date: string; contributionCount: number }[] }[] } } } } };

      const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
      if (weeks) {
        const days: { date: string; count: number }[] = [];
        weeks.forEach((week) => {
          week.contributionDays.forEach((day) => {
            days.push({ date: day.date, count: day.contributionCount });
          });
        });
        return NextResponse.json(days);
      }
    } catch (e) {
      // fall through
    }
  }

  // Fallback: events API
  try {
    const events = await cachedFetch(
      "https://api.github.com/users/Mxpea/events/public?per_page=100",
      1800000
    ) as { type: string; created_at: string }[];

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

    const result = Object.entries(contributions)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(result);
  } catch (e) {
    console.error("Contributions error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
