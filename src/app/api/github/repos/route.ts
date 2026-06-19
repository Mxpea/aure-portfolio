import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `bearer ${token}`;

    const res = await fetch(
      "https://api.github.com/users/Mxpea/repos?per_page=30&sort=updated&direction=desc",
      { headers }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("GitHub API error:", res.status, text);
      return NextResponse.json({ error: res.status, message: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("GitHub repos error:", e);
    return NextResponse.json({ error: "fetch_failed", message: String(e) }, { status: 500 });
  }
}
