import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  
  if (!token) {
    console.error("GITHUB_TOKEN not found");
    return NextResponse.json(
      { error: "no_token", message: "GITHUB_TOKEN not set" },
      { status: 500 }
    );
  }

  console.log("GITHUB_TOKEN found, length:", token.length, "starts with:", token.substring(0, 4));

  try {
    const res = await fetch(
      "https://api.github.com/users/Mxpea/repos?per_page=30&sort=updated&direction=desc",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("GitHub API error:", res.status, text);
      return NextResponse.json(
        { error: `github_${res.status}`, message: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "fetch_failed", message: String(e) },
      { status: 500 }
    );
  }
}
