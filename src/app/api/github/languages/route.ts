import { NextResponse } from "next/server";
import { cachedFetch } from "@/lib/cache";

export async function GET() {
  try {
    const repos = await cachedFetch(
      "https://api.github.com/users/Mxpea/repos?per_page=100&sort=updated",
      3600000
    ) as { language: string | null }[];

    const counts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
    });

    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([lang]) => lang);

    return NextResponse.json(top);
  } catch (e) {
    console.error("Languages error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
