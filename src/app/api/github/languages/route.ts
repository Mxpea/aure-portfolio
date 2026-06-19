import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json([], { status: 500 });
  }

  try {
    const res = await fetch(
      "https://api.github.com/users/Mxpea/repos?per_page=100&sort=updated",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }

    const repos = (await res.json()) as { language: string | null }[];
    const counts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
    });

    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([lang]) => lang);

    return NextResponse.json(top);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
